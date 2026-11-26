# Develop Tools

This page covers the interface's two tools for package authors: creating and editing a `lip.toml` in a form that validates your input as you type, and migrating an old `tooth.json`.

If you only run a server, you can skip this page. To learn what a package is and how to publish one, read [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/).

## The page

The tools operate on the selected workspace. To work on one of your mods, start `lip` in the mod's folder, or choose that folder in the [workspace picker](workspaces.md), which opens from the top line.

To open the page, select **Develop Tools** in the sidebar and press `Enter`.

![The Develop Tools page in the folder D:\projects\WelcomeMod: two actions, of which "Migrate tooth.json" is dimmed, one sentence about the selected one, and below it the workspace and whether it has a lip.toml and a tooth.json, both "None".](/screenshots/en/tools-05-status.svg)

1. A description of the selected action. Use `↑` and `↓` to move, and press `Enter` to run the action.
2. The selected workspace—the folder where the actions run.
3. Whether that folder contains a `lip.toml` and a `tooth.json`: **Found** or **None**. lip checks again every two seconds, so these lines reflect changes you make outside lip.
4. A dimmed action, which cannot run in this folder in its current state. See [Dimmed actions](#dimmed-actions).

| Action | Does | On the command line |
| --- | --- | --- |
| **Create lip.toml** | Opens a form that writes the package file for a new package. When the folder already has a `lip.toml`, the action becomes **Edit lip.toml**, and the form edits that file. | [`lip pkg init`](../reference/commands/pkg_init.md) creates one without the form |
| **Migrate tooth.json** | Converts a lip 0.x package file to a `lip.toml`. | [`lip pkg migrate`](../reference/commands/pkg_migrate.md) |

## Dimmed actions

The two files shown in the status lines determine whether **Migrate tooth.json** is available. When they rule it out, the action is dimmed. Selecting it shows the reason below its description, and the bottom line of the screen no longer offers `Enter`.

![The action "Migrate tooth.json" is selected and dimmed. Below its sentence the page says "There is no tooth.json here."](/screenshots/en/tools-06-migrate-disabled.svg)

1. The reason.

| Dimmed when | The page says |
| --- | --- |
| The folder has a `lip.toml`. lip does not overwrite an existing file. | **lip.toml already exists here.** |
| The folder has no `tooth.json`. | **There is no tooth.json here.** |

The first action is never dimmed: it either creates a `lip.toml` or edits the existing one. Whether a server is running makes no difference on this page, because neither action modifies a server.

The action becomes available again as soon as the files allow it—within two seconds of any change you make outside lip.

## Create lip.toml

1. Select **Create lip.toml** and press `Enter`. A form replaces the list. Its title is **Create lip.toml**, followed by the path of the file it will write. It has a row for every key in `lip.toml`, pre-filled for a Windows x64 server at version `0.1.0`. Only the package id is missing: the line below the title reads **1 value needs fixing.** until you enter one.

2. Type the package id—the address of the package's repository, such as `github.com/owner/repo`.

   ![The form "Create lip.toml" with the path D:\projects\WelcomeMod\lip.toml. At the top: "✓ Every value is valid." The section Package holds "Package id" github.com/steve/WelcomeMod and Version 0.1.0, each marked ✓; the section Information holds Name, Description, "Logo URL" and Tags; the section "Default variant" starts below. At the bottom: the buttons Save and Cancel.](/screenshots/en/tools-07-init-form.svg)

   1. Each value is validated as you type and marked on the right: `✓` valid, `✗` invalid, or `⋯` being checked online. A line below the selected row describes the value; if a value is marked `✗`, the line explains why it is invalid.
   2. Overall file status: **Every value is valid.**, or the number of values that need fixing, are being checked online, or could not be confirmed.

   Move between rows with `↑`, `↓`, and `Tab`, and type into the selected row. On a row with additional options, such as a variant entry or a list, press `Enter` to open a menu where you can add or remove an entry, an asset, or a variant. Each variant's section continues below the first screen; press `PgDn` to move ten rows at a time.

3. Press `Ctrl+S`, or select **Save** at the bottom and press `Enter`. lip asks for confirmation before writing anything. If any value is marked `✗`, it writes nothing, displays **Fix the values marked ✗ first.**, and jumps to the first invalid value.

   ![The dialog "Save lip.toml". Under Changes, "A new lip.toml is written:" and five lines that start with +: format = 4, the id, the version 0.1.0, side "server" and platform "win-x64". Under "Expected installation": "As the Marketplace tells, for a server with these versions. lip install decides.", BDS ‹ 1.26.60 ›, LeviLamina ‹ 26.60.3 ›, and "✓ github.com/steve/WelcomeMod  Has an entry for server on win-x64." At the bottom: Save and Cancel.](/screenshots/en/tools-08-init-save.svg)

   - **Changes**: the keys to be written, prefixed with `+` for an added key, `~` for a changed key (showing both old and new values), and `-` for a removed key.
   - **Expected installation**: what would happen if the package were installed on a server with the selected **BDS** and **LeviLamina** versions, according to the Marketplace. Move up to a row with `↑` and change its value with `←` and `→`; if a package has more than one variant, a third **Variant** row appears. The package and each of its dependencies get a line: `✓` if it would be installed, or `✗` and the reason if it would not. This is only a forecast; [`lip install`](../reference/commands/install.md) makes the final decision.

   The dialog opens with **Save** selected: press `Enter` to write the file. Press `Esc` or select **Cancel** to return to the form.

4. lip writes `lip.toml`, closes the form, and displays **Saved lip.toml.** at the bottom of the screen.

The `lip.toml` from this example:

```toml
format = 4
id = "github.com/steve/WelcomeMod"
version = "0.1.0"

[[variants.""]]
side = "server"
platform = "win-x64"
```

Pressing `Esc` in the form closes it. If you made changes, lip prompts you first in the **Unsaved changes** dialog: **Discard** closes the form without saving, and **Cancel** returns to the form. Navigating to another page brings up the same prompt.

[lip.toml](../concepts/lip_toml.md) describes every key.

### Edit lip.toml

Once the folder has a `lip.toml`, the first action becomes **Edit lip.toml**:

![The Develop Tools page: the first action reads "Edit lip.toml", its sentence says that it "Edits the lip.toml of the workspace in a form that checks every value as you type.", and the status line of lip.toml reads Found. At the bottom right: "Saved lip.toml."](/screenshots/en/tools-09-edit.svg)

1. Now that the folder has a `lip.toml`, you can edit it in the same form.

Press `Enter` to open the file in the form, now titled **Edit lip.toml**. Saving preserves any keys in the file that do not have a row in the form. The **Save lip.toml** dialog tells you whether the file's comments and layout are also preserved: **Comments and other keys of lip.toml are kept.**, or **lip.toml is rewritten: its other keys are kept, but its comments and layout are not.** If the file changed on disk after you opened the form, lip asks again before overwriting it: **Overwrite** or **Cancel**.

lip will not open the form if `lip.toml` is not a valid TOML file or if a key has a value of the wrong type. Instead, it displays **lip.toml cannot be edited here. Fix it by hand first:** followed by the problem. Fix the file in a text editor, then select the action again.

### Dependencies

Each variant entry has a **Dependencies** row ending with **+ Add…**. Pressing `Enter` on it offers:

- **Find in Marketplace…**: type a name, an ID, or a tag to search the mods in the [Marketplace](get_mods.md), then press `Enter` on one;
- **Type a package id…**: enter any package ID, adding `#` and a variant name for a non-default variant.

lip then lists the package's versions, newest first; if the package has variants, choose one with `←` and `→` above the list. Press `Enter` on a version, or on the last row, **Without a version: type a range**. lip then offers version ranges:

| Range | Allows |
| --- | --- |
| **Patch updates (recommended)** | Every patch version at or above the chosen one. |
| **Minor updates** | Every version up to the next major version. |
| **This version or newer** | The chosen version and every newer one. |
| **Exactly this version** | Only the chosen version. |
| **Any version** | Whichever version is newest. |
| **Custom** | A range that you type, such as `>=1.2.0 <2.0.0`, `^1.2.0`, `~1.2.0`, or `1.*`. |

Below the list, lip shows how many known versions the selected range allows and which of them is newest. Press `Enter` to confirm the range.

Pressing `Enter` on a dependency in the list offers **Choose version…**, **Version range…**, **Change package id…**, and **Remove**. Each dependency is checked online: `✓` with **Found; newest in range:** and a version; `✗` when the package, its variant, or a version in its range cannot be found; and `?` when lip could not complete the check. The result of the online check never prevents you from saving.

## Migrate tooth.json

lip 0.x packages are described in a `tooth.json` file. This action writes an equivalent `lip.toml` and deletes `tooth.json`.

1. Select **Migrate tooth.json**. It is available when the status lines read `lip.toml` **None** and `tooth.json` **Found**.

   ![The action "Migrate tooth.json" is selected. The status lines read lip.toml None and tooth.json Found.](/screenshots/en/tools-10-migrate.svg)

   1. The status lines that make the action available.

2. Press `Enter`. If `tooth.json` is missing any information that `lip.toml` requires, lip prompts you for each missing value in turn. Here, the old file did not specify which platform it applies to:

   ![A dialog titled "lip asks" asks for "the platforms (RIDs, comma-separated, e.g. win-x64) the variants without a platform apply to", and the field holds win-x64.](/screenshots/en/tools-11-migrate-question.svg)

   Type the answer and press `Enter`. If an answer is invalid, lip asks again.

3. lip shows the result. Press `Enter`.

   ![The dialog "Migrate tooth.json" shows a line that starts with a warning sign about preserve_files, and ends with "Migrated tooth.json to lip.toml." and the button OK.](/screenshots/en/tools-12-migrate-result.svg)

   1. A note, marked `⚠`, for anything that the new file expresses differently from the old one or has no field for. Read each note and check the corresponding part of `lip.toml`. The notes are in English.
   2. The result: `lip.toml` is written, and `tooth.json` is deleted.

4. The status lines are now reversed, and the action is dimmed because there is nothing left to migrate. The first action is now **Edit lip.toml**: open the new file in the form to check it.

   ![The first action reads "Edit lip.toml". "Migrate tooth.json" is selected, and the page says "lip.toml already exists here." The status lines read lip.toml Found and tooth.json None.](/screenshots/en/tools-13-migrated.svg)

[Migrating packages](../authors/migrating_packages.md) explains the differences between the two formats.

## When an action fails

The page dims an action based only on the two status lines. An action can still fail for other reasons, such as a corrupted `tooth.json` or a folder that was just deleted. When that happens, lip leaves your files unchanged and shows a dialog titled with the action name and **Failed**.

![The dialog "Migrate tooth.json · Failed" starts with "error: Cannot read tooth.json", goes on with three lines that start with "caused by:", and names a report file.](/screenshots/en/tools-23-failed.svg)

1. **error:** what went wrong, and often how to fix it. Each **caused by:** line goes one step deeper into the underlying cause; the last one is usually the most specific. Here, `tooth.json` has no `version`. This text comes from the command and is in English.
2. **Full report:** a file containing the details, under `.lip/logs` in the workspace. Attach it when asking for help; see [Troubleshooting](../guides/troubleshooting.md).

Press `Enter` or `Esc` to close the dialog.
