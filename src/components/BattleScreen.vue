<template>
  <div class="battle-screen screen" v-if="player">
    <div class="battle-header">
      <div class="battle-info-left">
        <span id="battle-level-info">{{ levelInfo.worldId }}-{{ levelInfo.level }}</span>
        <span class="difficulty-tag" :class="difficulty">{{ difficulty === 'hard' ? '困难' : '普通' }}</span>
      </div>
      <div class="battle-controls">
        <button class="btn-return" @click="handleReturn">返回主页</button>
        <button :class="{ active: battleSpeed === 2 }" @click="toggleSpeed">速度 x{{ battleSpeed }}</button>
        <button :class="{ active: autoMode }" @click="toggleAutoMode">{{ autoMode ? '自动' : '手动' }}</button>
      </div>
    </div>

    <!-- 战斗区域 -->
    <div class="battle-area">
      <!-- 敌方区域 -->
      <div class="enemy-zone">
        <div
          v-for="monster in monsters"
          :key="monster.instanceId || monster.id"
          :class="['unit-rect', 'enemy-rect', { dead: monster.isDead }]"
        >
          <div class="unit-name">{{ monster.name }}</div>
          <div class="hp-bar">
            <div class="hp-fill" :style="{ width: getHpPercent(monster) + '%' }"></div>
          </div>
          <div class="unit-stats">{{ Math.max(0, monster.currentHp || 0) }}/{{ monster.stats?.maxHp || 0 }}</div>
        </div>
      </div>

      <!-- 特效层 -->
      <div class="effect-layer">
        <div v-for="effect in effects" :key="effect.id" :class="['damage-number', effect.isCrit ? 'crit' : 'normal']" :style="{ left: effect.x + 'px', top: effect.y + 'px' }">
          {{ effect.text }}
        </div>
      </div>

      <!-- 我方区域 -->
      <div class="player-zone">
        <div class="player-unit">
          <div :class="['unit-rect', 'player-rect', { dead: player.isDead }]">
            <div class="unit-name">{{ player.name }}</div>
            <div class="hp-bar">
              <div class="hp-fill" :style="{ width: getHpPercent(player) + '%' }"></div>
            </div>
            <div class="resource-bar">
              <div class="resource-fill" :style="{ width: getResourcePercent(player) + '%' }"></div>
            </div>
            <div class="unit-stats">
              {{ Math.floor(player.currentHp) }}/{{ player.stats.maxHp }}
              <div class="resource-text">{{ getResourceText() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能按钮区 -->
    <div class="skill-bar">
      <button
        v-for="skillId in player.skills"
        :key="skillId"
        :class="['skill-btn', { 'on-cooldown': !canUseSkill(skillId), ready: canUseSkill(skillId) && !autoMode }]"
        @click="useSkill(skillId)"
      >
        <span class="cost-text">{{ getSkill(skillId)?.cost > 0 ? getSkill(skillId)?.cost : '' }}</span>
        <span class="skill-name">{{ getSkill(skillId)?.name }}</span>
        <!-- CD 进度条 -->
        <div v-if="getSkill(skillId)?.cd > 0" class="skill-cd-bar">
          <div class="skill-cd-fill" :style="{ width: getSkillCooldownPercent(skillId) + '%' }"></div>
        </div>
      </button>
    </div>

    <!-- 战斗胜利对话框 -->
    <Dialog
      v-if="showVictoryDialog"
      :visible="showVictoryDialog"
      :title="'战斗胜利'"
      :message="victoryMessage"
      :type="'confirm'"
      :confirm-text="'下一关'"
      :cancel-text="'返回主页'"
      :close-on-overlay="false"
      @confirm="handleGoToNextLevel"
      @cancel="confirmReturn"
      @close="showVictoryDialog = false"
    />

    <!-- 战斗失败对话框 -->
    <Dialog
      v-if="showDefeatDialog"
      :visible="showDefeatDialog"
      :title="'战斗失败'"
      :message="'很遗憾，你被打败了！\n请再接再厉！'"
      :type="'confirm'"
      :confirm-text="'再次挑战'"
      :cancel-text="'返回主页'"
      :close-on-overlay="false"
      @confirm="retryBattle"
      @cancel="confirmReturn"
      @close="showDefeatDialog = false"
    />

    <!-- 确认返回 Dialog -->
    <Dialog
      v-if="showReturnDialog"
      :visible="showReturnDialog"
      :title="'确认返回'"
      :message="'确定要放弃战斗并返回主页吗？'"
      :type="'confirm'"
      :close-on-overlay="true"
      @confirm="confirmReturn"
      @cancel="showReturnDialog = false"
      @close="showReturnDialog = false"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { SkillConfig } from '../config/SkillConfig'
import { ItemConfig } from '../config/ItemConfig'
import { EntityManager } from '../js/EntityManager'
import { TurnManager } from '../js/TurnManager'
import { DropSystem } from '../js/DropSystem'
import Dialog from './Dialog.vue'

export default {
  name: 'BattleScreen',
  components: {
    Dialog
  },
  props: {
    levelInfo: Object,
    playerData: Object,
    worldId: Number,
    currentLevel: Number,
    difficulty: {
      type: String,
      default: 'normal'
    }
  },
  emits: ['battle-end', 'return-hub', 'go-to-next'],
  setup(props, { emit }) {
    const battleSpeed = ref(1)
    const autoMode = ref(true)
    const currentActor = ref(null)
    const effects = ref([])
    const displayTurnOrder = ref([])
    const showReturnDialog = ref(false)
    const showVictoryDialog = ref(false)
    const showDefeatDialog = ref(false)
    const victoryMessage = ref('')
    const skillCooldowns = reactive({}) // 技能 CD 状态

    const player = ref(null)
    const monsters = ref([])
    const turnManager = ref(null)
    const cdTimer = ref(null) // CD 更新定时器
    const victoryDrops = ref([]) // 胜利掉落
    const victoryGold = ref(0) // 胜利金币
    const monsterExpCache = ref([]) // 缓存怪物经验值
    const difficulty = ref('normal') // 难度

    const getSkill = (id) => SkillConfig.getSkill(id)
    const getItem = (id) => ItemConfig.getItem(id)

    // 计算金币奖励（基于关卡和怪物数量）
    const calculateGoldReward = () => {
      const baseGold = 10 * props.worldId // 基础金币 = 10 * 世界 ID
      const monsterCount = monsters.value?.length || 1
      return baseGold * monsterCount
    }

    // 计算获得的总经验值（所有怪物）
    const calculateTotalExp = () => {
      let totalExp = 0
      // 使用缓存的怪物经验值（避免战斗结束后怪物数据丢失）
      for (const monsterExp of monsterExpCache.value) {
        totalExp += monsterExp.exp
      }
      return totalExp
    }

    // 进入下一关
    const goToNextLevel = () => {
      // 发送战斗结束事件，包含掉落和金币
      emit('battle-end', {
        win: true,
        drops: victoryDrops.value,
        gold: victoryGold.value,
        totalExp: calculateTotalExp(),
        levelInfo: props.levelInfo,
        goToNext: true
      })
    }

    // 获取资源类型文本（根据体质）
    const getResourceText = () => {
      if (player.value?.constitution?.resourceName) {
        return `${player.value.constitution.resourceName}: ${Math.floor(player.value.currentResource)}/${player.value.stats.maxResource}`
      }
      return `MP: ${Math.floor(player.value.currentResource)}/${player.value.stats.maxResource}`
    }

    const getHpPercent = (entity) => {
      return (entity.currentHp / entity.stats.maxHp) * 100
    }

    const getResourcePercent = (entity) => {
      return (entity.currentResource / entity.stats.maxResource) * 100
    }

    const canUseSkill = (skillId) => {
      const skill = getSkill(skillId)
      return skill && player.value && player.value.currentResource >= skill.cost
    }

    const useSkill = (skillId) => {
      if (!autoMode.value && turnManager.value) {
        turnManager.value.playerUseSkill(skillId)
      }
    }

    const toggleSpeed = () => {
      battleSpeed.value = battleSpeed.value === 1 ? 2 : 1
      if (turnManager.value) {
        turnManager.value.battleSpeed = battleSpeed.value
      }
    }

    const toggleAutoMode = () => {
      autoMode.value = !autoMode.value
      if (turnManager.value) {
        turnManager.value.autoMode = autoMode.value
      }
    }

    // 获取技能 CD 百分比
    const getSkillCooldownPercent = (skillId) => {
      const skill = getSkill(skillId)
      if (!skill || skill.cd <= 0) return 0
      // 简化处理，实际应该记录 CD 开始时间
      return skillCooldowns[skillId] || 0
    }

    // 更新技能 CD
    const updateSkillCooldowns = () => {
      for (const skillId of player.value?.skills || []) {
        const skill = getSkill(skillId)
        if (skill && skill.cd > 0) {
          // 这里可以扩展为实际计算 CD
          skillCooldowns[skillId] = 0
        }
      }
    }

    // 返回主页
    const handleReturn = () => {
      showReturnDialog.value = true
    }

    const confirmReturn = () => {
      showReturnDialog.value = false
      showDefeatDialog.value = false
      emit('return-hub')
    }

    // 进入下一关
    const handleGoToNextLevel = () => {
      showVictoryDialog.value = false
      emit('go-to-next', {
        worldId: props.worldId,
        level: props.currentLevel
      })
    }

    // 再次挑战
    const retryBattle = async () => {
      showDefeatDialog.value = false

      // 重置怪物状态（带难度参数）
      monsters.value = EntityManager.createLevelMonsters(props.worldId, props.currentLevel, difficulty.value)

      // 更新怪物经验值缓存
      monsterExpCache.value = monsters.value.map(m => ({ exp: m.exp || 0 }))

      // 重新进入战斗
      turnManager.value = new TurnManager()
      turnManager.value.init(player.value, monsters.value, props.levelInfo)

      // 让玩家引用指向 battleData.player
      player.value = turnManager.value.battleData.player

      // 重置玩家状态 - HP 和 MP 回满（必须在 player.value 重新赋值后执行）
      player.value.currentHp = player.value.stats.maxHp
      player.value.currentResource = player.value.stats.maxResource

      console.log('[BattleScreen] 再次挑战，重置状态:', {
        hp: player.value.currentHp + '/' + player.value.stats.maxHp,
        mp: player.value.currentResource + '/' + player.value.stats.maxResource
      })

      // 重新开始战斗
      const result = await turnManager.value.startBattle()

      if (result.win) {
        const drops = await DropSystem.calculateDrops(monsters.value, player.value.stats.agi, props.worldId)
        const goldReward = calculateGoldReward()
        const totalExp = calculateTotalExp()
        victoryMessage.value = `恭喜获胜！\n\n获得金币：💰 ${goldReward}\n\n获得经验：✨ ${totalExp}\n\n`

        // 显示掉落物品
        if (drops && drops.length > 0) {
          victoryMessage.value += `掉落物品：\n`
          for (const drop of drops) {
            const item = getItem(drop.itemId)
            if (item) {
              victoryMessage.value += `  ${item.icon} ${item.name} x${drop.count}\n`
            }
          }
        } else {
          victoryMessage.value += `掉落物品：无\n`
        }
        
        victoryDrops.value = drops
        victoryGold.value = goldReward
        showVictoryDialog.value = true
        emit('battle-end', {
          win: true,
          drops: drops,
          gold: goldReward,
          totalExp: calculateTotalExp(),
          levelInfo: props.levelInfo
        })
      } else {
        showDefeatDialog.value = true
      }
    }

    // 初始化战斗
    onMounted(async () => {
      // 设置难度
      difficulty.value = props.difficulty || 'normal'
      
      // 创建怪物（带难度参数）
      monsters.value = EntityManager.createLevelMonsters(props.worldId, props.currentLevel, difficulty.value)

      // 缓存怪物经验值（用于战斗胜利后计算）
      monsterExpCache.value = monsters.value.map(m => ({ exp: m.exp || 0 }))

      // 初始化玩家
      player.value = EntityManager.createPlayer(props.playerData)
      EntityManager.applyEquipment(player.value)

      // 初始化战斗管理器
      turnManager.value = new TurnManager()
      turnManager.value.init(player.value, monsters.value, props.levelInfo)

      // 让玩家引用指向 battleData.player，确保能同步血条变化
      player.value = turnManager.value.battleData.player

      // 开始战斗
      const result = await turnManager.value.startBattle()

      // 计算掉落
      if (result.win) {
        const drops = await DropSystem.calculateDrops(monsters.value, player.value.stats.agi, props.worldId)

        // 生成胜利消息
        let message = `恭喜获胜！\n\n`

        // 显示金币奖励
        const goldReward = calculateGoldReward()
        message += `获得金币：💰 ${goldReward}\n\n`

        // 显示经验值奖励
        const totalExp = calculateTotalExp()
        message += `获得经验：✨ ${totalExp}\n\n`

        // 显示掉落物品
        if (drops && drops.length > 0) {
          message += `掉落物品：\n`
          for (const drop of drops) {
            const item = getItem(drop.itemId)
            if (item) {
              message += `  ${item.icon} ${item.name} x${drop.count}\n`
            }
          }
        } else {
          message += `掉落物品：无\n`
        }

        victoryMessage.value = message

        // 存储掉落数据供后续使用
        victoryDrops.value = drops
        victoryGold.value = goldReward

        // 显示胜利对话框
        showVictoryDialog.value = true

        // 立即发送战斗结束事件，添加金币和物品到背包
        emit('battle-end', {
          win: true,
          drops: drops,
          gold: goldReward,
          totalExp: calculateTotalExp(),
          levelInfo: props.levelInfo
        })
      } else {
        // 战斗失败，显示失败对话框
        showDefeatDialog.value = true
      }
    })

    // 清理定时器
    onUnmounted(() => {
      if (cdTimer.value) {
        clearInterval(cdTimer.value)
      }
    })

    return {
      battleSpeed,
      autoMode,
      currentActor,
      effects,
      displayTurnOrder,
      showReturnDialog,
      showVictoryDialog,
      showDefeatDialog,
      victoryMessage,
      player,
      monsters,
      Math,
      getSkill,
      getItem,
      getHpPercent,
      getResourcePercent,
      getResourceText,
      calculateGoldReward,
      calculateTotalExp,
      handleGoToNextLevel,
      goToNextLevel,
      retryBattle,
      canUseSkill,
      useSkill,
      toggleSpeed,
      toggleAutoMode,
      handleReturn,
      confirmReturn,
      getSkillCooldownPercent
    }
  }
}
</script>

<style lang="scss">
// 战斗界面样式已在 main.scss 中定义
</style>
