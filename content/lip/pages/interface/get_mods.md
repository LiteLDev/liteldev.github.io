# Marketplace

The Marketplace page shows the [levimc.org](https://levimc.org/mods/) mod list inside lip. After reading this page, you will know how to find a mod by searching, sorting, and filtering, read about it, and install the version that fits your server.

If the keys or the parts of the screen are new to you, read [A tour of the interface](./tour.md) first.

## The page

![The Marketplace page. Numbers mark the search, sort and filter rows, the list of mods, and the details of the highlighted mod.](/screenshots/en/get-mods-01-list.svg)

1. **Search**, **Sort**, and **Filters** control which mods are listed and in what order.
2. **The list** of mods. The page opens with the focus here.
3. **The details** of the highlighted mod.

Pressing `↑` on the first mod moves up to Filters, Sort, and Search. Pressing `↓` from there, or `Enter` in the search box, returns to the list. `Tab` cycles through these parts too.

Because lip manages servers, the list contains only mods that can run on a server. lip fetches the list from levimc.org each time you open it and saves none of it to disk.

## The list

![The list of mods in a server that has mods. Numbers mark the check marks, the name and author, the downloads, the stars, the date and the count.](/screenshots/en/get-mods-06-columns.svg)

1. `✓` marks a mod that is installed in this workspace.
2. The name of the mod, followed by a dot and its author.
3. `↓` is the number of downloads. `186k` is about 186,000.
4. `★` is the number of stars on GitHub.
5. The date of the last update.
6. The line above the list shows how many mods are currently listed.

If a mod has no downloads or stars, that column is left blank. In a narrow terminal, the date is hidden first, then the downloads.

### The details

The details update as you move through the list. They show the mod's description, followed by:

| Row | Shows |
| --- | --- |
| Author | Who publishes the mod. |
| Downloads, Stars | The exact numbers. |
| ID | The address of the mod's repository. This is the name of the mod on the [Mods](./mods.md) page. |
| Latest | The newest version, and its variant after `#` when the mod has variants. |
| Platform | The systems the mod is built for. |
| Game | The game versions it supports. |
| Tags | What kind of mod it is. |
| License | The license of the mod. |
| Depends | What the mod needs, along with the versions it accepts. lip installs these for you. |
| Updated | The date of the last update. |

When the details are too long for their box, a `▼` appears at the right edge. Press `Tab` to focus the details, then scroll.

![The details have the focus and are scrolled. Marks at the right edge show that there is more above and below.](/screenshots/en/get-mods-07-details-scroll.svg)

1. The title of the details is bright while focused.
2. `▲` and `▼` show that there are more lines above and below.
3. The keys that scroll.

Press `Esc` to return to the list.

In a terminal of about 106 columns or wider, the details appear to the right of the list and show more rows at once:

![The Marketplace page in a wide terminal. The details are at the right of the list.](/screenshots/en/get-mods-08-wide.svg)

## Searching

Press `↑` until **Search** is highlighted, then type. The list updates as you type each letter.

![The word "legacy" is typed into the search. The list holds the three mods that match.](/screenshots/en/get-mods-02-search.svg)

The search checks each mod's name, author, description, tags, and license. If you type several words, a mod must match all of them.

The search also understands the interface language. Tags appear in your language, and you can search for them as shown: in the Chinese interface, `经济` finds mods with the Economy tag, just as `economy` does.

![The search holds the word "economy". One mod is listed, and its details show the tag Economy.](/screenshots/en/get-mods-09-search-language.svg)

Press `Enter` to move to the matching mods. To see all mods again, delete what you typed.

When nothing matches, the list says so:

![The search holds "dynmap". The list says "No mods match."](/screenshots/en/get-mods-10-no-match.svg)

## Sorting

Press `↑` until **Sort** is highlighted. Use `←` and `→` to change the sort order.

![The sort order is "Popularity". A mod with few stars and many downloads is listed above one with more stars.](/screenshots/en/get-mods-11-sort.svg)

| Order | The mods come |
| --- | --- |
| Relevance | In the order used on levimc.org. When you search, the best match comes first. |
| Popularity | Most popular first. |
| Updated | Most recently updated first. |
| Newest | Most recently published first. |

lip calculates **Popularity** from a mod's stars and downloads combined, just as levimc.org does. Both count equally, and each is measured against the other mods in the list. Because of this, the order matches neither stars nor downloads alone: in the screenshot, a mod with 61 stars and 171,000 downloads ranks above a mod with 152 stars and 64,000 downloads.

## Filtering

Filters narrow the list to mods that have—or do not have—certain attributes.

1. Press `↑` until **Filters** is highlighted, then press `Enter`.

   ![The row "Filters" is highlighted. Its value is "None".](/screenshots/en/get-mods-12-filters-row.svg)

2. The filter panel opens with its sections collapsed.

   ![The filter panel: Clear filters, then the sections Game version, Tags, License and Depends on, each with a number.](/screenshots/en/get-mods-13-filter-sections.svg)

   1. **Clear filters** removes every filter.
   2. The sections. The number shows how many values each section contains.
   3. How many mods match the filters. The list behind the panel updates immediately.

3. Press `Enter` on a section to open or close it, and press `Space` on a value to select it.

   ![The section Tags is open. One tag is marked [+], another [-], and the bottom of the panel says "Excluded" and "3 mods".](/screenshots/en/get-mods-14-filter-exclude.svg)

   1. `[+]` **included**: lists only mods with this value.
   2. `[-]` **excluded**: leaves out mods with this value.
   3. The state of the highlighted value, in words.

4. Press `Esc` to close the panel. The Filters row shows how many filters are active.

   ![The row "Filters" says "1 active", and the list holds two mods.](/screenshots/en/get-mods-16-filters-active.svg)

`Space` cycles through the states in turn: not chosen, included, and, where a section allows it, excluded.

| Section | Filters by | Include | Exclude |
| --- | --- | --- | --- |
| Game version | The game versions that a mod supports. | Yes | No |
| Tags | The kind of mod. Common tags come first, in your language. | Yes | Yes |
| License | The kind of license: permissive, weak copyleft, copyleft, other, or none. | Yes | No |
| Depends on | What a mod requires, such as a library. | Yes | Yes |

The number to the right of a value shows how many mods have it.

![The sections License and Depends on are open. "LegacyRemoteCall" is included, and two mods are left.](/screenshots/en/get-mods-15-filter-depends.svg)

1. License lists license categories rather than individual licenses.
2. Only mods that require LegacyRemoteCall are listed.
3. Two mods remain.

Filters stay active until you clear them or quit lip, and they work together with search.

## The menu of a mod

Press `Enter` on a mod to open its menu.

![The menu of a mod: Install…, README, Open in browser.](/screenshots/en/get-mods-04-menu.svg)

| Action | Does |
| --- | --- |
| Install… | Prompts for a version, then installs the mod. |
| README | Shows the text that the author wrote about the mod. |
| Open in browser | Opens the mod's page on levimc.org in your web browser. |

### README

The README opens in a full-screen window. Scroll with the arrow keys, `PgUp`, and `PgDn`. Press `Esc` or `Enter` to close it.

![The README of a mod in a window that fills the screen.](/screenshots/en/get-mods-17-readme.svg)

The README appears as plain text, just as the author wrote it. A mod without one says "No README."

### Open in browser

![The menu of a mod with "Open in browser" highlighted.](/screenshots/en/get-mods-18-open-in-browser.svg)

lip asks your system to open the page. On a server without a desktop environment, nothing may happen; use the README instead to read about the mod. For a mod without a page, the action is grayed out and says "This mod has no page."

## Installing a mod

Installing a mod always involves choosing a version. lip shows only the versions that fit your server, so you cannot pick an incompatible one.

1. Highlight the mod, press `Enter`, and choose **Install…**.
2. Choose a version. The newest compatible version is highlighted by default, so pressing `Enter` is usually all you need.

   ![The versions of LegacyMoney: 0.16.1 and 0.16.0, then "Custom…". The last line shows the mod and version that would be installed.](/screenshots/en/get-mods-25-versions-simple.svg)

   1. The compatible versions, newest first, each with its date.
   2. What lip installs when you press `Enter`.

3. Review the plan. It lists the mod and every other mod it requires.

   ![The plan: "would install LegacyRemoteCall 0.13.0" and "would install LegacyMoney 0.16.1".](/screenshots/en/get-mods-26-install-plan.svg)

   1. A mod that LegacyMoney requires. lip installs it too.
   2. **Apply** installs both. **Cancel** installs nothing.

4. Choose **Apply**. When finished, lip shows what it did.

   ![The result: two lines that start with "Installing", then "✓ Done."](/screenshots/en/get-mods-27-install-result.svg)

5. Press `Enter`. The mod and anything installed alongside it now have a `✓` in the list.

   ![The list after the install. LegacyMoney and LegacyRemoteCall have a check mark.](/screenshots/en/get-mods-28-installed.svg)

The mod loads the next time the server starts. [Preview, then Apply](./tour.md#preview-then-apply) describes the plan, the progress, and what happens when something fails.

## Choosing a version

### Variants

Some mods come in several variants—separate builds of the same mod for different uses. Variants appear as tabs at the top of the dialog. Press `←` and `→` to switch variants, and the version list below updates to match.

![The versions of LegacyScriptEngine. The tabs are lua, quickjs, nodejs and python, and quickjs is chosen.](/screenshots/en/get-mods-05-versions.svg)

1. The variants, with the selected one in brackets.
2. The versions of the selected variant that are compatible with your server.
3. What lip installs: the mod, `#` and the variant, `@` and the version.

Check the mod's README to see which variant you need. A mod with only one variant has no tabs.

If a mod has too many variants to fit in one row, the row scrolls horizontally as you move through them. `‹` and `›` at either end show that more variants lie in that direction.

![A mod with ten variants. The row of tabs shows some of them, with "‹" at its left end and "›" at its right end.](/screenshots/en/get-mods-23-variants-overflow.svg)

1. More variants to the left.
2. The selected variant.
3. More variants to the right.

### Only versions that fit

The list shows only the versions that work with the game and LeviLamina in your workspace. Older or newer versions that require a different LeviLamina are left out, even if they appear on levimc.org.

If no version of the selected variant is compatible, a message explains what rules them out:

![The version dialog of LeviOptimize in a server with LeviLamina 26.40.1. A line says "No version fits LeviLamina 26.40.1.", and the only row is "Custom…".](/screenshots/en/get-mods-21-none-fits.svg)

1. The LeviLamina or game version that no version supports.
2. **Custom…** is still available.

From here you have three options: try another variant, look for another mod, or change the server's game and LeviLamina versions with **Change versions…** on the [Server](./server.md) page.

### Custom…

The last row, **Custom…**, lets you specify what to install yourself. Use it to install from a branch, tag, or commit—for example, to test an unreleased fix.

![The dialog "Custom version". The label is the mod followed by "@", and the gray text "branch:main" is an example.](/screenshots/en/get-mods-22-custom.svg)

Type what goes after the `@`: a version such as `1.8.0`, `branch:main`, `tag:` followed by a tag, or `rev:` followed by a commit. Press `Enter` to view the plan, or `Esc` to return to the version list.

lip does not check in advance whether the version you enter is compatible with your server. If it is not, the plan fails, explains why, and leaves everything unchanged.

## In a folder without a server

You can browse mods from any folder, but installing one requires a server so that lip knows which game version to match. In a folder without a server, **Install…** offers to set one up first:

![A dialog says "This folder has no server yet. Set one up first.", with the buttons Set up server… and Cancel.](/screenshots/en/get-mods-20-no-server.svg)

**Set up server…** opens the [Server](./server.md) page and starts the server setup there.

## While the server runs

You cannot install mods while the workspace server is running. **Install…** is dimmed, and the menu explains why. README and Open in browser still work as usual.

![The menu of a mod while the server runs. "Install…" is gray, and a line says "Stop the server first."](/screenshots/en/get-mods-19-server-running.svg)

Stop the server on the [Server](./server.md) page first.

## When the list cannot be read

If lip cannot read the list from levimc.org, the page shows an error instead of the mod list.

![The Marketplace page says "Cannot read the catalogue.", then why, and has a Retry button.](/screenshots/en/get-mods-24-unreachable.svg)

1. The list could not be read.
2. The reason reported by lip.
3. **Retry** tries reading the list again.

Check your connection, then press `Enter`. The GitHub proxy on the [Settings](./settings.md) page is not used for levimc.org, so it will not help here.

If you already know the mod's name, you can still install it with **Install from source…** on the [Mods](./mods.md#installing-from-a-source) page.
