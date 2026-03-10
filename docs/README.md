# 轮回异界：放置探索

一款竖屏挂机放置回合制 RPG 游戏，基于 Vue3 + Vite + Electron 构建。

## 技术栈

- **前端框架**: Vue 3.4
- **构建工具**: Vite 5
- **桌面应用**: Electron 33
- **样式**: SCSS
- **打包工具**: electron-builder

## 功能特色

- 回合制战斗（速度决定出手顺序）
- 放置挂机（自动战斗）
- 角色养成（属性点分配、装备更换、技能学习）
- 掉落系统（丰富的装备和物品）
- 多存档管理
- 支持 Windows 桌面应用打包

## 第一个轮回世界：生化废土

| 关卡 | 怪物配置 | 类型 |
|------|----------|------|
| 1-1 | 行尸 x1 | 普通 |
| 1-2 | 行尸 x1, 爬行者 x1 | 普通 |
| 1-3 | 狂奔者 x2 | 普通 |
| 1-4 | 行尸 x2, 爬行者 x1 | 普通 |
| 1-5 | 肿胀者 x1 | 精英 |
| 1-6 | 潜伏者 x2 | 普通 |
| 1-7 | 狂奔者 x2, 嚎叫者 x1 | 普通 |
| 1-8 | 肿胀者 x1, 潜伏者 x2 | 普通 |
| 1-9 | 暴君 x1 | 普通 |
| 1-10 | 死灵之主 x1 | Boss |

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发（Vite 热更新）

```bash
npm run dev
```

访问 http://localhost:5173

### 3. Electron 开发模式

```bash
npm run electron:dev
```

### 4. 打包构建

```bash
# 构建 Web 版本
npm run build

# 打包 Electron Windows 应用
npm run electron:build:win
```

打包后的安装包位于 `dist-electron/` 目录。

## 项目结构

```
project Idle/
├── electron/              # Electron 主进程
│   ├── main.js           # 主进程入口
│   └── preload.js        # 预加载脚本
├── src/
│   ├── components/       # Vue 组件
│   │   ├── BattleScreen.vue
│   │   └── Dialog.vue
│   ├── config/           # 游戏配置
│   ├── js/               # 游戏逻辑模块
│   ├── styles/           # SCSS 样式
│   ├── App.vue           # 根组件
│   └── main.js           # Vue 入口
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── vite.config.js        # Vite 配置
└── README.md             # 说明文档
```

## 数值公式

### 属性计算
- 物理攻击 = BaseAtk + (STR × 2.0) + (Level × 1.0)
- 魔法攻击 = BaseAtk + (INT × 2.5) + (Level × 1.0)
- 防御 = BaseDef + (CON × 1.5) + (Level × 0.5)
- 暴击率 = 5% + (AGI × 0.1%)，上限 50%
- 暴击伤害 = 150% + (AGI × 0.5%)
- 速度 = 10 + (AGI × 0.5)

### 伤害计算
- 物理伤害 = (P_ATK × 技能系数) - 目标防御
- 魔法伤害 = (M_ATK × 技能系数) - 目标抗性
- 最终伤害 = Max(1, 基础伤害) × 暴击倍率 × 浮动 (0.95-1.05)

## 存档说明

游戏使用 localStorage 保存进度：
- 单存档：`轮回异界_save`
- 多存档：`轮回异界_save_时间戳`

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-03-07 | 初版发布（原生 JS） |
| v0.1.1 | 2026-03-07 | 设置 UI 优化 |
| v0.1.2 | 2026-03-07 | 通用 Dialog 组件 |
| v0.2.0 | 2026-03-08 | Vue3 + Vite + Electron 重构版 |

## 后续计划

- 更多轮回世界
- 更多技能和装备
- 离线收益系统
- 扫荡功能
- 装备强化
- macOS 和 Linux 支持

## 许可证

MIT
