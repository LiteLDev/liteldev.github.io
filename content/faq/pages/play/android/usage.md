# LeviLauncher on Android: features and settings

## Does LeviLauncher on Android depend on the Minecraft installed on the phone? What are the requirements for the game?

Yes. The device must have the official Minecraft Bedrock Edition (1.21.80 or later) installed from Google Play. The launcher checks that the installation source is Google Play; repackaged or cracked MC, or MC installed from other sources, cannot be launched through it. On top of that, the launcher can import official Minecraft APKs and run other game versions internally without installing each one into the system (imported versions usually require version isolation to be enabled), though the Google Play version must still remain on the device. Project page: <https://github.com/LiteLDev/LeviLauncher-Android>.

*Applies to: all current LeviLauncher-Android versions (latest v1.7.1)*

## After opening LeviLauncher on Android, my worlds and mods from MC are gone. How do I import worlds, addons, resource packs and `.so` mods into the launcher?

LeviLauncher on Android uses its own data directory, isolated from the data of the standalone Google Play version of Minecraft, so the launcher does not show your original worlds. To import content, package a world or change its extension to `.mcworld`, use `.mcaddon` for an addon, and use `.mcpack` for a resource pack or skin pack, then select LeviLauncher in "Open with". You can also import, export, and back up worlds and resource packs in the launcher's content management. Similarly, you can import `.so` native mods (and `.levipack` mod packages) by choosing LeviLauncher in "Open with" or by adding them on the "Mods" page. If version isolation is enabled, each version also keeps its own data, so make sure you select the right version when importing.

*Applies to: all current LeviLauncher-Android versions (latest v1.7.1)*

## How do I export structures in LeviLauncher on Android? Why can't I find my old structures?

In the launcher's world list, open the world's action menu and tap "Extract structures". The launcher can only find structures that are already saved in the world. First, enter the world through this launcher, place a structure block and set it to save mode, name the structure and tap save, then leave the world, return to the launcher, and tap "Extract structures". You can then export the structures one by one or as a ZIP. Structures that were not saved to the world with a structure block cannot be found.

*Applies to: Android LeviLauncher current version*

## Importing resource packs/mods in LeviLauncher on Android is very slow. What can I do?

Larger packs take longer to import. First, update to the latest version (v1.6.1 improved pack import speed). If it is still too slow, you can extract the pack manually into the launcher's data directory:

- Without version isolation: `/storage/emulated/0/Android/media/org.levimc.launcher/minecraft/_shared/external/games/com.mojang/resource_packs/`;
- With version isolation enabled: `/storage/emulated/0/Android/media/org.levimc.launcher/minecraft/<instance directory>/external/games/com.mojang/resource_packs/`.

Then launch the game directly. In most cases, importing through the launcher is enough (the resulting folder name is random).

*Applies to: LeviLauncher-Android current version (when using the new shared storage layout)*

## I installed a Minecraft package of over 300 MB in LeviLauncher on Android, but it takes over 700 MB. Why?

For an imported package, the launcher keeps a copy in that version's directory (`base.apk.levi`, and `*.apk.levi` for split packages) and must also extract the native libraries before running. As a result, it uses about twice the package size. This is normal.

*Applies to: versions imported or downloaded in LeviLauncher on Android*
