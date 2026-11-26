# lip run

Run the server of the workspace.

## Synopsis

```
lip run [--managed [--detach]] [--accept-rosetta-license] [-h | --help]
```

## Description

`lip run` starts the server at the root of the workspace, with no arguments and with the workspace as its working directory. There are two ways to run it:

| | `lip run` | `lip run --managed` |
| --- | --- | --- |
| The server runs | For this command: in the **foreground**. | In the [daemon](daemon.md), as a **managed server**. |
| When the terminal is closed | lip stops the server. | The server keeps running. |
| The command ends | When the server exits. | When you detach, or when the server exits. With `--detach`, at once. |
| Ctrl+C | Stops the server. | Stops the server. |

A workspace has at most one running server, however it was started.

### The server

The server is a file at the workspace root, determined by the game and the loader that [`lip setup`](setup.md) installed:

| The workspace has | Server | Run |
| --- | --- | --- |
| A loader (LeviLamina) | `bedrock_server_mod.exe` | Directly by lip on Windows; through Wine on Linux and macOS. |
| No loader, and the build `windows` | `bedrock_server.exe` | The same. |
| No loader, and the build `linux` | `bedrock_server` | Directly by lip, only on Linux on x64. |

For the Linux server, lip sets the environment variable `LD_LIBRARY_PATH` to `.` if it is unset or empty, so that the server finds the libraries next to it.

