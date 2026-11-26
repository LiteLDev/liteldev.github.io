# Mods

The Mods page lists what is installed on your server. After reading this page, you will know how to read the list, install a mod from a file, folder, or address, update and uninstall mods, and understand what each type of update does.

To find and install mods from levimc.org, use the [Marketplace](./get_mods.md) page instead. If the keys or screen layout are new to you, read [A tour of the interface](./tour.md) first.

## The list

![The Mods page of a server with four mods. Numbers mark the action rows, a mod that the user installed, and a row without a box.](/screenshots/en/mods-01-list.svg)

1. **The action rows** act on the whole workspace.
2. **Your mods**: the mods you installed. Each has a checkbox, `[ ]`, in front of it.
3. Rows without a checkbox are **dependencies**, shown in gray: mods that your mods need.

Each row shows a mod and its version. The name is the address of the mod's repository, such as `github.com/LiteLDev/LeviOptimize`. A suffix after `#` indicates the installed variant of the mod, such as `#lua`.

| Group | What it is | What you can do with it |
| --- | --- | --- |
| Your mods | A mod that you asked for. | Check it, update it, or uninstall it. |
| Dependencies | A mod installed because another mod needs it. | Update it. You cannot uninstall it directly; it is removed automatically when no other mod needs it. |

The game (`github.com/LiteLDev/bds`), its loader (`github.com/LiteLDev/LeviLamina`), and their exclusive dependencies are not listed because lip manages them alongside the server. To change their versions, use **Change versions…** on the [Server](./server.md) page.

The list header, `Installed (5)`, counts every row, including both your mods and their dependencies.

Pressing `↑` on the first mod moves the selection to the action rows, and pressing `↓` on the last action row moves it back to the list. Pressing `Tab` also moves from the action rows to the list.

::: info
Installing, updating, or uninstalling a mod does not change the order of the list. Each group is sorted by name, and the highlight stays on the previously selected mod.
:::

### The details area

The lower part of the page shows more information about the highlighted row: its name, its version, and a one-sentence description.

If a mod was not installed from a numbered version in its repository, a third row, **Source**, shows where it came from:

![A mod that was installed from a branch is highlighted. The details area has a row "Source  branch:main".](/screenshots/en/mods-09-source-branch.svg)

| Source row | The mod was installed from |
| --- | --- |
| None | A version in its repository. This is what the Marketplace installs. |
| `branch:main`, `tag:…` or `rev:…` | A branch, tag, or commit in its repository. |
| An address starting with `https://` | A `.zip` file on the web. |
| A path, such as `D:\downloads\SpawnTweaks` | A `.zip` file or folder on your disk. |

![A mod that was installed from a .zip file on the web. The Source row shows its address, shortened in the middle.](/screenshots/en/mods-10-source-url.svg)

![A mod that was installed from a folder. The Source row shows the path of the folder.](/screenshots/en/mods-12-source-local.svg)

