# Mod Config

After reading this page, you will be able to change your mods' settings directly from the interface, without hunting for files or editing JSON by hand.

The Mod Config page lists the configuration files of your installed mods. JSON files open as a tree of names and values that you can change one at a time. Files in other formats are listed so you can edit them in a text editor.

## Which files the page lists

Each mod has its own folder on the server, `mods/<mod>/`, where `<mod>` is the mod's name. For each installed mod, lip lists:

- every file in `mods/<mod>/config/` and its subfolders; or,
- if there are none: the `.json`, `.ini`, `.toml`, `.yml`, and `.yaml` files directly in `mods/<mod>/` (excluding `manifest.json`), along with `mods/<mod>/data/config.json`.

Most mods generate their configuration file the first time the server starts with them installed. lip does not create configuration files.

## The files

To open the page, select **Mod Config** in the sidebar and press `Enter`.

![The Mod Config page: the list of files at the left with six rows, and the file of GMLIB open at the right with its three values.](/screenshots/en/mod-config-03-files.svg)

1. A file: the mod's folder name, followed by the file's path inside that folder. A mod with several files gets several rows.
2. A mod without a configuration file, dimmed.
3. The selected file. The page opens with the first file in the list selected.

Use `↑` and `↓` to move through the list; the right pane updates to match. If the list is too narrow for a long name, the end is cut off; the right pane shows the full mod name in its title and the file path on its first line.

A mod without a file has nothing to show:

![LegacyRemoteCall is selected in the list. The right side says "No config file. Starting the server may create one."](/screenshots/en/mod-config-04-no-file.svg)

1. lip found no configuration file for this mod in the expected locations. The mod may create one the next time the server starts.

If no installed mod has its own folder, or no mods are installed at all, the page displays **No configurable mods.** Pressing `Enter` on **Marketplace** opens the [Marketplace](get_mods.md) page.

![The Mod Config page of a server without mods: the text "No configurable mods." and the button "Marketplace".](/screenshots/en/mod-config-02-empty.svg)

## Edit a JSON file

Press `Enter` or `→` on a file to enter it. The page displays one level of the file at a time, with a row for each name and its value.

![The file of LeviOptimize, inside its group "features": the group optPushEntity with 3 items, and five values that are true.](/screenshots/en/mod-config-01-tree.svg)

1. The mods and their files.
2. The file's values, shown one level at a time.
3. **Save** and **Discard**: nothing is written to disk until you save.

| A value shown as | Is | `Enter` |
| --- | --- | --- |
| `{…} 3 items` | A group of named values (a JSON object). | Opens it. |
| `[…] 1 item` | A list of values (a JSON array). | Opens it. |
| `[x] true`, `[ ] false` | True or false. | Toggles it (as does `Space`). |
| `3`, `0.05` | A number. | Prompts for a new number. |
| `"en"` | Text. | Prompts for new text. |
| `null` | Empty. | Prompts for a value of any type. |

The line below the rows shows the value type of the selected row.

### Move through the file

1. Select a group or a list and press `Enter` to open it.
2. Press `Esc` or `←` to go back up one level. At the top level, `Esc` returns to the file list.

![Two levels down in the file of LeviOptimize. The first line reads "… › features › optPushEntity", and the rows are enabled, maxPushTimes and a third name that is cut.](/screenshots/en/mod-config-06-location.svg)

1. Your current location: the file, followed by each level you have opened. When the line is too long, the beginning is replaced with `…`.
2. A true or false value.
3. A number.

Names too long for their column are truncated with `…`.

### Change a value

On a number or text value, press `Enter` to open an input field with the current value. Type the new value and press `Enter`, or press `Esc` to cancel without saving changes.

Each value keeps its type. A number field accepts only numbers; a text field takes whatever you type verbatim, including spaces, so typing `5` into a text field keeps it as the text `"5"`.

![The field of def_money, labelled Number, holds "a lot". Below it the message "Enter a number." is shown.](/screenshots/en/mod-config-10-number.svg)

1. The type of value the row holds.
2. Why the input was rejected. Fix it and press `Enter` again.

On a true or false value, press `Space` or `Enter` to toggle it immediately.

### Change a list

A list shows its values along with their positions (`[0]`, `[1]`, and so on) and ends with the **Add value…** row.

![The list ignoredDimensions with one value, "the_end", at position 0, and the row "Add value…" below it.](/screenshots/en/mod-config-07-array.svg)

1. A value in the list.
2. The row that adds a new value.

To add a value, press `Enter` on **Add value…** and type it in. Your input is parsed as JSON: `42` is a number, `true` is true, and `{"a": 1}` is a group. Anything that is not valid JSON becomes plain text, so you do not need to put quotes around a word.

![The Add value dialog with one field, Value, which holds the word nether.](/screenshots/en/mod-config-08-add-value.svg)

The new value is added to the end of the list.

To change or remove a value in a list, press `Enter` on it. The menu offers **Edit…** (or **Toggle** or **Open**, depending on the type of value) and **Remove**.

![The menu of the value at position 1 with two rows, "Edit…" and "Remove".](/screenshots/en/mod-config-09-element-menu.svg)

::: info What the page cannot do
Only lists can grow and shrink. You cannot add, remove, or rename names in a group on this page, because the mod decides which names its file contains. To make those changes, edit the file in a text editor.
:::

