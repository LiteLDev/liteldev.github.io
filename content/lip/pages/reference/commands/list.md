# lip list

List the installed packages.

## Synopsis

```
lip list [--json] [-h | --help]
```

## Description

`lip list` reads the workspace's [state file](../../concepts/state_file.md) and writes the installed packages, each as `<identity>@<version>`, in two groups:

1. **explicitly installed** packages: those you asked for, including the game and the loader;
2. **dependency packages**: those installed because another package needs them.

Explicitly installed packages come first. Within each group, packages appear in installation order: each package comes after the packages it depends on.

The **identity** of a package is its package ID, followed by `#<variant>` for non-default variants (such as `github.com/LiteLDev/LegacyScriptEngine#lua`). This is the value that [`lip uninstall`](uninstall.md) takes.

`lip list` changes nothing and takes no lock, so it can run alongside another command or the server. In a workspace without a state file, both groups are empty. In a lip v0.x workspace, which has a `tooth_lock.json` file instead, the command reads from that file without changing it.

## Options

| Option | Description |
| --- | --- |
| `--json` | Write the result as JSON. |
| `-h`, `--help` | Write the help and exit. |

## Output

The command writes the result to standard output. Without `--json`, it prints two human-readable trees:

```
User-Requested
├── github.com/LiteLDev/bds@1.21.0
├── github.com/LiteLDev/LeviLamina@1.0.0
└── github.com/LiteLDev/LegacyScriptEngine#lua@0.9.0
Dependencies
└── github.com/LiteLDev/LegacyRemoteCall@0.9.0
```

An empty group shows `None`. This layout may change; use `--json` in scripts.

With `--json`, the result is a JSON object with exactly these members:

```json
{
  "ExplicitInstalled": [
    "github.com/LiteLDev/bds@1.21.0",
    "github.com/LiteLDev/LeviLamina@1.0.0",
    "github.com/LiteLDev/LegacyScriptEngine#lua@0.9.0"
  ],
  "ImplicitInstalled": [
    "github.com/LiteLDev/LegacyRemoteCall@0.9.0"
  ]
}
```

| Member | Value |
| --- | --- |
| `ExplicitInstalled` | An array of `<identity>@<version>` strings for the explicitly installed packages. |
| `ImplicitInstalled` | An array of `<identity>@<version>` strings for the dependency packages. |

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The list was written. |
| not `0` | A usage error occurred, or the state file cannot be read. |

## Examples

List the packages:

```shell
lip list
```

Get the explicitly installed packages in a script using [jq](https://jqlang.org/):

```shell
lip list --json | jq -r '.ExplicitInstalled[]'
```

## See also

- [Managing packages](../../guides/managing_packages.md)
- [Mods](../../interface/mods.md): the installed mods in the interface.
- [State file](../../concepts/state_file.md)
