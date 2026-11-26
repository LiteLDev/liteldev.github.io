# LeviLamina 在服务器上的功能与用法

## LeviLamina 是不是只能用于服务端（BDS）？客户端单人存档能用吗？

不是。LeviLamina 是非官方的 Minecraft 基岩版模组加载器，既可用于基岩版专用服务器（BDS），也可用于 Windows 上的 Minecraft 客户端。客户端可通过 LeviLauncher 启动器安装游戏版本、LeviLamina 和客户端模组，随后即可在单人存档中使用这些模组（详见官方教程“在 Windows 上玩模组”）。其中 LeviLauncher 只是启动器，真正的模组加载器是 LeviLamina。

*适用版本：LeviLamina 当前版本（26.60.x），LeviLauncher 1.x*

## 如何查看当前服务器安装的 LeviLamina 版本？

在服务器控制台输入 `version` 命令，即可输出形如 `Game version <游戏版本> with LeviLamina-<版本>` 的信息；LeviLamina 客户端对应的命令为 `cliversion`。可在 LeviLamina 配置的 `modules.command.versionCommand` 中开关该命令并设置权限等级，关闭后将不再注册该命令。

*适用版本：当前所有 LeviLamina 版本*

## LeviLamina 本体是否支持 Data-Driven UI（DDUI）？从哪个版本开始？LSE 脚本插件能用吗？

支持。LeviLamina 自 26.20.7 起支持 DDUI（命名空间为 `ll::ui`，头文件如 `ll/api/ui/form/CustomForm.h`、`ll/api/ui/form/MessageBox.h`），与旧版 `ll::form` 是两套独立的接口。使用文档见 <https://levimc.org/zh-Hans/LeviLamina/developer_guides/how_to_guides/data_driven_ui_guide/>，API 参考见 `api_reference/data_driven_ui`。目前仅提供原生（C++）API，需通过 C++ mod 实现；LSE 暂未导出相关接口。

*适用版本：LeviLamina 26.20.7 及以上*
