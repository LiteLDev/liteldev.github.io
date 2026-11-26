# lip self-update

Update lip itself to its latest release.

## Synopsis

```
lip self-update [--check] [-h | --help]
```

## Description

`lip self-update` finds the latest release of lip and, if it is newer than the running version, installs it using the same method as the current installation.

### Checking

lip reads the [releases of lip](https://github.com/LiteLDev/lip/releases) from the tags of its repository, `https://github.com/LiteLDev/lip.git`, the same way it reads the versions of any package: each tag consisting of `v` followed by a SemVer version is a release. Other tags are ignored.

The **latest release** is the one with the highest version. Pre-releases such as `1.1.0-beta.1` count only when the running lip is itself a pre-release.

If there are no releases, or the latest release is not newer than the running lip, lip reports that it is up to date and changes nothing. With `--check`, lip always stops here.

### Installation kind

| Kind | Meaning | How lip knows |
| --- | --- | --- |
| `msi` | lip was installed by the Windows installer, `lip-<version>-<platform>.msi`. | The `install.json` file beside the `lip` executable contains a JSON object whose `kind` is `"msi"`. The installer writes this file. |
| `portable` | lip was unpacked from an archive, or installed any other way. | There is no `install.json`. |

For the `msi` kind, the **installation scope** indicates whom the installer installed lip for: `user` (the user who ran it) or `machine` (all users). This is stored in the `scope` field of `install.json`: `{"kind": "msi", "scope": "user"}` or `{"kind": "msi", "scope": "machine"}`. Without that field—as when earlier installers wrote `{"kind": "msi"}`—the scope defaults to `machine`.

If `install.json` exists and is anything other than a JSON object whose `kind` is `"msi"` and that has either no `scope` or the `scope` `"user"` or `"machine"`, `lip self-update` fails.

`<platform>` is the system lip runs on: `win-`, `linux-`, or `osx-`, followed by `x64` or `arm64`. On any other system, `lip self-update` fails before changing anything.

### Updating

Without `--check`, when a newer release `V` exists, lip performs these steps in order:

1. Reads the installation kind and scope.
2. Selects the release file to install. The `msi` kind fails on any system other than Windows.

   | Kind | File |
   | --- | --- |
   | `msi` | `lip-V-<platform>.msi` |
   | `portable` on Linux | `lip-V-<platform>.tar.xz` |
   | `portable` on Windows and macOS | `lip-V-<platform>.zip` |

3. Empties and creates the `self-update` directory in the [cache directory](../files.md#cache-directory).
4. Downloads the file from `https://github.com/LiteLDev/lip/releases/download/vV/<file>` into `self-update`. If the download fails—for example, because the release does not have the file yet—the command fails.
5. Installs the file according to the installation kind, as described below.

A failure in steps 1 to 4 leaves the existing installation untouched.

**`msi`.** lip runs `msiexec /i <file> /qn /norestart`. When the installation scope is `machine`, lip starts it as administrator, and Windows prompts you for permission. When the scope is `user`, lip starts it as the user running lip without a prompt. If you decline the prompt or `msiexec` fails to start, the command fails. Otherwise, lip reports that the installer is running and exits immediately with code 0 without waiting. The installer replaces lip silently in the background without restarting Windows. Close any other running `lip` processes so the installer can complete.

**`portable`.** lip extracts the archive into `self-update`, then replaces the files in the lip directory one by one: it renames each existing file to `<file>.old` and writes the new file in its place. If any step fails, lip restores every renamed file and fails. Once all files are written, lip deletes any `.old` files it can remove and deletes the `self-update` directory.

- Files in the directory that are not in the archive are kept.
- On Windows, the running `lip.exe` cannot be deleted, so `lip.exe.old` remains until the next `lip` process starts and deletes it.
- On Linux, extracting the `.tar.xz` archive requires `tar` and `xz` on the system.

### After the update

The [daemon](daemon.md) that performed the update—either by replacing lip or by starting the installer—exits once it becomes idle, so that the next command starts the new version. While it is still running a managed server, it stays running; see [After an update](daemon.md#after-an-update).

A running interface continues to run the old version. If you installed the update using **Install update** on its [Settings](../../interface/settings.md) page, the interface prompts you to quit and restart lip (or, if the installer was started, to quit so the installer can finish), offering the buttons **Quit lip** and **Later**. Once the interface closes, lip writes a line such as `lip was updated to 1.1.0. Run lip again to start it.` to standard error.

### Network

Both the repository tags and the update file are fetched through [`github_proxy`](../configuration.md#github-proxy) when set, falling back to GitHub directly if the proxy fails. lip does not read `SHA256SUMS` or use the GitHub API. Because a proxy could alter what lip installs, only use one you trust.

## Options

| Option | Description |
| --- | --- |
| `--check` | Only find the latest release. Installs nothing and changes nothing. |
| `-h`, `--help` | Print help and exit. |

## Output

Only `lip self-update --check` writes to standard output. If a newer release exists, it prints the version followed by a newline:

```
1.1.0
```

If lip is up to date, it prints nothing to standard output. All other messages go to standard error.

Scripts should therefore check whether standard output is empty rather than checking the exit code.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | lip is up to date; `--check` finished (whether a newer release exists or not); the update was installed; or the installer was started. |
| not `0` | Usage error, or the check or update failed. |

## Examples

Check for a newer version:

```shell
lip self-update --check
```

Update lip:

```shell
lip self-update
```

Update only when a newer version exists, in a POSIX shell script:

```shell
if [ -n "$(lip self-update --check 2> /dev/null)" ]; then
  lip self-update
fi
```

## See also

- [Your first server](https://levimc.org/tutorials/server/first-server/): installing lip.
- [Settings](../../interface/settings.md): **Check for updates** in the interface.
- [Files](../files.md#the-installation-directory): `install.json` and the `.old` files.
