# Logging and timers

This guide covers two things almost every plugin needs: writing messages to the console or a log file, and running code later or at intervals. At the end, it shows how to try code in the console without writing a plugin.

The examples are in JavaScript; the API is the same in every language.

## Write to the console

`log` writes its arguments to the server console, one after the other on a single line:

```js
log("MyPlugin is running!");
log(`Players online: ${mc.getOnlinePlayers().length}`);
```

Every line from your plugin includes its name: LSE gives each plugin a logger named after it, and `log` and `logger` write through it. `colorLog(color, ...)` writes a line in color, and `fastLog` returns before the line has been written. See the [Script helper API](../apis/ScriptAPI/ScriptHelp.md).

## Write messages with a level

`logger` writes messages with a severity level, so warnings and errors stand out and debug messages can be hidden:

```js
logger.info("Loaded 12 homes.");
logger.warn("config.json has no 'welcome' setting, using the default.");
logger.error("Could not open the database.");
logger.debug("Home of Steve: 10 64 -3");
```

The levels are numbered: 1 fatal, 2 error, 3 warn, 4 info, 5 debug. Messages above the logger's level are not written; the default is `4`, so debug messages are hidden. Show them while you work on the plugin:

```js
logger.setLogLevel(5);
```

### Also to a file or a player

```js
logger.setFile("logs/MyPlugin.log");
```

writes the messages to a file in addition to the console. `logger.setPlayer(player)` also sends them to a player in the game as chat messages, which is useful when testing in-game. `logger.setConsole(false)` stops output to the console. Each of these functions takes the level as an optional second argument; the level applies to the whole logger, not just that output. See the [Logger API](../apis/ScriptAPI/Logger.md).

## Run code later

`setTimeout(func, ms)` calls a function once after a delay in milliseconds, and returns the task ID:

```js
mc.listen("onJoin", (player) => {
    const xuid = player.xuid;
    setTimeout(() => {
        const pl = mc.getPlayer(xuid);
        if (pl) pl.tell("Type /menu to open the menu.");
    }, 5000);
});
```

Five seconds later, the player may have left: look up the player again by their identifier and check the result (see [How the API works](../concepts/script_api.md)).

## Run code at intervals

`setInterval(func, ms)` calls a function repeatedly every `ms` milliseconds until you cancel it with `clearInterval(id)`:

```js
const announcement = setInterval(() => {
    mc.broadcast("Remember to read the rules: /menu");
}, 10 * 60 * 1000);

// later, to stop it:
clearInterval(announcement);
```

When a plugin is unloaded, LSE cancels its timers (QuickJS, Lua, and Python).

### How precise timers are

Timers run on the server's thread and are counted in 50 ms game ticks, so a delay is never shorter than a tick and takes longer when the server is slow. A timer is suited for "in five seconds" or "every ten minutes", not for exact times. To run a task at a specific time of day, compute the delay until then and use `setTimeout` instead of checking the time on every tick. Keep timer functions short: like event listeners, they block the server while they run.

The Node.js engine uses Node.js's own `setTimeout` and `setInterval`.

## Try code in the console

The QuickJS, Lua, and Python engines have a debug mode in the server console. Type `jsdebug` (QuickJS), `luadebug` (Lua), or `pydebug` (Python) and press Enter: from then on, every line you type runs as code in that language and prints its result, like a browser console. Type the same command again to exit. The Node.js engine has no debug mode.

With QuickJS and Lua, you can also run a single line directly: `jsdebug mc.getOnlinePlayers().length`. Who may run these commands is set by `debugCommandLevel` in the engine's configuration (see [Plugins and engines](../concepts/plugins.md#the-engines-configuration)).
