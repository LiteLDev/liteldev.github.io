# LegacyScriptEngine API: engines, modules and timers

## Do LSE (LegacyScriptEngine) script plugins still need to call `ll.registerPlugin`? I cannot find it in the docs. Where do I set the plugin name, version and so on? Where is the complete API definition?

No. An LSE plugin's metadata (`name`, `version`, `author`, `description`, `entry`, `type`, and so on) goes in the `manifest.json` file in the plugin directory and is registered automatically on load. `ll.registerPlugin` is deprecated, has been removed from the LSE docs, and is kept only for compatibility with old LLSE plugins. It only type-checks its arguments and writes them back to the plugin's `manifest.json` if the passed version differs from the manifest's version. Passing the wrong argument type throws an exception. If uncaught, this stops the rest of the plugin's code from running, and exceptions thrown during plugin load may not print any error to the console (see the still-open <https://github.com/LiteLDev/LegacyScriptEngine/issues/240>). You should therefore delete the call.

The complete API type definitions (including classes such as `File`) are at <https://github.com/LiteLDev/legacy-script-engine-api>.

*Applies to: LSE, all current versions (on LeviLamina)*

## `console.log` / `console.error` throws an error in an LSE JS plugin (QuickJS engine). What should I use to output logs?

The QuickJS engine environment has no `console` object; only plugins running on the Node.js engine can use `console.log`. In QuickJS plugins, use LSE's `log()` or the `logger` API (such as `logger.info` / `logger.warn` / `logger.error`). For documentation, see the ScriptAPI → Logger page at <https://levimc.org/LegacyScriptEngine/>.

*Applies to: all current versions of the LSE QuickJS engine*

## When writing LSE JS/TS/Node.js plugins, which module do I import `mc`, `logger`, `PermType`, `ParamType`, `Player` and so on from? How do I bring in the type definitions, and can the Player class be accessed or inherited at runtime?

You do not need to import anything. LSE injects `mc`, `logger`, `ll`, `PermType`, `ParamType`, and other APIs into the global scope (including in Node.js plugins), so you can use them directly. To call functions exported by other plugins, use `ll.imports` (remote calls). Type definitions are also declared globally; the official type library is at <https://github.com/LiteLDev/legacy-script-engine-api> (covering JS/TS and Python).

Class names shown in the docs, such as `Player`, do not exist at runtime. The classes actually registered by the engine carry an `LLSE_` prefix (such as `LLSE_Player`), so accessing `Player` directly returns `undefined`. These classes also lack a usable constructor and cannot be inherited. The API docs are at <https://levimc.org/LegacyScriptEngine/apis/>.

*Applies to: current LSE version*

## Why does using `time.sleep` or a `while True` loop in an LSE Python/JS plugin for a countdown or delayed repeated commands freeze the server, and how should I write it?

Script plugins run on the BDS main thread, so calling `time.sleep` or running an infinite loop in a callback blocks the entire server. For periodic tasks, use LSE's cross-language timers `setTimeout` / `setInterval` (which are also available in Python) and call `clearInterval` when done. To show a title, call `pl.setTitle` directly instead of running the `title` command. JS example:

```js
let delay = 5000;
let task = setInterval(() => {
  player.setTitle(`${delay / 1000}`, 4, 1, 2, 1);
  if (delay <= 0) {
    player.setTitle('新年快乐', 4, 0, 1, 0);
    clearInterval(task);
  }
  delay -= 1000;
}, 1000);
```

*Applies to: all current LSE versions*

## Can an LSE plugin use Script API (addon, `@minecraft/server`) idioms such as `serverApi`, `world.getDimension()`, `origin.teleport()` and `server.on`?

No. LSE plugins and the official Minecraft Script API (SAPI, `@minecraft/server`) are two completely different APIs that cannot be mixed, so do not copy AI-generated SAPI code as is. LSE has no objects such as `serverApi` / `playerApi` / `worldApi` / `world.getDimension`: to listen for events, use `mc.listen(eventName, callback)`; to output logs, use `logger.log`; to teleport a player, call `pl.teleport(...)` on the Player object or run the `tp` command with `mc.runcmd`. Write your code against the LSE API reference at <https://levimc.org/LegacyScriptEngine/>, and use `legacy-script-engine-api` for editor type hints.

*Applies to: all current LSE versions*

## When adding type annotations to event callback parameters in an LSE Python plugin, `player: Player` does not work (reported as undefined). How should I write it?

The class names LSE registers with the script engine carry an `LLSE_` prefix. In the Python environment, the player class is named `LLSE_Player` and there is no `Player` class, so write the annotation as `player: LLSE_Player` (the same applies to other classes, such as `LLSE_Item` and `LLSE_Block`). For IDE autocompletion, use the type hints in `platforms/python` of the `LiteLDev/legacy-script-engine-api` repository.

*Applies to: LegacyScriptEngine Python backend (legacy-script-engine-python), current version*

## In LSE (script plugins), is the second parameter of `setTimeout` in ticks or milliseconds? How do I write it?

The second parameter is in milliseconds. Usage: `setTimeout(func, msec)`, where `func` can be an anonymous function, an arrow function, or a reference to an existing function. It returns a task ID that you can cancel with `clearInterval`. Passing a code string with `setTimeout(code, msec)` is also supported. For periodic execution, use `setInterval(func, msec)`.

Note that `setTimeout` only delays execution. The callback still runs on the server main thread, so it does not make time-consuming logic asynchronous.

## In an LSE JS (QuickJS) plugin, `import` of a submodule from the entry file works, but when that submodule `import`s another file (a nested `import`) it fails. How should I write the path?

When the LSE QuickJS module loader loads the entry module specified in `manifest.json`, it sets the base path to the current working directory (the server executable's directory), not the script's directory. In the entry file, write paths relative to the server root and include the `.js` extension (`./plugins/<your-plugin>/xxx.js`), for example: `import { initCommand } from "./plugins/your_plugin/command/command.js"`.

This applies only to the entry module. `import` statements between submodules follow standard ES module resolution, relative to the importing module's own location. Inside a submodule, write paths relative to that submodule rather than starting from `./plugins` again.

*Applies to: LSE QuickJS engine 0.23.x*

## In LSE, how do I exit JS debug mode after entering it with `jsdebug`? And how do I get a player's IP?

Run `jsdebug` again to exit debug mode (`luadebug` for Lua, `pydebug` for Python; Node.js has no debug mode). Whether the command can be used in game is controlled by `debugCommandLevel` in the LSE configuration file `config.json`, which defaults to GameDirectors (OP).

To get a player's IP, use `pl.getDevice().ip` (returns IP:port) or `pl.ip` (returns the address without the port).

## In LSE, after destructuring a player object (`const {name, xuid, getExtraData} = player`), calling `getExtraData` fails with `不可以将值转换为对象` ("cannot convert the value to an object"). Why?

On objects provided by the LSE engine, properties (such as `name` and `xuid`) can be destructured, but methods are native `instanceFunction`s bound to the instance. Calling a destructured method on its own loses `this` (it no longer points to the Player instance), which causes the error. Call it as `player.getExtraData(...)` or `getExtraData.call(player, ...)`.

*Applies to: all current LSE versions*

## In LSE, should I use `ll.import` or `ll.imports` to import a function exported by another plugin? The documentation says `ll.imports`, but the call fails.

The official API is `ll.imports(namespace, name)` (which returns a callable function), paired with `ll.exports` on the exporting side. LSE defines `ll.import = ll.imports` in the JS and Lua baselib as a compatibility alias, so the two are equivalent (in Python, `import` is a keyword, so only `ll.imports` works).

If the call fails, it is usually because the target plugin has not loaded yet or has not exported the function, or because `namespace` or `name` is wrong—not because of the function name you used. You can check with `ll.hasExported(namespace, name)`.

*Applies to: all current LSE versions*

## Can an LSE plugin get / intercept all the output of the BDS console?

No. LSE's former console output event has been removed, and `system.cmd` returns only the output of the system command it runs, not the BDS console log. Capturing console output requires a native (C++) mod that hooks the output function.

## How does an LSE Lua plugin write logs? Is it the same as in JS?

Yes. All LSE languages share the same API, so in Lua you can use the global functions `log(...)` and `colorLog(...)` as well as the `logger` object (`logger.info`, `logger.warn`, `logger.error`, `logger.debug`, `logger.log`, and so on) the same way as in JS. See <https://levimc.org/LegacyScriptEngine/> (the logging API is on the `apis/ScriptAPI/Logger` page).

## In an LSE script plugin, `setTimeout` cannot pass arguments to the callback. How do I run a delayed function with arguments?

LSE's `setTimeout(func|code, ms)` accepts only a callback (a function or a code string) and a delay; it does not forward extra arguments to the callback. Wrap the call in a closure: `setTimeout(() => fn(arg1, arg2), ms)`. Alternatively, write a wrapper function that returns a parameterless function that calls the target function with its arguments.

*Applies to: current version (LSE's built-in `setTimeout` on engines such as QuickJS)*

## Can I use `instanceof` in an LSE JS plugin to check whether a parameter is an `IntPos`?

Yes, `obj instanceof IntPos` works. Objects that the LSE documentation refers to as "classes" can generally be checked this way, though the registered class name does not always match the name in the documentation.

## Importing a function exported by another plugin with `ll.imports` in an LSE plugin fails with `Fail to import! Function [...] has not been exported!`. How do I fix it?

This usually happens because the call is made too early, before the other plugin has run `ll.exports` to export the interface (or because the namespace or function name is wrong). Import or call the function after the server has finished starting (for example, inside a `mc.listen("onServerStarted", ...)` callback), or first check whether it has been exported with `ll.hasExported(namespace, name)`.

## In an LSE Python plugin, writing a file with `open('a.txt','a')` raises no error, but the file is not in the plugin directory. Where did it go?

LSE does not change the script's working directory to the plugin directory. Relative paths are resolved against the BDS root directory (the process working directory), so `a.txt` is created in the BDS root. To write to the plugin directory, use a path such as `plugins/<plugin name>/a.txt`. You can build the path and ensure the directory exists with the `os` module (`os.path.join`, `os.makedirs(..., exist_ok=True)`). Also note that the mode argument of `open()` must be a string (`'a'`, not `a`).

*Applies to: LSE Python backend (legacy-script-engine-python), current version*

## When an LSE plugin writes to the server console with `logger`, how do I make the text colored? `§` color codes have no effect in the console.

`§` format codes only work for in-game text, and LSE's `logger` does not convert them to console colors. For console output, include ANSI escape sequences in the string: for example, foreground colors `\x1b[30m` ~ `\x1b[37m` (black/red/green/yellow/blue/magenta/cyan/white), background colors `\x1b[40m` ~ `\x1b[47m`, `\x1b[0m` to reset the style, `\x1b[1m` for bold, `\x1b[4m` for underline, and so on. Example:

```js
logger.info("\x1b[33m黄色文字\x1b[0m")
```

The octal escape `\033` is not allowed in JS strict mode, so use `\x1b` or `\u001b` instead.

## How do I quickly print the names and versions of all loaded LSE plugins in the server console (for troubleshooting)?

Run this in the console (requires the QuickJS engine legacy-script-engine-quickjs):

```text
jsdebug ll.getAllPluginInfo().forEach(info => logger.warn(`${info.name}: ${info.versionStr}`))
```

Note that `ll.getAllPluginInfo()` returns all mods loaded by LeviLamina (including native C++ mods); each item has fields such as `name`, `versionStr`, and `type`.

*Applies to: current version (the QuickJS backend provides `jsdebug`; the Node.js backend does not support debug commands)*

## How do I start writing an LSE Node.js plugin? How does it differ from a QuickJS plugin?

Node.js plugins and QuickJS plugins use the same LSE API. The difference is that Node.js plugins can pull in third-party libraries through npm (set `"type": "module"` in `package.json` to use ES modules). You need to install LSE's nodejs engine (the lip variant `LegacyScriptEngine#nodejs`).

Development: install Node.js, create a directory, run `npm init` to generate `package.json`, and write your code in the entry file.

Deployment: pack `package.json` and the source files (without `node_modules`) into a zip archive, rename the extension to `.llplugin`, and place it in the `mods` directory. When the server starts, LSE automatically unpacks it to `mods/<plugin name>`, generates `manifest.json`, and runs `npm install` to install the dependencies.

For type hints, use <https://github.com/LiteLDev/legacy-script-engine-api>, which provides type definitions for JS/TS and Python. The Node.js backend has no console debug commands such as `jsdebug`.

*Applies to: current version (LeviLamina, nodejs engine)*

## How do I split a JS plugin into multiple files (modules) when developing with LegacyScriptEngine?

Use the LSE Node.js engine (the variant installed with `lip install LegacyScriptEngine#nodejs`). You can organize multiple files the Node.js way and load them with `require` (CJS), or set `"type": "module"` in `package.json` to load them as ES modules (ESM). The QuickJS engine also supports multi-file ES modules natively, with one caveat: relative `import` paths in the entry module specified in `manifest.json` are resolved against the server working directory (the directory containing BDS), so write them as `"./plugins/your-plugin/xxx.js"`. Relative `import` paths between modules other than the entry behave as standard. See "Language Support" in the LSE documentation.

*Applies to: LSE current version*

## An LSE JS plugin uses a top-level `return` to stop execution; the editor shows no error but loading fails with `return not in a function`. How do I exit early?

When the LSE QuickJS engine loads a plugin entry file, it first tries to load it as an ES module (`loadFile`, `JS_EVAL_TYPE_MODULE`) and, if that fails, evaluates it as a global script. In both modes, the top level is not a function body and `return` is not allowed, which causes `return not in a function`. Wrap your logic in a function (or an IIFE) and `return` from inside it to exit early.

*Applies to: LSE QuickJS engine, all current versions*
