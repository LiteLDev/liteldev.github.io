# Command line

Running `BeDD.exe` without arguments (for example, by double-clicking it) opens the [manager window](/guide/several-games#the-manager-window). With arguments, it runs as a CLI: `BeDD.exe <noun> <verb> [arguments] [flags]`. Run `BeDD.exe help`, `help <noun>`, or `<command> --help` to view this reference offline.

## Conventions

| | |
|---|---|
| Flags | anywhere after the command words: `--name value`, `--name=value`, `-n value`; switches `--name` / `--no-name`; `--` ends the flags |
| Names | exact, case-insensitive, never a prefix |
| Durations | `launch` `--timeout`, `--lock-timeout`: a number with `ms`, `s` (default), `m`/`min`, or `h`, e.g. `90s`, `3m`, `2h`; 30 days at most |
| stdout | the result only |
| stderr | progress (silenced by `-q` and `--json`), warnings, `-v` detail |
| Errors | `error: <message>`, then `hint: <command>`; with `--json`, also prints `{"error":{code,message,exit,hint}}` on stdout (`code` e.g. `ERR_USAGE`) |

Global flags, available on every command:

| Flag | |
|---|---|
| `--json` | outputs the result as a single JSON document: an array for lists, an object otherwise; camelCase keys, RFC 3339 times, sizes in bytes |
| `-q`, `--quiet` | outputs identifiers only, one per line; no progress |
| `-v`, `--verbose` | prints details of what happens to stderr |
| `-h`, `--help` | shows help for the command |

Exit codes: `0` ok, `1` failure, `2` usage, `4` not found, `5` conflict (e.g. slot in use), `10` declined.

## Games

### launch

`BeDD.exe launch [<instance>]` (alias `play`): starts a game from an instance in the background and prints its endpoint.
If needed, this clones the instance and installs or updates its mod ([Upgrading](/guide/installs#upgrading)). It also opens the
manager window and holds the signaling lock for the lifetime of the game ([rules](/guide/several-games#rules-for-parallel-runs)).
Guide: [Starting a game](/guide/usage#starting-a-game).

| Flag | Default | |
|---|---|---|
| `--slot <n>` | `1` | uses the base instance clone for this slot when no instance is named |
| `--dir <folder>` | | starts the instance in this folder instead (any folder containing `Minecraft.Windows.exe`) |
| `--label <text>` | `BEDD_LABEL`, else the calling repository | the game's name in the manager window |
| `--exclusive-signaling` | | claims the PC for itself: waits for all other games to close and keeps new ones waiting |
| `--no-manager` | | does not start the manager window |
| `--keep-mod` | | keeps the clone's BeDD mod, even when it differs from this `BeDD.exe`'s |
| `--detach` | | returns once the process is created; `url` and `token` are `null` |
| `--timeout <duration>` | `3m` | how long to wait for the endpoint |
| `--lock-timeout <duration>` | `2h` | how long to wait for the signaling lock |

```powershell
BeDD.exe launch --slot 3 --json
BeDD.exe launch --dir D:\games\mc-test --label smoke --detach -q
```

### process list

`BeDD.exe process list` (aliases `ps`, `process ls`): lists the running games and servers whose mod has announced its WebSocket
endpoint (`run\<pid>.json`). `--json` prints each endpoint with its token, which is how a test finds what to connect to
([Which game](/guide/usage#which-game)).

| Flag | |
|---|---|
| `--all` | also includes games under the instances folder without an endpoint (still loading, or an older mod) |

### process stop

`BeDD.exe process stop [<instance>]` (alias `stop`): kills the games of an instance (a folder name under the instances
folder, or its path). Minecraft processes outside the instances folder are never touched unless `--pid` names one
that announced a BeDD endpoint.

| Flag | |
|---|---|
| `--pid <pid>` | stops this game |
| `--all` | stops every game of BeDD's instances |
| `-y`, `--yes` | does not ask before stopping every game |

```powershell
BeDD.exe stop --pid 12345
BeDD.exe stop --all --yes
```

## Instances

Clones and folders: [Installs and clones](/guide/installs#clones). Any command that takes `[<name>]` also accepts
`--slot <n>` (the clone for that slot).

| Command | |
|---|---|
| `instance list` (`ls`) | lists BeDD's game instances (clones under `%LOCALAPPDATA%\BeDD\instances`) and what each still lacks. `--bases`: lists the LeviLauncher instances a clone can be made from; `--bases --all`: also includes those that cannot be cloned, and why |
| `instance show [<name>]` | shows an instance and what it still lacks |
| `instance clone` | creates `<gameVersion>-<slot>` from a LeviLauncher instance (hardlinks game files, links assets through junctions, and copies game data and LeviLamina; the LeviLauncher instance is only read), or refreshes an existing clone. `--slot <n>` (`1`); `--base <name>` (else `BEDD_INSTANCE`, else LeviLauncher's default instance, else the first that fits); `-f`, `--force`: removes the clone and makes it again, including its game data |
| `instance refresh [<name>]` | brings clones up to date with their LeviLauncher instance. `--all`: refreshes every instance (skipping those with a running game) |
| `instance remove [<name>]` (`rm`) | deletes an instance while leaving the LeviLauncher instance untouched. `-y`, `--yes`: does not ask |
| `instance path <name> [dir\|mods\|logs\|data\|worlds]` | prints a folder of an instance: `dir` (the instance), `mods`, `logs`, `data` (its game data, `Minecraft Bedrock`), or `worlds` (`minecraftWorlds` of its first player) |

## The mod

Keys and values: [Configuration](/guide/configuration#keys).

| Command | |
|---|---|
| `mod install <instance>` | copy `BeDD.dll` and `manifest.json` into `<instance>\mods\BeDD`, write its `config\config.json` with only the specified settings, and switch LeviLamina to its built-in crash logger. Replaces any earlier installation, including its config. `--from <dir>`: the build to install, pinned for later `launch`es until the next install without `--from` (otherwise `BEDD_MOD_DIR`, or `mod\BeDD` next to `BeDD.exe`, or `bin\BeDD` of the checkout containing the current folder) |
| `mod uninstall <instance>` | remove the mod from an instance |
| `mod config <instance>` | print `mods\BeDD\config\config.json` after applying `--set`, `--unset`, and `--world-mode`; the game reads it on startup. `--unset <key>` (repeatable): reset to the mod's default |

`mod install` and `mod config` both accept:

| Flag | |
|---|---|
| `--set <key=value>` | a config setting, repeatable; parsed as JSON if valid, otherwise as text |
| `--world-mode <mode>` | `ClientOnly`, `ClientServer`, or `Remote` (config `mode`; [Where the world runs](/guide/modes)) |
| `--server-host <host>` | with `--world-mode Remote`: the server the game joins; `*`: any server named by `join` |

## Worlds

`BeDD.exe world singleplayer <instance> [<world folder>]`: clear the multiplayer and broadcast settings in `level.dat` (and `level.dat_old`) of a world so that games sharing one sign-in do not kick each other out ("Blaze"). Without a world folder: every world in the instance. Run this while the world is closed.

| Flag | Default | |
|---|---|---|
| `--recent` | | only worlds whose `level.dat` was modified recently (such as a newly restored test world) |
| `--minutes <n>` | `15` | the time window for `--recent` |

## Servers

Dedicated servers for [client + server mode](/guide/modes#client-server), stored in the servers folder.

| Command | |
|---|---|
| `server init <name>` | set up a server: BDS and LeviLamina via lip, BeDD's server mod, and `server.properties`. Fast when nothing is missing; run it again to update the mod or change settings. `--port <N>`: IPv4 port, with IPv6 at N+1 (default: the server's existing port, or the first free pair starting at 19140); `--from <dir>`: the server mod (otherwise `BEDD_SERVER_MOD_DIR`, `mod\BeDD-server` next to `BeDD.exe`, or the nearest `bin\BeDD-server`); `--set <key=value>`: a `server.properties` key, repeatable ([Setting up a server](/guide/modes#setting-up-a-server)) |
| `server start <name>` | start the server without a window (logging its console to `logs\console.log`), wait until it is up and BeDD announces its endpoint, and print `name`, `pid`, `port`, `portV6`, `url`, and `token`. If the server is already running, prints its current state. `--detach`: do not wait for the endpoint (`url` and `token` may be `null`); `--timeout <seconds>` (`180`); `--allow-firewall-prompt`: start a server without BeDD's loopback binding |
| `server stop <name>` | stop a server (saving its world). `--all`: every server; `--timeout <seconds>` (`30`): kill it after this timeout |
| `server list` (`ls`) | list the servers, their ports, and whether they are running |
| `server remove <name>` (`rm`) | delete a stopped server's folder, including its world. `-y`, `--yes`: do not prompt (required when running without a console) |
| `server path <name>` | print a server's folder path |

## The manager window

| Command | |
|---|---|
| `manager status` | whether the manager window is running, and its process ID; exits with code `0` either way |
| `manager stop` | close the manager window and every game it shows (each receives `{op:"close"}` and is killed after 10 s), then wait for it to exit. `-y`, `--yes`: do not prompt; `--timeout <seconds>` (`60`) |

## Other commands

| Command | |
|---|---|
| `version` | version information |
| `dev` | the mod developer's loop: clone the base for `--slot` (`9`), install the mod built in `--from` (default `bin\BeDD` of the checkout), launch it (`--label`, default `dev`), and keep running, logging every change to the foreground window and cursor clip to `--watch-log` (default `tools\out\desktop-watch.log` of the checkout; a line ending in `MINECRAFT HAS THE FOREGROUND` means a game took focus). Pressing Ctrl+C or creating `<log dir>\dev.stop` closes the game (unless `--keep` is set) and exits; creating `<log dir>\dev.restart` closes it, reinstalls the mod, and launches it again. `--watch-only`: only watch the desktop |
