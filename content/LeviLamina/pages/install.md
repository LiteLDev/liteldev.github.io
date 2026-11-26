# Install LeviLamina

You never install LeviLamina by itself. Instead, the tool for your environment installs it alongside the matching game version: [lip](https://levimc.org/lip/) on a server, [LeviLauncher](https://levimc.org/LeviLauncher/) for the game on Windows, and xmake in a mod project.

## What you need

- **On a server:** [lip](https://levimc.org/lip/install.html) on Windows, x64 Linux, or macOS. On Linux and macOS, lip sets up Wine automatically to run the Windows server.
- **In the game:** [LeviLauncher](https://levimc.org/LeviLauncher/install) on Windows 10 or 11, and a licensed copy of Minecraft Bedrock Edition. LeviLamina does not run on Android.
- **For a mod:** the prerequisites listed in [Your first LeviLamina mod](https://levimc.org/tutorials/develop/first-levilamina-mod/): Windows, Visual Studio with the C++ tools, and xmake.

Each LeviLamina version works with one game version: see [Supported versions](versions.md).

## Install

### On a server

In an empty folder, run `lip` and configure the server on its **Server** page, which prompts you for the game version and loader, or run:

```shell
lip setup --game 1.26.60
```

lip installs that version of the Bedrock Dedicated Server, the latest LeviLamina release that supports it, and all required dependencies. Running `lip install LeviLamina` does the same using the latest game version that LeviLamina supports.

Installing with lip is the supported method. Manually unpacking a release archive into a server is not supported, because lip also installs LeviLamina's dependencies and prepares the server executable.

### In the game on Windows

In LeviLauncher, open **Download**, select a game version that lists LeviLamina in the **Loader** column, and leave **Install LeviLamina** enabled during installation. From a terminal:

```shell
LeviLauncher.exe install latest --loader
```

### In a mod project

A mod specifies its target LeviLamina version in `xmake.lua`, and xmake downloads it when you build. The [mod template](https://github.com/LiteLDev/levilamina-mod-template) already includes this line:

```lua
add_requires("levilamina 26.60.*", {configs = {target_type = get_config("target_type")}})
```

## Check that it works

- **Server:** `lip list` shows `github.com/LiteLDev/LeviLamina` and its version, and `lip run` starts the server.
- **Game:** in LeviLauncher, open the instance's **Instance Settings** and check the **Loader** tab to see which LeviLamina version is installed.

## Update

- **Server:** stop the server, then select **Change versions…** on the Server page in lip, or run `lip setup` again with the desired game version ([Change the game or the loader version](https://levimc.org/lip/interface/server.html#change-the-game-or-the-loader-version)).
- **Game:** use the **Loader** tab in the instance's **Instance Settings** to install, update, or remove LeviLamina. From a terminal, run `LeviLauncher.exe loader install`, or `LeviLauncher.exe loader versions` to list available versions.
- **Mod project:** update the version in `add_requires` and rebuild.

## Other versions

All releases are available on the [releases page](https://github.com/LiteLDev/LeviLamina/releases), and [Supported versions](versions.md) lists the matching game version for each one. To install a specific version on a server, specify it directly: `lip setup --game 1.26.60 --loader levilamina@26.60.3`.

## Next steps

- [Your first server](https://levimc.org/tutorials/server/first-server/): set up a server with LeviLamina, step by step.
- [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/): run LeviLamina and a client mod with LeviLauncher.
- [Your first LeviLamina mod](https://levimc.org/tutorials/develop/first-levilamina-mod/): create a mod from the template, build it, and load it.
