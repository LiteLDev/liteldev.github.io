# lip install

Install packages into the workspace.

## Synopsis

```
lip install <PACKAGES>... [--accept-eula] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## Description

`lip install` installs each of `<PACKAGES>` and its dependencies into the workspace as a single [workspace operation](../cli.md#workspace-operations). Each of `<PACKAGES>` is a [package argument](../cli.md#package-arguments):

| Form | Example | Installs |
| --- | --- | --- |
| `<repo>` | `github.com/user/repo` | The highest version tag in the Git repository `https://<repo>.git`. |
| `<repo>#<variant>` | `github.com/LiteLDev/LegacyScriptEngine#lua` | That variant of the package. Every form below also accepts `#<variant>` before the `@`. |
| `<repo>@<version>` | `github.com/user/repo@1.0.0` | The commit of the tag `v<version>`. |
| `<repo>@branch:<name>` | `github.com/user/repo@branch:main` | The commit that the branch currently points to. |
| `<repo>@tag:<name>` | `github.com/user/repo@tag:nightly` | The commit that the tag currently points to. Any tag name works. |
| `<repo>@rev:<commit>` | `github.com/user/repo@rev:0123456789abcdef0123456789abcdef01234567` | That commit. All 40 hexadecimal digits are required. |
| An `https://` URL | `https://example.com/package.zip` | The ZIP archive at that URL. `#<variant>` may follow. |
| A local path | `./package.zip`, `../MyTool`, `C:\Downloads\package.zip` | A ZIP file or directory on your disk. `#<variant>` may follow. |

A `<repo>` without a `/` refers to a LiteLDev repository: `LeviLamina` expands to `github.com/LiteLDev/LeviLamina`.

What it does:

- The packages you name become **explicitly installed**, including any that were previously installed as dependencies.
- Their dependencies are installed as **dependency packages**.
- Already-installed packages keep their versions when compatible; otherwise, a dependency package may change version.
- Dependency packages that are no longer needed by any explicitly installed package are uninstalled.

What it rejects before making any changes:

- An invalid package argument, or one that has no package for the `server` side and `win-x64` platform.
- A package that is already explicitly installed. Use [`lip update`](update.md) to change its version.
- Two arguments that name the same package.
- A set of packages that cannot be installed together, such as two mods with the same mod name or dependencies that no version can satisfy.
- Anything that would change the game or the loader (see below).

The version of a package installed from `@branch:`, `@tag:`, or `@rev:` is the `version` in its `lip.toml` at that commit. Such a package also satisfies dependencies on the same repository and variant if its version falls within their required range.

### The game and the loader

The **game** and the **loader** are the installed packages of `github.com/LiteLDev/bds` and `github.com/LiteLDev/LeviLamina`; see [`lip setup`](setup.md#terms).

Except as described in [Setting up with install](#setting-up-with-install), `lip install` never installs, uninstalls, or replaces the game or the loader. If the requested packages are incompatible with the current game or loader—for example, if a mod requires a newer LeviLamina—the command fails and reports the game version, the loader version, and `lip setup`. Use [`lip setup`](setup.md) to set up a compatible game and loader, then install the mod.

In a workspace without a game, `lip install` fails and points to `lip setup` if any package you name—or any dependency it would install—is a mod, the server, or LeviLamina. File packages that do not depend on any of these can be installed without a game.

### Setting up with install

An argument **names the server** if it is `github.com/LiteLDev/bds`, with or without a variant or ref. An argument **names the loader** if it is `github.com/LiteLDev/LeviLamina` with no variant, and with either no ref or `@<version>`. Both comparisons are case-insensitive.

If an argument names the server or the loader, `lip install` runs as [`lip setup`](setup.md), together with the other arguments, in a single operation:

| Setting | Value |
| --- | --- |
| Build | `linux` when the server is named as `github.com/LiteLDev/bds#linux`; `windows` otherwise. |
| Loader | No loader if no argument names LeviLamina. Otherwise LeviLamina: at the `@<version>` specified; if none is specified, the latest version compatible with the game version from the server argument; or the latest LeviLamina if no argument gives a game version. |
| Game version | The `@<version>` of the server argument. If none is specified, the latest game version supported by the resolved LeviLamina, or the latest game version if no argument names LeviLamina. |

| Command | Sets up |
| --- | --- |
| `lip install LeviLamina` | The latest LeviLamina, with the latest game it supports. |
| `lip install LeviLamina@1.0.0` | LeviLamina 1.0.0, with the latest game it supports. |
| `lip install github.com/LiteLDev/bds@1.21.0 LeviLamina` | Game 1.21.0, with the latest compatible LeviLamina. |
| `lip install github.com/LiteLDev/bds@1.21.0` | Windows server 1.21.0, without a loader. |
| `lip install github.com/LiteLDev/bds#linux` | The latest Linux server, without a loader. |

Passing two arguments that name the server, or two that name the loader, causes the command to fail. Everything documented for [`lip setup`](setup.md) applies: the license prompt, `--accept-eula`, left-out packages, and system dependencies.

## Options

| Option | Description |
| --- | --- |
| `--accept-eula` | Accept the [game license](setup.md#the-license) without prompting when `lip install` runs as a setup. Has no effect otherwise. |
| `--accept-rosetta-license` | Accept the Rosetta 2 license so lip installs it without prompting when a Mac with Apple silicon lacks it. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon). |
| `-n`, `--dry-run` | Perform a [dry run](../cli.md#dry-run). Messages list the packages that would be installed, uninstalled, or marked as explicitly installed, without making any changes. |
| `-h`, `--help` | Print help and exit. |

## Output

`lip install` produces no result and writes nothing to standard output. Progress and the final line are written to standard error. Package hook commands write directly to standard output and standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The packages were installed, or the dry run finished. |
| not `0` | A usage error occurred, or the installation failed. A failed installation is undone. |

## Examples

Install the latest version of a mod from its repository:

```shell
lip install github.com/LiteLDev/LegacyScriptEngine#lua
```

Preview what installing a given version would do, then install it:

```shell
lip install github.com/user/repo@1.0.0 --dry-run
lip install github.com/user/repo@1.0.0
```

Install several packages in one operation:

```shell
lip install github.com/user/repo github.com/user/other@2.1.0
```

Install from a branch, a URL, a ZIP file, and a directory:

```shell
lip install github.com/user/repo@branch:main
lip install https://example.com/package.zip
lip install ./package.zip
lip install ../MyTool
```

Set up a server and install a mod in one step in a script:

```shell
lip install LeviLamina github.com/user/repo --accept-eula
```

## See also

- [Managing packages](../../guides/managing_packages.md)
- [Marketplace](../../interface/get_mods.md): finding and installing mods in the interface.
- [`lip setup`](setup.md), [`lip update`](update.md), [`lip uninstall`](uninstall.md), [`lip list`](list.md)
- [lip.toml](../../concepts/lip_toml.md): what a package is.
