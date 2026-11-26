# Game Config

This page shows how to change the game settings from the interface: the server properties, who may join the server, and what each player is allowed to do.

The Game Config page edits three files in the server folder. You never open them in a text editor: the page displays each file as a list and writes your changes back when you save.

| Section | File | Holds |
| --- | --- | --- |
| **Properties** | `server.properties` | The server settings: its name, the game mode, the port, and so on. |
| **Allowlist** | `allowlist.json` | The players who may join while the `allow-list` property is on. |
| **Permissions** | `permissions.json` | The players who have their own permission instead of the default one. |

::: info When a change takes effect
The server reads these files when it starts. Any change you save takes effect the next time the server starts, as shown at the bottom right of the page: **Applies on next server start.**
:::

## Find your way around

To open the page, move to **Game Config** in the sidebar with `↓` and press `Enter`.

![The Game Config page: the three sections at the left, the properties of the server at the right, the description of the selected property below them, and the Save and Discard buttons at the bottom.](/screenshots/en/game-config-01-properties.svg)

1. The three sections. Use `↑` and `↓` to select one; press `Enter` or `→` to enter its rows.
2. The rows of the section. In **Properties**, each row shows a property and its value.
3. The description of the selected row. For a property, this is the English comment that the game wrote below it in `server.properties`, including its allowed values.
4. **Save** and **Discard**. You can select these only when you have unsaved changes.

| Key | Does |
| --- | --- |
| `↑` `↓` | Moves through the sections or the rows. |
| `Enter` | In the sections: enters the rows. On a row: changes it or opens its actions. |
| `Space` | Toggles an on/off property. |
| `Tab` | Moves to the next part: sections, rows, buttons. |
| `Esc` | Moves back one part: buttons, rows, sections, sidebar. |

The bottom line of the screen always shows the keys that work in your current location. [A tour of the interface](tour.md) explains the keys shared across every page.

## Change a property

Press `Enter` to move into the rows of **Properties**. What `Enter` does on a property depends on the kind of value it holds. lip detects the value type from the `Allowed values:` line in the description.

### Switch a property on or off

A property that is `true` or `false` shows a checkbox: `[x]` is `true`, and `[ ]` is `false`.

1. Move to the property, here `allow-cheats`.

   ![The property allow-cheats is selected. Its value is an empty box, and its description below the list says that cheats like commands can be used when it is true.](/screenshots/en/game-config-05-boolean.svg)

   1. The value: an empty box is `false`, and a checked box is `true`.
   2. What the file says about the property.

2. Press `Space` or `Enter` to toggle the box.

   ![allow-cheats now shows a checked box. A star stands before it and after the section name Properties, the description starts with "Original: false", and the Save and Discard buttons are bright.](/screenshots/en/game-config-06-changed.svg)

Nothing is written to the file yet. The page marks your changes in four ways:

1. A star `*` appears before the property.
2. A star appears after the section name.
3. The description shows **Original:** followed by the value still saved in the file.
4. **Save** and **Discard** become selectable.

### Choose one of a few values

A property with a fixed set of values, such as `gamemode`, opens a list.

1. Move to the property and press `Enter`.
2. Select a value with `↑` and `↓`, then press `Enter`. Press `Esc` to close the list without making a change.

![A list titled gamemode with the values survival, creative and adventure; survival is selected.](/screenshots/en/game-config-02-choose.svg)

### Type a number or a text

Any other property opens a field with its current value. Type the new value and press `Enter`, or press `Esc` to close the field without making a change.

Numbers must be whole numbers. If the file specifies a range or a minimum value, the field displays it. If you enter a value outside that limit, the field rejects it, stays open, and explains why. A property described in the file as a positive integer, such as `max-players`, accepts neither 0 nor a negative number, and `view-distance` accepts nothing below 5.

![The field of server-port, labelled "Value (1–65535)", holds 70000. Below it the message "Enter an integer from 1 to 65535." is shown.](/screenshots/en/game-config-08-number.svg)

1. The range allowed by the file.
2. Why the value was rejected. Correct it and press `Enter` again.

Text values are a single line, saved just as you type them.

![The field of server-name holds "Survival SMP".](/screenshots/en/game-config-09-text.svg)

### Take a change back

