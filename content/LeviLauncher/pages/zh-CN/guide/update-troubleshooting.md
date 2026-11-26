# 更新与故障排查

如果 LeviLauncher 在安装、更新或启动时出现异常，请先参考本页内容排查。

## 常见问题 <Badge platform="windows" />

### 启动器显示 Release 版本未获授权

一个微软账户最多只能在10台设备上登录微软商店，而启动器会单独占用一个设备名额。  
请前往 [Microsoft Store 设备管理](https://account.microsoft.com/devices/content) 移除不再需要的设备。

### Gaming Services 缺失或损坏

- 按照启动器内的引导完成安装或修复。
- 必要时前往 Microsoft Store 检查 Minecraft 基岩版的安装状态。

### GameInput 缺失

- 按 LeviLauncher 的提示安装所需的 redistributable。
- 安装完成后，按需重启启动器。

### 安装路径不可写

- 在 **设置 → 基础设置** 中，将托管内容路径改为可写目录。
- 如果启动器在安装或自更新时请求提升权限，请仅在确认来源可信时放行。

### LeviLauncher 本体一闪即退或双击没反应

- 如果主界面尚未显示程序就退出，请先检查 `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`。
- 失败后可先重试一次；若问题依旧，请在提交 Issue 时附上 `startup.log`。

### 某个版本无法启动

- 先测试该版本在不加载任何模组的情况下能否启动
- 检查所需的 Windows 组件是否完好
- 确认该版本已完整安装
- 尝试新建一个干净的隔离环境来复现问题

### 下载很慢或反复失败

- 切换镜像源
- 稍后重试
- 条件允许时，改用本地包导入

## Android 上的常见问题 <Badge platform="android" />

### 找不到 Minecraft 或版本不受支持

请通过 Google Play 安装或更新官方 Minecraft（1.21.80 或更高版本），然后重新打开 LeviLauncher。

### 导入版本无法启动

导入的版本通常需要开启版本隔离。请在实例设置中启用该选项后重试。

### 启动失败

在报错页面打开启动日志，先根据日志提示排查原因，再调整相应设置。

### 数据迁移

启动器可能需要先迁移旧版数据目录。在迁移完成，且确认存档世界、资源包和设置均正常可用之前，请勿删除旧目录。

## 更安全的恢复步骤

1. 备份重要世界存档。
2. 移除近期新增的模组或资源包。
3. 使用干净的隔离版本进行对照测试。
4. 必要时重装出问题的版本。

## 关于自更新 <Badge platform="windows" />

LeviLauncher 支持检查、下载并安装自身更新。如果安装目录不可写，在部分环境下可能需要管理员权限。

## 什么时候应该提 Issue

满足以下条件时，建议前往 GitHub 提交 Issue：

- 问题可以稳定复现
- 尝试过基础恢复步骤后问题依旧
- 问题看起来源于 LeviLauncher 自身，而非通用的 Windows 环境故障

提交时请尽量提供以下信息：

- Windows 版本
- LeviLauncher 版本
- 具体的复现步骤
- 相关截图或日志（如有）

问题反馈入口：[GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

反馈 Android 版问题时，请附上 Android 版本、设备型号和启动日志，并提交至 [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues)。