The source determines what **Update** does; see [What an update does](#what-an-update-does).

### A folder without a server, or without mods

In a folder without a server, the list is empty, and the first action row, **Set up server…**, takes you to the [Server](./server.md) page to set one up. Mods require a server.

![The Mods page of an empty folder. The action rows are Set up server…, Install from source… and Marketplace, and the list says "No mods yet."](/screenshots/en/mods-05-no-server.svg)

1. **Set up server…** appears only when the folder has no server.
2. The details area shows a one-sentence description of the highlighted row.

On a server without mods, the list is also empty, and **Marketplace** replaces Update all:

![The Mods page of a server without mods. "Marketplace" is highlighted, and the list says "No mods yet."](/screenshots/en/mods-06-no-mods.svg)

## The menu of a mod

Press `Enter` on a row to open its menu.

![The menu of one of your mods: Details, Update, Update to version…, Uninstall.](/screenshots/en/mods-02-menu.svg)

| Action | Does |
| --- | --- |
| Details | Shows the mod's information from levimc.org. |
| Update | Updates the mod to the newest version compatible with your server. |
| Update to version… | Moves the mod to a specific version you specify. |
| Uninstall | Removes the mod and its files. |

A dependency does not have an Uninstall option:

![The menu of a dependency: Details, Update, Update to version…. The details area says "Installed because another mod needs it."](/screenshots/en/mods-31-dependency-menu.svg)

## Details

**Details** shows the mod as it appears on the Marketplace page: its description, author, downloads, stars, license, and dependencies.

![The details of a mod in a dialog, with the buttons README, Open in browser and Close.](/screenshots/en/mods-03-details.svg)

**README** opens the text written by the author about the mod. **Open in browser** opens the mod's page on levimc.org.

The details come from the levimc.org catalogue. If the catalogue does not list the mod—for example, one that you installed from your own disk—lip says "The catalogue has no entry for this mod."

If the catalogue cannot be read, lip says "Cannot read the catalogue." Try again once your connection is back.

## Installing from a source

**Install from source…** installs a mod that you specify yourself, rather than one that you pick on the Marketplace page. Use it for a `.zip` file or folder that someone gave you, or for a mod not listed on levimc.org.

1. Press `↑` until the action row **Install from source…** is highlighted, then press `Enter`. lip asks how you want to specify the mod.

   ![The choice "Install from source" with two rows: Browse… and Type a source….](/screenshots/en/mods-14-install-choice.svg)

2. Choose one of the two options below.

### Browse…

Choose **Browse…** for a `.zip` file or folder on your disk. lip opens the [file browser](./tour.md#the-folder-and-file-browser), which lists folders and `.zip` files.

![The file browser in D:\downloads. A .zip file is highlighted.](/screenshots/en/mods-15-browse.svg)

1. For a `.zip` file, highlight it and press `Enter`.
2. For a package in a folder, open that folder and choose **Select this folder**.

lip then shows the plan:

![The plan of installing a local .zip file: one line that says which mod and version would be installed, and from which file.](/screenshots/en/mods-16-install-local-plan.svg)

Choose **Apply** to install. Pressing `Esc` in the browser returns to the previous menu.

### Type a source…

Choose **Type a source…** for a mod on the web. The field starts empty, showing an example in gray.

![The dialog "Install from source" with an empty field. The gray text "github.com/owner/repo@1.2.3" is an example.](/screenshots/en/mods-17-type-source-empty.svg)

Type or paste one of the following:

| What you type | Installs |
| --- | --- |
| `github.com/engsr6982/PLand` | The newest version from that repository compatible with your server. |
| `github.com/engsr6982/PLand@0.19.0` | That specific version. |
| `github.com/LiteLDev/LegacyScriptEngine#lua` | The `lua` variant of the mod. |
| `github.com/owner/repo@branch:main` | The `main` branch. `tag:` and `rev:` specify a tag and a commit in the same way. |
| `https://example.com/mod.zip` | The `.zip` file at that address. |
| `D:\downloads\mod.zip` | A file or folder on your disk. Enclose paths containing spaces in double quotes. |

To install several mods at once, separate them with spaces.

![The same dialog with "github.com/engsr6982/PLand@0.19.0" typed into the field.](/screenshots/en/mods-18-type-source.svg)

Press `Enter`. lip shows the plan; choose **Apply** to install.

![The plan of the install: "Dry run: would install github.com/engsr6982/PLand 0.19.0 (3 files)".](/screenshots/en/mods-19-install-plan.svg)

If the mod requires other mods, the plan lists them as well, and lip installs them alongside it. [Managing packages from the commands](../guides/managing_packages.md) describes every source format.

## Updating

There are three ways to update, and all of them show a [plan](./tour.md#preview-then-apply) first.

### Update

**Update** in a mod's menu updates that mod to the newest version compatible with your server's game and LeviLamina versions.

![The plan of an update: "would uninstall LegacyScriptEngine#lua 0.13.1" and "would install LegacyScriptEngine#lua 0.13.2".](/screenshots/en/mods-26-update-plan.svg)

An update removes the old version and installs the new one. Choose **Apply**:

![The result of the update: the old version was uninstalled, the new one installed, then "✓ Done."](/screenshots/en/mods-27-update-result.svg)

The list then shows the new version:

![The list after the update. The mod now has the version 0.13.2.](/screenshots/en/mods-28-updated.svg)

### Update to version…

**Update to version…** moves the mod to a version you choose. Because you can pick a newer or older version than the installed one, this is also how you roll back to an earlier version.

1. Open the mod's menu and choose **Update to version…**.

   ![The menu of a mod with "Update to version…" highlighted.](/screenshots/en/mods-22-update-to-menu.svg)

2. Type what follows the `@`: a version such as `0.13.0`, or `branch:`, `tag:`, or `rev:` followed by a name.

   ![The dialog "Update to version". The label ends in "@", and the field holds "0.13.0".](/screenshots/en/mods-24-update-to.svg)

   If lip cannot parse what you typed, the dialog stays open and shows the expected format.

   ![The field holds "tag:". A line below says "Give a version, branch:<name>, tag:<name> or rev:<commit>."](/screenshots/en/mods-23-update-to-invalid.svg)

3. Press `Enter`, review the plan, and choose **Apply**.

   ![The plan: "would uninstall LegacyScriptEngine#lua 0.13.1" and "would install LegacyScriptEngine#lua 0.13.0".](/screenshots/en/mods-25-update-to-plan.svg)

A mod installed from a `.zip` file on the web or from your disk has no other versions to specify. For these mods, the action is grayed out, and the menu explains why:

![The menu of a mod from a URL. "Update to version…" is gray, and a line says "Only a mod from a repository has versions."](/screenshots/en/mods-11-url-menu.svg)

### Update all

**Update all** is the second action row. It updates all of your mods, just as if you ran Update on each one individually. It leaves dependencies, the game, and the loader unchanged, unless an updated mod requires a newer dependency.

![The action row "Update all" is highlighted. The details area says "Updates every mod that you installed."](/screenshots/en/mods-20-update-all.svg)

The plan lists only what would change. Here, one of four mods has a newer version:

![The plan of Update all: four lines that start with "Resolving", then one uninstall and one install of LegacyScriptEngine#lua.](/screenshots/en/mods-21-update-all-plan.svg)

If a mod was installed from a folder or file that no longer exists, it is left as is, and the plan notes this.

### What an update does

How Update and Update all handle a mod depends on where it was installed from. Check the [Source row](#the-details-area) to see which case applies.

| The mod was installed from | Update |
| --- | --- |
| A repository version, for example via the Marketplace | Moves it to the newest version compatible with your server. It does not stay at the version you originally picked. |
| A branch, such as `branch:main` | Stays on that branch and updates to its latest state. |
| A tag or a commit | Stays there. A commit never changes, and a tag changes only if its author moves it. |
| A `.zip` file on the web | Downloads the file again and installs its current contents. |
| A `.zip` file or a folder on your disk | Reads it again and installs its current contents. |

Here, Update re-downloads a mod's file from the web and finds a newer version inside:

![The plan of updating a mod from a URL: the old version would be uninstalled and version 1.2.1 installed from the same address.](/screenshots/en/mods-13-update-url-plan.svg)

Update to version… always moves the mod to the target you specify, regardless of what it was tracking before. If a mod is on a branch, specifying a version takes it off that branch.

To keep a mod at a specific version, do not update it. There is no way to pin a mod so that Update all skips it.

### When there is nothing newer

When a mod is already at its newest version, there is nothing to apply: the plan says "Nothing would change." and shows only a **Close** button. This happens no matter how often you choose Update, even for a mod that the Marketplace installed at a specific version you picked.

![The plan of an update that changes nothing: "Nothing would change.", with a Close button.](/screenshots/en/mods-30-up-to-date.svg)

In two cases, the plan says instead that only lip's record would change. Neither case modifies any server files, so you can apply or cancel them as you like.

The first case is running **Update to version…** with the version that is already installed. lip then records that you explicitly want this version.

The second case is running Update on a dependency. lip then promotes the dependency to one of your mods: it moves up into your mods list, gets a box, and can be uninstalled directly.

![The plan: "would mark LegacyRemoteCall 0.13.0 as explicitly installed." and "Only lip's record of the packages would change."](/screenshots/en/plan-03-record-only.svg)

## Uninstalling

1. Highlight the mod and press `Enter`.
2. Choose **Uninstall**.

   ![The menu of a mod with "Uninstall" highlighted.](/screenshots/en/mods-34-uninstall-menu.svg)

3. Review the plan. It lists the mod alongside any dependencies that no other mod needs anymore.

   ![The plan of an uninstall: the mod and one dependency would be uninstalled.](/screenshots/en/plan-01-changes.svg)

4. Choose **Apply**.

   ![The result: "Uninstalling LegacyMoney 0.16.1", then "✓ Done."](/screenshots/en/mods-35-uninstall-result.svg)

Uninstalling removes the files that the mod installed. Files that the mod created while the server was running, such as configuration or data files, may remain in its folder under `mods`.

## Several mods at once

To update or uninstall several mods at once, check them first.

1. Highlight a mod and press `Space`. Its box changes to `[x]`. Do the same for the others.

   ![Two mods are checked. The header of the list says "Installed (5) · 2 checked".](/screenshots/en/mods-07-checked.svg)

   1. `Space` checks or unchecks the highlighted mod.
   2. The header shows how many are checked.

2. Press `Enter` to open the menu for the checked mods.

   ![The menu titled "2 checked": Details of LeviOptimize, Update 2 mods, Uninstall 2 mods, Uncheck all.](/screenshots/en/mods-08-batch-menu.svg)

   1. **Details of …** applies only to the highlighted row, which does not have to be checked.
   2. **Update … mods** and **Uninstall … mods** act on all checked mods in a single plan.
   3. **Uncheck all** clears the checks.

Only your mods can be checked; dependencies have no checkbox. Checks are cleared after an update or uninstall.

## While the server runs

While the workspace's server is running, the page is read-only.

![The Mods page while the server runs. A yellow line says "The server is running. Stop it to change mods.", and the action rows are gray.](/screenshots/en/mods-36-server-running-page.svg)

1. A notice at the top of the page states that the server is running.
2. **Install from source…** and **Update all** are grayed out, and pressing `Enter` on them does nothing.
3. The details area shows "Stop the server first."

In a mod's menu, Update, Update to version…, and Uninstall are grayed out with the same message. Details still works.

![The menu of a mod while the server runs. "Update" is gray, and a line says "Stop the server first."](/screenshots/en/mods-04-server-running.svg)

If the server starts or stops while a menu is open, the menu updates immediately.

Stop the server on the [Server](./server.md) page, change your mods, and start it again. Because mods load when the server starts, any changes require a restart anyway.
