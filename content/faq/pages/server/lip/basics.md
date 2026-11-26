# lip basics

Short answers to the most common questions from new users, each with a link to a page with more detail.

## About lip

### What does lip do?

lip sets up a Minecraft Bedrock server in a folder, installs and updates its mods, and runs it. You use it through a terminal interface or through commands. See [the home page](https://levimc.org/lip/).

### Is it only for LeviLamina?

No, though that is what it is made for. The mods lip installs are LeviLamina mods, and LeviLamina is the only loader lip sets up. You can also run a plain server without a loader: the Windows one with `lip setup --game <version> --no-loader`, or the Linux one with `--build linux`. See [Game versions and builds](https://levimc.org/lip/reference/commands/setup.html#game-versions-and-builds).

### Can lip install client mods?

No. lip manages servers only. Launchers such as LeviLauncher manage mods for the game client and read the same packages.

### Which systems does it run on?

Windows, Linux on x64, and macOS. On Linux and macOS, lip runs the Windows server through a build of Wine that it downloads itself. There is no lip for Linux on arm64. See [Linux and macOS](https://levimc.org/lip/guides/linux_macos.html#what-works-where).

### Do I need git, Wine or anything else?

No. lip talks to git repositories itself, and downloads the game, the loader, Wine, and the Microsoft Visual C++ Redistributable when it needs them. See [Internals](https://levimc.org/lip/concepts/internals.html#the-git-client).

### Is there a Traditional Chinese version?

Yes. The interface supports English, Simplified Chinese, and Traditional Chinese, and follows your system language. To choose one manually, use the Settings page or run `lip config set language zh-Hant`. This documentation is available in all three languages too. Command output in the terminal is always in English. See [language](https://levimc.org/lip/guides/configuration.html#language).

## Using lip

### Can I use it without the interface?

Yes. Everything the interface does is available as a command: `lip setup`, `lip install`, `lip update`, `lip uninstall`, `lip run`, `lip config`. Start with [A server from the command line](https://levimc.org/tutorials/server/command-line/). The commands also work in scripts, where no one is there to answer prompts: see `--accept-eula` in [`lip setup`](https://levimc.org/lip/reference/commands/setup.html#options).

### And the other way round: do I have to learn the commands?

No. Run `lip` with no arguments and use the interface. See [Your first server](https://levimc.org/tutorials/server/first-server/).

### Does the server stop when I close the terminal?

It depends on how you started it.

- **Started in the interface:** no. It keeps running after you quit the interface or close the terminal.
- **Started with `lip run --managed`:** no. Closing the terminal only detaches you.
- **Started with a plain `lip run`:** yes. lip asks the server to stop and waits for it.

In the first two cases, the server runs in lip's background process. Reconnect to it through the interface or with `lip run --managed`. See [Managed servers](https://levimc.org/lip/reference/commands/run.html#managed-servers).

### How do I stop a server that runs in the background?

Open the interface and choose Stop on the Server page, or run `lip run --managed` in the server folder to attach to it and press Ctrl+C.

### Can lip restart a server that crashes?

Yes. Turn on "Auto restart" on the Server page, or run `lip config set restart on-failure --workspace`. See [Restarting](https://levimc.org/lip/reference/commands/run.html#restarting).

### Can I install or update mods while the server runs?

In the interface, no: it asks you to stop the server first. With the commands, yes, and the server picks up the changes the next time it starts. On Windows, the command can fail if the running server has a file open; if that happens, lip rolls back the changes. See [The interface and the commands](https://levimc.org/lip/concepts/how_lip_works.html#the-interface-and-the-commands).

### Can I run several servers?

Yes, each in its own folder, with its own ports in `server.properties`. One folder runs one server at a time. The interface keeps a list of your server folders in the [workspace picker](https://levimc.org/lip/interface/workspaces.html), which you open from the workspace at the top of the screen.

### How do I update lip?

Run `lip self-update`, or use "Check for updates" on the Settings page. `lip self-update --check` only checks whether a newer version is available. See [`lip self-update`](https://levimc.org/lip/reference/commands/self_update.html).

### How do I change the Minecraft version of my server?

Run `lip setup --game <version>` again in the server folder, or use **Change versions…** on the Server page in the interface. Mods move to versions that work with the new game. See [`lip setup`](https://levimc.org/lip/reference/commands/setup.html).

## Files

### Where are my worlds and my settings?

In the server folder, where the game puts them. lip does not move them.

| What | Where in the server folder |
| --- | --- |
| Worlds | `worlds/` |
| Game settings | `server.properties`, `allowlist.json`, `permissions.json` |
| A mod, and usually its settings | `mods/<name>/` |

The interface edits these settings on the [Game config](https://levimc.org/lip/interface/game_config.html) and [Mod config](https://levimc.org/lip/interface/mod_config.html) pages.

### What is the `.lip` folder?

It stores lip's notes about the server folder: installed packages, workspace settings, failure reports, and (on Linux and macOS) the Wine prefix. It is hidden on Windows. Leave it in place, and move it with the folder when you move the server. See [Files and directories](https://levimc.org/lip/reference/files.html).

### What does lip keep outside the server folder?

Four per-user directories: your settings, a download cache, lip's Wine, and the interface's list of workspaces.

| What | Windows | Linux and macOS |
| --- | --- | --- |
| Settings | `%APPDATA%\lip` | `~/.config/lip` |
| Cache | `%LOCALAPPDATA%\lip\Cache` | `~/.cache/lip` |
| Data: what lip installs to run the server, such as its Wine | `%LOCALAPPDATA%\lip\Data` | `~/.local/share/lip` |
| State: the list of workspaces | `%LOCALAPPDATA%\lip\State` | `~/.local/state/lip` |

You can delete the cache at any time with `lip cache clean`. lip writes nothing to the system's temporary directory. See [Per-user directories](https://levimc.org/lip/concepts/how_lip_works.html#per-user-directories).

### Will changing the game version delete my world?

No. `worlds/`, `server.properties`, `allowlist.json`, and `permissions.json` are kept. Some of the game's own folders, such as `resource_packs/` and `behavior_packs/` at the root, are deleted and rewritten. See [What survives a game change](https://levimc.org/lip/reference/files.html#what-survives-a-game-change).

### How do I move a server to another folder or machine?

Stop the server and move or copy the whole folder, including `.lip`. Then run lip in the new location. On a new machine, lip reinstalls what the server needs from the system when you first start it.

## Packages

### Where do packages come from?

From public git repositories, mostly on GitHub. There is no central registry. A package is named by its repository address, such as `github.com/LiteLDev/LegacyScriptEngine`. The Marketplace page in the interface lists mods from [levimc.org](https://levimc.org). See [Name a package](https://levimc.org/lip/guides/managing_packages.html#name-a-package).

### How do I install a package from my disk?

Pass `lip install` the path to a ZIP file or folder that has a `lip.toml` at its root, for example `lip install ./my-mod.zip`. See [A ZIP file or a folder on your disk](https://levimc.org/lip/guides/managing_packages.html#a-zip-file-or-a-folder-on-your-disk).

### Does lip support private repositories?

No. lip downloads without signing in, so only public repositories work.

### Why is a tag of my repository not a version?

Only tags named `v` followed by a full version, such as `v1.2.3`, count as versions. Tags such as `v1.2` or `1.2.3` do not. You can still install any tag, branch, or commit: `lip install github.com/user/repo@tag:1.2.3`. See [A git repository](https://levimc.org/lip/guides/managing_packages.html#a-git-repository).

### Can I still install packages made for lip v0.x, with a `tooth.json`?

Yes. lip reads and installs them like any other package. A lip v0.x server folder and configuration are converted the first time lip works with them. Authors can convert a package with `lip pkg migrate`: see [Migrating packages](https://levimc.org/lip/authors/migrating_packages.html).

### What is `lip.toml`?

The file that describes a package: its name, version, dependencies, and the files it installs. You only need one to create a package. See [lip.toml](https://levimc.org/lip/concepts/lip_toml.html).

### Does `lip install` change my `lip.toml`?

No. `lip install` installs packages into the server folder and records the installation in `.lip`. It never writes to `lip.toml`.

## When something goes wrong

### A command failed. Where do I find out why?

Read the `error:` and `hint:` lines that lip printed. For further details, check the failure report in `.lip/logs/` inside the server folder; lip prints the path to this report. See [Read the failure](https://levimc.org/lip/guides/troubleshooting.html#read-the-failure).

### What happens when an install fails halfway?

Nothing is left half-done. Any command that modifies the server folder completes all of its work or none of it: if it fails or you press Ctrl+C, lip rolls back the changes. If the lip process itself is killed, the next command you run in that folder cleans up first. See [Operations](https://levimc.org/lip/concepts/how_lip_works.html#operations).

### GitHub is slow or blocked here. What can I do?

Configure a GitHub proxy, or use your network's proxy. See [When GitHub is slow or blocked](https://levimc.org/lip/guides/configuration.html#when-github-is-slow-or-blocked).

### Can I run two lip commands at the same time?

Yes, in different server folders. Within the same folder, only one command can make changes at a time: a second command fails immediately, so you must wait for the first to finish before running it again. Read-only commands, such as `lip list`, always work. See [Another lip is changing the workspace](https://levimc.org/lip/guides/troubleshooting.html#another-lip-is-changing-the-workspace).

### What is the lip process that keeps running in the background?

The daemon. It executes your commands and keeps your managed servers running. Unless it is running a server, it exits automatically after 10 minutes of inactivity. Run `lip daemon status` to check it, and `lip daemon stop` to stop it when idle. See [The daemon and its clients](https://levimc.org/lip/concepts/how_lip_works.html#the-daemon-and-its-clients).
