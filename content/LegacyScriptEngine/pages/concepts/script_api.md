# How the API works

LSE provides the same API across every language: the [reference](../apis/README.md) describes it once, and each engine maps it to its language. This page explains how it is structured: what a script finds in its global scope, what the objects it receives are, and when the engine calls the functions it passes.

## What a script starts with

LSE binds the API into every plugin's global scope before running the entry script. You do not need to import or `require` it.

Global functions:

- `log`, `colorLog`, and `fastLog` write to the server console; `setTimeout`, `setInterval`, and `clearInterval` run
  code later (see [Script helper API](../apis/ScriptAPI/ScriptHelp.md)). The Node.js engine uses Node.js's built-in
  `setTimeout` and `setInterval` instead.

Namespaces (objects with static functions):

| Name | What it is about | Reference |
|---|---|---|
| `mc` | The game: events (`mc.listen`), commands, players, entities, blocks, items, forms, the scoreboard | [GameAPI](../apis/GameAPI/Basic.md), [EventAPI](../apis/EventAPI/Listen.md), [GuiAPI](../apis/GuiAPI/FormBuilder.md) |
| `ll` | The loader and plugins: versions, plugin information, `ll.exports` / `ll.imports`, `ll.onUnload` | [ll](../apis/ScriptAPI/Ll.md) |
| `logger` | A configurable logger for the plugin | [Logger](../apis/ScriptAPI/Logger.md) |
| `data` | Data helpers: player data, JSON, MD5, SHA-1, Base64 | [Other data](../apis/DataAPI/OtherData.md) |
| `money` | The economy | [Economy](../apis/DataAPI/Economy.md) |
| `File` | Files and folders | [File](../apis/SystemAPI/File.md), [File system](../apis/SystemAPI/FileSystem.md) |
| `network` | HTTP requests (WebSocket clients and HTTP servers use the `WSClient` and `HttpServer` objects) | [Network](../apis/SystemAPI/Network.md) |
| `system` | System commands, processes, and system information | [System call](../apis/SystemAPI/SystemCall.md), [System info](../apis/SystemAPI/SystemInfo.md) |
| `NBT` | NBT parsing and NBT tag types | [NBT](../apis/NbtAPI/NBT.md) |
| `i18n` | Translations for the plugin's text | [i18n](../apis/ScriptAPI/i18n.md) |
| `Format` | Minecraft text formatting codes | [Game utilities](../apis/GameAPI/GameUtils.md) |

Enumerations, such as `PermType` and `ParamType` for [commands](../apis/GameAPI/Command.md), are also in the global scope.

## Objects

Most of the API works through objects. You get them in two ways:

- **From the game**, as values the API returns or passes to your functions: a `Player` from `mc.getPlayer` or from an
  `onJoin` listener, an `Entity`, a `Block`, an `Item`, a `Container`, or a `CommandOrigin` in a command callback.
- **By creating them** with a constructor: `new JsonConfigFile(path)`, `new KVDatabase(dir)`, `new DBSession(type,
  params)`, `new WSClient()`, `new IntPos(x, y, z, dimid)`, `new NbtCompound(...)`. In Lua, call the class without
  `new`: `JsonConfigFile(path)`.

The reference calls these types `Player`, `Entity`, `Block`, and so on; the classes registered in the engine are named `LLSE_Player`, `LLSE_Entity`, `LLSE_Block`, …, as listed in the Data Types section of the [reference overview](../apis/README.md).

### Players and entities are references, not copies

A `Player` or `Entity` object refers directly to the player or entity in the game: its properties are read when you access them, and its functions act on the game. Because it holds a weak reference, its properties return `Null` once the player has left or the entity is gone. Do not keep `Player` objects for a long time. Instead, keep a player identifier (`pl.xuid` or `pl.name`) and fetch the object again with `mc.getPlayer` when you need it.

### Values and types

The reference uses general type names (`Integer`, `Float`, `String`, `Boolean`, `Array`, `Object`, `Null`, …), which each engine maps to its own types: an `Object` is a JavaScript object or a Lua table, and `Null` is `null` or `undefined` in JavaScript and `nil` in Lua. The [reference overview](../apis/README.md) includes the full table and explains the documentation conventions: `name : Type` for a parameter, and `[ ]` around optional parameters.

Many functions return `Null` when they fail (such as when a player is not online or a form could not be sent), so check the return value before using it. Others, such as the SQL database functions, throw an error instead.

## When your code runs

The engine runs your entry script once, when the plugin is loaded. Everything else your plugin does happens in the functions it passes to the API:

- **event listeners** (`mc.listen`), called each time the event happens;
- **command callbacks** (`mc.newCommand`, `mc.regPlayerCmd`, `mc.regConsoleCmd`), called when someone runs the command;
- **form callbacks** (`pl.sendForm`, `pl.sendModalForm`), called when the player answers or closes the form;
- **timers** (`setTimeout`, `setInterval`), called when their time comes;
- **unload functions** (`ll.onUnload`), called when the plugin is unloaded.

These functions run on the server's thread, between the game's own work. A slow function holds up the server, so keep listeners short and avoid heavy work in frequent events such as `onTick`.

If your function throws an error, LSE catches it and logs it to the console with the event or callback and the name of your plugin; the plugin keeps running. Calling an API with too few arguments or an argument of the wrong type throws an error that names the API and your plugin.

### Events go to every listener

When an event happens, LSE calls every plugin's listeners for that event in the order they were registered (generally the order the plugins were loaded). Returning `false` from a listener intercepts the event: the game does not process it, as if it had never happened, though the other plugins' listeners are still called. See [Event listening](../apis/EventAPI/Listen.md).

## Next

- [Plugins and engines](plugins.md): how a plugin is loaded and unloaded.
- [Language support](../apis/LanguageSupport.md): what differs between the engines.
- The guides: [listening to events](../guides/events.md), [registering commands](../guides/commands.md), [showing forms](../guides/forms.md), [storing data](../guides/storing_data.md), and [logging and timers](../guides/logging_and_timers.md).
