# Server

The Server page is where you set up the server for the selected workspace, and it is also the server's console. After reading this page, you will know how to set up a server, change its game or loader version, start and stop it, read what it writes, send it commands, have it restart after a crash, and what happens to it when you quit lip.

If the keys or the parts of the screen are new to you, read [A tour of the interface](./tour.md) first.

## The parts of the page

![The Server page while the server runs. Numbers mark the state line, the output and the input line.](/screenshots/en/server-02-running.svg)

1. **The state line** shows whether the server is running. Below it are the **Start** or **Stop** button, the **Auto restart** option, and the **Change versions…** button.
2. **The output** is what the server writes.
3. **The input line** is where you type commands for the server. It appears only while the server is running.

`Tab` moves from one part to the next: the buttons and the option, the output, and the input line. `←` and `→` move between the buttons and the option.

## Every state of the server

The state line always shows one of the following.

### No server here yet

A folder without the game has nothing to run. The page offers one button.

![The Server page of an empty folder. It says "No server here yet." and has a button "Set up server…", with the line "Installs a game version and a loader in this workspace." below it.](/screenshots/en/server-03-no-server.svg)

Press `Enter` to set up a server in this workspace. [Set up the server](#set-up-the-server) describes every step.

### Stopped

`○ Stopped` means that the server is not running and has not run since lip started. The output is empty.

![The Server page of a stopped server. The Start button is highlighted, and the output says "No output yet."](/screenshots/en/server-01-stopped.svg)

Press `Enter` on **Start** to start it.

### Running

When you press Start, the state is `● Starting` until the server program begins running. That usually takes a moment. It takes longer when lip first has to prepare the system for the server, such as the Visual C++ runtime on Windows or Wine on Linux and macOS. If that fails, lip shows the failure, and the state returns to `○ Stopped`.

Then the state becomes `● Running`. The server counts as running from the moment its program runs, even while it is still loading its world and its mods.

![The Server page right after Start. The state says "Running · 00:00:00", the button is now Stop, the output has one gray line, and the input line has appeared.](/screenshots/en/server-05-just-started.svg)

1. `● Running`, followed by how long the server has been running, in hours, minutes, and seconds.
2. The button is now **Stop**.
3. Gray lines between dashes are written by lip itself, not by the server.
4. The input line appears, and focus moves into it.

The top line of lip also shows `● Running`, and the Server entry in the sidebar gets a `●`. You can go to other pages; the server keeps running.

The server is ready for players when it writes `Server started.` in its output.

::: info
If the server cannot be started at all—for example, because a game file is missing—lip shows a failure dialog and the state stays "Stopped". See [When something fails](./tour.md#when-something-fails).
:::

### Stopping

After you ask the server to stop, the state is `● Stopping` until the server has ended. A server usually needs a few seconds to save its world.

![The Server page after Ctrl+C. The state says "Stopping", and the output has the gray line "asking the server to stop".](/screenshots/en/server-08-stopping.svg)

1. lip has asked the server to stop and is waiting for it.
2. lip sent the `stop` command to the server.

Meanwhile, the Stop button is gray: asking twice does nothing more.

### Exited with a code

When the server has ended, the state is `○ Exited with code` followed by a number. Code `0` means that the server ended normally. Any other code means that something went wrong.

![The Server page of a server that has ended. The state says "Exited with code 0", the button is Start again, and the output is still there.](/screenshots/en/server-09-exited.svg)

1. The server is not running.
2. **Start** starts it again.
3. The output remains, so you can read why the server ended.

### Restarting

When the server ends with a code other than `0`, you did not ask it to stop, and **Auto restart** is on, lip starts it again after 5 seconds. Meanwhile, the state is `● Restarting`, followed by the code that the server ended with.

![The Server page after a crash. The state says "Restarting · Exited with code -1073741819", Auto restart is checked, and a yellow line of lip says that it restarts the server in 5 seconds.](/screenshots/en/server-11-restarting.svg)

1. lip waits, then starts the server again.
2. How the server ended.
3. Auto restart is on.

If you press `Ctrl+C` or **Stop** while lip is waiting, the server is not started again.

### Running outside this interface

You can also start a server with the plain `lip run` command in another terminal. lip then knows only that the server is running, and nothing more.

![The Server page says "Running outside this interface". Below the button, a line says "Another `lip run` started it. Stop it there."](/screenshots/en/server-10-elsewhere.svg)

1. The server is running, but this interface did not start it.
2. **Start** does nothing here, and there is no Stop button.
3. Stop the server where it was started.

There is no output and no input line, because they belong to the terminal that started the server. Everything else that depends on a running server still applies: mods cannot be changed until the server has stopped.

## Set up the server

**Set up server…** installs a server in the selected workspace: the game and, for a modded server, LeviLamina. It asks a few questions, one dialog after another, and then runs the installation. `Esc` goes back one step; in the first step, it closes the dialogs without changing anything.

Step 2 on the [Home](home.md) page starts the same process. [Your first server](https://levimc.org/tutorials/server/first-server/) walks through it once from start to finish; this section describes every choice.

### Where the server goes

The server is installed in the selected workspace—the folder named on the top line.

![The Server page of a folder without a server. The button "Set up server…" is marked, and the line below it says "Installs a game version and a loader in this workspace."](/screenshots/en/new-server-01-where.svg)

1. The server goes into the selected workspace, which is named on the top line.

To set up a server in another folder, select that folder first in the [workspace picker](workspaces.md): either an existing folder or a new one created with **Add folder…**. Then return to this page and press `Enter` on **Set up server…**.

### Step 1: the game version

lip fetches the list of downloadable game versions, which takes a moment, and displays them: releases first (from newest to oldest), followed by previews marked **preview**.

![The dialog "Game version" lists 1.26.60 down to 1.21.130. Most rows show "LeviLamina ✓"; the first is marked "newest".](/screenshots/en/new-server-04-game-version.svg)

The column next to the version indicates whether it supports mods:

![The same list with the row 1.26.30 selected, which shows "No LeviLamina". The line below says "Mods need LeviLamina, which this version lacks."](/screenshots/en/new-server-12-no-levilamina.svg)

1. **LeviLamina ✓**: a version of LeviLamina supports this game version. Choose one of these for a server with mods.
2. **No LeviLamina**: no version of LeviLamina was built for this game version. It can only run as a plain server.
3. The same information in words, for the selected row.

::: info Why the column matters
Mods do not run on the game itself. They need **LeviLamina**, the loader, and each LeviLamina release is built for one specific game version. The newest game version is not always supported yet.
:::

lip gets this column from the mod catalogue on levimc.org. If the catalogue does not respond within a few seconds, the list appears without this column; the loader step will still tell you what is compatible.

Select a version with `↑` and `↓`, then press `Enter`.

### Step 2: the build (Linux on x64 only)

The game comes in two **builds**: the Windows server and the Linux server. LeviLamina and its mods require the Windows server.

lip asks for the build only where both can run: on Linux with an x64 processor, and for a game version that offers both. Everywhere else, the build is `windows` and this step is skipped. On Linux, if a version has only one of the two builds, the version list notes it:

![The list of game versions on Linux. The row 1.26.30 shows "windows only" after "No LeviLamina".](/screenshots/en/new-server-16-linux-games.svg)

1. A version with no Linux server: lip does not ask for the build.

![The dialog "Build" with the rows windows and linux. linux is selected, and the line below says "No loader; for Linux on x64 only."](/screenshots/en/new-server-17-build.svg)

1. **windows**: the Windows server, which lip runs through Wine. This is the build that supports LeviLamina and its mods.
2. **linux**: the Linux server. It runs without Wine, has no loader, and cannot run mods. lip skips the loader step.

[Linux and macOS](../guides/linux_macos.md) covers Wine and the Linux server in more detail.

### Step 3: the loader

lip looks for the LeviLamina versions that match the game version you chose—which may take a moment—and lists them, newest first, followed by **No loader**.

![The dialog "Loader" lists LeviLamina 26.60.3, marked "newest", down to 26.60.0, then "No loader". The line below says "Lets the server run mods."](/screenshots/en/new-server-05-loader.svg)

For a modded server, press `Enter` on the first row to select the newest LeviLamina.

**No loader** installs only the game: a plain server that cannot run mods.

![The same dialog with "No loader" selected. The line below says "A plain server, without mods."](/screenshots/en/new-server-14-no-loader.svg)

If no version of LeviLamina supports the game version, this step tells you so. It is not a dead end:

![The dialog "Loader" starts with "No LeviLamina version supports this game version." and has two rows, "No loader" and "Back".](/screenshots/en/new-server-13-no-loader-fits.svg)

1. **No loader** continues with a plain server.
2. **Back** returns to the game versions, where you can choose one marked **LeviLamina ✓**. `Esc` does the same.

### Step 4: the plan

lip shows what it will install, without installing anything yet.

![The dialog "Set up server" lists three lines that start with "Dry run:" and has the buttons Apply and Cancel.](/screenshots/en/new-server-06-plan.svg)

These lines show the command's output, in English: here, the game, LeviLamina, and a note that lip will ask you to accept the license.

- **Apply** starts the installation.
- **Cancel** installs nothing. The page still offers **Set up server…**.

### Step 5: the license

The game belongs to Microsoft. Before lip downloads it, you must accept the Minecraft End User License Agreement and the Microsoft Privacy Policy. Read them at the two addresses shown.

![The dialog "Minecraft EULA" names the two documents, gives their addresses, and has the buttons Accept and Decline.](/screenshots/en/new-server-07-eula.svg)

**Accept** continues. **Decline** installs nothing:

![The same dialog with the button Decline marked.](/screenshots/en/new-server-15-eula-decline.svg)

The workspace stays as it was, and the page offers **Set up server…** again.

![The Server page after Decline: "No server here yet." and the button "Set up server…", which is marked.](/screenshots/en/new-server-18-not-set-up.svg)

### Step 6: download and result

lip downloads and installs the game and LeviLamina. Pressing `Esc` cancels the setup and undoes any changes made so far.

![The dialog "Set up server" shows two downloads, one at 100% and one at 62%.](/screenshots/en/new-server-08-progress.svg)

When finished, the dialog lists what was installed and ends with **✓ Done.** Press `Enter`.

![The dialog "Set up server" lists the two packages that were installed and ends with "Done." and the button OK.](/screenshots/en/new-server-09-result.svg)

The page now shows the server, stopped and ready to start.

![The Server page with the state "Stopped", the buttons "Start" and "Change versions…", and the option "Auto restart". Start is marked.](/screenshots/en/new-server-10-workspace.svg)

1. **Change versions…** sets up the server again with different versions.

Press `Enter` on **Start** to start the server, or go to the [Marketplace](get_mods.md) first.

::: details The same with a command
This setup runs [`lip setup`](../reference/commands/setup.md) in the selected workspace with your choices, for example:

```shell
lip setup --game 1.26.60 --loader levilamina@26.60.3
```

With **No loader**, it uses `--no-loader`, and with the Linux server, `--build linux`.
:::

## Change the game or the loader version

To move a server to another game version or another LeviLamina version, set it up again with **Change versions…**. You follow the same steps as in [Set up the server](#set-up-the-server), and each dialog defaults to what the server currently uses.

1. Press `→` twice to move from **Start** to **Change versions…**. The status line reads **Another game or loader.** Press `Enter`.

   ![The Server page of a stopped server. The button "Change versions…" is marked, and the sentence after it says "Another game or loader."](/screenshots/en/workspaces-14-change-button.svg)

2. Choose the game version. The server's current version is marked **installed** and selected by default.

   ![The dialog "Game version" with 1.26.60 selected, which is marked "newest" and "installed".](/screenshots/en/workspaces-14-change-game-version.svg)

3. Choose the loader. The dialog starts on the server's current LeviLamina version, or on **No loader** if none is installed.

   ![The dialog "Loader" with LeviLamina 26.60.2 selected, one row below the newest.](/screenshots/en/workspaces-15-change-loader.svg)

4. Review the plan, and choose **Apply**.

   ![The dialog "Set up server" says that lip would uninstall LeviLamina 26.60.3 and install LeviLamina 26.60.2, with the buttons Apply and Cancel.](/screenshots/en/workspaces-16-change-plan.svg)

   1. What lip will remove and install, shown in the command's own wording.
   2. Nothing changes until you choose **Apply**.

While the server is running, **Change versions…** is dimmed, and selecting it displays **Stop the server first.** lip will not change the game while the server is running.

::: warning Mods that do not fit the new version
Each mod is built for specific LeviLamina versions. If an installed mod has no version compatible with the game or LeviLamina version you chose, the plan lists that mod and states that the setup will uninstall it. Choosing **Apply** uninstalls those mods. Choose **Cancel** to leave everything unchanged.
:::

If you select the versions that the server already has, nothing needs to change, and the plan shows only **Close**:

![The dialog "Set up server" says "Nothing would change." and has one button, Close.](/screenshots/en/plan-02-no-changes.svg)

Changing the game preserves `server.properties`, `allowlist.json`, `permissions.json`, and your worlds. It deletes the remaining files from the old game, including any packs you copied into `behavior_packs/` or `resource_packs/`; see [What survives a game change](../reference/files.md#what-survives-a-game-change) for the full list. Back up the folder first: an older game version may not be able to open a world saved by a newer one.

### A server with the Linux build on another system

A workspace set up with the Linux server runs only on x64 Linux. On any other system, lip cannot offer that build. It warns you before you make any choices and switches to the Windows server:

![The dialog "Game version" starts with two lines: "This workspace has the linux build, which does not run on this system. The setup replaces it with the windows build."](/screenshots/en/workspaces-17-linux-build.svg)

1. The notice, shown before you make any choices.

The plan then reflects the build change in its title, **Switch to windows**, and lists the Linux server among the items to uninstall:

![The dialog "Switch to windows" lists that lip would uninstall the Linux game and install the Windows game and LeviLamina.](/screenshots/en/workspaces-18-switch-to-windows.svg)

## Starting and stopping

To start the server, select **Start** and press `Enter`. Step 4 on the [Home](./home.md) page does the same.

To stop the server, either:

- press `Ctrl+C` anywhere on the Server page, or
- press `Tab` until **Stop** is highlighted, then press `Enter`.

Both methods send the `stop` command to the server so that it saves the world and shuts down cleanly. lip never forcefully terminates the server.

::: warning
On every other page, `Ctrl+C` asks whether you want to quit lip. It stops the server only on the Server page, and only while the server is running.
:::

## Reading the output

While focus is in the input line, the output pane scrolls with the server, and new lines appear at the bottom.

To scroll back, press `Esc` from the input line. Focus moves to the output pane, and its title brightens.

![The output has the focus and is scrolled back. Marks at its right edge show that there is more above and below.](/screenshots/en/server-06-output-scrolled.svg)

1. The output pane has focus.
2. `▲` and `▼` indicate that there are more lines above and below.
3. The scrolling keys.

| Key | Does |
| --- | --- |
| `↑` `↓` | Scroll one line. |
| `PgUp` `PgDn` | Scroll one screenful. |
| `Home` | Goes to the first line. |
| `End` | Goes back to the last line. |

While you are scrolled back, the view stays in place even as the server writes new lines.

To return to the input line, press `End` followed by `↓`, or press `Tab`.

## Sending commands to the server

Type a server command in the input line and press `Enter`. The gray `list` in the empty line is just an example and is not sent.

![The input line holds the text "say Welcome to Survival".](/screenshots/en/server-02-running.svg)

The server's response appears in the output.

lip remembers the lines you send. In the input line, press `↑` to recall the previous line, and `↓` to move forward again. Anything you were typing is saved and returns when you press `↓` past the last line.

![The input line shows "list", brought back with the up arrow. The bottom line names the keys "↑↓ History".](/screenshots/en/server-07-history.svg)

These are Minecraft server commands, such as `list` or `say`, not lip commands.

### Leaving the input line

While the input line is focused, the letters you type go to the server, so use `Esc` to leave it:

1. Press `Esc` to move from the input line to the output.
2. Press `Esc` again to move to the sidebar.

`Tab` also leaves the input line and moves to the sidebar.

## Auto restart

**Auto restart** controls whether lip restarts the server after a crash. Press `→` to move from the button to the option. A sentence to its right explains what it does. Press `Space` to toggle it.

![The option "Auto restart" is checked and highlighted. At its right is the sentence "Restarts after a crash."](/screenshots/en/server-04-auto-restart.svg)

When this option is on:

- A server that exits with a code other than `0` restarts after 5 seconds.
- A server that you stopped, or that exited with code `0`, does not restart.
- After 5 restarts within 10 minutes, lip gives up and says so in the output. Read the output above that line to see why the server keeps failing.

This option is saved per workspace, so each server has its own setting. The [Settings](./settings.md) page shows the same option.

## Quitting lip while the server runs

When you quit lip while a server is running, the prompt tells you what will happen to it.

![The question "Quit lip?" with a second line: "Running servers keep running."](/screenshots/en/server-12-quit-keeps-running.svg)

Normally, the server **keeps running**. lip runs servers in its own background program, the daemon, which stays running when the interface closes. You can close the terminal. To return, open a terminal in the same folder and run `lip`: the Server page shows the server and its recent output, and you can send commands and stop it as before.

In the rare case where lip cannot use its daemon and runs everything itself, the prompt says something else:

![The question "Quit lip?" with a second line: "Running servers stop first."](/screenshots/en/server-13-quit-stops.svg)

If you choose **Quit** then, lip asks each running server to stop, shows the Server page while they shut down, and quits once they have all stopped.

## Managed servers

A server started on this page is a managed server: lip's daemon runs it, and no terminal owns it. That is why it keeps running when you quit, why several terminals can show the same server at once, and why each workspace can run its own server at the same time. The `lip run --managed` command starts and shows these same servers. [A server from the command line](https://levimc.org/tutorials/server/command-line/) explains how they work and how to stop one without the interface.
