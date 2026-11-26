# Install mods on your server

By the end of this tutorial, your server will run two mods: LeviOptimize, which makes the server faster, and LegacyScriptEngine, which runs script plugins. You will find mods in the LeviMC Mods catalog, install them with `lip` (either in its interface or from the command line), verify that LeviLamina loads them, and learn how to update and remove them.

## What you need

- A server with LeviLamina, set up with `lip`: see [Your first server](first-server.md) or [A server from the command line](command-line.md). This tutorial uses the folder `D:\servers\survival`.
- The server **stopped**. While the server is running, the `lip` interface does not modify its folder, and a running server only loads new mods when it restarts anyway.
- An internet connection. Mods are downloaded from GitHub.

A server in Docker installs mods through its `PACKAGES` variable instead: see [A server in Docker](docker.md#_3-add-mods). The mod names are the same.

## 1. Find a mod in the catalog

1. Open [LeviMC Mods](https://levimc.org/mods/) and search for `LeviOptimize`.
2. Open its page. Check **Side**: a mod for your server must list the server. Check the game versions: one of them must match your server's version.
3. Press **Install**. The dialog lets you choose a **Variant** and a **Version**, and shows the command under "Run this in your server folder with lip:", for example:

   ```shell
   lip install github.com/LiteLDev/LeviOptimize@0.18.0
   ```

   If you omit `@<version>` at the end, `lip` automatically picks the newest version compatible with your server.

You do not need the website to install mods: the **Marketplace** page in `lip` shows the same catalog. Choose one of the two methods below.

## 2. Install a mod

### In the interface

1. Start `lip` in the server folder (`cd D:\servers\survival`, then `lip`). On **Home**, select **Install mods** and press `Enter`. The **Marketplace** page opens.
2. Press `↑` until you reach **Search**, type `optim`, and press `Enter`. LeviOptimize is selected.
3. Press `Enter`, then press `Enter` again on **Install…**.
4. `lip` lists only the versions compatible with your game and LeviLamina. Keep the newest version selected and press `Enter`.
5. `lip` shows its plan, such as `Dry run: would install LeviOptimize 0.18.0`. If the mod requires other mods, they are listed too. Press `Enter` on **Apply**.
6. You should see **✓ Done.**, and back in the list, LeviOptimize now has a **✓**.

![The Marketplace page after the installation: the row of LeviOptimize starts with a tick.](https://levimc.org/lip/screenshots/en/first-server-19-mod-installed.svg)

### With a command

In the server folder, run:

```shell
lip install LeviOptimize
```

A short name like `LeviOptimize` expands to `github.com/LiteLDev/LeviOptimize`; mods by other authors require the full address from their page. `lip` installs the mod and all of its dependencies into `mods/`. You should see:

```text
✓ Packages installed successfully.
```

`lip list` now shows `github.com/LiteLDev/LeviOptimize` under **User-Requested**.

## 3. Install LegacyScriptEngine

LegacyScriptEngine (LSE) runs plugins written in a scripting language. It comes in four **variants**, one for each language; install the one that matches your plugins. Without a variant, `lip install LegacyScriptEngine` installs both the QuickJS and Lua engines.

| Variant | Language |
| --- | --- |
| `#lua` | Lua |
| `#quickjs` | JavaScript (QuickJS) |
| `#nodejs` | JavaScript (Node.js) |
| `#python` | Python |

1. Install a variant, for example Lua:

   ::: code-group

   ```shell [Command]
   lip install LegacyScriptEngine#lua
   ```

   ```text [Interface]
   Marketplace → search "LegacyScriptEngine" → Enter → Install…
   → choose the variant with ← and → → Enter → Apply
   ```

   :::

   ![The versions of LegacyScriptEngine. The variant tabs are lua, quickjs, nodejs and python.](https://levimc.org/lip/screenshots/en/get-mods-05-versions.svg)

   `lip` also installs LSE's dependencies: LegacyRemoteCall, LegacyMoney, and iListenAttentively.

2. To install multiple engines, install each variant the same way.

::: warning The Python engine needs Python
Before you install `#python`, install Python on the server machine: Python 3.12.10 for LSE 0.16.2 and later.
:::

Plugins go into the server's `mods/` folder, each in its own subfolder with a LeviLamina mod manifest. On startup, LSE links the `plugins/` folder to `mods/`. If you drop a single old-style script file there, LSE places it in its own folder and generates a manifest on the next start; restart the server once more to load it.

## 4. Check that the mods load

1. Start the server: select **Start the server** on **Home**, or run `lip run`.
2. Look for `[LeviLamina]` lines in the output. You should see a `Loading` and a `loaded` line for each mod, such as `Loading LeviOptimize v0.18.0` and `LeviOptimize loaded`, along with a total such as `5 mod(s) loaded` (dependencies count as mods too).
3. Stop the server with `Ctrl+C`.

If a mod is missing from the list, the output explains why. Error codes such as 126 and 127 are explained in [LeviLamina troubleshooting](https://levimc.org/faq/server/levilamina/errors/).

## 5. Update and remove mods

Stop the server first. Then:

| To | Command | In the interface |
| --- | --- | --- |
| Update every mod you installed | `lip update` | **Mods** page: the action row **Update all** |
| Update one mod | `lip update LeviOptimize` | **Mods** page: `Enter` on the mod, **Update** |
| Remove a mod | `lip uninstall LeviOptimize` | **Mods** page: `Enter` on the mod, **Uninstall** |
| See what a command would do | add `--dry-run` | Every change shows its plan first |

`lip` automatically removes dependencies that are no longer needed. `lip update` never changes the game or LeviLamina; to move the server to a new game version, use **Change versions…** on the [Server](https://levimc.org/lip/interface/server.html) page, or run [`lip setup`](https://levimc.org/lip/reference/commands/setup.html).

## What you have now

- A server with LeviOptimize and LegacyScriptEngine—along with their required dependencies—in `mods/`.
- A way to find mods, check that they are compatible, and install, update, and remove them.

## Next steps

- Write a plugin for the engine you just installed: [Your first script plugin](../develop/first-script-plugin.md).
- Let other players join: [Let friends join your server](let-friends-join.md).
- Change a mod's settings: [Mod Config](https://levimc.org/lip/interface/mod_config.html).
- Search, sort, and filter the catalog in `lip`: [Marketplace](https://levimc.org/lip/interface/get_mods.html). Manage installed mods: [Mods](https://levimc.org/lip/interface/mods.html).
- See every way to specify a package (versions, branches, ZIP files, folders): [Managing packages](https://levimc.org/lip/guides/managing_packages.html).
- Learn about the script engines and their languages: [LegacyScriptEngine](https://levimc.org/LegacyScriptEngine/).
- Install mods for the game client rather than the server: [Play with mods on Windows](../play/play-with-mods.md).
