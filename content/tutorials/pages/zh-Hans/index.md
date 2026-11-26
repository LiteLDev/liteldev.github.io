# LeviMC 教程

每篇教程都从一台干净的电脑开始，最终做出一个可用的成果——带模组的服务器、带模组的游戏，或是你的第一个模组。想深入了解时，再去各项目文档查看指南和参考。

## 开服

- [开你的第一个服务器](server/first-server.md)——安装 lip，用 lip 的图形界面装好带 LeviLamina 的 Bedrock Dedicated Server 并启动。
- [用命令行开服](server/command-line.md)——用 lip 命令完成同样的操作，适合编写脚本和在远程机器上使用。
- [在 Docker 中运行服务器](server/docker.md)——在容器中运行 LeviLamina，将世界保存在数据卷里；宿主机无需安装 lip 和 Wine。
- [给服务器安装模组](server/install-mods.md)——在 LeviMC 模组目录中查找模组，并用 lip 安装、更新和移除。
- [让朋友连上你的服务器](server/let-friends-join.md)——先在家里的网络中连接，再通过互联网连接，有无公网 IP 均可。

## 游玩

- [在 Windows 上玩模组](play/play-with-mods.md)——安装 LeviLauncher，添加游戏版本，加载模组并启动。
- [在 Android 上玩模组](play/play-with-mods-android.md)——在手机上安装 LeviLauncher，启动从 Google Play 安装的游戏，并添加一个模组。

## 开发模组

- [你的第一个 LeviLamina 模组](develop/first-levilamina-mod.md)——用模板创建并构建 C++ 模组，然后在服务器上加载。
- [你的第一个脚本插件](develop/first-script-plugin.md)——为 LegacyScriptEngine 编写 JavaScript 或 Lua 插件。
- [你的第一个 Android 原生模组](develop/first-android-mod.md)——用模板构建 C++ 模组，打包后导入手机上的 LeviLauncher。
- [用 lip 发布你的模组](develop/publish-a-package.md)——将模组做成 lip 包，让任何人只需一条命令就能安装。

## 自动化

- [用 Be.D.D. 驱动游戏客户端](automate/bedd.md)——让 Minecraft 基岩版在后台运行，由你编写的脚本驱动。
- [你的第一个 bedboo 机器人](automate/first-bedboo-bot.md)——一个用 JavaScript 编写的机器人，能加入你的服务器、聊天并走到你身边。
