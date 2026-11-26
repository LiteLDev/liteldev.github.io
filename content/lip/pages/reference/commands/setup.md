# lip setup

Choose the game and loader for the workspace.

## Synopsis

```
lip setup --game <VERSION> [--build <BUILD>] [--loader <LOADER> | --no-loader] [--accept-eula] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## Description

`lip setup` sets the workspace server to game `<VERSION>` of build `<BUILD>`, with loader `<LOADER>` or without a loader, and keeps the other workspace packages that are compatible with them. Run it in an empty directory to create a server, and run it again whenever you want to switch to another game version or loader.

### Terms

- The **game** is the installed `github.com/LiteLDev/bds` package, the Minecraft Bedrock Dedicated Server. A workspace has at most one. A workspace without one **has no game**.
- The **build** of the game is `windows` or `linux`: the Windows server or the Linux server.
- The **loader** is the installed `github.com/LiteLDev/LeviLamina` package. A workspace without one **has no loader**.
- A LeviLamina version **fits** a game version when its dependency on `github.com/LiteLDev/bds` accepts that version.

### What it does

In order:

1. It determines the game, build, and loader from the options. See [The loader](#the-loader).
2. It fails before changing anything if:
   - the build is `linux` and a loader is requested, since LeviLamina loads only into the Windows server;
   - the game version has no build of that kind (see [Game versions and builds](#game-versions-and-builds));
   - the loader version does not exist or does not fit the game version.
3. It plans the packages. It requests the game from `github.com/LiteLDev/bds@<VERSION>`, or `github.com/LiteLDev/bds#linux@<VERSION>` for the `linux` build, and the loader from `github.com/LiteLDev/LeviLamina@<version>`. It requests every other explicitly installed package again from the source it was installed from.
   - A package keeps its current version if it still works; otherwise, its version may change.
   - Any previous game and loader in the workspace are uninstalled, unless they match the ones requested.
   - Dependencies that are no longer needed by any explicitly installed package are uninstalled.
