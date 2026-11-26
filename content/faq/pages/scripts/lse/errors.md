# LegacyScriptEngine: errors and crashes

## An old LL1-era JS plugin (such as an online-time tracker with `/onlinetime rank`) fails on LSE with `i is not defined`, and the leaderboard does not open. How do I fix it?

The new script engine loads JS as an ES Module (strict mode), so using an undeclared variable causes an error. Open the plugin file at the line number in the error, change `for (i = 0; ...)` to `for (let i = 0; ...)`, and make sure all other loop and general variables throughout the file are declared with `let`, `const`, or `var`.

*Applies to: LegacyScriptEngine (QuickJS backend), current version*

## LSE reports `ERROR [legacy-script-engine-quickjs] failed to load: Failed to migrate legacy plugin at plugins/XXX.js: plugins/XXX already exists` at startup. How do I fix it?

At startup, LSE migrates single-file legacy plugins (such as `XXX.js`) from the root of `plugins/` (a link to `mods/` since 0.23.0) to `mods/XXX/XXX.js` and generates a `manifest.json`. If `mods/XXX/XXX.js` already exists—because the plugin was previously migrated and you placed another single file with the same name in the root—the migration fails with this error. To fix it, delete the duplicate `XXX.js` in the root directory. If you want to replace the existing plugin with the new file, delete or empty the old `mods/XXX` directory first, then restart the server. After the migration completes, you must restart the server once more for the plugin to load.

*Applies to: LSE 0.x up to current (0.23.x); since 0.23.0, `plugins/` is a link to `mods/`*

## LSE reports `Fail to import! Function [LLSEGlobal::LoginAPI] has not been exported!` when the server starts. What causes this?

A script plugin is importing a function exported by another plugin via remote calls (`ll.imports("LLSEGlobal", "LoginAPI")`), but the prerequisite plugin that exports it (in this case, a login plugin) is either not installed or failed to load. Load order can also cause this if the import runs before the function is exported.

Search the `plugins` directory for the string `LoginAPI` to find which plugin imports or exports it, then install or fix the prerequisite plugin.

## A JSON parse error related to `config.reload()` appears at server startup, but it doesn't say which LSE plugin is responsible. How do I find it?

Usually, a plugin's JSON config file is empty or corrupted, causing `reload()` on `JsonConfigFile` (which parses the file as JSON internally) to fail and throw an exception.

Write a script to scan all `.json` files under the `plugins` directory and find any that fail to parse (pay special attention to empty, 0-byte files). Back up your data files first, fix or delete the broken configs, and then restart the server.

## After installing the LSE Python engine, some players see "破损的数据包" (`server sent broken packet`) or crash when joining. What is the cause?

This is a known issue (LegacyScriptEngine issue #103, still open at the time of writing). Enabling client-side chunk generation (`client-side-chunk-generation-enabled` in the BDS `server.properties`) conflicts with the LSE Python engine (`legacy-script-engine-python`), causing joining players to see `server sent broken packet` (broken packet). Players can join normally if the option is disabled or the Python engine is not installed.

Workaround: set `client-side-chunk-generation-enabled=false` in `server.properties`, or stop using the Python engine for now.

*Applies to: servers using the LSE Python engine (the issue was first reported on LSE 0.6.2 / BDS 1.20.72; no fix recorded in the latest version)*
