# LeviLauncher on Windows: features and settings

## A new LeviLauncher version has been released on GitHub. Why does "Check for updates" in the launcher not find it?

Versions marked as Pre-release on GitHub (such as `1.1.0-beta.x`) are delivered only if you turn on "Receive beta updates" under "Settings → Software update" in the launcher. Stable releases (the latest is currently v1.1.0) are delivered by default. You can also download any release manually from <https://github.com/LiteLDev/LeviLauncher/releases>.

*Applies to: LeviLauncher 1.x (Windows)*

## LeviLauncher shows no progress when downloading a game version and nothing happens for a long time. Is it stuck?

Download progress is shown under the cloud-shaped download icon in the top right of the "Download" page; click it to open the "Download manager" page, where you can view and manage active downloads. While a download is running, the icon is highlighted and shows a red dot. If no error appears, the download is usually still running, just slowly. If it is too slow or fails repeatedly, run a speed test and switch the mirror source when downloading, or enable "Use mirror source" in the settings. You can also try again later or import a local installation package instead.

*Applies to: LeviLauncher 1.x (Windows)*

## If I click "Delete instance / Delete version" in LeviLauncher on a version without version isolation, will it delete all game data such as worlds?

No. Deleting an instance removes only that instance's folder in the launcher's instance directory (`%LOCALAPPDATA%\LeviLauncher\Instances\<instance name>` by default in 1.1.0, or under your custom data directory if you set one; older versions use the `versions` directory). For a UWP instance, the package is unregistered first, and deletion is blocked while the game is running. Deleting an instance does not remove the default game data shared by non-isolated versions (worlds, resource packs, and so on). Note: if version isolation is enabled for an instance, its data is stored in the instance's own workspace and is deleted along with the instance, so back up important worlds first.

*Applies to: all current versions (since LeviLauncher 1.1.0, the instance directory is `%LOCALAPPDATA%\LeviLauncher\Instances`)*

## How do I delete a downloaded version installation package in LeviLauncher? I cannot find the delete button.

On the "Download" page, a downloaded version shows an "Install" button group on the right. Click the drop-down arrow next to it, choose "Delete installation package", and confirm. You do not need to open the directory and delete the file manually.

*Applies to: all current versions (verified on LeviLauncher 1.1.0)*

## Do I need a licensed Minecraft Bedrock Edition to use LeviLauncher? Can I use it offline or without buying the game?

You must own a licensed copy. LeviLauncher supports only licensed Minecraft Bedrock Edition, cannot bypass license verification, and has no Java-style "offline mode".

- Windows: when downloading or installing the game, the launcher must obtain the game license from Microsoft using a Microsoft account. Sign in through the launcher (click the avatar, or run `LeviLauncher.exe account login` from the command line) and select the account that purchased the game. If that account has not purchased the game, you will get `ERR_LICENSE_NOT_ENTITLED`; if it has only a trial license, you will get `ERR_LICENSE_FULL_REQUIRED` and the full version cannot be installed. Without a valid license, the game runs in trial mode. Xbox sign-in is still handled inside the game.
- Android: you must buy and install the licensed Bedrock Edition from Google Play.

The project enforces license verification. Launchers from unofficial channels and installation packages from unknown sources are not supported, and the official community does not assist with piracy-related issues. Official downloads: <https://github.com/LiteLDev/LeviLauncher/releases> or the documentation site <https://levimc.org/LeviLauncher/>.

*Applies to: all current versions (Windows v1.1.0, Android v1.7.1)*

## Can LeviLauncher start BDS (Bedrock Dedicated Server)?

No. LeviLauncher is a client launcher. It only installs, manages, and starts the Minecraft Bedrock Edition client (the GDK and UWP versions on Windows, and the Android version) and loads client mods; it cannot run a server. To run a BDS server, use the LeviLamina server setup (for example, install LeviLamina with lip, or use the docker-levilamina-server image).

## How do I import `.mcpack` / `.mcaddon` / `.mcworld` resource packs, texture packs, skin packs or maps in LeviLauncher for Windows?

- Method 1: On the "Launch" page, open "Content management" (or the matching resource pack, behavior pack, skin pack, or world page) and drag the `.mcpack` / `.mcaddon` / `.mcworld` file into the window to import it (the interface prompts "Drag in .mcworld/.mcpack/.mcaddon to import"). You will be asked to choose the target instance, and for worlds and per-player skin packs, you will also choose the player.
- Method 2: On the content page, click the "Import" button in the top right and select the file.
- Method 3: From the command line, run `LeviLauncher.exe pack import "D:\Downloads\xxx.mcpack"` (use `world import` for worlds); add `-i <instance>` to specify the instance.

A pack's `manifest.json` determines its type (resource, behavior, or skin). Common formats from mobile devices, such as `.mcpack`, work as well, provided the pack is compatible with the game version. You can also click "Open directory" on the content page and place the files into the matching folder manually. Note: Mods (`.mcmod` / `.dll`) must be imported under the instance's "Manage mods" page, not dragged into the resource area.

*Applies to: LeviLauncher (Windows), current version*

## Can a Minecraft instance installed by LeviLauncher be registered with the system so it appears in the Start menu and launches directly, or can I create a shortcut?

Yes.

1. Register with the system: On the launch page, click "Register with system" (or run `LeviLauncher.exe instance register <instance>` from the command line). Windows then treats the instance as the installed Minecraft for that channel (release or preview), and the Start menu, `minecraft://` links, and Xbox features will use it. After asking for confirmation, this replaces the Store version or whichever instance currently occupies that channel (existing data is kept). Registering a GDK or UWP instance requires Windows Developer Mode to be enabled; UWP instances are registered automatically at launch. Use `instance unregister` to remove the registration.
2. Desktop shortcut: Choose "Create desktop shortcut" from the menu next to the "Launch" button (or run `instance shortcut <instance>`). This creates `Minecraft - <instance name>.lnk`; double-clicking it launches that instance through the launcher.