On Windows, if the Visual C++ runtime is installed only for the user (in the [data directory](../files.md#data-directory)) and not system-wide, lip puts its directory first in `PATH` for the Windows server so that the server can find it.

When running through Wine, lip always uses the `wine` it installed in its [data directory](../files.md#data-directory), never another installation. It passes the absolute path of the server file as the only argument and sets:

| Variable | Value |
| --- | --- |
| `WINEPREFIX` | If unset or empty: the absolute path of `.lip/wine` in the workspace. Wine creates the prefix if it is missing. |
| `WINEDEBUG` | If unset: `-all`, which silences Wine's debug output. |
| `WINEDLLOVERRIDES` | If unset: `mscoree,mshtml=;winemac.drv,winex11.drv=d`, which disables Wine Mono, Wine Gecko, and Wine's macOS and X11 graphics drivers. This prevents any program from waiting for a window or window server, such as when running over SSH without a desktop session. |

See [Linux and macOS](../../guides/linux_macos.md).

### Starting

Without `--managed`, `lip run` performs these steps in order:

1. Acquires the **server lock**, `.lip/server.lock`. If another process holds it, a server is already running in the workspace, and the command fails with a message saying so.
2. Acquires the **workspace lock**. If another process holds it, another command is modifying the workspace, and the command fails.
3. Completes or rolls back any interrupted operation. If that fails, the command fails.
4. Releases the workspace lock.
5. Fails if the workspace has no game (the message mentions `lip setup`), if the server is `bedrock_server` and lip is not running on Linux on x64, or if the server file does not exist.
6. For the Windows servers, installs any missing system dependencies: Wine on Linux and macOS, and the Microsoft Visual C++ runtime on Windows (which lip installs for the user without administrator privileges). If this fails, the command fails.
7. Runs the server and waits for it to exit.
8. If the server is [restarted](#restarting), returns to step 2.
9. Releases the server lock.

Because the workspace lock is not held while the server runs, you can run `lip install`, `lip uninstall`, and `lip update` in the same workspace from another terminal. Their changes take effect the next time the server starts. The interface does not run these operations while the server is running; it asks you to stop the server first.

### Input and output

The server writes to the standard output and standard error of `lip`, and reads from the standard input of `lip`, so you can type server commands as usual. The server's input does not close when the input of `lip` ends. A restarted server continues reading any input that arrived after the previous server exited.

### Stopping

lip is **asked to stop** by Ctrl+C, by the `SIGINT`, `SIGTERM`, and `SIGHUP` signals, and on Windows by any console control signal, such as closing the console window.

The first time lip is asked to stop, it sends the line `stop` to the server, which saves the world and exits. If lip is asked to stop before the server has started, it sends the line as soon as the server starts. lip never exits before the server does, no matter how many times it is asked. If the server hangs, terminate the server process yourself.

### Restarting

The server restarts when all of the following are true:

- It exited with an exit code other than 0.
- lip was not asked to stop.
- [`restart`](../configuration.md#restart) in the workspace configuration is `on-failure` when the server exits.

lip then writes a message, waits 5 seconds, and restarts the server from step 2. Asking lip to stop during the wait cancels the restart.

The server restarts at most 5 times within 10 minutes. If it exits again after that, lip writes a message that it will not restart it again, and exits.

### Managed servers

A **managed server** is a server that the [daemon](daemon.md) runs independently of any single client. It runs as described above, using the working directory and environment variables of the `lip` process that started it, with these differences:

- It keeps running regardless of what happens to the client that started it.
- It receives input from attached clients and the interface, and sends its output to all of them.
- Only an attached client or the interface can ask it to stop.
- It never prompts for input. On a Mac with Apple silicon without Rosetta 2, it installs Rosetta 2 only if the `lip run --managed` command that started it included `--accept-rosetta-license`; otherwise, it fails. A server started in the interface prompts there instead. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon).

The daemon runs at most one managed server per workspace. A server started on the [Server](../../interface/server.md) page of the interface is also a managed server, and you can attach to it from a terminal.

With `--managed`, `lip run` does the following in order:

1. If lip runs the command directly without the daemon, the command fails: only the daemon can run managed servers.
2. If no managed server is running for the workspace, it starts one and waits until the server has started. If starting the server fails, the command fails in the same way.
3. With `--detach`, the command exits. Otherwise, the client **attaches**.

### Attaching

While you are attached to a managed server:

- Anything you type goes to the server. Reaching the end of standard input does not detach you.
- Server output and lip messages about the server are written to your terminal. If the server was already running, you may first see some of its earlier output.
- Ctrl+C (`SIGINT`; on Windows, also Ctrl+Break) asks the server to stop. You remain attached until it exits.
- Closing the terminal (`SIGHUP`), `SIGTERM`, other Windows console control signals, or terminating the `lip` process will **detach** you: the command exits, and the server keeps running.

If the server stops while you are attached, the command exits.

To leave a managed server running, close the terminal window or tab. Run `lip run --managed` in the workspace again to reattach.

## Options

| Option | Description |
| --- | --- |
| `--managed` | Run the server as a managed server, or attach to one that is already running. |
| `--detach` | With `--managed`, do not attach. Without `--managed`, this is a usage error. |
| `--accept-rosetta-license` | Accept the Rosetta 2 license so lip can install it without prompting on a Mac with Apple silicon that lacks it. See [macOS on Apple silicon](../../guides/linux_macos.md#macos-on-apple-silicon). |
| `-h`, `--help` | Show help and exit. |

## Output

`lip run` has no result of its own. Standard output and standard error carry what the server writes to them. Messages from lip, such as the notice before a restart, are written to standard error.

## Exit status

Without `--managed`:

| Case | Exit code |
| --- | --- |
| The server started | The exit code of the last server run, or of `wine` if it ran through Wine. On Linux and macOS, 128 + n if terminated by signal n (for example, 137 for `SIGKILL`). lip writes no message of its own. |
| The server did not start | Not 0, with a message explaining why. |

With `--managed`:

| Case | Exit code |
| --- | --- |
| `--detach` was passed, or you detached | `0` |
| The server stopped while you were attached | The exit code of the managed server's `lip run`, as in the table above. |
| The managed server could not be started | Not 0, with a message explaining why. |

## Examples

Run the server in the foreground. Press Ctrl+C to stop it:

```shell
lip run
```

Start the server in the background and return immediately:

```shell
lip run --managed --detach
```

Attach to it later to view output and enter commands:

```shell
lip run --managed
```

Automatically restart the server if it crashes:

```shell
lip config set restart on-failure --workspace
lip run --managed --detach
```

## See also

- [A server from the command line](https://levimc.org/tutorials/server/command-line/)
- [Server](../../interface/server.md): starting, stopping, and monitoring the server in the interface.
- [`lip setup`](setup.md), [`lip daemon`](daemon.md), [`lip config`](config.md)
- [Linux and macOS](../../guides/linux_macos.md)
