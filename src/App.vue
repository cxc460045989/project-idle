<template>
  <div id="app">
    <!-- 加载界面 -->
    <div v-if="!isDataLoaded" class="loading-screen">
      <div class="loading-text">加载中...</div>
    </div>
    
    <!-- 主界面 -->
    <MainHub
      v-else-if="!isInBattle"
      :player-data="player"
      :backpack-data="backpack"
      @enter-battle="handleEnterBattle"
      @update-player="updatePlayer"
      @update-backpack="updateBackpack"
    />

    <!-- 战斗界面 -->
    <BattleScreen
      v-else
      :level-info="levelInfo"
      :player-data="battlePlayerData"
      :world-id="currentWorld"
      :current-level="currentLevel"
      @battle-end="handleBattleEnd"
      @return-hub="handleReturnHub"
      @go-to-next="handleGoToNext"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import MainHub from './components/MainHub.vue'
import BattleScreen from './components/BattleScreen.vue'
import { WorldConfig } from './config/WorldConfig'
import { EntityManager } from './js/EntityManager'
import { ItemDBAPI, itemsCache } from './js/ItemDatabase'
import { WorldProgressAPI, PlayerAPI } from './js/LocalDB'

export default {
  name: 'App',
  components: {
    MainHub,
    BattleScreen
  },
  setup() {
    const isInBattle = ref(false)
    const currentWorld = ref(1)
    const currentLevel = ref(1)
    const levelInfo = ref(null)
    const battlePlayerData = ref(null)
    const isDataLoaded = ref(false) // 数据是否已加载

    // 玩家数据 - 从数据库读取
    const player = reactive({
      name: '主角',
      baseStats: { str: 5, int: 5, con: 5, agi: 5, level: 1 },
      stats: { maxHp: 100, maxResource: 50, pAtk: 10, def: 5, speed: 10, critRate: 0.05 },
      currentHp: 100,
      currentResource: 50,
      skills: [2001, 2002, 2003],
      equipment: { weapon: null, armor: null, accessory: null },
      statPoints: 10,
      gold: 0,
      constitution: null
    })

    // 背包数据 - 从数据库读取
    const backpack = reactive({})

    // 从数据库加载玩家数据
    const loadPlayerFromDB = async () => {
      const playerData = await PlayerAPI.load()

      if (playerData) {
        // 更新玩家数据 - 需要重建 baseStats 结构
        Object.keys(player).forEach(key => delete player[key])

        // 重建 baseStats 对象（数据库保存的是扁平化数据）
        player.name = playerData.name || '主角'
        player.baseStats = {
          str: playerData.str || 5,
          int: playerData.int || 5,
          con: playerData.con || 5,
          agi: playerData.agi || 5,
          level: playerData.level || 1
        }
        player.stats = playerData.stats || { maxHp: 100, maxResource: 50, pAtk: 10, def: 5, speed: 10, critRate: 0.05 }
        player.currentHp = playerData.currentHp || player.stats.maxHp
        player.currentResource = playerData.currentResource || player.stats.maxResource
        player.skills = playerData.skills || [2001, 2002, 2003]
        player.equipment = playerData.equipment || { weapon: null, armor: null, accessory: null }
        player.statPoints = playerData.statPoints !== undefined ? playerData.statPoints : 10
        player.exp = playerData.exp !== undefined ? playerData.exp : 0
        player.constitution = playerData.constitution || null

        // 应用装备属性加成，计算正确的总属性
        EntityManager.applyEquipment(player)
        // 在主页时 HP/MP 回满（BUGFIX #024）
        player.currentHp = player.stats.maxHp
        player.currentResource = player.stats.maxResource

        // 更新背包数据
        Object.keys(backpack).forEach(key => delete backpack[key])
        if (playerData.backpack) {
          Object.assign(backpack, playerData.backpack)
        }

        // 更新世界/关卡
        currentWorld.value = playerData.currentWorld || 1
        currentLevel.value = playerData.currentLevel || 1
        // 更新解锁的世界
        if (playerData.unlockedWorlds) {
          Object.keys(WorldConfig.worlds).forEach(id => {
            WorldConfig.worlds[id].unlocked = playerData.unlockedWorlds.includes(parseInt(id))
          })
        }
      }
      isDataLoaded.value = true
      return playerData
    }

    // 保存玩家数据到数据库
    const savePlayerToDB = async () => {
      const saveData = {
        name: player.name,
        baseStats: JSON.parse(JSON.stringify(player.baseStats)),
        stats: JSON.parse(JSON.stringify(player.stats)),
        currentHp: player.currentHp,
        currentResource: player.currentResource,
        skills: JSON.parse(JSON.stringify(player.skills)),
        equipment: JSON.parse(JSON.stringify(player.equipment)),
        statPoints: player.statPoints,
        exp: player.exp || 0,
        constitution: player.constitution || null,
        currentWorld: currentWorld.value,
        currentLevel: currentLevel.value,
        backpack: JSON.parse(JSON.stringify(backpack)),
        unlockedWorlds: JSON.parse(JSON.stringify(Object.keys(WorldConfig.worlds).filter(id => WorldConfig.worlds[id].unlocked)))
      }
      await PlayerAPI.save(saveData)
      console.log('[App] 保存数据:', { statPoints: player.statPoints, gold: backpack[1001], level: player.baseStats?.level, exp: player.exp })
    }

    // 更新玩家数据（从数据库重新加载）
    const updatePlayer = async () => {
      await loadPlayerFromDB()
    }

    // 更新背包数据（从数据库重新加载）
    const updateBackpack = async () => {
      await loadPlayerFromDB()
    }

    // 进入战斗
    const handleEnterBattle = async (battleData) => {
      // 更新当前世界和关卡
      currentWorld.value = battleData.worldId
      currentLevel.value = battleData.level
      levelInfo.value = battleData.levelConfig
      battlePlayerData.value = battleData.playerData
      isInBattle.value = true
      
      // 进入战斗后保存游戏（确保关卡信息已保存）
      await savePlayerToDB()
      
      console.log('[App] 进入战斗:', { world: currentWorld.value, level: currentLevel.value })
    }

    // 战斗结束
    const handleBattleEnd = async (result) => {
      console.log('[App] 战斗结果:', { win: result.win, gold: result.gold, exp: result.totalExp, goToNext: result.goToNext })
      if (result.win) {
        // 添加掉落物品到背包
        if (result.drops && result.drops.length > 0) {
          for (const drop of result.drops) {
            if (!backpack[drop.itemId]) backpack[drop.itemId] = 0
            backpack[drop.itemId] += drop.count
          }
        }

        // 添加金币奖励到背包（金币 ID: 1001）
        if (result.gold) {
          const oldGold = backpack[1001] || 0
          backpack[1001] = oldGold + result.gold
          console.log('[App] 获得金币:', { old: oldGold, add: result.gold, total: backpack[1001] })
        }

        // 添加经验值
        if (result.totalExp) {
          const levelUpInfo = EntityManager.addExp(player, result.totalExp)
          if (levelUpInfo.leveledUp) {
            console.log('[App] 升级了！', { from: player.baseStats.level - 1, to: levelUpInfo.newLevel })
          }
          console.log('[App] 获得经验值:', { exp: result.totalExp, totalExp: player.exp })
        }

        // 保存到数据库
        await savePlayerToDB()

        // 从数据库重新加载数据，确保数据一致
        await loadPlayerFromDB()

        console.log('[App] 战斗胜利后:', { gold: backpack[1001], level: player.baseStats?.level, exp: player.exp, world: currentWorld.value, currentLevel: currentLevel.value })
      } else {
        // 战斗失败，不重置关卡，允许再次挑战当前关卡
        // 只重置 HP/MP 到满值（为再次挑战做准备）
        player.currentHp = player.stats.maxHp
        player.currentResource = player.stats.maxResource
        console.log('[App] 战斗失败后，可以再次挑战:', { world: currentWorld.value, level: currentLevel.value, gold: backpack[1001], hp: player.currentHp })
        isInBattle.value = false
      }
    }

    // 返回主页 - 重置世界进度为第 1 关
    const handleReturnHub = async () => {
      // 返回主页前从数据库重新加载数据
      await loadPlayerFromDB()
      // 返回主页时 HP/MP 回满（确保在主页永远是满血）
      player.currentHp = player.stats.maxHp
      player.currentResource = player.stats.maxResource
      // 重置世界进度为第 1 关，并保存到数据库
      currentLevel.value = 1
      await WorldProgressAPI.reset(currentWorld.value)
      isInBattle.value = false
      console.log('[App] 返回主页，重置世界进度:', { world: currentWorld.value, level: currentLevel.value })
    }

    // 进入下一关
    const handleGoToNext = async () => {
      const world = WorldConfig.worlds[currentWorld.value]
      if (currentLevel.value >= world.levels) {
        // 已经是最后一关，返回主页
        console.log('[App] 已是最后一关，返回主页')
        isInBattle.value = false
      } else {
        // 进入下一关
        const nextLevel = currentLevel.value + 1
        // 保存世界进度到数据库
        await WorldProgressAPI.save(currentWorld.value, nextLevel)
        console.log('[App] 进入下一关:', { world: currentWorld.value, from: currentLevel.value, to: nextLevel })

        const nextLevelConfig = WorldConfig.getLevelConfig(currentWorld.value, nextLevel)
        if (nextLevelConfig) {
          // 重置玩家状态 - HP 和 MP 回满
          player.currentHp = player.stats.maxHp
          player.currentResource = player.stats.maxResource
          
          // 更新当前关卡
          currentLevel.value = nextLevel
          levelInfo.value = nextLevelConfig
          isInBattle.value = false
          
          // 延迟后重新进入战斗
          setTimeout(() => {
            isInBattle.value = true
            battlePlayerData.value = {
              name: player.name,
              str: player.baseStats.str,
              int: player.baseStats.int,
              con: player.baseStats.con,
              agi: player.baseStats.agi,
              level: player.baseStats.level,
              skills: player.skills,
              equipment: player.equipment
            }
            console.log('[App] 进入下一关战斗:', { world: currentWorld.value, level: currentLevel.value })
          }, 100)
        }
      }
    }

    // 初始化游戏
    onMounted(async () => {
      // 初始化物品数据库
      await ItemDBAPI.init()
      console.log('[App] 物品数据库初始化完成，缓存物品数量:', Object.keys(itemsCache).length)

      // 从数据库加载玩家数据
      await loadPlayerFromDB()
    })

    return {
      isInBattle,
      currentWorld,
      currentLevel,
      levelInfo,
      battlePlayerData,
      isDataLoaded,
      player,
      backpack,
      updatePlayer,
      updateBackpack,
      handleEnterBattle,
      handleBattleEnd,
      handleReturnHub,
      handleGoToNext
    }
  }
}
</script>

<style lang="scss">
// 使用 @use 替代 @import（Sass 新版推荐）
@use './styles/main.scss';

// 加载界面样式
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.loading-text {
  font-size: 24px;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
