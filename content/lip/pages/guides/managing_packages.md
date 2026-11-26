# Managing packages

This page shows how to install, list, update, and uninstall packages with `lip` commands, name a package in every way lip understands, and preview what a command will do before running it. In the interface, you can do the same on the [Mods](../interface/mods.md) and [Marketplace](../interface/get_mods.md) pages.

## What a package is

A **package** is anything lip installs into a workspace: a mod, the loader, the game, or a set of files that another package needs. Run every command on this page in the server folder (the workspace).

lip divides installed packages into two groups:

- **Packages you asked for.** You named them in `lip setup` or `lip install`. lip keeps them until you uninstall them.
- **Dependencies.** lip installed them because another package needs them. lip removes them automatically when nothing needs them anymore.

Mods require a server. Set one up first: see [A server from the command line](https://levimc.org/tutorials/server/command-line/).

## Name a package

You name a package by where it comes from—its **source**. There are four kinds:

| Source | Example |
| --- | --- |
| A git repository | `github.com/LiteLDev/LegacyScriptEngine` |
| A ZIP file on the web | `https://example.com/downloads/my-mod.zip` |
| A ZIP file on your disk | `./my-mod.zip` |
| A folder on your disk | `../MyMod` |

### A git repository

Most packages live in a git repository, usually on GitHub. Name the repository by its address without `https://`:

```sh
lip install github.com/LiteLDev/LegacyScriptEngine#lua
```

Three parts can follow the address:

- **A short name.** A name without `/` refers to a repository under `github.com/LiteLDev/`. For example, `LeviLamina` means `github.com/LiteLDev/LeviLamina`.
- **A variant**, after `#`. Some packages come in several flavours, each with its own name. `LegacyScriptEngine#lua` is the Lua flavour of LegacyScriptEngine. The package's page lists its available variants.
- **A ref**, after `@`. This selects which state of the repository to install:

| Ref | Installs | Example |
| --- | --- | --- |
| none | The newest released version that works in your workspace | `lip install LegacyScriptEngine#lua` |
| `@<version>` | Exactly that version | `lip install LegacyScriptEngine#lua@0.13.1` |
| `@branch:<name>` | The newest commit of a branch | `lip install github.com/user/repo@branch:main` |
| `@tag:<name>` | The commit of any tag | `lip install github.com/user/repo@tag:nightly` |
| `@rev:<commit>` | One commit, by its full 40-digit id | `lip install github.com/user/repo@rev:0123456789abcdef0123456789abcdef01234567` |

A repository's released versions are its tags named `v` followed by a version, such as `v1.2.3`. Write the version without the `v`.

Only public repositories work. lip does not require `git` to be installed.

### A ZIP file on the web

Give the full address, starting with `https://`. The file must be a ZIP archive with a `lip.toml` at its root:

```sh
lip install https://example.com/downloads/my-mod.zip
```

Addresses starting with `http://` or another scheme are refused.

### A ZIP file or a folder on your disk

Give the path to a ZIP file or folder that has a `lip.toml` at its root:

::: code-group

```powershell [Windows]
lip install .\my-mod.zip
lip install D:\downloads\my-mod.zip
lip install ..\MyMod
```

```sh [Linux / macOS]
lip install ./my-mod.zip
lip install ~/downloads/my-mod.zip
lip install ../MyMod
```

:::

To make sure lip reads a name as a path rather than a repository, start it with `./` or `../` (`.\` or `..\` on Windows), or use an absolute path. A variant can also follow a URL or path, as in `./my-mod.zip#lua`.

See [Command line](../reference/cli.md) for the exact rules.

## Install

[`lip install`](../reference/commands/install.md) takes one or more packages:

```sh
lip install LegacyScriptEngine#lua LegacyMoney
```

lip finds a set of versions that work together and with your game and loader, downloads them, and installs them along with their dependencies. It finishes with:

```text
✓ Packages installed successfully.
```

Things to know:

- **Mods need a game.** In a workspace without a game, installing a mod fails and points you to `lip setup`.
- **Installing what you already asked for fails.** lip tells you to use `lip update` instead, which is the command for changing versions.
- **A dependency can become a package you asked for.** Install it by name. lip then records that you want it, so it stays even when nothing else needs it.
- **The game and the loader stay as they are.** If a package needs a different game or loader than the workspace has, the command fails and points you to `lip setup`. Exception: `lip install LeviLamina`, or an install that names the game `github.com/LiteLDev/bds`, acts as a setup. See [`lip setup`](../reference/commands/setup.md).

## List

[`lip list`](../reference/commands/list.md) shows what is installed, split into the two groups:

```sh
lip list
```

```text
User-Requested
├── github.com/LiteLDev/bds@<version>
├── github.com/LiteLDev/LeviLamina@<version>
└── github.com/LiteLDev/LegacyScriptEngine#lua@<version>
Dependencies
├── github.com/LiteLDev/LegacyRemoteCall@<version>
└── …
```

Each line shows the package name, with its variant after `#` and its version after `@`. The game is `github.com/LiteLDev/bds`.

For scripts, request JSON output:

```sh
lip list --json
```

`lip list` is read-only. It works even while another command is modifying the workspace or while the server is running.

## Update

[`lip update`](../reference/commands/update.md) without a name updates every package you asked for:

```sh
lip update
```

With names, it updates those packages:

```sh
lip update LegacyScriptEngine#lua
```

What "update" means depends on how the package was installed:

| Installed from | An update gives |
| --- | --- |
| A repository, without a ref | The newest released version that works in your workspace |
| A repository `@<version>` | The same version. The package is pinned. |
| A repository `@rev:<commit>` | The same commit. The package is pinned. |
| A repository `@branch:<name>` | The commit the branch points to now |
| A repository `@tag:<name>` | The commit the tag points to now |
| A URL | The file, downloaded again |
| A path on your disk | The file or folder, read again |

lip replaces a package only when what it finds differs from what is installed. Otherwise, it leaves the package alone.

More things to know:

- **Change or pin a version** by naming it: `lip update LegacyScriptEngine#lua@0.13.1`. This can also roll back to an older version. The package then stays on that version.
- **Unpin** by naming the package without a ref: `lip update LegacyScriptEngine#lua`. It follows the released versions again.
- **Dependencies change only as far as needed.** lip does not move a dependency to a newer version unless a package you asked for needs it.
- **The game and the loader are never updated** by `lip update`. Naming either of them fails. Change them with [`lip setup`](../reference/commands/setup.md).
- **A package from a path that is gone is kept.** `lip update` without names warns and leaves the package as it is.
- **The packages you name must be installed.** They become packages you asked for.

## Uninstall

[`lip uninstall`](../reference/commands/uninstall.md) takes the names of installed packages:

```sh
lip uninstall LegacyMoney
```

You can name a package the way `lip list` shows it, without the version, or by the source you installed it from. A name without a variant matches every installed variant of the package.

lip removes the files the package installed, and then removes every dependency that nothing needs anymore.

Things to know:

- **Only packages you asked for can be uninstalled.** A dependency is removed when the packages that need it are uninstalled.
- **A package that others still need stays** as a dependency. lip tells you when this happens: `<name> is still required by other packages; keeping it as a dependency.`
- **Files you may have edited are kept** when the package specifies this. For example, uninstalling the game keeps `server.properties`. See [What survives a game change](../reference/files.md#what-survives-a-game-change).
- **The game and the loader can be uninstalled** like any package. A workspace without a game has no server to run.

## Dry run

Every command that changes the workspace accepts `--dry-run`, or `-n` for short: `lip setup`, `lip install`, `lip update`, and `lip uninstall`.

```sh
lip update --dry-run
```

A dry run does everything the real command does up to the point where it would change something. It reads the workspace, checks the network for versions, chooses the packages, and verifies that their files can be placed. Then it shows you the plan and stops:

```text
Dry run: would uninstall LegacyMoney 0.16.1 (1 file)
Dry run: would uninstall LegacyRemoteCall 0.13.0 (1 file)
Dry run: nothing was changed.
```

What a dry run promises:

- **It changes nothing.** It does not create, change, or delete any file in the workspace, cache, or configuration. The one exception is a failure report when the dry run itself fails.
- **It runs nothing.** It runs no program from a package and installs nothing on your system.
- **It asks nothing.** Where the real command would prompt you, such as for the Minecraft EULA or before a setup uninstalls mods, the dry run notes that it would ask.
- **It does not wait for other commands.** It takes no lock, so it works while another lip command is changing the workspace.
- **It still needs the network**, and may take as long as the real command up to that point.

A dry run that succeeds does not prove that the real command will: the network, the disk, or the workspace may change in between. A dry run that fails tells you why the real command would fail.

If an earlier command was interrupted, a dry run tells you so and plans with the workspace as it is. See [After a crash or a power cut](troubleshooting.md#after-a-crash-or-a-power-cut).

The interface runs a dry run for you before each change: the plan it shows before you choose Apply is this plan.

## When a command fails or you cancel

A command that modifies the workspace does all of its work or none of it.

- **It fails before it changes anything** when the problem can be detected in advance: a nonexistent package, incompatible versions, a failed download, or a file owned by another package. The workspace remains untouched.
- **It fails in the middle**, for example when a file cannot be written. lip then undoes every change it made, leaving the workspace as it was before the command.
- **You press Ctrl+C.** If lip is still preparing, it stops immediately. If it is modifying the workspace, it cancels the operation, undoes its changes, and outputs `Cancelled. Any changes to the workspace were undone.` A second Ctrl+C exits lip immediately, and the next command cleans up.

One thing cannot be undone: any actions already taken by programs that a package runs during installation.

After a failure, lip explains what went wrong and how to fix it, and saves a failure report. See [Troubleshooting](troubleshooting.md).

## Next

- [How lip works](../concepts/how_lip_works.md): what happens inside an operation.
- [Internals](../concepts/internals.md): how lip finds versions and chooses between them.
- [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/): make a package of your own.