### The version row

Many mods store a whole number named `version` at the top of their file to track the file's layout. The page dims this row and prevents you from changing it: pressing `Enter` does nothing, and the line below the rows explains why.

![The top level of the file of LeviOptimize. The row "version 4" is selected, and the line below the rows says "The mod keeps this version itself."](/screenshots/en/mod-config-05-version.svg)

1. Why pressing `Enter` does nothing on this row.

## Save or discard your changes

Nothing is written to disk while you edit. When a file has unsaved changes, the page marks it in three places:

![The file money.json of LegacyMoney with a changed value. "Unsaved" stands at the top right, a dot follows the file in the list, and the Save and Discard buttons are bright.](/screenshots/en/mod-config-11-unsaved.svg)

1. **Unsaved** appears at the right end of the first line.
2. A dot `●` appears after the file name in the list, when there is room for it.
3. **Save** and **Discard** become active.

To save your changes:

1. Press `Tab` until the buttons have focus. From the last row, pressing `↓` also moves focus to the buttons.

   ![The Save button of the file has the focus.](/screenshots/en/mod-config-12-save.svg)

2. Press `Enter` on **Save**. lip writes the file and displays **Saved.** at the bottom right.

   ![The file after saving: "Unsaved" and the dot are gone, and the bottom line ends with "Saved."](/screenshots/en/mod-config-13-saved.svg)

lip rewrites the entire file, keeping your updated values, preserving the order of the names, and indenting with four spaces. Any comments in the file are removed. If the file was deleted while you were editing it, lip does not recreate it and instead displays **The file is gone.**

**Discard** asks for confirmation, then reloads the file from disk, dropping your changes.

### Go elsewhere with unsaved changes

You can edit only one file at a time. If you have unsaved changes and select another file, switch to another page, select another workspace, or quit lip, lip asks what you want to do with your changes.

![The dialog "Unsaved changes" names "LeviOptimize · config/config.json", asks "Save the changes?", and has the buttons Save, Discard and Cancel.](/screenshots/en/mod-config-17-unsaved-question.svg)

| Button | Does |
| --- | --- |
| **Save** | Saves the file, then continues. |
| **Discard** | Drops your changes, then continues. |
| **Cancel**, or `Esc` | Stays in the file and keeps your changes as they are. |

### A file that changed on disk

Mods also write to their own configuration files, sometimes while the server is running. If the file on disk has changed since lip read it, lip will not overwrite it without asking.

![The dialog "Save config/config.json" says "Changed on disk since it was read. Overwrite?" and "Reload drops your changes.", with the buttons Overwrite, Reload and Cancel.](/screenshots/en/mod-config-16-changed-on-disk.svg)

1. **Overwrite** replaces the file on disk with your version. Any changes the mod wrote are lost.
2. **Reload** reloads the file as it currently is on disk. Your changes are lost.
3. **Cancel** (selected by default when you press `Enter`) writes nothing and keeps your changes on screen.

## Files that are only shown

A file that is not JSON is shown as plain text below the line **Read-only. Use a text editor.** Edit it in a text editor outside lip.

![The file ranking.yml of LegacyMoney, shown as text below the line "Read-only. Use a text editor."](/screenshots/en/mod-config-14-read-only.svg)

A `.json` file that is not valid JSON is shown the same way, below **Read-only: not valid JSON.** and the error from the JSON parser. Comments (`//` and `/* */`) and a trailing comma after the last value do not make a file invalid: lip accepts them.

![The file money.json of LegacyMoney, shown as text. The line above it starts with "Read-only: not valid JSON." and goes on in English with what is wrong.](/screenshots/en/mod-config-15-invalid-json.svg)

1. Why the file is not shown as a tree. The JSON parser's message is in English regardless of the selected language.
2. The mistake—here, a missing colon. Fix it in a text editor and reopen the page.

When the text does not fit the area, press `Enter` to focus it; use `↑`, `↓`, `PgUp`, `PgDn`, `Home`, and `End` to scroll, and `Esc` to return to the list.

## While the server runs

Unlike the [Game Config](game_config.md) page, this page lets you edit and save files while the server is running. The last line of the page then reads **Changes may need a server restart.**, because many mods read their configuration only when the server starts.

![The Mod Config page while the server runs. The last line of the page reads "Changes may need a server restart.", and the bottom line ends with "Saved. May need a restart."](/screenshots/en/mod-config-18-server-running.svg)

1. This note remains visible as long as the server is running.
2. The message shown when you save while the server is running.

Whether a change requires a restart depends on the mod. When in doubt, restart the server on the [Server](server.md) page.

## In a narrow terminal

When the terminal is too narrow to show the list and the file side by side—under about 90 columns—the page shows one at a time.

1. The file list fills the page. Press `Enter` on a file.

   ![The Mod Config page in a terminal of 72 columns: only the list of files is shown, and the sidebar shows icons.](/screenshots/en/mod-config-19-narrow-files.svg)

2. The file fills the page, with the mod and file names on the first line. Press `Esc` at the top level to return to the list.

   ![The same terminal with the file of GMLIB open: its first line reads "GMLIB · config/config.json", and its three values follow.](/screenshots/en/mod-config-20-narrow-file.svg)

Everything else works as in a wide terminal. See [Small terminals](tour.md#small-terminals) for more about narrow terminals.
