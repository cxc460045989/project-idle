<template>
  <div class="screen" id="main-hub">
    <div class="hub-header">
      <h1>轮回异界：放置探索</h1>
      <div class="player-info">
        <span id="player-name">{{ player.name }}</span>
        <span id="player-level">Lv.{{ player.baseStats?.level }}</span>
      </div>
    </div>

    <!-- 角色属性面板 -->
    <div class="stats-panel">
      <h3>角色属性</h3>
      <div class="exp-bar">
        <div class="exp-text">
          <span>EXP: {{ Math.floor(player.exp) }} / {{ getExpProgress(player.exp, player.baseStats.level).expToNext }}</span>
          <span>Lv.{{ player.baseStats.level }}</span>
        </div>
        <div class="exp-progress">
          <div class="exp-fill" :style="{ width: (getExpProgress(player.exp, player.baseStats.level).progress * 100) + '%' }"></div>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">生命:</span><span>{{ player.currentHp }}/{{ player.stats.maxHp }}</span></div>
        <div class="stat-item"><span class="stat-label">资源:</span><span>{{ Math.floor(player.currentResource) }}/{{ player.stats.maxResource }}</span></div>
        <div class="stat-item"><span class="stat-label">攻击:</span><span>{{ Math.floor(player.stats.pAtk) }}</span></div>
        <div class="stat-item"><span class="stat-label">防御:</span><span>{{ Math.floor(player.stats.def) }}</span></div>
        <div class="stat-item"><span class="stat-label">速度:</span><span>{{ player.stats.speed.toFixed(1) }}</span></div>
        <div class="stat-item"><span class="stat-label">暴击:</span><span>{{ (player.stats.critRate * 100).toFixed(1) }}%</span></div>
      </div>
      <div class="base-stats">
        <h4>基础属性</h4>
        <div class="base-stat-row">
          <span class="stat-label">力量 (STR):</span><span>{{ player.baseStats?.str }}</span>
          <button class="btn-plus" @click="requestAddStat('str')" :disabled="player.statPoints <= 0">+</button>
        </div>
        <div class="base-stat-row">
          <span class="stat-label">智力 (INT):</span><span>{{ player.baseStats?.int }}</span>
          <button class="btn-plus" @click="requestAddStat('int')" :disabled="player.statPoints <= 0">+</button>
        </div>
        <div class="base-stat-row">
          <span class="stat-label">敏捷 (AGI):</span><span>{{ player.baseStats?.agi }}</span>
          <button class="btn-plus" @click="requestAddStat('agi')" :disabled="player.statPoints <= 0">+</button>
        </div>
        <div class="stat-points">可用点数：<span>{{ player.statPoints }}</span></div>
        <!-- 确认加点按钮 -->
        <div v-if="hasPendingStatPoints()" class="stat-confirm-section">
          <div class="pending-stats-info">
            <span>待分配点数：</span>
            <span v-for="(count, stat) in pendingStatPoints" :key="stat" class="pending-stat">
              {{ getStatName(stat) }}+{{ count }}
            </span>
          </div>
          <div class="stat-confirm-buttons">
            <button class="btn-confirm" @click="confirmAddStat">确认加点</button>
            <button class="btn-cancel" @click="cancelAddStat">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 装备栏 -->
    <div class="equip-panel">
      <h3>装备</h3>
      <div class="equip-slots">
        <div class="equip-slot" @click="openEquipDetail('weapon')">
          <span class="slot-name">武器</span>
          <span class="equip-name" :style="{ color: getEquipColor(player.equipment.weapon) }">{{ getEquipName(player.equipment.weapon) }}</span>
        </div>
        <div class="equip-slot" @click="openEquipDetail('armor')">
          <span class="slot-name">衣服</span>
          <span class="equip-name" :style="{ color: getEquipColor(player.equipment.armor) }">{{ getEquipName(player.equipment.armor) }}</span>
        </div>
        <div class="equip-slot" @click="openEquipDetail('accessory')">
          <span class="slot-name">饰品</span>
          <span class="equip-name" :style="{ color: getEquipColor(player.equipment.accessory) }">{{ getEquipName(player.equipment.accessory) }}</span>
        </div>
      </div>
    </div>

    <!-- 功能按钮区 -->
    <div class="function-nav">
      <button class="nav-btn" @click="showPanel('skills')">技能</button>
      <button class="nav-btn" @click="showPanel('backpack')">背包</button>
      <button class="nav-btn" @click="showPanel('shop')">商店</button>
      <button class="nav-btn" @click="showPanel('constitution')">体质</button>
      <button class="nav-btn" @click="showPanel('settings')">设置</button>
    </div>

    <!-- 轮回世界选择 -->
    <div class="world-select">
      <h3>轮回世界</h3>
      <div class="world-list">
        <div
          v-for="(world, id) in WorldConfig.worlds"
          :key="id"
          :class="['world-item', { selected: currentWorld == id }, { locked: !worldUnlocked[id] }]"
          @click="selectWorld(parseInt(id))"
        >
          <div style="font-weight: bold">{{ world.name }}</div>
          <div style="font-size: 11px; color: #888">{{ world.levels }}关卡</div>
        </div>
      </div>
    </div>

    <!-- 主操作按钮 -->
    <div class="main-action">
      <button id="btn-enter-battle" class="btn-enter" @click="handleEnterBattle" :disabled="!currentWorld">进入轮回世界</button>
    </div>

    <!-- 难度选择对话框 -->
    <div v-if="showDifficultyDialog" class="dialog-overlay visible" @click.self="cancelDifficulty">
      <div class="panel-dialog" style="max-width: 400px;">
        <h3>选择难度</h3>
        <div class="panel-content">
          <p style="text-align: center; margin-bottom: 20px; color: #aaa;">
            当前世界：{{ WorldConfig.getWorld(currentWorld)?.name }}<br>
            第 {{ currentLevel }} 关
          </p>
          <div class="difficulty-options">
            <div 
              :class="['difficulty-option', { selected: selectedDifficulty === 'normal' }]"
              @click="selectedDifficulty = 'normal'"
            >
              <div class="difficulty-icon">⚔️</div>
              <div class="difficulty-name">普通</div>
              <div class="difficulty-desc">标准难度，适合新手</div>
            </div>
            <div 
              :class="['difficulty-option', { selected: selectedDifficulty === 'hard' }]"
              @click="selectedDifficulty = 'hard'"
            >
              <div class="difficulty-icon">💀</div>
              <div class="difficulty-name">困难</div>
              <div class="difficulty-desc">挑战难度，怪物更强</div>
            </div>
          </div>
        </div>
        <div class="dialog-buttons">
          <button class="btn-cancel" @click="cancelDifficulty">取消</button>
          <button class="btn-confirm" @click="confirmDifficulty" :disabled="!selectedDifficulty">确认进入</button>
        </div>
      </div>
    </div>

    <!-- 技能面板 -->
    <div v-if="activePanel === 'skills'" class="dialog-overlay visible" @click.self="closePanel">
      <div class="panel-dialog">
        <h3>技能</h3>
        <div class="panel-content">
          <div class="skill-list">
            <div v-for="skillId in player.skills" :key="skillId" class="list-item">
              <div class="list-item-name">{{ getSkill(skillId)?.name }}</div>
              <div class="list-item-desc">{{ getSkill(skillId)?.desc }}</div>
              <div class="list-item-stats">
                消耗：{{ getSkill(skillId)?.cost }} | CD: {{ getSkill(skillId)?.cd }}回合 | 系数：{{ getSkill(skillId)?.skillCoeff }}
              </div>
            </div>
          </div>
        </div>
        <button class="btn-close" @click="closePanel">关闭</button>
      </div>
    </div>

    <!-- 背包面板 -->
    <div v-if="activePanel === 'backpack'" class="dialog-overlay visible" @click.self="closePanel">
      <div class="panel-dialog">
        <h3>背包</h3>
        <div class="panel-content">
          <div class="backpack-grid">
            <!-- 30 个格子，5 列 6 行 -->
            <div
              v-for="slotIndex in 30"
              :key="slotIndex"
              :class="['backpack-slot', { 'has-item': getSlotItem(slotIndex) }]"
              @click="onSlotClick(slotIndex)"
            >
              <div v-if="getSlotItem(slotIndex)" :class="['item-slot', getItemQualityClass(getSlotItemId(slotIndex))]">
                <span class="item-slot-name">{{ getItem(getSlotItemId(slotIndex))?.name }}</span>
                <span v-if="hasItemLevel(getSlotItemId(slotIndex))" class="item-slot-level">Lv.{{ getItem(getSlotItemId(slotIndex))?.level || 1 }}</span>
                <span class="item-slot-count" v-if="getSlotItemCount(slotIndex) > 1">x{{ getSlotItemCount(slotIndex) }}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-close" @click="closePanel">关闭</button>
      </div>
    </div>

    <!-- 物品详情对话框 -->
    <div v-if="itemDetailVisible" class="dialog-overlay visible" @click.self="closeItemDetail">
      <div class="item-detail-dialog">
        <div class="dialog-title">{{ selectedItem?.name }}</div>
        <div class="item-detail-content">
          <div class="item-detail-row">
            <span class="detail-label">品质：</span>
            <span :class="getItemQualityClass(selectedItemId)" :style="{ color: getItemQualityColor(selectedItemId) }">
              {{ ItemConfig.getQualityName(selectedItem?.quality) }}
            </span>
          </div>
          <div class="item-detail-row">
            <span class="detail-label">等级：</span>
            <span>Lv.{{ selectedItem?.level || 1 }}</span>
          </div>
          <div class="item-detail-row">
            <span class="detail-label">类型：</span>
            <span>{{ getItemTypeName(selectedItem?.type) }}</span>
          </div>
          <div class="item-detail-desc">
            {{ selectedItem?.desc }}
          </div>
          <div v-if="selectedItem?.baseStats" class="item-detail-stats">
            <div class="stats-title">属性加成</div>
            <div v-for="(value, stat) in selectedItem.baseStats" :key="stat" class="stat-row">
              <span class="stat-name">{{ getStatName(stat) }}:</span>
              <span class="stat-value">+{{ value }}</span>
            </div>
          </div>
          <div class="item-detail-actions">
            <button v-if="canEquip(selectedItemId)" class="btn-equip" @click="equipItemFromDetail">装备</button>
            <button v-if="isConsumable(selectedItemId)" class="btn-use" @click="useItemFromDetail">使用</button>
            <button class="btn-sell" @click="sellItemFromDetail" :title="'出售价格：💰 ' + getSellPrice(selectedItemId)">
              💰 出售
            </button>
            <button class="btn-close-dialog" @click="closeItemDetail">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 体质面板 -->
    <div v-if="activePanel === 'constitution'" class="dialog-overlay visible" @click.self="closePanel">
      <div class="panel-dialog">
        <h3>体质</h3>
        <div class="panel-content">
          <div class="constitution-list">
            <div class="list-item">
              <div class="list-item-name">凡人体质（初始）</div>
              <div class="list-item-desc">普通的穿越者体质，各项属性均衡</div>
              <div class="list-item-stats">当前装备</div>
            </div>
          </div>
        </div>
        <button class="btn-close" @click="closePanel">关闭</button>
      </div>
    </div>

    <!-- 商店面板 -->
    <div v-if="activePanel === 'shop'" class="dialog-overlay visible" @click.self="closePanel">
      <div class="panel-dialog">
        <h3>商店</h3>
        <div class="panel-content">
          <div class="shop-header">
            <span class="gold-display">💰 金币：{{ backpack[1001] || 0 }}</span>
          </div>
          <div class="shop-tabs">
            <button :class="['shop-tab', { active: shopTab === 'equipment' }]" @click="shopTab = 'equipment'">装备</button>
            <button :class="['shop-tab', { active: shopTab === 'constitution' }]" @click="shopTab = 'constitution'">体质</button>
            <button :class="['shop-tab', { active: shopTab === 'skills' }]" @click="shopTab = 'skills'">技能</button>
          </div>
          <!-- 装备商店 -->
          <div v-if="shopTab === 'equipment'" class="shop-list shop-grid-2">
            <div v-for="item in shopEquipmentList" :key="item.id" :class="['shop-item', 'quality-' + getItemQualityByItem(item)]">
              <div class="shop-item-content">
                <div class="shop-item-header">
                  <span class="shop-item-icon">{{ item.icon }}</span>
                  <div class="shop-item-name">{{ item.name }}</div>
                </div>
                <div class="shop-item-desc">{{ item.desc }}</div>
                <div class="shop-item-stats" v-if="item.baseStats">{{ getEquipmentStatsText(item.baseStats) }}</div>
              </div>
              <div class="shop-item-footer">
                <div class="shop-item-price">💰 {{ item.price }}</div>
                <button class="btn-buy" @click="buyItem(item)" :disabled="(backpack[1001] || 0) < item.price">购买</button>
              </div>
            </div>
          </div>
          <!-- 体质商店 -->
          <div v-if="shopTab === 'constitution'" class="shop-list shop-grid-2">
            <div v-for="item in shopConstitutionList" :key="item.id" :class="['shop-item', 'quality-epic']">
              <div class="shop-item-content">
                <div class="shop-item-header">
                  <span class="shop-item-icon">{{ item.icon }}</span>
                  <div class="shop-item-name">{{ item.name }}</div>
                </div>
                <div class="shop-item-desc">{{ item.desc }}</div>
              </div>
              <div class="shop-item-footer">
                <div class="shop-item-price">💰 {{ item.price }}</div>
                <button class="btn-buy" @click="buyConstitution(item)" :disabled="(backpack[1001] || 0) < item.price">购买</button>
              </div>
            </div>
          </div>
          <!-- 技能商店 -->
          <div v-if="shopTab === 'skills'" class="shop-list shop-grid-2">
            <div v-for="item in shopSkillsList" :key="item.id" :class="['shop-item', 'quality-rare']">
              <div class="shop-item-content">
                <div class="shop-item-header">
                  <span class="shop-item-icon">{{ item.icon }}</span>
                  <div class="shop-item-name">{{ item.name }}</div>
                </div>
                <div class="shop-item-desc">{{ item.desc }}</div>
                <div class="shop-item-stats">消耗：{{ item.cost }} | CD: {{ item.cd }}回合</div>
              </div>
              <div class="shop-item-footer">
                <div class="shop-item-price">💰 {{ item.price }}</div>
                <button class="btn-buy" @click="buySkill(item)" :disabled="(backpack[1001] || 0) < item.price">购买</button>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-close" @click="closePanel">关闭</button>
      </div>
    </div>

    <!-- 设置面板 -->
    <div v-if="activePanel === 'settings'" class="dialog-overlay visible" @click.self="closePanel">
      <div class="panel-dialog">
        <h3>设置</h3>
        <div class="panel-content">
          <div class="settings-buttons">
            <button class="nav-btn" @click="showResetConfirm">重置游戏</button>
          </div>
        </div>
        <button class="btn-close" @click="closePanel">关闭</button>
      </div>
    </div>

    <!-- 通用 Dialog -->
    <Dialog
      :visible="dialogVisible"
      :title="dialogTitle"
      :message="dialogMessage"
      :type="dialogType"
      :close-on-overlay="dialogCloseOnOverlay"
      :confirm-text="dialogConfirmText"
      :cancel-text="dialogCancelText"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
      @close="handleDialogClose"
    />
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import Dialog from './Dialog.vue'
import { WorldConfig } from '../config/WorldConfig'
import { SkillConfig } from '../config/SkillConfig'
import { ItemConfig } from '../config/ItemConfig'
import { EntityManager } from '../js/EntityManager'
import { SaveAPI, PlayerAPI, DBUtils, WorldProgressAPI } from '../js/LocalDB'
import { ItemDBAPI, itemsCache as globalItemsCache } from '../js/ItemDatabase'
import { getStatName } from '../utils/StatNameUtil'
import { getExpProgress } from '../js/ExpSystem.js'

