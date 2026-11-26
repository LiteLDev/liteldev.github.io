# lip update

Update installed packages.

## Synopsis

```
lip update [<PACKAGES>...] [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## Description

`lip update` re-requests installed packages and replaces any that have changed, in a single [workspace operation](../cli.md#workspace-operations).

**Without operands**, it re-requests every explicitly installed package from its original installation source, as recorded in the [state file](../../concepts/state_file.md):

| Installed from | `lip update` installs |
| --- | --- |
| `<repo>` | The highest version tag. |
| `<repo>@<version>` | The same version: nothing changes. |
| `<repo>@branch:<name>` | The commit the branch points to now. |
| `<repo>@tag:<name>` | The commit the tag points to now. |
| `<repo>@rev:<commit>` | The same commit: nothing changes. |
| An `https://` URL | The ZIP archive, downloaded again. |
| A local ZIP file or directory | The same path, read again. If the path no longer exists, the package is kept as is. |

**With operands**, each item in `<PACKAGES>` is a [package argument](../cli.md#package-arguments) in any form accepted by [`lip install`](install.md). Only the specified packages are re-requested, using the sources you provide. Use this to change a package's source:

- `lip update github.com/user/repo@2.0.0` moves the package to version 2.0.0, upgrading or downgrading as needed.
- `lip update github.com/user/repo` moves a package that was installed from a specific version or ref back to the highest version tag.

The requested packages are marked as explicitly installed.

In both cases:

- A package is replaced only if the fetched package differs from the installed one in identity, version, or commit. Because a package from a URL or local path has no commit, it is replaced only when its version changes.
- Replacing a package uninstalls the old one and then installs the new one.
- Dependency packages are updated only as needed to satisfy the new packages.

The command refuses the following before making any changes:

- An operand for a package that is not installed. Use [`lip install`](install.md) instead.
- An operand that names `github.com/LiteLDev/bds` or `github.com/LiteLDev/LeviLamina`. The error message directs you to `lip setup`.
- An update that is incompatible with the currently installed game and loader.

`lip update` leaves the game and the loader untouched: when run without operands, it does not re-request them. To change the game version or the LeviLamina version, run [`lip setup`](setup.md).

## Options

| Option | Description |
| --- | --- |
| `--accept-rosetta-license` | Accept the Rosetta 2 license so that lip installs it without prompting on a Mac with Apple silicon where it is missing. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon). |
| `-n`, `--dry-run` | Perform a [dry run](../cli.md#dry-run). Prints the packages that would be installed, uninstalled, or marked as explicitly installed, without changing anything. |
| `-h`, `--help` | Print help and exit. |

## Output

`lip update` produces no result and writes nothing to standard output. Progress messages and the final summary line are written to standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The update succeeded (including when nothing needed to change), or the dry run finished. |
| not `0` | A usage error occurred, or the update failed. A failed update is rolled back. |

## Examples

Preview what updating every package would do, then run the update:

```shell
lip update --dry-run
lip update
```

Update one package to its newest version:

```shell
lip update github.com/user/repo
```

Move a package to a specific version:

```shell
lip update github.com/user/repo@1.2.0
```

## See also

- [Managing packages](../../guides/managing_packages.md)
- [Mods](../../interface/mods.md): updating mods in the interface.
- [`lip install`](install.md), [`lip setup`](setup.md), [`lip list`](list.md)
