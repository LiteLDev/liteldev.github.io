# LeviLauncher

A Minecraft Bedrock launcher for Windows and Android: install, manage, isolate, mod, and launch Minecraft Bedrock Edition on your Windows PC or Android device.

**Install:** The [Install](./install) page covers system requirements for each version, where to download the launcher, how to update it, and how to try a beta.

::: info Windows and Android
LeviLauncher comes in a **Windows version** for Minecraft Bedrock Edition (GDK / UWP) and an **Android version** for the official Google Play release of Minecraft. Both require a legitimate licensed copy of the game. There is no iOS version, and none is planned.
:::

::: tip Start here
New to LeviLauncher? The [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) tutorial walks you through downloading LeviLauncher and launching your first modded game.
:::

## What LeviLauncher does

- **Version-first workflow.** Install, rename, launch, and remove Minecraft Release or Preview builds while keeping each setup separate. Each installed copy is an *instance*: see [Version Management](./guide/version-management) and [Instances & Game Versions](./concepts/instances).
- **Clean isolation.** Separate worlds, packs, and game files from your default AppData installation for a safer workspace: see [Instance Isolation](./concepts/isolation).
- **Content toolkit.** Manage worlds, resource packs, behavior packs, skin packs, screenshots, and server lists from one place: see [Content Management](./guide/content-management).
- **Mod-ready.** Import `.mcmod` mod packages, browse CurseForge, and install LeviLamina and LIP packages with the built-in package manager for advanced setups: see [Mods & Integrations](./guide/mods-integrations) and [How Mods Are Loaded](./concepts/mod-loading).
- **World utilities.** Export backups, inspect world data, and edit selected `level.dat` fields without leaving the launcher: see [World Tools](./guide/world-tools).
- **User-focused settings.** Configure language, appearance, download behavior, privacy choices, update channels, and package management: see [Settings & Personalization](./guide/settings-personalization) and [All Settings](./reference/settings).
- **Android extras.** Use Xbox account switching and Quick Launch URI actions directly in the launcher: see [Accounts & Quick Launch](./guide/accounts-quick-launch).

## A short example

On Windows, you can run every launcher action from a terminal. These three commands install the latest Minecraft Release build as a new default instance with LeviLamina, add a mod from [LeviMC Mods](https://levimc.org/mods/), and start the game:

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe play
```

Installing a GDK build requires a signed-in Microsoft account that owns Minecraft (`LeviLauncher.exe account login`). In the launcher window, you can perform these same steps using the **Download** page, the **LeviMC Mods** page, and the **Launch** button. The [Command Line](./reference/command-line) reference lists every available command.

## On this site

This documentation is written for **players and end users**, not maintainers.

- **Guides**: One task per page. Download the app on the [Install](./install) page, then learn how to manage [versions](./guide/version-management), [downloads and mirrors](./guide/downloads-mirrors), [content](./guide/content-management), [accounts and Quick Launch](./guide/accounts-quick-launch) (Android), [mods](./guide/mods-integrations), [worlds](./guide/world-tools), and [settings](./guide/settings-personalization). The Help section covers [updates and troubleshooting](./guide/update-troubleshooting) and [community and feedback](./guide/faq-community-feedback).
- **Concepts**: How LeviLauncher works, including [instances and game versions](./concepts/instances) (Release and Preview, GDK and UWP, Windows and Android), [instance isolation](./concepts/isolation), and [how mods are loaded](./concepts/mod-loading).
- **Reference**: Details on the [command line](./reference/command-line), [all settings](./reference/settings), the [folders and files](./reference/files) LeviLauncher uses, Android [Quick Launch URIs](./reference/quick-launch-uri), and the Android [privacy policy](./privacy-policy).

If you are new to LeviLauncher, start with the [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/) tutorial, followed by [Version Management](./guide/version-management) and [Content Management](./guide/content-management).

## Community and feedback

- **Official Discord:** [discord.gg/v5R5P4vRZk](https://discord.gg/v5R5P4vRZk)
- **Personal Discord:** [discord.gg/VqQaC8vWz8](https://discord.gg/VqQaC8vWz8)
- **QQ Group:** [458083875](https://qm.qq.com/q/1z791rJgJG)
- **Issue tracker:** [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)
