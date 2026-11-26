# Workspaces

This page shows you how to keep several servers side by side: switch between them, add an existing server folder or create a new one, and remove a folder from the list. You choose workspaces in the **workspace picker**, which opens from the top line of the interface.

## What a workspace is

A **workspace** is a folder that holds one server: the game, LeviLamina, the mods, the worlds, and lip's own records in `.lip/`. Every page of the interface works on one workspace at a time—the **selected workspace**, named in the top line.

lip keeps a list of the workspaces you have used, and preserves it between runs. When you start `lip`, it adds the current folder to the list (if it is not already there) and selects it. Opening an [install link](../reference/links.md) works differently: it adds no folder and selects the last workspace on the list.

Choosing a workspace does not install anything in it. Use the [Server](server.md) page to set up the server in the selected workspace, or to change its game or loader version later.

## Open the workspace picker

The workspace in the top line can take focus, just like a page in the sidebar:

1. Press `Esc` until the focus is in the sidebar.
2. On **Home** (the first page), press `↑` to highlight the workspace in the top line. (Pressing `↓` on **Settings**, the last page, gets there too.)
3. Press `Enter`.

Step 1 (**Choose a workspace**) on the [Home](home.md) page also opens the picker. Pressing `Esc` or `Tab` in the top line returns focus to the sidebar.

![The workspace picker above the Home page: the row "Add folder…", then three folders. The first has a dot, and the last is marked "missing".](/screenshots/en/workspaces-01-list.svg)

1. **Add folder…** adds an existing folder to the list, or creates and adds a new one.
2. The selected workspace, marked with `●`. Every page works on it.
3. A workspace whose folder no longer exists, marked **missing**.

The picker opens with the selected workspace highlighted. Use `↑` and `↓` to move through the list; pressing `↑` on the first workspace moves to **Add folder…**, and `Tab` switches between the two. The area below the list shows the full path of the focused row and a one-sentence description. Press `Esc` to close the picker.

![The picker with the focus on the selected workspace. The second folder is marked "server running" and the third "missing". Below the list are the path of the first folder and "The selected workspace."](/screenshots/en/workspaces-03-marks.svg)

1. `●`: the selected workspace.
2. **server running**: this workspace's server is running, regardless of who started it.
3. **missing**: the folder was deleted, moved, or renamed. lip can only remove it from the list.
4. The full path (which the list truncates at the start when it is too long) and a description of the row.

Pressing `Enter` on another workspace opens its actions. The available actions depend on the workspace:

| Action | Offered for | Does |
| --- | --- | --- |
| **Switch** | Every workspace except missing ones. | [Selects the workspace](#switch-to-another-workspace). |
| **Remove from list** | Every workspace. | [Removes it from the list](#remove-a-workspace-from-the-list) without changing any files. |

Pressing `Enter` on the selected workspace closes the picker, since no actions apply to it here.

## Switch to another workspace

1. Move to the workspace and press `Enter`.

   ![The menu of the folder creative with two rows: "Switch" and "Remove from list".](/screenshots/en/workspaces-02-menu.svg)

2. Press `Enter` on **Switch**. The picker closes.

   ![After switching: the top line names D:\servers\creative, and so does a message at the right of the bottom line. The Home page shows the server of creative.](/screenshots/en/workspaces-09-switched.svg)

   1. The top line names the new workspace. Every page now shows its server, mods, and configuration.
   2. The message disappears after a few seconds.

Switching does not stop anything. A server running in the workspace you left keeps running, and the picker marks it **server running**.

If the [Game Config](game_config.md) or [Mod Config](mod_config.md) page has unsaved changes, lip asks what to do with them before switching.

## Add a folder

Use this to add a server that lip does not list yet—such as one you set up with the commands or copied from another computer—or to pick a new folder for setting up a server. lip accepts any folder, whether or not it already contains a server.

1. Move to **Add folder…** and press `Enter`.

   ![The row "Add folder…" is highlighted. The line below the list says "Adds a folder to the list, or a new one that it creates. The Server page sets it up."](/screenshots/en/workspaces-10-add-row.svg)

2. The folder browser opens in the selected workspace. Navigate to the server's folder: `←` goes up one level, `↑` and `↓` move through the list, and `Enter` or `→` opens a folder.

   ![The folder browser, titled "Add folder", shows D:\servers with the folders creative, lobby, skyblock and survival; lobby is selected.](/screenshots/en/workspaces-11-browse.svg)

   1. The folder currently shown in the list. You can also type or paste a path here.
   2. A subfolder inside it; press `Enter` or `→` to open it.

   For a new server, go to where you want to put it, choose **New folder…**, and type a name. lip creates the folder inside the current one and opens it.

3. When the browser shows the folder you want, press `Tab` to reach the buttons, then press `Enter` on **Select this folder**.

   ![The browser shows D:\servers\lobby with its folders behavior_packs, mods, resource_packs and worlds. The button "Select this folder" is marked.](/screenshots/en/workspaces-12-select-folder.svg)

4. lip adds the folder to the end of the list, selects it, and closes the picker.

   ![The Home page of D:\servers\lobby, which the top line names, with the message "Workspace: D:\servers\lobby" at the right of the bottom line.](/screenshots/en/workspaces-13-added.svg)

lip does not inspect the folder's contents; you can add any existing folder. If a folder is already on the list, lip selects it instead of adding it twice. For full details on using the browser, see [The folder and file browser](tour.md#the-folder-and-file-browser).

If the folder has no server yet, it is now the selected workspace. To install a server in it, go to the [Server](server.md#set-up-the-server) page and choose **Set up server…**.

## Remove a workspace from the list

Removing a workspace only takes it off the list. **No file is deleted**: the server stays on your disk, and you can add its folder again later.

1. Move to the workspace and press `Enter`. For a missing folder, **Remove from list** is the only action.

   ![The menu of the missing folder skyblock with one row, "Remove from list".](/screenshots/en/workspaces-06-menu-missing.svg)

2. Press `Enter` on **Remove from list**. lip asks for confirmation first.

   ![The dialog of skyblock asks "Remove it from the list? No file is deleted." with the buttons "Remove from list" and "Cancel".](/screenshots/en/workspaces-07-remove.svg)

3. Press `Enter` on **Remove from list** again.

   ![The picker without skyblock. The bottom line ends with "Removed from the list."](/screenshots/en/workspaces-08-removed.svg)

You cannot remove the currently selected workspace, since pressing `Enter` on it simply closes the picker. Switch to another workspace first.

## While a server runs

A running server does not prevent you from using the picker:

- The picker marks the workspace **server running**, and the details say **Its server is running.**
- **Switch** and **Remove from list** work as usual, and neither stops the server.

![The menu of the folder creative, whose server runs: "Switch" and "Remove from list". The line below the list says "Its server is running."](/screenshots/en/workspaces-05-menu-running.svg)

To stop a server, switch to its workspace and use the [Server](server.md) page. [The interface reference](../reference/interface.md#while-the-server-runs) describes how each page behaves while a server is running.

## Several interfaces at once

You can open `lip` in several terminals at the same time. They share a single list stored in `workspaces.json` (see [Files](../reference/files.md)):

- Each interface has its own selected workspace, so two terminals can show two different servers.
- When one interface adds or removes a workspace, the change appears in the others within a few seconds while their workspace picker is open.
- Simultaneous changes from multiple interfaces are all preserved.
