# State file

This page describes `.lip/state.json`, explaining what lip records about a workspace and what each member is for.

`lip` records the state of a workspace in its **state file**: which packages are installed, their exact versions, where they came from, and the files they placed on disk.

## Location

The state file is `.lip/state.json` in the workspace root. On Windows, lip creates the `.lip` directory with the hidden attribute; elsewhere, its name hides it.

Because the state file lives inside the workspace directory rather than being tied to its path, moving, renaming, or copying a workspace preserves both its state file and its installed packages.

`.lip` is reserved for lip: installing a package that would write a file to `.lip` at the workspace root, or anywhere below it, fails, and a `purge` pattern never matches `.lip` or anything below it.

## Purpose

The state file serves several purposes:

1.  **State Tracking**: It is the single source of truth for what is installed in the workspace.
2.  **Reproducibility**: It records the package file used to install each package and, for packages from a git repository, the commit it was at. When lip needs a package again, it installs it using that recorded package file instead of resolving the package again.
3.  **Uninstallation**: `lip` tracks every file a package writes to disk. This allows `lip uninstall` to cleanly delete all files belonging to a package, preventing "file rot" in the workspace.
4.  **Dependency Graph**: It distinguishes between packages explicitly installed by the user and those installed as dependencies. This allows `lip uninstall` to remove dependencies that are no longer needed by any explicitly installed package, and `lip list` to display the two groups separately.
5.  **Environment**: It records the workspace's side and platform once they are known, so subsequent commands use the same [environment](lip_toml.md#environment).

lip updates the state file once, after all packages in an operation have been installed or uninstalled. If the operation fails, lip rolls back its changes to the workspace and leaves the state file untouched, ensuring the two always match (see [How lip works](how_lip_works.md)).

lip always writes the state file atomically: it writes `.lip/state.json.tmp` and then renames it to `.lip/state.json`. Any program reading the state file while lip is running therefore sees either the old file or the new one, never a partially written file. [`lip list`](../reference/commands/list.md) reads it this way, without acquiring the workspace lock.

## Structure

