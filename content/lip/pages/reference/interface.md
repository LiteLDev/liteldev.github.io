# Interface

This page is a compact reference for lip's interactive interface: its keys, its pages, the commands behind them, and the rules that apply on every page. To learn the interface step by step, start with [A tour of the interface](../interface/tour.md).

The normative definition is the [lip-tui(1)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-tui.md) page of the protocol.

## Starting

```shell
lip
```

Running `lip` without arguments opens the interface when both standard input and standard output are terminals; otherwise, it prints its help message (see [Command line](cli.md)).

- The interface works on one workspace at a time—the **selected workspace**, which initially defaults to the folder where `lip` was started. When opened from an [install link](links.md) (`lip --uri`), it does not add a folder; instead, it selects the last workspace in the list and asks whether to install the link's package. The top line shows the selected workspace; pressing `Enter` on it opens the [workspace picker](../interface/workspaces.md) to select, add, or remove a workspace.
- The lip [daemon](../concepts/how_lip_works.md) runs the interface. Several interfaces can be open at once.
- The terminal must have at least 60 columns and 16 rows. If it is smaller, lip asks you to enlarge it, and the only key that works is `Ctrl+C`, which quits without asking.
- In a terminal narrower than 80 columns, the sidebar shows one symbol per page while a page has focus.

## Keys

Keys work the same way on every page. The bottom line of the screen lists the keys available for the currently focused element.

| Key | Action |
| --- | --- |
| `↑` `↓` | Moves through a list or menu. In the sidebar, switches to the previous or next page; pressing `↑` on the first page or `↓` on the last page moves focus to the workspace on the top line. |
| `←` `→` | Moves between the sidebar and the page, or between side-by-side panes or buttons; changes an option that has several values. |
| `Enter` | Opens or runs the selected item. On a list row, opens its actions. |
| `Space` | Checks a row in a multi-select list; toggles an option on or off. |
| `Tab`, `Shift+Tab` | Cycles forward or backward through the sidebar and the areas of the page. |
| `Esc` | Goes back one level: from a dialog to the page, from an inner area of a page to the previous one, or from the page to the sidebar. In the sidebar, asks whether to quit. |
| `PgUp` `PgDn` `Home` `End` | Scrolls through a list or text by page. In the sidebar, `Home` and `End` jump to the first and last page. |
| `Ctrl+C` | Stops the server if pressed on the Server page while the server is running. Cancels an in-progress change. Anywhere else, asks whether to quit. |
| Letters and digits | Enter text when a text field has focus. They do nothing anywhere else; there are no letter shortcuts. |

## Pages