export default {
  name: 'MainHub',
  components: {
    Dialog
  },
  props: {
    playerData: Object,
    backpackData: Object
  },
  emits: ['enter-battle', 'update-player', 'update-backpack'],
  setup(props, { emit }) {
    const activePanel = ref(null)
    const currentWorld = ref(null) // 初始为 null，需要玩家选择世界
    const currentLevel = ref(1)
    const shopTab = ref('equipment')
    const pendingStatPoints = reactive({}) // 待分配的属性点 { str: 2, int: 1 }
    
    // 难度选择相关
    const showDifficultyDialog = ref(false)
    const selectedDifficulty = ref('normal') // 'normal' 或 'hard'

    // 世界解锁状态 - 使用响应式对象
    const worldUnlocked = reactive({
      1: true,
      2: false,
      3: false
    })

    const player = reactive(props.playerData || {
      name: '主角',
      baseStats: { str: 5, int: 5, con: 5, agi: 5, level: 1 },
      stats: { maxHp: 100, maxResource: 50, pAtk: 10, def: 5, speed: 10, critRate: 0.05 },
      currentHp: 100,
      currentResource: 50,
      skills: [2001, 2002, 2003],
      equipment: { weapon: null, armor: null, accessory: null },
      statPoints: 10,
      gold: 500
    })
    
    const backpack = reactive(props.backpackData || {})

    // 计算属性 - 商店商品列表
    const shopEquipmentList = computed(() => getShopEquipmentList())
    const shopConstitutionList = computed(() => getShopConstitutionList())
    const shopSkillsList = computed(() => getShopSkillsList())

    // 存档相关
    const showSaveListFlag = ref(false)
    const saves = ref([])
    const saveActionType = ref('save')

    // 初始化游戏
    const initGame = async () => {
      // 确保第一个世界默认解锁（如果是新游戏）
      worldUnlocked[1] = true

      const playerData = await PlayerAPI.load()

      if (playerData) {
        // 有存档，读取存档数据
        await loadGame(playerData)
        // 从数据库读取后，恢复世界选择
        currentWorld.value = playerData.currentWorld || 1
        // 从世界进度数据库读取关卡
        const worldProgress = await WorldProgressAPI.load(currentWorld.value)
        currentLevel.value = worldProgress.level
      } else {
        // 没有存档，创建新游戏
        await newGame()
        // 新游戏默认选择第一个世界
        currentWorld.value = 1
        currentLevel.value = 1
        // 保存世界进度
        await WorldProgressAPI.reset(currentWorld.value)
      }

      // 保存世界选择
      await saveGame()

      console.log('[MainHub] 初始化完成:', { currentWorld: currentWorld.value, currentLevel: currentLevel.value })
    }

    // 加点 - 请求阶段
    const requestAddStat = (stat) => {
      if (player.statPoints <= 0) return
      
      // 从可用点数中扣除，加入待分配
      player.statPoints--
      if (!pendingStatPoints[stat]) pendingStatPoints[stat] = 0
      pendingStatPoints[stat]++
    }

    // 同步 HP/MP 到满值（在主页时保持满血）
    const syncFullHpMp = () => {
      player.currentHp = player.stats.maxHp
      player.currentResource = player.stats.maxResource
    }

    // 加点 - 确认生效
    const confirmAddStat = async () => {
      const statsToAdd = { ...pendingStatPoints }

      // 将待分配点数加到基础属性
      for (const [stat, count] of Object.entries(statsToAdd)) {
        player.baseStats[stat] += count
      }

      // 应用装备属性加成
      EntityManager.applyEquipment(player)
      // 在主页时 HP/MP 回满
      syncFullHpMp()
      
      // 先保存游戏到数据库
      await saveGame()
      
      // 然后通知 App.vue 更新数据（从数据库重新加载）
      emit('update-player')
      emit('update-backpack')

      // 清空待分配
      Object.keys(pendingStatPoints).forEach(key => {
        delete pendingStatPoints[key]
      })

      // 打印日志
      console.log('[MainHub] 加点完成:', {
        str: player.baseStats?.str,
        int: player.baseStats?.int,
        con: player.baseStats?.con,
        agi: player.baseStats?.agi,
        statPoints: player.statPoints,
        gold: backpack[1001],
        hp: `${player.currentHp}/${player.stats.maxHp}`
      })
    }

    // 加点 - 取消
    const cancelAddStat = () => {
      // 将待分配点数返还
      const totalPending = Object.values(pendingStatPoints).reduce((sum, count) => sum + count, 0)
      player.statPoints += totalPending
      
      // 清空待分配
      Object.keys(pendingStatPoints).forEach(key => {
        delete pendingStatPoints[key]
      })
      
      console.log('[MainHub] 取消加点:', { statPoints: player.statPoints })
    }

    // 加点 - 旧的加点方法（保留兼容性）
    const addBaseStat = async (stat) => {
      if (player.statPoints <= 0) return
      player.baseStats[stat]++
      player.statPoints--
      EntityManager.applyEquipment(player)
      // 在主页时 HP/MP 回满
      syncFullHpMp()
      // 先保存游戏到数据库
      await saveGame()
      // 然后通知 App.vue 更新数据（从数据库重新加载）
      emit('update-player')
      emit('update-backpack')
      console.log('[MainHub] 加点:', { [stat]: player.baseStats[stat], statPoints: player.statPoints, gold: backpack[1001], hp: `${player.currentHp}/${player.stats.maxHp}` })
    }

    // 选择世界
    const selectWorld = (worldId) => {
      if (!worldUnlocked[worldId]) return // 未解锁的世界不能选择

      currentWorld.value = worldId
      currentLevel.value = 1
      saveGame() // 保存世界选择
      console.log('[MainHub] 选择世界:', { world: worldId, level: currentLevel.value })
    }

    // 进入战斗 - 每次进入轮回世界都从第 1 关开始
    const handleEnterBattle = async () => {
      // 重置关卡为第 1 关，并保存到数据库
      currentLevel.value = 1
      await WorldProgressAPI.reset(currentWorld.value)

      const levelConfig = WorldConfig.getLevelConfig(currentWorld.value, currentLevel.value)
      if (!levelConfig) {
        showDialog('关卡配置不存在', '提示')
        return
      }

      await emit('update-backpack')

      console.log('[MainHub] 准备进入轮回世界:', { world: currentWorld.value, level: currentLevel.value })

      // 显示难度选择对话框
      selectedDifficulty.value = 'normal' // 默认普通难度
      showDifficultyDialog.value = true
    }

    // 确认难度选择
    const confirmDifficulty = async () => {
      showDifficultyDialog.value = false
      
      const levelConfig = WorldConfig.getLevelConfig(currentWorld.value, currentLevel.value)
      if (!levelConfig) {
        showDialog('关卡配置不存在', '提示')
        return
      }

      console.log('[MainHub] 进入轮回世界:', { 
        world: currentWorld.value, 
        level: currentLevel.value, 
        difficulty: selectedDifficulty.value,
        hp: player.currentHp 
      })

      emit('enter-battle', {
        worldId: currentWorld.value,
        level: currentLevel.value,
        levelConfig,
        difficulty: selectedDifficulty.value, // 传递难度
        playerData: {
          name: player.name,
          str: player.baseStats?.str,
          int: player.baseStats?.int,
          con: player.baseStats?.con,
          agi: player.baseStats?.agi,
          level: player.baseStats?.level,
          skills: player.skills,
          equipment: player.equipment
        }
      })
    }

    // 取消难度选择
    const cancelDifficulty = () => {
      showDifficultyDialog.value = false
      selectedDifficulty.value = 'normal'
    }

    // 显示面板
    const showPanel = (panelName) => {
      activePanel.value = panelName
      if (panelName === 'settings') {
        showSaveListFlag.value = false
      }
    }

    // 关闭面板
    const closePanel = () => {
      activePanel.value = null
      showSaveListFlag.value = false
    }

    // 获取技能
    const getSkill = (id) => SkillConfig.getSkill(id)

    // 获取物品
    const getItem = (id) => ItemConfig.getItem(id)

    // 获取物品品质类
    const getItemQualityClass = (id) => {
      const item = getItem(id)
      if (!item) return ''
      return `quality-${['common', 'rare', 'epic', 'legend'][item.quality]}`
    }

    // 根据物品对象获取品质类（用于商店商品）
    const getItemQualityByItem = (item) => {
      if (!item || item.quality === undefined) return 'common'
      return ['common', 'rare', 'epic', 'legend'][item.quality]
    }

    // 是否可以装备
    const canEquip = (id) => {
      const item = getItem(id)
      return item && ['weapon', 'armor', 'accessory'].includes(item.type)
    }

    // 是否消耗品
    const isConsumable = (id) => {
      const item = getItem(id)
      return item && item.type === 'consumable'
    }

    // 装备物品
    const equipItem = async (itemId) => {
      const item = getItem(itemId)
      if (!item || !canEquip(itemId)) return

      const currentEquip = player.equipment[item.type]
      if (currentEquip) {
        if (!backpack[currentEquip]) backpack[currentEquip] = 0
        backpack[currentEquip]++
      }

      if (!backpack[itemId]) backpack[itemId] = 0
      backpack[itemId]--
      if (backpack[itemId] <= 0) delete backpack[itemId]

      player.equipment[item.type] = itemId
      EntityManager.applyEquipment(player)
      // 在主页时 HP/MP 回满
      syncFullHpMp()

      // 先保存游戏到数据库（等待完成）
      await saveGame()

      // 然后通知 App.vue 更新数据（从数据库重新加载）
      emit('update-player')
      emit('update-backpack')

      console.log('[MainHub] 装备:', { item: item.name, slot: item.type, gold: backpack[1001], hp: `${player.currentHp}/${player.stats.maxHp}` })
    }

    // 使用物品
    const useItem = (itemId) => {
      const item = getItem(itemId)
      if (!item || item.type !== 'consumable') return

      if (item.effect.type === 'heal_hp') {
        player.currentHp = Math.min(player.stats.maxHp, player.currentHp + item.effect.value)
        backpack[itemId]--
        if (backpack[itemId] <= 0) delete backpack[itemId]
        emit('update-player', { ...player })
        emit('update-backpack')
        console.log('[MainHub] 使用物品:', { item: item.name, hp: player.currentHp, gold: backpack[1001] })
        showDialog(`使用了 ${item.name}，恢复了 ${item.effect.value} 点生命值`, '使用物品')
      }
    }

    // 打开装备详情
    const openEquipDetail = (slot) => {
      const itemId = player.equipment[slot]
      if (!itemId) {
        showDialog('该槽位没有装备', '提示')
        return
      }

      const item = getItem(itemId)
      if (!item) return

      let info = `${item.name} (${ItemConfig.getQualityName(item.quality)})\n`
      info += `${item.desc}\n\n`
      if (item.baseStats) {
        for (const [stat, value] of Object.entries(item.baseStats)) {
          info += `  ${getStatName(stat)}: ${value}\n`
        }
      }
      info += '\n点击确定卸下装备'
      
      showDialog(info, '装备详情', async () => {
        if (!backpack[itemId]) backpack[itemId] = 0
        backpack[itemId]++
        player.equipment[slot] = null
        EntityManager.applyEquipment(player)
        // 在主页时 HP/MP 回满
        syncFullHpMp()
        // 先保存游戏到数据库（等待完成）
        await saveGame()
        // 然后通知 App.vue 更新数据（从数据库重新加载）
        emit('update-player')
        emit('update-backpack')
      })
    }

    // 获取装备名称
    const getEquipName = (itemId) => {
      if (!itemId) return '无'
      const item = getItem(itemId)
      return item ? item.name : '无'
    }

    // 获取装备颜色
    const getEquipColor = (itemId) => {
      if (!itemId) return '#888'
      const item = getItem(itemId)
      return item ? ItemConfig.getQualityColor(item.quality) : '#888'
    }

    // 物品详情对话框状态
    const itemDetailVisible = ref(false)
    const selectedItemId = ref(null)
    const selectedItem = ref(null)

    // 背包格子相关方法
    // 将背包对象转换为数组以便按顺序显示
    const getBackpackItemsArray = () => {
      const items = Object.entries(backpack).map(([itemId, count]) => ({
        itemId: parseInt(itemId),
        count,
        item: getItem(parseInt(itemId))
      }))
      // 过滤掉数量为 0 的金币（ID: 1001）
      return items.filter(item => {
        if (item.itemId === 1001 && item.count <= 0) return false
        return true
      })
    }

    // 获取指定槽位的物品 ID
    const getSlotItemId = (slotIndex) => {
      const itemsArray = getBackpackItemsArray()
      const item = itemsArray[slotIndex - 1]
      return item ? item.itemId : null
    }

    // 获取指定槽位的物品
    const getSlotItem = (slotIndex) => {
      const itemsArray = getBackpackItemsArray()
      return itemsArray[slotIndex - 1] || null
    }

    // 获取指定槽位的物品数量
    const getSlotItemCount = (slotIndex) => {
      const itemsArray = getBackpackItemsArray()
      const item = itemsArray[slotIndex - 1]
      return item ? item.count : 0
    }

    // 槽位点击事件
    const onSlotClick = (slotIndex) => {
      const itemId = getSlotItemId(slotIndex)
      if (!itemId) return

      // 金币不触发对话框
      if (itemId === 1001) return

      selectedItemId.value = itemId
      selectedItem.value = getItem(itemId)
      itemDetailVisible.value = true
    }

    // 判断物品是否有等级（装备有等级，金币等消耗品无等级）
    const hasItemLevel = (itemId) => {
      const item = getItem(itemId)
      if (!item) return false
      // 有 baseStats 的物品表示有等级（装备类）
      return item.baseStats !== undefined && item.level !== undefined
    }

    // 关闭物品详情
    const closeItemDetail = () => {
      itemDetailVisible.value = false
      selectedItemId.value = null
      selectedItem.value = null
    }

    // 从详情对话框装备物品
    const equipItemFromDetail = async () => {
      if (selectedItemId.value) {
        await equipItem(selectedItemId.value)
        closeItemDetail()
      }
    }

    // 从详情对话框使用物品
    const useItemFromDetail = () => {
      if (selectedItemId.value) {
        useItem(selectedItemId.value)
        closeItemDetail()
      }
    }

    // 计算出售价格（品质的 1/3）
    // 如果物品有 price 字段，使用 price/3；否则根据品质计算基础价格
    const getSellPrice = (itemId) => {
      const item = getItem(itemId)
      if (!item) return 0

      // 金币不能出售
      if (itemId === 1001) return 0

      // 如果物品有 price 字段，使用原价的 1/3
      if (item.price && item.price > 0) {
        return Math.round(item.price / 3)
      }

      // 否则根据品质计算基础价格
      // 品质基础价格：普通 100, 优秀 300, 史诗 600, 传说 1000
      const basePrices = {
        0: 100,   // 普通品质
        1: 300,   // 优秀品质
        2: 600,   // 史诗品质
        3: 1000   // 传说品质
      }

      const quality = item.quality !== undefined ? item.quality : 0
      const basePrice = basePrices[quality] || basePrices[0]

      // 出售价格 = 基础价格 / 3
      return Math.round(basePrice / 3)
    }

    // 从详情对话框出售物品
    const sellItemFromDetail = async () => {
      if (!selectedItemId.value) return

      const item = getItem(selectedItemId.value)
      if (!item) return

      // 金币不能出售
      if (selectedItemId.value === 1001) {
        showDialog('金币无法出售！', '提示')
        return
      }

      const sellPrice = getSellPrice(selectedItemId.value)
      const itemCount = backpack[selectedItemId.value] || 1

      showDialog(
        `确定要出售 ${item.name} x${itemCount} 吗？\n\n可获得 💰 ${sellPrice * itemCount} 金币`,
        '确认出售',
        async () => {
          // 从背包移除物品
          delete backpack[selectedItemId.value]

          // 添加金币
          if (!backpack[1001]) backpack[1001] = 0
          backpack[1001] += sellPrice * itemCount

          // 保存游戏
          await saveGame()

          // 更新视图
          emit('update-backpack')

          // 关闭对话框
          closeItemDetail()

          console.log('[MainHub] 出售物品:', {
            item: item.name,
            count: itemCount,
            price: sellPrice,
            total: sellPrice * itemCount,
            gold: backpack[1001]
          })
        },
        null,
        'confirm'
      )
    }

    // 获取物品类型名称
    const getItemTypeName = (type) => {
      const typeMap = {
        weapon: '武器',
        armor: '防具',
        accessory: '饰品',
        consumable: '消耗品',
        other: '其他'
      }
      return typeMap[type] || '未知'
    }

    // 是否有待分配点数
    const hasPendingStatPoints = () => {
      return Object.keys(pendingStatPoints).length > 0
    }

    // 获取物品品质颜色
    const getItemQualityColor = (id) => {
      const item = getItem(id)
      if (!item) return '#fff'
      return ItemConfig.getQualityColor(item.quality)
    }

    // 商店商品列表 - 装备
    // 从物品数据库读取商店售卖的物品，确保数据同步
    const getShopEquipmentList = () => {
      const allItems = []
      
      // 从全局缓存读取所有物品
      const itemsCache = globalItemsCache || {}
      
      // 筛选出商店售卖的物品（ID 6000-6999 范围的装备）
      for (const id in itemsCache) {
        const item = itemsCache[id]
        if (item && 
            item.id >= 6000 && 
            item.id < 7000 && 
            (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory')) {
          allItems.push(item)
        }
      }
      
      // 按品质排序，方便显示
      return allItems.sort((a, b) => a.quality - b.quality)
    }

    // 商店商品列表 - 体质
    const getShopConstitutionList = () => {
      return [
        {
          id: 7001,
          name: '修真者体质',
          desc: '修炼真气的体质，蓝条变为真气',
          icon: '🧘',
          price: 5000,
          resourceType: 'qi',
          resourceName: '真气'
        },
        {
          id: 7002,
          name: '血族体质',
          desc: '吸血鬼的血统，蓝条变为血脉之力',
          icon: '🧛',
          price: 5000,
          resourceType: 'blood',
          resourceName: '血脉'
        },
        {
          id: 7003,
          name: '魔法师体质',
          desc: '天生的魔法亲和体质，蓝条变为魔法值',
          icon: '🧙',
          price: 5000,
          resourceType: 'mana',
          resourceName: '魔法值'
        }
      ]
    }

    // 商店商品列表 - 技能
    const getShopSkillsList = () => {
      return [
        { id: 1006, name: '重击', desc: '用巨大的力量重击敌人', icon: '💥', price: 800, cost: 15, cd: 3, skillCoeff: 2.0 },
        { id: 1007, name: '暗影箭', desc: '发射黑暗能量箭矢', icon: '🌑', price: 800, cost: 12, cd: 2, skillCoeff: 1.6 },
        { id: 1004, name: '背刺', desc: '从背后发动致命一击', icon: '🗡️', price: 1000, cost: 10, cd: 3, skillCoeff: 1.8, bonusCrit: 0.2 },
        { id: 1011, name: '狂暴', desc: '进入狂暴状态，提升攻击力', icon: '😠', price: 1200, cost: 20, cd: 5, skillCoeff: 0 },
        { id: 1005, name: '刺耳嚎叫', desc: '发出嚎叫降低敌人防御', icon: '📢', price: 1200, cost: 12, cd: 4, skillCoeff: 0.8 },
        { id: 2004, name: '连击', desc: '连续攻击两次', icon: '⚔️', price: 1500, cost: 12, cd: 3, skillCoeff: 0.8, extraAttacks: 2 },
        { id: 1008, name: '虚弱诅咒', desc: '诅咒敌人降低其攻击力', icon: '💀', price: 1500, cost: 15, cd: 5, skillCoeff: 0.5 },
        { id: 2005, name: '烈焰风暴', desc: '对全体敌人造成火焰伤害', icon: '🔥', price: 2000, cost: 25, cd: 5, skillCoeff: 1.0 },
        { id: 1009, name: '亡灵召唤', desc: '召唤亡灵助战', icon: '👻', price: 2000, cost: 25, cd: 6, skillCoeff: 0 },
        { id: 1010, name: '死亡凋零', desc: '大范围死亡魔法，持续伤害', icon: '☠️', price: 2500, cost: 30, cd: 5, skillCoeff: 1.2 },
        { id: 1012, name: '毁灭一击', desc: '倾尽全力的毁灭性攻击', icon: '💫', price: 3000, cost: 40, cd: 6, skillCoeff: 3.0 }
      ]
    }

    // 获取装备属性文本
    const getEquipmentStatsText = (baseStats) => {
      const parts = []
      for (const [stat, value] of Object.entries(baseStats)) {
        const sign = value >= 0 ? '+' : ''
        const statName = getStatName(stat)
        parts.push(`${statName}${sign}${value}`)
      }
      return parts.join(' | ')
    }

    // 购买物品
    const buyItem = async (item) => {
      const playerGold = backpack[1001] || 0
      if (playerGold < item.price) {
        showDialog('金币不足！', '提示')
        return
      }

      backpack[1001] -= item.price

      // 添加到背包
      if (!backpack[item.id]) {
        backpack[item.id] = 0
      }
      backpack[item.id]++

      // 先保存游戏到数据库（等待完成）
      await saveGame()

      // 通知 App.vue 更新数据（从数据库重新加载）
      emit('update-backpack')

      showDialog(`购买了 ${item.name}！\n物品已存入背包。`, '购买成功')
    }

    // 购买体质
    const buyConstitution = (item) => {
      const playerGold = backpack[1001] || 0
      if (playerGold < item.price) {
        showDialog('金币不足！', '提示')
        return
      }

      showDialog(`确定要购买 ${item.name} 吗？\n购买后将改变你的资源类型。`, '确认购买', () => {
        backpack[1001] -= item.price

        if (!player.constitution) {
          player.constitution = {}
        }
        player.constitution.type = item.id
        player.constitution.name = item.name
        player.constitution.resourceType = item.resourceType
        player.constitution.resourceName = item.resourceName

        emit('update-player', { ...player })
        emit('update-backpack')
        console.log('[MainHub] 购买体质:', { item: item.name, gold: backpack[1001], resource: item.resourceName })
        showDialog(`购买了 ${item.name}！\n你的资源类型已变更为${item.resourceName}。`, '购买成功')
      }, null, 'confirm')
    }

    // 购买技能
    const buySkill = async (item) => {
      const playerGold = backpack[1001] || 0
      if (playerGold < item.price) {
        showDialog('金币不足！', '提示')
        return
      }

      // 检查是否已学习该技能
      if (player.skills.includes(item.id)) {
        showDialog('你已经学会了这个技能！', '提示')
        return
      }

      showDialog(`确定要购买 ${item.name} 吗？\n购买后将学会这个技能。`, '确认购买', async () => {
        backpack[1001] -= item.price

        // 添加到技能列表
        player.skills.push(item.id)

        // 先保存游戏到数据库（等待完成）
        await saveGame()

        // 通知 App.vue 更新数据（从数据库重新加载）
        emit('update-player')
        emit('update-backpack')

        console.log('[MainHub] 购买技能:', { item: item.name, gold: backpack[1001], skills: player.skills })
        showDialog(`购买了 ${item.name}！\n你已学会这个技能。`, '购买成功')
      }, null, 'confirm')
    }

    // Dialog 状态
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const dialogMessage = ref('')
    const dialogType = ref('alert')
    const dialogCloseOnOverlay = ref(true)
    const dialogConfirmText = ref('确定')
    const dialogCancelText = ref('取消')
    const dialogCallback = ref(null)

    // Dialog 方法
    const showDialog = (message, title, onConfirm, onCancel, type = 'alert', closeOnOverlay = true, confirmText = '确定', cancelText = '取消') => {
      dialogVisible.value = true
      dialogTitle.value = title || '提示'
      dialogMessage.value = message
      dialogType.value = type
      dialogCloseOnOverlay.value = closeOnOverlay
      dialogConfirmText.value = confirmText
      dialogCancelText.value = cancelText
      dialogCallback.value = onConfirm
    }

    const handleDialogConfirm = () => {
      console.log('[MainHub] handleDialogConfirm 被调用')
      if (dialogCallback.value) {
        console.log('[MainHub] 执行回调')
        dialogCallback.value()
      }
      dialogVisible.value = false
      dialogCallback.value = null
    }

    const handleDialogCancel = () => {
      dialogVisible.value = false
      dialogCallback.value = null
    }

    const handleDialogClose = () => {
      dialogVisible.value = false
      dialogCallback.value = null
    }

    // 存档方法 - 创建完整状态快照
    const createSaveData = () => {
      // 深度克隆所有数据，确保是纯 JSON 对象
      // 手动构建背包对象，避免 Vue 响应式问题
      const backpackCopy = {}
      for (const [key, value] of Object.entries(backpack)) {
        backpackCopy[key] = value
      }

      return {
        // 玩家数据
        name: player.name,
        str: player.baseStats?.str,
        int: player.baseStats?.int,
        con: player.baseStats?.con,
        agi: player.baseStats?.agi,
        level: player.baseStats?.level,
        exp: player.exp || 0,
        stats: JSON.parse(JSON.stringify(player.stats)),
        currentHp: player.currentHp,
        currentResource: player.currentResource,
        skills: JSON.parse(JSON.stringify(player.skills)),
        equipment: JSON.parse(JSON.stringify(player.equipment)),
        statPoints: player.statPoints,
        constitution: player.constitution || null,
        // 世界数据
        currentWorld: currentWorld.value,
        currentLevel: currentLevel.value,
        // 背包数据（包含金币）
        backpack: backpackCopy,
        // 解锁的世界
        unlockedWorlds: JSON.parse(JSON.stringify(Object.keys(WorldConfig.worlds).filter(id => WorldConfig.worlds[id].unlocked)))
      }
    }

    // 保存游戏到数据库
    const saveGame = async () => {
      const saveData = createSaveData()
      await PlayerAPI.save(saveData)
      // 注意：不在这里调用 emit，由调用者自行决定是否需要更新视图
    }

    // 显示存档列表（已废弃，保留代码但不再使用）
    // const showSaveListForAction = async (actionType) => {
    //   saveActionType.value = actionType
    //   showSaveListFlag.value = true
    //   saves.value = await SaveAPI.getAll()
    // }

    // 处理已有存档的槽位点击（已废弃，保留代码但不再使用）
    // const handleExistingSaveClick = (save) => {
    //   if (saveActionType.value === 'save') {
    //     showDialog('确定要覆盖此存档吗？', '确认存档', () => {
    //       doSaveGame(save.slotIndex)
    //     }, null, 'confirm')
    //   } else {
    //     doLoadGame(save.slotIndex)
    //   }
    // }

    // 处理新存档点击（已废弃，保留代码但不再使用）
    // const handleNewSaveClick = (slotIndex) => {
    //   showDialog('确定要创建新存档吗？', '确认存档', () => {
    //     doSaveGame(slotIndex)
    //   }, null, 'confirm')
    // }

    // 执行存档 - 简化版：直接存档，成功后弹出成功对话框
    const doSaveGame = async (slotIndex) => {
      const saveData = createSaveData()
      await SaveAPI.save(slotIndex, saveData)
      showDialog('存档成功！\n时间：' + new Date().toLocaleString('zh-CN'), '存档成功')
      console.log('[MainHub] 存档成功:', { slot: slotIndex, time: new Date().toLocaleString('zh-CN') })
    }

    // 确认读档 - 弹出确认对话框
    const confirmLoadGame = (slotIndex) => {
      showDialog('确定要读取此存档吗？\n当前游戏进度将会丢失。', '确认读档', () => {
        doLoadGame(slotIndex)
      }, null, 'confirm')
    }

    // 执行读档 - 简化版：确认后直接读档
    const doLoadGame = async (slotIndex) => {
      const save = await SaveAPI.load(slotIndex)
      if (!save) {
        showDialog('存档不存在！', '提示')
        return
      }

      try {
        // 1. 完全清空并替换玩家数据
        const newPlayer = EntityManager.createPlayer(save)
        // 清空现有属性
        Object.keys(player).forEach(key => {
          delete player[key]
        })
        // 添加新数据
        Object.keys(newPlayer).forEach(key => {
          player[key] = newPlayer[key]
        })

        // 2. 完全清空并替换世界/关卡
        currentWorld.value = save.currentWorld || 1
        currentLevel.value = save.currentLevel || 1

        // 3. 完全清空并替换背包
        Object.keys(backpack).forEach(key => {
          delete backpack[key]
        })
        if (save.backpack) {
          Object.keys(save.backpack).forEach(key => {
            backpack[key] = save.backpack[key]
          })
        }

        // 4. 完全清空并替换解锁的世界
        Object.keys(WorldConfig.worlds).forEach(id => {
          WorldConfig.worlds[id].unlocked = false
        })
        if (save.unlockedWorlds) {
          save.unlockedWorlds.forEach(worldId => {
            if (WorldConfig.worlds[worldId]) {
              WorldConfig.worlds[worldId].unlocked = true
            }
          })
        }

        // 5. 应用装备属性加成
        EntityManager.applyEquipment(player)

        closePanel()
        emit('update-player', { ...player })
        emit('update-backpack', { ...backpack })
        showDialog(`读取存档成功！\n${new Date(save.saveTime).toLocaleString('zh-CN')}`, '读取成功')
        console.log('[MainHub] 读档成功:', { slot: slotIndex, time: new Date(save.saveTime).toLocaleString('zh-CN') })
      } catch (e) {
        showDialog(`读取存档失败：${e.message}`, '错误')
      }
    }

    // 获取所有存档
    const getAllSaves = async () => {
      return await SaveAPI.getAll()
    }

    // 根据索引获取存档
    const getSaveByIndex = (index) => {
      if (index < 0 || index >= saves.value.length) {
        return null
      }
      return saves.value[index]
    }

    // 确认删除存档
    const confirmDeleteSave = (slotIndex) => {
      showDialog('确定要删除这个存档吗？', '确认删除', () => {
        doDeleteSave(slotIndex)
      }, null, 'confirm')
    }

    // 执行删除存档
    const doDeleteSave = async (slotIndex) => {
      await SaveAPI.delete(slotIndex)
      saves.value = await SaveAPI.getAll()
      showDialog('存档已删除', '删除成功')
    }

    // 确认重置游戏
    const showResetConfirm = () => {
      showDialog('确定要重置游戏吗？所有进度将丢失！', '确认重置', () => {
        doResetGame()
      }, null, 'confirm')
    }

    // 执行重置游戏
    const doResetGame = async () => {
      // 清空数据库
      await DBUtils.clear()
      await initGame()
      closePanel()
      showDialog('游戏已重置', '重置成功')
    }

    const formatSaveTime = (timestamp) => {
      return new Date(timestamp).toLocaleString('zh-CN')
    }

    // 读取游戏 - 从 IndexedDB 读取
    const loadGame = async (playerData) => {
      if (!playerData) {
        playerData = await PlayerAPI.load()
      }

      if (!playerData) {
        await newGame()
        return
      }

      try {
        Object.assign(player, EntityManager.createPlayer(playerData))
        // 应用装备属性加成，计算正确的总属性
        EntityManager.applyEquipment(player)
        // 在主页时 HP/MP 回满（BUGFIX #024）
        player.currentHp = player.stats.maxHp
        player.currentResource = player.stats.maxResource
        Object.keys(backpack).forEach(key => delete backpack[key])
        Object.assign(backpack, playerData.backpack || {})

        // 恢复解锁的世界 - 使用响应式对象
        if (playerData.unlockedWorlds && playerData.unlockedWorlds.length > 0) {
          // 先重置所有世界为未解锁
          worldUnlocked[1] = false
          worldUnlocked[2] = false
          worldUnlocked[3] = false

          // 然后设置已解锁的世界
          for (const worldId of playerData.unlockedWorlds) {
            worldUnlocked[worldId] = true
          }
        } else {
          // 如果存档中没有解锁信息，默认解锁第一个世界
          worldUnlocked[1] = true
        }
      } catch (e) {
        console.error('读取存档失败:', e)
        await newGame()
      }
    }

    const newGame = async () => {
      // 重新加载物品缓存
      await ItemConfig.reloadCache()

      Object.assign(player, EntityManager.createPlayer({
        name: '主角',
        str: 5, int: 5, con: 5, agi: 5,
        level: 1,
        exp: 0,
        statPoints: 10,
        gold: 0,
        skills: SkillConfig.getPlayerStarterSkills()
      }))
      Object.keys(backpack).forEach(key => delete backpack[key])

      backpack[1001] = 500
      backpack[2001] = 1
      backpack[2002] = 1
      backpack[2101] = 1
      equipItem(2001)
      equipItem(2002)
      equipItem(2101)

      // 重置世界后 HP/MP 回满（修复多次 equipItem 导致 HP 被截断的问题）
      player.currentHp = player.stats.maxHp
      player.currentResource = player.stats.maxResource

      console.log('[MainHub] 新游戏:', {
        str: player.baseStats?.str,
        int: player.baseStats?.int,
        agi: player.baseStats?.agi,
        exp: player.exp,
        gold: backpack[1001],
        hp: `${player.currentHp}/${player.stats.maxHp}`
      })
    }

    // 初始化
    initGame()

    return {
      activePanel,
      currentWorld,
      currentLevel,
      worldUnlocked,
      player,
      backpack,
      dialogVisible,
      dialogTitle,
      dialogMessage,
      dialogType,
      dialogCloseOnOverlay,
      dialogConfirmText,
      dialogCancelText,
      itemDetailVisible,
      selectedItemId,
      selectedItem,
      shopTab,
      pendingStatPoints,
      showDifficultyDialog,
      selectedDifficulty,
      WorldConfig,
      ItemConfig,
      Math,
      getExpProgress,
      requestAddStat,
      confirmAddStat,
      cancelAddStat,
      addBaseStat,
      selectWorld,
      handleEnterBattle,
      confirmDifficulty,
      cancelDifficulty,
      showPanel,
      closePanel,
      getSkill,
      getItem,
      getItemQualityClass,
      getItemQualityByItem,
      getItemQualityColor,
      canEquip,
      isConsumable,
      equipItem,
      useItem,
      openEquipDetail,
      getEquipName,
      getEquipColor,
      getSlotItemId,
      getSlotItem,
      getSlotItemCount,
      onSlotClick,
      hasItemLevel,
      closeItemDetail,
      equipItemFromDetail,
      useItemFromDetail,
      getSellPrice,
      sellItemFromDetail,
      getItemTypeName,
      getStatName,
      hasPendingStatPoints,
      shopEquipmentList,
      shopConstitutionList,
      shopSkillsList,
      getShopEquipmentList,
      getShopConstitutionList,
      getShopSkillsList,
      getEquipmentStatsText,
      buyItem,
      buyConstitution,
      buySkill,
      showDialog,
      handleDialogConfirm,
      handleDialogCancel,
      handleDialogClose,
      saveGame,
      loadGame,
      newGame,
      doSaveGame,
      confirmLoadGame,
      showResetConfirm
    }
  }
}
</script>

<style lang="scss">
// 使用 @use 替代 @import（Sass 新版推荐）
@use '../styles/main.scss';
</style>
