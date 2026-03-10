/**
 * 属性名称配置工具模块
 * 提供属性英文 key 到中文名称的映射
 */

import statNameMap from '../config/StatNameConfig.json'

/**
 * 获取属性的中文名称
 * @param {string} stat - 属性英文 key
 * @returns {string} 属性中文名称，如果未找到则返回原值
 */
export const getStatName = (stat) => {
  return statNameMap[stat] || stat
}

/**
 * 获取所有属性名称映射
 * @returns {Object} 属性名称映射对象
 */
export const getAllStatNames = () => {
  return { ...statNameMap }
}

/**
 * 添加或更新属性名称映射
 * @param {string} stat - 属性英文 key
 * @param {string} name - 属性中文名称
 */
export const setStatName = (stat, name) => {
  statNameMap[stat] = name
}

export default {
  getStatName,
  getAllStatNames,
  setStatName
}