The state file is a JSON file defined by the JSON Schema [`state.schema.json`](https://github.com/LiteLDev/lip/blob/main/protocol/state.schema.json):

```json
{
  "format": 4,
  "side": "server",
  "platform": "win-x64",
  "packages": [...]
}
```

### Fields

*   **`format`**: The format of the state file, `4`.
*   **`side`**: The side of the workspace, `"server"` or `"client"`. lip writes `"server"`.
*   **`platform`**: The platform of the workspace, a [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog).
*   **`packages`**: The installed packages, in installation order: each package appears after the packages that satisfy its dependencies.

`side` and `platform` are always present and never `null`; a state file without them is invalid. A workspace without a state file gets its environment from its first `setup`, `install`, `uninstall`, or `update` command (see [`lip install`](../reference/commands/install.md)).

### Package Entry

Each package is recorded with these exact members:

*   **`manifest`**: The full package file that the package was installed with. For a `tooth.json` in an [earlier format](lip_toml.md#earlier-formats), this is the package file that lip derived from it for the workspace environment. Its `id` is the package ID and its `version` is the installed version.
*   **`variant`**: The variant of the source the package was installed from, or `""` for the default variant. Combined with the `id` in `manifest`, this forms the package's [identity](lip_toml.md#identity).
*   **`explicit`**:
    *   `true`: The user installed the package directly (for example, `lip install <package>`).
    *   `false`: The package was installed as a dependency of another package.
*   **`ref`**: What the package was installed from: the argument passed to `lip install` or `lip update` (for example, `github.com/user/repo`, `github.com/user/repo#lua@branch:main`, or an `https://` URL; a local path is recorded as the `file:` URI of its absolute path), the source from which [`lip setup`](../reference/commands/setup.md) installed the game or loader (for example, `github.com/LiteLDev/bds@1.21.0`), or, for a dependency, the dependency key. [`lip update`](../reference/commands/update.md) requests this source again.
*   **`commit`**: Present only for packages from a git repository: the commit of its archive, in lowercase hexadecimal. Packages from a URL or local path have no `commit`, and neither does the game, `github.com/LiteLDev/bds`, which does not come from a repository.
*   **`files`**: The files owned by the package, relative to the workspace root and separated by `/`.

The installed entry is the entry in `manifest.variants[variant]` whose `side` and `platform` match the workspace.

lip compares an installed package with a resolved package by identity, version, and commit only. Two packages with the same identity and version—either from no git repository or from the same commit—count as the same package, even if the files at a URL or local path have changed since installation. lip does not record or verify checksums for downloaded ZIP archives or assets.

When lip needs an installed package's files again, it reinstalls the package using the recorded `manifest`: for a package from a git repository, it fetches the recorded commit (even if it came from a branch that has since moved on); otherwise, it fetches the archive currently named by `ref`. Uninstalling requires neither.

## Example

```json
{
  "format": 4,
  "side": "server",
  "platform": "win-x64",
  "packages": [
    {
      "manifest": {
        "format": 4,
        "id": "github.com/example/MyMod",
        "version": "1.0.0",
        "variants": {
          "": [
            {
              "side": "server",
              "platform": "win-x64",
              "deps": { "github.com/LiteLDev/LeviLamina": ">=1.0.0 <2.0.0" },
              "assets": [
                {
                  "type": "mcmod",
                  "urls": ["https://github.com/example/MyMod/releases/download/v1.0.0/MyMod-server-win-x64.zip"]
                }
              ]
            }
          ]
        }
      },
      "variant": "",
      "explicit": true,
      "ref": "github.com/example/MyMod",
      "commit": "0123456789abcdef0123456789abcdef01234567",
      "files": ["mods/MyMod/MyMod.dll", "mods/MyMod/manifest.json"]
    }
  ]
}
```

## Workspaces of lip v0.39.x

The state file in lip v0.39.x (also format 4) named the side `platform` and the platform `runtime`, both at the root and in the entries of each recorded `manifest`. lip does not read these state files: if the root or any entry contains `runtime`, or has `platform` set to `"server"` or `"client"`, the command fails with a message instructing you to rename `platform` to `side` and `runtime` to `platform`. lip does not migrate this automatically; you must rename both keys at the root and in every entry of every `manifest`. For workspaces from lip v0.37.0 and earlier, see [Workspaces of lip v0.x](#workspaces-of-lip-v0-x).

## Workspaces of linux-x64

Earlier versions of lip used `--platform` to install packages for platforms other than `win-x64`. lip reads a state file with the platform `linux-x64` as `win-x64`, treating `github.com/LiteLDev/bds` as its Linux server variant `github.com/LiteLDev/bds#linux`, and records it as such on the next `setup`, `install`, `uninstall`, or `update`. If a `linux-x64` state file records any other package, every command that reads it fails with a message naming that package; reinstall the packages in a new workspace instead. A state file that records any other platform fails `setup`, `install`, `uninstall`, `update`, and `run`.

## Workspaces of lip v0.x

Workspaces from lip v0.37.0 and earlier have a format version 3 `tooth_lock.json` in their root instead of a state file. lip migrates this file automatically:

*   `lip list` reads it as the equivalent state file without modifying it.
*   The next `lip setup`, `lip install`, `lip uninstall`, or `lip update` writes that state file to `.lip/state.json` and deletes `tooth_lock.json`.

Each package retains its variant, whether it was explicitly installed, and the files it owns under the workspace. Its `ref` becomes its package ID (with `#<variant>`), and its `commit` is looked up from the `v<version>` tag in its repository. If that commit cannot be looked up, the command fails. Packages whose `tooth.json` lip cannot read for the workspace environment are dropped.

## See also

- [Files](../reference/files.md#the-lip-directory): the other entries in `.lip`.
- [`lip list`](../reference/commands/list.md)
- [lip.toml](lip_toml.md): the package file stored in `manifest`.
- [How lip works](how_lip_works.md): operations and the journal.