4. It asks about [left-out packages](#left-out-packages), if there are any.
5. It asks you to accept [the license](#the-license), if it installs a game.
6. For the `windows` build, it installs any missing system requirements for the Windows server: Wine on Linux and macOS, and the Microsoft Visual C++ runtime, which lip installs for you on Windows without administrator privileges. See [System dependencies](../../concepts/internals.md#system-dependencies) and [Linux and macOS](../../guides/linux_macos.md).
7. It installs the packages as a single [workspace operation](../cli.md#workspace-operations).

If the workspace already has the requested game and loader with the same builds and versions, `lip setup` neither installs nor uninstalls them.

The game and loader are installed explicitly and pinned to their versions. [`lip install`](install.md) and [`lip update`](update.md) never change them afterwards; run `lip setup` again to change them. [`lip uninstall`](uninstall.md) removes them like any other package.

### The loader

| Options | Loader |
| --- | --- |
| neither `--loader` nor `--no-loader`, build `windows` | The same as `--loader levilamina`. |
| neither `--loader` nor `--no-loader`, build `linux` | No loader. |
| `--loader levilamina` | The newest LeviLamina that fits the game version. If none fits, the command fails before changing anything. |
| `--loader levilamina@<version>` | Exactly that LeviLamina version. It must fit the game version. |
| `--no-loader` | No loader. |

`levilamina` is matched case-insensitively.

### Game versions and builds

lip fetches the list of server builds from `https://levimc.org/api/v4/mc/versions/`. A build is four numbers, such as `1.21.80.03`, and maps to two game versions:

| Build | Game version | Names |
| --- | --- | --- |
| `1.21.80.03` | `1.21.80` | The first `1.21.80.*` build in the list for that system. |
| `1.21.80.03` | `1.21.80-patch.3` | The exact build `1.21.80.03`. |

Use `--game 1.21.80` in general, and `--game 1.21.80-patch.3` when you need a specific build. Windows builds and Linux builds have separate lists, so a version may exist for one and not the other.

The server itself is downloaded from `www.minecraft.net`.

| Build | Where it runs |
| --- | --- |
| `windows` | Directly on Windows. On Linux and macOS through the Wine installation managed by lip. |
| `linux` | Only on Linux on x64. `lip setup --build linux` works on every system, but [`lip run`](run.md) refuses to start the server elsewhere. |

::: info
The interface offers the `linux` build only when lip runs on Linux on x64. The command has no such limit.
:::

### The license

The game is covered by the [Minecraft End User License Agreement](https://www.minecraft.net/eula) and the [Microsoft Privacy Policy](https://go.microsoft.com/fwlink/?LinkId=521839).

When `lip setup` installs a game, it prints both links and asks whether you accept them. Type `yes` to continue; any other answer makes the command fail before anything changes.

- With `--accept-eula`, lip does not ask.
- Without it, if standard input or standard error is not a terminal (as in a script), the command fails before anything changes.
- Your answer is not saved. Every setup that installs a game asks again, whereas a setup that leaves the game as it is does not ask.

### Left-out packages

An explicitly installed package other than the game and the loader is **left out** when no version of it works with the new game and loader. This can be a mod or any other package.

lip lists the left-out packages and asks whether to uninstall them. If you do not answer `yes`, the command fails before anything changes. When standard input or standard error is not a terminal, lip cannot ask: the command fails and lists the packages. Uninstall them first with [`lip uninstall`](uninstall.md), then run `lip setup` again.

If the remaining packages cannot be installed together at all, the command fails.

lip asks about left-out packages first, then about the license. Both prompts appear after lip has decided what to do and before it downloads the game.

## Options

| Option | Description |
| --- | --- |
| `--game <VERSION>` | The game version, such as `1.21.0`: a SemVer version without a leading `v`. Required. Any other value is a usage error. |
| `--build <BUILD>` | `windows` or `linux`. Defaults to `windows`. Any other value is a usage error. |
| `--loader <LOADER>` | `levilamina` or `levilamina@<version>`. Any other value is a usage error. |
| `--no-loader` | Set up the game without a loader. Passing both `--loader` and `--no-loader` is a usage error. |
| `--accept-eula` | Accept the license without being asked. |
| `--accept-rosetta-license` | Accept the Rosetta 2 license so that lip installs it without asking when a Mac with Apple silicon lacks it. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon). |
| `-n`, `--dry-run` | Perform a [dry run](../cli.md#dry-run). Asks no questions. The messages list the packages that would be installed, uninstalled, or marked explicitly installed, the left-out packages, and whether lip would ask you to accept the license. |
| `-h`, `--help` | Print the help and exit. |

## Output

`lip setup` has no result and writes nothing to standard output. Progress, prompts, and the final line are written to standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The setup succeeded, or the dry run finished. |
| not `0` | A usage error, or the setup failed. A failed setup is undone. |

## Examples

Create a server for game version 1.21.0 with the newest compatible LeviLamina:

```shell
lip setup --game 1.21.0
```

Set up a specific LeviLamina version, accepting the license in a script:

```shell
lip setup --game 1.21.0 --loader levilamina@1.0.0 --accept-eula
```

Set up the Windows server without a loader:

```shell
lip setup --game 1.21.0 --no-loader
```

Set up the Linux server, which has no loader:

```shell
lip setup --game 1.21.0 --build linux
```

See what moving to another game version would do to the installed packages:

```shell
lip setup --game 1.21.50 --dry-run
```

## See also

- [A server from the command line](https://levimc.org/tutorials/server/command-line/)
- [Server](../../interface/server.md): [setting up the server](../../interface/server.md#set-up-the-server) and [changing the game or the loader version](../../interface/server.md#change-the-game-or-the-loader-version) in the interface.
- [What survives a game change](../files.md#what-survives-a-game-change)
- [`lip install`](install.md#setting-up-with-install), which sets up a server when you install LeviLamina or the server itself.
- [`lip run`](run.md)
