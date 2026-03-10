/**
 * 本地数据库 API 模块
 * 使用 localForage (IndexedDB 封装) 存储游戏数据
 */

import localforage from 'localforage'

// 初始化数据库配置
const db = localforage.createInstance({
  name: '轮回异界',
  storeName: 'gameData',
  description: '轮回异界：放置探索 游戏数据'
})

// 存档表
const SAVE_STORE = 'saves'
// 游戏设置表
const SETTINGS_STORE = 'settings'
// 玩家数据表
const PLAYER_STORE = 'player'
// 世界进度表
const WORLD_PROGRESS_STORE = 'worldProgress'

/**
 * 世界进度 API
 * 存储每个轮回世界的关卡进度
 */
export const WorldProgressAPI = {
  // 保存世界进度
  async save(worldId, level) {
    const key = `${WORLD_PROGRESS_STORE}_world${worldId}`
    const data = {
      worldId,
      level,
      updateTime: Date.now()
    }
    await db.setItem(key, data)
    return data
  },

  // 读取世界进度
  async load(worldId) {
    const key = `${WORLD_PROGRESS_STORE}_world${worldId}`
    const data = await db.getItem(key)
    return data || { worldId, level: 1 } // 默认从第 1 关开始
  },

  // 重置世界进度为第 1 关
  async reset(worldId) {
    return await this.save(worldId, 1)
  },

  // 关卡 +1
  async nextLevel(worldId, currentLevel) {
    return await this.save(worldId, currentLevel + 1)
  }
}

/**
 * 清理数据，确保可以被 IndexedDB 序列化
 * 移除 Vue 响应式属性、函数、Symbol 等不可序列化内容
 */
function cleanData(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 存档相关 API
 */
export const SaveAPI = {
  // 创建/更新存档
  async save(slotIndex, saveData) {
    const key = `${SAVE_STORE}_slot${slotIndex}`
    const data = {
      slotIndex,
      saveTime: Date.now(),
      ...cleanData(saveData)
    }
    await db.setItem(key, data)
    return data
  },

  // 读取存档
  async load(slotIndex) {
    const key = `${SAVE_STORE}_slot${slotIndex}`
    return await db.getItem(key)
  },

  // 获取所有存档
  async getAll() {
    const saves = []
    for (let i = 1; i <= 3; i++) {
      const save = await this.load(i)
      saves.push(save || null)
    }
    return saves
  },

  // 删除存档
  async delete(slotIndex) {
    const key = `${SAVE_STORE}_slot${slotIndex}`
    await db.removeItem(key)
  },

  // 清空所有存档
  async clearAll() {
    for (let i = 1; i <= 3; i++) {
      await this.delete(i)
    }
  },

  // 检查存档是否存在
  async exists(slotIndex) {
    const save = await this.load(slotIndex)
    return save !== null
  }
}

/**
 * 玩家数据 API
 */
export const PlayerAPI = {
  // 保存玩家数据
  async save(playerData) {
    await db.setItem(PLAYER_STORE, {
      ...cleanData(playerData),
      updateTime: Date.now()
    })
  },

  // 读取玩家数据
  async load() {
    return await db.getItem(PLAYER_STORE)
  },

  // 删除玩家数据
  async delete() {
    await db.removeItem(PLAYER_STORE)
  }
}

/**
 * 游戏设置 API
 */
export const SettingsAPI = {
  // 保存设置
  async save(settings) {
    await db.setItem(SETTINGS_STORE, {
      ...cleanData(settings),
      updateTime: Date.now()
    })
  },

  // 读取设置
  async load() {
    return await db.getItem(SETTINGS_STORE)
  },

  // 删除设置
  async delete() {
    await db.removeItem(SETTINGS_STORE)
  }
}

/**
 * 数据库工具
 */
export const DBUtils = {
  // 清空整个数据库
  async clear() {
    await db.clear()
  },

  // 获取数据库信息
  async info() {
    return {
      name: db.config().name,
      storeName: db.config().storeName
    }
  },

  // 获取所有键
  async keys() {
    const keys = []
    await db.iterate((value, key) => {
      keys.push(key)
    })
    return keys
  },

  // 获取数据总数
  async count() {
    let count = 0
    await db.iterate(() => {
      count++
    })
    return count
  }
}

// 导出数据库实例（用于高级操作）
export { db }
