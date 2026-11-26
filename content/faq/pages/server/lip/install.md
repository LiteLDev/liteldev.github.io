# Installing lip and setting up a server

## How do I uninstall a plugin/mod installed with lip? Why does simply deleting the plugin folder not work?

Run `lip uninstall <package>` in the server directory. You can specify the package by the identity shown in `lip list` (such as `lip uninstall github.com/LiteLDev/LegacyScriptEngine#lua`) or by the source you installed it from (such as `./package.zip`); pass `--dry-run` first to preview what would be deleted. lip runs the uninstall hooks, deletes the files the package owns, and automatically removes dependencies that are no longer needed. Do not delete folders manually: lip tracks installed packages in `.lip/state.json`, so if you delete a folder by hand, lip still considers the package installed and running `lip install` for the same version will not reinstall it. If that happens, run `lip uninstall` first and then `lip install`. If something is still wrong after reinstalling, perform a clean install of a LeviLamina server with lip in a new empty directory to determine whether the server or the plugin is at fault. For more subcommands, run `lip --help` or open the interface by running `lip` directly.

*Applies to: all current lip versions (the state file path `.lip/state.json` applies to lip v0.40+)*

## What is the difference between the lip msi installer and the downloadable lip executable (zip)? How do I use lip after installing?

There is no functional difference. The msi is a standard installer: it automatically adds lip to the PATH environment variable so you can run `lip` in a command prompt right after installing, and you can uninstall it from "Programs and Features". It is best for users who do not know how to edit environment variables. The zip is a portable build that you extract yourself and place in a directory in PATH. Both can be updated with `lip self-update` (an msi installation updates silently through msiexec). After installing, run `lip` in the server folder to open the interface.

*Applies to: lip 0.41.x (Windows)*

## GitHub is not reachable. How do I download and install lip?

The lip installers are on GitHub Releases: <https://github.com/LiteLDev/lip/releases/latest> (the old `futrime/lip` address redirects automatically). On Windows, download `lip-<version>-win-x64.msi` (or `-win-arm64.msi`; a portable `.zip` is also available), for example <https://github.com/LiteLDev/lip/releases/download/v0.41.1/lip-0.41.1-win-x64.msi>. On Linux and macOS, the install script also downloads from GitHub; pass your GitHub proxy in `LIP_GITHUB_PROXY` (which works the same as lip's `github_proxy`): `curl -fsSL https://levimc.org/lip/install.sh | LIP_GITHUB_PROXY=<proxy URI> sh`. You can also download the matching `.tar.xz` or `.zip` archive manually.

If you cannot reach GitHub, download through a third-party GitHub mirror (prepend the mirror's prefix to the URL, or replace `github.com` with the mirror's domain). After installation, run `lip config set github_proxy <proxy URI>` so lip uses the proxy for future GitHub downloads.

## After LeviLamina was updated for a new game version, installing LL and BDS with lip works, but installing the quickjs/nodejs/lua variants of LegacyScriptEngine keeps failing. What should I do?

Run `lip cache clean` to clear lip's cache, then run the install command again, such as `lip install LegacyScriptEngine#lua`. Clearing the cache does not lose any data; lip simply redownloads the files it needs. Do not run other lip commands while the cache is being cleared. If the installation still fails, check the failure report in `.lip/logs/`. If it reports an incompatible game or loader version, that LSE version does not yet support the current LeviLamina: wait for an LSE update, or use `lip setup` to switch to a supported version.

*Applies to: lip 0.41.x*

## I ran a lip install in the plugins (or mods) directory by mistake, and it downloaded a lot of files (even another server). What should I do?

lip treats the current working directory as the workspace (the server folder), so you must run all lip commands in the server root directory, not in subdirectories such as mods or plugins. Running a command like `lip install LeviLamina` in a subdirectory sets up another server there. To fix this, delete the mistakenly installed files in the subdirectory (including its `.lip` folder), or run `lip uninstall` there, and then rerun the command in the server root directory.

## How do I install the LSE Lua / QuickJS engines with lip? What if the installation fails?

Each language engine is now a variant of the LegacyScriptEngine package, selected with `#`:

```shell
lip install LegacyScriptEngine#lua
lip install LegacyScriptEngine#quickjs
# #nodejs and #python also exist
```

