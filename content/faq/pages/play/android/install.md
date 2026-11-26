# Installing LeviLauncher on Android

## Does LeviLauncher have an Android version? The website only shows an exe; where do I download the Android APK? Where do I report problems?

Yes. The exe on the website and in the docs is the Windows version (repository `LiteLDev/LeviLauncher`). The Android version lives in a separate repository, `LiteLDev/LeviLauncher-Android` (formerly LeviLaunchroid; old links redirect automatically). Download the APK from GitHub Releases: <https://github.com/LiteLDev/LeviLauncher-Android/releases/latest>. Both versions share the same documentation at <https://levimc.org/LeviLauncher/?platform=android> (select the Android tab on the download page). Report Android issues at <https://github.com/LiteLDev/LeviLauncher-Android/issues> and include your Android version, device model, and launch log. System requirements: an ARM64 device running Android 9.0+ with a licensed copy of Minecraft Bedrock Edition 1.21.80 or later installed from Google Play.

*Applies to: LeviLauncher-Android all current versions (latest v1.7.1)*

## How do I import a .so mod in LeviLauncher Android?

There are two ways:

1. Locate the `.so` file (or a `.levipack` / `.mcmod` mod pack) in a file manager, choose "Open with", and select LeviLauncher to import it.
2. On the launcher's "Mods" page, tap "Add mod" and choose the file using the file picker (or place the file in your phone's `Download` folder, tap "Scan", and add it from there).

The file must be a native mod compiled for Android (`arm64-v8a`); you cannot simply rename a Windows `.dll` to `.so`.

*Applies to: LeviLauncher-Android all current versions (latest v1.7.1)*

## On Android, a LeviLauncher or MC package downloaded from an unofficial source (cloud drive / QQ group / forum / version library) gives a black screen, crashes on launch (for example producing `tombstone_xxx_org.levimc.launcher...xcrash`), or fails to import. What should I do?

1. Download the launcher only from the official GitHub Releases page: <https://github.com/LiteLDev/LeviLauncher-Android/releases/latest> (grab `LeviLauncher-vX.Y.Z-release.apk`; the repository was formerly named LeviLaunchroid, and old links redirect automatically; once installed, the app is named LeviLauncher with the package name `org.levimc.launcher`). Launchers from unofficial sources are not guaranteed to work and are not supported.
2. MC must be a licensed copy of Minecraft Bedrock Edition bought on Google Play (1.21.80 or later, `arm64-v8a` 64-bit), and the Google Play version of Minecraft must be installed on your device. Packages from forums, version libraries, or cloud drives—as well as cracked or verification-free builds—are not supported. You must buy the Google Play version separately; purchases from other platforms do not carry over.
3. Starting in v1.7.0, you can sign in on the launcher's "Download" page with a Google account that owns the game and download Minecraft directly from Google Play, without having to track down a package yourself.
4. Imported versions usually require you to enable "Version isolation" in the instance settings before they can launch.

*Applies to: LeviLauncher-Android current version (v1.7.x); the Google Play download feature requires v1.7.0+*
