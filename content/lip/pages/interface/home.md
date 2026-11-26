# Home

lip starts on the Home page. After reading this page, you will be able to read what the Home page says about your folder, follow its steps to get a server running, and answer the question that lip asks when it cannot reach GitHub.

If the keys or the parts of the screen are new to you, read [A tour of the interface](./tour.md) first.

## The overview

The top of the page shows what is currently in the workspace (the folder that lip works on).

![The Home page of a folder with a server and no mods. Numbers mark the overview, a finished step, the highlighted step and the sentence below the steps.](/screenshots/en/home-03-server-created.svg)

1. The overview. The table below explains its rows.
2. A step marked with `✓` is done.
3. The highlighted step is the next one to take.
4. One sentence explains what `Enter` does on the highlighted step.

| Row | Shows |
| --- | --- |
| Workspace | The folder. Long paths are trimmed at the start so the end stays visible. |
| Game | The version of the Minecraft server in the folder, or "Not installed". |
| Loader | LeviLamina and its version, or "None". Mods require the loader. |
| Mods | How many mods you have installed. This count excludes the game, the loader, and mods installed only because another mod needs them. |
| Server | "Stopped", or `●` and "Running". It shows "Starting" from Start until the server program is running, "Stopping" right after you ask the server to stop, and "Restarting" while lip waits to restart a crashed server. |

When the page first opens, the rows briefly show `…` while lip reads the folder.

## Next steps

Below the overview, **Next steps** lists the four steps that take you from a folder to a running server. lip highlights the first unfinished step, so in most cases you only need to press `Enter`.

Use `↑` and `↓` to move between the steps, and press `Enter` to open the highlighted one.

| Step | It is done when | `Enter` |
| --- | --- | --- |
| 1 Choose a workspace | Always: a workspace is always selected. | Opens the [workspace picker](./workspaces.md) so you can pick or add another folder. |
| 2 Set up the server | The folder has the game. | Opens the [Server](./server.md) page and starts [setting up the server](./server.md#set-up-the-server). |
| 3 Install mods | You have installed at least one mod. | Opens the [Marketplace](./get_mods.md) page. |
| 4 Start the server | The server is running. | Opens the [Server](./server.md) page and starts the server. |

### Nothing set up yet

In a folder without a server, only step 1 is ticked, and step 2 is highlighted.

![The Home page of an empty folder. Only "Choose a workspace" is ticked, and "Set up the server" is highlighted. The sentence below says "Pick a game version and a loader for this workspace."](/screenshots/en/home-01-empty.svg)

1. The current page. The sidebar on the left lists every page.
2. The next step: press `Enter` to start it.
3. The keys that work right now.

Press `Enter` to set up the server in this folder. [Your first server](https://levimc.org/tutorials/server/first-server/) walks through what follows. To put the server in another folder instead, choose that folder first in step 1.

### The server is set up

Once the folder has the game, steps 1 and 2 are ticked and step 3 is highlighted, as shown in the picture at the top of this page. Press `Enter` to browse the mods on levimc.org.

Step 3 is optional. A server can also run without mods: press `↓` and `Enter` to start it right away.

### Mods are installed

Once at least one mod is installed, steps 1 to 3 are ticked and step 4 is highlighted.

![The Home page of a server with four mods. Steps 1 to 3 are ticked, and "Start the server" is highlighted.](/screenshots/en/home-04-mods-installed.svg)

Press `Enter`. lip opens the Server page and starts the server.

### The server runs

While the server is running, all four steps are ticked, and both the top line and the overview show "Running".

![The Home page while the server runs. All four steps are ticked, and the top line says "Running".](/screenshots/en/home-02-all-done.svg)

Pressing `Enter` on step 4 now opens the Server page without starting anything; the sentence below the steps reads **Running. Enter opens its console.**

### A finished step can be opened again

A tick does not lock a step. Pressing `Enter` on step 1 always opens the workspace picker, and pressing `Enter` on step 3 always opens the Marketplace, where you can install more. Pressing `Enter` on a ticked step 2 runs the setup again so you can change the server's game or loader version.

![Step 2 is ticked and highlighted. The sentence below says "Done. Enter changes the game or loader version."](/screenshots/en/home-05-step-done.svg)

### Starting without a server

In a folder without a server, there is nothing to start. If you press `Enter` on step 4, lip shows "Set up the server first." on the right side of the bottom line and moves the highlight back to step 2.

![The Home page of an empty folder after Enter on step 4. The bottom line says "Set up the server first.", and step 2 is highlighted again.](/screenshots/en/home-06-need-server.svg)

1. The message, which disappears after a few seconds.
2. The highlight returns to the step that sets up the server.

## When GitHub cannot be reached

lip downloads LeviLamina and most mods from GitHub. Each time the interface starts, lip checks in the background whether it can reach GitHub. It waits up to 10 seconds for a response, and you can use the interface while it waits.

When the check fails, lip asks how it should reach GitHub. It asks only when nothing else is open, so the question never interrupts a dialog.

![The dialog "GitHub unreachable". It says why the connection failed, asks "How should lip reach GitHub?", and offers Use a proxy, Connect directly and Later.](/screenshots/en/home-07-github.svg)

1. Why lip could not reach GitHub.
2. The three answers. The first one is highlighted.
3. One sentence about the highlighted answer.

Choose with `↑` and `↓`, and press `Enter`. Nothing changes until you answer.

::: info
lip skips this check altogether once you have set a GitHub proxy or chosen to connect directly on the [Settings](./settings.md) page.
:::

### Use a proxy

Choose this when GitHub is slow or blocked where you are and you know the address of a GitHub proxy. lip does not suggest one.

lip opens the [Settings](./settings.md) page and asks for the address.

![The Settings page with the dialog "GitHub proxy", whose field "Proxy URL" holds an address typed by the user.](/screenshots/en/home-11-github-proxy.svg)

Type the address and press `Enter`. lip tests the proxy first and saves it if it works. If it does not work, you can enter another address or keep the current one anyway. The Settings page describes this in full.

Pressing `Esc` in this dialog saves nothing. lip will ask again the next time it starts.

### Connect directly

Choose this when your connection to GitHub usually works and the check failed for another reason, such as a network that was down for a moment.

![The answer "Connect directly" is highlighted. The sentence below says "Keep connecting directly, and do not ask again."](/screenshots/en/home-08-github-direct.svg)

lip saves the setting to connect directly and confirms it in the bottom line. It does not check or ask again.

![The Home page. At the right of the bottom line is the message "Direct connection saved."](/screenshots/en/home-10-github-direct-saved.svg)

To change this later, set or remove the GitHub proxy on the [Settings](./settings.md) page.

### Later

Choose this when you do not want to decide now. Pressing `Esc` does the same.

![The answer "Later" is highlighted. The sentence below says "Change nothing, and ask again next time."](/screenshots/en/home-09-github-later.svg)

lip changes nothing. It checks again the next time the interface starts, and asks again if the check fails again.

::: warning
Until GitHub can be reached, setting up a server with LeviLamina and installing most mods will fail. The failure dialog then states that lip could not reach the server. See [Troubleshooting](../guides/troubleshooting.md).
:::
