# 插件与引擎

本页介绍脚本插件在 LeviLamina 和 LSE 中的形态与运行机制：它的存放位置、它的清单如何指定运行引擎、加载和卸载时的处理流程，以及为 LLSE 编写的插件如何迁移为 LeviLamina 插件。

## 插件就是模组

LeviLamina 从服务器的 `mods` 文件夹加载模组。每个模组都是一个包含 `manifest.json` 的文件夹。C++ 模组的类型为 `native`，而脚本插件的类型则取决于运行它的引擎：

| `manifest.json` 中的 `type` | 引擎 | 引擎模组 |
|---|---|---|
| `lse-quickjs` | JavaScript（QuickJS） | `legacy-script-engine-quickjs` |
| `lse-lua` | Lua | `legacy-script-engine-lua` |
| `lse-nodejs` | JavaScript（Node.js） | `legacy-script-engine-nodejs` |
| `lse-python` | Python | `legacy-script-engine-python` |

每个引擎本身也是一个 LeviLamina 模组，由 `LegacyScriptEngine` 包的对应变体安装（`#quickjs`、`#lua`、`#nodejs`、`#python`；见[语言支持](../apis/LanguageSupport.md)）。引擎加载时会向 LeviLamina 注册为对应插件类型的管理器，之后 LeviLamina 会将该类型的所有模组交由它处理。

一个最简的 QuickJS 插件结构如下：

```
mods/
    MyPlugin/
        manifest.json
        main.js
```

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

- `entry`：引擎要运行的入口脚本，路径相对于插件文件夹。
- `name`：插件名称，请与文件夹名保持一致。
- `type`：指定运行该插件的引擎。
- `dependencies`：必须先加载的模组列表。在此处填入引擎，可确保引擎在插件之前加载。如果插件依赖其他插件，也应一并列入：被依赖的插件会先加载，其事件监听器也会先注册、先调用。

[写你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)演示了如何一步步搭建这一结构。此外，Node.js 插件还包含 `package.json`，Python 插件还包含 `pyproject.toml`；详见[语言支持](../apis/LanguageSupport.md)。

### `plugins` 与 `mods`

每个引擎加载时，都会将服务器目录下的 `plugins` 链接到 `mods`（在 Windows 上为目录联接），因此 `plugins/MyPlugin` 与 `mods/MyPlugin` 指向同一个文件夹。如果 `plugins` 已经存在且与 `mods` 不是同一个文件夹，LSE 会记录一条错误，并保持原目录不变。

## 每个插件一个引擎实例

每个插件都运行在独立的脚本引擎实例中，实例以插件名称命名。LSE 加载插件时会依次执行以下步骤：

1. 安装依赖：对于 Node.js，若插件的 `package.json` 声明了依赖且尚无 `node_modules` 文件夹，则在插件文件夹中运行 `npm install --omit=dev`；对于 Python，若插件的 `site-packages` 文件夹尚不存在且插件列出了依赖，则运行 `pip install` 将依赖安装到该文件夹中。
2. 创建一个新的引擎实例，以及一个以插件命名的日志记录器。
3. 绑定 API（`mc`、`ll`、`log` 等，见 [API 的工作方式](script_api.md)）。
4. 运行引擎的基础库（QuickJS、Lua 和 Python）。
5. 运行入口脚本。

由于每个插件的实例相互独立，插件之间不共享全局变量。如需调用其他插件的函数，请使用 `ll.exports` 导出并用 `ll.imports` 导入（见 [ll API](../apis/ScriptAPI/Ll.md)）。

如果入口脚本抛出错误，插件将不会加载：控制台会输出错误信息和调用栈，且脚本在报错前注册的事件监听器、定时任务和导出函数都会被移除。

### 在服务器运行时加载

插件可以在服务器启动后加载（例如使用 LeviLamina 的 `ll reload <插件名>`）。此时 LSE 会立即调用该插件的 `onServerStarted` 监听器，并针对每位在线玩家各调用一次 `onPreJoin` 和 `onJoin` 监听器。因此，在这些事件中进行初始化的插件在热加载时也能正常工作，效果与随服启动一致。

### 卸载

在服务器运行时卸载插件，LSE 会先针对每位在线玩家调用插件的 `onLeft` 监听器，再调用通过 `ll.onUnload` 注册的函数；随后移除插件的定时任务、事件监听器和导出函数，并释放其引擎实例。插件通过 `mc.newCommand` 注册的命令仍会保留在游戏中，但不再触发回调，直到服务器重启。

### 在客户端上

在 Windows 版 Minecraft 客户端中，插件脚本仅在本地世界运行期间执行（单人世界相当于一个本地服务器）：脚本随内置服务器启动而开始，随其停止而结束。加入他人服务器时，脚本不会运行。

## 为 LLSE 编写的插件

LLSE 插件是直接放入 `plugins/` 目录的单个文件。引擎加载时，会在 `mods/`（即同样在 `plugins/`）中查找以下文件：

| 引擎 | 迁移的文件 |
|---|---|
| QuickJS | `*.js` |
| Lua | `*.lua` |
| Python | `*.py` |
| Node.js | `*.llplugin`（zip 压缩包） |

对于找到的每个文件，引擎会创建 `mods/<不带扩展名的文件名>/` 文件夹并将文件移入其中（Node.js：将压缩包解压到该文件夹并删除压缩包）。如果该文件夹下还没有 `manifest.json`，引擎会自动生成一个：以该文件作为入口（Node.js：压缩包中找到的入口脚本），以文件名作为插件名，并将当前引擎设为插件类型和依赖项。完成后，引擎会记录插件已迁移、需重启才能加载；再次重启服务器即可运行这些插件。

如果目标文件夹中已有同名文件，迁移将报错失败。如需关闭迁移，可在引擎配置中将 `migratePlugins` 设为 `false`。

## 引擎的配置

每个引擎都会读取自身模组文件夹下的 `config/config.json`（例如 `mods/legacy-script-engine-quickjs/config/config.json`）。若文件不存在，引擎会使用默认值生成该文件：

| 键 | 默认值 | 含义 |
|---|---|---|
| `version` | `3` | 文件格式的版本。 |
| `migratePlugins` | `true` | 启动时迁移 LLSE 插件（见上文）。 |
| `debugCommandLevel` | 游戏管理员（OP） | 允许运行引擎调试命令（`jsdebug`、`luadebug`）的权限。 |
| `fixLegacyAddons` | 未设置 | 仅 Node.js：修复用低于 11.1.0 的 node-gyp 构建的原生插件（addon）。 |
