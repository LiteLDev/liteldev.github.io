# Files

This page lists every file and directory that lip reads or writes, so you know what you can safely delete, back up, or edit, and what you lose when you do.

lip writes to only three places: the workspace it operates on, its per-user directories, and its installation directory when it updates itself. It never writes to the system temporary directory. The programs it runs (the server, hook commands, installers, and Wine) write wherever they like.

## The workspace

A **workspace** is the directory for a single server. It is either the current directory of a command or the workspace selected in the interface.

| Path | Is | Written by |
| --- | --- | --- |
| `.lip/` | lip's records for the workspace. See [The .lip directory](#the-lip-directory). | lip |
| `mods/` | The directory from which LeviLamina loads mods. Each mod is in `mods/<mod name>/`. | lip, and the mods themselves |
| `bedrock_server_mod.exe`, `bedrock_server.exe`, `bedrock_server` | The server executable that [`lip run`](commands/run.md) starts. See [The server files](#the-server-files). | lip |
| Everything else | Files from the game and file packages, plus files created by the running server, such as `worlds/`. | lip and the server |
| `lip.toml`, `tooth.json` | In the directory of a package you are developing: its [package file](../concepts/lip_toml.md), and the package file from lip v0.x. | [`lip pkg init`](commands/pkg_init.md), [`lip pkg migrate`](commands/pkg_migrate.md) (which deletes `tooth.json`), and the [Develop Tools](../interface/tools.md) page |
| `tooth_lock.json` | The workspace state from lip v0.x. See [State file](../concepts/state_file.md#workspaces-of-lip-v0-x). | lip v0.x |

lip creates `mods/` before an operation modifies the workspace. `mods` must be a real directory; if it is a link, the operation fails.

A workspace is completely self-contained. While no lip command or server is using it, you can move, rename, or copy the directory, and it will keep its installed packages.

### The .lip directory

On Windows, `.lip` has the hidden attribute.

| Entry | Is | If you delete it |
| --- | --- | --- |
| `state.json` | The [state file](../concepts/state_file.md), which tracks installed packages and the files each one owns. | lip no longer knows what is installed. The files remain, but lip cannot uninstall or update them. Do not delete it. |
| `state.json.tmp` | The state file while it is being written. | Do not touch it while a command is running. |
| `journal` | The record of an in-progress operation, which lip uses to complete or undo an interrupted operation. It exists only during an operation, or after one is interrupted. | lip can no longer undo the interrupted operation. Do not delete it; run `install`, `uninstall`, `update`, `setup`, or `run` to recover. |
| `lock` | The **workspace lock** file. A process holds this lock during an operation so that two operations never modify the workspace at the same time. Its contents are meaningless. | Harmless when no command is running. Never delete, rename, or replace it while a command is running. |
| `server.lock` | The **server lock** file. The process running the server holds this lock so that a workspace has at most one running server. | Harmless when no server is running. Never delete, rename, or replace it while a server is running. |
| `config.toml` | The [workspace configuration](configuration.md#workspace-configuration). | `restart` resets to `never`. |
| `logs/` | The [failure reports](#failure-reports). | You lose the reports. Safe to delete at any time. |
| `wine/` | On Linux and macOS: the Wine prefix in which the Windows server and hook commands run. | Wine recreates it. Stop the server first. |

lip may store other entries in `.lip`. Do not rely on them.

`.lip` is reserved: a package cannot install files into it, and a `purge` glob never matches it.

The two locks are independent. An operation does not acquire the server lock, and a running server does not hold the workspace lock, so `lip install` works while `lip run` is running. The interface is stricter and requires you to stop the server first.

### The server files

The game is the package `github.com/LiteLDev/bds`. Installing it extracts the entire Bedrock Dedicated Server archive, downloaded from `www.minecraft.net`, to the workspace root.

| The workspace has | Server file |
| --- | --- |
| A loader (LeviLamina) | `bedrock_server_mod.exe` |
| No loader, and the build `windows` | `bedrock_server.exe` |
| No loader, and the build `linux` | `bedrock_server` |

On Linux and macOS, lip sets the mode of `bedrock_server` to `0755` when writing it.

When the game is installed, replaced, or uninstalled, two lists govern what happens to its files:

| List | Paths | Effect |
| --- | --- | --- |
| Preserved | `server.properties`, `allowlist.json`, `permissions.json` | Existing files are kept during installation and are not deleted during uninstallation. |
| Purged | `bedrock_server.exe.bak` (build `windows` only), `packet-statistics.txt`, `valid_known_packs.json`, `behavior_packs/`, `config/`, `definitions/`, `development_behavior_packs/`, `development_resource_packs/`, `development_skin_packs/`, `resource_packs/`, `world_templates/` | Deleted during uninstallation along with all their contents, including files not installed by the game. Paths owned by another installed package are kept. |

### What survives a game change

Changing the game version with [`lip setup`](commands/setup.md) uninstalls the old game and installs the new one:

| Kept | Replaced or deleted |
| --- | --- |
| `server.properties`, `allowlist.json`, `permissions.json` | All other files installed by the old game |
| `worlds/` and any other files created by you or the server outside the purged paths | The purged paths above, including anything you placed in them |
| `mods/` and the files of packages that remain installed | The files of packages uninstalled by the setup |
| `.lip/` | |

::: warning
Packs that you copied into `behavior_packs/`, `resource_packs/`, or a `development_*` directory are deleted along with those directories. Back them up outside the workspace before changing the game.
:::

### File names

lip refuses to write a file to a workspace if any segment of its path contains `:` or ends with `.` or a space, because Windows does not allow such names. The operation fails.

On Linux and macOS, lip treats workspace paths as case-insensitive, just as Wine does: `Mods/a.dll` and `mods/A.DLL` refer to the same file. Writing a file overwrites an existing file whose name differs only in case. If a path matches more than one existing file in this way, the operation fails.

## Per-user directories

| Directory | Windows | Linux and macOS | Default on Linux and macOS |
| --- | --- | --- | --- |
| Config | `%APPDATA%\lip` | `$XDG_CONFIG_HOME/lip` | `~/.config/lip` |
| Cache | `%LOCALAPPDATA%\lip\Cache` | `$XDG_CACHE_HOME/lip` | `~/.cache/lip` |
| Data | `%LOCALAPPDATA%\lip\Data` | `$XDG_DATA_HOME/lip` | `~/.local/share/lip` |
| State | `%LOCALAPPDATA%\lip\State` | `$XDG_STATE_HOME/lip` | `~/.local/state/lip` |

If an `XDG_*` variable is unset, empty, or not an absolute path, lip uses its default.

### Config directory

| Entry | Is |
| --- | --- |
| `config.toml` | The [user configuration](configuration.md#user-configuration). |
| `liprc.json` | The configuration from lip v0.x. lip [converts it](configuration.md#liprc-json) to `config.toml` and deletes it. |

Deleting the config directory resets `github_proxy` and `language`.

### Cache directory

The cache stores files that lip has downloaded and can download again. [`lip cache clean`](commands/cache_clean.md) deletes the entire directory.

| Entry | Is |
| --- | --- |
| `http-<H>` | A file containing the response body of a successful HTTPS GET for a single URL. `<H>` is the lowercase hexadecimal SHA-256 of the URL (excluding its fragment) as written by the package, regardless of any proxy used. |
| `<name>.tmp` | A file currently being written. |
| `self-update/` | Files downloaded and extracted by [`lip self-update`](commands/self_update.md), present only while it runs. |

lip may store other entries here. Do not rely on them.

Other programs may read and write the cache if they follow the same rules:

- **Writing.** Write an entry to a `.tmp` file with a name not used by any other process, then rename it. Never modify an entry in place.
- **Reading.** Any existing entry is complete. A reader that knows what an `http-<H>` entry must contain checks it and may delete it if it does not match.
- **Deleting.** An `http-<H>` entry may be deleted at any time; a `.tmp` file when no process is writing to it; `self-update` when `lip self-update` is not running.

If lip needs a ZIP archive and the cached entry for its URL is not a valid ZIP archive, lip deletes the entry and downloads the URL again, once.

Deleting the cache causes no data loss: lip simply re-downloads what it needs. However, if you delete the cache while a lip command is writing to it, that command may fail.

### Data directory

The data directory holds the Wine installation that lip installs on Linux and macOS, the Visual C++ runtime that lip installs for you in `vc-runtime\` on Windows (both shared across every workspace), and the files lip downloads to install the [system dependencies](../concepts/internals.md#system-dependencies).

Deleting it while no lip process is running loses nothing: lip reinstalls the system dependencies when it needs them. On Linux and macOS, that means downloading Wine again; on Windows, it means downloading the Visual C++ runtime again, unless it is installed system-wide.

### State directory

| Entry | Is |
| --- | --- |
| `workspaces.json` | The interface's [workspace list](#workspaces-json). |
| `daemon.sock` and other daemon files | On Linux and macOS, only when `XDG_RUNTIME_DIR` is not set to an absolute path. See [The daemon endpoint](#the-daemon-endpoint). |

Deleting it while no lip process is running loses only the workspace list. The workspaces themselves are untouched; add them again in the interface.

### workspaces.json

The list of workspaces shown in the interface's [workspace picker](../interface/workspaces.md) (opened from the top line): a JSON array of absolute paths, in the order they were added.

```json
["D:\\servers\\survival", "D:\\servers\\creative"]
```

- A list that is missing or not a JSON array is read as empty.
- Any element that is not an absolute path, or that names a directory already in the list, is omitted.
- lip writes each path in its canonical form: `.` and `..` resolved, `\` as the separator on Windows, and no trailing separator unless the path is a root. Two paths refer to the same directory when their canonical forms are equal, ignoring case on Windows.

The interface adds its working directory to the list when it starts. Removing a workspace from the list does not change any files in it. Commands do not use the list.

## The daemon endpoint

The [daemon](commands/daemon.md) listens on an endpoint that only your user can reach:

| System | Endpoint |
| --- | --- |
| Windows | The named pipe `\\.\pipe\lip-<SID>`, where `<SID>` is your user's security identifier. |
| Linux and macOS | The Unix socket `daemon.sock` in the **daemon directory**: `$XDG_RUNTIME_DIR/lip` when `XDG_RUNTIME_DIR` is an absolute path, or the state directory otherwise. |

The daemon directory has mode `0700` and the socket has mode `0600`. The daemon deletes `daemon.sock` when it exits. The directory also holds other daemon files; do not rely on them.

## The installation directory

The installation directory is the directory that contains the `lip` executable.

| Entry | Is |
| --- | --- |
| `install.json` | `{"kind": "msi", "scope": "user"}` when lip is installed for one user, or `{"kind": "msi", "scope": "machine"}` when it is installed for all users; earlier installers wrote `{"kind": "msi"}`, which counts as `machine`. The Windows installer writes this file to tell [`lip self-update`](commands/self_update.md) to update using the installer. Without it, lip is treated as portable. lip itself never writes this file. |
| `<file>.old` | A file that a portable update replaced and could not delete yet. lip deletes `<executable>.old` the next time it starts. |

## Failure reports

When a command fails for any reason other than a usage error, it may write a **failure report** to `.lip/logs/` in its workspace and print the file name in a message:

```
Full report: .lip\logs\20260115T093012Z-4812.log
```

The file name consists of the UTC time and a process ID. In the current version, a report is a text file containing the command line, the lip and system versions, the directories lip uses, the error along with its hints and causes, the entries in `.lip`, and a trace of what lip did. User names, passwords, and query values in URLs are replaced with `***`. lip keeps the 20 newest reports and deletes older ones.

Attach the report when you ask for help. Its layout is not fixed and may change.

A failed [dry run](cli.md#dry-run) may also write a report; it is the only file a dry run ever writes.

## See also

- [How lip works](../concepts/how_lip_works.md): operations, the journal, and locks explained.
- [State file](../concepts/state_file.md)
- [Troubleshooting](../guides/troubleshooting.md)
- [Workspaces](../interface/workspaces.md): the interface's workspace picker.
