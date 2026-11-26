# Windows 版 LeviLauncher 的报错与崩溃

## LeviLauncher（PC）游戏崩溃后，崩溃日志在哪里找？

以下说明适用于当前版本的 LeviLamina 客户端。安装了 LeviLamina 的游戏，其崩溃日志保存在对应游戏版本（实例）目录下的 `logs/crash` 文件夹中，文件名为 `trace_<时间>.log` 和 `minidump_<时间>.dmp`；上层 `logs` 目录下还会有 `latest.log`。注意，这并非 Minecraft 原生的崩溃日志目录。反馈问题时，请提供最新的 trace 和 minidump 文件。

启动器自身的日志位于 `%LOCALAPPDATA%\LeviLauncher\Logs`（若启动器在显示界面前就退出，请查看其中的 `startup.log`）。此外，报错对话框中也提供了直接打开日志文件夹的按钮。

*适用版本：LeviLauncher 1.1.0*
