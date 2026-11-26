# Instance Isolation

Minecraft keeps its worlds, packs, and settings in one game data folder per device. **Instance isolation** (in the app: **Enable Isolation** in **Instance Settings**, and **Instance isolation** when you install a version) gives an instance its own game data folder inside the instance instead. The command line calls the two modes *own data* and *shared data*.

## Shared data and own data

=== "Windows"

    An instance **without isolation** uses the standard Minecraft game data on this PC: the same worlds, packs, and settings as the Microsoft Store game and every other unisolated instance of the same kind.

    An instance **with isolation** keeps its game data in its own folder. Its worlds, resource packs, behavior packs, skin packs, screenshots, server list, and game settings are separate from every other instance and from the Microsoft Store game.

    | Instance | Shared data (isolation off) | Own data (isolation on) |
    | --- | --- | --- |
    | GDK, Release | `%APPDATA%\Minecraft Bedrock` | `<instance>\Minecraft Bedrock` |
    | GDK, Preview | `%APPDATA%\Minecraft Bedrock Preview` | `<instance>\Minecraft Bedrock Preview` |
    | UWP, Release | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<instance>\Minecraft Bedrock` |
    | UWP, Preview | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe\LocalState` | `<instance>\Minecraft Bedrock Preview` |
    | UWP, Beta | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<instance>\Minecraft Bedrock Beta` |

    `<instance>` is the instance's folder in `Instances` (see [Folders & Files](../reference/files)). Inside a GDK data folder, the game keeps each player's data under `Users\` (see [player profiles](./instances#player-profiles)); inside a UWP data folder, under `games\com.mojang\`.

=== "Android"

    Version isolation keeps a version's game data (worlds, packs, and settings) separate from other versions and from the Google Play installation of Minecraft. Changing this setting for one instance does not affect other instances. Imported versions often need isolation to launch.

## How it works <Badge platform="windows" />

The game itself does not know about instances. When LeviLauncher installs an instance, it places its loader, `LeviLauncher.dll`, next to the game's executable (see [How Mods Are Loaded](./mod-loading)). When the game starts with isolation on, the loader redirects the folders where the game looks for its data (the application data folders and the temporary folder) to the instance's data folder. Nothing is copied or linked: the game simply reads and writes there.

What isolation does not change:

- **Mods** are always per instance, in the instance's `mods\` folder, with or without isolation.
- **The Microsoft account** and the launcher's own settings are the same across all instances.
- **Registration** with Windows (see [Instances & Game Versions](./instances#registration-with-windows)) is separate from isolation.

## Limits <Badge platform="windows" />

- GDK instances support isolation on every version; UWP instances support it from version 1.19.70.2 onward, on x64 only.
- Turning isolation on does not copy anything: the instance starts with empty game data. To start from existing data, choose to copy data when you install the version (from the game installed on this PC or from another isolated instance of the same type), or copy it later with `LeviLauncher.exe instance copy-data` (GDK).
- Turning isolation off makes the instance use the shared data again, while its own data folder stays in the instance folder.
- Removing an instance deletes its folder, **including the worlds of its own data**. Back up important worlds first (see [World Tools](../guide/world-tools)).
- You can copy content from one instance to another only when the target instance uses its own data, or when it is a UWP instance that does not share the same data folder.

## When to use it

Isolation is useful when you want:

- different content sets for different versions
- safer testing for mods or Minecraft Preview builds
- less risk of one setup affecting another

A setup that works well: one isolated Release instance for normal play, one isolated Preview instance only when needed, and one temporary test instance for mods or troubleshooting.

## Related pages

- [Version Management](../guide/version-management)
- [Content Management](../guide/content-management)
- [Instances & Game Versions](./instances)
