# Install Be.D.D.

Be.D.D. is a single Windows program, `BeDD.exe`, bundled with the mods it installs into its own copies of the game. You only need it on the PC that runs the tests. It is not a lip package and is not on LeviMC Mods.

## What you need

- Windows 10 or 11, x64.
- [LeviLauncher](https://levimc.org/LeviLauncher/install) **1.1+** with a Minecraft Bedrock **1.26.60** (GDK, release) instance that has LeviLamina **26.60.x** ([Which instance](/guide/installs#which-instance)). Be.D.D. copies that instance and never modifies or starts the original.

You do not need PowerShell, lip, or a .NET runtime.

## Install

Download `bedd-windows-x64-setup.exe` from the [latest release](https://github.com/LiteLDev/BeDD/releases/latest) and run it. It does not require administrator rights: it installs for your user in `%LOCALAPPDATA%\Programs\BeDD`, adds a **BeDD** entry to the Start menu, and adds the folder to your `PATH`.

The release includes two other files:

| File | When to use it |
|---|---|
| `bedd-windows-x64.zip` | Unzips anywhere; run `BeDD.exe` directly from its folder. Useful when a test harness fetches Be.D.D. itself ([Let the harness fetch it](/guide/installs#let-the-harness-fetch-it)). |
| `bedd-windows-x64.msi` | Installs silently with `msiexec /i bedd-windows-x64.msi /qn`, for managed PCs and CI. |

## Check that it works

Open a **new** terminal and run:

```powershell
BeDD.exe version
```

You should see `Be.D.D. 0.4.0` (or newer) along with the game and LeviLamina versions it drives.

## Update

Run the new installer. It closes any open manager window and its running games. The next `launch` updates the mod in each clone; see [Upgrading](/guide/installs#upgrading).

## Other versions

All releases are on the [releases page](https://github.com/LiteLDev/BeDD/releases). Each release drives a single game version, listed in its release notes. In CI, pin a specific version in the download URL: `https://github.com/LiteLDev/BeDD/releases/download/v0.4.0/bedd-windows-x64.zip`.

## Uninstall

Go to Settings > Apps > Installed apps > **BeDD**. To also remove the clones, worlds, and logs, see [Uninstalling](/guide/installs#uninstalling).

## Next steps

- [Drive the game client with Be.D.D.](https://levimc.org/tutorials/automate/bedd/): set up the base game, start a game in the background, and run your first script.
- [Driving the game](/guide/usage) and [several games at once](/guide/several-games).
