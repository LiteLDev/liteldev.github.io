# Linux and macOS

This page explains which servers lip can run on your system, how to install lip, what it downloads to run them and where it puts those files, and what limits to expect. The commands are the same on every system: see [A server from the command line](https://levimc.org/tutorials/server/command-line/).

## What works where

Minecraft publishes two servers: one for Windows and one for Linux. LeviLamina, the loader that mods need, loads only into the Windows server. That means a modded server is always the Windows server, and lip runs it through [Wine](https://www.winehq.org/) on non-Windows systems.

| System | Windows server, with or without LeviLamina | Linux server, without a loader |
| --- | --- | --- |
| Windows on x64 | Yes | No |
| Windows on arm64 | Yes. Windows emulates x64. | No |
| Linux on x64 | Yes, through lip's Wine | Yes |
| macOS on x64 | Yes, through lip's Wine | No |
| macOS on arm64 (Apple silicon) | Yes, through lip's Wine and Rosetta 2 | No |
| Linux on arm64, and any other system | No | No |

lip is released for the first five. There is no lip build for Linux on arm64: see [Limits and rough edges](#limits-and-rough-edges).

Regardless of the system it runs on, lip always installs the same packages—those built for Windows on x64. You can move a server folder set up on one system to another.

## Install lip

On macOS and on Linux on x64, install lip with the install script: `curl -fsSL https://levimc.org/lip/install.sh | sh`. See the [Install](../install.md) page for what the script does, the variables that configure it, and how to install manually from the archive.

## The Windows server through Wine

Set up and run the server the same way you would on Windows:

```sh
mkdir -p ~/servers/survival
cd ~/servers/survival
lip setup --game 1.26.50
lip run
```

You do not need to install Wine. lip brings its own and never uses any other installation, such as a `wine` binary on your `PATH`.

### What lip downloads, and where

The first time lip needs to run a Windows program, it prepares your system. This happens when `lip setup` sets up a Windows server, when a package runs its own program during installation, and before `lip run` starts a Windows server.

| What | Where it goes | Shared |
| --- | --- | --- |
| **Wine**: a build for your system, from [Kron4ek/Wine-Builds](https://github.com/Kron4ek/Wine-Builds) on Linux and [Gcenx/macOS_Wine_builds](https://github.com/Gcenx/macOS_Wine_builds) on macOS | `wine/` in lip's data directory: `$XDG_DATA_HOME/lip` (by default `~/.local/share/lip`) on Linux and on macOS | By every workspace. Downloaded once. |

The server also needs the Microsoft Visual C++ runtime. Because Wine includes its own, lip does not need to install anything else.

lip tells you when it installs Wine:

```text
lip runs the server with Wine <version>, which it installs once for every workspace, into <directory>.
```

lip verifies the download. Each version of lip knows the exact SHA-256 hash of the file it expects. If the download does not match, lip deletes it without using it, and the command fails before changing the workspace. Once extracted, the downloaded archive is deleted.

This does not require root access.

To free up space, delete the data directory when lip is not running. Nothing is lost: lip will reinstall Wine the next time it needs it.

### The Wine prefix

Wine keeps its simulated "Windows" environment—a registry and a `C:` drive—in a folder called the prefix. lip gives each workspace its own prefix at `.lip/wine` inside the server folder. Wine creates this folder the first time it runs there, which makes that first run slower.

The prefix moves with the server folder. It is safe to delete `.lip/wine` while the server is stopped; Wine will recreate it.

To use a different prefix, set `WINEPREFIX` yourself for every lip command you run in that workspace:

```sh
export WINEPREFIX="$HOME/.wine-bedrock"
lip setup --game 1.26.50
lip run
```

### macOS on Apple silicon

lip's bundled Wine is an x64 program, which a Mac with Apple silicon runs through Rosetta 2. If Rosetta 2 is missing, lip installs it while preparing the system, before running Wine for the first time. Because installing Rosetta 2 accepts Apple's software license agreement for it, lip asks first:

- In a terminal, lip explains that installing Rosetta 2 accepts the license and asks whether to proceed. The interface asks the same question in a dialog.
- With `--accept-rosetta-license`, lip does not ask: passing the option accepts the license. `lip setup`, `lip install`, `lip update`, `lip uninstall`, and `lip run` accept this option for scripts and non-interactive terminals:

  ```sh
  lip setup --game 1.26.50 --accept-eula --accept-rosetta-license
  ```

- If lip cannot ask (because its input or error output is not a terminal) and you do not pass the option, the command fails. A [managed server](../reference/commands/run.md#managed-servers) started by `lip run --managed` without the option also fails, since it never prompts; a server started in the interface prompts there instead.

lip installs Rosetta 2 by running `softwareupdate --install-rosetta --agree-to-license` as the current user. If that fails, or if you answer no, the lip command fails and prints that command so you can run it yourself. Recent versions of macOS install Rosetta 2 without an administrator; some versions require one. Then run the lip command again.

## The Linux server

On Linux on x64, lip can also run the Minecraft Linux server. It needs neither Wine nor anything else from your system. Because it has no loader, you cannot install mods that require LeviLamina alongside it.

```sh
lip setup --game 1.26.50 --build linux
lip run
```

- `lip setup` places the server files and makes `bedrock_server` executable.
- `lip run` starts `bedrock_server` in the workspace. When `LD_LIBRARY_PATH` is unset or empty, lip sets it to `.` so the server can find the libraries beside it.
- On any system other than Linux on x64, `lip run` fails for a workspace set up this way and tells you to either run it there or set up the Windows server.

A workspace holds one game. Setting up the Linux server in a folder that has the Windows server replaces it, and vice versa. See [`lip setup`](../reference/commands/setup.md).

## Environment variables

lip reads these variables from the terminal you run it in.

| Variable | What lip does with it |
| --- | --- |
| `WINEPREFIX` | The Wine prefix. When unset or empty, lip uses `.lip/wine` in the workspace. |
| `WINEDEBUG` | Passed to Wine. When unset, lip sets it to `-all` to hide Wine's debug messages. Set it (for example, to `err+all`) to see them. |
| `WINEDLLOVERRIDES` | Passed to Wine. When unset, lip sets it to `mscoree,mshtml=;winemac.drv,winex11.drv=d`, which disables Wine Mono, Wine Gecko, and Wine's graphics drivers so the server can run without a desktop, such as over SSH. |
| `LD_LIBRARY_PATH` | For the Linux server. When unset or empty, lip sets it to `.`. |
| `XDG_CONFIG_HOME` | Where user settings are stored: `$XDG_CONFIG_HOME/lip`. Default: `~/.config`. |
| `XDG_CACHE_HOME` | Where downloads are cached: `$XDG_CACHE_HOME/lip`. Default: `~/.cache`. |
| `XDG_DATA_HOME` | Where Wine is installed: `$XDG_DATA_HOME/lip`. Default: `~/.local/share`. |
| `XDG_STATE_HOME` | Where the interface's workspace list is stored: `$XDG_STATE_HOME/lip`. Default: `~/.local/state`. |
| `XDG_RUNTIME_DIR` | Where the daemon socket is located: `$XDG_RUNTIME_DIR/lip/daemon.sock`. When unset, the socket is placed in the state directory. |
| `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, `NO_PROXY` | Your network proxy. See [Your system's proxy](configuration.md#your-system-s-proxy). |
| `LC_ALL`, `LC_MESSAGES`, `LANG` | The interface language, unless the `language` setting specifies one. |

Any `XDG_` variable that is unset, empty, or not an absolute path falls back to its default. macOS uses the same directories as Linux.

All other variables are passed unchanged to the server and to package programs.

::: info
lip does its work in a background process called the daemon. This does not affect which variables apply: each command uses the variables from the terminal where it was typed. A [managed server](../reference/commands/run.md#managed-servers) keeps the variables of the terminal that started it.
:::

## Limits and rough edges

- **No Linux on arm64.** Nothing we tried runs a LeviLamina server there reliably: [Hangover](https://github.com/AndreRH/hangover) runs the plain server, but not the one modified by LeviLamina; Wine for x64 under [box64](https://github.com/ptitSeb/box64) loses the exit codes of Windows programs; and Wine for x64 under [FEX](https://fex-emu.com/) started a LeviLamina server in only some attempts.
- **No Wine for other systems.** On a system where lip does not provide Wine, anything that requires a Windows program fails with `lip runs the server with Wine on systems other than Windows, but has no Wine for <system>. Run the server on Windows, on Linux on x64 or on macOS.`
- **The first start is slow.** lip downloads and unpacks Wine, then creates the prefix. Subsequent starts skip both.
- **File names ignore case.** In a Windows server workspace, lip treats `Plugins/a.dll` and `plugins/a.dll` as the same file, just as programs running under Wine do. If the folder has two names that differ only in case where lip needs one, the command fails. Rename one of them.
- **Quotes in the commands of packages.** Wine passes a `"` to the Windows command line as `\"`. A package whose install commands contain `"` may not work under Wine. Report the issue to the package author.
- **Exit codes are those of Wine.** `lip run` exits with the same code as `wine`, or 128 plus the number of the signal that terminated it.
- **A proxy that changes downloads breaks the check.** When the SHA-256 of Wine does not match the expected hash, lip rejects the file. Try again later or on another network.
- **A broken Wine.** When `wine` itself cannot run, delete `wine/` in the data directory so lip reinstalls it.
- **Folders of older versions of lip.** A workspace created by an earlier version of lip for the `linux-x64` platform still works when it holds nothing but the server: lip treats it as the Linux server. If it contains other packages, lip stops and reports that it installs packages for `win-x64` only. Set up a new folder.

For the reasons behind these limitations, see [Internals](../concepts/internals.md#system-dependencies).
