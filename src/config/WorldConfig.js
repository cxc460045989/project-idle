/**
 * 世界配置表 - WorldConfig
 * 
 * 配置所有轮回世界的信息和关卡设置
 * 每个世界包含多个关卡，关卡难度递增
 */

import { MonsterConfig } from './MonsterConfig.js';

export const WorldConfig = {
    /**
     * 世界配置
     * key: 世界 ID
     * value: 世界详情
     */
    worlds: {
        1: {
            id: 1,                    // 世界 ID (唯一标识)
            name: "生化废土",          // 世界名称
            desc: "被病毒感染的世界，到处都是丧尸和变异体",  // 世界描述
            levels: 10,               // 关卡数量
            difficulty: 1.0,          // 难度系数 (1.0=基础难度，>1.0 更难)
            dropGroupBase: 1,         // 基础掉落组 ID (引用 DropTableConfig)
            unlocked: true,           // 是否已解锁 (true=已解锁，false=未解锁)
            themeColor: "#8b0000"     // 主题颜色 (用于 UI 显示，深红色)
        },
        2: {
            id: 2,
            name: "魔法学院",
            desc: "充满魔法与神秘生物的世界",
            levels: 10,               // 关卡数量
            difficulty: 1.5,          // 难度系数 (1.5 倍难度)
            dropGroupBase: 2,         // 基础掉落组 ID
            unlocked: false,          // 初始未解锁
            themeColor: "#4b0082"     // 主题颜色 (靛蓝色)
        },
        3: {
            id: 3,
            name: "机械迷城",
            desc: "被机械生命体统治的未来都市",
            levels: 10,               // 关卡数量
            difficulty: 2.0,          // 难度系数 (2.0 倍难度)
            dropGroupBase: 3,         // 基础掉落组 ID
            unlocked: false,          // 初始未解锁
            themeColor: "#2f4f4f"     // 主题颜色 (深灰色)
        }
    },

    /**
     * 获取世界信息
     * @param {number} worldId - 世界 ID
     * @returns {Object|null} 世界配置对象，不存在返回 null
     */
    getWorld: function(worldId) {
        return this.worlds[worldId] || null;
    },

    /**
     * 获取关卡配置
     * @param {number} worldId - 世界 ID
     * @param {number} level - 关卡编号 (从 1 开始)
     * @returns {Object|null} 关卡配置对象
     */
    getLevelConfig: function(worldId, level) {
        const world = this.worlds[worldId];
        if (!world || level < 1 || level > world.levels) return null;

        return {
            worldId,                              // 世界 ID
            level,                                // 关卡编号
            isElite: level % 5 === 0 && level !== 10,  // 是否精英关 (每 5 关且非 Boss 关)
            isBoss: level === 10,                 // 是否 Boss 关 (第 10 关)
            monsterConfig: MonsterConfig.levels[level - 1]  // 怪物配置 (从 MonsterConfig 读取)
        };
    },

    /**
     * 检查世界是否已解锁
     * @param {number} worldId - 世界 ID
     * @returns {boolean} 是否已解锁
     */
    isWorldUnlocked: function(worldId) {
        const world = this.worlds[worldId];
        return world ? world.unlocked : false;
    },

    /**
     * 解锁世界
     * @param {number} worldId - 世界 ID
     */
    unlockWorld: function(worldId) {
        if (this.worlds[worldId]) {
            this.worlds[worldId].unlocked = true;
        }
    }
};
