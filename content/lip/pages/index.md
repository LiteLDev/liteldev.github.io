# lip

Set up a Minecraft Bedrock server, add mods, and run it from one screen in your terminal.

## What lip is

`lip` runs a [LeviLamina](https://levimc.org/LeviLamina/) server and manages its packages. LeviLamina is LeviMC's mod loader for the Minecraft Bedrock Dedicated Server, the server program that Mojang publishes for Minecraft Bedrock Edition.

With `lip` you can:

- **Set up a server.** `lip` downloads compatible versions of the game and LeviLamina and puts them in a folder.
- **Add and remove mods.** `lip` installs a mod along with all its dependencies, updates it, and removes it. Mods on [LeviMC Mods](https://levimc.org/mods/) appear on its Marketplace page, and each mod's page there gives its `lip install` command. Unlisted mods install the same way from a Git repository, a URL, or a file.
- **Run the server.** `lip` starts the server, shows its output, forwards the commands you type, and can restart it after a crash.
- **Edit the configuration.** `lip` displays and lets you edit `server.properties`, the allowlist, permissions, and mod configuration files.

`lip` manages servers only. Client mods are managed by launchers such as [LeviLauncher](https://levimc.org/LeviLauncher/).

## The interface and the commands

Both do the same work. Use whichever suits your task.

| | The interface | The commands |
| --- | --- | --- |
| How you start it | Type `lip` and press `Enter`. | Type `lip` and a command, such as `lip install`. |
| What it is | A full-screen terminal program with an eight-page sidebar. Navigate with the arrow keys and `Enter`. | One line per action. `lip` runs the command and exits. |
| Good for | Getting started, browsing mods, watching the server, editing configuration. | Scripts, automation, servers reached over SSH. |
| Where to read on | [A tour of the interface](interface/tour.md) | The [command line reference](reference/cli.md) |

Here is the Server page in the interface while the server is running, showing the server output and an input line for commands:

![The Server page of lip while the server runs: the output of the server says "Server started.", and the input line below it waits for a command.](/screenshots/en/first-server-21-running.svg)

## Start here

LeviMC's step-by-step tutorials take you from scratch to a finished task:

- [Your first server](https://levimc.org/tutorials/server/first-server/): install `lip` and go from an empty folder to a running server with one mod using the interface.
- [A server from the command line](https://levimc.org/tutorials/server/command-line/): do the same with `lip setup`, `lip install`, and `lip run`.
- [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/): package your mod, publish it, and list it on LeviMC Mods.

## Five words to know

- A **workspace** is a folder that holds one server. `lip` works in one workspace at a time: either the folder where you start it or one you pick in the interface. `lip` stores its data for a workspace in its `.lip` folder.
- The **game** is a specific version of the Minecraft Bedrock Dedicated Server, such as 1.26.60. A workspace has one game.
- The **loader** is LeviLamina. It lets the server run mods. A server without a loader is a plain Minecraft server.
- A **mod** adds features to the server. To `lip`, a mod is a **package**: a versioned item with dependencies that it can install from a Git repository, a URL, or a file on your disk. The game and the loader are packages too.
- The **daemon** is a `lip` process that runs in the background. It carries out actions from the interface and the command line, and it keeps a server running after you close the interface. `lip` starts it when needed, and it exits automatically when idle.

[How lip works](concepts/how_lip_works.md) explains each of these in depth.

## Where lip runs

`lip` is released for these systems. A server with LeviLamina is a Windows program; on Linux and macOS, `lip` runs it through [Wine](https://www.winehq.org/), which it downloads and sets up itself.

| System | A server with LeviLamina and mods | A server without a loader |
| --- | --- | --- |
| Windows on x64 or ARM64 | Yes | Yes |
| Linux on x64 | Yes, through Wine | Yes: the Windows server through Wine, or the Linux server directly |
| macOS on Intel or Apple silicon | Yes, through Wine | Yes, the Windows server through Wine |

There is no release for Linux on ARM64, where a LeviLamina server does not run. See [Linux and macOS](guides/linux_macos.md) for what `lip` installs there and for the limits.

## Install lip

The [Install](install.md) page has the Windows installer, the macOS and Linux install script, and instructions for updating `lip`.

## The rest of this site

- **Guide**: [using the interface](interface/tour.md) page by page; [managing packages](guides/managing_packages.md), [configuration](guides/configuration.md), and [Linux and macOS](guides/linux_macos.md) from the command line; [migrating packages](authors/migrating_packages.md) from lip v0.x; and [troubleshooting](guides/troubleshooting.md). For short answers to common questions, see the [LeviMC FAQ](https://levimc.org/faq/server/lip/basics/).
- **Concepts**: [how lip works](concepts/how_lip_works.md), [lip.toml](concepts/lip_toml.md), the [state file](concepts/state_file.md), and the [internals](concepts/internals.md).
- **Reference**: the [command line](reference/cli.md), every [command](reference/commands/setup.md), the [interface](reference/interface.md), the [configuration](reference/configuration.md), and the [files](reference/files.md).
