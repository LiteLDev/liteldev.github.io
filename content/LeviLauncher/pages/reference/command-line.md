---
platforms: [windows]
---
# Command Line

Run `LeviLauncher.exe` without arguments to open the launcher window. Pass a command to run it in the terminal and exit, using a `<noun> <verb>` grammar:

```text
LeviLauncher.exe <command> [arguments] [flags]
```

This page lists every command in LeviLauncher 1.1.0. Run `LeviLauncher.exe help <command>` to print the flags and examples for a command, or `LeviLauncher.exe help` for an overview.

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe play
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe world export "My World" -o D:\Backups
LeviLauncher.exe instance list --json
```

## Running it from a shell

Because `LeviLauncher.exe` is a GUI application, shells do not wait for it by default. To wait for its output or read its exit code before the prompt returns:

- In cmd, use `start /wait LeviLauncher.exe ...`, then read `%ERRORLEVEL%`.
- In PowerShell, pipe the output (`LeviLauncher.exe instance list | Out-String`) or use `Start-Process -Wait -NoNewWindow`.

Running from the command line does not open the launcher window, and works even while the window is already open.

## Commands

### Everyday

| Command | What it does |
| --- | --- |
| `play [<instance>]` | Start the game and wait until its window appears (alias of `launch`) |
| `install <version\|file>` | Download and install Minecraft as a new instance (= `instance create`) |
| `use [<instance>]` | Set or show the default instance |
| `stop [<instance>\|<pid>...]` | Close a running Minecraft process (= `process stop`) |

### Manage an instance

| Command | What it does |
| --- | --- |
| `instance list [<filter>]` | List installed instances |
| `instance show [<instance>]` | Show an instance's settings, registration, loader, players, and content counts (also `instance <instance>`) |
| `instance create <version\|file>` | Download and install Minecraft as a new instance |
| `instance copy-data [<instance>] --from system\|<instance>` | Copy game data (worlds, settings) into an instance with its own data |
| `instance rename <instance> <new-name>` | Rename an instance |
| `instance set [<instance>]` | Change instance settings (console, editor mode, own data, arguments, environment, logo) |
| `instance remove <instance>...` | Permanently delete instances and everything in their folders |
| `instance register [<instance>]` | Make Windows treat this instance as the installed Minecraft for its channel |
| `instance unregister [<instance>]` | Release the instance's Windows registration (keeps game data) |
| `instance shortcut [<instance>]` | Create or remove a desktop shortcut that starts the instance |
| `instance path [<instance>] [<kind>]` | Print an instance folder path (and optionally open it) |
| `mod list [<filter>]` | List the mods in an instance |
| `mod show <package>` | Show details for a mod in the catalogue |
| `mod search [<words>]` | Search the LeviLamina mod catalogue |
| `mod install <package[@version]>...` | Install, upgrade, or downgrade mods from the catalogue |
| `mod update [<mod>...]` | Update catalogue mods to their newest version |
| `mod import <file>...` | Add mods from `.mcmod`, `.zip`, or `.dll` files |
| `mod set <mod>` | Change a mod's manifest |
| `mod remove <mod>...` | Remove mods from an instance |
| `mod enable <mod>... \| --all` | Turn mods on |
| `mod disable <mod>... \| --all` | Turn mods off without removing them |
| `mod path [<mod>]` | Print the folder path of a mod or the instance's mods |
| `loader versions` | List the LeviLamina versions available for a game version |
| `loader install [<version>]` | Install LeviLamina on an instance, or change its version |
| `loader remove` | Remove LeviLamina from an instance |
| `world list [<filter>]` | List the worlds for an instance and player |
| `world import <file.mcworld>...` | Import worlds from `.mcworld` files |
| `world export <world>...` | Export (back up) worlds as `.mcworld` files |
| `world copy <world>...` | Copy worlds to another instance |
| `world rename <world> <new-name>` | Change a world's display name |
| `world get <world> [<key>[/<sub>...]]` | Read world settings from `level.dat` |
| `world set <world> <key>[/<sub>...]=<value>...` | Change world settings in `level.dat` |
| `world remove <world>...` | Permanently delete worlds |
| `pack list [<filter>]` | List resource, behavior, and skin packs |
| `pack import <file.mcpack\|file.mcaddon>...` | Install packs and add-ons from `.mcpack` and `.mcaddon` files |
| `pack copy <pack>... \| --all` | Copy packs to another instance |
| `pack remove <pack>...` | Delete installed packs |
| `screenshot list` | List the screenshots for an instance and player, newest first |
| `screenshot remove <name\|path>... \| --all` | Delete screenshots |
| `server list [<filter>]` | List saved servers and check whether they are online |
| `player list` | List the player profiles of a GDK instance |
| `backup list [<instance>]` | List instance and world backups (preview) |
| `backup create [<instance>]` | Back up an instance's game data and mods (preview) |
| `backup restore [<instance>] <archive.zip>` | Restore an instance backup (preview) |

### Find things to install

| Command | What it does |
| --- | --- |
| `installer search [<version>]` | List the Minecraft builds that can be installed |
| `installer download <version>` | Download a build's installer without installing it |
| `installer list` | List downloaded installers, including unfinished downloads |
| `installer remove <version\|file>...` | Delete downloaded installers to free disk space |
| `installer mirrors <version>` | Test the download mirrors of a GDK build |
| `curseforge search [<words>]` | Search CurseForge for worlds, add-ons, packs, and skins (alias for the noun: `cf`) |
| `curseforge show <id>` | Show a CurseForge project |
| `curseforge categories` | List the CurseForge classes and categories you can filter by |
| `curseforge install <id>` | Download a CurseForge file and import it into an instance |

### This PC and the launcher

| Command | What it does |
| --- | --- |
| `process list` | List running Minecraft processes, including those not started by the launcher (alias: `ps`) |
| `process stop [<instance>\|<pid>...]` | Force-close running Minecraft (progress since the last autosave is lost) |
| `account status` | Show the signed-in Microsoft account and which editions it owns |
| `account login` | Sign in to a Microsoft account, or switch accounts |
| `account logout` | Forget the launcher's Microsoft account |
| `config list` | List launcher settings and folders |
| `config get <key>` | Print the value of a setting |
| `config set <key> <value>` | Change a setting |
| `config unset <key>` | Reset a setting to its default |
| `cache clean [packages\|downloads\|partial]...` | Free disk space used by caches |
| `doctor [--fix [<fix>...]]` | Check what Minecraft and mods need on this PC; `--fix` repairs issues (`vcruntime`, `gameinput`, `loader-migration`, `developer-mode`) |
| `self-update` | Update LeviLauncher to the newest release |
| `version` | Print version information |
| `help [<command>...]` | Show help for any command, with examples |

Every `list` verb also accepts `ls`, and every `remove` verb accepts `rm`. The settings that `config` reads and changes are listed in [All Settings](./settings#command-line-keys).

### Versions and packages

- `<version>` for `install` and `installer` is a build from `installer search`: an exact version (`1.21.50.07`), a dotted prefix (`1.21.50` matches the newest `1.21.50.x`; `1.21.5` does not match it), or `latest`. `<file>` is a local `.msixvc`, `.appx`, `.msix`, `.appxbundle`, or `.msixbundle` file.
- `<package>` for `mod install` is `owner/repo`, `github.com/owner/repo`, or a URL, optionally with `#variant` and `@version`.