On a modified property, pressing `Enter` opens a menu instead: its first row edits the value again, and **Reset value** restores the value currently saved in the file.

![The menu of the changed property allow-cheats with two rows, Toggle and Reset value.](/screenshots/en/game-config-07-reset.svg)

`Space` still toggles an on/off property directly.

## Edit the allowlist

The allowlist names the players who may join. The server uses it only while the `allow-list` property in **Properties** is on.

1. In the sections, move to **Allowlist** and press `Enter`. The first row is **Add player…**; below it are the players, each with their XUID if the file has one. A player who may join a full server is marked **ignores player limit**.

   ![The Allowlist section: the row "Add player…", then the players Steve, Alex, Noor and Kai with their XUIDs. Steve is marked "ignores player limit".](/screenshots/en/game-config-03-allowlist.svg)

2. Press `Enter` on **Add player…**. Type the name, press `Tab`, and type the XUID if you know it.

   ![The Add player dialog with two fields: Name holds Sunny, and "XUID (optional)" holds a number of sixteen digits.](/screenshots/en/game-config-12-add-player.svg)

   1. **Name**: the player's gamertag. A name already on the list is rejected.
   2. **XUID (optional)**: the player's Xbox account number, digits only. Leave it empty if you do not know it.

3. Press `Enter`. The player is added to the end of the list and selected.

4. Press `Enter` on a player to open their actions.

   ![The menu of the player Sunny with two rows: "Ignore player limit" and "Remove".](/screenshots/en/game-config-13-player-menu.svg)

   1. **Ignore player limit** lets the player join when the server is full. For a player who already has this setting, the row reads **Apply player limit** and removes it.
   2. **Remove** takes the player off the list.

   ![The row of Sunny now ends with "ignores player limit".](/screenshots/en/game-config-14-ignores-limit.svg)

## Edit the permissions

Permissions give individual players a different permission level from the default that every new player gets, which is set by the `default-player-permission-level` property in **Properties**.

1. In the sections, move to **Permissions** and press `Enter`.

   ![The Permissions section: the row "Add player…", then two players shown by XUID, one with the permission operator and one with member.](/screenshots/en/game-config-15-permissions.svg)

   1. A player. This file identifies players by XUID only, not by name.
   2. That player's permission.
   3. What the list is for.

2. Press `Enter` on **Add player…** and type the player's XUID.

   ![The Add player dialog of the permissions with one field, XUID, which holds a number of sixteen digits.](/screenshots/en/game-config-16-add-permission.svg)

   ::: tip Where to find an XUID
   The allowlist shows the XUID of every player whose XUID is in the file. The server also writes it to its output when a player connects; see [Server](server.md).
   :::

3. Press `Enter` and choose the permission. The list starts on `member`, or on the player's current permission if the XUID is already on the list; in that case, it updates the player's permission instead of adding a second row.

   ![A list titled with the XUID: operator, member and visitor. member is selected, and the line below says "Can play and build."](/screenshots/en/game-config-17-permission.svg)

   | Permission | The player |
   | --- | --- |
   | `operator` | Can use every command. |
   | `member` | Can play and build. |
   | `visitor` | Can only look around. |

4. Press `Enter` on a player to open their actions: **Change permission…** opens the same list, and **Remove** takes the player off the list.

   ![The menu of a player of the permissions with two rows: "Change permission…" and "Remove".](/screenshots/en/game-config-18-permission-menu.svg)

## Save or discard your changes

Changes across all three sections are saved together.

1. Press `Tab` until the buttons have focus. From the last row of a list, `↓` also moves focus there.

   ![The Save button has the focus. The note at the bottom right reads "Applies on next server start."](/screenshots/en/game-config-10-save.svg)

   1. The page note: the server reads the files when it starts.

2. Press `Enter` on **Save**. lip writes every file that has changes and shows **Saved.** at the bottom right. The stars disappear.

   ![The properties after saving, without stars. The bottom line ends with "Saved."](/screenshots/en/game-config-11-saved.svg)

What lip writes:

