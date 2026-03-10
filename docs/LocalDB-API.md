# 轮回异界 - 本地数据库 API 文档

## 概述

本项目使用 **localForage** 作为本地数据库解决方案，它是对 IndexedDB 的轻量级封装，支持存储复杂数据类型。

**依赖库**: [localForage](https://localforage.github.io/localForage/)

---

## 数据库配置

```javascript
// 数据库名称
const dbName = '轮回异界'

// 存储表
const SAVE_STORE = 'saves'        // 存档数据
const SETTINGS_STORE = 'settings' // 游戏设置
const PLAYER_STORE = 'player'     // 玩家数据
```

---

## API 说明

### 1. 存档 API (SaveAPI)

用于管理游戏存档的创建、读取、更新和删除。

#### `SaveAPI.save(slotIndex, saveData)`
创建或更新存档。

**参数**:
- `slotIndex` (Number): 存档槽位索引，范围 1-3
- `saveData` (Object): 存档数据对象

**返回值**: `Promise<Object>` - 保存后的完整存档数据（包含 saveTime）

**示例**:
```javascript
const saveData = {
  player: { ... },
  currentWorld: 1,
  currentLevel: 5,
  backpack: { ... },
  unlockedWorlds: [1]
}

await SaveAPI.save(1, saveData)
```

---

#### `SaveAPI.load(slotIndex)`
读取指定槽位的存档。

**参数**:
- `slotIndex` (Number): 存档槽位索引，范围 1-3

**返回值**: `Promise<Object|null>` - 存档数据，不存在则返回 null

**示例**:
```javascript
const save = await SaveAPI.load(1)
if (save) {
  console.log('存档时间:', new Date(save.saveTime))
}
```

---

#### `SaveAPI.getAll()`
获取所有存档槽位的数据。

**参数**: 无

**返回值**: `Promise<Array>` - 长度为 3 的数组，每个元素为存档数据或 null

**示例**:
```javascript
const saves = await SaveAPI.getAll()
saves.forEach((save, index) => {
  if (save) {
    console.log(`存档${index + 1}: Lv.${save.player.baseStats.level}`)
  }
})
```

---

#### `SaveAPI.delete(slotIndex)`
删除指定槽位的存档。

**参数**:
- `slotIndex` (Number): 存档槽位索引，范围 1-3

**返回值**: `Promise<void>`

**示例**:
```javascript
await SaveAPI.delete(2) // 删除第 2 个存档
```

---

#### `SaveAPI.clearAll()`
清空所有存档。

**参数**: 无

**返回值**: `Promise<void>`

**示例**:
```javascript
await SaveAPI.clearAll()
```

---

#### `SaveAPI.exists(slotIndex)`
检查指定槽位是否存在存档。

**参数**:
- `slotIndex` (Number): 存档槽位索引，范围 1-3

**返回值**: `Promise<Boolean>`

**示例**:
```javascript
const exists = await SaveAPI.exists(1)
console.log('存档 1 是否存在:', exists)
```

---

### 2. 玩家数据 API (PlayerAPI)

用于管理玩家当前游戏数据的持久化。

#### `PlayerAPI.save(playerData)`
保存玩家数据。

**参数**:
- `playerData` (Object): 玩家数据对象

**返回值**: `Promise<void>`

**示例**:
```javascript
await PlayerAPI.save({
  name: '主角',
  baseStats: { str: 10, int: 5, con: 8, agi: 12 },
  currentHp: 150,
  currentResource: 80
})
```

---

#### `PlayerAPI.load()`
读取玩家数据。

**参数**: 无

**返回值**: `Promise<Object|null>` - 玩家数据，不存在则返回 null

**示例**:
```javascript
const player = await PlayerAPI.load()
if (player) {
  console.log('玩家等级:', player.baseStats.level)
}
```

---

#### `PlayerAPI.delete()`
删除玩家数据。

**参数**: 无

**返回值**: `Promise<void>`

**示例**:
```javascript
await PlayerAPI.delete()
```

---

### 3. 游戏设置 API (SettingsAPI)

用于管理游戏设置数据。

#### `SettingsAPI.save(settings)`
保存游戏设置。

**参数**:
- `settings` (Object): 设置数据对象

**返回值**: `Promise<void>`

**示例**:
```javascript
await SettingsAPI.save({
  musicVolume: 0.8,
  soundVolume: 0.6,
  battleSpeed: 2,
  autoMode: true
})
```

---

#### `SettingsAPI.load()`
读取游戏设置。

**参数**: 无

**返回值**: `Promise<Object|null>` - 设置数据，不存在则返回 null

**示例**:
```javascript
const settings = await SettingsAPI.load()
if (settings) {
  console.log('战斗速度:', settings.battleSpeed)
}
```

---

#### `SettingsAPI.delete()`
删除游戏设置。

**参数**: 无

**返回值**: `Promise<void>`

**示例**:
```javascript
await SettingsAPI.delete()
```

---

### 4. 数据库工具 API (DBUtils)

用于数据库的高级操作。

#### `DBUtils.clear()`
清空整个数据库（所有表）。

**参数**: 无

**返回值**: `Promise<void>`

**示例**:
```javascript
await DBUtils.clear() // 清空所有数据
```

---

#### `DBUtils.info()`
获取数据库信息。

**参数**: 无

**返回值**: `Promise<Object>` - 数据库信息

**示例**:
```javascript
const info = await DBUtils.info()
console.log('数据库名称:', info.name)
console.log('存储表:', info.storeName)
```

---

#### `DBUtils.keys()`
获取数据库中所有数据的键。

**参数**: 无

**返回值**: `Promise<Array<String>>` - 键名数组

**示例**:
```javascript
const keys = await DBUtils.keys()
console.log('所有键:', keys)
// 输出: ['saves_slot1', 'saves_slot2', 'player', 'settings']
```

---

#### `DBUtils.count()`
获取数据库中数据总数。

**参数**: 无

**返回值**: `Promise<Number>` - 数据总数

**示例**:
```javascript
const count = await DBUtils.count()
console.log('数据总数:', count)
```

---

## 数据结构

### 存档数据结构

```javascript
{
  slotIndex: 1,              // 存档槽位 (1-3)
  saveTime: 1709856000000,   // 存档时间戳
  player: {                  // 玩家数据快照
    name: '主角',
    baseStats: {
      str: 10,
      int: 5,
      con: 8,
      agi: 12,
      level: 1
    },
    currentHp: 150,
    currentResource: 80,
    skills: [2001, 2002, 2003],
    equipment: {
      weapon: 2003,
      armor: 2004,
      accessory: 2101
    },
    statPoints: 5,
    gold: 1000
  },
  currentWorld: 1,           // 当前世界 ID
  currentLevel: 5,           // 当前关卡
  backpack: {                // 背包数据
    1001: 500,              // 金币 x500
    3001: 5,                // 生命药水 x5
    2003: 1                 // 钢制长剑 x1
  },
  unlockedWorlds: [1]        // 已解锁的世界 ID 列表
}
```

### 玩家数据结构

```javascript
{
  name: '主角',
  baseStats: {
    str: 10,
    int: 5,
    con: 8,
    agi: 12,
    level: 1
  },
  currentHp: 150,
  currentResource: 80,
  skills: [2001, 2002, 2003],
  equipment: {
    weapon: 2003,
    armor: 2004,
    accessory: 2101
  },
  statPoints: 5,
  gold: 1000,
  updateTime: 1709856000000  // 最后更新时间
}
```

### 游戏设置数据结构

```javascript
{
  musicVolume: 0.8,          // 音乐音量 (0-1)
  soundVolume: 0.6,          // 音效音量 (0-1)
  battleSpeed: 2,            // 战斗速度 (1 或 2)
  autoMode: true,            // 自动战斗模式
  updateTime: 1709856000000  // 最后更新时间
}
```

---

## 错误处理

所有 API 方法都返回 Promise，建议使用 try-catch 处理错误：

```javascript
try {
  const save = await SaveAPI.load(1)
  if (!save) {
    console.log('存档不存在')
    return
  }
  // 处理存档数据
} catch (error) {
  console.error('读取存档失败:', error)
  // 显示错误提示
}
```

---

## 使用示例

### 完整存档流程

```javascript
import { SaveAPI } from '../js/LocalDB'

// 创建存档数据
const saveData = {
  player: { ... },
  currentWorld: 1,
  currentLevel: 5,
  backpack: { ... },
  unlockedWorlds: [1]
}

try {
  // 保存到第 1 个槽位
  await SaveAPI.save(1, saveData)
  console.log('存档成功')
  
  // 获取所有存档
  const saves = await SaveAPI.getAll()
  console.log('存档列表:', saves)
} catch (error) {
  console.error('存档失败:', error)
}
```

### 完整读档流程

```javascript
import { SaveAPI } from '../js/LocalDB'

try {
  // 读取第 1 个槽位的存档
  const save = await SaveAPI.load(1)
  
  if (!save) {
    console.log('该槽位没有存档')
    return
  }
  
  // 恢复游戏状态
  Object.assign(player, save.player)
  currentWorld.value = save.currentWorld
  currentLevel.value = save.currentLevel
  Object.assign(backpack, save.backpack)
  
  console.log('读档成功')
} catch (error) {
  console.error('读档失败:', error)
}
```

### 重置游戏流程

```javascript
import { DBUtils, SaveAPI, PlayerAPI, SettingsAPI } from '../js/LocalDB'

try {
  // 清空整个数据库
  await DBUtils.clear()
  console.log('游戏已重置')
} catch (error) {
  console.error('重置失败:', error)
}
```

---

## 注意事项

1. **异步操作**: 所有 API 方法都是异步的，必须使用 `await` 或 `.then()` 处理

2. **数据验证**: 在保存数据前，建议在应用层进行数据验证

3. **错误处理**: 始终使用 try-catch 包裹异步操作

4. **存储限制**: IndexedDB 的存储限制因浏览器而异，通常为 50MB-1GB

5. **浏览器兼容性**: localForage 支持所有现代浏览器，包括 IE8+

6. **数据备份**: 建议定期导出存档数据到本地文件

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03-09 | 初始版本，包含基础 CRUD 操作 |
