// 经验系统模块 - ExpSystem.js

// 等级上限
const MAX_LEVEL = 20

// 升级所需经验值公式：每级需要 100 * level 经验
const getExpToNextLevel = (level) => {
  return 100 * level
}

// 检查是否可以升级，返回升级信息
export const checkLevelUp = (currentExp, currentLevel) => {
  // 检查是否已达到满级
  if (currentLevel >= MAX_LEVEL) {
    return {
      canLevelUp: false,
      newLevel: currentLevel,
      rewards: null,
      remainingExp: currentExp,
      isMaxLevel: true
    }
  }

  let level = currentLevel
  let exp = currentExp
  let canLevelUp = false

  while (true) {
    const expToNext = getExpToNextLevel(level)
    if (exp >= expToNext) {
      exp -= expToNext
      level++
      canLevelUp = true
      
      // 检查是否达到满级
      if (level >= MAX_LEVEL) {
        level = MAX_LEVEL
        break
      }
    } else {
      break
    }
  }

  if (canLevelUp) {
    const rewards = {
      statPoints: 5,
      pAtkBonus: 2,
      defBonus: 1,
      hpBonus: 20,
      resourceBonus: 10
    }
    return {
      canLevelUp: true,
      newLevel: level,
      rewards,
      remainingExp: exp,
      isMaxLevel: level >= MAX_LEVEL
    }
  }

  return {
    canLevelUp: false,
    newLevel: currentLevel,
    rewards: null,
    remainingExp: exp,
    isMaxLevel: currentLevel >= MAX_LEVEL
  }
}

// 获取经验进度信息
export const getExpProgress = (currentExp, currentLevel) => {
  let level = currentLevel
  let exp = currentExp

  while (level > 1) {
    const expToPrev = getExpToNextLevel(level - 1)
    if (exp >= expToPrev) {
      exp -= expToPrev
      level--
    } else {
      break
    }
  }

  const expToNext = getExpToNextLevel(currentLevel)
  const progress = expToNext > 0 ? exp / expToNext : 0

  return {
    currentExp: exp,
    expToNext,
    progress: Math.min(1, progress),
    level: currentLevel
  }
}