## Global flags

These flags work with every command:

| Flag | Meaning |
| --- | --- |
| `-i`, `--instance <name>` | The instance to act on |
| `-p`, `--player <id\|gamertag>` | The player profile, on GDK instances |
| `--json` | Print machine-readable output to stdout |
| `-q`, `--quiet` | Print only identifiers; suppress progress and notices |
| `-v`, `--verbose` | Print more detail and send the launcher log to stderr |
| `-y`, `--yes` | Answer yes to confirmations |
| `--no-input` | Never prompt |
| `-h`, `--help` | Show help for a command |
| `--version` | Print the version |

**Which instance:** `-i`, otherwise the `LEVILAUNCHER_INSTANCE` environment variable, otherwise the default instance (`use`), otherwise the only instance. **Which player:** `-p`, otherwise `LEVILAUNCHER_PLAYER`, otherwise the only profile, otherwise the profile of the signed-in account.

## Output

- Results go to stdout. Progress, notices, and errors go to stderr; errors are printed as `error:`, with a `hint:` and an error code such as `[ERR_GAME_RUNNING]`.
- `--json` prints one JSON document: an array for lists and an object otherwise, with camelCase keys, RFC 3339 timestamps, and sizes in bytes.
- `-q` prints identifiers only, one per line.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | OK |
| 1 | Failed |
| 2 | Usage error |
| 3 | Not found |
| 4 | Conflict (for example, the game is running) |
| 5 | Sign-in or licence error |
| 6 | Network error |
| 7 | Partly completed |
| 8 | Needs a system change or administrator rights |
| 9 | Timeout |
| 10 | Cancelled |
| 130 | Interrupted (Ctrl-C) |

`launch --wait-exit` returns the game's own exit code instead.

## Window switches

These arguments open the launcher window instead of running a command:

| Argument | Effect |
| --- | --- |
| `--launch=<instance>` | Open the launcher and start the instance (used by desktop shortcuts). If the launcher is already running, it starts the instance in the existing window. |
| `--debug` | Also show the launcher log in a console window (`debug`, `-debug`, and `/debug` work too). |
