/**
 * 掉落配置表 - DropTableConfig
 * 
 * 用于配置不同掉落组的物品掉落概率和数量
 * 掉落组 (dropGroup) 由怪物配置引用，决定该怪物掉落哪些物品
 */

export const DropTableConfig = {
    /**
     * 掉落组配置
     * key: 掉落组 ID (由怪物配置的 dropGroup 字段引用)
     * value: 掉落组详情
     */
    dropGroups: {
        1: {
            // 第 1 掉落组 - 适用于低阶怪物
            items: [
                // itemIds: 物品 ID 数组，支持多个物品共享同一掉落配置
                // baseRate: 基础掉落概率 (1.0 = 100%, 0.5 = 50%)
                // minCount: 最小掉落数量
                // maxCount: 最大掉落数量
                // qualityLock: 品质锁定 (0=普通，1=优秀，2=史诗，3=传说)，用于过滤
                { itemIds: [1001], baseRate: 1.0, minCount: 10, maxCount: 30, qualityLock: 0 },
                { itemIds: [2001, 2002], baseRate: 0.4, minCount: 1, maxCount: 1, qualityLock: 0 },
                { itemIds: [2003, 2004], baseRate: 0.15, minCount: 1, maxCount: 1, qualityLock: 1 },
                { itemIds: [3001], baseRate: 0.08, minCount: 1, maxCount: 2, qualityLock: 0 }
            ]
        },
        2: {
            // 第 2 掉落组 - 适用于中阶怪物
            items: [
                { itemIds: [1001], baseRate: 1.0, minCount: 20, maxCount: 50, qualityLock: 0 },
                { itemIds: [2003, 2004], baseRate: 0.5, minCount: 1, maxCount: 1, qualityLock: 0 },
                { itemIds: [2005, 2006], baseRate: 0.2, minCount: 1, maxCount: 1, qualityLock: 2 },
                { itemIds: [3001], baseRate: 0.15, minCount: 2, maxCount: 3, qualityLock: 0 },
                { itemIds: [4001], baseRate: 0.1, minCount: 1, maxCount: 1, qualityLock: 0 }
            ]
        },
        3: {
            // 第 3 掉落组 - 适用于高阶怪物
            items: [
                { itemIds: [1001], baseRate: 1.0, minCount: 30, maxCount: 60, qualityLock: 0 },
                { itemIds: [2005, 2006], baseRate: 0.4, minCount: 1, maxCount: 1, qualityLock: 1 },
                { itemIds: [2007, 2008], baseRate: 0.15, minCount: 1, maxCount: 1, qualityLock: 3 },
                { itemIds: [3002], baseRate: 0.2, minCount: 1, maxCount: 1, qualityLock: 0 },
                { itemIds: [4001], baseRate: 0.2, minCount: 2, maxCount: 3, qualityLock: 0 }
            ]
        },
        4: {
            // 第 4 掉落组 - 适用于 Boss 级怪物
            items: [
                { itemIds: [1001], baseRate: 1.0, minCount: 50, maxCount: 100, qualityLock: 0 },
                { itemIds: [2005, 2006], baseRate: 0.6, minCount: 1, maxCount: 2, qualityLock: 1 },
                { itemIds: [2007, 2008], baseRate: 0.3, minCount: 1, maxCount: 1, qualityLock: 2 },
                { itemIds: [3002], baseRate: 0.5, minCount: 2, maxCount: 3, qualityLock: 0 },
                { itemIds: [4002], baseRate: 0.4, minCount: 1, maxCount: 1, qualityLock: 0 },
                { itemIds: [5001], baseRate: 0.1, minCount: 1, maxCount: 1, qualityLock: 0 }
            ]
        }
    },

    /**
     * 世界修正系数
     * key: 世界 ID
     * value: 掉落率修正系数 (1.0 = 无修正，>1.0 增加掉落率，<1.0 降低掉落率)
     */
    worldModifiers: { 
        1: 1.0  // 世界 1：无修正
        // 2: 1.2  // 世界 2：掉落率 +20% (示例)
        // 3: 1.5  // 世界 3：掉落率 +50% (示例)
    },

    /**
     * 计算掉落物品
     * @param {number} dropGroupId - 掉落组 ID，对应 dropGroups 中的 key
     * @param {number} playerLuck - 玩家幸运值，影响掉落率 (每点幸运 +0.1% 掉落率)
     * @param {number} worldId - 世界 ID，用于应用世界修正系数
     * @returns {Array} 掉落物品数组 [{ itemId, count, qualityLock }]
     */
    calculateDrop: function(dropGroupId, playerLuck = 0, worldId = 1) {
        const group = this.dropGroups[dropGroupId];
        if (!group) return [];

        const drops = [];
        const worldMod = this.worldModifiers[worldId] || 1.0;  // 世界修正
        const luckMod = 1 + (playerLuck * 0.001);  // 幸运修正 (每点 +0.1%)

        for (const dropItem of group.items) {
            for (const itemId of dropItem.itemIds) {
                const finalRate = dropItem.baseRate * worldMod * luckMod;  // 最终掉落率
                if (Math.random() <= finalRate) {
                    // 在 minCount 和 maxCount 之间随机决定数量
                    const count = Math.floor(Math.random() * (dropItem.maxCount - dropItem.minCount + 1)) + dropItem.minCount;
                    drops.push({ itemId, count, qualityLock: dropItem.qualityLock });
                }
            }
        }
        return drops;
    }
};
