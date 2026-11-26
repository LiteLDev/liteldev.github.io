# 开发 LeviLamina 模组：综合问题

## 服务端命令和客户端命令的区别

- 服务端命令由服务端注册，可由服务端自身以及同一服务端内的其他玩家执行。
- 客户端命令完全由客户端自行处理，只能由客户端自身执行，其他玩家和服务端不知道该命令的存在。

当 LeviLamina 运行在 **Bedrock Dedicated Server**（下文简称 BDS）上时，模组只能注册服务端命令。  
当 Minecraft 处于**本地世界**时，本质上是在客户端内部运行了一个 BDS，因此既可以注册服务端命令，也可以注册客户端命令。  
当 Minecraft 处于**多人游戏**中时，模组只能注册客户端命令。  
可以通过以下代码获取服务端和客户端的 CommandRegistrar 来注册命令：
```cpp
ll::command::CommandRegistrar::getInstance(false); // 服务端
ll::command::CommandRegistrar::getInstance(true); // 客户端
```

## 在模组的`enable()`方法中注册命令，服务端（BDS）成功客户端失败

这是因为服务端（BDS）和客户端启用模组的时机不同：  
- 服务端会在服务器初始化完成（世界已加载完成）时启用所有模组。
- 客户端会在游戏启动完成（主界面窗口出现）时启用所有模组。
因此在客户端的 enable() 方法中注册命令（无论是客户端命令还是服务端命令）都会失败。  
解决方法是：监听 `ServerCommandRegisterEvent` 再注册服务端命令，监听 `ClientCommandRegisterEvent` 再注册客户端命令。

## LeviLamina 有没有类似 Bukkit Javadoc 那样的 C++ API 文档？Minecraft 本身的类有文档吗？

有。由头文件自动生成的 Doxygen C++ 参考位于 <https://levimc.org/LeviLamina/api/>；带说明和示例的 LeviLamina API 参考位于 <https://levimc.org/zh-Hans/LeviLamina/api_reference/>。Minecraft 原版类（`mc/` 下的头文件）没有官方文档，需要自行阅读头文件。LSE 的脚本 API 文档是手写的，形式有所不同。

## 通过 LeviLauncher 使用的客户端 mod 能用什么语言开发？LeviLamina 客户端有相机等客户端类的头文件吗？

客户端 mod 基于 LeviLamina（client）使用 C++ 开发。当前 LeviLamina 已包含大量客户端相关类，如 `src/mc/client/camera/`、`src-client/mc/client/game/ClientInstance.h`、`src-client/mc/client/gui/controls/renderers/HudCameraRenderer.h` 等，基本已覆盖常用的客户端类。

*适用版本：LeviLamina 客户端版（2026 年 3 月之后的版本）*

## BDS/LeviLamina 升级后，原本能用的 C++ 原生 mod 报内存访问错误，怎么办？

C++ 原生 mod 与 BDS、LeviLamina 版本强绑定，升级版本后若未适配，就可能出现内存访问错误或崩溃。必须使用对应版本的 LeviLamina SDK 重新编译后才能使用；你可以等待作者发布适配版本，或自行获取源码针对新版本重新编译。

## 通过 uuid 获取 `PlayerInfoEntry` 后 name 字段全是空的，PlayerInfo 是否需要开启 `alwaysLaunch` 才会记录玩家名和 uuid？

是的。PlayerInfo 服务默认只有在首次被使用时才会初始化。需要在 LeviLamina 配置中开启 `targeted.playerInfo.alwaysLaunch`（默认为 `false`），让服务器在启动时就初始化 PlayerInfo，才会持续记录玩家名与 uuid/xuid 的对应关系。

*适用版本：LeviLamina 服务端当前版本*

## 使用 LeviLamina 的配置读写接口（基于结构体反射）时，多层嵌套 JSON 怎么定义？JSON 的 key 含有冒号（如 `minecraft:stone`）怎么办？

LL 内置了 `ll::config::loadConfig` 和 `saveConfig`（头文件为 `ll/api/Config.h`），通过结构体反射自动映射。结构体必须包含整数成员 `version`（版本不一致时会调用 updater 并重写文件）。配置路径不要写死，应使用 mod 自身的配置目录（如 `getSelf().getConfigDir()`）。对于嵌套对象，直接在结构体里嵌套 struct 即可；当 key 不固定或含有冒号时，使用 `std::unordered_map<std::string, T>` 或 `std::map` 表示，例如：

```cpp
struct Item {
    std::string dropitem;
    int count;
};
struct Config {
    int version = 1;
    bool instant_destruction = false;
    std::unordered_map<std::string, std::unordered_map<std::string, Item>> destroy;
};
```

反射也支持 enum。默认值直接写在成员初始化中（需为聚合类型，不使用构造函数）。

*适用版本：LeviLamina 0.13 及以上至当前版本*

## 给 LeviLamina mod 接入 Sentry 崩溃上报后，为什么任何装了我 mod 的服务器崩溃（即使和我的 mod 无关）都会给我发大量报告？该怎么设置？

在 mod 的 `manifest.json` 的 `extraInfo` 中配置 `sentryDsn` 后，LL 的崩溃日志器就会上报崩溃。上报范围由 `extraInfo` 中的 `sentryUploadType` 控制：设为 `"all"` 时，只要安装了该 mod 的服务器发生任何崩溃都会上报；不写或设为 `"all"` 以外的任意值时，则仅在该 mod 被判定为可疑模块（崩溃栈涉及该 mod）时上报。此外，服务端可通过 LL 配置项 `modules.crashLogger.uploadToSentry` 关闭上报。

## LeviLamina 的 API 只能在官网文档一个个点开看吗？有没有方便搜索的方法？

官网 C++ Reference（由头文件经 Doxygen 生成）可按 `Ctrl+K` 或 `/` 按名称搜索类、函数和文件。更高效的做法是直接克隆 LeviLamina 仓库，在本地用 VS Code 等编辑器全局搜索头文件（`src/ll/api` 是 LL 自身 API，`src/mc` 是 BDS 公共头文件，`src-server` / `src-client` 分别是服务端/客户端专有头文件）。

## LeviLamina 的 API 文档缺少客户端相关内容（例如 `ClientInstance`），找头文件很费劲怎么办？

客户端相关头文件在 LeviLamina 仓库的 `src-client` 目录下，例如 `ClientInstance` 位于 `src-client/mc/client/game/ClientInstance.h`。建议直接 clone 仓库并在 `src-client` 中搜索。另外，当前官网 C++ Reference 的 Doxygen 输入已包含 `src-client/ll/api` 和 `src-client/mc`，也可以直接在文档中搜索客户端类。

*适用版本：LeviLamina 当前版本（含客户端支持的版本）*

## mod 发布版本号能否用 `v[mod版本号]-mc[MC版本号]`（如 `v0.3.1-mc26.51`）这种格式来标注适配的 MC 版本？

不建议。按 SemVer 2.0.0 规范，带“-”的版本号会被视为预发布（测试）版本，lip 等工具也按 SemVer 解析，在版本选择和自更新中会对预发布版本区别对待。如需附带 MC 版本信息，可使用 build metadata（“+”后缀，例如 `1.0.0+mc26.51`）。

*适用版本：当前所有版本（lip 使用 lip.toml，版本需为 SemVer 2.0.0）*
