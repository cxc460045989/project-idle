/**
 * 怪物配置表 - MonsterConfig
 * 
 * 配置所有怪物的基础属性和掉落信息
 * 第一个轮回世界：生化危机风格的丧尸世界
 * 共 10 个小关卡，怪物难度递增
 */

export const MonsterConfig = {
    /**
     * 怪物基础模板
     * key: 模板键名 (用于关卡配置中引用)
     * value: 怪物模板详情
     */
    templates: {
        // ==================== 普通感染者系列 ====================
        infected_crawler: {
            id: 1001,           // 怪物 ID (唯一标识)
            name: "爬行者",      // 怪物名称
            desc: "变异的感染者，四肢着地快速移动",  // 怪物描述
            baseStats: {        // 基础属性
                str: 8,         // 力量 (影响物理攻击)
                int: 2,         // 智力 (影响魔法攻击)
                con: 6,         // 体质 (影响防御和生命)
                agi: 12,        // 敏捷 (影响速度和暴击)
                level: 1        // 基础等级
            },
            exp: 15,            // 击败后获得的经验值
            skills: [1001],     // 技能 ID 数组 (引用 SkillConfig)
            dropGroup: 1        // 掉落组 ID (引用 DropTableConfig)
        },
        infected_walker: {
            id: 1002,           // 怪物 ID
            name: "行尸",        // 怪物名称
            desc: "最常见的丧尸，行动缓慢但数量众多",
            baseStats: {
                str: 10,
                int: 1,
                con: 8,
                agi: 5,
                level: 1
            },
            exp: 10,            // 经验值
            skills: [1001],     // 技能
            dropGroup: 1        // 掉落组
        },
        infected_runner: {
            id: 1003,
            name: "狂奔者",
            desc: "保留了部分运动能力的感染者",
            baseStats: {
                str: 9,
                int: 3,
                con: 7,
                agi: 14,
                level: 1
            },
            exp: 20,
            skills: [1001, 1002],
            dropGroup: 1
        },

        // ==================== 变异体系列 ====================
        mutant_bloater: {
            id: 2001,
            name: "肿胀者",
            desc: "体内充满毒气的变异体",
            baseStats: {
                str: 15,
                int: 2,
                con: 20,
                agi: 4,
                level: 1
            },
            exp: 35,
            skills: [1003],
            dropGroup: 2
        },
        mutant_lurker: {
            id: 2002,
            name: "潜伏者",
            desc: "善于隐藏的变异杀手",
            baseStats: {
                str: 12,
                int: 5,
                con: 10,
                agi: 16,
                level: 1
            },
            exp: 30,
            skills: [1001, 1004],
            dropGroup: 2
        },
        mutant_howler: {
            id: 2003,
            name: "嚎叫者",
            desc: "能发出刺耳叫声引来同伴",
            baseStats: {
                str: 10,
                int: 8,
                con: 12,
                agi: 10,
                level: 1
            },
            exp: 25,
            skills: [1005],
            dropGroup: 2
        },

        // ==================== 腐化者系列 ====================
        corrupted_brute: {
            id: 3001,
            name: "暴君",
            desc: "肌肉极度膨胀的恐怖存在",
            baseStats: {
                str: 25,
                int: 3,
                con: 25,
                agi: 6,
                level: 1
            },
            exp: 60,
            skills: [1006, 1001],
            dropGroup: 3
        },
        corrupted_witch: {
            id: 3002,
            name: "巫毒",
            desc: "被黑暗力量腐蚀的感染者",
            baseStats: {
                str: 8,
                int: 20,
                con: 10,
                agi: 12,
                level: 1
            },
            exp: 55,
            skills: [1007, 1008],
            dropGroup: 3
        },

        // ==================== Boss 系列 ====================
        boss_necromancer: {
            id: 9001,
            name: "死灵之主",
            desc: "控制丧尸群的神秘存在",
            baseStats: {
                str: 15,
                int: 30,
                con: 25,
                agi: 15,
                level: 1
            },
            exp: 200,
            skills: [1007, 1009, 1010],
            dropGroup: 4
        },
        boss_tyrant_king: {
            id: 9002,
            name: "暴君之王",
            desc: "所有变异体的终极形态",
            baseStats: {
                str: 40,
                int: 10,
                con: 45,
                agi: 12,
                level: 1
            },
            exp: 250,
            skills: [1006, 1011, 1012],
            dropGroup: 4
        }
    },

    /**
     * 关卡怪物配置
     * 定义每个关卡出现的怪物种类和数量
     */
    levels: [
        // level: 关卡编号 (从 1 开始)
        // monsters: 怪物数组
        //   - template: 怪物模板键名 (引用 templates 中的 key)
        //   - count: 该怪物的数量
        //   - levelOffset: 等级偏移 (0=基础等级，1=基础等级 +1)
        { level: 1, monsters: [
            { template: "infected_walker", count: 1, levelOffset: 0 }
        ]},
        { level: 2, monsters: [
            { template: "infected_walker", count: 1, levelOffset: 0 },
            { template: "infected_crawler", count: 1, levelOffset: 0 }
        ]},
        { level: 3, monsters: [
            { template: "infected_runner", count: 2, levelOffset: 0 }
        ]},
        { level: 4, monsters: [
            { template: "infected_walker", count: 2, levelOffset: 1 },
            { template: "infected_crawler", count: 1, levelOffset: 1 }
        ]},
        { level: 5, monsters: [
            { template: "mutant_bloater", count: 1, levelOffset: 0 }
        ]},
        { level: 6, monsters: [
            { template: "mutant_lurker", count: 2, levelOffset: 0 }
        ]},
        { level: 7, monsters: [
            { template: "infected_runner", count: 2, levelOffset: 2 },
            { template: "mutant_howler", count: 1, levelOffset: 0 }
        ]},
        { level: 8, monsters: [
            { template: "mutant_bloater", count: 1, levelOffset: 2 },
            { template: "mutant_lurker", count: 2, levelOffset: 1 }
        ]},
        { level: 9, monsters: [
            { template: "corrupted_brute", count: 1, levelOffset: 0 }
        ]},
        { level: 10, monsters: [
            { template: "boss_necromancer", count: 1, levelOffset: 0 }
        ]}
    ],

    /**
     * 获取怪物实例
     * @param {string} templateKey - 模板键名 (如 "infected_walker")
     * @param {number} levelOffset - 等级偏移
     * @returns {Object} 怪物实例对象
     */
    getMonsterInstance: function(templateKey, levelOffset) {
        const template = this.templates[templateKey];
        if (!template) return null;

        return {
            ...template,
            level: template.baseStats.level + levelOffset,
            currentHp: 0,  // 当前生命值 (战斗时初始化)
            maxHp: 0       // 最大生命值 (战斗时计算)
        };
    }
};