If you do not specify a variant (`lip install LegacyScriptEngine`), lip installs both the QuickJS and Lua engines. `LegacyScriptEngine` is shorthand for `github.com/LiteLDev/LegacyScriptEngine`. Before installing, the workspace must already contain a server and LeviLamina (`lip install LeviLamina` or `lip setup --game <version>`). If the installation fails, first update to the latest lip with `lip self-update`, then run `lip cache clean` and try again, and check the error or hint that lip prints along with the failure report under `.lip/logs/`.

*Applies to: lip 0.41.x; LegacyScriptEngine 0.23.x*

## A manually downloaded LeviLamina mod reports missing dependencies or fails to load on startup. How do I install the matching mod version on older versions such as BDS 1.21.70?

Manually downloaded files may be incomplete or missing dependencies, so install mods with lip instead, which resolves dependencies automatically. To use an older BDS version: in the server folder, first set up the game and loader with `lip setup --game 1.21.70` (which also installs the latest LeviLamina that supports that version), and then run `lip install <package>`; lip automatically selects the latest version compatible with the current workspace. Alternatively, look up the release that supports your BDS version in the mod's GitHub Releases and pin it with `lip install <package address>@<version>` (for example, `lip install github.com/user/repo@1.2.0`); add `--dry-run` first to preview what will be installed. The mod must have a release that supports the target BDS version.

*Applies to: lip 0.41.x*

## When I run the lip install commands from the LeviLamina/LSE installation docs, the commands with `@version` fail. How should I write them?

