# Android 版 LeviLauncher 的功能与设置

## LeviLauncher 安卓版是否依赖手机上已安装的 Minecraft？对游戏有什么要求？

依赖。设备上必须安装来自 Google Play 的官方 Minecraft 基岩版（1.21.80 或更高版本）。启动器会检查其安装来源是否为 Google Play，改包、破解版或从其他渠道安装的 MC 均无法通过启动器启动。在此基础上，启动器还支持导入官方 Minecraft APK，无需逐一安装到系统即可在启动器内运行其他游戏版本（导入的版本通常需要开启版本隔离），但设备上仍必须保留 Google Play 版本。项目地址：<https://github.com/LiteLDev/LeviLauncher-Android>。

*适用版本：LeviLauncher-Android 当前所有版本（最新 v1.7.1）*

## 安卓版 LeviLauncher 打开后原来 MC 里的存档和模组都不见了，怎么把存档、addon、资源包和 `.so` 模组导入到启动器里？

安卓版 LeviLauncher 使用独立的数据目录，与直接启动 Google Play 版 Minecraft 本体时的数据相互隔离，因此在启动器内看不到原有存档。导入方法：将存档打包或改后缀为 `.mcworld`，addon 改为 `.mcaddon`，资源包或皮肤包改为 `.mcpack`，然后在系统“打开方式”中选择 LeviLauncher 即可导入；也可以在启动器内的内容管理（世界、资源包）中导入、导出和备份。`.so` 原生模组（以及 `.levipack` 模组包）同样可以在“打开方式”中选择 LeviLauncher 导入，或在“模组”页面添加。如果开启了版本隔离，不同版本之间的数据也相互独立，导入时请注意选对版本。

*适用版本：LeviLauncher-Android 当前所有版本（最新 v1.7.1）*

## 安卓版 LeviLauncher 怎么导出结构？为什么找不到以前的结构？

在启动器的世界列表中，打开世界的操作菜单并点击“提取结构”。启动器只能读取存档中已保存的结构，未用结构方块保存进存档的结构是找不到的。请先通过启动器进入该世界，放置结构方块并设为保存模式，命名后点击保存；退出世界后回到启动器点击“提取结构”，即可单个导出或打包成 ZIP 导出。

*适用版本：安卓 LeviLauncher 当前版本*

## 安卓版 LeviLauncher 导入资源包/模组非常慢，有什么办法？

资源包或模组越大，导入越慢。建议先更新到最新版启动器（v1.6.1 已优化导入速度）。如果仍然嫌慢，可以手动将压缩包解压到启动器的数据目录：

- 未开启版本隔离时为 `/storage/emulated/0/Android/media/org.levimc.launcher/minecraft/_shared/external/games/com.mojang/resource_packs/`；
- 开启版本隔离的实例则在 `/storage/emulated/0/Android/media/org.levimc.launcher/minecraft/<实例目录>/external/games/com.mojang/resource_packs/`。

解压后直接启动游戏即可。一般情况下，直接在启动器内导入就够用了（导入生成的文件夹名是随机的）。

*适用版本：LeviLauncher-Android 当前版本（使用新共享存储布局时）*

## 安卓 LeviLauncher 装了一个 300 多 MB 的 MC 安装包，占用却变成 700 多 MB，为什么？

启动器会在该版本的目录下保存一份导入安装包的副本（`base.apk.levi`，分包则保存为 `*.apk.levi`），运行前还会从中解压原生库，因此占用空间大约是安装包的两倍。这是正常现象。

*适用版本：安卓 LeviLauncher 导入/下载的版本*
