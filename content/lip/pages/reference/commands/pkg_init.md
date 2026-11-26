# lip pkg init

Create a `lip.toml` file for a new package in the current directory.

## Synopsis

```
lip pkg init [-h | --help]
```

## Description

`lip pkg init` prompts for the package ID, then writes `lip.toml` in the current working directory.

1. If `lip.toml` already exists there, the command fails and writes nothing.
2. lip prompts on the terminal for the package ID—a [Go module path](https://pkg.go.dev/golang.org/x/mod/module#CheckPath) such as `github.com/user/repo`—and keeps prompting until you enter a valid one. For a package in a Git repository, the ID is the repository path.
3. It writes a [package file](../../concepts/lip_toml.md) with the following exact values, where `<id>` is your answer:

   ```toml
   format = 4
   id = "<id>"
   version = "0.1.0"

   [[variants.""]]
   side = "server"
   platform = "win-x64"
   ```

If standard input or standard error is not a terminal, lip cannot prompt and the command fails. No option accepts the ID on the command line; in a script, write `lip.toml` directly.

The generated package does not install anything yet. See [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/) for what to add.

`lip pkg init` is not a workspace operation: it needs no server, takes no lock, and touches only `lip.toml`.

## Options

| Option | Description |
| --- | --- |
| `-h`, `--help` | Print help and exit. |

## Output

`lip pkg init` writes nothing to standard output. Both the prompt and the final confirmation line are written to standard error:

```
Enter the package id of the package (a Go module path, e.g. github.com/owner/repo):
```

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | `lip.toml` was written. |
| not `0` | A usage error occurred, `lip.toml` already exists, lip cannot prompt, or the file cannot be written. |

## Examples

```shell
cd MyMod
lip pkg init
```

## See also

- [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/)
- [lip.toml](../../concepts/lip_toml.md)
- [Develop Tools](../../interface/tools.md): **Create lip.toml** in the interface—a form that generates a complete `lip.toml`, validates it as you type, and lets you edit it later.
