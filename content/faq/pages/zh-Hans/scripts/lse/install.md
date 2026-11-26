# LegacyScriptEngine 的安装、配置与版本

## 安装

### LSE 的 quickjs、nodejs、lua、python 四个引擎都要装吗？怎么判断一个插件需要哪个引擎？

不需要全部安装，用到哪种插件就安装对应的引擎（`lip install LegacyScriptEngine#quickjs` / `#lua` / `#nodejs` / `#python`；不指定变体时默认安装 quickjs 和 lua）。

判断方法：

1. 查看插件文件后缀（`.js` / `.lua` / `.py`）。
2. JS 插件分为 QuickJS 和 Node.js 两种：带有 `package.json`（使用 npm 包）的一般是 Node.js 插件，否则大概率是 QuickJS 插件。
3. 最准确的方法是查看插件 `manifest.json` 中的 `type` 字段（`lse-quickjs`、`lse-nodejs`、`lse-lua`、`lse-python`），以及 `dependencies` 中列出的依赖引擎（如 `legacy-script-engine-quickjs`）。

如果装错或漏装，启动日志也会提示缺少哪个依赖。

注意：使用 Python 引擎需要本机安装对应版本的 Python（LSE >=0.16.2 为 3.12.10）。

*适用版本：当前所有版本（LSE 0.10.0 起为变体式包名；最新 0.23.1）*

### LSE 文档里说的插件目录 `/path/to/bedrock_dedicated_server/plugins` 指的是哪里？

指 BDS 服务端根目录（即 `bedrock_server_mod.exe` 所在目录）下的 `plugins` 文件夹。当前 LeviLamina 的模组目录是根目录下的 `mods/`，而 LSE 从 0.23.0 起会在启动时自动创建指向 `mods/` 的 `plugins` 目录联接（junction）。因此，将 LLSE 插件放入 `plugins/` 或 `mods/` 均可；服务端启动后会自动将其迁移到 `mods/<插件名>/` 并生成 `manifest.json`，重启后即可加载。

注意：如果服务器根目录下已经存在真实的 `plugins` 文件夹（例如旧版本遗留），LSE 无法创建链接，并会报错 `a file or directory with the same name already exists`。此时需要将里面的插件移至 `mods/`，然后删除该 `plugins` 文件夹。

*适用版本：LSE 0.23.0 及以上（当前 0.23.x）*

### LeviLamina 下如何安装 LSE 的 Python 引擎？

在服务器根目录下使用 lip 安装 LSE 的 python 变体：`lip install github.com/LiteLDev/LegacyScriptEngine#python`（客户端请使用 LeviLauncher 安装）。此外，Python 引擎要求本机安装对应版本的 Python（LSE >=0.16.2 需要 Python 3.12.10）。由于 Python 插件较少，非必要可以不安装。

*适用版本：LSE 0.16.2 及以上（当前 0.23.x）*

### 为了使用 SimpleTPS 这类 LSE 插件安装 LSE 时，必须安装 Python 版 LSE（并要求特定 C++/Python 版本）吗？

不需要。LSE 按语言拆分为多个引擎变体（`#quickjs`、`#nodejs`、`#lua`、`#python`），只需安装插件实际用到的变体即可。例如运行 JS 插件只需执行 `lip install github.com/LiteLDev/LegacyScriptEngine#quickjs`。如果不指定变体，直接执行 `lip install github.com/LiteLDev/LegacyScriptEngine`，则只会安装 QuickJS 和 Lua 引擎，不会安装 Python 引擎。只有 Python 引擎才要求本机安装特定版本的 Python（LSE >=0.16.2 要求 3.12.10）；用不到的 Python 版 LSE 可以通过 `lip uninstall` 卸载。

*适用版本：当前所有 LSE 版本（`lip.toml` 变体）*

### 使用 LegacyScriptEngine 的 nodejs 引擎需要单独安装 Node.js 吗？

仅运行插件时不需要。执行 `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` 会自动下载包含 libnode 的 `node-prebuilt.zip` 并解压到 `mods/legacy-script-engine-nodejs/`，同时自动安装 7-zip 等依赖。只有在本机开发 Node.js 插件（需要执行 `npm init` 等命令）时，才需要自行安装 Node.js。

*适用版本：当前 LSE nodejs 引擎*

### 想用 JS 写 LeviLamina 服务器插件，从零搭建环境的步骤是什么？需要 xmake/cmake/mingw 吗？

运行和编写 JS 插件不需要 xmake/cmake/mingw（这些工具仅用于 C++ 模组开发）。环境搭建步骤如下：

1. 从 <https://github.com/LiteLDev/lip/releases/latest> 下载并安装 lip（`lip-<version>-win-x64.msi`）。
2. 国内网络环境下，可配置 GitHub 代理：`lip config set github_proxy <代理地址>`。
3. 新建服务器目录并 `cd` 进入该目录，执行 `lip install LeviLamina --accept-eula`（会自动一并安装版本匹配的 BDS）。
4. 安装 JS 引擎：`lip install github.com/LiteLDev/LegacyScriptEngine#nodejs`（或 `#quickjs`）。
5. 执行 `lip run` 或直接运行 `bedrock_server_mod.exe` 启动服务端。

