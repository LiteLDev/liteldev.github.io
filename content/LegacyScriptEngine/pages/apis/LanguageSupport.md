# 📋 Language Support

## 🌏 Current Status

Backed by the [ScriptX](https://github.com/Tencent/ScriptX) project, LSE supports multiple development languages from a single codebase.    
It also provides a consistent API across languages, so they can share the same development documentation, which greatly simplifies maintenance.

LSE currently supports writing plugins in the following languages:

| Language backend | Remarks                                                                        |
|------------------|--------------------------------------------------------------------------------|
| `JavaScript`     | Uses the QuickJS engine and supports ES Modules                                |
| `Lua`            | Uses the CLua engine                                                           |
| `Node.js`        | Modifies Node.js for embedding and supports npm package management             |
| `Python`         | Uses the CPython engine and supports pip package management                    |

!!! tip
    To write plugins in native languages such as C++, Go, or Rust, see [Home](https://levimc.org/LeviLamina/) for documentation on other languages.

## JavaScript language support description

- Supports simple JavaScript plugins through QuickJS, a lightweight engine with a low resource footprint.
- The current version of QuickJS supports up to ES2020 and natively supports ES Modules, making project management easier.
- Package management is not supported. If you need it, develop your plugin with Node.js and use npm for package management.
- Run the `jsdebug` command in the BDS console to enter and exit the interactive QuickJS command line for quick testing while writing plugins.

### QuickJS ESModule Path Resolution Behavior

The **ScriptX** used by LegacyScriptEngine is forked from the upstream **Tencent/ScriptX** project, with additional features such as Python backend support.

In the QuickJS backend, ScriptX uses the default `module loader` from **quickjs-libc.h**.
Because of this loader, QuickJS ESModule resolves the **entry module** differently from the standard ESModule specification.

Specifically, when loading the **entry module**, the loader sets the module's base path to the **current working directory (CWD)**—typically the directory containing the server executable—rather than the directory containing the script file.

As a result, relative `import` paths in the entry file are not resolved according to standard ESModule behavior.

Assume the following plugin directory structure:

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

Entry file **index.js**:
```js
import { initCommand } from "./command/command.js"

initCommand();
```

In this case, QuickJS resolves the entry module's import.meta.url as:

```
file:///c:/bds
```

instead of:

```
file:///c:/bds/plugins/your_plugin
```

Consequently, `./command/command.js` cannot be resolved, and the plugin fails to load.

For example, QuickJS may produce an error like the following (original log output):
```
19:26:12.343 ERROR [LeviLamina] Failed to load plugin your_plugin: Unexpected token '{'      
19:26:12.343 ERROR [LeviLamina]     at ./plugins/your_plugin\index.js:1:1
```

To fix this issue, use a path **relative to the current working directory (CWD)**:

```js
import { initCommand } from "./plugins/your_plugin/command/command.js"
```

This allows the module to load properly.

!!! tip
    This issue **only affects the entry module specified in manifest.json**.
    Once the entry module is loaded, resolution between other modules follows standard ESModule behavior.

## Lua language support description

- Uses the CLua engine and supports require.
- Because the Rocks package manager requires a compiler, it is not currently supported. If you need extension dependencies (such as SQLite), you can compile them manually and include them in your project.
- Run the `luadebug` command in the BDS console to enter and exit the interactive Lua command line for quick testing while writing plugins.

## Node.js support description

- LSE implements its own Node.js bootstrap code to run Node.js in embedded mode and isolates the execution environment for each plugin.
- Provides programmatic support for npm, allowing you to install third-party dependencies via package.json.
- Supports ES Modules: set `"type": "module"` in `package.json` to load the plugin as an ES module.
- The Node.js engine has no debug mode: unlike `jsdebug`, `luadebug`, and `pydebug`, it does not provide an interactive command line in the BDS console.

#### ⭐ **Node.js Plugin Development**

1. Install Node.js.
2. Create a new directory for your plugin. Open a terminal in this directory, run `npm init`, and follow the prompts to initialize the project.
3. Write your plugin code in the entry point file you specified.
4. If needed, split your code across multiple source files and import them with require. Organizing your code into separate files keeps the project structure clear and makes the plugin easier to maintain and extend.

#### ⭐ **Node.js Plugin Packaging & Deployment**

- After the plugin is finish, package `package.json` and all the plugin source code into a zip archive and **change the
  file name suffix to .llplugin**
- The `node_modules` directory should not be packed in the archive
- Distribute the **.llplugin** file as a plugin. When installing the plugin, just place this file directly into the
  plugins directory
- LSE will automatically recognize the **.llplugin** file when BDS launch, extract it to the
  `plugins/<PluginName>` directory, and automatically execute `npm install --omit=dev` in the directory to install the
  dependency packages. No manual intervention is needed for the whole process

## Python language support description

- Use CPython engine, Python version 3.12.10. Support for installing third-party extension dependencies for plugins using
  pip package management. Support for multi-file plugin development and import. Support for modern project management.
- Use `pydebug` command in the BDS console to enter and exit the Python interactive command line environment. This
  feature facilitates some simple testing when writing plugins

#### **Python Single-File Plugin Development **

- To help developers unfamiliar with Python to get started quickly, we provide a way to write and load single-file
  Python plugin.
- Single file plugins are similar to QuickJS and Lua plugins: Just write a single .py file as a plugin, place the plugin
  directly into the plugins directory, and it will be loaded and run when BDS is started.
- It has many disadvantages: does not support plugin metadata storage, does not support source code in multiple files,
  does not support pip third-party packages. Only for developers familiar with LSE's Python environment, or to develop
  very simple plugins to use.

#### ⭐ **Python Multi-File Plugin Development**

- For formal Python plugins, this method is highly recommended. Multi-file plugins support all full Python features.
- LSE uses the `pyproject.toml` project file for metadata storage (similar to `package.json` in Node.js). This project
  file is recommended to be automatically generated using PDM package
  manager ([pdm-project/pdm](https://github.com/pdm-project/pdm)), which supports modern project features to facilitate
  plugin project creation and maintenance.

##### **The tutorial for Python plugins development: **

1. First, install Python 3.12.10
2. Run `pip install --user pdm` in terminal to install the pdm package management tool
3. Create a new directory for plugin development. Launch the terminal in this directory and execute `pdm init`. Follow
   the prompts of the pdm tool to create a new project and fill in the information about the project.
    - If you need to install dependency packages, execute `pdm add <dependency package name>` in the project directory
    - All project metadata and dependency data will be automatically stored in `pyproject.toml`. No need to write it
      manually. You can also open this file to change metadata information such as version number, description, etc.
    - In addition to using the `pdm add` command, you can also manually write the project dependencies directly to
      `requirements.txt`. When installing the plugin, the dependencies described in `pyproject.toml` and
      `requirements.txt` will be processed and installed automatically.

4. Next, create the `__init__.py` file and write the plugin code in it. When loading the plugin, the Python interpreter
   will read and execute this file.
5. If necessary, you can create multiple source files and use import to include them. Properly splitting the source code
   into files helps improve the clarity of the project structure and facilitates further maintenance and extension of
   the plugin.

#### ⭐ **Python Plugin Packaging & Deployment**

- After the plugin is finished, put `pyproject.toml`, all plugin source code and a `manifest.json` in a directory named
  after the plugin. In `manifest.json`, set `type` to `lse-python`, `entry` to `__init__.py` and `name` to the name of
  the directory (see [Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/) for the
  format)
- Do not include the `__pycache__`, `__pypackages__` and `site-packages` directories
- Distribute this directory as a plugin (for example in a zip archive). When installing the plugin, place the directory
  into the `plugins` directory.
- When the plugin is loaded and has no `site-packages` directory yet, the scripting engine automatically executes
  `pip install` to install the dependencies listed in `pyproject.toml` and `requirements.txt` into `site-packages`. No
  manual intervention is needed for the whole process.

#### **Known issues with Python plugin development**

To be fair, the quality and maintenance of CPython's code are in a somewhat worrisome state. Keep the following issues in mind when developing Python plugins, many of which are caused by bugs in CPython itself:

1. Do not use `threading`, `asyncio`, and other features for the time being
    - LSE uses CPython's sub-interpreter as the core unit of engine scheduling, but CPython itself has long had poor support for sub-interpreters, resulting in many hard-to-explain bugs. The GIL API currently used for these mechanisms does not account for sub-interpreters, so using them will cause deadlocks and crashes.
    - Developers who need parallel computing can temporarily use `multiprocess` to run multiple processes in parallel.
2. `sys.stdin` is disabled for all Python engines
    - This is another CPython bug; see https://github.com/python/cpython/issues/83526 for details.
    - In addition, even if the CPython engine is not loaded in the scenario above, it still grabs stdin, causing some tools that use input redirection to fail.
    - Therefore, we applied a patch to disable `sys.stdin` for all Python engines. We will not restore it until future versions of CPython completely resolve this series of bugs.
