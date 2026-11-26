# Command line

This page explains how to invoke `lip`: the available commands, how arguments are parsed, where output goes, what exit statuses mean, and how dry runs and Ctrl+C work. Each command has its own page; this page covers what they all share.

## Synopsis

```
lip
lip (-h | --help)
lip (-v | --version)
lip --uri <link>
lip (cache | config | daemon | pkg) (-h | --help)
lip <command> [<argument>...]
```

In a synopsis, `word` is written literally, `<name>` is replaced by a value, `[x]` is optional, `x | y` means either one, `(x | y)` groups alternatives, and `x...` means `x` one or more times.

| Invocation | What lip does |
| --- | --- |
| `lip` | Runs the [interface](interface.md) when standard input and standard output are both terminals. Otherwise, writes the help for `lip` to standard output. |
| `lip -h`, `lip --help` | Writes the help for `lip` to standard output, regardless of what follows. |
| `lip -v`, `lip --version` | Writes its version (a [SemVer](https://semver.org/spec/v2.0.0.html) version) and a line break to standard output, regardless of what follows. |
| `lip --uri <link>` | Opens a `lip://` [install link](links.md): the interface asks whether to install its package. Valid only as the first of exactly two arguments. |
| `lip cache -h`, `lip config -h`, `lip daemon -h`, `lip pkg -h` | Writes the help for the command group to standard output. `--help` does the same. |
| `lip --daemon` | Runs as the [daemon](commands/daemon.md) until it exits, and writes nothing. lip starts the daemon this way itself; you never need to. |
| `lip <command> ...` | Runs the command. |

Writing the help or version exits with code 0. `lip --uri` exits with the same status as the [interface](interface.md#exit-status), or with a non-zero code when the link is invalid or there is no terminal. Any other first argument that starts with `-` is a [usage error](#usage-errors).

## Commands

Commands for running a server:

| Command | Does |
| --- | --- |
| [`lip setup`](commands/setup.md) | Chooses the game and loader for the workspace. |
| [`lip install`](commands/install.md) | Installs packages into the workspace. |
| [`lip uninstall`](commands/uninstall.md) | Uninstalls packages from the workspace. |
| [`lip update`](commands/update.md) | Updates installed packages. |
| [`lip list`](commands/list.md) | Lists installed packages. |
| [`lip run`](commands/run.md) | Runs the workspace server. |
| [`lip cache clean`](commands/cache_clean.md) | Deletes the cache. |
| [`lip config get`, `set`, `list`, `delete`](commands/config.md) | Reads and writes the configuration. |

Commands for the daemon:

| Command | Does |
| --- | --- |
| [`lip daemon status`](commands/daemon.md) | Shows whether the daemon is running. |
| [`lip daemon stop`](commands/daemon.md) | Stops the daemon. |

Commands for developing packages:

| Command | Does |
| --- | --- |
| [`lip pkg init`](commands/pkg_init.md) | Creates a `lip.toml` for a new package. |
| [`lip pkg migrate`](commands/pkg_migrate.md) | Migrates the `tooth.json` in the current directory to `lip.toml`. |

A command for lip itself:

| Command | Does |
| --- | --- |
| [`lip self-update`](commands/self_update.md) | Updates lip to its latest release. |

`cache`, `config`, `daemon`, and `pkg` are **command groups**: the first word of a two-word command name.

## Arguments

Command names, group names, and option names are case-sensitive.

- The first argument is a one-word command name or a command group. A command group must be followed by `-h`, `--help`, or the second word of a command in that group. Anything else—including a command group with nothing after it—is a usage error.
- `--` is not a separator in lip: passing `--` as an argument is a usage error.
- Options and operands may appear in any order after the command name. Operands are assigned in the order given.

Each command argument that starts with `-` is an option:

| Form | Meaning |
| --- | --- |
| `--<name>` | The long option `<name>`. |
| `-<c>` | The short option `<c>`, one character. |
| `--<name>=<value>` | The long option `<name>` with the value `<value>`. |
| `-<c>=<value>` | The short option `<c>` with the value `<value>`. |

- An option that takes a value and is written without `=` takes the next argument as its value. That argument must not start with `-`.
- A value must not be empty.
- A **flag** is an option that takes no value. Giving a flag more than once counts as giving it once.
- When an option that takes a value is given more than once, its last occurrence takes effect.
- Short options cannot be combined (`-nh` is undefined), and flags cannot be given a value (such as `--json=true`). Do not use either form.

Every other argument is an **operand**.

## Usage errors

A command's arguments cause a usage error when:

1. an option is not valid for the command;
2. an option that takes a value has none;
3. an operand or option required by the synopsis is missing; or
4. more operands are given than the command accepts.

On a usage error, lip writes a message to standard error, exits with a non-zero code, and does nothing else. It does not write a [failure report](files.md#failure-reports).

## Options of every command

| Option | Description |
| --- | --- |
| `-h`, `--help` | Writes the command's help to standard output and exits with code 0. The command does nothing else. |

`-h` overrides a missing operand or an unknown option: `lip install -h` and `lip install -h --bogus` both print the help. It does not override a missing option value or too many operands; those remain usage errors.

## Working directory

The **workspace** for every command is the current working directory. Relative paths in arguments are resolved relative to it. There is no option to specify another workspace; change to the directory first.

## Output

- A **result** is the data requested from a command, written to standard output. Only `list`, `config get`, `config list`, `daemon status`, and `self-update --check` produce a result.
- A **message** is everything else—progress, information, warnings, errors, and the final success line—written to standard error. Message wording may change between versions, so do not parse it.
- Help is written to standard output.

As a result, `lip list > packages.txt` saves only the list, and `2> /dev/null` hides only the messages. Messages are always in English.

### JSON

The following commands accept `--json`. When it is passed, standard output receives only the result as JSON, followed by a line break:

| Command | JSON result |
| --- | --- |
| [`lip list --json`](commands/list.md#output) | `{ "ExplicitInstalled": [...], "ImplicitInstalled": [...] }` |
| [`lip config get <KEY> --json`](commands/config.md#output) | The value as a JSON string, or `null`. |
| [`lip config list --json`](commands/config.md#output) | An object mapping each key to its value, or `null`. |
| [`lip daemon status --json`](commands/daemon.md#output) | `{ "running": false }`, or `{ "running": true, "version": "...", "pid": ... }`. |

Without `--json`, the result is formatted for human readers and may change.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The command succeeded. |
| not `0` | The command failed (including usage errors). A message on standard error explains why. |

[`lip run`](commands/run.md#exit-status) is the exception: once it starts the server, it exits with the server's exit code.

When a command fails for any reason other than a usage error, it may write a **failure report** under `.lip/logs/` in the workspace and print the file path in a message. See [Failure reports](files.md#failure-reports).

## Package arguments

`install` and `update` take **package arguments**. lip classifies each argument using the first rule that matches:

1. **URL.** An argument starting with `https://` is the URL of a ZIP archive. Any other scheme followed by `://`, such as `http://` or `file://`, is invalid.
2. **Local path.** Consider the argument with everything from its last `#` onward removed—or the entire argument if it names an existing file or directory. It is a local path when that part
   - starts with `./`, `../`, `.\`, or `..\`;
   - is `.` or `..`;
   - is an absolute path; or
   - ends with `.zip` (case-insensitive) or names an existing file or directory, and the argument contains no `@`.

   A local path that does not exist is invalid.
3. **Remote repository.** Anything else: `<repo>[#<variant>][@<ref>]`. A `<repo>` without `/` refers to a LiteLDev repository: `LeviLamina@1.9.7` expands to `github.com/LiteLDev/LeviLamina@1.9.7`.

Both URLs and local paths may end with `#<variant>`. The ref of a remote repository can be one of the following:

| Ref | Selects |
| --- | --- |
| none | The repository's version tags (`v<version>`), highest first. |
| `@<version>` | The commit for the tag `v<version>`. |
| `@branch:<name>` | The commit the branch points to. |
| `@tag:<name>` | The commit the tag points to. |
| `@rev:<commit>` | The commit with that full 40-digit hexadecimal ID. |

If any package argument is invalid, the command fails before making any changes. See [`lip install`](commands/install.md) for examples of each form.

## Environment

Regardless of the host system, lip installs packages for a single **environment**: the `server` side and the `win-x64` platform. `setup`, `install`, `uninstall`, `update`, and `run` fail if the workspace's [state file](../concepts/state_file.md) records a different side, or a platform other than `win-x64` or `linux-x64`. A `linux-x64` state file is [read as `win-x64`](../concepts/state_file.md#workspaces-of-linux-x64).

## Workspace operations

When run without `--dry-run`, `setup`, `install`, `uninstall`, and `update` each perform one **workspace operation**, modifying the workspace atomically—either in full or not at all.

- Each operation acquires the workspace lock (`.lip/lock`). If another process holds the lock, the command fails immediately without changing anything.
- If a previous operation was interrupted, the next operation finishes or rolls it back first.
- If a failure occurs before the workspace is modified, nothing changes. If a failure occurs during modification, the changes are rolled back, though any hook commands that have already run are not reversed.

[How lip works](../concepts/how_lip_works.md) explains this in full.

## Dry run

`setup`, `install`, `uninstall`, and `update` accept `-n` or `--dry-run`. A dry run carries out every step that makes no changes, and outputs messages describing what the operation would do to which packages. It:

- does not take the workspace lock, so it works while another command is changing the workspace;
- does not recover an interrupted operation: if `.lip/journal` exists, it reports this and plans against the workspace as it is;
- runs no hook commands;
- asks no questions; and
- creates, replaces, or deletes no files or directories, with one exception: if it fails, it may write a failure report.

A dry run still uses the network to resolve packages, and writes nothing to the cache.

## Ctrl+C

What Ctrl+C does depends on what lip is doing:

| lip is | The first Ctrl+C | A second Ctrl+C |
| --- | --- | --- |
| planning an operation, before the workspace changes | Stops lip immediately. Nothing has changed. | |
| changing the workspace | Cancels the operation and undoes its changes. | Stops lip immediately. The next operation on the workspace recovers it. |
| running the server with `lip run` | Sends `stop` to the server. lip exits once the server has exited. | Nothing more: lip never exits before the server. |
| attached to a managed server (`lip run --managed`) | Sends `stop` to the server. You stay attached until it exits. | The same. |

See [`lip run`](commands/run.md#stopping) for the other signals.

## The daemon

The **daemon**—a background `lip` process running as your user and started by the first command—carries out the interface and every command except those in the `daemon` group. You see no difference: the command uses your working directory, environment variables, terminal, and Ctrl+C, and `lip` exits with the command's exit code.

If lip cannot start or reach the daemon, it prints a message and runs the command itself. Only `lip run --managed` requires the daemon. See [`lip daemon`](commands/daemon.md).

## See also

- [Interface reference](interface.md): what each page of the interface maps to in commands.
- [Configuration](configuration.md) and [Files](files.md).
- [A server from the command line](https://levimc.org/tutorials/server/command-line/) and [Managing packages](../guides/managing_packages.md).
