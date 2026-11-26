# Troubleshooting

This page explains how to read lip's output when a command fails, find the failure report, and fix the most common failures.

## Read the failure

When a command fails, lip writes three things to the terminal:

```text
error: There is no server to run: 'D:\servers\survival\bedrock_server_mod.exe' is not a file, though the workspace has the game bds 1.26.60 with a loader. It may have been deleted or moved by hand. lip does not install a package again that is installed in the same version, so setting up the same versions here does not bring the file back. Restore it from a backup, or run 'lip setup --game 1.26.60 --loader levilamina@26.60.3' in an empty folder and copy the file from there.

Full report: .lip\logs\20261114T201502Z-4120.log
```

1. **`error:`** What went wrong. When one problem was caused by another, each cause follows on its own line starting with `caused by:`.
2. **`hint:`** What you can do about it. There may be several hints, or none.
3. **`Full report:`** The file that holds everything lip knows about the failure.

Read the error and the hints first. Most of the time they are enough.

The interface shows the same information in a dialog:

![The Server page with a dialog titled "Start server · Failed". The dialog shows the error that there is no server to run because bedrock_server_mod.exe is missing, and below it the path of the full report in .lip\logs. Note 1 marks the error, note 2 the report.](/screenshots/en/dialog-01-failure.svg)

### The failure report

- **Where:** `.lip/logs/` in the folder where you ran the command, or in the selected workspace in the interface.
- **Name:** the time of the failure in UTC and the ID of the lip process, as in `20261114T201502Z-4120.log`.
- **How many:** lip keeps the newest 20 and deletes older ones.
- **Format:** plain text. Open it with any editor.

A report has five parts:

| Part | Holds |
| --- | --- |
| `Environment` | The time, the lip version, the command, the folder, your system, the config and cache directories, whether the daemon carried out the command, and the proxy variables that are set. |
| `Error` | The error and the hints, as shown in the terminal. |
| `Exception` | The error in full technical detail. |
| `Workspace (.lip)` | What `.lip` holds, and the journal of an interrupted operation if there is one. |
| `Trace` | What lip did, step by step: network requests, versions it considered, files it changed, and the output of package programs. |

lip replaces passwords and tokens in URLs, such as proxy credentials, with `***`. Even so, look the file over before sharing it: it lists your folders and packages.

Some failures write no report:

- **A mistake in the command line**, such as an unknown option. lip explains the mistake and adds `Run lip --help to see how to use lip.`
- **A command you cancelled.** lip writes `Cancelled. Any changes to the workspace were undone.`
- **A server that ran and then failed.** `lip run` passes on the server's exit code and adds nothing. Read the server's output.

When the report itself cannot be written—for example, on a read-only disk—lip prints the most important part to the terminal instead.

### Ask for help

If the error and hints do not help, open an issue at <https://github.com/LiteLDev/lip/issues> and attach the report. If a hint says `This looks like a bug in lip`, please report it: the fault is ours, not yours.

## Another lip is changing the workspace

```text
error: lip cannot take the workspace lock 'D:\servers\survival\.lip\lock': most likely another lip command is changing the workspace 'D:\servers\survival'. Wait for the other lip command to finish, then try again. If no other lip command is running, a program may be holding the lock file open: close it, then try again.
```

Only one command at a time may change a server folder. While `lip setup`, `lip install`, `lip update`, or `lip uninstall` is working there, or while the interface is applying a change, a second command does not wait: it fails immediately and changes nothing.

`lip run` can fail this way too. Just before it starts the server, and before each automatic restart, it checks the folder for an interrupted change, and for that moment it needs the same lock.

What to do:

1. **Wait** for the other command to finish, then run yours again. Check your other terminals, and the interface if it is open.
2. **If no lip is working**, another program has the file `.lip/lock` open. Backup tools, sync tools, and editors can do this. Close that program and try again.

You never need to delete `.lip/lock`. The lock is not the file itself, but an operating-system hold on it, which ends automatically when the lip process holding it exits—even if it crashes.

