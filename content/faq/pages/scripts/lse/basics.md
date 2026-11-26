# LegacyScriptEngine: general questions

## What is the purpose of this project?

This project allows you to run LLSE plugins on LeviLamina.

## When several LSE plugins listen to the same event (such as `onChat` or `onLeft`) and one plugin intercepts it with `return false`, do the other plugins still receive the event? What is the execution order? Does LSE have event priorities?

Yes, they still receive it. Current versions of LSE call all listeners for an event in registration order (generally the plugin load order). Returning `false` from a listener only marks the event as intercepted so that BDS (the LeviLamina event) does not process it further. For example, an intercepted chat message is hidden from everyone, but listeners in other LSE plugins still receive the event.

`mc.listen` in LSE has no priority parameter. To control the execution order, declare a dependency with `dependencies` in the plugin's `manifest.json`: the depended-on plugin loads first, so its listeners are registered and run first. If you need true event priorities (for example, a mute plugin that must intercept `TextPacket` or the chat event before other plugins), write a C++ mod and register the listener on LeviLamina's EventBus with a higher `EventPriority`. This has been the event dispatch behavior since after 0.4.12.

*Applies to: LSE current version*

## Are LSE `setTimeout` / `setInterval` timings affected by the server TPS / tick rate? How do I make scheduled tasks unaffected?

Yes. LSE `setTimeout` and `setInterval` run on the server main thread and convert the delay into game ticks for scheduling. When the tick rate changes or TPS drops, the actual trigger time shifts with it. Checking every tick in `onTick` (such as a home-made cron) occupies the main thread and hurts TPS. Instead, compute the time until the next trigger and schedule it with `setTimeout`, and move time-consuming work (such as world compression) to another thread or an external process.

In a native C++ mod, if you do not need to stay in sync with ticks, you can use `ll::coro` coroutines with a non-tick executor such as `ll::thread::ThreadPoolExecutor` to wait by system time, then switch back to `ll::thread::ServerThreadExecutor` when you need to operate on game objects.

*Applies to: LegacyScriptEngine all current versions; LeviLamina current version (C++ part)*

## Can a LeviLamina server run / can I write Python (and Node.js) plugins? Do the old LLSE Python plugins still work?

Yes. LegacyScriptEngine provides both Python and Node.js engines (early LSE versions briefly lacked support for them, which is no longer an issue). Install the matching variant with lip: `lip install LegacyScriptEngine#python` (or `#nodejs`, `#lua`, or `#quickjs`; without a variant, lip installs the QuickJS and Lua engines by default). Put LLSE-era Python plugins directly into `plugins/` (since 0.23.0, this directory is a link to `mods/` created at startup). When the server starts, it migrates them automatically by generating a `manifest.json`, and they load after you restart the server. Keep in mind that the Python plugin ecosystem is small.

As another option, you can write Endstone Python plugins and use LeviStone (EndstoneRuntime) to run them on LeviLamina.

*Applies to: LegacyScriptEngine 0.23.x*

## How do I show server data (such as a leaderboard) on a web page in real time?

Use a plugin to read the data and expose it to the web page over the network.

- Start an HTTP server using LSE's built-in HttpServer (also available in QuickJS and Lua) or the `http` module in the Node.js engine, and have the page poll it with JS.
- Push updates over WebSocket for real-time refreshing.
- Use an HTTP library in a C++ mod.

*Applies to: LSE current version*

## Do LL3 (LeviLamina + LSE) script plugins have a built-in database? Do I need to deploy something like MongoDB myself?

Yes. LegacyScriptEngine provides built-in database APIs: a LevelDB-based key-value database (`new KVDatabase(dir)`) and SQL database sessions via `new DBSession(type, params)`, where `type` supports `"sqlite3"` and `"mysql"`. You generally do not need to deploy MongoDB; just pick whichever option fits your needs (note that MySQL requires your own MySQL service).

*Applies to: LegacyScriptEngine current version*

## Can an LSE script plugin modify event data in an event listener, for example change 5 points of damage from a player attack to 10?

