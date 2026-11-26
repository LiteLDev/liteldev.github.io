# Mod Lifecycle

This page explains how LeviLamina finds mods on a server or client, the order in which it loads them, and when it calls a mod's `load`, `enable`, `disable`, and `unload` functions. The classes and fields named here are listed on the [Mod](../api_reference/mod.md) page.

## The Four Steps

A mod goes through four steps. Each step calls one of the mod's callbacks; if a callback returns `false`, the step stops and LeviLamina logs the reason.

| Step | When it happens | Callback | After it |
|------|-----------------|----------|----------|
| **Load** | At startup, for every mod that should run; at runtime with `/ll load` | `load()` | The mod is loaded and disabled |
| **Enable** | When the game has started; right after loading if the game is already running | `enable()` | The mod is enabled |
| **Disable** | When the game stops; at runtime with `/ll disable` | `disable()` | The mod is disabled, still loaded |
| **Unload** | Only at runtime, with `/ll unload` or `/ll reload` | `unload()` | The mod is gone; its DLL is freed |

A mod is either `Enabled` or `Disabled` (`Mod::State`). A newly loaded mod remains disabled until it is enabled. When the game stops, mods are disabled rather than unloaded.

With `LL_REGISTER_MOD(Class, instance)` (see [Registering the Mod Entry](../api_reference/mod.md#registering-the-mod-entry)), `load()` is required, while `enable()`, `disable()`, and `unload()` are used if the class defines them. A native mod without an `unload()` function cannot be unloaded at runtime; LeviLamina refuses with "The mod does not register an unload function".

## Finding the Mods

At startup, LeviLamina checks every folder in the mods root: `plugins/` on the server and `mods/` on the client (see [Directory Structure](../api_reference/mod.md#directory-structure)).

- Any folder with a missing or empty `manifest.json` is skipped.
- The manifest's `name` must match its folder name; otherwise, the mod is not loaded ("Mod name … do not match folder …").
- Manifests of type `preload-native` are skipped. PreLoader loads these before the game starts, and they are not LeviLamina mods (see [Mod Types](../api_reference/mod.md#mod-types)).

## Choosing and Ordering

Using the manifests, LeviLamina builds a loading plan before loading anything:

1. **Which mods.** It starts with every mod that is not `passive` and adds what they need: their `dependencies`, along with any `optionalDependencies` that are installed with a matching version. A `passive` mod is loaded only if another loaded mod depends on it.
2. **Which of them cannot run.** A mod is excluded if a dependency is missing or outside the required version range; if its `platform` does not match the current one (`server` or `client`; `universal` or no `platform` runs on both); if its `conflicts` list includes another planned mod with a matching version; if one of its dependencies is excluded; or if it is part of a dependency cycle. LeviLamina logs the reason, such as "… will not be loaded because it conflicts with …".
3. **In which order.** Dependencies and optional dependencies are loaded before the mods that require them, and a mod with `loadBefore` is loaded before the mods it names. Mods with no ordering constraints between them are loaded alphabetically by name.

LeviLamina then loads the mods one by one in that order. If a mod's dependency fails to load, that mod is skipped as well.

## Load

On the server, LeviLamina loads mods when the game's `main` function starts, before the game itself runs. On the client, it loads them when PreLoader loads LeviLamina into the game. At this stage, the game, its world, and its players do not exist yet.

A mod's `type` determines what loads it. LeviLamina loads `native` mods directly, while other types are loaded by the mod manager registered for them (such as a script engine). For a native mod, LeviLamina:

1. adds the mod's folder to `PATH` so Windows can find any DLLs shipped alongside the mod's own DLL;
2. loads the DLL specified by the manifest's `entry`. If Windows cannot load it because an imported DLL or function is missing, LeviLamina logs the missing items;
3. checks that the DLL uses LeviLamina's memory allocation operators (`ll/api/memory/MemoryOperators.h`), refusing to load it if it does not;
4. calls the mod's `load()`.

The DLL's static objects are constructed while the DLL loads, before `load()` is called. This is when hooks declared with an `LL_AUTO_` macro are installed (see [Events and Hooks](events_and_hooks.md)).

## Enable

Mods are enabled once the server thread starts on the server, or once the game finishes initializing on the client. They are enabled in the order they were loaded, and LeviLamina logs "Enabling … v…" for each one. A mod is enabled only if all of its `dependencies` are enabled.

In `enable()`, a mod begins interacting with the game by registering its listeners, commands, and so on. A mod loaded while the game is already running (with `/ll load`) is enabled immediately after its `load()` function finishes.

## Disable and Unload

When the server stops or the client window closes, LeviLamina disables mods in the reverse of the order they were loaded, so each mod is disabled before the mods it depends on.

A mod can also be disabled or unloaded while the game is running. When that happens, LeviLamina cleans up after it:

- **Disabled** while the game is running: the mod's event listeners are removed and its commands are disabled.
- **Unloaded**: the mod is disabled first; then its `unload()` runs, its listeners and the events it provided are removed from the event bus, and its DLL is freed.

A mod cannot be disabled or unloaded while a mod that depends on it is still enabled or loaded; LeviLamina responds with "… still depends on …". `loadBefore` does not create such a dependency (see [Dependency Semantics](../api_reference/mod.md#dependency-semantics)).

## Managing Mods at Runtime

LeviLamina's `/ll` command runs these actions on a mod while the game is running:

| Command | What it does |
|---------|--------------|
| `/ll load <mod> [cascade]` | Loads and enables an unloaded mod from the mods root |
| `/ll unload <mod> [cascade]` | Disables and unloads a mod |
| `/ll reload <mod> [cascade]` | Unloads a mod and loads it again |
| `/ll reactivate <mod> [cascade]` | Disables a mod and enables it again |
| `/ll enable <mod> [cascade]` | Enables a disabled mod |
| `/ll disable <mod> [cascade]` | Disables a mod |
| `/ll show <mod> [cascade]` | Shows a mod's manifest: name, author, description, type, version, entry, and extra info |
| `/ll list` | Lists the loaded mods |

`/ll load` requires the mod's dependencies to be loaded already. With `cascade`, the command also applies to linked mods: `load` also loads mods in the mods root that depend on the target mod; `unload`, `reload`, and `disable` also act on the mods that depend on it; `enable` enables its dependencies first; and `show` prints its dependencies and dependents as trees.

On the server, the command is `/levilamina` (`/ll` for short) and requires the `Admin` permission level by default. On the client, it is `/clilevilamina` (`/clill` for short) and anyone may use it. You can configure it in LeviLamina's own configuration file, `LeviLamina/config/Config.json` in the mods root, under `modules.command.modManageCommand` (`enabled`, and `permission`, which is used on the server).

## Related

- [Mod](../api_reference/mod.md) — `Mod`, `Manifest`, `LL_REGISTER_MOD`, and the mod's folders
- [Events and Hooks](events_and_hooks.md) — what happens to listeners and hooks when a mod is enabled, disabled, or unloaded
- [Your first LeviLamina mod](https://levimc.org/tutorials/develop/first-levilamina-mod/) — building a mod from the template, step by step
