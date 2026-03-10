# GitHub Actions 自动打包 APK 完整教程

> ✅ 已验证成功 - 2026-03-10

---

## 📋 环境要求

### GitHub Actions 配置

| 组件 | 版本 | 说明 |
|------|------|------|
| Node.js | 22.x | Capacitor CLI 要求 |
| Java | 21 | Android 编译要求 |
| Android SDK | latest | GitHub 自动提供 |
| Gradle | 8.2.1 | 自动下载 |

---

## 🚀 完整配置步骤

### 1. 安装 Capacitor 依赖

```bash
npm install -D @capacitor/core @capacitor/cli @capacitor/android
```

### 2. 创建 capacitor.config.json

```json
{
  "appId": "com.idle.reincarnation",
  "appName": "IdleReincarnation",
  "webDir": "dist"
}
```

### 3. 构建 Web 资源

```bash
npm run build
```

### 4. 添加 Android 平台

```bash
npx cap add android
npx cap sync android
```

---

## 📝 GitHub Actions 工作流配置

### 文件位置

`.github/workflows/android-build.yml`

### 完整脚本

```yaml
name: Build Android APK

on:
  push:
    branches: [ master ]
  workflow_dispatch:

env:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false"

jobs:
  build:
    runs-on: ubuntu-22.04
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build web
        run: npm run build

      - name: Install Capacitor
        run: npm install -D @capacitor/core @capacitor/cli @capacitor/android

      - name: Create capacitor.config.json
        run: echo '{"appId":"com.idle.reincarnation","appName":"IdleReincarnation","webDir":"dist"}' > capacitor.config.json

      - name: Add Android Platform
        run: npx cap add android

      - name: Sync Capacitor
        run: npx cap sync android

      - name: Cleanup Gradle Cache
        run: rm -rf ~/.gradle/caches && rm -rf android/.gradle

      - name: Setup Java 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Build APK
        run: cd android && ./gradlew assembleDebug --no-daemon --no-parallel --no-build-cache

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-${{ github.sha }}
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
```

---

## 🔑 关键配置说明

### 1. Node.js 版本

```yaml
- name: Setup Node.js 22
  uses: actions/setup-node@v4
  with:
    node-version: '22'
```

**原因**: Capacitor CLI v6+ 要求 Node.js >= 22.0.0

### 2. Java 版本

```yaml
- name: Setup Java 21
  uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: '21'
```

**原因**: Capacitor Android 模块需要 Java 21 编译

### 3. Gradle 优化

```yaml
env:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false"

# Build 步骤
./gradlew assembleDebug --no-daemon --no-parallel --no-build-cache
```

**原因**: 
- 禁用 Daemon 避免内存问题
- 禁用并行避免缓存冲突
- 禁用构建缓存确保干净构建

### 4. 清理 Gradle 缓存

```yaml
- name: Cleanup Gradle Cache
  run: rm -rf ~/.gradle/caches && rm -rf android/.gradle
```

**原因**: 避免缓存损坏导致的构建失败

### 5. 运行器选择

```yaml
runs-on: ubuntu-22.04
```

**原因**: ubuntu-22.04 比 ubuntu-latest 更稳定

---

## 📥 使用方式

### 自动触发

推送代码到 master 分支自动构建：

```bash
git push
```

### 手动触发

1. 访问：https://github.com/cxc460045989/project-idle/actions
2. 点击 "Build Android APK"
3. 点击 "Run workflow"
4. 等待 5-10 分钟

### 下载 APK

1. 点击最新的构建记录
2. 在底部找到 **Artifacts**
3. 点击 `app-debug-xxx.zip` 下载
4. 解压得到 `app-debug.apk`

---

## 📱 安装测试

### 发送 APK 到手机

1. 下载 `app-debug.apk`
2. 通过微信/QQ/USB 发送到手机
3. 手机设置 → 安全 → 允许安装未知来源应用
4. 点击 APK 安装

---

## ⚠️ 常见问题

### 1. Capacitor CLI 版本错误

**错误**: `The Capacitor CLI requires NodeJS >=22.0.0`

**解决**: 确保 Node.js 版本 >= 22

```yaml
- name: Setup Node.js 22
  uses: actions/setup-node@v4
  with:
    node-version: '22'
```

### 2. Java 编译错误

**错误**: `invalid source release: 21`

**解决**: 使用 Java 21

```yaml
- name: Setup Java 21
  uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: '21'
```

### 3. Gradle 缓存错误

**错误**: `Failed to create Jar file`

**解决**: 清理 Gradle 缓存

```yaml
- name: Cleanup Gradle Cache
  run: rm -rf ~/.gradle/caches && rm -rf android/.gradle
```

### 4. 构建超时

**解决**: 禁用 Gradle Daemon

```yaml
env:
  GRADLE_OPTS: "-Dorg.gradle.daemon=false"
```

---

## 📊 构建时间

| 步骤 | 预计时间 |
|------|----------|
| 安装依赖 | 1-2 分钟 |
| 构建 Web | 30 秒 |
| 安装 Capacitor | 30 秒 |
| 添加 Android | 1 分钟 |
| Gradle 构建 | 3-5 分钟 |
| **总计** | **6-9 分钟** |

---

## 🎯 最佳实践

### 1. 使用 npm ci 而非 npm install

```yaml
- name: Install dependencies
  run: npm ci
```

更快、更可靠的依赖安装

### 2. 启用 npm 缓存

```yaml
- name: Setup Node.js 22
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
```

加速依赖安装

### 3. 设置 Artifact 保留时间

```yaml
- name: Upload APK
  uses: actions/upload-artifact@v4
  with:
    retention-days: 14
```

APK 保留 14 天，避免占用过多存储空间

### 4. 使用 workflow_dispatch

```yaml
on:
  push:
    branches: [ master ]
  workflow_dispatch:
```

支持手动触发构建

---

## 📚 相关资源

- [Capacitor 官方文档](https://capacitorjs.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Android 开发者文档](https://developer.android.com/)

---

**最后更新**: 2026-03-10
**状态**: ✅ 已验证成功