编写的插件应放在 `mods/<插件名>/` 目录下（`plugins/` 是指向 `mods/` 的链接）。目录内需包含入口文件和 `manifest.json`（其中 `name` 与目录名一致，`entry` 为入口 js 文件，`type` 设为 `lse-nodejs` 或 `lse-quickjs`，`dependencies` 中填写 `legacy-script-engine-nodejs` / `legacy-script-engine-quickjs`）。在 Node.js 引擎下，在 `package.json` 中设置 `"type": "module"` 即可使用 ES 模块。API 文档详见：<https://levimc.org/zh-Hans/LegacyScriptEngine/>。

也可以手动下载安装，但需要自行补齐所有依赖（LegacyRemoteCall、LegacyMoney、iListenAttentively、7-zip、node-prebuilt 等）。

*适用版本：lip 0.41.x；LeviLamina 26.x；LSE 0.23.x*

### 跳过 lip、手动安装 LSE 的 NodeJS 引擎后，加载（`.llplugin`）插件时提示解码/解压失败，怎么办？

这是因为缺少 `7za.exe`。LSE nodejs 引擎需要调用 `7za.exe` 来解压 `.llplugin` 文件。使用 lip 安装 `#nodejs` 变体时，lip 会通过依赖 `github.com/LiteLDev/7-zip-tooth` 自动将 `7za.exe` 放到服务端根目录；手动安装时，则需自行从该仓库下载 `7za.exe` 并放到服务端根目录（无需运行）。此外，libnode（来自 `node-prebuilt.zip`）应放在 `mods/legacy-script-engine-nodejs/` 下，而不是服务端根目录。推荐直接使用 `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` 安装。

*适用版本：当前 LSE nodejs 引擎（手动安装时）*

### LSE 的 Python 引擎和 NodeJS 引擎安装时有什么需要注意的？

目前各引擎均作为 LegacyScriptEngine 包的变体提供，直接使用 lip 安装即可：`lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` / `#python`（`#quickjs`、`#lua` 同理）。lip 会自动处理依赖（其中 NodeJS 变体会一并下载 node 预编译运行时到 `legacy-script-engine-nodejs` 目录）。

Python 引擎要求在运行机器上安装对应版本的 Python：LSE >=0.16.2 需使用 3.12.10，>=0.9.0 \<0.16.2 需使用 3.12.8，\<0.9.0 需使用 3.10.11。由于引擎会从环境变量 `PATH` 中名称包含 Python 的目录里查找 `Lib`、`DLLs` 和 `site-packages`，安装 Python 时必须将其加入 `PATH`。

*适用版本：LSE 0.23.x（Python 版本对应表适用于所有版本）*

## 配置

### 用不到 Lua/Python 引擎和 LegacyMoney（原 LLMoney），能否禁用这些组件以加快启动和节省资源？

不需要的脚本引擎可以移除。LSE 的每个引擎都是独立的 mod 目录（`mods/legacy-script-engine-quickjs`、`mods/legacy-script-engine-lua`、`mods/legacy-script-engine-python`、`mods/legacy-script-engine-nodejs`），直接删掉不用的目录即可。

如果使用 lip，单独安装的变体可以用 `lip uninstall` 卸载（例如 `lip uninstall LegacyScriptEngine#python`）。但默认安装（不带变体的 `lip install LegacyScriptEngine`）会同时安装 QuickJS 和 Lua；二者是默认变体的依赖，lip 不会单独卸载仍被依赖的包。如果只想保留一个引擎，请先卸载 LegacyScriptEngine，再单独安装所需变体（例如 `lip install LegacyScriptEngine#quickjs`）。

但 LegacyMoney 不能删除。在当前版本中，LegacyMoney 是 LSE 的必需依赖（`manifest.json` 的 `dependencies` 列出了 LegacyMoney、LegacyRemoteCall 和 iListenAttentively），删掉后 LeviLamina 会因为缺少依赖（`MissingDependency`）拒绝加载所有 LSE 引擎。

*适用版本：LegacyScriptEngine 0.23.x（LeviLamina 26.60.x）及当前版本*

## 版本与兼容性

### BDS 26.20（LeviLamina 26.20.x）上装了最新版 LSE 后不工作、LSE 插件不加载，该装哪个版本的 LSE？

LSE 的每个版本只对应一个 LeviLamina 小版本系列，不能跨版本使用。最新的 LSE 0.23.x 面向 LeviLamina 26.60.*（BDS 26.60），无法在 26.20 上运行。LeviLamina 26.20.x 对应 LSE 0.19.x，请安装该系列的最后一个版本 LSE 0.19.7。

版本对应关系：

- 0.19.x → LL 26.20.*
- 0.20.0 → LL 26.32.*
- 0.21.x → LL 26.40.*
- 0.22.x → LL 26.51.*
- 0.23.x → LL 26.60.*

查看 LSE CHANGELOG 中“Adapted to LeviLamina xx”的条目，即可确认各版本适配的 LL 版本。

*适用版本：LeviLamina 26.20.x；LSE 0.19.x～0.23.x（版本对应原则适用于当前版本）*

### LegacyScriptEngine 的 NodeJS 引擎（`legacy-script-engine-nodejs`）内置的是哪个版本的 Node.js？

Node.js v22.12.0。通过 lip 安装 LSE 的 nodejs 变体时，会一并下载 LiteLDev/node 的 v22.12.0 预编译包（`node-prebuilt.zip`），ScriptX 的 V8 后端也是基于 node v22.12.0 构建的。

*适用版本：LSE 0.9.0 及以上（当前 v0.23.1）*
