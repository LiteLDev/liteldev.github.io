# Installing LeviLamina on a server

## LeviLamina

### Can I add LeviLamina to an already running vanilla BDS server? Do I need to reinstall?

Yes, and you do not need to recreate the world. However, LeviLamina is strictly tied to the BDS version: each LeviLamina release supports only specific BDS versions (for example, LeviLamina 26.60.8 depends on BDS 1.26.60). If your vanilla BDS version does not match, you must switch to a version that LeviLamina supports.

Recommended approach: create an empty folder, install lip, and run `lip install LeviLamina` inside it. This automatically downloads a compatible BDS, LeviLamina, and its dependencies (such as PreLoader, PeEditor, and bedrock-runtime-data), and PeEditor generates `bedrock_server_mod.exe`. Alternatively, specify the game version with `lip setup --game <BDS version>`, and lip will pick the latest LeviLamina that supports that version. Then copy `worlds/`, `server.properties`, `allowlist.json`, `permissions.json`, and other files from the old server into the new folder, and start the server with `lip run` or by double-clicking `bedrock_server_mod.exe`.

Setting up the files manually (placing `bedrock_runtime_data`, PeEditor, and LeviLamina yourself and then running PeEditor) is not recommended, as it is easy to miss a dependency.

*Applies to: all current LeviLamina versions (install/setup semantics of lip 0.41.x)*

### After installing lip, how do I install a LeviLamina server (and LegacyScriptEngine) from scratch?

1. Install lip, create an empty folder for the server, and open a terminal (cmd or PowerShell) in it.
2. Run `lip install LeviLamina` (equivalent to `lip install github.com/LiteLDev/LeviLamina`). lip automatically downloads the latest BDS version that LeviLamina supports and sets everything up. You must type yes to accept the Minecraft EULA (in scripts, pass `--accept-eula`). You can also specify the game version with `lip setup --game <version>`.
3. If you need script plugins, install LSE with `lip install github.com/LiteLDev/LegacyScriptEngine` (the default variant includes the QuickJS and Lua engines), or install a single engine as needed, such as `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` or `#python`.
4. Start the server with `lip run` or by double-clicking `bedrock_server_mod.exe`.

If your connection is slow, configure a GitHub proxy: `lip config set github_proxy <URL>`. Assembling the server manually is not recommended because dependencies such as language packs and CrashLogger are easy to miss. When reinstalling, always start in a new empty folder. Official tutorial: <https://levimc.org/tutorials/server/first-server/>.

*Applies to: LeviLamina 26.60.x; lip 0.41.x*

### When I manually extract several plugin/mod archives into the server directory, the `README.md`, `CHANGELOG.md` and `LICENSE` files conflict by name. What should I do?

`README.md` (description), `CHANGELOG.md` (changelog), and `LICENSE` (open-source license) are not needed at runtime, so you can skip or delete them and keep only the plugin's own files. Each LeviLamina mod belongs in its own `mods/<mod name>/` subdirectory (with its `manifest.json`), which usually prevents conflicts between mods. LLSE script plugins can go in `plugins/` (since LSE 0.23.0 this is a link to `mods/`, and at startup the plugins are migrated automatically with a generated manifest). We recommend installing with lip so you don't have to extract archives manually.

*Applies to: all current versions (manual installation)*

### When running `bdsdown.exe`, it stops at the Minecraft EULA / privacy policy prompt, typing y has no effect, and LeviLamina reports a BDS protocol version mismatch. How do I download a specific BDS version?

Pass the agreement flag and the version on the command line: `bdsdown.exe -y --source version://windows/x.x.x.x`, replacing `x.x.x.x` with the full four-part BDS build number that your LeviLamina version supports (look it up at <https://levimc.org/LeviLamina/versions/>; for example, LeviLamina 26.60.x uses 1.26.60.6, whereas the `github.com/LiteLDev/bds` dependency in LeviLamina's `lip.toml` lists only the three-part 1.26.60).

However, we now recommend using lip directly: `lip setup --game <game version>` (add `--accept-eula` in scripts) downloads the matching BDS and LeviLamina automatically.

*Applies to: bdsdown v1.x (currently v1.2.1)*

## PreLoader and PeEditor

### All the LeviLamina files are in place, but LL is not loaded when I start BDS (or it crashes right at startup). What is wrong?

For a manual installation, run `PeEditor.exe -m` once from the command line in the BDS directory (a lip installation runs `PeEditor.exe -mb`, which also renames the original file to `bedrock_server.exe.bak`). This generates `bedrock_server_mod.exe` from `bedrock_server.exe`. After that, you must start `bedrock_server_mod.exe` instead of the original `bedrock_server.exe`; only then is LeviLamina loaded through PreLoader.

We recommend installing LeviLamina directly with lip (`lip setup` / `lip install LeviLamina`): it installs dependencies such as PreLoader and PeEditor and applies the patch automatically. Then start the server with `lip run`.

*Applies to: all current LeviLamina server versions*

### My manual LeviLamina installation did not finish (or I switched to manual after a lip installation failed). What do I do next? After starting, it reports that `CrashLogger.exe` is missing. What should I do?

For a manual installation, run the patcher `PeEditor.exe` (`PeEditor.exe -m`) once in the BDS directory and start the server with the generated `bedrock_server_mod.exe` to complete the LL installation.

If the server reports after startup that `CrashLogger.exe` cannot be found, place `CrashLogger.exe` in the LeviLamina mod directory (`mods/LeviLamina/CrashLogger.exe` by default). This path is configured by `modules.crashLogger.externalpath` in `mods/LeviLamina/config/Config.json`; it is relative to the LeviLamina mod directory and defaults to `CrashLogger.exe`. If you do not need external crash logs, you can instead set `crashLogger.enabled` to `false`.

We recommend installing with lip whenever possible: it sets up dependencies such as CrashLogger automatically. Otherwise, you will also have to track down dependencies such as LSE NodeJS by hand.

*Applies to: LeviLamina server, current version (CrashLogger 1.4.x)*

### I installed PeEditor on its own with lip but there is no PreLoader. Aren't PeEditor and PreLoader together?

PeEditor is not PreLoader. PeEditor is the patching tool that injects PreLoader into the game executable (it generates `bedrock_server_mod.exe` or patches `Minecraft.Windows.exe` in place), while PreLoader is the library (`PreLoader.dll`) that loads LeviLamina at runtime. They are separate lip packages (`github.com/LiteLDev/PeEditor` and `github.com/LiteLDev/PreLoader`).

Do not install these dependencies individually. Instead, install LeviLamina itself with lip; this automatically pulls in all dependencies—such as PreLoader, PeEditor, and CrashLogger—and applies the patch.

*Applies to: all current LeviLamina versions*