- In `server.properties`, only the values of the properties you changed. Every other character in the file stays intact, including comments.
- `allowlist.json` and `permissions.json` are rewritten in full. Players keep their order, and any player data not shown on the page is preserved. Comments in these files are not kept.
- `allowlist.json` and `permissions.json` are created if they do not exist. `server.properties` is not; see [Files that cannot be edited](#files-that-cannot-be-edited).

To discard your changes instead, move to **Discard** with `→` and press `Enter`. lip asks for confirmation, then reloads all three files.

![The dialog "Discard changes" asks "Discard the changes?" with the buttons Discard and Cancel.](/screenshots/en/game-config-19-discard.svg)

### Leave the page with unsaved changes

If you go to another page, select another workspace, or quit lip while you have unsaved changes, lip asks what to do with them.

![The dialog "Unsaved changes" asks "Save the changes?", names allowlist.json and permissions.json, and has the buttons Save, Discard and Cancel.](/screenshots/en/game-config-20-unsaved.svg)

| Button | Action |
| --- | --- |
| **Save** | Saves the named files (1), then continues. |
| **Discard** | Drops the changes, then continues. |
| **Cancel**, or `Esc` | Stays on the page and keeps your changes. |

### A file that changed on disk

lip reads the files when the page opens. If you or the server change a file on disk after lip reads it, saving will not overwrite it without asking.

![The dialog "Save game config" says "Changed on disk since it was read. Overwrite?", names allowlist.json, and has the buttons Overwrite and Cancel.](/screenshots/en/game-config-21-changed-on-disk.svg)

1. The file that changed. Neither this file nor any other has been written yet.
2. **Overwrite** replaces the version on disk with yours. **Cancel**, which `Enter` selects by default, writes nothing and keeps your changes on the page.

To see the current contents of the file, choose **Cancel**, then **Discard**.

## Files that cannot be edited

A new server has no `server.properties` until it has run once, because the game creates the file on first start. The page notes this and does not create the file. Start the server once on the [Server](server.md) page, stop it, and return here.

![The Properties section shows no rows, only a sentence that says that server.properties does not exist yet and that starting the server once creates it.](/screenshots/en/game-config-22-missing.svg)

1. The server creates the file when it first starts.

If lip cannot read a file—such as an `allowlist.json` with a syntax error—it displays the raw file and never writes to it. Fix the file in a text editor.

![The Allowlist section shows a warning, the message of the JSON reader with a line number, and below a rule the text of allowlist.json.](/screenshots/en/game-config-23-unreadable.svg)

1. lip never writes to a file it cannot read. Saving the other sections leaves it untouched.
2. Where the file is broken. This message is always in English, regardless of the interface language.
3. The raw file. If it is longer than the view area, press `Enter` to focus it and `↑` `↓` to scroll.

## While the server runs

While the server of the selected workspace is running, the page is read-only: you can browse the three files, but you cannot change or save anything. This applies whether the server was started from the interface or with `lip run` in another terminal. Stop the server on the [Server](server.md) page to edit.

![The Game Config page while the server runs. The top bar says Running, and the note at the bottom right reads "Server runs: stop it to edit."](/screenshots/en/game-config-04-server-running.svg)

Pressing `Enter` on a row still opens its actions menu so you can see the available options. The actions are dimmed, and the menu explains why: **Stop the server first.**

![The menu of allow-cheats while the server runs: its only row, Toggle, is dimmed, and below a rule it says "Stop the server first."](/screenshots/en/game-config-26-running-menu.svg)

If the server starts while you have unsaved changes, the page keeps them:

![The page with an unsaved change while the server runs. The note at the bottom right reads "Server runs: stop it to save."](/screenshots/en/game-config-24-running-unsaved.svg)

1. The note changes to **Server runs: stop it to save.** Once the server stops, you can save as usual.
2. Meanwhile, **Discard** is the only active button.

You cannot save when leaving the page either. lip offers to discard the changes or stay on the page:

![The dialog "Unsaved changes" says "Changes cannot be saved while the server runs.", names server.properties, and has the buttons Discard and Cancel.](/screenshots/en/game-config-25-running-leave.svg)

When the server stops, lip reloads the three files, as the server may have modified them. However, it does not reload them if you have unsaved changes; when you save later, lip asks before overwriting [a file that changed on disk](#a-file-that-changed-on-disk).

Mod configuration files work differently: you can save them while the server runs. See [Mod Config](mod_config.md).
