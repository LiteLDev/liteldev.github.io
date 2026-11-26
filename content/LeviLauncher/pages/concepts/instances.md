# Instances & Game Versions

LeviLauncher installs each copy of Minecraft as an **instance**: one game version with its own name, settings, and—if you want—game data. You can keep several instances side by side, whether they use the same game version or different ones, and start whichever you need. The app lists them on the **Instances** page.

## What an instance is

=== "Windows"

    An instance is a folder inside the launcher's `Instances` folder (see [Folders & Files](../reference/files)). The instance takes its name from this folder, which contains:

    - the game files for one Minecraft build, extracted from its installer;
    - `.levilauncher\instance.json`, which stores what the launcher knows about the instance: the game version, the channel, whether it keeps its own game data, and the launch options (console, editor mode, launch arguments, and environment variables);
    - `mods\`, the instance's mods, and `.lip\`, the state of the packages installed with the built-in package manager (see [How Mods Are Loaded](./mod-loading));
    - the instance's own game data (worlds, packs, and settings) when [isolation](./isolation) is turned on.

    Mods always belong to one instance. Game data belongs to one instance only when isolation is on; otherwise, the instance shares the game data that Minecraft normally uses on your PC.

=== "Android"

    An instance is an official Minecraft APK imported into LeviLauncher. It runs inside the launcher without being installed on the system. The Minecraft app from Google Play (1.21.80 or later) must still be installed on the device; LeviLauncher lists it alongside your imported versions.

    Version isolation keeps an imported version's worlds, packs, and settings separate from the installed Google Play version. Imported versions often require isolation to launch.

## Release and Preview

Every Minecraft build belongs to a **channel**:

| Channel | What it is |
| --- | --- |
| Release | The stable game that most players use. |
| Preview | Builds of upcoming versions for testing. They may break worlds, packs, or mods more often. |
| Beta | Test builds published for UWP only. <Badge platform="windows" /> |

On Windows, Release and Preview each have their own game data folder (`Minecraft Bedrock` and `Minecraft Bedrock Preview`), so an unisolated Preview instance does not share worlds with a Release instance.

## GDK and UWP builds <Badge platform="windows" />

Minecraft for Windows has been published in two package formats, and LeviLauncher installs both. When a version is available in both formats, LeviLauncher chooses GDK.

| | GDK | UWP |
| --- | --- | --- |
| Installer | `.msixvc`, downloaded from a mirror that LeviLauncher tests and selects | `.appx` / `.msix` (or a bundle), downloaded from Windows Update |
| To install | A signed-in Microsoft account that owns Minecraft | — |
| To run | Microsoft Gaming Services and Microsoft GameInput | Windows Developer Mode, to register the package with Windows |
| Shared game data | `%APPDATA%\Minecraft Bedrock` (Preview: `Minecraft Bedrock Preview`), with one folder per player profile under `Users\` | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` (Preview: `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`) |
| Isolation | Every version | x64 versions 1.19.70.2 and later |
| LeviLamina | Installed by LeviLauncher on supported versions | Not installed by LeviLauncher |
| Launch arguments and environment variables | Yes | No |

When you import a local installer file (`.msixvc`, `.appx`, `.msix`, `.appxbundle`, or `.msixbundle`), LeviLauncher installs it as GDK or UWP based on its file extension.

### Player profiles {#player-profiles}

A GDK instance stores worlds, screenshots, and the server list per **player profile**: a folder under `Users\` named after the player's ID, which the launcher displays with the player's gamertag when known. Resource and behavior packs are shared across all profiles (`Users\Shared\`); skin packs are shared from game 1.26 onward and stored per profile in earlier versions. UWP instances do not use profiles.

## Registration with Windows <Badge platform="windows" /> {#registration-with-windows}

Windows recognizes one installed Minecraft per channel. **Registering** an instance tells Windows to treat it as that installation, so the Start menu, `minecraft://` links, and Xbox features all use it. Registering an instance replaces whatever currently holds the Release or Preview slot (whether the Microsoft Store game or another instance) while keeping the previous holder's data intact. Registering or unregistering never affects game data.

UWP instances are registered automatically when you launch them. You must unregister a registered instance before you can rename or remove it.

## Related pages

- [Version Management](../guide/version-management)
- [Instance Isolation](./isolation)
- [Folders & Files](../reference/files)
