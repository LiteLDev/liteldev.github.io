# LegacyScriptEngine

用于在 LeviLamina 上运行 LLSE 插件的脚本引擎：无需 C++，直接用 JavaScript、Lua 或 Python 为 Minecraft 基岩版服务器编写插件。

## LegacyScriptEngine 是什么

LegacyScriptEngine（LSE）是一个 [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) 模组，用于运行以脚本语言而非 C++ 编写的插件。它延续了 LiteLoaderBDS 的脚本引擎（LLSE）：旧的 LLSE 插件几乎无需修改即可在 LeviLamina 上运行，新插件也沿用同一套 API。本站即这套 API 的文档。

LSE 可用于基岩版专用服务器和 Windows 版的 Minecraft 客户端。与其他 LeviLamina 模组一样，服务端通过 [lip](https://levimc.org/zh-Hans/lip/) 安装，客户端通过 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) 安装，详见[安装](install.md)。

LSE 提供：

- **四种脚本引擎**：Lua、QuickJS、Node.js 和 Python，每种引擎均通过 lip 作为独立的包变体安装（见[语言支持](apis/LanguageSupport.md)）。
- **LLSE 插件照常运行**：将 LLSE 插件放入 `plugins/` 并启动服务器，LSE 会自动迁移插件并生成 LeviLamina 模组清单（见[插件与引擎](concepts/plugins.md)）。
- **LLSE API**：涵盖事件、玩家、方块、物品、NBT、表单、文件、网络等（见 [API 参考](apis/README.md)）。

## 几行代码的插件

插件就是 `mods/`（即 `plugins/`，二者是同一个文件夹）下的一个文件夹，内含脚本文件以及一个指定由哪个引擎来运行的 `manifest.json`。下面这个 JavaScript 插件会在每位玩家加入时发送问候，并注册一个控制台命令：

```json
{
    "entry": "main.js",
    "name": "MyPlugin",
    "type": "lse-quickjs",
    "dependencies": [
        {
            "name": "legacy-script-engine-quickjs"
        }
    ]
}
```

```js
log("MyPlugin is running!");

mc.regConsoleCmd("greet", "Greets someone from the console", (args) => {
    log(`Hello, ${args[0] ?? "world"}!`);
});

mc.listen("onJoin", (player) => {
    player.tell(`Welcome, ${player.name}!`);
});
```

启动服务器后，控制台会输出 `MyPlugin is running!`；输入 `greet Steve`，控制台会回复 `Hello, Steve!`。[写你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)一文将带你从安装引擎开始，一步步写出这个插件并在游戏中看到效果。

## 引擎

每种语言各有对应的引擎，作为 `LegacyScriptEngine` 包的变体安装。所有引擎共用同一套 API，因此 API 参考适用于所有语言（语言间的差异见[语言支持](apis/LanguageSupport.md)）。

| 变体 | 语言 | 引擎 |
|---|---|---|
| `#lua` | Lua | CLua |
| `#quickjs` | JavaScript | QuickJS，支持 ES 模块 |
| `#nodejs` | JavaScript | Node.js，支持 npm 包 |
| `#python` | Python | CPython，支持 pip 包 |

关于如何安装特定变体，以及 Python 引擎所需的 Python 版本，请参见[安装](install.md)。

在客户端上，0.23.1 及更早版本的变体名为 `#client_lua`、`#client_quickjs`、`#client_nodejs` 和 `#client_python`；LeviLauncher 会自动为你选择正确的版本。

## 从这里开始

- [给服务器安装模组](https://levimc.org/zh-Hans/tutorials/server/install-mods/)：使用 lip 在 LeviLamina 服务器上安装 LegacyScriptEngine 及其他模组。
- [写你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)：编写、加载并运行你的第一个插件。

已经有现成的 LLSE 插件？将它们放入 `plugins/` 并启动服务器，插件就会自动完成迁移并生成 LeviLamina 模组清单（`manifest.json`）。重启服务器即可加载。

## 本站内容

- **指南**：按任务组织的插件开发教程，包括[监听事件](guides/events.md)、[注册命令](guides/commands.md)、[显示表单](guides/forms.md)、[存储数据](guides/storing_data.md)以及[日志与定时任务](guides/logging_and_timers.md)。
- **概念**：[插件与引擎](concepts/plugins.md)（清单、加载、迁移）、[语言支持](apis/LanguageSupport.md)（各引擎的差异）和 [API 的工作方式](concepts/script_api.md)（全局对象、对象、回调）。
- **参考**：LSE 的[所有 API](apis/README.md)，涵盖事件、玩家、方块、物品、NBT、表单、文件、网络等。如需编辑器代码补全和项目脚手架，请参见 [legacy-script-engine-api](https://github.com/LiteLDev/legacy-script-engine-api)。
- **问答**：[LegacyScriptEngine 问答](https://levimc.org/zh-Hans/faq/scripts/lse/basics/)，收录在 LeviMC 项目的公共问答库中。

LegacyScriptEngine 是一个开源项目，欢迎访问[仓库](https://github.com/LiteLDev/LegacyScriptEngine)并了解[如何参与贡献](https://github.com/LiteLDev/LegacyScriptEngine/blob/develop/CONTRIBUTING.md)（提交 issue、翻译或 PR）。

## 许可

GPL-3.0-or-later © LeviMC
