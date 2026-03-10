/**
 * 物品配置表 - ItemConfig
 * 
 * 物品品质配置和工具方法
 * 物品数据存储在 ItemDatabase 中，本文件只提供品质配置和工具方法
 * 
 * 品质等级说明:
 * - 品质 0 (普通): 白色，基础装备，商店售卖
 * - 品质 1 (优秀): 蓝色，稀有装备，掉落概率 10%
 * - 品质 2 (史诗): 紫色，史诗装备，掉落概率 5%
 * - 品质 3 (传说): 橙色，传奇装备，掉落概率 2%
 */

import { ItemDBAPI } from '../js/ItemDatabase'

export const ItemConfig = {
    /**
     * 品质颜色配置
     * key: 品质等级 (0-3)
     * value: 十六进制颜色代码
     */
    qualityColors: { 
        0: "#FFFFFF",  // 普通品质 - 白色
        1: "#007FFF",  // 优秀品质 - 蓝色
        2: "#800080",  // 史诗品质 - 紫色
        3: "#FFA500"   // 传说品质 - 橙色
    },

    /**
     * 品质名称配置
     * key: 品质等级 (0-3)
     * value: 品质名称
     */
    qualityNames: { 
        0: "普通",    // 普通品质，基础装备
        1: "优秀",    // 优秀品质，稀有装备
        2: "史诗",    // 史诗品质，高级装备
        3: "传说"     // 传说品质，顶级装备
    },

    /**
     * 品质倍率配置
     * 用于计算物品属性加成或掉落概率修正
     * key: 品质等级 (0-3)
     * value: 倍率系数
     */
    qualityMultipliers: { 
        0: 1.0,   // 普通品质 - 基础倍率
        1: 1.5,   // 优秀品质 - 1.5 倍
        2: 2.2,   // 史诗品质 - 2.2 倍
        3: 3.5    // 传说品质 - 3.5 倍
    },

    /**
     * 获取物品信息
     * @param {number} itemId - 物品 ID
     * @returns {Object|null} 物品配置对象，不存在返回 null
     */
    getItem: function (itemId) {
        return ItemDBAPI.getItem(itemId)
    },

    /**
     * 获取品质对应的颜色
     * @param {number} quality - 品质等级 (0-3)
     * @returns {string} 十六进制颜色代码，默认返回白色
     */
    getQualityColor: function (quality) {
        return this.qualityColors[quality] || "#FFFFFF"
    },

    /**
     * 获取品质对应的名称
     * @param {number} quality - 品质等级 (0-3)
     * @returns {string} 品质名称，默认返回"普通"
     */
    getQualityName: function (quality) {
        return this.qualityNames[quality] || "普通"
    },

    /**
     * 重新加载物品缓存
     * 用于重置游戏后刷新缓存
     * @returns {Promise<void>}
     */
    reloadCache: async function() {
        await ItemDBAPI.reloadCache()
    }
}
