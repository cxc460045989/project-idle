// 掉落系统 - DropSystem.js

import { DropTableConfig } from '../config/DropTableConfig.js';
import { ItemConfig } from '../config/ItemConfig.js';
import { ItemDBAPI, DropConfig } from './ItemDatabase.js';

export const DropSystem = {
    /**
     * 计算掉落物品
     * @param {Array} monsters - 怪物数组
     * @param {number} playerLuck - 玩家幸运值
     * @param {number} worldId - 世界 ID
     * @returns {Array} 掉落物品数组 [{itemId, count}]
     */
    calculateDrops: async function(monsters, playerLuck = 0, worldId = 1) {
        const allDrops = [];

        for (const monster of monsters) {
            if (monster.isDead) {
                // 使用新的掉落系统
                const drops = await DropConfig.calculateDrops(worldId);
                allDrops.push(...drops);
            }
        }

        return this.mergeDrops(allDrops);
    },

    mergeDrops: function(drops) {
        const merged = {};
        for (const drop of drops) {
            const key = drop.itemId;
            if (merged[key]) {
                merged[key].count += drop.count;
            } else {
                merged[key] = { ...drop };
            }
        }
        return Object.values(merged);
    },

    getItemInfo: function(itemId) {
        return ItemConfig.getItem(itemId);
    },

    getQualityColor: function(quality) {
        return ItemConfig.getQualityColor(quality);
    },

    getQualityName: function(quality) {
        return ItemConfig.getQualityName(quality);
    },

    formatDropDisplay: function(drop) {
        const item = this.getItemInfo(drop.itemId);
        if (!item) return null;

        return {
            itemId: drop.itemId,
            name: item.name,
            icon: item.icon,
            count: drop.count,
            quality: item.quality,
            qualityColor: this.getQualityColor(item.quality),
            qualityName: this.getQualityName(item.quality),
            type: item.type
        };
    },

    formatDropsDisplay: function(drops) {
        return drops.map(drop => this.formatDropDisplay(drop)).filter(d => d !== null);
    }
};