Not directly. In LSE, `mc.listen` event callbacks can only read the arguments or return `false` to cancel a cancellable event. They cannot modify data in the event (such as the `damage` value in `onMobHurt`). If you need to modify event data, write a LeviLamina mod in C++.

As a workaround in scripts, you can intercept the original event and re-apply the effect yourself through the relevant API (for example, cancel the original damage and call `hurt` on the entity to deal the new damage), though this is not the same as modifying the event itself.

*Applies to: LegacyScriptEngine all current versions (up to v0.23.1)*

## Does LegacyScriptEngine have a `nodejsdebug` command?

There is no usable `nodejsdebug` command. The source defines the name `nodejsdebug` for the Node.js backend, but the Node.js engine does not support a debug engine and never registers the command. The available debug commands are `jsdebug` for QuickJS, `luadebug` for Lua, and `pydebug` for Python (console only).

*Applies to: LSE current version (v0.23.1)*

## Why can't I find a LeviLamina C++ event for some of the events LSE provides, and how can a C++ plugin listen for the same things?

LeviLamina keeps only a small set of core events; most events from the LL2 era were not carried over. To stay compatible with LLSE plugins, LSE supplies these events itself: some come from the iListenAttentively event library (an LSE dependency), and others are implemented with hooks inside LSE. As a result, LSE events do not map one-to-one to LeviLamina events.

To listen for the same events from a C++ mod, depend on iListenAttentively (`lip install github.com/LiteLDev/iListenAttentively`) and use its events, or write your own hooks.

*Applies to: LeviLamina 1.x or later / current LSE*

## In LegacyScriptEngine, can global variables or a Map defined in one JS plugin interfere with other script plugins on the server?

No. LSE creates a separate script engine instance for each script plugin, giving each plugin its own isolated global scope. To share data or call functions between plugins, use mechanisms such as remote calls via `ll.exports` / `ll.imports` (provided by LegacyRemoteCall).

## How do I add support for a new scripting language (such as PHP) to LSE?

LSE's language support comes from ScriptX underneath. Adding a new language requires adding a backend for it to ScriptX first, and then adding a matching engine variant to LSE; you cannot add a language in LSE alone. LSE currently provides four engines: `lua`, `quickjs`, `nodejs`, and `python`.

## I am a beginner and want to write a plugin loaded by LeviLamina. Where do I start? Do I need to download the LeviLamina source?

You do not need to modify the LeviLamina source. Beginners should start with a LegacyScriptEngine (LSE) script plugin:

- Project: <https://github.com/LiteLDev/LegacyScriptEngine>
- Documentation: <https://levimc.org/LegacyScriptEngine/>
- Getting-started tutorial, "Write your first script plugin": <https://levimc.org/tutorials/develop/first-script-plugin/>

Before writing code, set up the API type hints: run `npm install -D @levimc-lse/types` in your project and add `"@levimc-lse/types"` to `compilerOptions.types` in `tsconfig.json` (or add `/// <reference types="@levimc-lse/types" />` to the entry file). This also prevents absolute-path conflicts when collaborating with others.

To write a native mod, you need to learn C++ and set up a VS/xmake environment (see the LeviLamina documentation and levilamina-mod-template).

## The new LSE creates a `plugins` shortcut (directory link) every time the server starts, and recreates it after I delete it. What is it? What if it turns into an ordinary folder or a broken link after I copy the server to another machine?

This is expected behavior. Because most LSE plugins hard-code the `plugins` path, LSE 0.23.0 and later create a directory link (a junction on Windows) pointing to `mods/` at server start for compatibility.

Because the directory link uses an absolute path, copying the server folder to another machine breaks it. Delete the broken link and let LSE regenerate it automatically. Note that if an ordinary file or folder named `plugins` already exists and does not point to `mods`, LSE reports an error instead of overwriting it.

*Applies to: LSE 0.23.0 or later (LeviLamina 26.60)*

## Do I have to install Node.js / the `nodejs` engine to write JS plugins with LSE?

