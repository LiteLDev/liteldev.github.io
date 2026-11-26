# A server from the command line

By the end of this tutorial, you will have a Minecraft Bedrock Dedicated Server with LeviLamina, set up, started, and stopped with three `lip` commands: `lip setup`, `lip run`, and `Ctrl+C`. You will also learn how to keep it running after you close the terminal. This is the best approach for scripts, remote machines over SSH, and anyone who prefers the command line to the graphical interface in [Your first server](first-server.md).

## What you need

- `lip` installed: see [Install lip](https://levimc.org/lip/install.html). `lip -v` must print a version.
- Windows 10, Windows 11, or Windows Server 2019 or later; or Linux on x64 or macOS, where `lip` runs the Windows server through its own copy of Wine.
- An internet connection.

## 1. Make a folder for the server

Every `lip` command operates on the current folder, which `lip` calls the **workspace**. Create one and change into it:

::: code-group

```powershell [Windows]
mkdir D:\servers\survival
cd D:\servers\survival
```

```shell [Linux and macOS]
mkdir -p ~/servers/survival
cd ~/servers/survival
```

:::

## 2. Set up the server

1. Choose a game version that LeviLamina supports, such as `1.26.60`, and preview what `lip` will do:

   ```shell
   lip setup --game 1.26.60 --dry-run
   ```

   You should see lines starting with `Dry run:` that list the game (`github.com/LiteLDev/bds`) and LeviLamina, ending with `Dry run: nothing was changed.` If `lip` says that no version of LeviLamina matches that game version, pick another one.

2. Run the same command without `--dry-run`:

   ```shell
   lip setup --game 1.26.60
   ```

   This installs the game (the Bedrock Dedicated Server), the latest version of LeviLamina that supports it, and LeviLamina's dependencies.

3. `lip` shows the Minecraft End User License Agreement and the Microsoft Privacy Policy and asks you to accept them. Read them, then type `yes` and press `Enter`. Any other answer cancels the command without making any changes.

4. Wait for the downloads to finish. On the first run, `lip` may also install the Microsoft Visual C++ Redistributable (Windows will prompt you for permission), or Wine on Linux and macOS. You should see:

   ```text
   ✓ The server is set up. Run it with 'lip run', or install mods with 'lip install'.
   ```

::: tip Let LeviLamina choose the game version
If you do not mind which version you get, `lip install LeviLamina` installs the latest LeviLamina along with the newest game version it supports. It prompts you to accept the EULA in the same way.
:::

::: details In a script or a container
In non-interactive environments, `lip` cannot prompt for input, so the setup fails. If you accept the EULA, pass the flag on the command line:

```shell
lip setup --game 1.26.60 --accept-eula
```
:::

## 3. Run the server

1. Start the server:

   ```shell
   lip run
   ```

   The server prints its output to your terminal. Wait for the line `Server started.` Lines marked `[LeviLamina]` show the loader at work.

2. Anything you type now goes to the server. Type a server command without a leading `/`:

   ```text
   list
   ```

   You should see `There are 0/10 players online:`.

3. Press `Ctrl+C`. `lip` sends `stop` to the server, the server saves the world and exits, and then `lip` exits. Pressing `Ctrl+C` again will not force-kill the server; `lip` always waits for it to shut down cleanly.

Closing the terminal window also stops a server started with a plain `lip run`.

## 4. Keep it running without a terminal

A **managed server** runs in a `lip` background process instead of in your terminal.

1. Start it without staying attached:

   ```shell
   lip run --managed --detach
   ```

   The command returns as soon as the server has started.

2. Reattach to it from any terminal in the same folder:

   ```shell
   lip run --managed
   ```

   You will see the server's recent output, and you can type commands again.

3. To leave it running, close the terminal window. `Ctrl+C` does **not** detach: it stops the server, just like with a plain `lip run`.

4. To stop it, attach as in step 2 and press `Ctrl+C` (or type `stop`).

A managed server does not start automatically when the machine reboots. To do that, configure your system's service manager to run a plain `lip run` in the workspace.

::: tip Restart after a crash
`lip config set restart on-failure --workspace` makes `lip` restart the server 5 seconds after it exits with an error. This works for both plain and managed servers.
:::

## What you have now

- A workspace, `D:\servers\survival` (or `~/servers/survival`), containing the game and LeviLamina pinned to the versions you chose.
- Two ways to run it: `lip run` in the foreground, and `lip run --managed` in the background.

The graphical interface and the command line work on the same folders. If you run `lip` by itself in the folder, the server appears on its **Server** page; a managed server started there is the same one that `lip run --managed` attaches to.

## Next steps

- Add mods: [Install mods on your server](install-mods.md).
- Let other players connect: [Let friends join your server](let-friends-join.md).
- Run the server in a container instead: [A server in Docker](docker.md).
- Install, list, update, and uninstall packages: [Managing packages](https://levimc.org/lip/guides/managing_packages.html).
- Configure `lip` and work around slow or blocked GitHub connections: [Configuration](https://levimc.org/lip/guides/configuration.html).
- See all command options: [`lip setup`](https://levimc.org/lip/reference/commands/setup.html), [`lip run`](https://levimc.org/lip/reference/commands/run.html), [`lip config`](https://levimc.org/lip/reference/commands/config.html).
- When a command fails: [Troubleshooting](https://levimc.org/lip/guides/troubleshooting.html).
