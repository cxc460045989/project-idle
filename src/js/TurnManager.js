// 即时战斗管理器 - RealtimeBattleManager.js
// 基于速度的即时战斗系统

import { CombatConfig } from '../config/CombatConfig.js';
import { SkillConfig } from '../config/SkillConfig.js';
import { StatCalculator } from './StatCalculator.js';
import { EntityManager } from './EntityManager.js';
import { Utils } from './Utils.js';

export class TurnManager {
    constructor() {
        this.battleData = null;
        this.currentState = null;
        this.isProcessing = false;
        this.battleSpeed = 1;
        this.autoMode = true;
        this.attackTimers = {}; // 每个实体的攻击计时器
        this.skillCooldowns = {}; // 技能 CD
    }

    State = {
        INIT: 'init',
        FIGHTING: 'fighting',
        BATTLE_END: 'battle_end'
    };

    // 攻击间隔计算 - 速度越快，攻击间隔越短
    // 公式：基础间隔 2000ms / (1 + 速度 * 0.1)
    calculateAttackInterval(speed) {
        const baseInterval = 2000; // 基础攻击间隔 2 秒
        const speedFactor = 1 + (speed * 0.1);
        return baseInterval / speedFactor;
    }

    init(player, monsters, levelInfo) {
        this.battleData = {
            player: EntityManager.createPlayer(player),
            monsters,
            levelInfo,
            log: [],
            result: null,
            lastAttackTime: {}, // 记录每个实体上次攻击时间
            skillCooldowns: {} // 技能 CD 结束时间
        };

        EntityManager.applyEquipment(this.battleData.player);
        
        // 进入战斗时 HP/MP 回满（修复 applyEquipment 后 currentHp 未同步的问题）
        this.battleData.player.currentHp = this.battleData.player.stats.maxHp;
        this.battleData.player.currentResource = this.battleData.player.stats.maxResource;
        
        this.currentState = this.State.INIT;
        this.isProcessing = false;
        this.battleSpeed = 1;
        this.autoMode = CombatConfig.AUTO_BATTLE_DEFAULT;

        // 初始化攻击时间为当前时间，这样第一次攻击需要等待一个完整的攻击间隔
        const now = Date.now();
        this.battleData.lastAttackTime['player'] = now;
        monsters.forEach((m, idx) => {
            // 怪物错开初始攻击时间，避免同时攻击
            this.battleData.lastAttackTime[m.instanceId || m.id] = now - (idx * 200);
        });

        this.log('战斗开始！');
        return this.battleData;
    }

    async startBattle() {
        this.currentState = this.State.FIGHTING;
        
        const startTime = Date.now();
        
        // 主循环 - 持续检查战斗状态
        while (this.currentState !== this.State.BATTLE_END) {
            const currentTime = Date.now();
            
            // 检查玩家攻击
            await this.tryAttack(this.battleData.player, 'player', currentTime);
            
            // 检查怪物攻击
            for (const monster of this.battleData.monsters) {
                if (!monster.isDead) {
                    await this.tryAttack(monster, monster.instanceId || monster.id, currentTime);
                }
            }
            
            // 检查战斗结束条件
            await this.checkBattleEnd();
            
            // 短暂延迟，避免 CPU 占用过高
            await Utils.delay(50 / this.battleSpeed);
        }

        return this.battleData.result;
    }

    async tryAttack(entity, entityId, currentTime) {
        const lastAttack = this.battleData.lastAttackTime[entityId] || 0;
        const speed = entity.stats.speed;
        const attackInterval = this.calculateAttackInterval(speed);

        // 检查是否可以攻击
        if (currentTime - lastAttack >= attackInterval) {
            // 执行攻击
            await this.executeAttack(entity, entityId);
            this.battleData.lastAttackTime[entityId] = currentTime;
        }
    }

    async executeAttack(attacker, attackerId) {
        if (attacker.isDead) return;

        // 选择目标
        let targets;
        let isPlayer = attackerId === 'player';
        
        if (isPlayer) {
            // 玩家攻击：选择存活的怪物
            targets = this.battleData.monsters.filter(m => !m.isDead);
        } else {
            // 怪物攻击：目标是玩家
            targets = [this.battleData.player];
        }

        if (targets.length === 0) return;

        // 选择技能
        const skillId = isPlayer ? this.selectPlayerSkill(attacker) : this.selectMonsterSkill(attacker);
        const skill = SkillConfig.getSkill(skillId);

        // 检查资源是否足够
        if (attacker.currentResource < skill.cost) {
            // 资源不够，使用普攻（技能 ID 1000，消耗 0）
            return;
        }

        // 执行技能
        await this.executeSkill(attacker, skill, isPlayer, targets);
    }

    selectPlayerSkill(player) {
        if (this.autoMode) {
            // 自动模式：选择第一个能放得起的技能
            for (const skillId of player.skills) {
                const skill = SkillConfig.getSkill(skillId);
                if (skill && player.currentResource >= skill.cost) return skillId;
            }
        }
        // 手动模式或没有技能可用时，使用普攻
        return 1000;
    }

    selectMonsterSkill(monster) {
        const availableSkills = monster.skills || [];
        if (availableSkills.length === 0) return 1001;

        const available = availableSkills.filter(sid => {
            const skill = SkillConfig.getSkill(sid);
            return skill && monster.currentResource >= skill.cost;
        });

        return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : availableSkills[0];
    }

