# Installs and clones

To install Be.D.D., see the [Install](/install) page. To set up the first game on a PC, see the tutorial [Drive the game client with Be.D.D.](https://levimc.org/tutorials/automate/bedd/). This page covers what comes after: upgrades, CI, instances, clones, and folders.

## Upgrading

Run the newer installer; it closes any open manager window and its games. Each `launch` then installs the clone's mod if it is missing, or replaces it (keeping `config.json`) if it differs from its source:

- default: `BEDD_MOD_DIR`, otherwise `mod\BeDD` next to `BeDD.exe`, otherwise `bin\BeDD` in the checkout containing the current folder;
- after `mod install <instance> --from <dir>`: that folder (pinned in `mods\BeDD\source.pin`); if it no longer contains a build, `launch` warns and leaves the mod alone. Running `mod install` without `--from` removes the pin.

The mod is not replaced when you pass `launch --keep-mod`, or while a game in that clone is running.

## Uninstalling

Uninstalling **BeDD** from Settings > Apps > Installed apps removes the app, its Start menu entry, and its `PATH` entry. To also remove `%LOCALAPPDATA%\BeDD` (clones, worlds, and logs), run `BeDD.exe instance remove --slot N --yes` for each clone, then delete the folder.

## Let the harness fetch it

`BEDD_DIR` points to an unpacked copy. Pin a version in CI (`releases/download/v0.4.0/...`).

```powershell
curl.exe -L -o "$env:TEMP\bedd.zip" https://github.com/LiteLDev/BeDD/releases/latest/download/bedd-windows-x64.zip
mkdir "$env:LOCALAPPDATA\BeDD\app" -Force; tar.exe -xf "$env:TEMP\bedd.zip" -C "$env:LOCALAPPDATA\BeDD\app"
```

## Which instance

`BeDD.exe` uses the 1.26.60 LeviLamina instance from `LeviLauncher.exe instance list --json` as the **base**. It never writes to or starts this instance.

| Override | |
|---|---|
| `BEDD_LEVILAUNCHER` | the `LeviLauncher.exe` to query (default: on `PATH`, otherwise installed, otherwise the one in `tools`) |
| `BEDD_INSTANCE` / `instance clone --base <name>` | the base instance, when multiple 1.26.60 instances exist (default: LeviLauncher's default instance, otherwise the first matching instance) |

## Clones

Every game runs in a clone named `<gameVersion>-<slot>` (for example, `1.26.60.05-2`, including slot 1) with its own `mods\`, logs, worlds, and options. Game files are hardlinked to the base.

```powershell
BeDD.exe instance list                      # clones and their LeviLauncher bases
BeDD.exe instance list --bases --all        # the LeviLauncher instances, and why one cannot be cloned
BeDD.exe instance show 1.26.60.05-2         # folder, base, game/loader version, mod, running games, status
BeDD.exe instance clone --slot 2            # make or update
BeDD.exe instance refresh 1.26.60.05-2      # re-link after the base changed
BeDD.exe instance path 1.26.60.05-2         # its folder
BeDD.exe instance remove 1.26.60.05-2       # delete (never the base)
```

`launch --slot N` creates the clone if it is missing and refreshes it if the base has changed. Hardlinks require a single volume: if `%LOCALAPPDATA%\LeviLauncher\Instances` and `instances` are on different drives, each clone becomes a full copy (taking gigabytes and minutes). To avoid this, set `BEDD_INSTANCES_DIR` to a path on the base's volume.

## Folders

`%LOCALAPPDATA%\BeDD` (use `BEDD_HOME` to move it):

| | |
|---|---|
| `instances` | clones (`BEDD_INSTANCES_DIR`) |
| `run` | `<pid>.json` per running game or server: URL and token ([Which game](/guide/usage#which-game)) |
| `locks` | slot and signaling locks |
| `servers` | dedicated servers ([client + server](/guide/modes); `BEDD_SERVERS_DIR`) |
| `tools` | downloaded LeviLauncher and lip |
| `logs` | the app's logs (`manager.log`, …) |
