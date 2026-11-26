# lip daemon

Show or stop the lip daemon.

## Synopsis

```
lip daemon status [--json] [-h | --help]
lip daemon stop [-h | --help]
```

## Description

The **daemon** is a background `lip` process belonging to your user. It runs the commands of every other `lip` process: all commands except those in the `daemon` group, and the interface. It also runs [managed servers](run.md#managed-servers).

You never start it yourself:

1. A command connects to the daemon. If none is listening, the command starts one detached from the terminal, passing its own environment variables.
2. If the daemon is from another lip version or another `lip` executable, the command asks it to exit and starts a new one. A busy daemon keeps running; see [After an update](#after-an-update).
3. The daemon runs the command just as the `lip` process you started would: in your working directory, with your environment variables, reading from your standard input, writing to your standard output and standard error, and receiving your Ctrl+C. `lip` then exits with the command's exit code.

If a command cannot start or reach the daemon, it prints a message and runs the command itself. Only `lip run --managed` fails in this case.

Two commands that the daemon runs for two terminals behave like separate processes: for example, if one holds the workspace lock, the other finds it locked.

The daemon exits on its own:

- after it has had no connections and run no managed servers for a while (10 minutes in the current version);
- when a newer or different `lip` asks it to exit and it is idle; and
- once it is idle after [`lip self-update`](self_update.md) updates lip or starts the installer.

Clients reach the daemon through an endpoint accessible only to your user: a named pipe on Windows, or a Unix socket elsewhere. See [The daemon endpoint](../files.md#the-daemon-endpoint).

### lip daemon status

Shows whether a daemon is listening on the endpoint and, if so, its version and process ID.

### lip daemon stop

Asks the daemon to exit and waits until it does.

- If no daemon is listening, the command succeeds and changes nothing.
- If the daemon is running a command or a managed server, **the command fails and the daemon keeps running**. Stop the managed servers first: attach with `lip run --managed` in each workspace and press Ctrl+C, or stop them on the Server page of the interface. Wait for any other commands to finish, then run `lip daemon stop` again.

The process you start runs both commands directly; they never run in a daemon or start one.

### After an update

An older daemon that is still running a managed server or a command is not replaced. Until it becomes idle:

- `lip run --managed` uses the old daemon, so you can still attach to and stop its servers;
- every other command prints a message and runs directly in the new `lip` process.

Once you stop the managed servers, the next command starts a daemon of the new version.

## Options

| Option | Description |
| --- | --- |
| `--json` | For `status`: write the result as JSON. |
| `-h`, `--help` | Write the help and exit. |

## Output

`lip daemon status` writes its result to standard output. Without `--json`, it writes a single human-readable line:

```
The daemon of lip does not run.
```

```
The daemon of lip 1.0.0 runs as process 4812, carrying out 0 commands.
```

With `--json`, when no daemon is listening:

```json
{"running":false}
```

and when one is:

```json
{"running":true,"version":"1.0.0","pid":4812}
```

| Member | Value |
| --- | --- |
| `running` | A boolean: whether a daemon is listening on the endpoint. |
| `version` | A string: the daemon's version, as written by its `lip -v`. Present only when `running` is `true`. |
| `pid` | A number: the daemon's process ID. Present only when `running` is `true`. |

`lip daemon stop` produces no result; it writes messages to standard error.

## Exit status

| Command | `0` | not `0` |
| --- | --- | --- |
| `lip daemon status` | Always, whether a daemon is running or not. | A usage error. |
| `lip daemon stop` | The daemon exited, or none was running. | A usage error, or the daemon is busy and keeps running. |

## Examples

Check whether the daemon is running:

```shell
lip daemon status
```

Stop the daemon in a script only if one is running:

```shell
lip daemon status --json | jq -e '.running' > /dev/null && lip daemon stop
```

## See also

- [`lip run`](run.md#managed-servers): managed servers.
- [How lip works](../../concepts/how_lip_works.md): the daemon and its clients.
- [Settings](../../interface/settings.md): the daemon in the interface.
- [A server from the command line](https://levimc.org/tutorials/server/command-line/)
