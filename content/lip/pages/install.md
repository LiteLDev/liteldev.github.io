# Install lip

`lip` is a single program with no other requirements—no .NET, Git, or Wine to install first. Pick your system below, then check that it runs.

## What you need

- Windows 10, Windows 11, or Windows Server 2019 or later (x64 or ARM64); macOS (Apple silicon or Intel); or Linux (x64). `lip` is not available for Linux on ARM64. See [Where lip runs](index.md#where-lip-runs) for what a server can do on each system.
- A terminal: Windows Terminal or PowerShell on Windows, Terminal on macOS, or your desktop terminal on Linux.
- An internet connection.

## Install

Select your system below (yours is selected automatically).

:::: tabs

== Windows

1. Go to the [latest release of lip](https://github.com/LiteLDev/lip/releases/latest) and download `lip-<version>-win-x64.msi` (or `lip-<version>-win-arm64.msi` on an ARM PC).
2. Run the installer. It installs `lip` for your user in `%LOCALAPPDATA%\Programs\lip` and adds that folder to your `PATH` without needing administrator privileges. If `lip` is already installed system-wide in `C:\Program Files\lip` (as earlier versions installed it), the installer updates that installation instead, which requires an administrator.

::: details Without the installer: the archive
Download `lip-<version>-win-x64.zip` (or `win-arm64`) from the same release, extract `lip.exe` into a folder of your choice, and add that folder to your `PATH`. Use this if the installer is blocked or fails.
:::

== macOS / Linux

In a terminal, run:

```shell
curl -fsSL https://levimc.org/lip/install.sh | sh
```

The script:

1. selects the `lip` build for your system: `osx-arm64` on a Mac with Apple silicon, `osx-x64` on an Intel Mac, or `linux-x64` on x64 Linux, and stops on any other system;
2. downloads that build from the latest GitHub release and verifies it against the release's `SHA256SUMS`, refusing to install a file that does not match;
3. places `lip` in `~/.local/bin`, replacing any existing `lip` there;
4. offers to add that folder to your shell profile if it is not already on your `PATH`.

It requires no root or administrator password and modifies nothing outside that folder and your shell profile.

You can customize the script with these variables. Pass them to `sh` after the `|`:

```shell
curl -fsSL https://levimc.org/lip/install.sh | LIP_VERSION=0.42.0 sh
```

| Variable | What the script does with it |
| --- | --- |
| `LIP_VERSION` | Installs this version (such as `0.42.0`) instead of the latest. |
| `LIP_INSTALL_DIR` | Installs `lip` in this folder (an absolute path) instead of `~/.local/bin`. |
| `LIP_GITHUB_PROXY` | Downloads from GitHub through this proxy, just like `lip`'s [`github_proxy`](guides/configuration.md#github-proxy) setting: the proxy URL, followed by `/`, followed by the GitHub URL. |
| `LIP_NO_MODIFY_PATH` | When set to `1`, leaves your shell profile untouched and prints the line to add instead. |

Macs with Apple silicon run `lip`'s bundled Wine through Rosetta 2. `lip` prompts you to install it the first time it sets up or starts a server; see [Linux and macOS](guides/linux_macos.md#macos-on-apple-silicon).

::: details Without the script: the archive
Download the archive for your system from the [latest release](https://github.com/LiteLDev/lip/releases/latest): `lip-<version>-osx-arm64.zip` (Mac with Apple silicon), `lip-<version>-osx-x64.zip` (Intel Mac), or `lip-<version>-linux-x64.tar.xz` (Linux). Extract it into a folder on your `PATH`:

```shell
mkdir -p ~/.local/bin
unzip lip-<version>-osx-arm64.zip -d ~/.local/bin        # macOS (or osx-x64)
xattr -d com.apple.quarantine ~/.local/bin/lip           # macOS
tar -xJf lip-<version>-linux-x64.tar.xz -C ~/.local/bin  # Linux
```

On macOS, the `xattr` command removes the quarantine attribute that macOS adds to files downloaded in a browser; without it, macOS refuses to run `lip`. If `~/.local/bin` is not on your `PATH`, add `export PATH="$HOME/.local/bin:$PATH"` to `~/.zshrc` (macOS) or `~/.profile` (Linux).
:::

::::

## Check that it works

Open a **new** terminal window (already-open terminals will not have the updated `PATH` yet) and check the `lip` version:

```shell
lip -v
```

You should see a version number, such as `0.44.0`. If the terminal cannot find `lip`, close it and open a new one.

## Update

```shell
lip self-update
```

`lip` installs the latest release using the same method it was originally installed with: via the installer on Windows, and in place on other systems. Run `lip self-update --check` to check for a newer release without installing it. See [`lip self-update`](reference/commands/self_update.md).

## Other versions

All releases and their platform files are on the [releases page](https://github.com/LiteLDev/lip/releases). To install a specific version, download its file from that page or pass `LIP_VERSION` to the install script. `lip` currently has no beta channel; when a release is marked "Pre-release" on GitHub, `lip self-update` offers it only if your installed `lip` is already a pre-release.

## Next steps

- [Your first server](https://levimc.org/tutorials/server/first-server/): go from an empty folder to a running server with LeviLamina using the `lip` interface.
- [A server from the command line](https://levimc.org/tutorials/server/command-line/): do the same with `lip setup`, `lip install`, and `lip run`.
- [A tour of the interface](interface/tour.md) and [managing packages](guides/managing_packages.md).
