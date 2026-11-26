# 安装 LegacyScriptEngine

LegacyScriptEngine（LSE）是一个 LeviLamina 模组：在服务器上通过 [lip](https://levimc.org/zh-Hans/lip/) 安装，在 Windows 游戏客户端里通过 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) 安装。每种脚本语言打包为一个独立的包，称为**变体**。

## 需要什么

- 已安装 LeviLamina 的服务器或游戏实例，详见[安装 LeviLamina](https://levimc.org/zh-Hans/LeviLamina/install/)。
- 与插件所用语言对应的变体：

    | 变体 | 语言 | 引擎 |
    |---|---|---|
    | `#lua` | Lua | CLua |
    | `#quickjs` | JavaScript | QuickJS，支持 ES 模块 |
    | `#nodejs` | JavaScript | Node.js，支持 npm 包 |
    | `#python` | Python | CPython，支持 pip 包 |

- 仅 `#python` 需要：在运行引擎的机器上安装对应版本的 Python：

    | LSE 版本 | Python 版本 |
    |---|---|
    | >=0.16.2 | 3.12.10 |
    | >=0.9.0 <0.16.2 | 3.12.8 |
    | <0.9.0 | 3.10.11 |

## 安装

### 在服务器上

如果服务器正在运行，请先停止。在服务器目录中安装所需的变体：

```shell
lip install LegacyScriptEngine#quickjs
```

如果不指定变体，`lip install LegacyScriptEngine` 会同时安装 QuickJS 和 Lua 两个引擎。lip 会自动选择适配当前服务器 LeviLamina 的最新 LSE 版本，并安装所需的依赖包。你也可以在 lip 界面的**市场**页面搜索 LegacyScriptEngine 进行安装。

### 在 Windows 的游戏里

在 LeviLauncher 中打开实例的 **LeviMC Mods** 页面，找到 LegacyScriptEngine 并安装。LeviLauncher 会自动选择适配当前客户端及实例中 LeviLamina 的构建版本。

## 确认装好了

在服务器上运行 `lip list`，列表中应包含 `github.com/LiteLDev/LegacyScriptEngine`，并附带变体（例如 `#quickjs`）和版本号。

## 更新

```shell
lip update LegacyScriptEngine#quickjs
```

请指定你所安装的变体。不带包名直接运行 `lip update` 会更新所有已显式安装的包。如需切换到指定版本或回退到旧版本，请在命令中指明版本号：`lip update LegacyScriptEngine#quickjs@0.23.1`。

## 其他版本

所有发行版均可在[发行版列表](https://github.com/LiteLDev/LegacyScriptEngine/releases)中查看。每个 LSE 版本对应一个 LeviLamina 版本，lip 只会提供适配当前服务器的版本。如需安装特定版本，请在 `@` 后加上版本号：`lip install LegacyScriptEngine#quickjs@0.23.1`。

## 下一步

- [给服务器安装模组](https://levimc.org/zh-Hans/tutorials/server/install-mods/)：通过 lip 界面和命令行在服务器上安装 LSE 及其他模组。
- [你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)：编写、加载并运行一个插件。
- 已有 LLSE 插件？将它们放入 `plugins/` 目录后启动服务器即可，详见[插件与引擎](concepts/plugins.md)。
