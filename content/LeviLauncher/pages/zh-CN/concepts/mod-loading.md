# 模组如何加载

Minecraft 基岩版本身不支持模组：模组是原生代码，由加载器在游戏启动时加载到游戏进程中。本页说明 LeviLauncher 使用哪些加载器、模组放在哪里，以及添加模组的几种方式之间的关系。

## 模组放在哪里 <Badge platform="windows" />

每个实例都有一个 `mods\` 文件夹（见[文件夹与文件](../reference/files)）。每个模组都是其中的一个子文件夹，包含一个描述该模组的 `manifest.json`：

| 字段 | 含义 |
| --- | --- |
| `name` | 模组名称。 |
| `entry` | 加载器加载的文件（一个 `.dll`），路径相对于模组文件夹。 |
| `version` | 模组版本。 |
| `type` | 由哪个加载器加载：`preload-native` 由 LeviLauncher 的原生加载器加载；LeviLamina 模组有各自的类型。 |
| `author` | 作者（可选）。 |

模组属于单个实例，不受[隔离](./isolation)影响；隔离只涉及游戏数据。

**关闭模组**（在 **管理模组** 中，或运行 `LeviLauncher.exe mod disable`）会把它的 `manifest.json` 改名为 `manifest.json.close`；重新开启时再改回原名。模组文件仍留在原处，只是查找 `manifest.json` 的加载器不会再识别该模组。

## 两个加载器 <Badge platform="windows" />

### LeviLauncher 的原生加载器

LeviLauncher 安装或准备实例时，会把自带的加载器 `LeviLauncher.dll` 放在游戏可执行文件旁边，并写入可执行文件的导入表，让 Windows 随游戏一起加载它。这适用于 GDK 和 UWP 的 x64 构建；[隔离](./isolation)也是靠它实现的。

游戏启动时，原生加载器按名称顺序遍历 `mods\` 中的文件夹，加载每个 `type` 为 `preload-native` 的模组的 `entry`。不含 `manifest.json` 的文件夹和其他类型的模组都会跳过。如果实例中还有另一个预加载器（位于游戏可执行文件旁边的 `preloader.dll`），原生加载器会把所有模组的加载工作交给它。原生加载器需要 Visual C++ 运行库（x64），LeviLauncher 会检查并提供安装。

### LeviLamina

[LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) 是 LeviMC 的模组加载器。[LeviMC 模组](https://levimc.org/zh-Hans/mods/)中的大多数模组都是 LeviLamina 模组，需要支持对应实例游戏版本的 LeviLamina。对于受支持版本的 GDK 实例，LeviLauncher 会将 LeviLamina 作为内置包管理器的软件包进行安装（可通过安装版本时的 **安装 LeviLamina** 开关，或 **实例设置** 中的 **加载器** 选项卡开启）。

## 添加模组的三种方式 <Badge platform="windows" />

| 你添加的是 | LeviLauncher 的做法 |
| --- | --- |
| **LeviMC 模组** 中的模组（或 `mod install owner/repo`） | 用内置的 [lip](https://github.com/LiteLDev/lip) 兼容包管理器将其作为软件包安装：下载适用于当前平台的发布版本，安装依赖的软件包，并记录到实例的 `.lip\state.json` 中。如果模组需要 LeviLamina，而已安装的版本不兼容（或尚未安装），则会先安装兼容的 LeviLamina。按这种方式安装的模组可以作为软件包更新和删除。 |
| `.mcmod` 模组包（或 `.zip`） | 解压到 `mods\` 下的新文件夹中。压缩包内必须包含 `manifest.json`。 |
| 单个 `.dll` | 放入 `mods\` 下的新文件夹中，并为它生成 `manifest.json`：默认以文件名为名称，类型为 `preload-native`，版本为 `0.0.0`。 |

软件包在 `lip.toml` 和 `.lip\state.json` 中通过 `side`（`client` 或 `server`）和 `platform`（例如 `win-x64`）记录运行环境。对于客户端，如果模组提供 `client` 变体，LeviLauncher 会安装该变体；否则安装默认变体。详情（包括旧软件包如何迁移）见[模组与集成](../guide/mods-integrations)。

## Android <Badge platform="android" />

Android 版加载原生模组，即在游戏进程中运行的 `.so` 库。请将安装模组的环境放在隔离版本中，并只安装来源可信的模组。如需自行开发，请参阅 LeviLamina 文档中的 [Android 原生模组](https://levimc.org/zh-Hans/LeviLamina/developer_guides/android/)。

## 相关页面

- [模组与集成](../guide/mods-integrations)
- [实例与游戏版本](./instances)
- [命令行](../reference/command-line)
