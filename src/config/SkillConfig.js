/**
 * 技能配置表 - SkillConfig
 * 
 * 配置所有技能的效果和参数
 * 技能类型说明:
 * - active: 主动技能 (需要消耗资源，有 CD)
 * - passive: 被动技能 (自动生效)
 * 
 * 目标类型说明:
 * - single_enemy: 单个敌人
 * - all_enemies: 全体敌人
 * - self: 自身
 */

export const SkillConfig = {
    /**
     * 技能数据库
     * key: 技能 ID (唯一标识)
     * value: 技能详情
     */
    skills: {
        // ==================== 怪物技能 ====================
        /** 普通攻击 - 基础攻击技能 */
        1000: { 
            id: 1000,                       // 技能 ID
            name: "普通攻击",                // 技能名称
            desc: "基础的物理攻击",          // 技能描述
            type: "active",                 // 技能类型：active=主动，passive=被动
            target: "single_enemy",         // 目标类型：single_enemy=单个敌人，all_enemies=全体，self=自身
            damageType: "physical",         // 伤害类型：physical=物理，magic=魔法，heal=治疗，none=无伤害
            skillCoeff: 1.0,                // 技能系数 (1.0 = 100% 攻击力，>1 为增强，<1 为减弱)
            cost: 0,                        // 资源消耗 (0=免费)
            cd: 0,                          // 冷却时间 (回合数，0=无 CD)
            hitRate: 0.95                   // 命中率 (0.95 = 95%)
        },
        /** 撕咬 - 丧尸基础技能 */
        1001: { id: 1001, name: "撕咬", desc: "用锋利的牙齿撕咬敌人", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 1.2, cost: 0, cd: 0, hitRate: 0.9 },
        /** 扑击 - 快速攻击技能 */
        1002: { id: 1002, name: "扑击", desc: "快速扑向敌人造成伤害", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 1.5, cost: 5, cd: 2, hitRate: 0.85 },
        /** 毒气爆炸 - 全体魔法攻击 */
        1003: { id: 1003, name: "毒气爆炸", desc: "引爆体内毒气，对全体造成伤害", type: "active", target: "all_enemies", damageType: "magic", skillCoeff: 1.3, cost: 15, cd: 4, hitRate: 0.8 },
        /** 背刺 - 高暴击单体攻击 */
        1004: { id: 1004, name: "背刺", desc: "从背后发动致命一击", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 1.8, cost: 10, cd: 3, hitRate: 0.75, bonusCrit: 0.2 },  // bonusCrit: 额外暴击率
        /** 刺耳嚎叫 - 全体 Debuff 技能 */
        1005: { id: 1005, name: "刺耳嚎叫", desc: "发出嚎叫降低敌人防御", type: "active", target: "all_enemies", damageType: "magic", skillCoeff: 0.8, cost: 12, cd: 4, hitRate: 0.9, effect: { type: "def_down", value: 0.2, duration: 3 } },  // effect: 附加效果，def_down=防御降低，value=降低比例，duration=持续回合
        /** 重击 - 高伤害单体攻击 */
        1006: { id: 1006, name: "重击", desc: "用巨大的力量重击敌人", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 2.0, cost: 15, cd: 3, hitRate: 0.85 },
        /** 暗影箭 - 魔法攻击 */
        1007: { id: 1007, name: "暗影箭", desc: "发射黑暗能量箭矢", type: "active", target: "single_enemy", damageType: "magic", skillCoeff: 1.6, cost: 12, cd: 2, hitRate: 0.9 },
        /** 虚弱诅咒 - 单体 Debuff */
        1008: { id: 1008, name: "虚弱诅咒", desc: "诅咒敌人降低其攻击力", type: "active", target: "single_enemy", damageType: "magic", skillCoeff: 0.5, cost: 15, cd: 5, hitRate: 0.8, effect: { type: "atk_down", value: 0.25, duration: 3 } },  // atk_down=攻击降低
        /** 亡灵召唤 - 召唤技能 */
        1009: { id: 1009, name: "亡灵召唤", desc: "召唤亡灵助战", type: "active", target: "self", damageType: "none", skillCoeff: 0, cost: 25, cd: 6, hitRate: 1.0, effect: { type: "summon", value: 1, duration: 3 } },  // summon=召唤，value=召唤数量
        /** 死亡凋零 - 全体持续伤害 */
        1010: { id: 1010, name: "死亡凋零", desc: "大范围死亡魔法，持续伤害", type: "active", target: "all_enemies", damageType: "magic", skillCoeff: 1.2, cost: 30, cd: 5, hitRate: 0.85 },
        /** 狂暴 - 自身 Buff */
        1011: { id: 1011, name: "狂暴", desc: "进入狂暴状态，提升攻击力", type: "active", target: "self", damageType: "none", skillCoeff: 0, cost: 20, cd: 5, hitRate: 1.0, effect: { type: "atk_up", value: 0.4, duration: 3 } },  // atk_up=攻击提升
        /** 毁灭一击 - 超高伤害单体技能 */
        1012: { id: 1012, name: "毁灭一击", desc: "倾尽全力的毁灭性攻击", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 3.0, cost: 40, cd: 6, hitRate: 0.8 },

        // ==================== 玩家技能 ====================
        /** 斩击 - 玩家基础物理技能 */
        2001: { id: 2001, name: "斩击", desc: "基础的剑术攻击", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 1.3, cost: 5, cd: 1, hitRate: 0.95 },
        /** 火球术 - 玩家基础魔法技能 */
        2002: { id: 2002, name: "火球术", desc: "发射一枚火球", type: "active", target: "single_enemy", damageType: "magic", skillCoeff: 1.5, cost: 10, cd: 2, hitRate: 0.9 },
        /** 治疗术 - 回复技能 */
        2003: { id: 2003, name: "治疗术", desc: "恢复自身生命值", type: "active", target: "self", damageType: "heal", skillCoeff: 0.8, cost: 15, cd: 4, hitRate: 1.0 },  // heal=治疗，skillCoeff=治疗系数
        /** 连击 - 多次攻击 */
        2004: { id: 2004, name: "连击", desc: "连续攻击两次", type: "active", target: "single_enemy", damageType: "physical", skillCoeff: 0.8, cost: 12, cd: 3, hitRate: 0.9, extraAttacks: 2 },  // extraAttacks: 额外攻击次数
        /** 烈焰风暴 - 全体魔法攻击 */
        2005: { id: 2005, name: "烈焰风暴", desc: "对全体敌人造成火焰伤害", type: "active", target: "all_enemies", damageType: "magic", skillCoeff: 1.0, cost: 25, cd: 5, hitRate: 0.85 }
    },

    /**
     * 获取技能信息
     * @param {number} skillId - 技能 ID
     * @returns {Object|null} 技能配置对象，不存在返回 null
     */
    getSkill: function(skillId) {
        return this.skills[skillId] || null;
    },

    /**
     * 获取玩家初始技能
     * @returns {Array} 玩家初始技能 ID 数组
     */
    getPlayerStarterSkills: function() {
        return [2001, 2002, 2003];  // 斩击、火球术、治疗术
    }
};
