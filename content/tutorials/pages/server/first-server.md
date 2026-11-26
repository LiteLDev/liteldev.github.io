# Your first server

By the end of this tutorial, you will have a Minecraft Bedrock Dedicated Server (BDS) with LeviLamina, the mod loader, running in its own folder on your computer. You will install it, start it, send it a command, and stop it, all from the interface of `lip`, the LeviMC package installer. The only command you need to type is `lip` itself.

This takes about ten minutes, mostly waiting for downloads.

## What you need

- A computer running one of these systems:
  - Windows 10, Windows 11, or Windows Server 2019 or later, on x64 or arm64.
  - macOS on Apple silicon or Intel.
  - Linux on x64.

  On macOS and Linux, `lip` runs the Windows server through Wine, which it installs automatically.
- A terminal: Windows Terminal or PowerShell on Windows, Terminal on macOS, or your desktop terminal on Linux. It should be at least 80 columns wide.
- An internet connection. `lip` downloads the game from minecraft.net and LeviLamina from GitHub.

You do not need to install anything else beforehand: no .NET, no Git, no Visual C++ runtime, and no Wine. `lip` installs everything the server needs.

## 1. Install lip

Select your system below. This page has preselected the one you are browsing from.

::: tabs

== Windows

Go to the [latest release of lip](https://github.com/LiteLDev/lip/releases/latest), download `lip-<version>-win-x64.msi` (or `lip-<version>-win-arm64.msi` on a PC with an ARM processor), and run it. The installer sets up `lip` and adds it to your `PATH`.

== macOS / Linux

Open a terminal (on a Mac: **Terminal**, in **Applications** › **Utilities**) and run:

```shell
curl -fsSL https://levimc.org/lip/install.sh | sh
```

The script installs `lip` in `~/.local/bin` without requiring an administrator password or root access. If that folder is not in your `PATH` yet, the script asks whether to add it; answer yes.

On a Mac with Apple silicon, `lip` prompts you to install Rosetta 2 the first time it sets up or starts a server. Installing it accepts Apple's license for Rosetta 2.

:::

Next, open a **new** terminal window (any terminal opened earlier will not have the updated `PATH` yet) and check the `lip` version:

```shell
lip -v
```

You should see a version number, such as `0.44.0`. If the terminal does not recognize `lip`, close the window and open a new one.

To install manually from the archive, install a different version, or troubleshoot a failed installation, see [Install lip](https://levimc.org/lip/install.html).

## 2. Start lip

1. Create a folder for your servers, navigate into it, and start `lip`. This tutorial uses `D:\servers`:

   ::: code-group

   ```powershell [Windows]
   mkdir D:\servers
   cd D:\servers
   lip
   ```

   ```shell [Linux and macOS]
   mkdir -p ~/servers
   cd ~/servers
   lip
   ```

   :::

2. You should now see the **Home** page of `lip`. The top bar shows `lip`'s working folder, `D:\servers`. On the left is the sidebar listing the pages in `lip`; on the right is an overview showing that no game is installed in the folder yet, along with four **Next steps**. Step 1, **Choose a workspace**, is already checked because `lip` uses the folder you started it in.

   ![The Home page of lip in the empty folder D:\servers. The sidebar lists eight pages; the overview says that no game is installed; step 1, "Choose a workspace", has a tick.](https://levimc.org/lip/screenshots/en/first-server-01-home.svg)

   You only need a few keys to navigate: `↑` and `↓` to move, `Enter` to open or confirm, and `Esc` to go back. The bottom bar always shows the keys available for the current screen.

::: details lip says "GitHub unreachable"
LeviLamina is hosted on GitHub. If `lip` cannot reach GitHub, it asks how to proceed. Choose **Use a proxy** if you have a GitHub proxy address, **Connect directly** if your network can reach GitHub after all, or **Later** to be asked again next time. Without access to GitHub, `lip` cannot download LeviLamina. You can change this setting later on the **Settings** page.
:::

## 3. Create the server

1. Each server needs its own folder, so create one first. Press `↑` to select **Choose a workspace**, then press `Enter`. The **Workspaces** list opens, showing `D:\servers` marked with a **●** as the folder `lip` is currently working in.
2. Press `Tab` to move to **Add folder…**, then press `Enter`.

   ![The Workspaces list over the Home page: the row "Add folder…", then D:\servers with a dot.](https://levimc.org/lip/screenshots/en/first-server-02-where.svg)

3. The folder browser opens at `D:\servers`. Press `Tab` to reach the buttons, `→` to reach **New folder…**, and `Enter`. Type `survival` and press `Enter`. `lip` creates `D:\servers\survival` and opens it.

   ![The folder browser "Add folder" at D:\servers, which holds only "..". Below are the buttons "Select this folder", "New folder…" and "Cancel".](https://levimc.org/lip/screenshots/en/first-server-03-folder.svg)

4. Press `←` to reach **Select this folder**, then press `Enter`. `lip` adds the folder to the list and uses it from now on: you return to **Home**, the top bar shows `D:\servers\survival`, and **Set up the server** is selected.

   ![The Home page in D:\servers\survival: the top bar names the folder, the overview says that no game is installed, and step 2, "Set up the server", is selected.](https://levimc.org/lip/screenshots/en/first-server-04-home-folder.svg)

5. Press `Enter`. The **Server** page opens and prompts for the **Game version**, with the newest version at the top. Select the newest version marked **LeviLamina ✓** (versions marked **No LeviLamina** cannot run mods) and press `Enter`.

   ![The dialog "Game version" over the Server page lists eight versions; most are marked "LeviLamina ✓". The first, 1.26.60, is selected.](https://levimc.org/lip/screenshots/en/first-server-05-game-version.svg)

   On Linux, if the selected version also has a Linux server build, `lip` prompts for the **Build**: choose **windows**, which is required to run LeviLamina.

6. Choose the **Loader**: keep the newest LeviLamina selected and press `Enter`.
7. Before making any changes, `lip` shows its plan: lines starting with `Dry run:` indicate that it will install the game (`bds`) and LeviLamina. Press `Enter` on **Apply**.

   ![The dialog "Set up server" with three "Dry run:" lines and the buttons "Apply" and "Cancel".](https://levimc.org/lip/screenshots/en/first-server-07-plan.svg)

8. Read the Minecraft End User License Agreement and the Microsoft Privacy Policy at the addresses shown. Press `Enter` on **Accept** to agree to them. If you decline, nothing is installed.
9. Wait while `lip` downloads and installs the files. On the first run, it may also install the Microsoft Visual C++ Redistributable (Windows will ask for permission), or Wine on Linux and macOS.
10. When you see **✓ Done.** press `Enter` on **OK**. The **Server** page now shows **○ Stopped**: the server is set up, and you can start it with the **Start** button.

    ![The Server page after the setup: "○ Stopped", the button "Start", the box "Auto restart", the button "Change versions…", and no output yet. The top bar names D:\servers\survival.](https://levimc.org/lip/screenshots/en/first-server-11-workspace.svg)

## 4. Start the server

1. Return to **Home**: press `Esc` to move to the sidebar, `↑` to select **Home**, and `Enter`. The overview now lists the game and LeviLamina, and **Set up the server** is marked with a tick.

   ![The Home page in D:\servers\survival: the game 1.26.60 and LeviLamina 26.60.3 are installed; steps 1 and 2 have a tick, and step 3, "Install mods", is selected.](https://levimc.org/lip/screenshots/en/first-server-12-home-server.svg)

2. **Install mods** is selected. Skip it for now: press `↓` to select **Start the server**, then press `Enter`.
3. `lip` starts the server and opens the **Server** page. Wait for `Server started.` to appear in the output. Lines marked `[LeviLamina]` confirm that the loader is running.

   ![The Server page while the server runs. The output shows LeviLamina loading, the ports 19132 and 19133, and "Server started.". Below it is the input line.](https://levimc.org/lip/screenshots/en/first-server-21-running.svg)

   On Windows, the firewall may ask for permission to allow the server on your network. Allow it on private networks if you want other devices to join; see [Let friends join your server](let-friends-join.md).

4. Send a command to the server: type `list` in the input line at the bottom and press `Enter`. The server should respond with `There are 0/10 players online:`. Enter server commands here without a leading `/`.

To connect from Minecraft on the same PC, add a server with the address `127.0.0.1` and port `19132`.

## 5. Stop the server

1. Press `Ctrl+C` on the Server page. `lip` sends the `stop` command to the server and waits for it to save the world.
2. You should see **Exited with code 0** on the first line, meaning the server ended normally. The **Start** button starts it again.
3. To leave `lip`, press `Esc` until you reach the sidebar, press `Esc` once more, and confirm **Quit**.

Next time, start `lip` in `D:\servers\survival`. If you start it in another folder, `lip` still remembers your server: on **Home**, press `Enter` on **Choose a workspace**, press `Enter` on `D:\servers\survival` in the list, and choose **Switch**.

## What you have now

- The folder `D:\servers\survival`, which holds the game and LeviLamina. It is an ordinary folder that you can back up or move.
- A server that you can start and stop from the **Server** page in `lip`.

::: warning Stop the server before you change it
While the server is running, `lip` will not install, update, or remove anything in its folder, nor will it save changes to `server.properties`, the allowlist, or the permissions.
:::

## Next steps

- Add mods to the server: [Install mods on your server](install-mods.md).
- Let other players connect: [Let friends join your server](let-friends-join.md).
- Do the same from the command line, for scripts and remote machines: [A server from the command line](command-line.md).
- Change the server name, game mode, or number of players: [Game Config](https://levimc.org/lip/interface/game_config.html).
- Automatically restart the server after a crash: [Server](https://levimc.org/lip/interface/server.html).
- Add a second server: [Workspaces](https://levimc.org/lip/interface/workspaces.html). Change the game or LeviLamina version: **Change versions…** on the [Server](https://levimc.org/lip/interface/server.html) page.
- Explore every page of the interface: [A tour of the interface](https://levimc.org/lip/interface/tour.html).
- See how `lip` runs the Windows server on Linux and macOS: [Linux and macOS](https://levimc.org/lip/guides/linux_macos.html).
- Fix problems: [lip troubleshooting](https://levimc.org/lip/guides/troubleshooting.html) and [LeviLamina troubleshooting](https://levimc.org/faq/server/levilamina/errors/).