    async executeSkill(attacker, skill, isPlayer, targets) {
        if (!skill) skill = SkillConfig.getSkill(1000);

        this.log(`${attacker.name} 使用 ${skill.name}`);

        // 消耗资源
        if (skill.cost > 0) {
            attacker.currentResource = Math.max(0, attacker.currentResource - skill.cost);
        }

        // 记录技能 CD
        if (skill.cd > 0) {
            const cdTime = skill.cd * 1000; // CD 转换为毫秒
            // 可以在这里记录 CD 用于 UI 显示
        }

        // 根据技能目标类型执行
        if (skill.target === 'single_enemy') {
            await this.executeSingleSkill(attacker, skill, isPlayer, targets);
        } else if (skill.target === 'all_enemies') {
            await this.executeAoESkill(attacker, skill, isPlayer, targets);
        } else if (skill.target === 'self') {
            await this.executeSelfSkill(attacker, skill);
        } else if (skill.damageType === 'heal') {
            await this.executeHealSkill(attacker, skill);
        }

        await Utils.delay(100 / this.battleSpeed);
    }

    async executeSingleSkill(attacker, skill, isPlayer, targets) {
        if (targets.length === 0) return;

        // 选择血量最低的目标
        const target = targets.reduce((min, t) => t.currentHp < min.currentHp ? t : min);
        const damageResult = this.calculateDamage(attacker, target, skill);

        EntityManager.takeDamage(target, damageResult.damage);

        if (skill.effect && damageResult.isHit) {
            this.applySkillEffect(target, skill.effect);
        }
        
        // 立即检查战斗是否结束
        await this.checkBattleEnd();
    }

    async executeAoESkill(attacker, skill, isPlayer, targets) {
        for (const target of targets) {
            const damageResult = this.calculateDamage(attacker, target, skill);
            EntityManager.takeDamage(target, damageResult.damage);
            
            // 每次伤害后检查战斗是否结束
            await this.checkBattleEnd();
            if (this.currentState === this.State.BATTLE_END) break;
            
            await Utils.delay(100 / this.battleSpeed);
        }
    }

    async executeSelfSkill(attacker, skill) {
        if (skill.effect) {
            this.applySkillEffect(attacker, skill.effect);
            this.log(`${attacker.name} 获得了 ${skill.effect.type} 效果`);
        }
    }

    async executeHealSkill(attacker, skill) {
        const healAmount = StatCalculator.calculateHeal(attacker.stats.mAtk, skill.skillCoeff, attacker.stats.int);
        EntityManager.takeHeal(attacker, healAmount);
        this.log(`${attacker.name} 恢复了 ${healAmount} 点生命值`);
    }

    calculateDamage(attacker, defender, skill) {
        const critRate = attacker.stats.critRate;
        const critDmg = attacker.stats.critDmg;
        
        // 判断是否是怪物攻击（怪物攻击玩家时 isMonster = true）
        const isMonster = attacker.type === 'monster';

        if (skill.damageType === 'physical') {
            return StatCalculator.calculatePhysicalDamage(
                attacker.stats.pAtk, skill.skillCoeff, defender.stats.def, critRate, critDmg, skill.hitRate, isMonster
            );
        } else if (skill.damageType === 'magic') {
            return StatCalculator.calculateMagicDamage(
                attacker.stats.mAtk, skill.skillCoeff, defender.stats.res, critRate, critDmg, skill.hitRate, isMonster
            );
        }
        return { damage: 0, isCrit: false, isHit: true };
    }

    applySkillEffect(target, effect) {
        if (!effect) return;
        EntityManager.addBuff(target, effect.type, effect.value, effect.duration);
    }

    async checkBattleEnd() {
        const player = this.battleData.player;
        const monsters = this.battleData.monsters;

        const playerAlive = EntityManager.isAlive(player);
        const monstersAlive = monsters.some(m => EntityManager.isAlive(m));

        // 如果怪物都死了，无论玩家是否存活，都判定为胜利
        if (!monstersAlive) {
            this.battleData.result = { win: true, reason: 'all_enemies_defeated' };
            this.currentState = this.State.BATTLE_END;
            this.log('战斗胜利！');
        } else if (!playerAlive) {
            // 只有玩家死亡但怪物还活着时才判定为失败
            this.battleData.result = { win: false, reason: 'player_dead' };
            this.currentState = this.State.BATTLE_END;
            this.log('战斗失败！');
        }
    }

    // 手动释放技能（玩家点击技能按钮时调用）
    playerUseSkill(skillId) {
        if (this.currentState !== this.State.FIGHTING) return false;

        const player = this.battleData.player;
        const skill = SkillConfig.getSkill(skillId);

        if (!skill || player.currentResource < skill.cost) return false;

        // 立即执行技能
        const targets = this.battleData.monsters.filter(m => !m.isDead);
        if (targets.length === 0) return false;

        this.executeSkill(player, skill, true, targets);
        return true;
    }

    toggleSpeed() {
        this.battleSpeed = this.battleSpeed === 1 ? 2 : 1;
        return this.battleSpeed;
    }

    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        return this.autoMode;
    }

    log(message) {
        this.battleData.log.push({ message, time: Date.now() });
    }

    getBattleData() {
        return this.battleData;
    }

    // 获取技能 CD 状态（用于 UI 显示）
    getSkillCooldown(skillId) {
        const skill = SkillConfig.getSkill(skillId);
        if (!skill || skill.cd <= 0) return 0;
        
        // 这里可以扩展为记录实际 CD 时间
        return 0;
    }
}
