# Mods & Integrations

LeviLauncher supports mod workflows that go beyond a basic launcher.

## Available capabilities

=== "Windows"

    - import mod packages (`.mcmod`)
    - import `.zip` packages and bare `.dll` mods by choosing **All files (\*.\*)** in the file picker
    - enable or disable installed mods
    - remove mods you no longer need
    - browse and fetch content through CurseForge
    - install LIP packages with the built-in package manager, compatible with [lip](https://github.com/LiteLDev/lip)
    - work with LeviLamina mod setups

    ::: warning Advanced area
    Mod, loader, and package compatibility can change quickly, especially on Minecraft Preview builds. Treat this area as advanced and test carefully.
    :::

=== "Android"

    - load native mods (`.so` libraries) into the game
    - keep modded setups in isolated versions

    Building native mods? See [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in the LeviLamina documentation.

## Recommended mod workflow

1. Start from a clean, isolated version.
2. Confirm that the version launches without mods.
3. Add one mod or one small group at a time.
4. Test the launch after each change.
5. Keep backups of important worlds.

## CurseForge <Badge platform="windows" />

The launcher lets you browse and install CurseForge packages so you can find compatible mods directly in the app.

Use it when you want:

- a more guided discovery workflow
- a clearer view of compatible files for a project
- less manual searching outside the launcher

## lip and LeviLamina <Badge platform="windows" />

LeviLauncher includes a built-in package manager compatible with [lip](https://github.com/LiteLDev/lip), so you do not need to install lip or the .NET runtime separately. Following lip, each version records its packages in `.lip/state.json`, and packages are read from their `lip.toml` (older packages that have only a `tooth.json` still work). Versions that already have LeviLamina or LIP packages installed by an older launcher (`tooth_lock.json`) are migrated automatically on the first package operation. When **Use mirror sources** is on, package downloads from GitHub go through the **GitHub proxy** set in [Settings](./settings-personalization); otherwise they connect to GitHub directly, using your system proxy if one is set. A previously saved GitHub proxy, or a `github_proxy` set in lip's `config.toml` (in `%APPDATA%\lip`, for example with `lip config set github_proxy <URL>`), applies either way. **Clean Cache** removes downloaded package files.

Since lip v0.40, each entry in `lip.toml` and `.lip/state.json` specifies where it runs with `side` (`server` or `client`) and `platform` (a .NET runtime identifier such as `win-x64`); lip v0.39 and earlier called these keys `platform` and `runtime`. A `.lip/state.json` written with the old keys—by lip v0.39 or earlier, or by an older launcher—is converted automatically before the next package operation: `platform` is renamed to `side` and `runtime` to `platform`. If lip still cannot read the file, it rejects it with a message explaining the change: rename `platform` to `side` and `runtime` to `platform`, or reinstall the packages for that version.

These integrations are aimed at advanced users who want package-driven or loader-driven mod setups.

Best practices:

- start with stable Minecraft Release versions
- avoid changing too many moving parts at once
- note the exact version that worked in testing

To add LeviLamina to a client version, see [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/) in the LeviLamina documentation.

### LeviMC Mods page

The **LeviMC Mods** page lists mods from [levimc.org/mods](https://levimc.org/mods/) that have a Windows x64 client build (an entry with `side = "client"` and `platform = "win-x64"`). You can search them by name, id, author, tag, or description; sort them by relevance, stars, last update, or newest; and filter them by game version, LeviLamina version, tags (featured tags such as Library / API or Economy appear first, and tags can also be excluded), license (a family such as Permissive, or an SPDX id), dependencies, and author (**More by …** on a mod's page). Installing a mod selects its `client` variant, or else its default variant, or else the first other variant with a client build; on a mod's page, you can also pick any of these variants manually. The **Install with LeviLauncher** button on a mod's page on levimc.org is a `levilauncher://install/<mod id>?version=<version>` link, which prompts LeviLauncher to install that version of the mod.

## Native mods <Badge platform="android" />

Native mods run native code in the game process. Install mods only from sources you trust, and test them in an isolated version first.

To make your own, follow [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in the LeviLamina documentation.

## If something breaks after adding mods

- Disable the newest mod first.
- Compare against the last known good version.
- Move important worlds to a safe place before testing further.
- Continue with [Update & Troubleshooting](./update-troubleshooting).
