# LegacyScriptEngine

A plugin engine for running LLSE plugins on LeviLamina: write plugins for a Minecraft Bedrock server in JavaScript, Lua, or Python instead of C++.

## What LegacyScriptEngine is

LegacyScriptEngine (LSE) is a [LeviLamina](https://levimc.org/LeviLamina/) mod that runs plugins written in scripting languages instead of C++. It continues the LiteLoaderBDS script engine (LLSE): plugins written for LLSE run on LeviLamina with little or no change, and new plugins use the same API documented on this site.

LSE runs on Bedrock Dedicated Server and in the Minecraft client on Windows. Like every LeviLamina mod, you install it with [lip](https://levimc.org/lip/) on a server and with [LeviLauncher](https://levimc.org/LeviLauncher/) on the client. See [Install](install.md).

With LSE you get:

- **Four script engines**: Lua, QuickJS, Node.js, and Python, each installed with lip as its own package variant (see [Language support](apis/LanguageSupport.md)).
- **LLSE plugins that keep running**: put LLSE plugins in `plugins/` and start the server; they are migrated automatically and given a LeviLamina mod manifest (see [Plugins and engines](concepts/plugins.md)).
- **The LLSE API**: events, players, blocks, items, NBT, forms, files, networking, and more (see the [API reference](apis/README.md)).

## A plugin in a few lines

A plugin is a folder in `mods/` (or `plugins/`, which is the same folder) containing a script and a `manifest.json` that specifies which engine runs it. This JavaScript example greets every player who joins and adds a console command:

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

Start the server and the console shows `MyPlugin is running!`; type `greet Steve` and it answers `Hello, Steve!`. [Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/) builds this plugin step by step, from installing the engine to seeing it in the game.

## Engines

Each language has its own engine, installed as a variant of the `LegacyScriptEngine` package. All engines share a single API, so the reference applies to every language (see [Language support](apis/LanguageSupport.md) for the differences).

| Variant | Language | Engine |
|---|---|---|
| `#lua` | Lua | CLua |
| `#quickjs` | JavaScript | QuickJS, with ES modules |
| `#nodejs` | JavaScript | Node.js, with npm packages |
| `#python` | Python | CPython, with pip packages |

[Install](install.md) explains how to install a variant and which Python version the Python engine requires.

On the client, releases up to 0.23.1 name the variants `#client_lua`, `#client_quickjs`, `#client_nodejs`, and `#client_python`; LeviLauncher picks the right build for you.

## Start here

- [Install mods on your server](https://levimc.org/tutorials/server/install-mods/): install LegacyScriptEngine (and other mods) on a LeviLamina server with lip.
- [Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/): write a plugin, load it, and see it run.

Already have LLSE plugins? Put them in `plugins/` and start the server: they are migrated automatically and given a LeviLamina mod manifest (`manifest.json`). Restart the server to load them.

## On this site

- **Guides**: step-by-step instructions for common tasks: [listen to events](guides/events.md), [register commands](guides/commands.md), [show forms](guides/forms.md), [store data](guides/storing_data.md), and [log and schedule](guides/logging_and_timers.md).
- **Concepts**: [plugins and engines](concepts/plugins.md) (the manifest, loading, migration), [language support](apis/LanguageSupport.md) (what differs per engine), and [how the API works](concepts/script_api.md) (globals, objects, callbacks).
- **Reference**: [every API](apis/README.md) in LSE: events, players, blocks, items, NBT, forms, files, networking, and more. For editor hints and project scaffolding, see [legacy-script-engine-api](https://github.com/LiteLDev/legacy-script-engine-api).
- **Questions**: the [LegacyScriptEngine FAQ](https://levimc.org/faq/scripts/lse/basics/), alongside FAQs for every LeviMC project.

LegacyScriptEngine is open source: see its [repository](https://github.com/LiteLDev/LegacyScriptEngine) and [how to contribute](https://github.com/LiteLDev/LegacyScriptEngine/blob/develop/CONTRIBUTING.md) (issues, translations, pull requests).

## License

GPL-3.0-or-later © LeviMC
