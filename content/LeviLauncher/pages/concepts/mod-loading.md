# How Mods Are Loaded

Minecraft Bedrock has no built-in mod support: a mod is native code that a loader injects into the game process at startup. This page explains which loaders LeviLauncher uses, where mods live, and how the different ways of adding a mod fit together.

## Where mods live <Badge platform="windows" />

Every instance has a `mods\` folder (see [Folders & Files](../reference/files)). Each mod sits in its own folder inside it, with a `manifest.json` that describes the mod:

| Field | Meaning |
| --- | --- |
| `name` | The mod's name. |
| `entry` | The file the loader loads, relative to the mod's folder (a `.dll`). |
| `version` | The mod's version. |
| `type` | Which loader loads it: `preload-native` for LeviLauncher's native loader; LeviLamina mods have their own types. |
| `author` | Who made it (optional). |

Mods belong to one instance. They are unaffected by [isolation](./isolation), which applies only to game data.

**Turning a mod off** (in **Manage Mods** or with `LeviLauncher.exe mod disable`) renames its `manifest.json` to `manifest.json.close`; turning it back on restores the original name. The mod's files stay in place, and any loader that looks for `manifest.json` simply skips it.

## The two loaders <Badge platform="windows" />

### LeviLauncher's native loader

When LeviLauncher installs or prepares an instance, it places its loader, `LeviLauncher.dll`, next to the game executable and adds it to the executable's import table so Windows loads it alongside the game. This works for both GDK and UWP x64 builds, and it is also what powers [isolation](./isolation).

When the game starts, the native loader scans the folders in `mods\` in alphabetical order and loads the `entry` of each mod whose `type` is `preload-native`. It skips folders without a `manifest.json` and mods of other types. If the instance has another preloader (a `preloader.dll` next to the game), the native loader leaves all mod loading to it. The native loader requires the Visual C++ runtime (x64), which LeviLauncher checks for and offers to install.

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/) is LeviMC's mod loader. Most mods on [LeviMC Mods](https://levimc.org/mods/) are built for LeviLamina and require a LeviLamina version that supports the instance's game version. On GDK instances of supported game versions, LeviLauncher installs LeviLamina through its built-in package manager (use the **Install LeviLamina** switch when installing a version, or the **Loader** tab in **Instance Settings**).

## Three ways to add a mod <Badge platform="windows" />

| You add | What LeviLauncher does |
| --- | --- |
| A mod from **LeviMC Mods** (or `mod install owner/repo`) | Installs it as a package using the built-in, [lip](https://github.com/LiteLDev/lip)-compatible package manager: it downloads the release for this platform, installs any required dependencies, and records the package in the instance's `.lip\state.json`. If the mod requires LeviLamina and none is installed (or the installed version is incompatible), LeviLauncher installs a compatible LeviLamina first. You can update and remove these mods as packages. |
| A `.mcmod` package (or a `.zip`) | Extracts it into a new folder in `mods\`. The archive must contain a `manifest.json`. |
| A single `.dll` | Places it into a new folder in `mods\` and generates a `manifest.json` for it, defaulting to the file's name as the name, `preload-native` as the type, and `0.0.0` as the version. |

A package records its target environment using `side` (`client` or `server`) and `platform` (such as `win-x64`) in both `lip.toml` and `.lip\state.json`. For the client, LeviLauncher installs a mod's `client` variant if one exists, or falls back to its default variant. See [Mods & Integrations](../guide/mods-integrations) for details, including how older packages are migrated.

## Android <Badge platform="android" />

The Android version loads native mods—`.so` libraries that run inside the game process. Keep modded setups in isolated versions, and only install mods from sources you trust. To build one, see [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) in the LeviLamina documentation.

## Related pages

- [Mods & Integrations](../guide/mods-integrations)
- [Instances & Game Versions](./instances)
- [Command Line](../reference/command-line)
