# LeviLauncher

面向 Windows 与 Android 的 Minecraft 基岩版启动器：在 Windows 电脑或 Android 设备上安装、管理、隔离、配置模组并启动 Minecraft 基岩版。

**安装：** [安装](./install)页面说明了每个版本需要什么、从哪里获取、如何更新，以及如何试用测试版。

::: info Windows 版与 Android 版
LeviLauncher 提供面向 Minecraft 基岩版（GDK / UWP）的 **Windows 版**，以及面向 Google Play 官方 Minecraft 的 **Android 版**，两者都需要你拥有**正版授权**。我们没有开发 iOS 版的计划。
:::

::: tip 从这里开始
第一次使用 LeviLauncher？教程[在 Windows 上玩模组](https://levimc.org/zh-Hans/tutorials/play/play-with-mods/)将带你从下载 LeviLauncher 开始，一直到带模组进入游戏。
:::

## LeviLauncher 能做什么

- **以版本为中心。** 管理 Minecraft 正式版与预览版，支持安装、重命名、删除、快速启动与按版本整理。每个已安装的副本都是一个“实例”：参见[版本管理](./guide/version-management)和[实例与游戏版本](./concepts/instances)。
- **干净隔离。** 将版本数据与默认 AppData 环境分开，适合测试、分环境游玩，避免互相污染：参见[实例隔离](./concepts/isolation)。
- **内容管理。** 从统一入口管理世界、资源包、行为包、皮肤包、截图与服务器列表：参见[内容管理](./guide/content-management)。
- **模组就绪。** 导入 `.mcmod` 模组包、浏览 CurseForge，并通过内置包管理器安装 LeviLamina 与 LIP 软件包：参见[模组与集成](./guide/mods-integrations)和[模组如何加载](./concepts/mod-loading)。
- **世界工具。** 备份为 `.mcworld`、查看世界信息，并编辑部分 `level.dat` 字段：参见[世界工具](./guide/world-tools)。
- **用户设置。** 调整语言、外观、下载行为、隐私偏好、更新通道和包管理：参见[设置与个性化](./guide/settings-personalization)和[全部设置](./reference/settings)。
- **Android 专属功能。** 在同一个启动器内切换 Xbox 账号，并通过 URI 快速启动：参见[账号与快速启动](./guide/accounts-quick-launch)。

## 一个简短的例子

在 Windows 上，启动器窗口能做的事都可以在终端里完成。下面三条命令会将最新的 Minecraft 正式版连同 LeviLamina 安装为新实例并设为默认实例，再从 [LeviMC 模组](https://levimc.org/zh-Hans/mods/)为它安装一个模组，最后启动游戏：

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe play
```

安装 GDK 版本前，需要先登录拥有 Minecraft 的微软账号（`LeviLauncher.exe account login`）。在窗口中，同样的步骤对应 **下载** 页面、**LeviMC 模组** 页面和 **启动** 按钮。全部命令请参见[命令行](./reference/command-line)参考。

## 这个站点包含什么

这套文档面向**最终用户**，而非维护者或开发者。

- **指南**：每页一项任务。先在[安装](./install)页面获取应用，然后了解[管理版本](./guide/version-management)、[下载与镜像](./guide/downloads-mirrors)、[内容](./guide/content-management)、[账号与快速启动](./guide/accounts-quick-launch)（Android）、[模组](./guide/mods-integrations)、[世界](./guide/world-tools)和[设置](./guide/settings-personalization)。“帮助”分组包括[更新与故障排查](./guide/update-troubleshooting)和[社区与反馈](./guide/faq-community-feedback)。
- **概念**：介绍 LeviLauncher 的工作方式：[实例与游戏版本](./concepts/instances)（正式版与预览版、GDK 与 UWP、Windows 与 Android）、[实例隔离](./concepts/isolation)和[模组如何加载](./concepts/mod-loading)。
- **参考**：涵盖[命令行](./reference/command-line)、[全部设置](./reference/settings)、LeviLauncher 使用的[文件夹与文件](./reference/files)、Android 的[快速启动 URI](./reference/quick-launch-uri)以及 Android 版的[隐私政策](./privacy-policy)。

推荐阅读顺序：先看教程[在 Windows 上玩模组](https://levimc.org/zh-Hans/tutorials/play/play-with-mods/)，再看[版本管理](./guide/version-management)和[内容管理](./guide/content-management)。

## 社区与反馈

- **官方 Discord：** [discord.gg/v5R5P4vRZk](https://discord.gg/v5R5P4vRZk)
- **个人 Discord 频道：** [discord.gg/VqQaC8vWz8](https://discord.gg/VqQaC8vWz8)
- **QQ 群：** [458083875](https://qm.qq.com/q/1z791rJgJG)
- **问题反馈：** [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)
