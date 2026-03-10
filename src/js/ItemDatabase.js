/**
 * 物品数据库 API 模块
 * 使用 localForage (IndexedDB 封装) 存储物品数据
 */

import localforage from 'localforage'

// 初始化物品数据库
const itemDB = localforage.createInstance({
  name: '轮回异界_物品',
  storeName: 'items',
  description: '轮回异界：放置探索 物品数据表'
})

// 物品缓存
let itemsCache = {}
let isCacheInitialized = false

// 导出缓存对象（用于调试和检查）
export { itemsCache, isCacheInitialized }

/**
 * 清理数据，确保可以被 IndexedDB 序列化
 */
function cleanData(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 物品表 API
 */
export const ItemDBAPI = {
  // 初始化物品表（游戏首次启动时调用）
  async init() {
    const existingItems = await this.getAll()
    // 检查物品数量，如果不足 31 个则重新初始化（添加新物品）
    // 1 金币 + 3 新手装备 + 16 商店装备 + 4 稀有 + 4 史诗 + 4 传说 = 32
    if (existingItems && existingItems.length >= 31) {
      // 更新缓存
      itemsCache = {}
      for (const item of existingItems) {
        itemsCache[item.id] = item
      }
      isCacheInitialized = true
      console.log('[ItemDB] 物品数据库已有', existingItems.length, '个物品，跳过初始化')
      return existingItems
    }

    // 如果已有数据但不足，先清空
    if (existingItems && existingItems.length > 0) {
      await this.clearAll()
      console.log('[ItemDB] 清空旧物品数据，准备重新初始化')
    }

    // 基础物品数据
    const baseItems = [
      // 金币 (消耗品)
      {
        id: 1001,
        name: '金币',
        desc: '通用货币，用于购买物品',
        type: 'consumable',
        quality: 0,
        icon: '💰',
        level: 1
      },

      // 初始装备 - 新手套装 (quality: 0)
      {
        id: 2001,
        name: '新手长剑',
        desc: '新手赠送的长剑，适合近战',
        type: 'weapon',
        weaponType: 'melee',
        quality: 0,
        baseStats: { pAtk: 10, str: 2 },
        icon: '🗡️',
        level: 1
      },
      {
        id: 2002,
        name: '新手护甲',
        desc: '新手赠送的护甲',
        type: 'armor',
        quality: 0,
        baseStats: { def: 5, con: 2, hp: 30 },
        icon: '🦺',
        level: 1
      },
      {
        id: 2101,
        name: '新手戒指',
        desc: '新手赠送的戒指',
        type: 'accessory',
        quality: 0,
        baseStats: { hp: 20, int: 1 },
        icon: '💍',
        level: 1
      },

      // 普通品质武器 (quality: 0) - 商店售卖
      {
        id: 6001,
        name: '铁制长剑',
        desc: '普通的铁制长剑，适合近战',
        type: 'weapon',
        weaponType: 'melee',
        quality: 0,
        baseStats: { pAtk: 15, def: -2, str: 3 },
        icon: '🗡️',
        level: 5,
        price: 500
      },
      {
        id: 6002,
        name: '铁制弓箭',
        desc: '普通的铁制弓箭，适合远程',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 0,
        baseStats: { pAtk: 10, agi: 4, speed: 3 },
        icon: '🏹',
        level: 5,
        price: 500
      },
      {
        id: 6003,
        name: '铁制护甲',
        desc: '普通的铁制护甲',
        type: 'armor',
        quality: 0,
        baseStats: { def: 10, con: 3, hp: 50 },
        icon: '🦺',
        level: 5,
        price: 500
      },
      {
        id: 6004,
        name: '铁制戒指',
        desc: '普通的铁制戒指',
        type: 'accessory',
        quality: 0,
        baseStats: { hp: 30, int: 2 },
        icon: '💍',
        level: 5,
        price: 500
      },
      {
        id: 6101,
        name: '木制短弓',
        desc: '简单的木制弓，适合远程攻击',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 0,
        baseStats: { pAtk: 10, agi: 4, speed: 3 },
        icon: '🏹',
        level: 5,
        price: 500
      },
      {
        id: 6201,
        name: '铁制护甲',
        desc: '基础的铁制护甲',
        type: 'armor',
        quality: 0,
        baseStats: { def: 8, con: 3, hp: 30 },
        icon: '🛡️',
        level: 5,
        price: 500
      },
      {
        id: 6301,
        name: '铁戒指',
        desc: '普通的铁制戒指',
        type: 'accessory',
        quality: 0,
        baseStats: { hp: 20, str: 2 },
        icon: '💍',
        level: 5,
        price: 500
      },

      // 优秀品质武器 (quality: 1) - 商店售卖
      {
        id: 6011,
        name: '钢制战斧',
        desc: '沉重的钢斧，威力强大',
        type: 'weapon',
        weaponType: 'melee',
        quality: 1,
        baseStats: { pAtk: 30, def: -3, str: 6, con: 2 },
        icon: '🪓',
        level: 10,
        price: 1000
      },
      {
        id: 6102,
        name: '精灵长弓',
        desc: '精灵制作的精致长弓',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 1,
        baseStats: { pAtk: 20, agi: 8, speed: 5, critRate: 0.03 },
        icon: '🎯',
        level: 10,
        price: 1000
      },
      {
        id: 6202,
        name: '钢制锁子甲',
        desc: '精钢编织的锁子甲',
        type: 'armor',
        quality: 1,
        baseStats: { def: 18, con: 6, hp: 80, str: 2 },
        icon: '🦺',
        level: 10,
        price: 1000
      },
      {
        id: 6302,
        name: '银吊坠',
        desc: '闪亮的银制吊坠',
        type: 'accessory',
        quality: 1,
        baseStats: { hp: 50, int: 4, agi: 2 },
        icon: '📿',
        level: 10,
        price: 1000
      },

      // 史诗品质武器 (quality: 2) - 商店售卖
      {
        id: 6013,
        name: '秘银战锤',
        desc: '秘银打造的战锤',
        type: 'weapon',
        weaponType: 'melee',
        quality: 2,
        baseStats: { pAtk: 55, def: -5, str: 12, con: 5 },
        icon: '🔨',
        level: 20,
        price: 2000
      },
      {
        id: 6103,
        name: '风语者之弓',
        desc: '能听见风之声的魔弓',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 2,
        baseStats: { pAtk: 40, agi: 15, speed: 8, critRate: 0.06 },
        icon: '🌪️',
        level: 20,
        price: 2000
      },
      {
        id: 6203,
        name: '秘银铠甲',
        desc: '秘银打造的重型铠甲',
        type: 'armor',
        quality: 2,
        baseStats: { def: 35, con: 12, hp: 180, str: 5 },
        icon: '⚔️',
        level: 20,
        price: 2000
      },
      {
        id: 6303,
        name: '翡翠护符',
        desc: '蕴含自然之力的护符',
        type: 'accessory',
        quality: 2,
        baseStats: { hp: 120, con: 8, regen: 3 },
        icon: '🧿',
        level: 20,
        price: 2000
      },

      // 传说品质武器 (quality: 3) - 商店售卖
      {
        id: 6014,
        name: '龙牙巨剑',
        desc: '用龙牙打磨的传说巨剑',
        type: 'weapon',
        weaponType: 'melee',
        quality: 3,
        baseStats: { pAtk: 100, def: -8, str: 25, con: 10, critRate: 0.05 },
        icon: '🐉',
        level: 30,
        price: 4000
      },
      {
        id: 6104,
        name: '星辰陨落',
        desc: '传说能召唤流星的神弓',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 3,
        baseStats: { pAtk: 75, agi: 25, speed: 12, critRate: 0.1 },
        icon: '⭐',
        level: 30,
        price: 4000
      },
      {
        id: 6204,
        name: '龙鳞战甲',
        desc: '用龙鳞编织的神器铠甲',
        type: 'armor',
        quality: 3,
        baseStats: { def: 60, con: 20, hp: 350, str: 10, res: 15 },
        icon: '🐲',
        level: 30,
        price: 4000
      },
      {
        id: 6304,
        name: '龙魂之戒',
        desc: '蕴含龙魂之力的传说戒指',
        type: 'accessory',
        quality: 3,
        baseStats: { hp: 250, str: 12, int: 12, critRate: 0.08 },
        icon: '👑',
        level: 30,
        price: 4000
      },

      // 稀有品质武器 (quality: 1)
      {
        id: 10001,
        name: '钢制长剑',
        desc: '精钢打造的长剑，适合近战',
        type: 'weapon',
        weaponType: 'melee',
        quality: 1,
        baseStats: { pAtk: 30, def: -3, str: 6, con: 2 },
        icon: '🗡️',
        level: 10
      },
      {
        id: 10002,
        name: '钢制弓箭',
        desc: '精钢打造的弓箭，适合远程',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 1,
        baseStats: { pAtk: 20, agi: 8, speed: 5, critRate: 0.03 },
        icon: '🏹',
        level: 10
      },
      {
        id: 10003,
        name: '锁子甲',
        desc: '精铁编织的护甲',
        type: 'armor',
        quality: 1,
        baseStats: { def: 18, con: 6, hp: 80, str: 2 },
        icon: '🦺',
        level: 10
      },
      {
        id: 10004,
        name: '钢制戒指',
        desc: '精钢打造的戒指',
        type: 'accessory',
        quality: 1,
        baseStats: { hp: 50, int: 4, agi: 2 },
        icon: '💍',
        level: 10
      },

      // 史诗品质武器 (quality: 2)
      {
        id: 20001,
        name: '玄铁长剑',
        desc: '玄铁打造的传说长剑',
        type: 'weapon',
        weaponType: 'melee',
        quality: 2,
        baseStats: { pAtk: 55, def: -5, str: 12, con: 5, critRate: 0.05 },
        icon: '⚔️',
        level: 20,
        price: 2000
      },
      {
        id: 20002,
        name: '玄铁弓箭',
        desc: '玄铁打造的传说弓箭',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 2,
        baseStats: { pAtk: 40, agi: 15, speed: 8, critRate: 0.06 },
        icon: '🎯',
        level: 20,
        price: 2000
      },
      {
        id: 20003,
        name: '黄金锁子甲',
        desc: '黄金编织的神器护甲',
        type: 'armor',
        quality: 2,
        baseStats: { def: 35, con: 12, hp: 180, str: 5, res: 10 },
        icon: '🛡️',
        level: 20,
        price: 2000
      },
      {
        id: 20004,
        name: '黄金戒指',
        desc: '黄金打造的神器戒指',
        type: 'accessory',
        quality: 2,
        baseStats: { hp: 120, con: 8, int: 8, critRate: 0.05 },
        icon: '👑',
        level: 20,
        price: 2000
      },

      // 传奇品质武器 (quality: 3) - 新增
      {
        id: 30001,
        name: '屠龙长剑',
        desc: '传奇屠龙者使用的长剑，蕴含龙炎之力',
        type: 'weapon',
        weaponType: 'melee',
        quality: 3,
        baseStats: { pAtk: 80, def: -8, str: 18, con: 8, critRate: 0.08, hp: 100 },
        icon: '🗡️',
        level: 30,
        price: 2000
      },
      {
        id: 30002,
        name: '凤凰神弓',
        desc: '传奇凤凰羽毛制成的神弓，射速极快',
        type: 'weapon',
        weaponType: 'ranged',
        quality: 3,
        baseStats: { pAtk: 60, agi: 22, speed: 12, critRate: 0.1, crit: 0.15 },
        icon: '🏹',
        level: 30,
        price: 2000
      },
      {
        id: 30003,
        name: '泰坦铠甲',
        desc: '传奇泰坦巨人穿着的铠甲，坚不可摧',
        type: 'armor',
        quality: 3,
        baseStats: { def: 55, con: 18, hp: 300, str: 8, res: 20, regen: 5 },
        icon: '🦺',
        level: 30,
        price: 2000
      },
      {
        id: 30004,
        name: '龙晶戒指',
        desc: '传奇龙晶打造的戒指，蕴含强大魔力',
        type: 'accessory',
        quality: 3,
        baseStats: { hp: 200, con: 12, int: 15, critRate: 0.08, res: 15 },
        icon: '💍',
        level: 30,
        price: 2000
      }
    ]

    // 存入数据库
    for (const item of baseItems) {
      await this.save(item)
    }

    console.log('[ItemDB] 初始化完成，共', baseItems.length, '个物品')
    return baseItems
  },

  // 保存物品
  async save(itemData) {
    const key = `item_${itemData.id}`
    const data = {
      ...cleanData(itemData),
      updateTime: Date.now()
    }
    await itemDB.setItem(key, data)
    // 更新缓存
    itemsCache[itemData.id] = data
    return data
  },

  // 读取物品（异步，从数据库）
  async load(itemId) {
    const key = `item_${itemId}`
    const item = await itemDB.getItem(key)
    // 更新缓存
    if (item) itemsCache[itemId] = item
    return item
  },

  // 获取物品（同步，从缓存）
  getItem(itemId) {
    return itemsCache[itemId] || null
  },

  // 重新加载缓存
  async reloadCache() {
    const allItems = await this.getAll()
    itemsCache = {}
    for (const item of allItems) {
      itemsCache[item.id] = item
    }
    isCacheInitialized = true
    console.log('[ItemDB] 缓存已重新加载，共', Object.keys(itemsCache).length, '个物品')
    return itemsCache
  },

  // 根据品质获取物品列表
  async getByQuality(quality) {
    const items = []
    await itemDB.iterate((value, key) => {
      if (key.startsWith('item_') && value.quality === quality) {
        items.push(value)
      }
    })
    return items
  },

  // 根据类型获取物品列表
  async getByType(type) {
    const items = []
    await itemDB.iterate((value, key) => {
      if (key.startsWith('item_') && value.type === type) {
        items.push(value)
      }
    })
    return items
  },

  // 获取所有物品
  async getAll() {
    const items = []
    await itemDB.iterate((value, key) => {
      if (key.startsWith('item_')) {
        items.push(value)
      }
    })
    return items
  },

  // 删除物品
  async delete(itemId) {
    const key = `item_${itemId}`
    await itemDB.removeItem(key)
  },

  // 清空物品表
  async clearAll() {
    await itemDB.clear()
  },

  // 获取物品总数
  async count() {
    let count = 0
    await itemDB.iterate((value, key) => {
      if (key.startsWith('item_')) {
        count++
      }
    })
    return count
  }
}

/**
 * 物品掉落配置
 */
export const DropConfig = {
  // 掉落概率
  RARE_DROP_RATE: 0.10,    // 稀有品质 10%
  EPIC_DROP_RATE: 0.05,    // 史诗品质 5%
  LEGENDARY_DROP_RATE: 0.02, // 传奇品质 2%

  // 每个怪物最大掉落数量
  MAX_DROP_COUNT: 2,

  /**
   * 计算掉落物品
   * @param {number} worldId - 世界 ID（影响掉落品质）
   * @returns {Array} 掉落物品数组 [{itemId, count}]
   */
  async calculateDrops(worldId = 1) {
    const drops = []

    // 随机决定掉落数量 (1-2 件)
    const dropCount = Math.floor(Math.random() * this.MAX_DROP_COUNT) + 1

    for (let i = 0; i < dropCount; i++) {
      const roll = Math.random()
      let quality

      // 根据概率决定品质
      if (roll < this.LEGENDARY_DROP_RATE) {
        quality = 3 // 传奇 (2%)
      } else if (roll < this.LEGENDARY_DROP_RATE + this.EPIC_DROP_RATE) {
        quality = 2 // 史诗 (5%)
      } else if (roll < this.LEGENDARY_DROP_RATE + this.EPIC_DROP_RATE + this.RARE_DROP_RATE) {
        quality = 1 // 稀有 (10%)
      } else {
        continue // 没有掉落
      }

      // 从对应品质中随机选择一个物品
      const items = await ItemDBAPI.getByQuality(quality)
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)]
        drops.push({
          itemId: randomItem.id,
          count: 1,
          quality: quality
        })
      }
    }

    return drops
  }
}

// 导出数据库实例
export { itemDB }