| Page | Description | Commands |
| --- | --- | --- |
| [Home](../interface/home.md) | Shows the state of the selected workspace and the next step to take. | |
| [Server](../interface/server.md) | [Sets up the server](../interface/server.md#set-up-the-server) and [changes its game or loader version](../interface/server.md#change-the-game-or-the-loader-version); starts and stops the server, shows its output, and sends it what you type. | [`lip setup`](commands/setup.md), [`lip run --managed --detach`](commands/run.md), [`lip config set restart … --workspace`](commands/config.md) |
| [Mods](../interface/mods.md) | Lists installed mods and their dependencies (excluding the game and loader); installs, updates, and uninstalls them. | [`lip list`](commands/list.md), [`lip install`](commands/install.md), [`lip update`](commands/update.md), [`lip uninstall`](commands/uninstall.md) |
| [Marketplace](../interface/get_mods.md) | Searches for mods on levimc.org and installs a specific version of a mod. | [`lip install`](commands/install.md) |
| [Game Config](../interface/game_config.md) | Edits `server.properties`, `allowlist.json`, and `permissions.json`. | None |
| [Mod Config](../interface/mod_config.md) | Edits the configuration files of installed mods. | None |
| [Develop Tools](../interface/tools.md) | Creates and edits a `lip.toml` in a form that validates it; migrates a `tooth.json`. | [`lip pkg migrate`](commands/pkg_migrate.md); the form does what [`lip pkg init`](commands/pkg_init.md) does, and more |
| [Settings](../interface/settings.md) | Language, GitHub proxy, auto restart, cache, lip updates, the daemon, and the version. | [`lip config`](commands/config.md), [`lip cache clean`](commands/cache_clean.md), [`lip self-update`](commands/self_update.md), [`lip daemon status`](commands/daemon.md), `lip --version` |

Commands run by the interface behave as defined on their respective pages, using the selected workspace as the working directory, with these differences:

- Output is shown in the interface, in English.
- Prompts are shown in a dialog.
- If a command fails, the interface shows why and continues.

## Preview and Apply

Every change to a workspace's packages follows the same process: installing, updating, uninstalling, and setting up the game or loader.

| Step | What happens |
| --- | --- |
| 1. Preview | lip runs the command as a [dry run](cli.md) and shows what it would do. Nothing has changed. |
| 2. **Apply** or **Cancel** | **Apply** proceeds. **Cancel** changes nothing. If the preview finds nothing to change, the only button is **Close**. |
| 3. License | Only when the change installs the game: lip shows the Minecraft EULA and the Microsoft Privacy Policy. **Accept** proceeds; **Decline** changes nothing. |
| 4. Progress | `Esc` or `Ctrl+C` cancels; any changes made so far are undone, and a dialog titled **Cancelled** confirms this. Cancellation is not treated as a failure. |
| 5. Result | The command's output, and **✓ Done.** |

- Applying does not start over: it reuses whatever the preview read and downloaded.
- If a setup preview lists installed mods that have no version for the new game or loader, **Apply** uninstalls them.
- On failure, lip shows the cause, any hints it has, and the path to the failure report under `.lip/logs` in the workspace.

## While the server runs

A workspace's server is considered running while lip runs it, no matter how it was started: from an interface, with `lip run --managed`, or with a plain `lip run` in a terminal. While the server runs, the interface behaves as follows for that workspace:

| What | While its server runs |
| --- | --- |
| Installing, updating, and uninstalling packages ([Mods](../interface/mods.md), [Marketplace](../interface/get_mods.md)) | Disabled. |
| Setting up the server ([Server](../interface/server.md#set-up-the-server)), changing its game or loader ([Server](../interface/server.md#change-the-game-or-the-loader-version)) | Disabled. |
| `server.properties`, `allowlist.json`, `permissions.json` ([Game Config](../interface/game_config.md)) | Shown, but cannot be edited or saved. Unsaved changes are kept until the server stops. |
| Mod configuration files ([Mod Config](../interface/mod_config.md)) | Edited and saved as usual. The page notes that changes may require a restart. |
| Everything else: browsing mods, switching workspaces, [Develop Tools](../interface/tools.md), [Settings](../interface/settings.md) | Works as usual. |

Disabled controls remain on screen, dimmed, with the reason **Stop the server first.**

This applies only to the interface. The commands `lip install`, `lip update`, `lip uninstall`, and `lip setup` are not blocked while the server runs; see [The interface and the commands](../concepts/how_lip_works.md#the-interface-and-the-commands).

Quitting the interface does not stop a server run by the daemon. If lip runs the interface directly because it cannot use the daemon, quitting stops the servers that the interface started.

## Configuration files

| File | Read | Written |
| --- | --- | --- |
| `server.properties` | When the Game Config page opens. | On **Save**: only the values of changed properties, and no other characters. Not created if it does not exist. |
| `allowlist.json`, `permissions.json` | The same. A missing file is read as an empty list. | On **Save**: the whole file, without comments. Created if it does not exist. |
| A mod's `.json` file | When the file is selected on the Mod Config page. | On **Save**: the whole file, without comments, keeping each key in its original position. Not created if it no longer exists. |
| Any other mod file | The same. | Never. |

- A file that lip cannot read is still shown, and is never written.
- A file modified on disk since lip read it is overwritten only if you confirm.
- Leaving a page with unsaved changes prompts you to save them.
- Saved changes take effect the next time the server starts.

A mod's configuration files are those in `mods/<mod>/config/`; if there are none, they are the `.json`, `.ini`, `.toml`, `.yml`, and `.yaml` files directly in `mods/<mod>/` (except `manifest.json`), along with `mods/<mod>/data/config.json`.

## Languages

| Value of `language` | Interface |
| --- | --- |
| `en` | English |
| `zh-Hans` | Simplified Chinese |
| `zh-Hant` | Traditional Chinese |
| not set | The system language: English, or Chinese according to the system locale. |

You can choose the language on the [Settings](../interface/settings.md#language) page or with [`lip config`](commands/config.md); see [Configuration](configuration.md). The change takes effect immediately. Command output is in English regardless of the language setting.

## GitHub check

When the interface starts and `github_proxy` is not set, lip checks once in the background whether it can reach GitHub, waiting up to 10 seconds. If it cannot, the interface asks how to connect:

| Answer | Does |
| --- | --- |
| A proxy | Prompts for the proxy URL, tests it, and sets `github_proxy` to it. |
| Connect directly | Sets `github_proxy` to an empty value: lip neither checks nor asks again. |
| Later | Changes nothing; lip checks again the next time the interface starts. |

See [Settings](../interface/settings.md#github-proxy).

## Exit status

`lip` exits with code 0 when you quit the interface, regardless of the outcome of commands run within it or the exit codes of any servers.

## Files

| File | The interface |
| --- | --- |
| `workspaces.json` in the state directory | Reads and writes the list of workspaces. |
| `config.toml` in the config directory | Reads `language` and `github_proxy`; writes them from the Settings page and from the GitHub check. |
| `.lip/config.toml` in a workspace | Reads and writes `restart` (Auto restart). |
| `server.properties`, `allowlist.json`, `permissions.json` in a workspace | Reads them; writes them on **Save**. |
| Mod configuration files under `mods/` | Reads them; writes the `.json` files on **Save**. |
| `lip.toml` in a workspace | Reads it on the Develop Tools page; writes it when you save the form and confirm. |
| `.lip/logs/` in a workspace | Writes a failure report when a command fails. |
| `https://levimc.org/api/v4/mods/` | Reads the mod catalogue for the Marketplace page and for the dependencies in the `lip.toml` form. None of it is written to disk, and `github_proxy` is not used for it. |

The commands that the interface runs read and write the files described on their respective pages. [Files](files.md) lists all files and directories used by lip.

## See also

- [A tour of the interface](../interface/tour.md)
- [Your first server](https://levimc.org/tutorials/server/first-server/)
- [Command line](cli.md)
- [Install links](links.md)
- [Configuration](configuration.md)
