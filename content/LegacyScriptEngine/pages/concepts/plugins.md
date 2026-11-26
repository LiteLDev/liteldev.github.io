# Plugins and engines

This page explains what a script plugin is to LeviLamina and LSE: where it lives, how its manifest selects the engine
that runs it, what happens when it loads and unloads, and how plugins written for LLSE become LeviLamina plugins.

## A plugin is a mod

LeviLamina loads mods from the server's `mods` folder. Each mod is a folder containing a `manifest.json`. A C++ mod
has the type `native`; a script plugin has the type of the engine that runs it:

| `type` in `manifest.json` | Engine | Engine mod |
|---|---|---|
| `lse-quickjs` | JavaScript (QuickJS) | `legacy-script-engine-quickjs` |
| `lse-lua` | Lua | `legacy-script-engine-lua` |
| `lse-nodejs` | JavaScript (Node.js) | `legacy-script-engine-nodejs` |
| `lse-python` | Python | `legacy-script-engine-python` |

Each engine is its own LeviLamina mod, installed by a variant of the `LegacyScriptEngine` package (`#quickjs`,
`#lua`, `#nodejs`, `#python`; see [Language support](../apis/LanguageSupport.md)). When it loads, it registers itself
with LeviLamina as the manager for its plugin type, and LeviLamina hands it every mod of that type.

A minimal plugin for the QuickJS engine:

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

- `entry` is the script the engine runs, relative to the plugin's folder.
- `name` is the plugin's name. Keep it the same as the folder name.
- `type` specifies which engine runs it.
- `dependencies` lists the mods that must load first. Include the engine here so it loads before the
  plugin. If a plugin depends on another plugin, list it here too: the dependency loads first, so its event
  listeners are also registered and called first.

[Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/) walks through this layout.
A Node.js plugin also has a `package.json`, and a Python plugin has a `pyproject.toml`; see
[Language support](../apis/LanguageSupport.md).

### `plugins` and `mods`

When an engine loads, it makes `plugins` in the server folder a link to `mods` (a directory junction on Windows),
so `plugins/MyPlugin` and `mods/MyPlugin` point to the same folder. If `plugins` already exists and is not the same folder
as `mods`, LSE logs an error and leaves it alone.

## One engine instance per plugin

Each plugin runs in its own script engine instance, named after the plugin. When LSE loads a plugin, it:

1. for Node.js, runs `npm install --omit=dev` in the plugin's folder if its `package.json` has dependencies and no
   `node_modules` folder exists yet; for Python, runs `pip install` into the plugin's `site-packages` folder if that folder
   does not exist yet and the plugin lists dependencies;
2. creates a new engine instance and a logger named after the plugin;
3. binds the API (`mc`, `ll`, `log`, and the rest; see [How the API works](script_api.md));
4. runs the engine's base library (QuickJS, Lua, and Python);
5. runs the entry script.

Because every plugin has its own instance, plugins do not share global variables. To call a function from another
plugin, export it with `ll.exports` and import it with `ll.imports` (see the [ll API](../apis/ScriptAPI/Ll.md)).

If the entry script throws an error, the plugin fails to load: the console prints the error and its stack trace, and any
event listeners, timers, and exported functions the script registered before the error are removed.

### Loading while the server runs

You can load a plugin after the server has started, for example with LeviLamina's `ll reload <plugin name>`. Its
`onServerStarted` listener is then called immediately, and its `onPreJoin` and `onJoin` listeners are called once for every
online player, so a plugin that sets things up in those events works the same as at startup.

### Unloading

When a plugin unloads while the server is running, LSE calls its `onLeft` listener for every online player, followed by the
functions registered with `ll.onUnload`. LSE then removes the plugin's timers, event listeners, and exported functions,
and releases its engine instance. Commands the plugin registered with `mc.newCommand` remain in the game without their
callbacks until the server restarts.

### On the client

In the Minecraft client on Windows, plugin scripts run only while a local world is running (a single-player world
acts as a local server): they start when its server starts and stop when it stops. Scripts do not run when you
join someone else's server.

## Plugins written for LLSE

LLSE plugins were single files dropped into `plugins/`. When an engine loads, it looks for these files in `mods/` (and therefore in `plugins/`):

| Engine | Files it migrates |
|---|---|
| QuickJS | `*.js` |
| Lua | `*.lua` |
| Python | `*.py` |
| Node.js | `*.llplugin` (a zip archive) |

For each file it finds, the engine creates a `mods/<file name without extension>/` folder and moves the file into it (for Node.js, it extracts the archive into the folder and deletes the archive). Unless a `manifest.json` already exists there, the engine writes one with the file as the entry (for Node.js, the entry script found in the archive), the file name as the plugin's name, and the engine as both its type and dependency. It then logs that the plugins have been migrated and require a restart to load. Restart the server once more to run them.

If the target folder already contains a file with the same name, migration fails with an error. To disable migration, set `migratePlugins` to `false` in the engine's configuration.

## The engine's configuration

Each engine reads `config/config.json` from its own mod folder (for example, `mods/legacy-script-engine-quickjs/config/config.json`), creating the file with default values if it does not exist:

| Key | Default | Meaning |
|---|---|---|
| `version` | `3` | The file format version. |
| `migratePlugins` | `true` | Migrate LLSE plugins at startup (see above). |
| `debugCommandLevel` | game directors (operators) | Who may run the engine's debug command (`jsdebug`, `luadebug`). |
| `fixLegacyAddons` | not set | Node.js only: fix native addons built with node-gyp older than 11.1.0. |
