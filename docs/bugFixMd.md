# 《轮回异界：放置探索》Bug 修复记录

## 文档说明

本文档记录游戏开发过程中发现并修复的所有 Bug，以及 UI/UX 改进记录。

**文档结构：**
- [Bug 修复记录](#bug-修复记录) - 按编号排序的所有 Bug 记录
- [待修复问题](#待修复问题) - 待处理的 Bug 列表
- [版本历史](#版本历史) - 版本发布记录（永远在文档最后）

---

## 索引目录

### 按功能分类

<details>
<summary><strong>🔧 架构重构 (6 个)</strong></summary>

- [Bug #004](#bug-004---项目架构升级-vue3--vite--electron) - Vue3 + Vite + Electron 重构
- [Bug #009](#bug-009---重构为主界面和战斗界面双组件架构) - 双组件架构重构
- [Bug #014](#bug-014---统一使用-indexedb-存储所有数据) - 统一 IndexedDB 存储
- [Bug #016](#bug-016---建立物品数据库系统) - 物品数据库系统
- [Bug #035](#bug-035---移除-itemconfig-冗余物品数据) - 移除冗余数据
- [Bug #044](#bug-044---移除-electron-相关内容及世界解锁状态响应式修复) - 移除 Electron

</details>

<details>
<summary><strong>💾 存档系统 (5 个)</strong></summary>

- [Bug #001](#bug-001---设置界面-ui-优化) - 设置 UI 优化，多存档系统
- [Bug #006](#bug-006---存档系统优化和删除功能修复) - 固定 3 个存档槽位
- [Bug #011](#bug-011---读档后装备状态不正确) - IndexedDB 数据克隆错误
- [Bug #012](#bug-012---读档后装备状态不正确) - 读档后装备状态不正确
- [Bug #013](#bug-013---存档数据格式不一致导致属性点丢失) - 存档数据格式不一致

</details>

<details>
<summary><strong>💬 Dialog 组件 (3 个)</strong></summary>

- [Bug #002](#bug-002---设置面板默认显示逻辑问题) - 设置面板显示逻辑
- [Bug #003](#bug-003---dialog-组件点击外部关闭功能) - Dialog 外部关闭
- [Bug #007](#bug-007---dialog-组件响应式问题和存档点击失效) - Dialog 响应式问题

</details>

<details>
<summary><strong>⚔️ 战斗系统 (12 个)</strong></summary>

- [Bug #008](#bug-008---战斗界面添加返回主页按钮) - 返回主页按钮
- [Bug #015](#bug-015---战斗胜利后缺少交互反馈) - 胜利交互反馈
- [Bug #017](#bug-017---战斗胜利后金币未正确更新到背包) - 金币更新
- [Bug #018](#bug-018---battlescreen-中-getitem-函数未定义错误) - getItem 未定义
- [Bug #019](#bug-019---战斗胜利后金币响应式更新失效) - 金币响应式
- [Bug #020](#bug-020---战斗胜利后金币没有自动存档) - 金币自动存档
- [Bug #021](#bug-021---战斗失败后缺少交互对话框) - 失败对话框
- [Bug #022](#bug-022---战斗失败后加点数据回退) - 加点数据回退
- [Bug #023](#bug-023---战斗结束后未弹出胜利对话框) - 胜利对话框
- [Bug #024](#bug-024---再次挑战时-hpmp-没有回满) - HP/MP 回满
- [Bug #027](#bug-027---怪物伤害过高) - 怪物伤害调整
- [Bug #045](#bug-045---战斗胜利后经验值未正确显示和保存) - 经验值显示

</details>

<details>
<summary><strong>🌍 轮回世界 (7 个)</strong></summary>

- [Bug #025](#bug-025---轮回世界选中效果消失) - 选中效果消失
- [Bug #026](#bug-026---未选择世界时可以进入战斗) - 未选择世界禁用进入按钮
- [Bug #028](#bug-028---轮回世界进入逻辑优化) - 进入逻辑优化
- [Bug #029](#bug-029---轮回世界进度存储优化) - 进度存储优化
- [Bug #041](#bug-041---加点后已选中的轮回世界变成-disabled) - 世界变成 disabled
- [Bug #042](#bug-042---重置游戏后没有默认选中第一个世界) - 重置后默认选择
- [Bug #043](#bug-043---重置游戏后轮回世界高亮-ui-没有即时更新) - 高亮 UI 不更新

</details>

<details>
<summary><strong>🎒 物品系统 (12 个)</strong></summary>

- [Bug #030](#bug-030---装备物品后数据加载失败) - 装备数据加载失败
- [Bug #031](#bug-031---商店购买装备逻辑优化) - 购买逻辑优化
- [Bug #032](#bug-032---购买物品后数据未正确保存) - 购买数据保存
- [Bug #033](#bug-033---商店购买的物品在背包中显示为空白) - 物品显示空白
- [Bug #034](#bug-034---装备卸下物品后-ui-不刷新) - UI 不刷新
- [Bug #035](#bug-035---移除-itemconfig-冗余物品数据) - 移除冗余数据
- [Bug #036](#bug-036---全面检查物品相关代码) - 代码审查
- [Bug #037](#bug-037---金币和初始装备-id-不存在导致名称显示空白) - 物品 ID 缺失
- [Bug #046](#bug-046---背包物品出售功能) - 物品出售功能
- [Bug #047](#bug-047---添加传奇品质物品) - 传奇品质装备
- [Bug #049](#bug-049---物品出售价格计算错误) - 出售价格修复
- [Bug #050](#bug-050---商店物品数据与背包不同步) - 商店数据同步

</details>

<details>
<summary><strong>📊 属性系统 (3 个)</strong></summary>

- [Bug #038](#bug-038---物品属性显示英文缩写而非中文名称) - 属性中文名显示
- [Bug #039](#bug-039---背包金币数量为-0-时不显示及装备详情属性显示中文) - 金币显示优化
- [Bug #040](#bug-040---属性名称配置独立-json-文件及公共方法封装) - 配置封装

</details>

<details>
<summary><strong>🔧 代码优化 (5 个)</strong></summary>

- [Bug #027](#bug-027---怪物伤害过高) - 怪物伤害调整
- [Bug #028](#bug-028---轮回世界进入逻辑优化) - 进入逻辑优化
- [Bug #029](#bug-029---轮回世界进度存储优化) - 进度存储优化
- [Bug #031](#bug-031---商店购买装备逻辑优化) - 购买逻辑优化
- [Bug #036](#bug-036---全面检查物品相关代码) - 代码审查
- [Bug #040](#bug-040---属性名称配置独立-json-文件及公共方法封装) - 配置封装
- [Bug #048](#bug-048---完善配置文件字段注释) - 配置注释完善

</details>

---

## Bug 修复记录

### Bug #001 - 设置界面 UI 优化

**日期**: 2026-03-07
**优先级**: P2
**类型**: UI/UX 改进

**问题描述**:

- 设置面板直接显示在主页上，占用过多空间
- 存档/读档功能单一，只有一个存档位
- 无法查看存档时间，不方便管理多个存档

**修复方案**:

1. 将设置面板改为按钮触发式弹窗
2. 新增多存档系统，支持无限存档位（受 localStorage 限制）
3. 存档列表显示：
   - 存档时间（格式化为中国时间格式）
   - 当前关卡信息（第 X 世界 - 第 X 关）
   - 角色等级
4. 每个存档支持操作：
   - 读取存档
   - 删除存档（带二次确认）

**修改文件**:

- `index.html` - 设置面板结构修改
- `css/style.css` - 新增存档列表样式
- `js/Game.js` - 新增存档管理逻辑

**测试结果**: ✓ 已通过

---

### Bug #002 - 设置面板默认显示逻辑问题

**日期**: 2026-03-07
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 点击设置按钮后，设置对话框没有正确弹出显示
- `showPanel` 方法中缺少 `settings` 情况的处理

**修复方案**:
在 `showPanel` 方法的 switch 语句中添加 `settings` 分支，确保：

1. 设置面板正确显示（移除 `hidden` 类）
2. 存档列表容器默认隐藏（点击"读取存档"按钮时才显示）

**修改文件**:

- `js/Game.js` - 修复 `showPanel` 方法

**测试结果**: ✓ 已通过

---

### Bug #003 - Dialog 组件点击外部关闭功能

**日期**: 2026-03-07
**优先级**: P2
**类型**: 功能改进

**问题描述**:

- Dialog 组件不支持点击外部遮罩关闭

**修复方案**:
在 Dialog.js 中添加点击事件监听，支持点击外部区域关闭对话框

**修改文件**:

- `js/Dialog.js` - 添加点击外部关闭逻辑

**测试结果**: ✓ 已通过

---

### Bug #004 - 项目架构升级 Vue3 + Vite + Electron

**日期**: 2026-03-08
**优先级**: P0
**类型**: 架构重构

**问题描述**:

- 原生 JS 项目结构不利于维护和扩展
- 不支持热更新，开发效率低
- 无法打包成桌面应用

**修复方案**:

1. 迁移到 Vue3 + Vite 架构
2. 使用 SCSS 替代 CSS
3. 集成 Electron 支持桌面应用打包
4. 重构所有组件为 Vue 组件
5. 模块化所有配置文件和 JS 逻辑

**修改文件**:

- 新建 `package.json` - 项目依赖配置
- 新建 `vite.config.js` - Vite 构建配置
- 新建 `electron/main.js` - Electron 主进程
- 新建 `electron/preload.js` - Electron 预加载脚本
- 新建 `src/main.js` - Vue 入口
- 新建 `src/App.vue` - 根组件
- 新建 `src/components/BattleScreen.vue` - 战斗界面组件
- 新建 `src/components/Dialog.vue` - 通用 Dialog 组件
- 新建 `src/styles/main.scss` - 主样式表
- 迁移 `src/config/*` - 游戏配置模块
- 迁移 `src/js/*` - 游戏逻辑模块

**测试结果**: ✓ 已通过

**启动方式**:

```bash
# 本地开发
npm run dev

# Electron 开发
npm run electron:dev

# 打包构建
npm run electron:build:win
```

---

### Bug #005 - Vue 重构后多个功能 Bug 修复

**日期**: 2026-03-08
**优先级**: P0
**类型**: 功能 Bug 集合

**问题描述**:

1. 点击重置游戏时 Dialog 组件无反应（失效）
2. 点击装备时不弹出对话框
3. 存档 UI 交互不符合预期
4. 读档 UI 交互不符合预期

**修复方案**:

#### 1. 重置游戏 Dialog 失效

- 原因：Dialog 组件的 emits 定义位置错误
- 修复：将 emits 定义移到 setup() 返回值外部

#### 2. 装备点击不弹对话框

- 原因：openEquipDetail 方法中 showDialog 调用参数错误
- 修复：修正 showDialog 方法调用，确保回调函数正确传递

#### 3. 存档 UI 交互重构

- 原设计：点击"新建存档"直接保存，点击"读取存档"显示列表
- 新设计：
  - 点击"存档"按钮 → 弹出存档列表
  - 点击已有存档 → 提示是否覆盖
  - 点击"新存档" → 提示是否创建新存档
  - 确认后执行存档操作

#### 4. 读档 UI 交互重构

- 原设计：列表中每个存档有"读取"和"删除"按钮
- 新设计：
  - 点击"读档"按钮 → 弹出存档列表（按时间倒序）
  - 每个存档右上角显示 × 删除图标
  - 点击 × → 提示是否删除
  - 点击存档 → 直接读取

**修改文件**:

- `src/App.vue` - 完整重构
  - 修复 showDialog 方法签名
  - 重构存档/读档 UI 和逻辑
  - 修复 openEquipDetail 方法
  - 修复 confirmResetGame 方法
- `src/components/Dialog.vue` - 修复 emits 定义
- `src/styles/main.scss` - 新增删除按钮样式和新存档槽位样式

**新增样式**:

```scss
.btn-delete-icon { ... }  // 存档删除按钮（×图标）
.save-slot.new-save { ... }  // 新存档槽位样式
```

**测试结果**: ✓ 已通过

---

### Bug #006 - 存档系统优化和删除功能修复

**日期**: 2026-03-08
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

1. 存档槽位数量不固定，需要固定为 3 个位置
2. 读档列表里的删除操作没有生效，确认删除后 UI 没有更新

**修复方案**:

#### 1. 固定存档槽位为 3 个

- 修改存档键名格式：`轮回异界_save_slot1`、`轮回异界_save_slot2`、`轮回异界_save_slot3`
- UI 显示固定 3 个槽位，有空槽位和已占用两种状态
- 空槽位显示"空槽位"和"暂无存档数据"
- 存档时点击空槽位直接创建新存档

#### 2. 修复删除操作 UI 不更新

- 原因：Vue 响应式更新没有触发
- 修复：在 `doDeleteSave` 方法中先清空 `saves.value`，然后通过 `setTimeout` 重新加载

**修改文件**:

- `src/App.vue` - 重构存档槽位逻辑
- `src/styles/main.scss` - 新增空槽位样式

**测试结果**: ✓ 已通过

---

### Bug #007 - Dialog 组件响应式问题和存档点击失效

**日期**: 2026-03-08
**优先级**: P0
**类型**: 功能 Bug 集合

**问题描述**:

1. 打开存档列表，点击存档没反应
2. 点击重置游戏没有弹出确认对话框

**问题原因**:

#### 1. Dialog 组件响应式问题

- 原因：使用 `reactive` 对象存储 Dialog 状态，函数回调在响应式更新时丢失
- Vue 3 的 `reactive` 对函数类型的响应式支持不完善

#### 2. 存档列表点击失效

- 原因：模板中直接访问 `saves[slotIndex - 1]` 在 Vue 模板中可能无法正确触发响应式更新
- 特别是在数组长度变化时

**修复方案**:

#### 1. 重构 Dialog 状态管理

将 `dialog` reactive 对象拆分为独立的 ref：

```javascript
// 修改前
const dialog = reactive({
  visible: false,
  title: "",
  onConfirm: null,
  // ...
});

// 修改后
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMessage = ref("");
const dialogOnConfirm = ref(null);
const dialogOnCancel = ref(null);
// ...
```

添加回调处理方法：

```javascript
const handleDialogConfirm = () => {
  if (dialogOnConfirm.value) {
    dialogOnConfirm.value();
  }
  dialogVisible.value = false;
  dialogOnConfirm.value = null;
};

const handleDialogCancel = () => {
  if (dialogOnCancel.value) {
    dialogOnCancel.value();
  }
  dialogVisible.value = false;
  dialogOnCancel.value = null;
};
```

#### 2. 添加安全的数组访问方法

```javascript
// 根据索引获取存档（安全访问）
const getSaveByIndex = (index) => {
  if (index < 0 || index >= saves.value.length) {
    return null;
  }
  return saves.value[index];
};
```

模板中使用：

```html
<div v-if="getSaveByIndex(slotIndex - 1)" class="save-slot-content">
  <button @click="handleExistingSaveClick(getSaveByIndex(slotIndex - 1))">
```

**修改文件**:

- `src/App.vue` - 完整重构 Dialog 状态管理和存档访问逻辑
  - 拆分 `dialog` reactive 为独立 ref
  - 添加 `handleDialogConfirm`、`handleDialogCancel`、`handleDialogClose` 方法
  - 添加 `getSaveByIndex` 方法
  - 更新模板中的 Dialog 组件绑定
  - 更新 return 语句

**测试结果**: ✓ 已通过

---

### Bug #008 - 战斗界面添加返回主页按钮

**日期**: 2026-03-08
**优先级**: P2
**类型**: 功能改进

**问题描述**:

- 战斗界面缺少返回主页的按钮，玩家无法主动放弃战斗

**修复方案**:

#### 1. 添加返回按钮

在战斗界面头部添加"返回主页"按钮，位于速度按钮左侧。

#### 2. 确认对话框

点击返回按钮时弹出确认对话框，防止误操作。

**修改文件**:

- `src/components/BattleScreen.vue` - 添加返回按钮和事件
- `src/App.vue` - 处理返回事件
- `src/styles/main.scss` - 添加返回按钮样式

**测试结果**: ✓ 已通过

---

### Bug #009 - 重构为主界面和战斗界面双组件架构

**日期**: 2026-03-08
**优先级**: P0
**类型**: 架构重构

**问题描述**:

- 之前使用 `v-if` 在同一组件内切换主界面和战斗界面
- 组件状态管理混乱，返回时状态恢复有问题
- 代码耦合度高，不利于维护

**修复方案**:

#### 1. 创建独立组件

- **MainHub.vue** - 主界面组件，包含所有主页功能
- **BattleScreen.vue** - 战斗界面组件，独立管理战斗逻辑
- **App.vue** - 容器组件，只负责组件切换和状态传递

#### 2. 组件通信

```
App.vue (容器)
├── MainHub.vue (主界面)
│   ├── @enter-battle → 进入战斗
│   ├── @update-player → 更新玩家数据
│   └── @update-backpack → 更新背包数据
└── BattleScreen.vue (战斗界面)
    ├── @battle-end → 战斗结束
    └── @return-hub → 返回主页
```

#### 3. 数据流

主界面 → 战斗界面:

- playerData (玩家数据)
- levelInfo (关卡信息)
- worldId (世界 ID)
- currentLevel (当前关卡)

战斗界面 → 主界面:

- battle-end (战斗结果，包含掉落物品)
- return-hub (返回主页事件)

**修改文件**:

- `src/components/MainHub.vue` - 新建，主界面组件
- `src/components/BattleScreen.vue` - 重构，战斗界面组件
- `src/components/App.vue` - 重构，容器组件
- `src/components/Dialog.vue` - 修复 emits 重复定义

**优势**:

1. 组件职责清晰，易于维护
2. 状态管理简单，数据流向明确
3. 返回主页时主界面组件状态保留
4. 战斗界面独立管理战斗逻辑，不污染主界面状态

**测试结果**: ✓ 已通过

---

### Bug #011 - 读档后装备状态不正确

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**错误信息**:

```
Uncaught (in promise) DataCloneError: Failed to execute 'put' on 'IDBObjectStore':
#<Object> could not be cloned.
```

**问题描述**:

- 使用 localForage 保存存档时报错
- IndexedDB 无法克隆包含函数、Symbol 或其他不可序列化属性的对象

**问题原因**:

- `createSaveData()` 返回的对象可能包含不可序列化的属性
- 玩家数据中的某些属性可能是响应式对象（Vue reactive）
- IndexedDB 要求数据必须是纯 JSON 可序列化的

**修复方案**:

#### 1. 确保数据纯 JSON 化

在保存到数据库前，使用 `JSON.parse(JSON.stringify())` 深度克隆：

```javascript
const createSaveData = () => {
  return {
    player: {
      // 深度克隆所有数据
      baseStats: JSON.parse(JSON.stringify(player.baseStats)),
      stats: JSON.parse(JSON.stringify(player.stats)),
      skills: JSON.parse(JSON.stringify(player.skills)),
      equipment: JSON.parse(JSON.stringify(player.equipment)),
      backpack: JSON.parse(JSON.stringify(backpack)),
      // ...
    },
  };
};
```

#### 2. 检查所有数据库交互

- `SaveAPI.save()` - 存档保存
- `PlayerAPI.save()` - 玩家数据保存
- `SettingsAPI.save()` - 设置保存

确保所有写入数据库的数据都是纯 JSON 对象。

**修改文件**:

- `src/components/MainHub.vue` - 数据序列化
- `src/js/LocalDB.js` - 添加 cleanData 函数

**测试结果**: ✓ 已通过

---

### Bug #012 - 读档后装备状态不正确

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 卸下装备后存档，此时装备在背包中
- 重新穿上装备后读档
- 读档后装备仍然穿着，但背包中没有卸下的装备
- 预期：读档后应该恢复到存档时的状态（装备卸下，在背包中）

**问题原因**:

1. 存档时没有保存完整状态快照
   - `stats` 属性没有保存
   - 数据没有深度克隆，可能引用响应式对象
2. 读档时没有完全覆盖当前状态
   - 使用 `Object.assign` 导致新旧数据混合
   - 没有清空现有数据就直接合并

**修复方案**:

#### 1. 存档时保存完整快照

```javascript
const createSaveData = () => {
  return {
    player: {
      // 深度克隆所有数据
      baseStats: JSON.parse(JSON.stringify(player.baseStats)),
      stats: JSON.parse(JSON.stringify(player.stats)),
      currentHp: player.currentHp,
      skills: JSON.parse(JSON.stringify(player.skills)),
      equipment: JSON.parse(JSON.stringify(player.equipment)),
      backpack: JSON.parse(JSON.stringify(backpack))
    },
    currentWorld: currentWorld.value,
    currentLevel: currentLevel.value,
    unlockedWorlds: [...]
  }
}
```

#### 2. 读档时完全覆盖

```javascript
const doLoadGame = async (slotIndex) => {
  const save = await SaveAPI.load(slotIndex);

  // 1. 完全清空并替换玩家数据
  const newPlayer = EntityManager.createPlayer(save.player);
  Object.keys(player).forEach((key) => delete player[key]);
  Object.keys(newPlayer).forEach((key) => (player[key] = newPlayer[key]));

  // 2. 完全清空并替换世界/关卡
  currentWorld.value = save.currentWorld;
  currentLevel.value = save.currentLevel;

  // 3. 完全清空并替换背包
  Object.keys(backpack).forEach((key) => delete backpack[key]);
  Object.keys(save.backpack).forEach(
    (key) => (backpack[key] = save.backpack[key]),
  );

  // 4. 完全清空并替换解锁的世界
  Object.keys(WorldConfig.worlds).forEach(
    (id) => (WorldConfig.worlds[id].unlocked = false),
  );
  save.unlockedWorlds.forEach((id) => (WorldConfig.worlds[id].unlocked = true));

  // 5. 应用装备属性加成
  EntityManager.applyEquipment(player);
};
```

**修改文件**:

- `src/components/MainHub.vue` - 重构 `createSaveData` 和 `doLoadGame` 函数

**测试结果**: ✓ 已通过

---

### Bug #013 - 存档数据格式不一致导致属性点丢失

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 玩家加点后存档，未分配点数正确减少，属性值正确增加
- 读档后，未分配点数重置为 10，属性值重置为初始值 5
- 存档数据没有正确同步到读档后的状态

**问题原因**:

#### 1. 存档数据格式不匹配

`createSaveData()` 保存的格式：

```javascript
{
  player: {
    baseStats: { str: 10, int: 5, con: 5, agi: 10, level: 1 },
    statPoints: 0,
    gold: 100
  }
}
```

但 `EntityManager.createPlayer()` 期望的格式：

```javascript
{
  str: 10, int: 5, con: 5, agi: 10, level: 1,
  statPoints: 0,
  gold: 100
}
```

导致读档时 `playerData.str` 等为 `undefined`，使用了默认值 5。

#### 2. 逻辑或运算符处理 0 值问题

```javascript
// 错误代码
statPoints: playerData.statPoints || 10;
gold: playerData.gold || 500;
```

当 `statPoints` 为 `0`（点数已用完）时，`0 || 10` 返回 `10`，因为 `0` 是 falsy 值。

**修复方案**:

#### 1. 修改存档数据格式

将 `baseStats` 展开为单独的属性：

```javascript
const createSaveData = () => {
  return {
    name: player.name,
    str: player.baseStats.str,
    int: player.baseStats.int,
    con: player.baseStats.con,
    agi: player.baseStats.agi,
    level: player.baseStats.level,
    statPoints: player.statPoints,
    gold: player.gold,
    // ...
  };
};
```

#### 2. 修复 EntityManager 的 0 值处理

```javascript
// 修改前
statPoints: playerData.statPoints || 10;
gold: playerData.gold || 500;

// 修改后
statPoints: playerData.statPoints !== undefined ? playerData.statPoints : 10;
gold: playerData.gold !== undefined ? playerData.gold : 500;
```

#### 3. 兼容旧存档格式

```javascript
const hasSeparateStats =
  playerData.str !== undefined || playerData.int !== undefined;
const hasBaseStats = playerData.baseStats !== undefined;

const baseStats = {
  str: hasSeparateStats
    ? playerData.str || 5
    : hasBaseStats
      ? playerData.baseStats?.str || 5
      : 5,
  // ...
};
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `createSaveData` 方法
- `src/js/EntityManager.js` - 修复 `createPlayer` 方法

**测试结果**: ✓ 已通过

---

### Bug #014 - 统一使用 IndexedDB 存储所有数据

**日期**: 2026-03-09
**优先级**: P0
**类型**: 架构重构

**问题描述**:

- 游戏混用 localStorage 和 IndexedDB 两种存储方式
- `loadGame()` 从 localStorage 读取旧数据
- `saveGame()` 保存到 IndexedDB
- 导致数据不同步，可能出现存档丢失或数据不一致

**问题原因**:

#### 1. 存储方式不统一

```javascript
// loadGame - 使用 localStorage
const saveStr = localStorage.getItem("轮回异界_save");
const saveData = JSON.parse(saveStr);

// saveGame - 使用 IndexedDB
await PlayerAPI.save(saveData);
```

#### 2. 数据格式不一致

- localStorage 存储的数据格式与 IndexedDB 不同
- 旧代码从 localStorage 读取后需要额外解析
- 新增功能（如体质、金币）在旧存档中不存在

**修复方案**:

#### 1. 统一使用 IndexedDB

所有数据读写都通过 IndexedDB (localForage 封装)：

```javascript
// 读取游戏 - 从 IndexedDB 读取
const loadGame = async () => {
  const playerData = await PlayerAPI.load();
  if (!playerData) {
    newGame();
    return;
  }
  Object.assign(player, EntityManager.createPlayer(playerData));
};

// 保存游戏到数据库
const saveGame = async () => {
  const saveData = createSaveData();
  await PlayerAPI.save(saveData);
};
```

#### 2. 扁平化数据结构

移除嵌套的 `player` 对象，直接存储扁平数据：

```javascript
// 修改前
const createSaveData = () => {
  return {
    player: {
      str: player.baseStats.str,
      // ...
    },
    currentWorld: currentWorld.value,
    backpack: [...]
  }
}

// 修改后
const createSaveData = () => {
  return {
    name: player.name,
    str: player.baseStats.str,
    int: player.baseStats.int,
    con: player.baseStats.con,
    agi: player.baseStats.agi,
    level: player.baseStats.level,
    statPoints: player.statPoints,
    gold: player.gold,
    constitution: player.constitution || null,
    currentWorld: currentWorld.value,
    currentLevel: currentLevel.value,
    backpack: JSON.parse(JSON.stringify(backpack)),
    unlockedWorlds: [...]
  }
}
```

#### 3. 统一存档读档接口

存档槽位读档也使用相同的数据格式：

```javascript
// doLoadGame - 从存档槽位读档
const doLoadGame = async (slotIndex) => {
  const save = await SaveAPI.load(slotIndex);
  // 直接传入 save 对象（扁平数据）到 createPlayer
  const newPlayer = EntityManager.createPlayer(save);
  // ...
};
```

**存储架构**:

```
所有数据 → IndexedDB (localForage)
├── PlayerAPI - 玩家实时数据
│   ├── 属性点、金币、装备
│   ├── 背包物品
│   ├── 当前世界/关卡
│   └── 解锁的世界
├── SaveAPI - 存档槽位数据 (3 个槽位)
│   ├── 存档 1
│   ├── 存档 2
│   └── 存档 3
└── SettingsAPI - 游戏设置
```

**数据流程**:

```
游戏启动 → loadGame() → PlayerAPI.load() → IndexedDB
                          ↓
                      没有数据 → newGame()

玩家操作 → saveGame() → PlayerAPI.save() → IndexedDB

手动存档 → SaveAPI.save(slotIndex) → IndexedDB (3 个槽位)
手动读档 → SaveAPI.load(slotIndex) → IndexedDB
```

**修改文件**:

- `src/components/MainHub.vue` - 重构 `loadGame`、`createSaveData`、`saveGame`、`doLoadGame` 函数
- `src/js/LocalDB.js` - 已有 PlayerAPI，无需修改

**优势**:

1. 统一存储方式，避免数据不同步
2. 扁平化数据结构，简化读取逻辑
3. IndexedDB 支持更大数据量，适合存储复杂游戏状态
4. 移除 localStorage 兼容代码，简化维护

**测试结果**: ✓ 已通过

**注意事项**:

- 首次更新后，旧的 localStorage 数据将不再生效
- 玩家需要重新开始游戏或使用新的存档系统
- 建议在游戏更新说明中提示玩家

---

### Bug #015 - 战斗胜利后缺少交互反馈

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能改进

**问题描述**:

- 战斗胜利后没有任何提示或交互
- 玩家不知道获得了多少金币和掉落物品
- 需要手动返回主页或继续下一关

**修复方案**:

#### 1. 添加战斗胜利对话框

战斗胜利后弹出对话框，显示：

- 恭喜获胜提示
- 获得的金币数量
- 掉落的装备和物品列表
- 两个按钮：「下一关」和「返回主页」

#### 2. 金币奖励系统

根据关卡和怪物数量计算金币奖励：

```javascript
const calculateGoldReward = () => {
  const baseGold = 10 * worldId; // 基础金币 = 10 × 世界 ID
  const monsterCount = monsters.length || 1;
  return baseGold * monsterCount;
};
```

#### 3. 进入下一关逻辑

点击「下一关」按钮后：

- 保存掉落物品和金币到玩家数据
- 关卡数 +1
- 重置玩家状态（满血满蓝）
- 自动进入下一关战斗

点击「返回主页」按钮后：

- 保存掉落物品和金币到玩家数据
- 返回主界面

**对话框示例**:

```
┌─────────────────────────┐
│      战斗胜利           │
├─────────────────────────┤
│ 恭喜获胜！              │
│                         │
│ 获得金币：💰 50         │
│                         │
│ 掉落物品：              │
│   🗡️ 钢制长剑 x1        │
│   🛡️ 铁制护甲 x1        │
│                         │
│  [下一关]  [返回主页]   │
└─────────────────────────┘
```

**修改文件**:

- `src/components/BattleScreen.vue` - 添加胜利对话框和相关逻辑
- `src/App.vue` - 处理战斗结束事件，添加金币和进入下一关逻辑

**代码示例**:

```javascript
// BattleScreen.vue - 生成胜利消息
if (result.win) {
  const drops = DropSystem.calculateDrops(...)
  const goldReward = calculateGoldReward()

  let message = `恭喜获胜！\n\n`
  message += `获得金币：💰 ${goldReward}\n\n`
  message += `掉落物品：\n`
  for (const drop of drops) {
    const item = getItem(drop.itemId)
    message += `  ${item.icon} ${item.name} x${drop.count}\n`
  }

  victoryMessage.value = message
  victoryDrops.value = drops
  victoryGold.value = goldReward
  showVictoryDialog.value = true
}
```

```javascript
// App.vue - 处理战斗结束
const handleBattleEnd = (result) => {
  if (result.win) {
    // 添加掉落物品到背包
    if (result.drops) {
      for (const drop of result.drops) {
        backpack[drop.itemId] = (backpack[drop.itemId] || 0) + drop.count;
      }
    }

    // 添加金币奖励
    if (result.gold) {
      player.gold += result.gold;
    }

    // 如果需要进入下一关
    if (result.goToNext) {
      goToNextLevel();
    }
  } else {
    // 战斗失败，返回主页
    isInBattle.value = false;
  }
};
```

**测试结果**: ✓ 已通过

---

### Bug #016 - 建立物品数据库系统

**日期**: 2026-03-09
**优先级**: P0
**类型**: 架构重构

**问题描述**:

- 物品数据硬编码在配置文件中，不易扩展
- 掉落系统没有统一的物品来源
- 需要建立独立的物品数据库来管理所有物品

**修复方案**:

#### 1. 创建物品数据库表

新建 `src/js/ItemDatabase.js` 模块，使用 IndexedDB 存储物品数据：

```javascript
const itemDB = localforage.createInstance({
  name: "轮回异界_物品",
  storeName: "items",
});
```

#### 2. 初始化基础物品

游戏首次启动时初始化 8 个基础物品：

| ID    | 名称       | 品质 | 类型     | 说明               |
| ----- | ---------- | ---- | -------- | ------------------ |
| 10001 | 钢制长剑   | 稀有 | 近战武器 | 精钢打造的长剑     |
| 10002 | 钢制弓箭   | 稀有 | 远程武器 | 精钢打造的弓箭     |
| 10003 | 锁子甲     | 稀有 | 防具     | 精铁编织的护甲     |
| 10004 | 钢制戒指   | 稀有 | 饰品     | 精钢打造的戒指     |
| 20001 | 玄铁长剑   | 史诗 | 近战武器 | 玄铁打造的传说长剑 |
| 20002 | 玄铁弓箭   | 史诗 | 远程武器 | 玄铁打造的传说弓箭 |
| 20003 | 黄金锁子甲 | 史诗 | 防具     | 黄金编织的神器护甲 |
| 20004 | 黄金戒指   | 史诗 | 饰品     | 黄金打造的神器戒指 |

#### 3. 物品掉落配置

```javascript
export const DropConfig = {
  RARE_DROP_RATE: 0.1, // 稀有品质 10%
  EPIC_DROP_RATE: 0.05, // 史诗品质 5%
  MAX_DROP_COUNT: 2, // 每个怪物最多掉落 2 件
};
```

#### 4. 掉落逻辑

```javascript
async calculateDrops(worldId = 1) {
  const drops = []
  const dropCount = Math.floor(Math.random() * MAX_DROP_COUNT) + 1

  for (let i = 0; i < dropCount; i++) {
    const roll = Math.random()
    let quality

    if (roll < EPIC_DROP_RATE) {
      quality = 2 // 史诗 (5%)
    } else if (roll < EPIC_DROP_RATE + RARE_DROP_RATE) {
      quality = 1 // 稀有 (10%)
    } else {
      continue // 无掉落 (85%)
    }

    // 从对应品质中随机选择
    const items = await getByQuality(quality)
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)]
      drops.push({ itemId: randomItem.id, count: 1 })
    }
  }

  return drops
}
```

**数据库结构**:

```
IndexedDB: 轮回异界_物品
└── Store: items
    ├── item_10001 - 钢制长剑
    ├── item_10002 - 钢制弓箭
    ├── item_10003 - 锁子甲
    ├── item_10004 - 钢制戒指
    ├── item_20001 - 玄铁长剑
    ├── item_20002 - 玄铁弓箭
    ├── item_20003 - 黄金锁子甲
    └── item_20004 - 黄金戒指
```

**API 接口**:

```javascript
ItemDBAPI.init(); // 初始化物品表
ItemDBAPI.save(item); // 保存物品
ItemDBAPI.load(itemId); // 读取物品
ItemDBAPI.getByQuality(q); // 按品质获取
ItemDBAPI.getByType(type); // 按类型获取
ItemDBAPI.getAll(); // 获取所有物品
DropConfig.calculateDrops(); // 计算掉落
```

**修改文件**:

- `src/js/ItemDatabase.js` - 新建物品数据库模块
- `src/js/DropSystem.js` - 更新掉落系统使用新数据库
- `src/App.vue` - 游戏启动时初始化物品数据库

**优势**:

1. 物品数据集中管理，易于扩展
2. 掉落系统统一从数据库抽取
3. 支持动态添加新物品
4. 品质掉率可配置（稀有 10%，史诗 5%）

**测试结果**: ✓ 已通过

---

### Bug #017 - 战斗胜利后金币未正确更新到背包

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 战斗胜利后获得金币，但背包中的金币数量没有更新
- 例如：原本有 500 金币，获得 10 金币后，应该显示 510，但实际没有变化
- 胜利对话框显示获得了金币，但数据没有正确同步

**问题原因**:

- `handleBattleEnd` 函数中直接修改了 `backpack` 对象
- 但没有调用 `updateBackpack` 触发响应式更新
- Vue 的 `reactive` 对象直接修改属性可能不触发视图更新

**修复方案**:

#### 修改前

```javascript
const handleBattleEnd = (result) => {
  if (result.win) {
    // 添加金币
    if (result.gold) {
      backpack[1001] += result.gold; // 直接修改，不触发更新
    }
    // 没有调用 updateBackpack
  }
};
```

#### 修改后

```javascript
const handleBattleEnd = (result) => {
  if (result.win) {
    // 添加金币
    if (result.gold) {
      if (!backpack[1001]) backpack[1001] = 0;
      backpack[1001] += result.gold;
    }

    // 触发背包更新事件，确保响应式更新
    updateBackpack({ ...backpack });
  }
};
```

**修改文件**:

- `src/App.vue` - 在 `handleBattleEnd` 函数中添加 `updateBackpack({ ...backpack })` 调用

**数据流程**:

```
战斗胜利 → BattleScreen emit battle-end
         ↓
    App.vue handleBattleEnd
         ↓
    修改 backpack[1001] += gold
         ↓
    调用 updateBackpack({ ...backpack })
         ↓
    MainHub 接收 update-backpack 事件
         ↓
    背包数据更新，视图刷新
```

**测试结果**: ✓ 已通过

---

### Bug #018 - BattleScreen 中 getItem 函数未定义错误

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**错误信息**:

```
BattleScreen.vue:266 Uncaught (in promise) ReferenceError: getItem is not defined
    at BattleScreen.vue:266:28
```

**问题描述**:

- 战斗胜利后显示掉落物品时报错
- `getItem` 函数在异步回调中无法访问
- 掉落物品名称和图标无法显示

**问题原因**:

- `getItem` 只在 return 语句中定义为 `getItem: ItemConfig.getItem`
- 在 setup() 顶层没有定义 `getItem` 函数
- 在 `onMounted` 的异步回调中使用时，作用域链无法正确访问

**修复方案**:

#### 在 setup 顶层定义 getItem

```javascript
const getSkill = (id) => SkillConfig.getSkill(id);
const getItem = (id) => ItemConfig.getItem(id);
```

**修改文件**:

- `src/components/BattleScreen.vue` - 在 setup() 中添加 `getItem` 函数定义

**测试结果**: ✓ 已通过

---

### Bug #019 - 战斗胜利后金币响应式更新失效

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 战斗胜利后获得金币，但背包和商店中的金币数量没有更新
- 控制台没有报错，但视图没有响应数据变化
- 金币数据实际已修改，但 Vue 没有触发视图更新

**修复方案**:

#### 修改 updateBackpack 函数

```javascript
// 修改前
const updateBackpack = (newData) => {
  Object.keys(backpack).forEach((key) => delete backpack[key]);
  Object.assign(backpack, newData); // 不触发响应式
};

// 修改后
const updateBackpack = (newData) => {
  Object.keys(backpack).forEach((key) => delete backpack[key]);
  for (const [key, value] of Object.entries(newData)) {
    backpack[key] = value; // 逐个赋值，触发响应式
  }
};
```

**修改文件**:

- `src/App.vue` - 修改 `updateBackpack` 函数，添加调试日志

**测试结果**: ✓ 已通过

---

### Bug #020 - 战斗胜利后金币没有自动存档

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 战斗胜利后获得金币，背包和商店中显示正确
- 但刷新页面后金币数量恢复到战斗前
- 金币没有保存到数据库

**修复方案**:

#### 在 updateBackpack 中添加自动存档

```javascript
const updateBackpack = (newData) => {
  Object.keys(backpack).forEach((key) => delete backpack[key]);
  for (const [key, value] of Object.entries(newData)) {
    backpack[key] = value;
  }
  // 自动存档
  saveGameToDB();
};
```

**修改文件**:

- `src/App.vue` - 在 `updateBackpack` 函数中添加自动存档调用

**测试结果**: ✓ 已通过

---

### Bug #021 - 战斗失败后缺少交互对话框

**日期**: 2026-03-09
**优先级**: P2
**类型**: 功能改进

**问题描述**:

- 战斗失败后直接返回主页，没有提示
- 玩家不知道失败原因
- 无法选择再次挑战

**修复方案**:

#### 添加战斗失败对话框

```html
<Dialog
  v-if="showDefeatDialog"
  :title="'战斗失败'"
  :message="'很遗憾，你被打败了！\n请再接再厉！'"
  :confirm-text="'再次挑战'"
  :cancel-text="'返回主页'"
  @confirm="retryBattle"
  @cancel="confirmReturn"
/>
```

**修改文件**:

- `src/components/BattleScreen.vue` - 添加失败对话框和 retryBattle 方法

**测试结果**: ✓ 已通过

---

### Bug #022 - 战斗失败后加点数据回退

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 战斗前将 10 点天赋点加到敏捷上
- 战斗失败返回主页后，未分配点数变回 10，敏捷变回 5
- 加点数据没有保存

**修复方案**:

#### 在进入战斗前保存游戏

```javascript
const handleEnterBattle = () => {
  // 进入战斗前先保存游戏，确保加点数据已保存
  saveGame()

  emit('enter-battle', { ... })
}
```

**修改文件**:

- `src/components/MainHub.vue` - 在 `handleEnterBattle` 函数中添加 `saveGame()` 调用

**测试结果**: ✓ 已通过

---

### Bug #023 - 战斗结束后未弹出胜利对话框

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 连续战斗的某一次，敌人已经死亡
- 没有正常弹出战斗胜利对话框
- 战斗场景卡住，无法继续

**修复方案**:

#### 在造成伤害后立即检查战斗结束

```javascript
// executeSingleSkill
await this.checkBattleEnd();

// executeAoESkill
await this.checkBattleEnd();
if (this.currentState === this.State.BATTLE_END) break;
```

**修改文件**:

- `src/js/TurnManager.js` - 在 `executeSingleSkill` 和 `executeAoESkill` 中添加战斗结束检查

**测试结果**: ✓ 已通过

---

### Bug #024 - 再次挑战时 HP/MP 没有回满

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 战斗失败后点击再次挑战
- 角色的 HP 和 MP 没有恢复到满值
- 应该像新战斗一样满状态开始

**修复方案**:

#### 在 retryBattle 中重置状态

```javascript
// 重置玩家状态 - HP 和 MP 回满
player.value.currentHp = player.value.stats.maxHp
player.value.currentResource = player.value.stats.maxResource

// 重置怪物状态
monsters.value = EntityManager.createLevelMonsters(...)
```

**修改文件**:

- `src/components/BattleScreen.vue` - 在 `retryBattle` 函数中添加状态重置

**测试结果**: ✓ 已通过

---

### Bug #025 - 轮回世界选中效果消失

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 第一个轮回世界的选中效果不显示
- 游戏启动后没有自动选择世界
- 需要手动点击才能选择

**修复方案**:

#### 初始化时自动选择第一个已解锁世界

```javascript
const initGame = () => {
  loadGame();
  // 默认选择第一个已解锁的世界
  const firstUnlockedWorld = Object.keys(WorldConfig.worlds).find(
    (id) => WorldConfig.worlds[id].unlocked,
  );
  if (firstUnlockedWorld) {
    currentWorld.value = parseInt(firstUnlockedWorld);
  }
};
```

**修改文件**:

- `src/components/MainHub.vue` - 在 `initGame` 函数中添加自动选择世界逻辑

**测试结果**: ✓ 已通过

---

### Bug #026 - 未选择世界时可以进入战斗

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 没有选择轮回世界时，进入按钮仍然可以点击
- 应该禁用进入按钮直到选择世界

**修复方案**:

#### 1. 修改初始值

```javascript
const currentWorld = ref(null); // 初始为 null，需要玩家选择
```

#### 2. 按钮禁用绑定

```vue
<button :disabled="!currentWorld" @click="handleEnterBattle">
  进入轮回世界
</button>
```

#### 3. 添加禁用样式

```scss
.btn-enter:disabled {
  background: linear-gradient(135deg, #666, #444);
  color: #888;
  cursor: not-allowed;
}
```

#### 4. 世界选择检查

```javascript
const selectWorld = (worldId) => {
  const world = WorldConfig.worlds[worldId];
  if (!world || !world.unlocked) return; // 未解锁不能选
  currentWorld.value = worldId;
};
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `currentWorld` 初始值和 `selectWorld` 函数
- `src/styles/main.scss` - 添加禁用按钮样式

**测试结果**: ✓ 已通过

---

### Bug #027 - 怪物伤害过高

**日期**: 2026-03-09
**优先级**: P1
**类型**: 数值调整

**问题描述**:

- 怪物造成的伤害过高
- 玩家难以承受怪物的攻击
- 需要降低怪物伤害以提高游戏体验

**修复方案**:

#### 1. 添加怪物伤害系数

```javascript
// StatCalculator.js
MONSTER_DAMAGE_MULTIPLIER: 0.4, // 怪物伤害调整为 40%
```

#### 2. 修改伤害计算函数

```javascript
// calculatePhysicalDamage 和 calculateMagicDamage
function calculateDamage(..., isMonster = false) {
  // ... 计算基础伤害

  // 如果是怪物造成的伤害，应用 40% 系数
  if (isMonster) {
    baseDamage *= this.MONSTER_DAMAGE_MULTIPLIER;
  }

  return { damage: ..., isCrit, isHit: true };
}
```

#### 3. 在 TurnManager 中判断攻击来源

```javascript
calculateDamage(attacker, defender, skill) {
  // 判断是否是怪物攻击
  const isMonster = attacker.type === 'monster';

  return StatCalculator.calculatePhysicalDamage(
    ..., isMonster
  );
}
```

**修改文件**:

- `src/js/StatCalculator.js` - 添加怪物伤害系数，修改伤害计算函数
- `src/js/TurnManager.js` - 在 `calculateDamage` 中添加攻击来源判断

**测试结果**: ✓ 已通过

---

### Bug #028 - 轮回世界进入逻辑优化

**日期**: 2026-03-09
**优先级**: P1
**类型**: 功能改进

**问题描述**:

- 轮回世界的关卡进度管理不够清晰
- 玩家期望每次进入轮回世界都从第 1 关开始
- 战斗失败后应该可以再次挑战当前关卡
- 返回主页后应该重置进度

**修复方案**:

#### 1. 进入轮回世界 - 总是从第 1 关开始

```javascript
// MainHub.vue - handleEnterBattle
const handleEnterBattle = async () => {
  // 重置关卡为第 1 关
  currentLevel.value = 1;

  const levelConfig = WorldConfig.getLevelConfig(
    currentWorld.value,
    currentLevel.value,
  );
  // ...
};
```

#### 2. 战斗失败 - 保留当前关卡，可再次挑战

```javascript
// App.vue - handleBattleEnd
if (!result.win) {
  // 战斗失败，不重置关卡，允许再次挑战当前关卡
  // 只重置 HP/MP 到满值（为再次挑战做准备）
  player.currentHp = player.stats.maxHp;
  player.currentResource = player.stats.maxResource;
  isInBattle.value = false;
}
```

#### 3. 返回主页 - 重置世界进度为第 1 关

```javascript
// App.vue - handleReturnHub
const handleReturnHub = async () => {
  await loadPlayerFromDB();
  player.currentHp = player.stats.maxHp;
  player.currentResource = player.stats.maxResource;
  // 重置当前世界进度为第 1 关
  currentLevel.value = 1;
  isInBattle.value = false;
};
```

**数据流程**:

```
1. 玩家进入轮回世界 → 从第 1 关开始
2. 战斗胜利 → 进入下一关（第 2 关、第 3 关...）
3. 战斗失败 → 可以选择：
   a. 再次挑战 → 从当前失败的关卡重新开始（HP/MP 回满）
   b. 返回主页 → 重置为第 1 关
4. 从主页再次进入 → 从第 1 关开始
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `handleEnterBattle` 函数
- `src/App.vue` - 修改 `handleBattleEnd` 和 `handleReturnHub` 函数

**测试结果**: ✓ 已通过

---

### Bug #029 - 轮回世界进度存储优化

**日期**: 2026-03-09
**优先级**: P0
**类型**: 架构重构

**问题描述**:

- 轮回世界的关卡进度存储在内存中，刷新页面后丢失
- 战斗失败后返回主页，进度重置逻辑不清晰
- 需要一个统一的进度管理系统

**修复方案**:

#### 1. 创建 WorldProgressAPI 模块

新建 `src/js/LocalDB.js` 中的 `WorldProgressAPI` 模块，使用 IndexedDB 存储每个世界的关卡进度：

```javascript
export const WorldProgressAPI = {
  // 保存世界进度
  async save(worldId, level) {
    const key = `worldProgress_world${worldId}`;
    const data = { worldId, level, updateTime: Date.now() };
    await db.setItem(key, data);
    return data;
  },

  // 读取世界进度
  async load(worldId) {
    const key = `worldProgress_world${worldId}`;
    const data = await db.getItem(key);
    return data || { worldId, level: 1 }; // 默认从第 1 关开始
  },

  // 重置世界进度为第 1 关
  async reset(worldId) {
    return await this.save(worldId, 1);
  },

  // 关卡 +1
  async nextLevel(worldId, currentLevel) {
    return await this.save(worldId, currentLevel + 1);
  },
};
```

#### 2. 进入轮回世界 - 重置为第 1 关

```javascript
// MainHub.vue - handleEnterBattle
const handleEnterBattle = async () => {
  // 重置关卡为第 1 关，并保存到数据库
  currentLevel.value = 1;
  await WorldProgressAPI.reset(currentWorld.value);
  // ...
};
```

#### 3. 战斗胜利 - 关卡 +1，保存进度

```javascript
// App.vue - handleGoToNext
const handleGoToNext = async () => {
  const nextLevel = currentLevel.value + 1;
  currentLevel.value = nextLevel;
  // 保存世界进度到数据库
  await WorldProgressAPI.save(currentWorld.value, nextLevel);
  // ...
};
```

#### 4. 战斗失败 - 保留当前关卡

```javascript
// App.vue - handleBattleEnd
if (!result.win) {
  // 战斗失败，不重置关卡，允许再次挑战当前关卡
  // 只重置 HP/MP 到满值（为再次挑战做准备）
  player.currentHp = player.stats.maxHp;
  player.currentResource = player.stats.maxResource;
  isInBattle.value = false;
}
```

#### 5. 返回主页 - 重置世界进度

```javascript
// App.vue - handleReturnHub
const handleReturnHub = async () => {
  await loadPlayerFromDB();
  player.currentHp = player.stats.maxHp;
  player.currentResource = player.stats.maxResource;
  // 重置世界进度为第 1 关，并保存到数据库
  currentLevel.value = 1;
  await WorldProgressAPI.reset(currentWorld.value);
  isInBattle.value = false;
};
```

**数据流程**:

```
1. 进入轮回世界 → 重置为第 1 关 → 保存到数据库
2. 战斗胜利 → 关卡 +1 → 保存到数据库
3. 战斗失败 → 保留当前关卡 → 可选择：
   a. 再次挑战 → 从当前关卡重新开始（HP/MP 满值）
   b. 返回主页 → 重置为第 1 关 → 保存到数据库
4. 游戏启动 → 从数据库读取世界进度
```

**存储架构**:

```
IndexedDB: 轮回异界
└── Store: worldProgress
    ├── worldProgress_world1 - 第 1 世界进度
    ├── worldProgress_world2 - 第 2 世界进度
    └── worldProgress_world3 - 第 3 世界进度
```

**修改文件**:

- `src/js/LocalDB.js` - 添加 `WorldProgressAPI` 模块
- `src/components/MainHub.vue` - 修改 `initGame` 和 `handleEnterBattle` 函数
- `src/App.vue` - 修改 `handleGoToNext`、`handleReturnHub` 和 `handleBattleEnd` 函数

**测试结果**: ✓ 已通过

---

### Bug #030 - 装备物品后数据加载失败

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 在物品栏里面装备物品时，并没有装备成功
- 装备物品后在 `loadPlayerFromDB()` 中打印出来的数据，除了 `gold` 和 `world` 其余全是 `undefined`
- 加点、购买装备等操作后也有同样的问题

**问题原因**:

#### 1. 数据格式不匹配

- `createSaveData()` 保存的数据是扁平化格式：

  ```javascript
  {
    name: '主角',
    str: 10,
    int: 10,
    con: 5,
    agi: 10,
    level: 1,
    // ...
  }
  ```

- 但 `loadPlayerFromDB()` 期望的是嵌套结构：

  ```javascript
  {
    name: '主角',
    baseStats: { str: 10, int: 10, con: 5, agi: 10, level: 1 },
    // ...
  }
  ```

- 使用 `Object.assign(player, playerData)` 直接合并，导致 `player.baseStats` 为 `undefined`

#### 2. 修改后没有先保存再加载

- `equipItem`、`confirmAddStat`、`addBaseStat`、`buyItem` 等函数在修改数据后：
  - 直接调用 `emit('update-player')` 触发 `loadPlayerFromDB()`
  - 但没有先调用 `saveGame()` 保存数据到数据库
  - 导致 `loadPlayerFromDB()` 从数据库加载的是旧数据

**修复方案**:

#### 1. 修复 loadPlayerFromDB() 数据重建逻辑

```javascript
const loadPlayerFromDB = async () => {
  const playerData = await PlayerAPI.load();
  if (playerData) {
    // 更新玩家数据 - 需要重建 baseStats 结构
    Object.keys(player).forEach((key) => delete player[key]);

    // 重建 baseStats 对象（数据库保存的是扁平化数据）
    player.name = playerData.name || "主角";
    player.baseStats = {
      str: playerData.str || 5,
      int: playerData.int || 5,
      con: playerData.con || 5,
      agi: playerData.agi || 5,
      level: playerData.level || 1,
    };
    player.stats = playerData.stats || {
      maxHp: 100,
      maxResource: 50,
      pAtk: 10,
      def: 5,
      speed: 10,
      critRate: 0.05,
    };
    player.currentHp = playerData.currentHp || player.stats.maxHp;
    player.currentResource =
      playerData.currentResource || player.stats.maxResource;
    player.skills = playerData.skills || [2001, 2002, 2003];
    player.equipment = playerData.equipment || {
      weapon: null,
      armor: null,
      accessory: null,
    };
    player.statPoints =
      playerData.statPoints !== undefined ? playerData.statPoints : 10;
    player.gold = playerData.gold !== undefined ? playerData.gold : 0;
    player.constitution = playerData.constitution || null;

    // ... 更新背包、世界等
  }
};
```

#### 2. 所有修改数据的操作都先保存再加载

```javascript
// 装备物品
const equipItem = (itemId) => {
  // ... 修改装备
  EntityManager.applyEquipment(player);
  syncFullHpMp();

  // 先保存游戏到数据库
  saveGame();

  // 然后通知 App.vue 更新数据（从数据库重新加载）
  emit("update-player");
  emit("update-backpack");
};

// 加点 - 确认生效
const confirmAddStat = async () => {
  // ... 修改属性
  EntityManager.applyEquipment(player);
  syncFullHpMp();

  // 先保存游戏到数据库
  await saveGame();

  // 然后通知 App.vue 更新数据
  emit("update-player");
  emit("update-backpack");
};

// 购买物品并装备
const buyItem = (item) => {
  if (["weapon", "armor", "accessory"].includes(item.type)) {
    showDialog(`购买了 ${item.name}！\n是否立即装备？`, "购买成功", () => {
      // ... 装备物品
      EntityManager.applyEquipment(player);
      syncFullHpMp();

      // 先保存游戏到数据库
      saveGame();

      // 然后通知 App.vue 更新数据
      emit("update-player");
      emit("update-backpack");
    });
  } else {
    // 先保存游戏到数据库
    saveGame();
    emit("update-backpack");
  }
};

// 卸下装备
const openEquipDetail = (slot) => {
  showDialog(info, "装备详情", () => {
    // ... 卸下装备
    EntityManager.applyEquipment(player);
    syncFullHpMp();

    // 先保存游戏到数据库
    saveGame();

    // 然后通知 App.vue 更新数据
    emit("update-player");
    emit("update-backpack");
  });
};
```

**修改文件**:

- `src/App.vue` - 修复 `loadPlayerFromDB()` 函数，正确重建 `baseStats` 对象
- `src/components/MainHub.vue` - 在所有修改数据的函数中添加 `saveGame()` 调用，确保先保存再加载

**测试结果**: ✓ 已通过

---

### Bug #031 - 商店购买装备逻辑优化

**日期**: 2026-03-09
**优先级**: P2
**类型**: 功能优化

**问题描述**:

- 商店购买装备时会询问是否立即装备
- 交互流程复杂，不符合常规 RPG 游戏习惯
- 用户期望购买后物品存入背包，需要时再从背包装备

**修复方案**:

#### 修改前流程

```
购买装备 → 扣除金币 → 物品存入背包 → 询问是否立即装备
       → 确认 → 卸下当前装备 → 装备新物品 → 旧装备存入背包
       → 取消 → 结束
```

#### 修改后流程

```
购买装备 → 扣除金币 → 物品存入背包 → 显示购买成功

背包装备 → 点击装备槽位/背包物品 → 打开详情 → 点击装备
         → 卸下当前装备（返回背包） → 装备新物品 → 同步更新数值
```

#### 代码修改

```javascript
// 购买物品 - 简化版
const buyItem = (item) => {
  const playerGold = backpack[1001] || 0;
  if (playerGold < item.price) {
    showDialog("金币不足！", "提示");
    return;
  }

  backpack[1001] -= item.price;

  // 添加到背包
  if (!backpack[item.id]) {
    backpack[item.id] = 0;
  }
  backpack[item.id]++;

  // 先保存游戏到数据库
  saveGame();

  // 通知 App.vue 更新数据
  emit("update-backpack");

  console.log("[MainHub] 购买物品:", { item: item.name, gold: backpack[1001] });
  showDialog(`购买了 ${item.name}！\n物品已存入背包。`, "购买成功");
};
```

#### 装备替换逻辑（已存在，无需修改）

```javascript
// 装备物品 - 自动替换
const equipItem = (itemId) => {
  const item = getItem(itemId);
  if (!item || !canEquip(itemId)) return;

  const currentEquip = player.equipment[item.type];
  // 如果有当前装备，先返回背包
  if (currentEquip) {
    if (!backpack[currentEquip]) backpack[currentEquip] = 0;
    backpack[currentEquip]++;
  }

  // 从背包移除要装备的物品
  if (!backpack[itemId]) backpack[itemId] = 0;
  backpack[itemId]--;
  if (backpack[itemId] <= 0) delete backpack[itemId];

  // 装备新物品
  player.equipment[item.type] = itemId;
  EntityManager.applyEquipment(player);
  syncFullHpMp();

  // 保存并同步数据
  saveGame();
  emit("update-player");
  emit("update-backpack");
};
```

**修改文件**:

- `src/components/MainHub.vue` - 简化 `buyItem` 函数，移除立即装备对话框

**测试结果**: ✓ 已通过

---

### Bug #032 - 购买物品后数据未正确保存

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 在商店购买物品后，物品没有正确存入背包
- 控制台显示购买后背包数据正确，但加载后只有金币，物品丢失
- 例如：购买铁制长剑后，背包中只有金币 500，没有铁制长剑

**问题原因**:

#### 异步执行顺序问题

```javascript
// 错误代码
const buyItem = (item) => {
  backpack[item.id]++; // 修改背包
  saveGame(); // 异步保存（未等待）
  emit("update-backpack"); // 立即触发加载
};
```

执行顺序：

1. `backpack[item.id]++` - 修改内存中的背包数据
2. `saveGame()` - 开始异步保存（**未完成**）
3. `emit('update-backpack')` - 立即触发 `loadPlayerFromDB()`
4. `loadPlayerFromDB()` - 从数据库加载（**此时保存未完成，加载的是旧数据**）
5. `saveGame()` 完成 - 数据已保存，但视图已加载旧数据

#### Vue 响应式对象序列化问题

- `JSON.parse(JSON.stringify(backpack))` 可能无法正确处理 Vue 响应式对象
- 需要使用 `for...of` 手动构建普通对象

**修复方案**:

#### 1. 使用 await 等待 saveGame 完成

```javascript
const buyItem = async (item) => {
  // ... 修改背包
  await saveGame(); // 等待保存完成
  emit("update-backpack"); // 再通知更新
};
```

#### 2. 手动构建背包对象，避免 Vue 响应式问题

```javascript
const createSaveData = () => {
  // 手动构建背包对象，避免 Vue 响应式问题
  const backpackCopy = {};
  for (const [key, value] of Object.entries(backpack)) {
    backpackCopy[key] = value;
  }

  return {
    // ...
    backpack: backpackCopy,
  };
};
```

#### 3. 添加调试日志

```javascript
const saveGame = async () => {
  const saveData = createSaveData();
  console.log("[MainHub] saveGame - 保存的数据:", {
    backpack: JSON.parse(JSON.stringify(saveData.backpack)),
    currentWorld: saveData.currentWorld,
    currentLevel: saveData.currentLevel,
  });
  await PlayerAPI.save(saveData);
  console.log("[MainHub] saveGame - 已保存到数据库");
};
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `buyItem` 为异步函数，添加 `await` 等待 `saveGame()` 完成
- `src/components/MainHub.vue` - 修改 `createSaveData` 手动构建背包对象
- `src/components/MainHub.vue` - 添加调试日志

**测试结果**: ✓ 已通过

**注意事项**:

- 所有调用 `saveGame()` 的地方都需要检查是否需要 `await`
- 确保数据保存完成后再触发视图更新

---

### Bug #033 - 商店购买的物品在背包中显示为空白

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 在商店购买物品后，打开背包看到的是一个空白块
- 物品数据没有显示，但可以点击
- 控制台显示 `getItem(itemId)` 返回 `null`

**问题原因**:

- 物品数据库 (`ItemDatabase.js`) 中没有定义商店售卖的物品 ID
- 商店配置中定义了 ID 为 6001-6004 的铁制装备（普通品质）
- 但物品数据库只定义了 ID 为 10001-10004（稀有）和 20001-20004（史诗）的物品
- `getItem(6001)` 返回 `null`，导致背包无法显示物品信息

**修复方案**:

#### 1. 在物品数据库中添加普通品质装备

```javascript
const baseItems = [
  // 普通品质武器 (quality: 0) - 商店售卖
  {
    id: 6001,
    name: "铁制长剑",
    desc: "普通的铁制长剑，适合近战",
    type: "weapon",
    weaponType: "melee",
    quality: 0,
    baseStats: { pAtk: 15, def: -2, str: 3 },
    icon: "🗡️",
    level: 5,
    price: 500,
  },
  {
    id: 6002,
    name: "铁制弓箭",
    desc: "普通的铁制弓箭，适合远程",
    type: "weapon",
    weaponType: "ranged",
    quality: 0,
    baseStats: { pAtk: 10, agi: 4, speed: 3 },
    icon: "🏹",
    level: 5,
    price: 500,
  },
  {
    id: 6003,
    name: "铁制护甲",
    desc: "普通的铁制护甲",
    type: "armor",
    quality: 0,
    baseStats: { def: 10, con: 3, hp: 50 },
    icon: "🦺",
    level: 5,
    price: 500,
  },
  {
    id: 6004,
    name: "铁制戒指",
    desc: "普通的铁制戒指",
    type: "accessory",
    quality: 0,
    baseStats: { hp: 30, int: 2 },
    icon: "💍",
    level: 5,
    price: 500,
  },
  // ... 其他物品
];
```

#### 2. 修改初始化逻辑，支持物品数据库更新

```javascript
async init() {
  const existingItems = await this.getAll()
  // 检查物品数量，如果不足 12 个则重新初始化（添加新物品）
  if (existingItems && existingItems.length >= 12) {
    console.log('[ItemDB] 物品数据库已有', existingItems.length, '个物品，跳过初始化')
    return existingItems
  }

  // 如果已有数据但不足，先清空
  if (existingItems && existingItems.length > 0) {
    await this.clearAll()
    console.log('[ItemDB] 清空旧物品数据，准备重新初始化')
  }

  // ... 初始化物品
}
```

**修改文件**:

- `src/js/ItemDatabase.js` - 添加普通品质装备 (ID 6001-6004)，修改初始化逻辑

**测试结果**: ✓ 已通过

**注意事项**:

- 首次运行后会清除旧的物品数据并重新初始化
- 物品数据库现在包含 12 个物品（4 个普通 + 4 个稀有 + 4 个史诗）

---

### Bug #034 - 装备/卸下物品后 UI 不刷新

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 在背包中点击装备物品，装备没有立即更新
- 在装备槽点击卸下物品，装备没有立即更新
- 需要刷新页面或重新打开背包才能看到变化

**问题原因**:

- `equipItem` 函数和卸下装备的回调中调用了 `saveGame()`
- `saveGame()` 是异步函数，但没有使用 `await` 等待
- 导致在数据保存完成前就触发了 `emit('update-player')` 和 `emit('update-backpack')`
- `loadPlayerFromDB()` 加载的是旧数据，UI 没有更新

**修复方案**:

#### 1. 修改 equipItem 为异步函数

```javascript
const equipItem = async (itemId) => {
  // ... 修改装备
  EntityManager.applyEquipment(player);
  syncFullHpMp();

  // 先保存游戏到数据库（等待完成）
  await saveGame();

  // 然后通知 App.vue 更新数据
  emit("update-player");
  emit("update-backpack");
};
```

#### 2. 修改卸下装备回调为异步

```javascript
showDialog(info, "装备详情", async () => {
  // ... 卸下装备
  EntityManager.applyEquipment(player);
  syncFullHpMp();

  // 先保存游戏到数据库（等待完成）
  await saveGame();

  // 然后通知 App.vue 更新数据
  emit("update-player");
  emit("update-backpack");
});
```

#### 3. 修改 equipItemFromDetail 为异步

```javascript
const equipItemFromDetail = async () => {
  if (selectedItemId.value) {
    await equipItem(selectedItemId.value);
    closeItemDetail();
  }
};
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `equipItem`、`openEquipDetail` 回调、`equipItemFromDetail` 为异步函数

**测试结果**: ✓ 已通过

---

### Bug #035 - 移除 ItemConfig 冗余物品数据

**日期**: 2026-03-09
**优先级**: P2
**类型**: 代码重构

**问题描述**:

- `ItemConfig.js` 和 `ItemDatabase.js` 都存储物品数据
- 造成数据冗余和维护困难
- 需要统一数据来源

**修复方案**:

#### 1. 简化 ItemConfig.js

- 移除硬编码的物品数据（约 200 行代码）
- 只保留品质配置常量（颜色、名称、倍率）
- `getItem()` 改为从 ItemDatabase 缓存读取

#### 2. 增强 ItemDatabase.js

- 添加物品缓存机制
- 添加 `getItem(itemId)` 同步方法（从缓存读取）
- 添加 `reloadCache()` 方法（重新加载缓存）
- 在 `save()` 和 `load()` 时自动更新缓存

#### 修改后架构

```
ItemDatabase.js (物品数据唯一来源)
├── IndexedDB 存储
├── 内存缓存 (itemsCache)
├── getItem(itemId) - 同步从缓存读取
├── load(itemId) - 异步从数据库读取并更新缓存
├── save(itemData) - 保存到数据库并更新缓存
└── reloadCache() - 重新加载缓存

ItemConfig.js (品质配置和工具方法)
├── qualityColors - 品质颜色
├── qualityNames - 品质名称
├── qualityMultipliers - 品质倍率
├── getItem(itemId) - 委托给 ItemDBAPI.getItem()
├── getQualityColor(quality) - 返回颜色
└── getQualityName(quality) - 返回名称
```

**修改文件**:

- `src/config/ItemConfig.js` - 移除硬编码物品数据，简化为品质配置
- `src/js/ItemDatabase.js` - 添加物品缓存机制

**优势**:

1. 数据来源统一，避免冲突
2. 减少代码冗余（删除约 200 行）
3. 缓存机制提高读取性能
4. 架构清晰，易于维护

**测试结果**: ✓ 已通过

---

### Bug #036 - 全面检查物品相关代码

**日期**: 2026-03-09
**优先级**: P1
**类型**: 代码审查

**检查范围**:
所有使用 `ItemConfig.getItem()` 和 `ItemDBAPI` 的文件

**检查结果**:

#### 1. ItemConfig.js

- `getItem(itemId)` → 委托给 `ItemDBAPI.getItem(itemId)` ✓
- `getQualityColor(quality)` → 直接返回常量 ✓
- `getQualityName(quality)` → 直接返回常量 ✓
- `reloadCache()` → 委托给 `ItemDBAPI.reloadCache()` ✓

#### 2. ItemDatabase.js

- `init()` → 初始化数据库并更新缓存 ✓
- `save(itemData)` → 保存到数据库并更新缓存 ✓
- `load(itemId)` → 从数据库读取并更新缓存 ✓
- `getItem(itemId)` → 从缓存同步读取 ✓
- `reloadCache()` → 重新加载缓存 ✓

#### 3. EntityManager.js

- `applyEquipment(player)` → 使用 `ItemConfig.getItem(equipId)` ✓
- 依赖缓存，需要确保初始化完成后再调用

#### 4. DropSystem.js

- `getItemInfo(itemId)` → 使用 `ItemConfig.getItem(itemId)` ✓
- `getQualityColor(quality)` → 使用 `ItemConfig.getQualityColor()` ✓
- `formatDropDisplay(drop)` → 依赖 `getItemInfo()` ✓

#### 5. MainHub.vue

- `getItem(id)` → 使用 `ItemConfig.getItem(id)` ✓
- 所有装备、卸下、购买操作都正确使用

#### 6. BattleScreen.vue

- `getItem(id)` → 使用 `ItemConfig.getItem(id)` ✓
- 战斗掉落显示正确使用

#### 7. App.vue

- 初始化顺序：`ItemDBAPI.init()` → `loadPlayerFromDB()` ✓
- 导入 `itemsCache` 用于调试 ✓

**修复内容**:

1. 导出 `itemsCache` 和 `isCacheInitialized` 供外部访问
2. 移除不必要的延迟等待（`setTimeout`）
3. 添加调试日志确认缓存初始化

**测试要点**:

- 游戏启动后检查控制台输出缓存物品数量（应为 12 个）
- 商店购买物品后背包能正确显示
- 装备/卸下物品后 UI 立即更新
- 战斗掉落能正确显示物品信息

**测试结果**: ✓ 已通过

---

### Bug #037 - 金币和初始装备 ID 不存在导致名称显示空白

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 数据配置表中金币的位置 name 变成空白了
- 初始的三件装备名称都变空白了
- 新游戏应该直接装备上三件初始装备，但显示为空白

**问题原因**:

#### 1. 物品数据库缺少必要物品

`ItemDatabase.js` 中定义的物品种类：

- 6001-6004: 普通品质商店装备
- 10001-10004: 稀有品质掉落装备
- 20001-20004: 史诗品质掉落装备

但 `newGame()` 函数中使用的物品 ID：

- 1001: 金币（不存在）
- 2001: 新手长剑（不存在）
- 2002: 新手护甲（不存在）
- 2101: 新手戒指（不存在）

#### 2. getItem() 返回 null

当访问不存在的物品 ID 时，`ItemConfig.getItem()` 返回 `null`，导致：

- 物品名称显示为空白
- 装备属性无法计算
- 背包中物品显示异常

**修复方案**:

#### 1. 在 ItemDatabase.js 中添加缺失物品

```javascript
const baseItems = [
  // 金币 (消耗品)
  {
    id: 1001,
    name: "金币",
    desc: "通用货币，用于购买物品",
    type: "consumable",
    quality: 0,
    icon: "💰",
    level: 1,
  },

  // 初始装备 - 新手套装 (quality: 0)
  {
    id: 2001,
    name: "新手长剑",
    desc: "新手赠送的长剑，适合近战",
    type: "weapon",
    weaponType: "melee",
    quality: 0,
    baseStats: { pAtk: 10, str: 2 },
    icon: "🗡️",
    level: 1,
  },
  {
    id: 2002,
    name: "新手护甲",
    desc: "新手赠送的护甲",
    type: "armor",
    quality: 0,
    baseStats: { def: 5, con: 2, hp: 30 },
    icon: "🦺",
    level: 1,
  },
  {
    id: 2101,
    name: "新手戒指",
    desc: "新手赠送的戒指",
    type: "accessory",
    quality: 0,
    baseStats: { hp: 20, int: 1 },
    icon: "💍",
    level: 1,
  },
  // ... 其他物品
];
```

#### 2. 更新初始化检查条件

```javascript
// 修改前
if (existingItems && existingItems.length >= 12) {

// 修改后
if (existingItems && existingItems.length >= 15) {
```

因为现在物品总数从 12 个增加到 15 个（1 金币 + 3 初始装备 + 4 普通 + 4 稀有 + 3 史诗）。

**修改文件**:

- `src/js/ItemDatabase.js` - 添加金币和初始装备物品数据

**物品列表**:
| ID | 名称 | 类型 | 品质 | 说明 |
|----|------|------|------|------|
| 1001 | 金币 | 消耗品 | 普通 | 通用货币 |
| 2001 | 新手长剑 | 近战武器 | 普通 | pAtk+10, str+2 |
| 2002 | 新手护甲 | 防具 | 普通 | def+5, con+2, hp+30 |
| 2101 | 新手戒指 | 饰品 | 普通 | hp+20, int+1 |

**测试结果**: ✓ 已通过

**注意事项**:

- 新游戏时会自动装备三件初始装备
- 金币 ID 1001 用于战斗奖励和商店交易
- 物品数据库初始化时会检查物品数量，不足 15 个会重新初始化

---

### Bug #038 - 物品属性显示英文缩写而非中文名称

**日期**: 2026-03-09
**优先级**: P1
**类型**: UI Bug

**问题描述**:

- 物品详情对话框中，属性字段显示英文缩写如 `def`、`pAtk`
- 应该显示中文名称如 `防御力 `、` 攻击力`

**问题原因**:
`getStatName` 函数中缺少部分属性的映射：

- `hp`: 生命值
- `con`: 体质
- `res`: 魔抗
- `regen`: 回复
- `crit`: 暴击

**修复方案**:

#### 更新 getStatName 函数

```javascript
const getStatName = (stat) => {
  const statMap = {
    str: "力量",
    int: "智力",
    con: "体质",
    agi: "敏捷",
    maxHp: "最大生命",
    maxResource: "最大资源",
    pAtk: "攻击力",
    def: "防御力",
    hp: "生命值",
    speed: "速度",
    critRate: "暴击率",
    res: "魔抗",
    regen: "回复",
    crit: "暴击",
  };
  return statMap[stat] || stat;
};
```

**修改文件**:

- `src/components/MainHub.vue` - 完善 `getStatName` 函数的属性映射

**属性映射表**:
| 英文 | 中文 |
|------|------|
| str | 力量 |
| int | 智力 |
| con | 体质 |
| agi | 敏捷 |
| pAtk | 攻击力 |
| def | 防御力 |
| hp | 生命值 |
| maxHp | 最大生命 |
| maxResource | 最大资源 |
| speed | 速度 |
| critRate | 暴击率 |
| res | 魔抗 |
| regen | 回复 |
| crit | 暴击 |

**测试结果**: ✓ 已通过

---

### Bug #039 - 背包金币数量为 0 时不显示及装备详情属性显示中文

**日期**: 2026-03-09
**优先级**: P2
**类型**: UI 优化

**问题描述**:

1. 金币数量为 0 时仍然显示在背包中，占用格子
2. 点击装备查看详情并卸下时，对话框中属性显示英文 key 而非中文

**修复方案**:

#### 1. 背包金币过滤

修改 `getBackpackItemsArray` 函数，过滤掉数量为 0 的金币：

```javascript
const getBackpackItemsArray = () => {
  const items = Object.entries(backpack).map(([itemId, count]) => ({
    itemId: parseInt(itemId),
    count,
    item: getItem(parseInt(itemId)),
  }));
  // 过滤掉数量为 0 的金币（ID: 1001）
  return items.filter((item) => {
    if (item.itemId === 1001 && item.count <= 0) return false;
    return true;
  });
};
```

#### 2. 装备详情属性显示中文

修改 `openEquipDetail` 函数中的属性显示：

```javascript
// 修改前
for (const [stat, value] of Object.entries(item.baseStats)) {
  info += `  ${stat}: ${value}\n`;
}

// 修改后
for (const [stat, value] of Object.entries(item.baseStats)) {
  info += `  ${getStatName(stat)}: ${value}\n`;
}
```

**修改文件**:

- `src/components/MainHub.vue` - `getBackpackItemsArray`、`openEquipDetail` 函数

**测试结果**: ✓ 已通过

---

### Bug #040 - 属性名称配置独立 JSON 文件及公共方法封装

**日期**: 2026-03-09
**优先级**: P2
**类型**: 代码优化

**优化说明**:

- 将属性名称映射从组件中提取出来，独立为 JSON 配置文件
- 封装公共工具方法，方便在多个地方复用
- 便于后续维护和扩展，添加新属性时只需修改配置文件

**修复方案**:

#### 1. 新建属性名称配置文件

`src/config/StatNameConfig.json`:

```json
{
  "str": "力量",
  "int": "智力",
  "con": "体质",
  "agi": "敏捷",
  "maxHp": "最大生命",
  "maxResource": "最大资源",
  "pAtk": "攻击力",
  "def": "防御力",
  "hp": "生命值",
  "speed": "速度",
  "critRate": "暴击率",
  "res": "魔抗",
  "regen": "回复",
  "crit": "暴击"
}
```

#### 2. 新建工具方法模块

`src/utils/StatNameUtil.js`:

```javascript
import statNameMap from "../config/StatNameConfig.json";

export const getStatName = (stat) => {
  return statNameMap[stat] || stat;
};

export const getAllStatNames = () => {
  return { ...statNameMap };
};

export const setStatName = (stat, name) => {
  statNameMap[stat] = name;
};

export default { getStatName, getAllStatNames, setStatName };
```

#### 3. 更新调用方

在 `MainHub.vue` 中：

```javascript
// 导入
import { getStatName } from "../utils/StatNameUtil";

// 使用
const statName = getStatName(stat);
```

**修改文件**:

- `src/config/StatNameConfig.json` - 新建
- `src/utils/StatNameUtil.js` - 新建
- `src/components/MainHub.vue` - 移除本地 `getStatName` 函数，改用工具方法

**优势**:

1. 配置与代码分离，易于维护
2. 公共方法复用，减少代码重复
3. 添加新属性时只需修改 JSON 配置文件

**测试结果**: ✓ 已通过

---

### Bug #041 - 加点后已选中的轮回世界变成 disabled

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 玩家选择轮回世界后，进入按钮已启用
- 进行加点操作并确认后
- 已高亮选中的轮回世界变成 disabled 状态，进入按钮也变回禁用

**问题原因**:

#### 1. selectWorld 函数没有保存世界选择

```javascript
const selectWorld = (worldId) => {
  currentWorld.value = worldId;
  currentLevel.value = 1;
  // 缺少 saveGame() 调用
};
```

#### 2. initGame 函数没有保存初始化后的世界

```javascript
const initGame = () => {
  // ...
  currentWorld.value = parseInt(firstUnlockedWorld);
  // 缺少 saveGame() 调用
};
```

#### 3. 数据流问题

1. 玩家选择世界 → `currentWorld.value` 被设置（但未保存到数据库）
2. 玩家加点 → `confirmAddStat` 调用 `saveGame()` 保存数据
3. 然后调用 `emit('update-player')` 从数据库重新加载
4. `loadPlayerFromDB` 从数据库读取 `currentWorld`，但数据库中是 `null` 或旧值
5. 导致 `currentWorld.value` 被重置为 `null` 或旧值

**修复方案**:

#### 1. selectWorld 函数添加保存

```javascript
const selectWorld = (worldId) => {
  const world = WorldConfig.worlds[worldId];
  if (!world || !world.unlocked) return;

  currentWorld.value = worldId;
  currentLevel.value = 1;
  saveGame(); // 保存世界选择
  console.log("[MainHub] 选择世界:", {
    world: worldId,
    level: currentLevel.value,
  });
};
```

#### 2. initGame 函数改为异步并添加保存

```javascript
const initGame = async () => {
  // 确保第一个世界默认解锁
  if (WorldConfig.worlds[1] && !WorldConfig.worlds[1].unlocked) {
    WorldConfig.worlds[1].unlocked = true;
  }

  await loadGame();

  // 默认选择第一个已解锁的世界
  const firstUnlockedWorld = Object.keys(WorldConfig.worlds).find(
    (id) => WorldConfig.worlds[id].unlocked,
  );
  if (firstUnlockedWorld) {
    currentWorld.value = parseInt(firstUnlockedWorld);
  } else {
    currentWorld.value = 1;
  }

  // 保存世界选择
  await saveGame();
};
```

**修改文件**:

- `src/components/MainHub.vue` - `selectWorld`、`initGame` 函数

**数据流程**:

```
玩家选择世界 → selectWorld()
            ↓
    currentWorld.value = worldId
            ↓
    saveGame() → 保存到数据库
            ↓
玩家加点 → confirmAddStat()
            ↓
    saveGame() → 保存完整数据（包含 currentWorld）
            ↓
    emit('update-player')
            ↓
    loadPlayerFromDB() → 从数据库读取
            ↓
    currentWorld.value = playerData.currentWorld ✓
```

**测试结果**: ✓ 已通过

---

### Bug #042 - 重置游戏后没有默认选中第一个世界

**日期**: 2026-03-09
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 点击重置游戏后
- 轮回世界没有默认选中第一个已解锁的世界
- 进入按钮处于禁用状态

**问题原因**:

#### 1. doResetGame 没有等待 initGame 完成

```javascript
const doResetGame = async () => {
  await DBUtils.clear();
  initGame(); // 没有 await，异步操作未等待完成
  closePanel();
  showDialog("游戏已重置", "重置成功");
};
```

#### 2. initGame 逻辑问题

```javascript
const initGame = async () => {
  await loadGame(); // loadGame 在没有存档时会调用 newGame()
  // ...
};
```

`loadGame()` 在没有存档时会调用 `newGame()`，但：

- `newGame()` 中调用了 `emit('update-backpack')`
- `emit('update-backpack')` 触发 `App.vue` 的 `updateBackpack()` → `loadPlayerFromDB()`
- 此时数据库刚被清空，`loadPlayerFromDB()` 读取不到数据
- 导致 `currentWorld.value` 被重置

#### 3. loadGame 和 newGame 没有 await

```javascript
const loadGame = async () => {
  if (!playerData) {
    newGame(); // 没有 await
    return;
  }
};
```

**修复方案**:

#### 1. doResetGame 添加 await

```javascript
const doResetGame = async () => {
  await DBUtils.clear();
  await initGame(); // 等待异步操作完成
  closePanel();
  showDialog("游戏已重置", "重置成功");
};
```

#### 2. 重构 initGame 函数

```javascript
const initGame = async () => {
  // 确保第一个世界默认解锁
  if (WorldConfig.worlds[1] && !WorldConfig.worlds[1].unlocked) {
    WorldConfig.worlds[1].unlocked = true;
  }

  const playerData = await PlayerAPI.load();

  if (playerData) {
    // 有存档，读取存档数据
    await loadGame();
  } else {
    // 没有存档，创建新游戏
    await newGame();
  }

  // 默认选择第一个已解锁的世界
  const firstUnlockedWorld = Object.keys(WorldConfig.worlds).find(
    (id) => WorldConfig.worlds[id].unlocked,
  );
  if (firstUnlockedWorld) {
    currentWorld.value = parseInt(firstUnlockedWorld);
  } else {
    currentWorld.value = 1;
  }

  // 保存世界选择
  await saveGame();
};
```

#### 3. newGame 移除 emit 调用

```javascript
const newGame = async () => {
  // ...
  player.currentHp = player.stats.maxHp;
  player.currentResource = player.stats.maxResource;
  // 移除 emit('update-backpack')
};
```

#### 4. loadGame 添加 await

```javascript
const loadGame = async () => {
  const playerData = await PlayerAPI.load();
  if (!playerData) {
    await newGame(); // 添加 await
    return;
  }
  // ...
};
```

**修改文件**:

- `src/components/MainHub.vue` - `initGame`、`loadGame`、`newGame`、`doResetGame` 函数

**测试结果**: ✓ 已通过

---

### Bug #043 - 重置游戏后轮回世界高亮 UI 没有即时更新

**日期**: 2026-03-09
**优先级**: P1
**类型**: UI Bug

**问题描述**:

- 重置游戏后，第一个轮回世界应该默认高亮选中
- 但实际 UI 没有即时更新，高亮没有生效
- 需要手动点击或其他操作后才显示选中状态

**问题原因**:

#### 1. initGame 中世界选择逻辑混乱

```javascript
const initGame = async () => {
  await loadGame() // loadGame 内部可能设置 currentWorld
  // 然后又设置一次
  const firstUnlockedWorld = ...
  currentWorld.value = parseInt(firstUnlockedWorld)
}
```

#### 2. loadGame 和 newGame 也设置 currentWorld

- `loadGame` 中：`currentWorld.value = playerData.currentWorld || 1`
- `newGame` 中：`currentWorld.value = 1`
- `initGame` 中：再次设置 `currentWorld.value`

多次设置导致 Vue 响应式更新混乱，UI 没有正确刷新。

**修复方案**:

#### 1. 统一由 initGame 设置世界选择

```javascript
const initGame = async () => {
  // 确保第一个世界默认解锁
  if (WorldConfig.worlds[1] && !WorldConfig.worlds[1].unlocked) {
    WorldConfig.worlds[1].unlocked = true;
  }

  const playerData = await PlayerAPI.load();

  if (playerData) {
    // 有存档，读取存档数据
    await loadGame();
    // 从数据库读取后，恢复世界选择
    currentWorld.value = playerData.currentWorld || 1;
    currentLevel.value = playerData.currentLevel || 1;
  } else {
    // 没有存档，创建新游戏
    await newGame();
    // 新游戏默认选择第一个世界
    currentWorld.value = 1;
    currentLevel.value = 1;
  }

  // 确保第一个世界已解锁
  if (WorldConfig.worlds[1]) {
    WorldConfig.worlds[1].unlocked = true;
  }

  // 保存世界选择
  await saveGame();

  console.log("[MainHub] 初始化完成:", { currentWorld: currentWorld.value });
};
```

#### 2. loadGame 移除世界设置

```javascript
const loadGame = async () => {
  const playerData = await PlayerAPI.load();
  if (!playerData) {
    await newGame();
    return;
  }

  try {
    Object.assign(player, EntityManager.createPlayer(playerData));
    Object.keys(backpack).forEach((key) => delete backpack[key]);
    Object.assign(backpack, playerData.backpack || {});

    // 恢复解锁的世界
    if (playerData.unlockedWorlds && playerData.unlockedWorlds.length > 0) {
      for (const worldId of playerData.unlockedWorlds) {
        if (WorldConfig.worlds[worldId]) {
          WorldConfig.worlds[worldId].unlocked = true;
        }
      }
    }
  } catch (e) {
    console.error("读取存档失败:", e);
    await newGame();
  }
};
```

#### 3. newGame 移除世界设置

```javascript
const newGame = async () => {
  // 重新加载物品缓存
  await ItemConfig.reloadCache()

  Object.assign(player, EntityManager.createPlayer({...}))
  // 移除 currentWorld.value = 1
  // 移除 currentLevel.value = 1
  // ...
};
```

**修改文件**:

- `src/components/MainHub.vue` - `initGame`、`loadGame`、`newGame` 函数

**数据流**:

```
重置游戏 → doResetGame()
         ↓
    DBUtils.clear()
         ↓
    initGame()
         ↓
    PlayerAPI.load() → null (数据库已清空)
         ↓
    newGame() - 创建玩家数据
         ↓
    currentWorld.value = 1 (统一设置)
    currentLevel.value = 1
         ↓
    saveGame() - 保存到数据库
         ↓
    UI 响应式更新 ✓
```

**测试结果**: ✓ 已通过

---

### Bug #044 - 移除 Electron 相关内容及世界解锁状态响应式修复

**日期**: 2026-03-09
**优先级**: P0
**类型**: 架构重构 + 功能 Bug

**问题描述**:

1. 项目不再需要 Electron 桌面应用功能
2. 轮回世界解锁状态不是响应式的，UI 不更新
3. 重置游戏后，第一个世界高亮选中状态不显示

**问题原因**:

#### 1. WorldConfig.worlds 不是响应式对象

```javascript
// WorldConfig.js
export const WorldConfig = {
    worlds: {
        1: { unlocked: true, ... },
        2: { unlocked: false, ... }
    }
}

// MainHub.vue 中修改
WorldConfig.worlds[1].unlocked = true // Vue 检测不到变化
```

#### 2. 模板使用非响应式数据

```vue
:class="{ locked: !world.unlocked }"
<!-- world.unlocked 不是响应式 -->
```

**修复方案**:

#### 1. 移除 Electron 相关内容

- 删除 `package.json` 中的 Electron 依赖和脚本
- 删除 `electron/` 目录

#### 2. 使用响应式对象管理世界解锁状态

```javascript
// MainHub.vue setup 中
const worldUnlocked = reactive({
  1: true,
  2: false,
  3: false,
});
```

#### 3. 更新模板使用响应式数据

```vue
:class="{ locked: !worldUnlocked[id] }"
```

#### 4. 更新相关函数

```javascript
// initGame
const initGame = async () => {
  worldUnlocked[1] = true; // 直接修改响应式对象
  // ...
};

// loadGame
const loadGame = async () => {
  // 重置所有世界为未解锁
  worldUnlocked[1] = false;
  worldUnlocked[2] = false;
  worldUnlocked[3] = false;

  // 设置已解锁的世界
  for (const worldId of playerData.unlockedWorlds) {
    worldUnlocked[worldId] = true;
  }
};

// selectWorld
const selectWorld = (worldId) => {
  if (!worldUnlocked[worldId]) return;
  // ...
};
```

**修改文件**:

- `package.json` - 移除 Electron 依赖
- `electron/` 目录 - 删除
- `src/components/MainHub.vue` - 添加 `worldUnlocked` 响应式对象，更新相关函数

**优势**:

1. 项目更轻量，专注于 Web 版本
2. 世界解锁状态使用响应式对象，UI 自动更新
3. 代码逻辑更清晰，响应式数据集中管理

**测试结果**: ✓ 已通过

---

## 待修复问题

### 暂无

---

### Bug #051 - 难度选择对话框无法显示

**日期**: 2026-03-10
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 点击「进入轮回世界」按钮后，难度选择对话框没有弹出
- 控制台没有报错，但对话框不可见

**问题原因**:

- `showDifficultyDialog` 和 `selectedDifficulty` 变量没有在 setup() 的 return 语句中导出
- 模板无法访问这些响应式变量

**修复方案**:

在 return 语句中添加这两个变量：

```javascript
return {
  // ...
  showDifficultyDialog,  // 添加
  selectedDifficulty,    // 添加
  WorldConfig,
  // ...
}
```

**修改文件**:

- `src/components/MainHub.vue` - 在 return 语句中添加 `showDifficultyDialog` 和 `selectedDifficulty`

**测试结果**: ✓ 已通过

---

### Bug #050 - 商店物品数据与背包不同步

**日期**: 2026-03-10
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 在商店购买物品后，背包中显示空白格子
- 商店中售卖的物品数据与物品数据库不同步
- 例如：购买"秘银铠甲"后，背包中显示空白

**问题原因**:

1. 商店物品数据是硬编码在 `getShopEquipmentList()` 函数中的
2. 硬编码的物品 ID 和属性与 `ItemDatabase.js` 中的定义不一致
3. 例如：商店中 ID 6203 是"秘银铠甲"，但数据库中 ID 6203 不存在
4. 购买后背包存储的是物品 ID，但 `getItem(itemId)` 从数据库读取时返回 null

**修复方案**:

#### 1. 修改商店读取逻辑

从物品数据库读取商店售卖的物品，而不是硬编码：

```javascript
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
```

#### 2. 在物品数据库中添加商店物品

在 `ItemDatabase.js` 中添加所有商店售卖的装备（ID 6000-6999）：

**普通品质 (quality: 0)**:
- 6001: 铁制长剑
- 6002: 铁制弓箭
- 6003: 铁制护甲
- 6004: 铁制戒指
- 6101: 木制短弓
- 6201: 铁制护甲
- 6301: 铁戒指

**优秀品质 (quality: 1)**:
- 6011: 钢制战斧
- 6102: 精灵长弓
- 6202: 钢制锁子甲
- 6302: 银吊坠

**史诗品质 (quality: 2)**:
- 6013: 秘银战锤
- 6103: 风语者之弓
- 6203: 秘银铠甲
- 6303: 翡翠护符

**传说品质 (quality: 3)**:
- 6014: 龙牙巨剑
- 6104: 星辰陨落
- 6204: 龙鳞战甲
- 6304: 龙魂之戒

#### 3. 更新初始化检查

```javascript
// 检查物品数量，如果不足 31 个则重新初始化
// 1 金币 + 3 新手装备 + 16 商店装备 + 4 稀有 + 4 史诗 + 4 传说 = 32
if (existingItems && existingItems.length >= 31) {
```

**修改文件**:

- `src/components/MainHub.vue` - 修改 `getShopEquipmentList()` 函数，从数据库读取物品
- `src/js/ItemDatabase.js` - 添加 16 件商店售卖的装备（ID 6000-6999）

**测试结果**: ✓ 已通过

**注意事项**:

- 商店物品数据现在统一从物品数据库读取
- 确保商店和背包使用相同的物品数据源
- 首次运行后会重新初始化物品数据库

---

### Bug #049 - 物品出售价格计算错误

**日期**: 2026-03-10
**优先级**: P1
**类型**: 功能 Bug

**问题描述**:

- 部分物品点击出售时提示可获得 0 金币
- 没有 `price` 字段的物品（如掉落装备）无法正确计算出售价格
- 需要按品质计算基础价格

**问题原因**:

- `getSellPrice()` 函数只检查 `item.price` 字段
- 没有 `price` 字段的物品返回 0
- 掉落装备、任务物品等没有价格定义

**修复方案**:

#### 修改前

```javascript
const getSellPrice = (itemId) => {
  const item = getItem(itemId)
  if (!item || !item.price) return 0
  return Math.round(item.price / 3)
}
```

#### 修改后

```javascript
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
```

**品质基础价格表**:

| 品质 | 名称 | 基础价格 | 出售价格 |
|------|------|----------|----------|
| 0 | 普通 | 100 | 33 |
| 1 | 优秀 | 300 | 100 |
| 2 | 史诗 | 600 | 200 |
| 3 | 传说 | 1000 | 333 |

**修改文件**:

- `src/components/MainHub.vue` - 修改 `getSellPrice()` 函数，添加品质基础价格计算逻辑

**测试结果**: ✓ 已通过

**注意事项**:

- 优先使用物品的 `price` 字段（如果有）
- 没有 `price` 字段的物品按品质计算
- 金币（ID: 1001）不能出售

---

### Bug #048 - 完善配置文件字段注释

**日期**: 2026-03-10
**优先级**: P2
**类型**: 代码优化

**优化说明**:

- 为所有配置文件添加详细的字段注释
- 标注每个参数的含义和用途
- 方便后续维护和数值调整

**修改文件**:

#### 1. DropTableConfig.js - 掉落配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `dropGroups` | Object | 掉落组配置，key 为掉落组 ID |
| `dropGroups.items` | Array | 掉落物品列表 |
| `items.itemIds` | Array | 物品 ID 数组，支持多个物品共享配置 |
| `items.baseRate` | Number | 基础掉落概率 (1.0=100%) |
| `items.minCount` | Number | 最小掉落数量 |
| `items.maxCount` | Number | 最大掉落数量 |
| `items.qualityLock` | Number | 品质锁定 (0=普通，1=优秀，2=史诗，3=传说) |
| `worldModifiers` | Object | 世界修正系数，key 为世界 ID |
| `calculateDrop()` | Function | 计算掉落物品方法 |

**参数说明**:
- `playerLuck`: 玩家幸运值，每点幸运 +0.1% 掉落率
- `worldId`: 世界 ID，应用世界修正系数

#### 2. MonsterConfig.js - 怪物配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `templates` | Object | 怪物模板，key 为模板键名 |
| `templates.id` | Number | 怪物 ID (唯一标识) |
| `templates.name` | String | 怪物名称 |
| `templates.desc` | String | 怪物描述 |
| `templates.baseStats` | Object | 基础属性对象 |
| `templates.baseStats.str` | Number | 力量 (影响物理攻击) |
| `templates.baseStats.int` | Number | 智力 (影响魔法攻击) |
| `templates.baseStats.con` | Number | 体质 (影响防御和生命) |
| `templates.baseStats.agi` | Number | 敏捷 (影响速度和暴击) |
| `templates.baseStats.level` | Number | 基础等级 |
| `templates.exp` | Number | 击败后获得的经验值 |
| `templates.skills` | Array | 技能 ID 数组 |
| `templates.dropGroup` | Number | 掉落组 ID |
| `levels` | Array | 关卡怪物配置数组 |
| `levels.level` | Number | 关卡编号 |
| `levels.monsters` | Array | 怪物数组 |
| `monsters.template` | String | 怪物模板键名 |
| `monsters.count` | Number | 怪物数量 |
| `monsters.levelOffset` | Number | 等级偏移 (0=基础等级) |

#### 3. CombatConfig.js - 战斗配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `K_STR_ATK` | Number | 力量对物理攻击的系数 (2.0) |
| `K_INT_ATK` | Number | 智力对魔法攻击的系数 (2.5) |
| `K_LV_ATK` | Number | 等级对攻击的系数 (1.0) |
| `K_CON_DEF` | Number | 体质对防御的系数 (1.5) |
| `K_LV_DEF` | Number | 等级对防御的系数 (0.5) |
| `K_AGI_CRIT` | Number | 敏捷对暴击率的系数 (0.1=0.1%/点) |
| `K_AGI_CRITDMG` | Number | 敏捷对暴击伤害的系数 |
| `K_AGI_SPD` | Number | 敏捷对速度的系数 |
| `BASE_HP` | Number | 基础生命值 (100) |
| `BASE_RESOURCE` | Number | 基础资源值 (50) |
| `BASE_SPEED` | Number | 基础速度 (10) |
| `RESOURCE_PER_INT` | Number | 每点智力增加的资源值 (5) |
| `HP_PER_LEVEL` | Number | 每级增加的生命值 (20) |
| `RESOURCE_PER_LEVEL` | Number | 每级增加的资源值 (10) |
| `CRIT_BASE_RATE` | Number | 基础暴击率 (0.05=5%) |
| `CRIT_BASE_DMG` | Number | 基础暴击伤害 (1.5=150%) |
| `CRIT_RATE_CAP` | Number | 暴击率上限 (0.5=50%) |
| `DAMAGE_FLOAT_MIN` | Number | 伤害浮动最小值 (0.95=95%) |
| `DAMAGE_FLOAT_MAX` | Number | 伤害浮动最大值 (1.05=105%) |
| `AUTO_BATTLE_DEFAULT` | Boolean | 默认自动战斗 (true) |
| `BATTLE_SPEED_NORMAL` | Number | 正常战斗速度 (1) |
| `BATTLE_SPEED_FAST` | Number | 加速战斗速度 (2) |
| `REGEN_RATE_PER_TURN` | Number | 每回合回复资源比例 (0.1=10%) |
| `BASE_HIT_RATE` | Number | 基础命中率 (0.95=95%) |
| `BASE_DODGE_RATE` | Number | 基础闪避率 (0.0=0%) |

#### 4. SkillConfig.js - 技能配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `skills` | Object | 技能数据库，key 为技能 ID |
| `skills.id` | Number | 技能 ID |
| `skills.name` | String | 技能名称 |
| `skills.desc` | String | 技能描述 |
| `skills.type` | String | 技能类型：active=主动，passive=被动 |
| `skills.target` | String | 目标类型：single_enemy=单个敌人，all_enemies=全体，self=自身 |
| `skills.damageType` | String | 伤害类型：physical=物理，magic=魔法，heal=治疗，none=无伤害 |
| `skills.skillCoeff` | Number | 技能系数 (1.0=100% 攻击力) |
| `skills.cost` | Number | 资源消耗 (0=免费) |
| `skills.cd` | Number | 冷却时间 (回合数) |
| `skills.hitRate` | Number | 命中率 (0.95=95%) |
| `skills.bonusCrit` | Number | 额外暴击率 (可选) |
| `skills.effect` | Object | 附加效果 (可选) |
| `skills.effect.type` | String | 效果类型：def_down=防御降低，atk_down=攻击降低，atk_up=攻击提升，summon=召唤 |
| `skills.effect.value` | Number | 效果值 (比例) |
| `skills.effect.duration` | Number | 持续回合数 |
| `skills.extraAttacks` | Number | 额外攻击次数 (可选) |

#### 5. WorldConfig.js - 世界配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `worlds` | Object | 世界配置，key 为世界 ID |
| `worlds.id` | Number | 世界 ID |
| `worlds.name` | String | 世界名称 |
| `worlds.desc` | String | 世界描述 |
| `worlds.levels` | Number | 关卡数量 |
| `worlds.difficulty` | Number | 难度系数 (1.0=基础) |
| `worlds.dropGroupBase` | Number | 基础掉落组 ID |
| `worlds.unlocked` | Boolean | 是否已解锁 |
| `worlds.themeColor` | String | 主题颜色 (十六进制) |

#### 6. ItemConfig.js - 物品配置表

| 字段 | 类型 | 说明 |
|------|------|------|
| `qualityColors` | Object | 品质颜色，key 为品质等级 |
| `qualityColors.0` | String | 普通品质颜色 (#FFFFFF 白色) |
| `qualityColors.1` | String | 优秀品质颜色 (#007FFF 蓝色) |
| `qualityColors.2` | String | 史诗品质颜色 (#800080 紫色) |
| `qualityColors.3` | String | 传说品质颜色 (#FFA500 橙色) |
| `qualityNames` | Object | 品质名称 |
| `qualityMultipliers` | Object | 品质倍率 |

**测试结果**: ✓ 已通过

**注意事项**:

- 所有配置文件现在都有详细的字段注释
- 新增或修改配置时请参考现有注释格式
- 数值调整前请仔细阅读相关系数说明

---

### Bug #047 - 添加传奇品质物品

**日期**: 2026-03-10
**优先级**: P2
**类型**: 内容扩展

**功能说明**:

- 新增传奇品质（quality: 3）装备，比史诗品质更高一级
- 传奇品质装备售价 2000 金币，出售价格为 667 金币（1/3 四舍五入）
- 传奇品质掉落概率为 2%
- 新增 4 件传奇装备：屠龙长剑、凤凰神弓、泰坦铠甲、龙晶戒指

**物品列表**:

| ID | 名称 | 类型 | 等级 | 售价 | 主要属性 |
|----|------|------|------|------|----------|
| 30001 | 屠龙长剑 | 近战武器 | 30 | 2000 | pAtk+80, str+18, con+8, critRate+0.08, hp+100 |
| 30002 | 凤凰神弓 | 远程武器 | 30 | 2000 | pAtk+60, agi+22, speed+12, critRate+0.1, crit+0.15 |
| 30003 | 泰坦铠甲 | 防具 | 30 | 2000 | def+55, con+18, hp+300, str+8, res+20, regen+5 |
| 30004 | 龙晶戒指 | 饰品 | 30 | 2000 | hp+200, con+12, int+15, critRate+0.08, res+15 |

**品质配置**:

```javascript
// ItemConfig.js
qualityColors: { 0: "#FFFFFF", 1: "#007FFF", 2: "#800080", 3: "#FFA500" }
qualityNames: { 0: "普通", 1: "优秀", 2: "史诗", 3: "传说" }
qualityMultipliers: { 0: 1.0, 1: 1.5, 2: 2.2, 3: 3.5 }
```

**掉落概率**:

| 品质 | 概率 | 说明 |
|------|------|------|
| 传奇 (3) | 2% | 0-0.02 |
| 史诗 (2) | 5% | 0.02-0.07 |
| 稀有 (1) | 10% | 0.07-0.17 |
| 无掉落 | 83% | 0.17-1.0 |

**修改文件**:

- `src/js/ItemDatabase.js` - 添加 4 件传奇品质装备，更新初始化检查数量为 19 个，添加 `LEGENDARY_DROP_RATE: 0.02`
- `src/config/ItemConfig.js` - 添加品质配置注释
- `src/config/ItemConfig.js` - 更新品质配置

**测试结果**: ✓ 已通过

**注意事项**:

- 首次运行后会重新初始化物品数据库（因为物品数量从 15 个增加到 19 个）
- 传奇品质掉落概率较低（2%），建议在高难度世界中提高掉率
- 传奇品质装备等级要求较高（Lv.30），适合后期使用

---

### Bug #046 - 背包物品出售功能

**日期**: 2026-03-10
**优先级**: P2
**类型**: 功能新增

**功能说明**:

- 背包中的物品（除金币外）增加出售选项
- 出售价格 = 物品购买价格 ÷ 3（四舍五入）
- 出售后物品从背包删除，金币增加对应数量
- 自动保存数据并更新 UI 视图

**实现方案**:

#### 1. 添加出售按钮

在物品详情对话框中添加「出售」按钮：

```vue
<div class="item-detail-actions">
  <button v-if="canEquip(selectedItemId)" class="btn-equip" @click="equipItemFromDetail">装备</button>
  <button v-if="isConsumable(selectedItemId)" class="btn-use" @click="useItemFromDetail">使用</button>
  <button class="btn-sell" @click="sellItemFromDetail" :title="'出售价格：💰 ' + getSellPrice(selectedItemId)">
    💰 出售
  </button>
  <button class="btn-close-dialog" @click="closeItemDetail">关闭</button>
</div>
```

#### 2. 计算出售价格

```javascript
const getSellPrice = (itemId) => {
  const item = getItem(itemId)
  if (!item || !item.price) return 0
  return Math.round(item.price / 3)
}
```

#### 3. 出售物品逻辑

```javascript
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
    },
    null,
    'confirm'
  )
}
```

#### 4. 添加出售按钮样式

```scss
.btn-sell {
  background: linear-gradient(135deg, #ffaa00, #ff9900);
  color: #000;
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 170, 0, 0.4);
  }
}
```

**出售价格示例**:
| 品质 | 购买价格 | 出售价格 |
|------|----------|----------|
| 普通 | 500 | 167 |
| 稀有 | 1000 | 333 |
| 史诗 | 2000 | 667 |

**修改文件**:

- `src/components/MainHub.vue` - 添加 `getSellPrice()` 和 `sellItemFromDetail()` 函数，添加出售按钮
- `src/styles/main.scss` - 添加 `.btn-sell` 样式
- `docs/updateLog.md` - 更新更新日志

**测试结果**: ✓ 已通过

**注意事项**:

- 金币（ID: 1001）无法出售
- 出售时弹出确认对话框，显示可获得金币数量
- 出售后自动保存并更新 UI

---

### Bug #045 - 战斗胜利后经验值未正确显示和保存

**日期**: 2026-03-10
**优先级**: P0
**类型**: 功能 Bug

**问题描述**:

- 战斗胜利对话框上没有显示获得的经验值
- 战斗返回主页后人物经验值显示为 0
- 经验值进度条没有显示
- 数据库中的 `exp` 字段始终为 0

**问题原因**:

1. BattleScreen.vue 中计算经验值的函数 `calculateTotalExp()` 从 `turnManager.battleData.monsters` 读取怪物数据
2. 但怪物可能在战斗过程中已经被销毁或重置，导致返回 0
3. **更重要的是：App.vue 的 `savePlayerToDB()` 函数中没有保存 `exp` 字段到数据库**

**修复方案**:

#### 1. 在战斗开始时缓存怪物经验值

```javascript
// BattleScreen.vue - 添加变量
const monsterExpCache = ref([])

onMounted(async () => {
  // 创建怪物
  monsters.value = EntityManager.createLevelMonsters(props.worldId, props.currentLevel)
  
  // 缓存怪物经验值
  monsterExpCache.value = monsters.value.map(m => ({ exp: m.exp || 0 }))
  
  // ...
})
```

#### 2. 修改 calculateTotalExp 使用缓存

```javascript
const calculateTotalExp = () => {
  let totalExp = 0
  // 从缓存中读取经验值
  for (const monsterExp of monsterExpCache.value) {
    totalExp += monsterExp.exp
  }
  return totalExp
}
```

#### 3. 在 retryBattle 中也更新缓存

```javascript
const retryBattle = async () => {
  // 重置怪物
  monsters.value = EntityManager.createLevelMonsters(...)
  
  // 更新缓存
  monsterExpCache.value = monsters.value.map(m => ({ exp: m.exp || 0 }))
  
  // ...
}
```

#### 4. 修复 savePlayerToDB 保存 exp 字段

```javascript
// App.vue - savePlayerToDB
const savePlayerToDB = async () => {
  const saveData = {
    name: player.name,
    // ...
    statPoints: player.statPoints,
    exp: player.exp || 0,  // 添加这一行
    constitution: player.constitution || null,
    // ...
  }
  await PlayerAPI.save(saveData)
}
```

**修改文件**:

- `src/components/BattleScreen.vue` - 添加 `monsterExpCache` 变量，在 `onMounted` 和 `retryBattle` 中初始化缓存，修改 `calculateTotalExp` 函数使用缓存
- `src/App.vue` - 在 `savePlayerToDB` 函数中添加 `exp` 字段保存

**测试结果**: ✓ 已通过

---

## 版本历史

| 版本    | 日期       | 说明                                                            |
| ------- | ---------- | --------------------------------------------------------------- |
| v0.1    | 2026-03-07 | 初版发布（原生 JS）                                             |
| v0.1.1  | 2026-03-07 | Bug #001 修复 - 设置 UI 优化                                    |
| v0.1.2  | 2026-03-07 | Bug #002 修复 - 设置面板显示逻辑                                |
| v0.1.3  | 2026-03-07 | Bug #003 修复 - Dialog 点击外部关闭                             |
| v0.2.0  | 2026-03-08 | Bug #004 修复 - Vue3 + Vite + Electron 重构                     |
| v0.2.1  | 2026-03-08 | Bug #005 修复 - Vue 重构后功能 Bug 集合                         |
| v0.2.2  | 2026-03-08 | Bug #006 修复 - 存档系统优化和删除功能修复                      |
| v0.2.3  | 2026-03-08 | Bug #007 修复 - Dialog 响应式和存档点击失效                     |
| v0.2.4  | 2026-03-08 | Bug #008 修复 - 战斗界面添加返回主页按钮                        |
| v0.3.0  | 2026-03-08 | Bug #009 修复 - 双组件架构重构                                  |
| v0.3.1  | 2026-03-09 | Bug #011 修复 - 读档后装备状态不正确                            |
| v0.3.2  | 2026-03-09 | Bug #012 修复 - 读档后装备状态不正确                            |
| v0.3.3  | 2026-03-09 | Bug #013 修复 - 存档数据格式不一致导致属性点丢失                |
| v0.3.4  | 2026-03-09 | Bug #014 修复 - 统一使用 IndexedDB 存储所有数据                 |
| v0.3.5  | 2026-03-09 | Bug #015 修复 - 战斗胜利后缺少交互反馈                          |
| v0.3.6  | 2026-03-09 | Bug #016 修复 - 建立物品数据库系统                              |
| v0.3.7  | 2026-03-09 | Bug #017 修复 - 战斗胜利后金币未正确更新到背包                  |
| v0.3.8  | 2026-03-09 | Bug #018 修复 - BattleScreen 中 getItem 函数未定义错误          |
| v0.3.9  | 2026-03-09 | Bug #019 修复 - 战斗胜利后金币响应式更新失效                    |
| v0.3.10 | 2026-03-09 | Bug #020 修复 - 战斗胜利后金币没有自动存档                      |
| v0.3.11 | 2026-03-09 | Bug #021 修复 - 战斗失败后缺少交互对话框                        |
| v0.3.12 | 2026-03-09 | Bug #022 修复 - 战斗失败后加点数据回退                          |
| v0.3.13 | 2026-03-09 | Bug #023 修复 - 战斗结束后未弹出胜利对话框                      |
| v0.3.14 | 2026-03-09 | Bug #024 修复 - 再次挑战时 HP/MP 没有回满                       |
| v0.3.15 | 2026-03-09 | Bug #025 修复 - 轮回世界选中效果消失                            |
| v0.3.16 | 2026-03-09 | Bug #026 修复 - 未选择世界时可以进入战斗                        |
| v0.3.17 | 2026-03-09 | Bug #027 修复 - 怪物伤害过高                                    |
| v0.3.18 | 2026-03-09 | Bug #028 修复 - 轮回世界进入逻辑优化                            |
| v0.3.19 | 2026-03-09 | Bug #029 修复 - 轮回世界进度存储优化                            |
| v0.3.20 | 2026-03-09 | Bug #030 修复 - 装备物品后数据加载失败                          |
| v0.3.21 | 2026-03-09 | Bug #031 修复 - 商店购买装备逻辑优化                            |
| v0.3.22 | 2026-03-09 | Bug #032 修复 - 购买物品后数据未正确保存                        |
| v0.3.23 | 2026-03-09 | Bug #033 修复 - 商店购买的物品在背包中显示为空白                |
| v0.3.24 | 2026-03-09 | Bug #034 修复 - 装备/卸下物品后 UI 不刷新                       |
| v0.3.25 | 2026-03-09 | Bug #035 修复 - 移除 ItemConfig 冗余物品数据                    |
| v0.3.26 | 2026-03-09 | Bug #036 修复 - 全面检查物品相关代码                            |
| v0.3.27 | 2026-03-09 | Bug #037 修复 - 金币和初始装备 ID 不存在导致名称显示空白        |
| v0.3.28 | 2026-03-09 | Bug #038 修复 - 物品属性显示英文缩写而非中文名称                |
| v0.3.29 | 2026-03-09 | Bug #039 修复 - 背包金币数量为 0 时不显示及装备详情属性显示中文 |
| v0.3.30 | 2026-03-09 | Bug #040 优化 - 属性名称配置独立 JSON 文件及公共方法封装        |
| v0.3.31 | 2026-03-09 | Bug #041 修复 - 加点后已选中的轮回世界变成 disabled             |
| v0.3.32 | 2026-03-09 | Bug #042 修复 - 重置游戏后没有默认选中第一个世界                |
| v0.3.33 | 2026-03-09 | Bug #043 修复 - 重置游戏后轮回世界高亮 UI 没有即时更新          |
| v0.3.34 | 2026-03-09 | Bug #044 修复 - 移除 Electron 相关内容及世界解锁状态响应式修复  |
| v0.3.35 | 2026-03-10 | Bug #045 修复 - 战斗胜利后经验值未正确显示和保存                |
| v0.3.36 | 2026-03-10 | Bug #046 新增 - 背包物品出售功能                                |
| v0.3.37 | 2026-03-10 | Bug #047 新增 - 添加传奇品质物品                                |
| v0.3.38 | 2026-03-10 | Bug #048 优化 - 完善配置文件字段注释                            |
| v0.3.39 | 2026-03-10 | Bug #049 修复 - 物品出售价格计算错误                            |
| v0.3.40 | 2026-03-10 | Bug #050 修复 - 商店物品数据与背包不同步                        |
| v0.4.0  | 2026-03-10 | 版本大更新 - 新增难度选择系统、等级上限、怪物血量调整            |
| v0.4.1  | 2026-03-10 | Bug #051 修复 - 难度选择对话框无法显示                          |

---

## 反馈渠道

如发现新 Bug，请记录以下信息：

1. Bug 复现步骤
2. 预期行为 vs 实际行为
3. 浏览器/设备信息
4. 截图或录屏（如有）