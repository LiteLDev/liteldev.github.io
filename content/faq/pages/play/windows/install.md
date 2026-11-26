# Installing and updating LeviLauncher on Windows

## Downloading a Minecraft version in the PC version of LeviLauncher is very slow. Do I need a proxy?

No. When downloading, choose a mainland China download source, xboxlive.cn (the launcher lists xboxlive.cn mirrors first, and can also test speeds to pick a source automatically). If the download is still slow, switch to another source. For users in mainland China, "Use mirror source" (on by default) also routes launcher updates, packages, and version lists through mainland China mirrors or a GitHub proxy.

*Applies to: LeviLauncher (Windows) 1.0.x and later*

## LeviLauncher (Windows) says "The current account has no license for this version" (`ERR_LICENSE_NOT_ENTITLED`) when downloading or installing a game version. What should I do?

LeviLauncher requires a licensed copy of Minecraft Bedrock Edition: the Microsoft account signed in to the launcher must own Bedrock Edition (if it does not, you can buy it at <https://www.xbox.com/en-US/games/store/minecraft/9nblggh537bl>). Simply signing in to Xbox in the game without buying PC Bedrock Edition is not enough. If the error continues after you buy the game, note that a Microsoft account can be signed in to the Microsoft Store on at most 10 devices, and the launcher counts as a separate device. Go to <https://account.microsoft.com/devices/content>, remove any devices you no longer need, confirm that the currently signed-in account is the one that owns the game, and try again. For other installation or launch problems, see the official troubleshooting guide: <https://levimc.org/LeviLauncher/guide/update-troubleshooting>.

*Applies to: LeviLauncher (Windows) 1.0.0 and later (Microsoft account sign-in in the launcher)*

## Can LeviLauncher launch a Bedrock Edition that I installed earlier with the official Microsoft launcher or the Store?

Taking it over directly is not recommended. LeviLauncher manages its own installed "instances". Instead, reinstall the same version on LeviLauncher's "Download" page, or run `LeviLauncher.exe install <version or local installer file>`.

You can copy existing game data (worlds and settings) during installation, or merge the system's vanilla game data from the same channel (release/preview) into the instance later by running `LeviLauncher.exe instance copy-data <instance> --from system` (files with the same name are overwritten; no files are deleted). This applies to GDK edition instances with independent data (isolation) enabled. Back up all your worlds first.

*Applies to: LeviLauncher (Windows) 1.1.0*

## A Windows administrator (UAC) prompt appears when installing LeviLauncher. Should I allow it?

Yes, provided the installer came from an official source (GitHub Releases). By default, the LeviLauncher installer installs to `Program Files`, so it requires administrator rights and cannot continue without them.

The launcher may also request administrator rights during a self-update (if the install directory is not writable) and when `doctor --fix` installs components such as the VC runtime and GameInput. Allow the prompt once you have confirmed it is trustworthy.

*Applies to: LeviLauncher (Windows) 1.x*
