# 安装 Android 版 LeviLauncher

## LeviLauncher 有安卓版吗？官网只看到 exe，安卓 APK 去哪里下载？问题反馈到哪里？

有。官网和文档里的 exe 是 Windows 版（仓库 `LiteLDev/LeviLauncher`）。安卓版在单独的仓库 `LiteLDev/LeviLauncher-Android`（原名 LeviLaunchroid，旧链接会自动跳转），请在 GitHub Releases 下载 APK：<https://github.com/LiteLDev/LeviLauncher-Android/releases/latest>。两端共用同一份文档：<https://levimc.org/LeviLauncher/?platform=android>（在下载页选择 Android 标签）。安卓版的问题请提交到 <https://github.com/LiteLDev/LeviLauncher-Android/issues>，并附上 Android 版本、设备型号和启动日志。运行要求：Android 9.0+ 的 ARM64 设备，且已从 Google Play 安装正版 Minecraft 基岩版 1.21.80 或更高版本。

*适用版本：LeviLauncher-Android 当前所有版本（最新 v1.7.1）*

## LeviLauncher Android 中如何导入 .so 模组？

有以下两种方式：

1. 在文件管理器中找到 `.so`（或 `.levipack` / `.mcmod` 模组包），用“打开方式”选择 LeviLauncher 导入；
2. 在启动器的“模组”页面点击“添加模组”，通过文件选择器选择文件（也可以先把文件放到手机 `Download` 文件夹，再点击“扫描”添加）。

注意：模组必须是为 Android（`arm64-v8a`）编译的原生模组，不能把 Windows 的 `.dll` 直接改后缀为 `.so`。

*适用版本：LeviLauncher-Android 当前所有版本（最新 v1.7.1）*

## 安卓上从网盘/QQ 群/论坛/版本库等非官方渠道下载的 LeviLauncher 或 MC 安装包，启动黑屏、闪退（如生成 `tombstone_xxx_org.levimc.launcher...xcrash`）、或导入安装包失败，怎么办？

1. 请只从官方 GitHub Release 下载启动器：<https://github.com/LiteLDev/LeviLauncher-Android/releases/latest>（下载 `LeviLauncher-vX.Y.Z-release.apk`；仓库原名 LeviLaunchroid，旧链接会自动跳转，安装后应用名为 LeviLauncher，包名为 `org.levimc.launcher`）。非官方渠道的启动器不保证可用，官方也不提供支持。
2. MC 必须是在 Google Play 购买并安装到设备上的正版 Minecraft 基岩版（1.21.80 或更高、`arm64-v8a` 64 位）。使用论坛、版本库、网盘的安装包，以及破解版或去验证版所产生的问题，官方均不提供支持。Google Play 版需单独购买，与其他平台不互通。
3. 从 v1.7.0 起，可以在启动器“下载”页面登录已购买该游戏的 Google 账号，直接从 Google Play 下载 Minecraft，无需自行寻找安装包。
4. 导入的游戏版本通常需要在实例设置中启用“版本隔离”才能启动。

*适用版本：LeviLauncher-Android 当前版本（v1.7.x）；Google Play 下载功能需 v1.7.0+*
