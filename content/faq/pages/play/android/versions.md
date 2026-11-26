# LeviLauncher on Android: versions and compatibility

## Why can't I import a Windows .dll mod (LeviLamina mod) into LeviLauncher on Android?

A `.dll` file is a Windows mod (used by LeviLamina on PC and the Windows version of LeviLauncher) and does not work on Android. LeviLauncher on Android only accepts native mods compiled for Android: `.so` files, or `.levipack` / `.mcmod` / `.zip` mod packs, which are loaded by the built-in Preloader (`preloader-android`) rather than by LeviLamina. To use a `.dll` mod, run the PC version of LeviLauncher with LeviLamina on a computer. On Android, you need mods built specifically for Android.

*Applies to: LeviLauncher-Android all current versions (latest v1.7.1)*

## After importing an MC version (such as 26.10) into LeviLauncher on Android, it crashes or says 64-bit is required. What is the cause?

LeviLauncher on Android supports only ARM64 (`arm64-v8a` / armv8, 64-bit) devices and 64-bit Minecraft. An imported armv7 (32-bit) package will not work; switch to a 64-bit package. We recommend the licensed Google Play version (since v1.7.0, you can also sign in with a Google account in the launcher and download it directly). Also, imported versions usually need version isolation enabled before they can launch.

*Applies to: LeviLauncher-Android all current versions*

## When downloading a Minecraft package or mod for LeviLauncher on Android there are several architecture builds such as aarch64 / armv7 / x86. Which should I choose?

Choose arm64 (`aarch64` / armv8 / `arm64-v8a`). LeviLauncher on Android is built only for `arm64-v8a` and supports only 64-bit Minecraft on ARM64 devices; MC packages for other architectures will not launch. Likewise, choose the arm64 build for `.so` mods, and make sure the mod version matches your MC version. The launcher's built-in mod catalog already filters for the `android-arm64` platform, so mods listed there can be installed directly.

*Applies to: LeviLauncher-Android all current versions*
