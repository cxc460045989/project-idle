// 实体管理模块 - EntityManager.js

import { StatCalculator } from './StatCalculator.js';
import { SkillConfig } from '../config/SkillConfig.js';
import { ItemConfig } from '../config/ItemConfig.js';
import { MonsterConfig } from '../config/MonsterConfig.js';
import { CombatConfig } from '../config/CombatConfig.js';
import { Utils } from './Utils.js';
import { checkLevelUp } from './ExpSystem.js';

export const EntityManager = {
    createPlayer: function(playerData) {
        // 兼容旧存档格式（baseStats 对象）和新格式（分开的属性）
        // 优先使用分开的属性，如果没有则从 baseStats 读取
        const hasSeparateStats = playerData.str !== undefined || playerData.int !== undefined || playerData.con !== undefined || playerData.agi !== undefined;
        const hasBaseStats = playerData.baseStats !== undefined;

        const baseStats = {
            str: hasSeparateStats ? (playerData.str || 5) : (hasBaseStats ? (playerData.baseStats?.str || 5) : 5),
            int: hasSeparateStats ? (playerData.int || 5) : (hasBaseStats ? (playerData.baseStats?.int || 5) : 5),
            con: hasSeparateStats ? (playerData.con || 5) : (hasBaseStats ? (playerData.baseStats?.con || 5) : 5),
            agi: hasSeparateStats ? (playerData.agi || 5) : (hasBaseStats ? (playerData.baseStats?.agi || 5) : 5),
            level: hasSeparateStats ? (playerData.level || 1) : (hasBaseStats ? (playerData.baseStats?.level || 1) : 1)
        };

        const stats = StatCalculator.calculateFullStats(baseStats);

        return {
            id: playerData.id || 'player',
            name: playerData.name || '主角',
            type: 'player',
            baseStats,
            stats,
            currentHp: stats.maxHp,
            currentResource: stats.maxResource,
            skills: playerData.skills || SkillConfig.getPlayerStarterSkills(),
            equipment: playerData.equipment || { weapon: null, armor: null, accessory: null },
            buffs: [],
            isDead: false,
            statPoints: playerData.statPoints !== undefined ? playerData.statPoints : 10,
            gold: playerData.gold !== undefined ? playerData.gold : 500,
            exp: playerData.exp !== undefined ? playerData.exp : 0,
            constitution: playerData.constitution || null
        };
    },

    // 添加经验值，返回升级信息 { leveledUp: boolean, newLevel: number, rewards: object }
    addExp: function(player, expAmount) {
      player.exp += expAmount
      const levelUpInfo = checkLevelUp(player.exp, player.baseStats.level)
      
      if (levelUpInfo.canLevelUp) {
        // 升级！应用奖励
        player.baseStats.level = levelUpInfo.newLevel
        player.statPoints += levelUpInfo.rewards.statPoints
        player.stats.pAtk += levelUpInfo.rewards.pAtkBonus
        player.stats.def += levelUpInfo.rewards.defBonus
        player.stats.maxHp += levelUpInfo.rewards.hpBonus
        player.stats.maxResource += levelUpInfo.rewards.resourceBonus
        
        // HP/MP 回满
        player.currentHp = player.stats.maxHp
        player.currentResource = player.stats.maxResource
        
        return {
          leveledUp: true,
          newLevel: levelUpInfo.newLevel,
          rewards: levelUpInfo.rewards
        }
      }
      
      return { leveledUp: false, newLevel: player.baseStats.level, rewards: null }
    },
    
    createMonster: function(templateKey, levelOffset = 0, difficulty = 'normal') {
        const template = MonsterConfig.templates[templateKey];
        if (!template) return null;

        const baseStats = { ...template.baseStats, level: template.baseStats.level + levelOffset };
        const stats = StatCalculator.calculateFullStats(baseStats);

        // 难度系数：普通=1.0, 困难=2.0
        const difficultyMultiplier = difficulty === 'hard' ? 2.0 : 1.0
        
        // 根据怪物类型调整血量
        // 普通怪物：+20%, 精英：+50%, Boss: +150%
        const isBoss = template.id >= 9000
        const isElite = template.id >= 3000 && template.id < 9000
        let hpMultiplier = 1.0
        
        if (isBoss) {
            hpMultiplier = 2.5  // Boss +150%
        } else if (isElite) {
            hpMultiplier = 1.5  // 精英 +50%
        } else {
            hpMultiplier = 1.2  // 普通 +20%
        }

        return {
            id: template.id,
            name: template.name,
            desc: template.desc,
            type: 'monster',
            baseStats,
            stats: {
                ...stats,
                maxHp: Math.floor(stats.maxHp * hpMultiplier * difficultyMultiplier)
            },
            currentHp: Math.floor(stats.maxHp * hpMultiplier * difficultyMultiplier),
            currentResource: stats.maxResource,
            skills: template.skills,
            dropGroup: template.dropGroup,
            exp: template.exp || 10,
            buffs: [],
            isDead: false,
            templateKey,
            instanceId: Utils.generateId(),
            difficulty // 记录难度
        };
    },

    createLevelMonsters: function(worldId, level, difficulty = 'normal') {
        const levelConfig = MonsterConfig.levels[level - 1];
        if (!levelConfig) return [];

        const monsters = [];
        for (const monsterEntry of levelConfig.monsters) {
            for (let i = 0; i < monsterEntry.count; i++) {
                const monster = this.createMonster(monsterEntry.template, monsterEntry.levelOffset, difficulty);
                if (monster) monsters.push(monster);
            }
        }
        return monsters;
    },
    
    applyEquipment: function(player) {
        let bonusStats = { str: 0, int: 0, con: 0, agi: 0, atk: 0, def: 0, hp: 0, crit: 0 };
        
        for (const slot in player.equipment) {
            const equipId = player.equipment[slot];
            if (equipId) {
                const item = ItemConfig.getItem(equipId);
                if (item?.baseStats) {
                    for (const stat in item.baseStats) {
                        if (bonusStats[stat] !== undefined) bonusStats[stat] += item.baseStats[stat];
                    }
                }
            }
        }
        
        const baseStats = { ...player.baseStats };
        baseStats.str += bonusStats.str;
        baseStats.int += bonusStats.int;
        baseStats.con += bonusStats.con;
        baseStats.agi += bonusStats.agi;
        
        const stats = StatCalculator.calculateFullStats(baseStats);
        stats.pAtk += bonusStats.atk;
        stats.def += bonusStats.def;
        stats.maxHp += bonusStats.hp;
        stats.critRate += bonusStats.crit;
        
        player.stats = stats;
        player.currentHp = Math.min(player.currentHp, stats.maxHp);
        return player;
    },
    
    takeDamage: function(entity, damage) {
        entity.currentHp = Math.max(0, entity.currentHp - damage);
        if (entity.currentHp <= 0) entity.isDead = true;
        return entity.currentHp;
    },
    
    takeHeal: function(entity, healAmount) {
        const oldHp = entity.currentHp;
        entity.currentHp = Math.min(entity.stats.maxHp, entity.currentHp + healAmount);
        return entity.currentHp - oldHp;
    },
    
    regenerateResource: function(entity, amount) {
        const oldResource = entity.currentResource;
        entity.currentResource = Math.min(entity.stats.maxResource, entity.currentResource + amount);
        return entity.currentResource - oldResource;
    },
    
    onTurnStart: function(entity) {
        const regenAmount = Math.floor(entity.stats.maxResource * CombatConfig.REGEN_RATE_PER_TURN);
        this.regenerateResource(entity, regenAmount);
        if (entity.buffs?.length > 0) {
            entity.buffs = entity.buffs.filter(buff => {
                buff.duration--;
                return buff.duration > 0;
            });
        }
    },
    
    addBuff: function(entity, buffType, value, duration) {
        if (!entity.buffs) entity.buffs = [];
        entity.buffs = entity.buffs.filter(b => b.type !== buffType);
        entity.buffs.push({ type: buffType, value, duration });
    },
    
    isAlive: function(entity) {
        return !entity.isDead && entity.currentHp > 0;
    },
    
    resetEntity: function(entity) {
        entity.currentHp = entity.stats.maxHp;
        entity.currentResource = entity.stats.maxResource;
        entity.isDead = false;
        entity.buffs = [];
        return entity;
    }
};
