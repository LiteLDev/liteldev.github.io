# A tour of the interface

After reading this page, you will know your way around the lip interface: what each part of the screen is, which keys do what, and what happens when you make changes. Every other page in this section builds on this tour.

The illustrations on these pages show the actual lip interface. The orange marks, numbers, and key badges are added to explain the screen; they are not part of lip.

## Starting it

Open a terminal in your server folder (or in an empty folder where you want to create one) and run `lip` with no arguments:

```shell
lip
```

lip takes over the terminal window and opens the Home page. The folder you started it in becomes the **workspace**—the folder that every page operates on. You can switch to another folder later using the [workspace picker](./workspaces.md).

![The Home page of lip in an empty folder. The step "Set up the server" is highlighted, and the bottom line lists the keys that work.](/screenshots/en/home-01-empty.svg)

You navigate entirely with the keyboard. The mouse does nothing.

::: tip
Running `lip` followed by a word, such as `lip install`, runs a single command and exits. These commands are covered in [A server from the command line](https://levimc.org/tutorials/server/command-line/) and in the [reference](../reference/cli.md).
:::

## What is on the screen

![The Home page of a server that runs, with numbers on its five parts: the top line, the server state, the sidebar, the page and the bottom line.](/screenshots/en/tour-01-layout.svg)

1. **The top line** shows the lip version and the current workspace. You can move the focus to the workspace and press `Enter` to open the [workspace picker](./workspaces.md), where you can choose another one.
2. The right end of the top line shows whether the workspace's server is running. When the server is stopped, nothing appears here.
3. **The sidebar** lists the eight pages: [Home](./home.md), [Server](./server.md), [Mods](./mods.md), [Marketplace](./get_mods.md), [Game Config](./game_config.md), [Mod Config](./mod_config.md), [Develop Tools](./tools.md), and [Settings](./settings.md). A green `●` next to Server means the server is running.
4. **The page** is the large main box, with its name shown in the frame.
5. **The bottom line** lists the keys that work right now and what each one does. It updates whenever you move around the interface. When in doubt, check this line.

## Where the focus is

At any moment, either the sidebar, the page, or the workspace in the top line receives your keystrokes. That part has the **focus**. When lip starts, the focus is in the Home page.

Press `Esc` to move the focus from the page to the sidebar. From there, press `↑` and `↓` to move through the pages; each page appears immediately as you highlight it.

![The focus is in the sidebar. The entry "Mods" is bright, the Mods page shows at the right, and the bottom line says "Esc Quit".](/screenshots/en/tour-02-sidebar.svg)

1. While the sidebar has the focus, the entry for the current page is bright.
2. In the sidebar, pressing `Esc` asks whether you want to quit lip.

Above the first page (Home) is the workspace in the top line. Pressing `↑` on Home—or `↓` on the last page, Settings—highlights the workspace. Pressing `Enter` there opens the [workspace picker](./workspaces.md), and `Esc` returns to the sidebar.

Press `Enter` on a page in the sidebar to move the focus into that page.

![The focus is in the Mods page. Its frame is bright, a row of the list is highlighted, and the bottom line says "Esc Back".](/screenshots/en/tour-03-page.svg)

1. While the page has the focus, its frame and name are bright.
2. One row is highlighted. `Enter` and `Space` act on that row.
3. `Esc` now returns to the sidebar.

### Esc goes back one step

`Esc` always goes back one step, and never further:

| Where you are | `Esc` goes to |
| --- | --- |
| A dialog or a menu | Whatever was underneath it. |
| An inner part of a page, such as the server input line | The part of the page you entered it from. |
| A page | The sidebar. |
| The workspace in the top line | The sidebar. |
| The sidebar | The prompt asking whether to quit lip. |

Pressing `Esc` several times always brings you back to the sidebar, and pressing it once more asks whether you want to quit. You won't lose any work along the way: if a page has unsaved changes, lip asks before leaving it.

## The keys

The same keys do the same thing on every page.

| Key | Does |
| --- | --- |
| `↑` `↓` | Move through a list or menu. In the sidebar, switch to the page above or below; moving past the first or last page selects the workspace in the top line. |
| `←` `→` | Move between the sidebar and the page, or between side-by-side parts and buttons. Change the value of an option shown `‹ like this ›`. |
| `Enter` | Opens or carries out the highlighted item. On a list row, opens the menu of actions for that row. |
| `Space` | Checks or unchecks a row in a multi-select list. Toggles an option on or off. |
| `Esc` | Goes back one step. |
| `Tab` | Moves to the next part, cycling from the sidebar through the parts of the page and back to the sidebar. `Shift+Tab` moves in reverse. |
| `PgUp` `PgDn` | Move up or down a screenful in a list or text. |
| `Home` `End` | Jump to the first or last row. |
| `Ctrl+C` | Asks whether to quit lip. On the Server page, stops the server if it is running. If lip is applying a change, cancels it. |

There are no letter shortcuts. You only type letters when a text field, such as a search box, has focus. Everything else is a row or a button that you reach with the arrow keys.

When a list or text is longer than its box, `▲` and `▼` appear along its right edge, and the bottom line shows the keys that scroll it:

![The details of a mod on the Marketplace page have the focus. Marks at the right edge show that there is more above and below, and the bottom line lists the keys that scroll.](/screenshots/en/get-mods-07-details-scroll.svg)

1. The focused part has a bright title.
2. `▲` and `▼` show that there are more lines above and below.
3. `↑` `↓`, `PgUp` `PgDn`, `Home`, and `End` scroll.

## Menus on rows

Pressing `Enter` on a list row opens a small menu of actions for that row. Use `↑` and `↓` to move, `Enter` to select, and `Esc` to close the menu.

![The menu of a mod on the Mods page: Details, Update, Update to version…, Uninstall.](/screenshots/en/mods-02-menu.svg)

### Disabled items say why

Actions that are currently unavailable remain visible in gray. Highlight one to see why below the menu. Pressing `Enter` on it does nothing.

![The menu of a mod that was installed from a URL. "Update to version…" is gray, and the line below says "Only a mod from a repository has versions."](/screenshots/en/mods-11-url-menu.svg)

## Dialogs

A dialog is a box that opens over the page. While open, it captures all keystrokes, and the page behind it does not respond until the dialog is closed.

There are a few kinds of dialogs, and each works the same way wherever it appears.

**A question with buttons.** `←` and `→` select a button, and `Enter` presses it. `Esc` presses the last button, which always cancels the action without changing anything.

![The question "Quit lip?" with the buttons Quit and Cancel.](/screenshots/en/dialog-02-quit.svg)

**A choice.** `↑` and `↓` move between choices, and a sentence below explains the highlighted option. `Enter` selects it, and `Esc` cancels.

![A choice with two rows, "Browse…" and "Type a source…", and a sentence about the highlighted one.](/screenshots/en/mods-14-install-choice.svg)

**A text field.** Type your input and press `Enter`. Gray text in an empty field is an example of what to type, not a value.

![A text field labeled "Source" that holds a repository name typed by the user.](/screenshots/en/mods-18-type-source.svg)

If lip cannot use what you typed, the dialog stays open and explains what it expects:

![A text field that holds "tag:". Below it a line says "Give a version, branch:<name>, tag:<name> or rev:<commit>."](/screenshots/en/mods-23-update-to-invalid.svg)

**A message.** Has a single button, Close.

**A long text**, such as a mod's README, opens in a full-screen window. Scroll with the arrow keys, and press `Esc` or `Enter` to close it.

![The README of a mod in a window that fills the screen.](/screenshots/en/get-mods-17-readme.svg)

## Preview, then Apply

Nothing that changes your server happens right away. Installing, updating, or uninstalling a mod, as well as setting up a server, all follow the same steps.

### 1. The plan

First, lip works out what it would do and shows you the plan. The lines starting with `Dry run:` list the changes.

![The plan of an uninstall: two lines that start with "Dry run: would uninstall", and the buttons Apply and Cancel.](/screenshots/en/plan-01-changes.svg)

1. What lip would do. Nothing has changed yet.
2. **Apply** carries out the plan. **Cancel**, or `Esc`, leaves everything as it is.

Because Cancel changes nothing, you can also use the plan to preview what an action would do.

::: info
The lines of a plan, along with all other command output, are in English regardless of the interface language.
:::

Two kinds of plan look different.

**Only lip's record changes.** No game or mod files would change—only what lip has recorded about your mods. The last line of the plan says so. Whether you apply or cancel it, your server behaves the same way.

![A plan whose last line says "Only lip's record of the packages would change.", with the buttons Apply and Cancel.](/screenshots/en/plan-03-record-only.svg)

**Nothing would change.** Because there is nothing to apply, **Close** is the only button.

![A plan that says "Nothing would change." and has only a Close button.](/screenshots/en/plan-02-no-changes.svg)

### 2. The license of the game

When a plan installs the game itself, lip next shows links to the Minecraft End User License Agreement and the Microsoft Privacy Policy. Choose **Accept** to continue. **Decline** stops the process and installs nothing.

![The dialog "Minecraft EULA" with two links and the buttons Accept and Decline.](/screenshots/en/new-server-07-eula.svg)

### 3. Progress

While lip works, it shows what it is downloading and doing.

![The progress of a setup: one download is finished, another is at 62 percent.](/screenshots/en/new-server-08-progress.svg)

Press `Esc` or `Ctrl+C` to cancel. lip prints `Cancelling…`:

![The progress dialog after Esc: a line says "Cancelling…".](/screenshots/en/tour-04-cancelling.svg)

lip then undoes the changes made so far, restores your folder to its previous state, and confirms it:

![A dialog titled "Set up server · Cancelled" that says "Cancelled. Changes were undone.", with a Close button.](/screenshots/en/tour-05-cancelled.svg)

::: info
A cancelled change is not a failure. Its dialog has "Cancelled" in the title and a standard dialog frame, not the red frame of a failure.
:::

### 4. The result

When lip finishes, it shows what it did, ending with `✓ Done.` Press `Enter` to close the dialog.

![The result of a setup: the lines of what lip did, then "✓ Done." and an OK button.](/screenshots/en/new-server-09-result.svg)

### When something fails

A failure does not close lip. Instead, lip shows a red-framed dialog and keeps running after you close it.

![A failure dialog. It holds an error line, a hint line and the path of the full report.](/screenshots/en/tour-06-failure-hints.svg)

1. `error:` explains what went wrong.
2. `hint:` suggests what you can do about it. Not every failure has a hint.
3. `Full report:` shows the path to a file with every detail, located in the workspace's `.lip\logs` folder. Attach this file when asking for help.
4. **Close** closes the dialog.

A failure while lip is working out the plan changes nothing. A failure after you choose Apply is undone, just like a cancelled action. See [Troubleshooting](../guides/troubleshooting.md) for the meanings of common failures.

## The folder and file browser

Whenever lip needs a folder or a file, it opens a browser so you do not have to type a path.

![The folder browser, with numbers on its path bar, the row "..", the folders, the buttons and the bottom line.](/screenshots/en/tour-07-browser.svg)

1. **The path bar** shows the folder whose contents are listed.
2. `..` is the parent folder one level up. Press `Enter` or `←` to go there.
3. Subfolders end with `\`. Press `Enter` or `→` to open the highlighted one.
4. **The buttons.** Press `Tab` to move to them from the list.
5. `Tab` cycles through the path bar, the list, and the buttons.

Press `Esc` to close the browser without choosing anything.

Hidden folders and files, or those whose names start with a dot (such as `.lip`), are not listed. If lip Does not have permission to read a folder, it says so in a single line.

### Typing a path

You can still type or paste a path. From the list, press `Shift+Tab` to move to the path bar, type the path, and press `Enter` to go to that folder. Press `Esc` to return to the list.

![The path bar has the focus and holds a path that was typed. The bottom line says "Enter Go".](/screenshots/en/tour-08-browser-path.svg)

### The drives

Above the root folder of a drive is the list of drives. Open a drive to continue; you cannot select anything in the drive list itself.

![The list of the drives, C:\ and D:\, under the name "Computer". A line says "Open one of these first."](/screenshots/en/tour-09-browser-drives.svg)

Linux and macOS have no drives; the top-level folder is `/`.

### Its two forms

The browser looks slightly different depending on what lip asks for.

**A folder**, when you add a folder in the [workspace picker](./workspaces.md#add-a-folder). This is the picture at the top of this section. **Select this folder** chooses the current folder. **New folder…** asks for a name, creates that folder inside the current one, and opens it.

**A file or a folder**, when you install a mod from your disk on the [Mods](./mods.md) page. The list also shows the files you can choose, and a line above the buttons names their file type. `Enter` on a file chooses it; **Select this folder** chooses the current folder.

![The browser with a folder and two .zip files. A line says "Files: .zip", and the buttons are Select this folder and Cancel.](/screenshots/en/mods-15-browse.svg)

## While the server runs

While the workspace's server is running, lip does not change its mods or game files. This keeps a running server from losing files it has open.

| What | While the server runs |
| --- | --- |
| Installing, updating and uninstalling mods | Off. |
| Setting up the server, changing the game or the loader | Off. |
| `server.properties`, `allowlist.json`, `permissions.json` on the [Game config](./game_config.md) page | Can be read, not saved. |
| Mod configuration files on the [Mod config](./mod_config.md) page | Can be changed and saved. |
| Everything else: the Marketplace, Develop Tools, Settings, the workspace picker | Works as usual. |

Disabled actions stay on screen in gray, with the message "Stop the server first.":

![The Mods page while the server runs. A yellow line at the top says so, the two action rows are gray, and the details area says "Stop the server first."](/screenshots/en/mods-36-server-running-page.svg)

1. The page shows that the server is running.
2. The rows that would change mods are gray.
3. The details area explains why.

![The menu of a mod while the server runs. "Update" is gray, and the line below the menu says "Stop the server first."](/screenshots/en/mods-04-server-running.svg)

Stop the server on the [Server](./server.md) page, make your changes, and start it again.

This applies no matter how the server was started: from this interface, from another terminal, or with the `lip run` command.

## Messages in the bottom line

A short message sometimes appears at the right end of the bottom line. It tells you that an action finished, or why nothing happened. It disappears on its own after six seconds, and you do not need to dismiss it.

![The Home page. At the right of the bottom line is the message "Set up the server first."](/screenshots/en/home-06-need-server.svg)

Messages are green for success, yellow for warnings, red for failures, and blue for plain information.

## Small terminals

lip needs a terminal of at least 60 columns and 16 rows. In a smaller terminal, it shows only this line, and the only key that works is `Ctrl+C`, which quits immediately without asking:

![A terminal that is too small. It shows one line: "Enlarge the terminal to 60×16. Ctrl+C quits."](/screenshots/en/tour-10-too-small.svg)

Enlarge the window and lip returns to where it was.

In a terminal narrower than 80 columns, the sidebar shrinks to one symbol per page while focus is in the page, leaving the page more room:

![A terminal of 60 columns. The sidebar shows one symbol for each page.](/screenshots/en/narrow-01-home.svg)

Press `Esc`, and the sidebar shows the page names again:

![The same terminal with the focus in the sidebar, which shows the names of the pages.](/screenshots/en/narrow-02-sidebar.svg)

In a narrow terminal, the bottom line may not have room for every key. `Esc` and action keys such as `Enter` are always shown; navigation keys are hidden first.

## Quitting

Press `Esc` in the sidebar, or `Ctrl+C` anywhere except on the Server page while the server is running. lip asks before quitting:

![The question "Quit lip?" with the buttons Quit and Cancel.](/screenshots/en/dialog-02-quit.svg)

When a server is running, the prompt also says what will happen to it. Normally, the server keeps running:

![The question "Quit lip?" with a second line: "Running servers keep running."](/screenshots/en/server-12-quit-keeps-running.svg)

You can close the terminal, come back later, and run `lip` in the same folder to see the server again. The [Server](./server.md#quitting-lip-while-the-server-runs) page explains this, along with the rare case where servers stop first.

## Languages

The interface is available in English, Simplified Chinese, or Traditional Chinese. By default, it follows your system language. To choose a language yourself, go to the [Settings](./settings.md) page and press `Enter` on **Language**. The screen updates immediately.

![The Language setting: Follow system, English, 简体中文, 繁體中文.](/screenshots/en/settings-02-language.svg)

## Where to go next

- [Your first server](https://levimc.org/tutorials/server/first-server/) walks you step by step from an empty folder to a running server with mods.
- [Home](./home.md), [Server](./server.md), [Mods](./mods.md), and [Marketplace](./get_mods.md) cover the pages you use most, while [Workspaces](./workspaces.md) covers the workspace picker.
- [The interface in brief](../reference/interface.md) is a quick reference for every page and key.