In `<repo>@<version>` in the documentation, version is just a placeholder—do not copy it literally. To install the latest version, omit `@version` entirely, for example `lip install github.com/LiteLDev/LegacyScriptEngine` (LiteLDev repositories can also be shortened to `lip install LegacyScriptEngine`). To install a specific version, replace the placeholder with the actual version number, for example `lip install github.com/LiteLDev/LegacyScriptEngine@0.23.1` (corresponding to the repository's `v0.23.1` tag). When specifying a variant, put `#variant` before the `@`, such as `LegacyScriptEngine#lua@0.23.1`.

Note: in current versions of lip, `lip install LeviLamina` and `lip install LeviLamina@<version>` also install the matching BDS just like `lip setup` does (you must accept the EULA). To change the version of an existing LeviLamina installation, use `lip setup`.

## When I install with `lip install github.com/LiteLDev/LegacyScriptEngine@<version>`, are all four LSE language engines installed? Do I need to add `#` after the version?

No `#` is needed. Running `lip install github.com/LiteLDev/LegacyScriptEngine@<version>` without a variant installs only the QuickJS and Lua engines. To install the Node.js or Python engine, install its variant separately with the variant name placed before the `@`: `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs@<version>` and `lip install github.com/LiteLDev/LegacyScriptEngine#python@<version>` (omit `@<version>` to install the latest version).

*Applies to: LegacyScriptEngine 0.17.x and later*

## Downloading or installing the LSE NodeJS engine with lip fails. What should I do?

1. First, update lip to the latest version: `lip self-update`.
2. Clear the cache and try again: `lip cache clean`.
3. If GitHub is slow or blocked, set a GitHub proxy with `lip config set github_proxy <proxy address>`, or set the system HTTP proxy environment variable in your terminal (for example, in PowerShell: `$env:HTTPS_PROXY = "http://127.0.0.1:port"`), which lip uses automatically.
4. Reinstall using the current package name: `lip install github.com/LiteLDev/LegacyScriptEngine#nodejs` (or the short form `lip install LegacyScriptEngine#nodejs`). Note that you must first set up the game and LeviLamina with `lip setup --game <version>`. If the package was already explicitly installed, `lip install` will refuse; use `lip update` instead, or run `lip uninstall` before installing again.

If it still fails, check the terminal hint and the failure report under `.lip/logs/` to find the cause.

*Applies to: lip 0.41.x and later*

## Does installing BDS/LeviLamina with lip stop at a step that requires accepting the Minecraft EULA? Is there a parameter to skip the acceptance in a one-click install script?

Yes, it prompts for acceptance. When installing the game (BDS), current versions of lip display links to the Minecraft EULA and Microsoft privacy statement and require you to type `yes` to continue. In a non-interactive terminal such as a script, it fails immediately without the parameter. In a script, pass `--accept-eula` to skip the prompt, for example:

```shell
lip setup --game 1.21.0 --loader levilamina@1.0.0 --accept-eula
```

or `lip install LeviLamina github.com/user/repo --accept-eula` (this takes effect when install runs as a setup). lip prompts again every time the game is installed; your acceptance is not saved.

*Applies to: lip 0.41.x and later*

## Installing LeviLamina or plugins with lip fails. In which directory should lip run? Do I need to install the LSE dependencies one by one?

lip uses the current working directory as its workspace, so you must run it in the server root directory (the directory containing `bedrock_server.exe`); there is no option to specify another directory. The lip executable itself can be placed in your PATH. To create a new server, run `lip setup --game <version>` (or `lip install LeviLamina`) in an empty folder.

To install LegacyScriptEngine, you only need to install the package itself (for example, `lip install LegacyScriptEngine#lua`); its other dependencies, such as LegacyRemoteCall, are resolved and installed automatically. However, `lip install` does not install or modify the game or LeviLamina. You must first run `lip setup` to install a LeviLamina version that satisfies the LSE version constraint; otherwise, the command fails and directs you to `lip setup`. Installing LeviLamina automatically runs PeEditor to generate `bedrock_server_mod.exe`. For non-interactive scripts, use `--accept-eula` (newer versions of lip no longer have the `-y` option).

*Applies to: lip 0.41.x and later*

## Installing or upgrading LeviLamina with lip was interrupted (`bdsdown.exe` and other files remain in the directory), or the server cannot start after installing in a directory that already has old server files. How do I install and upgrade correctly?

New server: in an empty folder, run `lip setup --game <version>` (or `lip install LeviLamina`), install the mods you need with `lip install`, and then copy over the old server's `worlds/`, `server.properties`, `allowlist.json`, `permissions.json`, and the configuration of each mod. You do not need to keep the old `bedrock_server_mod.exe`; installing LeviLamina regenerates it.

Upgrade: for a server already managed by lip, run `lip setup --game <new version>` in that directory. This keeps the worlds and configuration files listed above; mods incompatible with the new version are listed as left-out, and lip asks whether to uninstall them.

Interruption: installation in current lip is atomic. After an interruption, the next `lip setup/install/update/uninstall/run` automatically rolls back or completes the previous operation, so you do not need to delete leftover files manually (do not delete `.lip/journal` or `.*.bak`).

If the server does not start, first check the server output and `logs\latest.log` (typical causes are a port already in use or a mod failing to load).

*Applies to: lip 0.41.x; LeviLamina 26.x*

## After installing LeviLamina with lip, which file do I use to start the server?

A server with LeviLamina must run `bedrock_server_mod.exe` (which PeEditor generates from `bedrock_server.exe` during installation); do not run the vanilla `bedrock_server.exe`. In newer versions of lip, you can also run `lip run` directly in the server directory (or click start on the server page of the lip interface); when a loader is installed, this runs `bedrock_server_mod.exe`.

## Can lip update only the BDS itself?

Yes. In lip, BDS is the package `github.com/LiteLDev/bds` (the "game" of the workspace). Run `lip setup --game <version>` in the server directory (for example, `lip setup --game 1.26.60`) to switch to a specific BDS version. lip also selects the latest LeviLamina that supports that version (you can specify one with `--loader levilamina@<version>`, or install only the vanilla server with `--no-loader`) and switches the other mods to compatible versions. Worlds, `server.properties`, `allowlist.json`, and `permissions.json` are kept. Add `-n` (`--dry-run`) to preview the changes first. Note that `lip install` and `lip update` cannot update BDS directly and tell you to use `lip setup` instead.

*Applies to: lip 0.41.x*

## Can I use lip to update LeviLamina to the latest commit of the development branch?

You cannot get unreleased development builds with lip. lip installs or switches LeviLamina (the loader) with `lip setup --loader levilamina@<released version>` (or with `lip install` without a ref or with a version number, which installs it as the loader). Although `lip install` supports `@branch:<name>` and `@rev:<commit>` references, the resource URLs in LeviLamina's `lip.toml` point to release packages on GitHub Releases, so specifying a branch still installs a released version. To use a build from the latest commit, the only option is to download the artifacts from GitHub Actions (the build workflow) in the LeviLamina repository and replace the files manually. Note that LeviLamina's default branch is now `main` (there is no `develop` branch anymore).

*Applies to: LeviLamina 26.x; lip 0.41.x*