No. Standard JS plugins run on the QuickJS engine (`lip install github.com/LiteLDev/LegacyScriptEngine#quickjs`; if you omit the variant, both the QuickJS and Lua engines are installed by default). A standalone `.js` file is recognized as a quickjs plugin, and after migration its `type` in `manifest.json` is `lse-quickjs`.

You only need the `#nodejs` engine if your plugin uses the Node.js API or npm packages, in which case the manifest `type` is `lse-nodejs`.

*Applies to: LSE current version (0.23.x)*

## When writing an LSE (LLSE) JS plugin, the comment at the top of the file that references type definitions (`/// <reference ...>`) shows a red squiggle in the editor. Do I need to fix it? Does it affect the plugin?

It does not affect execution. That triple-slash comment only provides type information and code completion to your editor; the red squiggle simply means the editor cannot find the referenced type definitions.

To enable code completion, install `@levimc-lse/types` as described in legacy-script-engine-api, then add `/// <reference types="@levimc-lse/types" />` to the entry file or add it to `compilerOptions.types` in `tsconfig.json`. If you do not need code completion, you can ignore the warning.

If the plugin throws runtime errors in the console, this comment is not the cause. Look for other issues, such as a malformed JSON configuration file or a missing or corrupted prerequisite plugin (which you can fix by reinstalling it).

## Can I hook game functions from a script plugin with LSE (such as NativeCall/NativeAPI)?

No, and it is not recommended. LSE's NativeAPI was removed completely in 0.8.19, so script plugins cannot hook game functions. If you need hooks, write a LeviLamina mod directly in C++ (you can start from levilamina-mod-template).

*Applies to: LSE 0.8.19 or later (current 0.23.x)*

## Developing native LeviLamina mods in C++ has too high a barrier. Is there an easier way to develop?

Yes. With LegacyScriptEngine (LSE), you can write plugins in JavaScript (QuickJS/Node.js), Lua, or Python. They are relatively easy to develop and run on both servers and the Windows client.

- Documentation: <https://levimc.org/LegacyScriptEngine/>
- Getting-started tutorial: <https://levimc.org/tutorials/develop/first-script-plugin/>
- Type hints and scaffolding: <https://github.com/LiteLDev/legacy-script-engine-api>

## After `ll reload`, an LSE plugin's commands stop working or keep raising errors (such as command registration failures). What should I do?

Fake commands—registered through the old interfaces such as `mc.regPlayerCmd` and `mc.regConsoleCmd`—are registered only once, when the server finishes starting (`onServerStarted`). Calling these interfaces again after a plugin reload does not re-register them, so the commands stop working. The documentation no longer recommends fake commands; use real commands with `mc.newCommand` instead. On reload, if the command already exists, LSE only logs `Runtime command ... already exists`, reapplies `setOverload` and `setCallback`, and the command keeps working. Hot-loading and hot-unloading are meant for debugging and carry risks and performance issues; in production, restarting the server is more reliable when problems occur.

*Applies to: LeviLamina current version; LegacyScriptEngine current version*

## Does LSE have documentation in Markdown format (for example, to feed to an AI)?

Yes. The LSE documentation site is built from Markdown sources in the `content/LegacyScriptEngine/pages` directory of the LiteLDev/liteldev.github.io GitHub repository (Chinese files end in `*.zh.md`, English files end in `*.md`, and the API documentation is under `apis/`). The LiteLDev/legacy-script-engine-api repository also provides API type hints for plugin development and can serve as a reference.

## Is it a problem to set a very large value such as `99999999999` as the time for `setTimeout`/`setInterval` in an LSE JS plugin?

Yes. LSE converts the timer duration to a 32-bit signed integer (`toInt32`). Any value above `2147483647` overflows, and if the result is ≤0, LSE treats it as 1 millisecond and runs the callback immediately. Unless you know the exact behavior to expect, keep integer arguments passed to LSE APIs below `2147483648` (2^31).

*Applies to: LegacyScriptEngine current version*
