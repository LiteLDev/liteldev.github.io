# Install LeviLauncher

LeviLauncher is available for Windows, Android, and—in beta—macOS. The tab for your device is selected automatically.

## What you need

=== "Windows"

    - Windows 10 or 11.
    - A licensed copy of Minecraft Bedrock Edition (GDK / UWP) from Microsoft Store.

=== "Android"

    - Android 9.0 or later on an ARM64 device.
    - Minecraft Bedrock Edition 1.21.80 or later, bought and installed from Google Play on this device.

=== "macOS"

    - macOS 14.6 or later on a Mac with Apple silicon.
    - A licensed copy of Minecraft Bedrock Edition. LeviLauncher runs the Windows (GDK) game through Wine.

::: info iOS
There is no iOS version of LeviLauncher, and we have no plans to make one.
:::

## Install

=== "Windows"

    1. Open the [latest release of LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases/latest) and download `LeviLauncher-amd64-installer.exe`.
    2. Run it and complete the setup wizard. It asks for administrator rights because it installs to `Program Files` by default. If it prompts you to install WebView2 or another component, let it continue.

    The release includes two other files, which you normally do not need:

    | File | What it is |
    | --- | --- |
    | `LeviLauncher.exe` | The portable version. Put it by itself in a new folder whose path contains only English letters, and run it from there. |
    | `LeviLauncher.zip` | The package the launcher downloads when updating itself. |

=== "Android"

    1. On your device, open the [latest release of LeviLauncher for Android](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest) and download the file ending in `-release.apk`.
    2. Open the downloaded file. If Android says your browser is not allowed to install apps, tap **Settings**, turn on **Allow from this source**, go back, and tap **Install**.

=== "macOS"

    The macOS version is in beta: you will find it in releases marked **Pre-release**, not in the latest stable release.

    1. Open the [releases of LeviLauncher](https://github.com/LiteLDev/LeviLauncher/releases) and find the newest release that includes `LeviLauncher-macos-arm64-installer.dmg`.
    2. Download that file, open it, and drag **LeviLauncher** into **Applications**.

    UWP instances are for Windows only.

## Check that it works

Start LeviLauncher. Its window opens; on first launch, it shows the initial setup (Windows, macOS) or the licence agreement (Android).

## Update

=== "Windows"

    LeviLauncher checks for a newer version at startup and offers to install it in place. To check manually, open **Settings** and press **Check Update**, or run `LeviLauncher.exe self-update`.

=== "Android"

    When LeviLauncher finds a newer version, it offers to update, downloads the APK, and hands it to Android to install. If your network cannot reach GitHub, download the new APK from the releases page and install it over the existing app.

=== "macOS"

    LeviLauncher checks for a newer version at startup and offers to install it.

## Beta and older versions

Every version, along with its files and changelog, is available on the releases pages:

- Windows and macOS: [LiteLDev/LeviLauncher releases](https://github.com/LiteLDev/LeviLauncher/releases)
- Android: [LiteLDev/LeviLauncher-Android releases](https://github.com/LiteLDev/LeviLauncher-Android/releases)

A **beta** is a release marked **Pre-release**, such as `v1.2.0-beta.1`. It previews upcoming features before they are finished and may break. To try one, download the files from its release page as described above. On Windows, an installed copy of LeviLauncher can also follow betas automatically: turn on **Receive Beta Updates** in **Settings**, and it will offer each new beta as an update. Turn it off to stay on stable versions.

## Next steps

=== "Windows"

    - [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/): from a fresh LeviLauncher to your first game with a mod.
    - [Version Management](/guide/version-management?platform=windows)

=== "Android"

    - [Play with mods on Android](https://levimc.org/tutorials/play/play-with-mods-android/): from a fresh LeviLauncher to your first game with a mod.
    - [Version Management](/guide/version-management?platform=android)

=== "macOS"

    - [Version Management](/guide/version-management)
    - [Update & Troubleshooting](/guide/update-troubleshooting)
