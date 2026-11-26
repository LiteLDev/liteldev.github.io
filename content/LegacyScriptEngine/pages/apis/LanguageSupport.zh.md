# 📋 语言支持

## 🌏 开发语言支持情况

得益于 [ScriptX](https://github.com/Tencent/ScriptX) 项目，脚本引擎基于同一套源代码适配了多种开发语言。同时，各语言的 API 保持一致，得以共用同一份开发文档，大幅降低了维护成本。

目前，脚本引擎支持使用以下语言编写插件：

| 语言后端         | 备注                                |
|--------------|-----------------------------------|
| `JavaScript` | 使用 QuickJS 引擎运行插件，支持 ES Module 机制 |
| `Lua`        | 使用 CLua 引擎运行插件                    |
| `Node.js`    | 改造 Node.js 使其适合嵌入工作，支持 npm 包管理    |
| `Python`     | 使用 CPython 引擎运行插件，支持 pip 包管理      |

!!! tip
    如需使用 C++、Go、Rust 等原生语言编写插件，请前往 [主页](https://levimc.org/zh-Hans/LeviLamina/) 查阅相应语言的文档。

## JavaScript 语言支持说明

- 使用轻量的 QuickJS 引擎运行简单的 JavaScript 插件，资源占用较低。
- 当前版本的 QuickJS 支持至 ES2020 语言特性，并原生支持 ESModule 模块机制，便于管理项目。
- 暂不支持包管理机制。如需使用包管理器，请改用 Node.js 开发插件，并通过 npm 管理依赖。
- 在 BDS 控制台中执行 `jsdebug` 命令即可进入或退出 QuickJS 交互式命令行环境，方便在开发插件时进行简单测试。

### 关于 QuickJS ESModule 的路径解析行为

LegacyScriptEngine 使用的 ScriptX 派生自上游的 Tencent/ScriptX 项目，并在其基础上新增了 Python 后端支持等功能。

在 QuickJS 后端中，ScriptX 默认使用 **quickjs-libc.h** 提供的 `module loader`。该加载器在解析入口模块时，其行为与标准 ESModule 不完全一致。

具体而言，该加载器在加载 **入口模块** 时，会将模块的基准路径（base path）设为 **当前工作目录 (CWD),即服务器程序所在目录**，而非脚本文件所在的目录。因此，入口文件中相对 `import` 路径的解析行为与标准 ESModule 不同。

假设脚本插件的目录结构如下：

```
c:/bds
    bedrock_server_mod.exe
    plugins/
        your_plugin/
            manifest.json
            index.js
            command/
                command.js
```

**index.js** 入口文件：
```js
import { initCommand } from "./command/command.js"

initCommand();
```

此时，QuickJS 会将入口模块的 `import.meta.url` 解析为 `file:///c:/bds`，而非 `file:///c:/bds/plugins/your_plugin`。

这会导致 `./command/command.js` 解析失败，进而使插件无法加载。

例如，QuickJS 可能会抛出如下错误（原始日志）：
```
19:26:12.343 ERROR [LeviLamina] Failed to load plugin your_plugin: Unexpected token '{'      
19:26:12.343 ERROR [LeviLamina]     at ./plugins/your_plugin\index.js:1:1
```

解决方法是改用**相对于工作目录的路径**：

```js
import { initCommand } from "./plugins/your_plugin/command/command.js"
```

如此即可正常加载模块。

!!! tip
    该问题**仅影响 manifest.json 指定的入口模块**。入口模块加载完成后，其他模块之间的 `import` 行为均符合标准 ESModule 规则。

## Lua 语言支持说明

- 使用 CLua 引擎，支持通过 require 进行简单的项目管理。
- 由于 Rocks 包管理机制需要引入编译器，目前暂未提供支持。如需使用扩展依赖（如 SQLite 等常用库），可手动编译后引入项目。
- 在 BDS 控制台中执行 `luadebug` 命令即可进入或退出 Lua 交互式命令行环境，方便在开发插件时进行简单测试。

## Node.js 支持说明

- LSE 自行实现了 Node.js 的启动代码，使其能够以嵌入式模式运行，并隔离了不同插件的执行环境。
- 通过自研接口实现了对 npm 的编程式（programmatic）调用，支持根据 package.json 安装第三方依赖包。
- 支持 ES 模块：在 `package.json` 中设置 `"type": "module"` 即可将插件作为 ES 模块加载。
- Node.js 引擎不提供调试模式：与 `jsdebug`、`luadebug` 和 `pydebug` 不同，BDS 控制台中没有对应的交互式命令行。

#### ⭐ **Node.js 插件开发方法**

1. 安装 Node.js。
2. 新建插件开发目录，在该目录下打开终端并执行 `npm init` 命令，按照提示填写项目信息以创建新项目。
3. 在指定的入口文件中编写插件代码。
4. 如有需要，可以将源码拆分为多个文件，并通过 require 引入。合理拆分源码有助于保持项目结构清晰，便于后续维护与扩展。

#### ⭐ **Node.js 插件打包 & 部署方法**

- 插件编写完成后，将 `package.json` 及所有插件源码打包为 zip 压缩包，并**将文件名后缀修改为 .llplugin**。
- 请勿将 `node_modules` 目录打包进压缩包。
- 直接分发该 **.llplugin** 文件；安装插件时，将其放入 plugins 目录即可。
- 开服时，脚本引擎会自动识别 **.llplugin** 文件，将其解压到 `plugins/插件名` 目录，并在该目录下自动执行 `npm install --omit=dev` 安装依赖包，全程无需人工干预。

## Python 语言支持说明

- 使用 CPython 引擎（Python 版本为 3.12.10），支持通过 pip 为插件安装第三方依赖包，支持多文件插件开发、import 以及现代项目管理机制。
- 在 BDS 控制台中执行 `pydebug` 命令即可进入或退出 Python 交互式命令行环境，方便在开发插件时进行简单测试。

#### **Python 单文件插件开发方法**

- 为方便不熟悉 Python 的开发者快速上手，我们提供了简单的单文件插件支持。
- 单文件插件的用法与 QuickJS 和 Lua 插件类似：只需编写单个 .py 文件并直接放入 plugins 目录，开服时即可自动加载运行。
- 单文件插件的局限性：不支持保存插件元数据、不支持多文件拆分、不支持安装 pip 第三方包。该方式仅适合用来熟悉 LSE 的 Python 环境，或开发非常简单的插件。

#### ⭐ **Python 多文件插件开发方法**

- 开发大型、正式的 Python 插件时，强烈建议采用此方法。多文件插件支持全部 Python 特性。
- LSE 使用 `pyproject.toml` 项目文件存储元数据（类似于 Node.js 的 `package.json`）。推荐使用支持现代项目特性的 PDM 包管理器（[pdm-project/pdm](https://github.com/pdm-project/pdm)）自动生成该文件，以便创建和维护插件项目。

##### **下面是具体的插件开发流程：**

1. 安装 Python 3.12.10。

2. 在终端中执行 `pip install --user pdm` 命令，安装 pdm 包管理工具。

3. 新建插件开发目录，在该目录下打开终端并执行 `pdm init` 命令，按照 pdm 的提示填写项目信息以创建新项目。

    - 如需安装依赖包，在项目目录下执行 `pdm add <依赖包名>` 即可。

    - 所有项目元数据和依赖信息都会自动保存在 `pyproject.toml` 中，无需手动编写。你也可以直接编辑此文件来修改版本号、描述等元数据。

    - 除了使用 `pdm add` 命令，也可以手动将项目依赖写入 `requirements.txt`。安装插件时，脚本引擎会一并读取并自动安装 `pyproject.toml` 和 `requirements.txt` 中列出的依赖。

4. 创建 `__init__.py` 文件并在其中编写插件代码。加载插件时，Python 解释器会首先读取并执行该文件。

5. 如有需要，可以将源码拆分为多个文件，并通过 import 引入。合理拆分源码有助于保持项目结构清晰，便于后续维护与扩展。

#### ⭐ **Python 多文件插件打包 & 部署方法**

- 插件编写完成后，将 `pyproject.toml`、所有插件源码以及 `manifest.json` 放入以插件名命名的目录中。在 `manifest.json` 中，将 `type` 设为 `lse-python`，`entry` 设为 `__init__.py`，`name` 设为与目录名相同（具体格式参见[你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)）。
- 请勿将 `__pycache__`、`__pypackages__` 和 `site-packages` 等目录放入其中。
- 直接分发该目录（例如打包为 zip 压缩包）；安装插件时，将该目录放入 plugins 目录即可。
- 加载插件时，如果插件目录下尚无 `site-packages` 目录，脚本引擎会自动执行 `pip install`，将 `pyproject.toml` 和 `requirements.txt` 中列出的依赖包安装到 `site-packages`，全程无需人工干预。

#### **Python插件开发的已知问题**

平心而论，CPython 的代码质量和维护状况不尽如人意。以下是开发 Python 插件时的注意事项，其中不少问题源于 CPython 自身的 Bug：

1. 暂勿使用 `threading`、`asyncio` 等特性
    - LSE 以 CPython 的子解释器作为引擎调度的核心单元，但 CPython 长期以来对子解释器机制的支持并不完善，存在大量 Bug。目前，上述特性所依赖的 GIL API 内部并未考虑子解释器的存在，一旦使用就会引发死锁或崩溃。
    - 如有并行计算需求，可暂时使用 `multiprocess` 实现多进程并行。
2. 所有 Python 引擎的 `sys.stdin` 均被禁用
    - 这源于 CPython 的另一个 Bug，详见：https://github.com/python/cpython/issues/83526
    - 此外，即便不是在上述情况下加载的 CPython 引擎，也会出现抢占 stdin 的问题，导致部分依赖输入重定向机制的工具失效。
    - 因此，我们通过补丁禁用了所有 Python 引擎的 `sys.stdin`，待后续版本的 CPython 彻底修复这一系列 Bug 后，再视情况恢复。
