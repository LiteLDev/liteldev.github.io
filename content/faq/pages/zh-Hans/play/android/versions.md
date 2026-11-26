# Android 版 LeviLauncher 的版本与兼容性

## 为什么 Windows 版的 .dll mod（LeviLamina 模组）无法导入安卓版 LeviLauncher？

`.dll` 是 Windows 平台的 mod（供 PC 上的 LeviLamina / Windows 版 LeviLauncher 使用），与安卓不通用。安卓版 LeviLauncher 只支持为 Android 编译的原生模组（`.so` 文件，或 `.levipack` / `.mcmod` / `.zip` 模组包），并由内置的 Preloader（`preloader-android`）而非 LeviLamina 加载。要使用 `.dll` mod，需在电脑上使用 PC 版 LeviLauncher + LeviLamina；在安卓设备上则需要使用专门的 Android 版 mod。

*适用版本：LeviLauncher-Android 当前所有版本（最新 v1.7.1）*

## 安卓版 LeviLauncher 导入某个 MC 版本（如 26.10）后崩溃，或提示要求 64 位，是什么原因？

LeviLauncher 安卓版仅支持 ARM64（`arm64-v8a` / armv8，64 位）设备和 64 位 Minecraft。armv7（32 位）的安装包导入后无法使用，必须换成 64 位安装包。建议使用 Google Play 正版（自 v1.7.0 起，也可在启动器内登录 Google 账号直接下载）。此外，导入的版本通常需要启用版本隔离才能启动。

*适用版本：LeviLauncher-Android 当前所有版本*

## 安卓 LeviLauncher 下载 Minecraft 安装包或模组时有 aarch64 / armv7 / x86 等多个架构版本，应该选哪个？

选择 arm64（`aarch64` / armv8 / `arm64-v8a`）。LeviLauncher 安卓版本身仅构建 `arm64-v8a` 版本，也仅支持 ARM64 设备上的 64 位 Minecraft，其他架构的 MC 安装包均无法启动。`.so` 模组同样要选 arm64 版本，且模组版本必须与所用的 MC 版本对应。启动器内置的模组目录已按 `android-arm64` 平台筛选，可直接安装。

*适用版本：LeviLauncher-Android 当前所有版本*
