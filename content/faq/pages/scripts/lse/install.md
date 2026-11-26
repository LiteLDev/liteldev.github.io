# LegacyScriptEngine: installing, configuring, versions

## Installation

### Do I need to install all four LSE engines (quickjs, nodejs, lua, python)? How do I tell which engine a plugin needs?

No. Install only the engines for the plugins you use (`lip install LegacyScriptEngine#quickjs` / `#lua` / `#nodejs` / `#python`; if you omit the variant, quickjs and lua are installed by default).

To tell which engine a plugin needs:

1. Check the plugin's file extension (`.js` / `.lua` / `.py`).
2. JS plugins use either QuickJS or Node.js. A plugin with a `package.json` (meaning it uses npm packages) is usually a Node.js plugin; otherwise, it is most likely QuickJS.
3. For the most reliable check, inspect the `type` field in the plugin's `manifest.json` (`lse-quickjs`, `lse-nodejs`, `lse-lua`, `lse-python`) and the engine listed under `dependencies` (such as `legacy-script-engine-quickjs`).

If you install the wrong engine or miss one, the startup log will also tell you which dependency is missing.

Note that the Python engine requires the matching version of Python on the machine (3.12.10 for LSE >=0.16.2).

*Applies to: all current versions (variant-style package names since LSE 0.10.0; latest 0.23.1)*

### Which directory does the plugin directory `/path/to/bedrock_dedicated_server/plugins` in the LSE documentation refer to?

It refers to the `plugins` folder in the BDS server root directory (the directory containing `bedrock_server_mod.exe`). Current versions of LeviLamina use `mods/` in the root directory as the mod directory. Since 0.23.0, LSE automatically creates a `plugins` link (junction) to `mods/` at startup, so you can place LLSE plugins in either `plugins/` or `mods/`. At startup, LSE migrates them to `mods/<plugin name>/` and generates a `manifest.json`; the plugins then load on the next restart.

Note: if a real `plugins` folder already exists in the server root directory (for example, left over from an older version), LSE will not create the link and will report the error `a file or directory with the same name already exists`. If this happens, move the plugins inside it to `mods/` and delete the `plugins` folder.

*Applies to: LSE 0.23.0 and later (current 0.23.x)*

### How do I install the LSE Python engine on LeviLamina?

In the server root directory, install the Python variant of LSE with lip: `lip install github.com/LiteLDev/LegacyScriptEngine#python` (on the client, use LeviLauncher). The Python engine also requires the matching Python version on the machine (Python 3.12.10 for LSE >=0.16.2). Few plugins use Python, so you can skip it unless you need it.

*Applies to: LSE 0.16.2 and later (current 0.23.x)*

### To use an LSE plugin such as SimpleTPS, must I install the Python version of LSE (with specific C++/Python versions)?

No. LSE is split into language-specific engine variants (`#quickjs`, `#nodejs`, `#lua`, `#python`), and you only need the variant your plugin uses—for example, `lip install github.com/LiteLDev/LegacyScriptEngine#quickjs` for a JS plugin. Running `lip install github.com/LiteLDev/LegacyScriptEngine` without a variant installs only the QuickJS and Lua engines, not the Python engine. Only the Python engine requires Python on the machine (3.12.10 for LSE >=0.16.2); you can remove an unused Python variant of LSE with `lip uninstall`.

*Applies to: all current LSE versions (`lip.toml` variants)*

### Do I need to install Node.js separately to use the LegacyScriptEngine nodejs engine?

Not to run it. `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` automatically downloads `node-prebuilt.zip` (which contains libnode) into `mods/legacy-script-engine-nodejs/` and installs dependencies such as 7-zip. You only need Node.js installed on your machine when developing Node.js plugins (`npm init`, etc.).

*Applies to: current LSE nodejs engine*

### What are the steps to set up an environment from scratch for writing LeviLamina server plugins in JS? Do I need xmake/cmake/mingw?

You do not need xmake/cmake/mingw to run or write JS plugins (those are only for C++ mod development). Follow these steps:

1. Download and install lip from <https://github.com/LiteLDev/lip/releases/latest> (`lip-<version>-win-x64.msi`).
2. On networks in mainland China, you can set a GitHub proxy: `lip config set github_proxy <proxy address>`.
3. Create a server directory, `cd` into it, and run `lip install LeviLamina --accept-eula` (this also installs the matching BDS).
4. Install the engine: `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` (or `#quickjs`).
5. Start the server with `lip run` or by running `bedrock_server_mod.exe`.