Commands that only read, such as `lip list`, and all dry runs do not take the lock and never fail this way.

## A file is in use

```text
hint: A file is in use by another program. Stop the server and other programs that use the workspace, then try again.
```

This happens on Windows, where a running program keeps its files open and nothing else can replace or delete them. Most often, that program is the server itself: you changed packages while it was running, and a file that lip must replace belongs to the running game or a loaded mod.

lip has undone its changes. The workspace is as it was.

What to do:

1. **Stop the server.** Press Ctrl+C in its terminal, or choose Stop on the Server page of the interface.
2. **Close other programs** that have files in the folder open, such as an editor with a configuration file open.
3. **Run the command again.**

If lip adds `Some changes could not be undone`, a file was held so firmly that lip could not even put it back. Follow the same three steps. The next `lip install`, `lip update`, `lip uninstall`, or `lip setup` in the folder will finish the clean-up before doing anything else. See [After a crash or a power cut](#after-a-crash-or-a-power-cut).

The interface avoids this: it does not change a workspace's packages while its server is running.

## GitHub cannot be reached

lip downloads most packages from GitHub. The hint tells you what went wrong:

| Hint starts with | Meaning | What to do |
| --- | --- | --- |
| `lip could not reach the server.` | No response at all: there is no network connection, or GitHub is blocked or very slow. | Check your connection. Then see [When GitHub is slow or blocked](configuration.md#when-github-is-slow-or-blocked). |
| `The server refused the request, possibly because too many requests were sent.` | GitHub or your proxy limits how much you may download. | Wait a few minutes and try again. |
| `The repository or file does not exist, or is private.` | The name is wrong, or the repository is not public. | Check the name and version for typos. lip installs from public repositories only. |
| `The server had a problem.` | GitHub or the site is having trouble. | Try again later. |
| `A file that <package> <version> publishes is missing from where its package file says it is` | The package points to a download that no longer exists. | Install another version with `<package>@<version>`, and notify the package author. |

If you have set a GitHub proxy and the message says that the proxy does not support git repositories, the proxy cannot do what lip needs. Remove it with `lip config delete github_proxy`, or set another proxy.

The interface checks whether it can reach GitHub when it starts. If it cannot and you have not made a choice yet, it asks whether to set a proxy, connect directly, or decide later.

## The server does not start

`lip run`, or Start in the interface, fails before the server runs. Find your message below.

**`There is no server to run: this workspace has no game.`**

The folder has not been set up, or you are in the wrong folder. Go to the server folder, or set one up with `lip setup --game <version>`. See [`lip setup`](../reference/commands/setup.md).

**`A server of the workspace '…' is already running`**

A server in this folder is already running, and a folder can run only one server at a time. Find it and stop it where it is running:

- It may be running in **another terminal**, started by `lip run`. Press Ctrl+C there.
- It may be a **managed server**, started in the interface or with `lip run --managed`. Run `lip run --managed` to attach to it, then press Ctrl+C. Or choose Stop on the Server page of the interface.

In the interface, the Server page shows **Running outside this interface** for a server that it did not start and cannot control—one started by a plain `lip run`, or run by another user on the machine. The interface cannot stop it or show its output. Stop it where it was started.

**`There is no server to run: '…' is not a file`**

The folder is set up, but the server executable is missing. It may have been deleted or moved by hand, or removed by security software. Setting up the same versions again in this folder will not restore it, because lip does not reinstall a package when the same version is already installed. Restore the file from a backup. Without a backup, run the `lip setup` command shown in the message in an empty folder, then copy the missing file from there into this folder. Alternatively, move to that new folder: install your mods there, and copy `worlds/`, `server.properties`, `allowlist.json`, `permissions.json`, and your mod settings over from the old folder.

**`The game of this workspace is the Linux server … which lip runs only on Linux on x64.`**

Run it on Linux on x64, or set up the Windows server: `lip setup --game <version> --build windows`. See [Linux and macOS](linux_macos.md).

**`lip could not install the Microsoft Visual C++ runtime into …`**

The Windows server requires this runtime. lip installs it for you without administrator privileges by extracting the files into a folder in its [data directory](../reference/files.md#data-directory), and that failed. The rest of the message explains why—for example, the disk is full or security software blocked lip from writing there. lip never uses files that were not completely extracted. Fix the cause and run the command again, or install the runtime for all users yourself from <https://aka.ms/vc14/vc_redist.x64.exe>, which requires an administrator.

**`Rosetta 2 is not installed`**

A Mac with Apple silicon needs Rosetta 2 to run lip's Wine, and lip did not install it: you answered no, lip could not prompt you because no one was at the terminal, or the installation failed. Run the command again in a terminal and answer yes, pass `--accept-rosetta-license` to the command, or install Rosetta 2 yourself with `softwareupdate --install-rosetta --agree-to-license`. See [macOS on Apple silicon](linux_macos.md#macos-on-apple-silicon).

**`lip run --managed needs the daemon of lip`**

See [lip carries out the command itself](#lip-carries-out-the-command-itself).

**The server starts and then exits.**

This means the server itself failed, not lip. `lip run` exits with the server's exit code and writes no report. Check the last lines of the server's output. Common causes are a port already in use by another program, a broken world, or a mod that fails to load. To test for a faulty mod, remove the one you installed last.

When `restart` is `on-failure` and the server keeps failing, lip stops trying after 5 restarts within 10 minutes:

```text
⚠ The server exited with code 1. lip restarted it 5 times within 10 minutes, so it does not restart it again. Look at what the server wrote above for why it fails.
```

## A daemon of another version

lip does its work in a background process called the daemon, which the first command starts. After you update lip, the daemon from the old version may still be running.

Usually, you will not notice. The new lip asks the old daemon to exit; when the daemon is idle, it exits and a new one starts.

An old daemon that is busy—carrying out a command or running a managed server—stays running. In that case, the new lip says:

```text
lip could not have its daemon carry out the command (the daemon of lip 0.41.0 that runs carries out a command or runs a managed server); it carries it out itself.
```

Your command still works. To switch to the new daemon:

1. Check what is running: `lip daemon status`.

   ```text
   The daemon of lip 0.41.0 runs as process 4120, carrying out 0 commands.
   ```

2. Stop the managed servers. For each one, run `lip run --managed` in its folder and press Ctrl+C, or stop it in the interface. `lip run --managed` continues to work with the old daemon for this purpose.
3. Run `lip daemon stop`. The next command will start the new daemon.

If the daemon is still busy, `lip daemon stop` refuses to stop it and says so. It never stops a server for you.

## lip carries out the command itself

```text
lip could not have its daemon carry out the command (<reason>); it carries it out itself.
```

lip could not start or reach its daemon, so it ran the command in the process you started instead. This is a fallback, not a failure: the command does the same thing.

Two things work differently without the daemon:

- **`lip run --managed` fails.** Managed servers run inside the daemon. Run the server with a plain `lip run`, or fix the daemon first.
- **The interface does not keep servers running.** Servers started from the interface stop when you quit it. The interface warns you when you quit.

The reason in parentheses explains what went wrong:

| Reason | What to do |
| --- | --- |
| `the daemon of lip <version> that runs carries out a command or runs a managed server` | See [A daemon of another version](#a-daemon-of-another-version). |
| `the daemon that lip started did not listen within 10 seconds`, `the daemon that lip started does not listen` | The daemon could not start. Run the command again. If the problem persists, report it along with the output of `lip daemon status`. |
| `the daemon keeps exiting`, `the daemon keeps being replaced` | The daemon exited or was replaced several times in a row while lip was connecting. This happens when two versions of lip are used at the same time. Use a single version, then run the command again. |
| A system error, such as access denied | On Linux and macOS, check that you have write access to the socket directory: `$XDG_RUNTIME_DIR/lip`, or `~/.local/state/lip` when that variable is unset. |

A different message, `lip: the daemon ended before the command did.`, means the daemon was killed while handling your command. Run the command again. If it was modifying a workspace, the next command in that workspace will clean up first.

## After a crash or a power cut

If lip is killed or the machine loses power while a command is modifying a server folder, the changes are left incomplete. lip is built to handle this. Before changing any file, it records the change in `.lip/journal` and keeps the old version alongside it until the command finishes.

You do not need to do anything special. The next time you run `lip setup`, `lip install`, `lip update`, `lip uninstall`, or `lip run` in that folder, lip repairs the state first and tells you what it did:

```text
⚠ A lip operation on this workspace was interrupted (it started at <time>); undid its <n> changes. The workspace and its state file are as they were before it.
```

The interrupted command had not finished, so lip rolled it back. Run the command again.

```text
Finished an interrupted lip operation that had completed (it started at <time>): deleted the backups it left.
```

The interrupted command had done everything except clean up, so lip finished it. You do not need to re-run it.

If lip cannot restore a file—for example, because the server still has it open—it fails, lists the affected files, and keeps the journal. Stop the server and any other programs using the folder, then run any of those commands again. lip will pick up where it left off.

::: danger
Do not delete `.lip/journal`, and do not delete files named `.<name>.bak` in the server folder while the journal exists. lip needs them to restore your files.
:::

A dry run, as well as the plan shown in the interface before you apply changes, only reports the interruption without repairing it.

## Clean the cache

lip caches downloaded files so it does not have to download the same file twice. The cache only saves time; deleting it loses no data.

```sh
lip cache clean
```

```text
✓ Cache cleaned successfully.
```

Clean the cache when:

- **You need the disk space.** Game downloads are large.
- **A download seems broken** and the same installation keeps failing. lip automatically replaces cached files that are not valid ZIP archives, so this is rarely needed.

Do not clean the cache while another lip command is downloading, or that command may fail. If it does, run it again afterwards.

Your servers, settings, and lip's Wine installation are not stored in the cache and are not affected. In the interface, you can do the same by clicking "Clear cache" on the Settings page.

## Other messages

| Hint | What to do |
| --- | --- |
| `lip is not allowed to access a file.` | Check that the file is not read-only and that your user has write access to the server folder. |
| `The disk is full.` | Free up some space—for example, with `lip cache clean`—and try again. |
| `A hook command of a package failed.` | A program that a package runs during installation or removal failed. Its output appears above the error and in the `Trace` section of the report. This is an issue with the package; report it to the package author. |
| `Run lip in an interactive terminal.` | lip needed to prompt you, but its input or output is not a terminal. To accept the Minecraft EULA, add `--accept-eula`. |
| `The game of this workspace is <version>, with LeviLamina <version>; lip install does not change them.` | The requested packages are not compatible with your game or loader version. The error message lists which ones. Install different versions of those packages, or change the game version: see [`lip setup`](../reference/commands/setup.md). |
| `Request other versions of the packages named above, or install fewer of them together.` | The requested packages are not compatible with each other. The error message lists which ones. Install different versions of them, or install fewer of them together. |

## Where files are

Knowing where lip stores its files helps when you are troubleshooting.

| What | Where |
| --- | --- |
| Your server: the game, worlds, `server.properties`, mods | The server folder itself |
| What lip knows about the folder: installed packages, locks, the journal, failure reports, the Wine prefix, workspace settings | `.lip/` in the server folder (hidden on Windows) |
| Your settings | `%APPDATA%\lip` on Windows, `~/.config/lip` elsewhere |
| Cache | `%LOCALAPPDATA%\lip\Cache` on Windows, `~/.cache/lip` elsewhere |
| lip's Wine installation | `~/.local/share/lip` on Linux and macOS |
| The interface's workspace list | `%LOCALAPPDATA%\lip\State` on Windows, `~/.local/state/lip` elsewhere |

Every file and directory is described in [Files and directories](../reference/files.md).
