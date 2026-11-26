# lip uninstall

Uninstall packages from the workspace.

## Synopsis

```
lip uninstall <PACKAGES>... [--accept-rosetta-license] [-n | --dry-run] [-h | --help]
```

## Description

`lip uninstall` uninstalls the installed packages named by `<PACKAGES>` as a single [workspace operation](../cli.md#workspace-operations).

Each `<PACKAGES>` operand matches installed packages by the first of these rules that matches at least one installed package:

1. **By identity.** The operand equals the identity shown by [`lip list`](list.md) without the version, such as `github.com/LiteLDev/LegacyScriptEngine#lua`.
2. **By source.** Parsed as a [package argument](../cli.md#package-arguments), the operand equals the source the package was installed from, such as `github.com/user/repo@branch:main` or `./package.zip`. Repository names are compared case-insensitively. An operand without a variant matches every variant, and an operand without a ref matches every ref.

As with `lip install`, a name without `/` (such as `LeviLamina`) refers to a LiteLDev repository.

What it does:

- The named packages are no longer marked as explicitly installed.
- Every package no longer needed by any remaining explicitly installed package is uninstalled: its `pre_uninstall` hooks run, its owned files are deleted (except those kept by its `preserve`), the paths in its `purge` are deleted, and its `post_uninstall` hooks run.
- A named package that is still needed by another explicitly installed package remains installed as a dependency package.

What it rejects before making any changes:

- An operand that matches no installed package.
- A named package that is not explicitly installed. Uninstall the package that depends on it instead.

The game and the loader are uninstalled like any other package. Uninstalling the game leaves the workspace without a game; set it up again with [`lip setup`](setup.md) before installing mods or running the server. Uninstalling the game preserves `server.properties`, `allowlist.json`, and `permissions.json`; see [The server files](../files.md#the-server-files).

## Options

| Option | Description |
| --- | --- |
| `--accept-rosetta-license` | Accept the Rosetta 2 license so that lip installs it without prompting when missing on a Mac with Apple silicon. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon). |
| `-n`, `--dry-run` | Perform a [dry run](../cli.md#dry-run). The messages list the packages that would be uninstalled or unmarked as explicitly installed. Nothing is changed. |
| `-h`, `--help` | Print help and exit. |

## Output

`lip uninstall` produces no result and writes nothing to standard output. Progress and the final summary line are written to standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The packages were uninstalled, or the dry run finished. |
| not `0` | A usage error occurred, or the command failed. A failed operation is rolled back. |

## Examples

Uninstall a package by its identity:

```shell
lip uninstall github.com/LiteLDev/LegacyScriptEngine#lua
```

Preview what uninstalling two packages would remove:

```shell
lip uninstall github.com/user/repo github.com/user/other --dry-run
```

Uninstall a package that was installed from a local ZIP file:

```shell
lip uninstall ./package.zip
```

## See also

- [Managing packages](../../guides/managing_packages.md)
- [Mods](../../interface/mods.md): uninstalling mods in the interface.
- [`lip list`](list.md), [`lip install`](install.md), [`lip setup`](setup.md)