*Applies to: LeviLauncher (Windows), current version (v1.x)*

## When importing a map in LeviLauncher it asks me to choose a player, and the list shows old names. Where do these players come from?

The list shows the player profiles that have signed in to this GDK instance on this device—specifically, the player directories under the instance's `Users` folder. The names shown are Gamertags cached by the launcher (which is why they may be old names), not players who played online in the world. The world is imported under the selected player's profile.

*Applies to: LeviLauncher (Windows) GDK instances; UWP instances have no player profiles*

## How do I update the new LeviLauncher (v1, desktop) to a beta version or use automatic updates?

Turn on "Receive beta updates" in the launcher settings. From then on, the launcher checks for updates at startup, prompts you when it finds a new beta, and—once you confirm—updates in place without uninstalling the old version.

*Applies to: LeviLauncher (Windows) v1.0.x and later*

## Importing some `.mcpack` / `.mcaddon` resource or behavior packs into LeviLauncher fails (other packs work). What is the cause?

1. Wrong extension: a single resource, behavior, or skin pack should use `.mcpack`. `.mcaddon` bundles multiple packs; when importing a `.mcaddon`, the launcher looks only for `.mcpack` files inside it or `manifest.json` files in subfolders. If an archive containing a single pack with `manifest.json` at the root has a `.mcaddon` extension, the import fails; rename it to `.mcpack`.
2. Invalid JSON in `manifest.json` (a syntax error): the launcher cannot parse the file and the import fails. The launcher now supports JSON comments (which MC allows) and no longer ignores pure Script API behavior packs when importing a `.mcaddon` (it imports the script module into the behavior pack directory).
3. Duplicate UUID: you must choose to overwrite the existing pack; for skin packs, you must select the player first.

*Applies to: LeviLauncher (Windows), current version*

## LeviLauncher fails to start, and `startup.log` or the debug output shows `config.Load failed: ERR_CONFIG_CORRUPTED: invalid character ... looking for beginning of value` (corrupted config file). What do I do?

The launcher's settings file, `config.json`, is corrupted (invalid JSON). Close the launcher and delete `%APPDATA%\LeviLauncher\config.json` (or `%APPDATA%\levilauncher.exe\config.json` in versions before v1.1.0); the launcher will generate a default configuration the next time it starts. To view the debug output, append ` /debug` to the shortcut's "Target" field (or run `LeviLauncher.exe --debug` from the command line); the startup log is at `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`. Deleting the file resets all launcher settings to their defaults. If you previously changed the data directory (`base_root`), set it again in the settings; otherwise, the instances stored there will not appear.

*Applies to: LeviLauncher current version (Windows); paths are the new layout used since v1.1.0*

## Where is the game data (`com.mojang`, worlds, resources, etc.) of the Windows GDK edition of Bedrock Edition stored?

Without instance isolation, the GDK data root is `%APPDATA%\Minecraft Bedrock` (`%APPDATA%\Minecraft Bedrock Preview` for the Preview). Shared content, such as resource packs, is stored in `Users\Shared\games\com.mojang`, and each account's worlds are in `Users\<account ID>\games\com.mojang\minecraftWorlds`. If "Instance isolation" is enabled for an instance in LeviLauncher, its data is stored in the `Minecraft Bedrock` folder inside the instance directory (`<instance directory>\Minecraft Bedrock\Users\...`).

*Applies to: Windows GDK edition of Bedrock Edition; LeviLauncher v1.1.0*

## I can't find the "Microsoft GDK" option from the tutorial video in the settings of the new LeviLauncher. Is something missing?

Nothing is missing. Older versions used that option to register the game, and newer versions no longer need it as long as the game starts normally. In the current version, if you want an instance to appear in the system app list, you can optionally use "Register to system" in the menu next to the launch button on the launch page.

*Applies to: LeviLauncher 0.3.11 and later*

## Does installing a game version with LeviLauncher overwrite or affect my existing worlds?

No, it doesn't overwrite them. If you don't select "Instance isolation" when installing an instance, that instance shares its game data (worlds, settings, and so on) with the Minecraft already on your system. If you select it, the data is stored separately in the instance directory, and you can choose to inherit a copy of the shared data. The launcher itself doesn't modify your worlds. If you want to uninstall the original game, back up the worlds under `%APPDATA%\Minecraft Bedrock\Users` first, then delete the game.

*Applies to: LeviLauncher v1.1.0 (GDK edition of the game)*

## A console window pops up every time I start the game with LeviLauncher (PC). Can I get rid of it?

Yes. Open "Instance settings" for that instance and turn off "Enable console" under the launch options; the console window will no longer appear when you start that instance. This option is stored per instance, so you have to set it for each instance separately.

*Applies to: LeviLauncher v1.1.0*

## The LeviLauncher documentation site no longer opens. What is the new address?

All project documentation has moved to levimc.org, with the language at the start of the path. The LeviLauncher docs are at <https://levimc.org/zh-Hans/LeviLauncher/> for Simplified Chinese, <https://levimc.org/zh-Hant/LeviLauncher/> for Traditional Chinese, and <https://levimc.org/LeviLauncher/> for English. The LeviLamina docs are at <https://levimc.org/LeviLamina/>. Old docs.levimc.org addresses (such as `/LeviLauncher/zh-HK/` and `/LeviLauncher/zh-CN/`) redirect to the new addresses automatically.

*Applies to: current version (since 2026-11)*