Place the plugin in `mods/<plugin name>/` (`plugins/` is a link to `mods/`). It needs the entry file and a `manifest.json` (`name` matching the directory name, `entry` set to the entry js file, `type` set to `lse-nodejs` or `lse-quickjs`, and `legacy-script-engine-nodejs` / `legacy-script-engine-quickjs` in `dependencies`). With Node.js, set `"type": "module"` in `package.json` to use ES modules. API documentation: <https://levimc.org/LegacyScriptEngine/>.

You can also download the files manually, but you must then supply the dependencies yourself (LegacyRemoteCall, LegacyMoney, iListenAttentively, 7-zip, node-prebuilt, etc.).

*Applies to: lip 0.41.x; LeviLamina 26.x; LSE 0.23.x*

### After skipping lip and installing the LSE NodeJS engine manually, loading a (`.llplugin`) plugin reports a decode/extract failure. What can I do?

`7za.exe` is missing. The LSE nodejs engine calls `7za.exe` to extract `.llplugin` files. When lip installs the `#nodejs` variant, it places `7za.exe` in the server root directory automatically through the `github.com/LiteLDev/7-zip-tooth` dependency. For a manual installation, download `7za.exe` from that repository yourself and put it in the server root directory (you do not need to run it). Also, libnode should be in `mods/legacy-script-engine-nodejs/` (from `node-prebuilt.zip`), not in the server root directory. Installing with `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` is recommended.

*Applies to: current LSE nodejs engine (manual installation)*

### What should I know when installing the LSE Python and NodeJS engines?

Every engine is now a variant of the LegacyScriptEngine package, so install it with lip: `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` / `#python` (and likewise `#quickjs`, `#lua`). lip handles the dependencies automatically (the NodeJS variant also downloads the prebuilt node runtime into the `legacy-script-engine-nodejs` directory).

The Python engine requires the matching version of Python on the machine that runs it: 3.12.10 for LSE >=0.16.2, 3.12.8 for >=0.9.0 \<0.16.2, and 3.10.11 for \<0.9.0. The engine looks for `Lib`/`DLLs`/`site-packages` in directories on `PATH` whose names contain Python, so add that Python to `PATH` when you install it.

*Applies to: LSE 0.23.x (the Python version table applies to all versions)*

## Configuration

### I don't use the Lua/Python engines or LegacyMoney (formerly LLMoney). Can I disable them to start faster and save resources?

You can remove any script engines you don't need. Each LSE engine has its own mod directory (`mods/legacy-script-engine-quickjs`, `mods/legacy-script-engine-lua`, `mods/legacy-script-engine-python`, `mods/legacy-script-engine-nodejs`), so just delete the directories for the engines you don't use.

If you use lip, you can remove an individually installed variant with `lip uninstall` (for example, `lip uninstall LegacyScriptEngine#python`). However, the default installation (`lip install LegacyScriptEngine` without a variant) installs both QuickJS and Lua as dependencies of the default variant, and lip will not uninstall a dependency that is still required. To keep only one engine, uninstall LegacyScriptEngine and install a single variant instead (for example, `lip install LegacyScriptEngine#quickjs`).

LegacyMoney, however, cannot be removed. In the current version, it is a required dependency of LSE (`dependencies` in `manifest.json` lists LegacyMoney, LegacyRemoteCall, and iListenAttentively). If you delete it, LeviLamina will refuse to load any LSE engine because of a missing dependency (`MissingDependency`).

*Applies to: LegacyScriptEngine 0.23.x (LeviLamina 26.60.x) and the current version*

## Versions and compatibility

### After installing the latest LSE on BDS 26.20 (LeviLamina 26.20.x), it doesn't work and LSE plugins don't load. Which LSE version should I install?

Each LSE version targets a single LeviLamina minor series and cannot be used across versions. The latest LSE 0.23.x targets LeviLamina 26.60.* (BDS 26.60) and cannot run on 26.20. LeviLamina 26.20.x corresponds to LSE 0.19.x; install the last release in that series, LSE 0.19.7.

Version correspondence:

- 0.19.x → LL 26.20.*
- 0.20.0 → LL 26.32.*
- 0.21.x → LL 26.40.*
- 0.22.x → LL 26.51.*
- 0.23.x → LL 26.60.*

Check the "Adapted to LeviLamina xx" entries in the LSE CHANGELOG to confirm which LL version an LSE release targets.

*Applies to: LeviLamina 26.20.x; LSE 0.19.x to 0.23.x (the version-matching principle applies to the current version)*

### Which version of Node.js is built into the LegacyScriptEngine NodeJS engine (`legacy-script-engine-nodejs`)?

Node.js v22.12.0. When LSE installs the nodejs variant through lip, it also downloads the v22.12.0 prebuilt package of LiteLDev/node (`node-prebuilt.zip`), and the ScriptX V8 backend is built against node v22.12.0 as well.

*Applies to: LSE 0.9.0 and later (currently v0.23.1)*
