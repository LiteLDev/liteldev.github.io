# lip.toml

This page describes every field of `lip.toml`, so that you can read any package's package file and write your own. For a walk-through, see [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/).

A lip package is an archive with a **package file**, `lip.toml`, at its root. `lip.toml` names the package, gives its version, and describes what lip installs for each variant, side, and platform: the dependencies, the files to place, the mod to install, and the commands to run. For the normative definition, see [lip.toml(5)](https://github.com/LiteLDev/lip/blob/main/protocol/lip.toml.md) in the protocol.

`lip.toml` is a [TOML 1.0](https://toml.io/en/v1.0.0) file of format 4, described by the JSON Schema [`lip.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/lip.schema.toml) (written in TOML). lip also reads the `tooth.json` file of lip v0.x packages (formats 1 to 3); see [Earlier Formats](#earlier-formats).

## Archives

A package lives in an **archive**, a tree of files and directories with `lip.toml` at its root:

- a **git archive**: a commit of a git repository, usually the commit of a version tag. It includes only regular files and directories (no symbolic links or submodules);
- a **ZIP archive**: a ZIP file, either downloaded over HTTPS or on your disk. Whether a file is a ZIP archive depends only on its content, not its name. Its entries must be regular files or directories with `/`-separated paths that do not start with `/` or contain a `..` segment or `\`;
- a **directory archive**: a directory on your disk whose contents form the archive. The names of its files and directories must not contain `\`.

One package has no archive and no `lip.toml`: the game, `github.com/LiteLDev/bds`. lip defines its package file itself from the list of server builds; see [`lip setup`](../reference/commands/setup.md#game-versions-and-builds) and [The server files](../reference/files.md#the-server-files).

## Example

A mod published as a ZIP file attached to each GitHub release, for the server and the client on Windows x64:

```toml
format = 4
id = "github.com/example/MyMod"
version = "1.0.0"

[info]
name = "My Mod"
description = "A short description"
tags = ["utility"]

[[variants.""]]
side = "server"
platform = "win-x64"
preserve = ["mods/MyMod/config/"]

[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/example/MyLib" = "^0.3.0"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-server-win-x64.zip"]

[[variants.""]]
side = "client"
platform = "win-x64"
preserve = ["mods/MyMod/config/"]

[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/example/MyLib" = "^0.3.0"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-client-win-x64.zip"]
```

Versions and ranges are strings, so they are always quoted. Quote any key that contains characters other than ASCII letters, digits, `_`, and `-`, such as a package id in `deps` or the default variant `""`: `[[variants.""]]` adds an entry to the default variant.

## Fields

`lip.toml` must not contain a date-time, date, or time, or the float `inf` or `nan`. Keys not described here are ignored.

### Top-Level

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `int` | Yes | Must be `4`. |
| `id` | `string` | Yes | The **package id**, a valid [Go module path](https://go.dev/ref/mod#module-path), e.g. `github.com/user/repo`. Compared ignoring ASCII case. |
| `version` | `string` | Yes | The package version, a [SemVer 2.0.0](https://semver.org/) version without a leading `v`. |
| `info` | `object` | No | Information for people. See [Info](#info). |
| `variants` | `object` | Yes | Maps each variant name to its entries. See [Variants](#variants). |

For a package in a git repository, `id` must match the repository path: the `lip.toml` of `https://github.com/user/repo.git` must have `id = "github.com/user/repo"`. At a version tag `v<version>`, `version` must equal the tag version. Otherwise, the commit is not a package, and lip does not install it.

### Info

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Display name. |
| `description` | `string` | Short description. |
| `tags` | `string[]` | Tags. See [Recommended tags](#recommended-tags). |
| `logo` | `string` | URL of the logo image. Must start with `https://`, and the response—directly or after redirects—must be the image. |

lip does not use `info`.

#### Recommended tags

`info.tags` helps people find your package in mod listings such as the Marketplace page of the interface and [LeviMC Mods](https://levimc.org/mods/); lip itself ignores tags. These listings display the tags below first, with translated names, and let users filter by them. Write the IDs in lowercase as shown here, and add any other tags you like:

```toml
[info]
tags = ["management", "economy"]
```

| Tag | Name | Use it for |
| --- | --- | --- |
| `library` | Library / API | A library or API that other mods depend on, e.g. events, forms, or exported functions. |
| `utility` | Utility | Everyday tools for players, e.g. inventory helpers, info displays, tooltips, and recipe viewers. |
| `management` | Server management | Running a server, e.g. backups, bans, whitelists, logins, commands, and land claims. |
| `game-mechanics` | Game mechanics | Changes to gameplay, e.g. vanilla-plus features and achievements. |
| `adventure` | Content & adventure | New content to explore, e.g. world generation, terrain, and biomes. |
| `visual` | Visual & HUD | What players see, e.g. HUDs, sidebars, shaders, replays, and recording. |
| `economy` | Economy | Money, shops, and trading. |
| `teleport` | Teleport | Teleport commands, homes, warps, and waystones. |
| `anticheat` | Anti-cheat | Detecting and stopping cheats, e.g. anti-xray. |
| `optimization` | Optimization | Better performance, e.g. entity and item cleaners. |
| `bugfix` | Bug fixes | Fixes for game bugs. |
| `technology` | Technical & redstone | Redstone, pistons, and automation. |
| `protocol` | Protocol & multi-version | The network protocol, e.g. letting clients on different game versions join. |

You do not need to tag the side or platform, or indicate that the package is a LeviLamina mod; the entries and `deps` already provide that information.

### Variants

`variants` maps each **variant** name to a non-empty array of **entries**. The default variant is `""`; other names must match `^[a-z0-9_]+(/[a-z0-9_]+)?$`, such as `lua` or `quickjs`. Users select a variant by appending `#<variant>` to the source, as in `lip install github.com/LiteLDev/LegacyScriptEngine#lua`; a source without `#` selects `""`.

Each entry applies to a single **side** and **platform**. When lip resolves a package, it selects the entry in the chosen variant whose `side` and `platform` match the workspace [environment](#environment). There are no wildcards: a package that supports multiple platforms must have a separate entry for each. If the variant has no matching entry, the package is not a candidate for that environment. Within a variant, no two entries may share the same `side` and `platform`.

### Entry

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `side` | `string` | Yes | `"server"` or `"client"`. |
| `platform` | `string` | Yes | A [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog), e.g. `win-x64`. |
| `deps` | `object` | No | See [Dependencies](#dependencies). |
| `assets` | `array` | No | See [Assets](#assets). |
| `preserve` | `string[]` | No | [Globs](#globs) of files to keep: existing matching files are neither overwritten on install nor deleted on uninstall. |
| `purge` | `string[]` | No | [Globs](#globs) of extra paths to delete on uninstall. Matching directories are deleted along with all their contents. |
| `hooks` | `object` | No | See [Hooks](#hooks). |

### Dependencies

`deps` maps `<package id>` or `<package id>#<variant>` to a version range:

```toml
[variants."".deps]
"github.com/LiteLDev/LeviLamina" = ">=1.0.0 <2.0.0"
"github.com/LiteLDev/LegacyScriptEngine#lua" = "^0.9.0"
```

For each dependency, lip looks at the repository's version tags and installs a version (and variant) that falls within the range and has an entry for the current environment. A package installed from a Git ref, such as `@branch:main`, also satisfies a dependency on the same package ID and variant if its version is within the range and the repository has an installable version for that dependency.

Version ranges follow the syntax and semantics of `SemVersionRange.Parse` from [Semver for .NET 3.0.0](https://github.com/WalkerCodeRanger/semver/tree/v3.0.0) with its default options, such as `^1.2.0`, `~1.2.0`, `>=1.0.0 <2.0.0`, `1.2.*`, or `>=1.0.0 || 0.9.0`. A bare version such as `1.2.3` matches only that exact version.

### Assets

`assets` specifies where the package's files come from. Each asset has a `type`:

| Type | Fields | Description |
| --- | --- | --- |
| `self` | `place` (optional) | The archive containing the `lip.toml` itself, e.g. the repository at the tag. Any `urls` field is ignored. |
| `zip` | `urls`, `place` (optional) | A ZIP archive downloaded over HTTPS. |
| `mcmod` | `urls` | A ZIP archive downloaded over HTTPS that contains a LeviLamina mod; it takes no `place` field. See [Mods](#mods). |

`urls` is a non-empty array of HTTPS URLs pointing to the same file, tried in order. An entry may have at most one `mcmod` asset. Assets are extracted in order; if two assets or placements write to the same path, the later one overwrites the earlier one.

### Placements

Each member of `place` is a placement, with `src` and `dest`, that writes files from the asset's archive into the workspace.
`src` is a path in the archive, and `dest` is a path relative to the workspace. Both are `/`-separated
and must not start with `/` or a drive letter, or contain `//`, a `..` segment, or `\`. `src`
determines the form of a placement:

- **Glob form**: `src` contains `*`, `?`, or `[`. Every file matching the glob is written under
  `dest` (`""` or ending with `/`), keeping its path relative to the leading wildcard-free segments of `src`.
  A glob matching no file writes nothing.
- **Directory form**: `src` is `""` or ends with `/`. Every file below `src` is written under
  `dest` (`""` or ending with `/`), at its path relative to `src`. `src` must contain at least one
  file.
- **File form**: otherwise. The file `src` is written to `dest`, which must not end with `/`.
  The file must exist.

```toml
[[variants."".assets]]
type = "zip"
urls = ["https://example.com/tool-1.0.0-win-x64.zip"]
place = [
  { src = "bin/", dest = "tools/" },
  { src = "README.md", dest = "tools/README.md" },
  { src = "plugins/*.dll", dest = "tools/plugins/" },
]
```

The package's root `lip.toml` is never written.

lip refuses to write some paths: `.lip` and everything below it, a file owned by another installed
package, and a path with a segment that contains `:` or ends in `.` or a space (see
[File names](../reference/files.md#file-names)). The installation then fails.

### Globs

`preserve`, `purge`, and the glob form of placements use POSIX `fnmatch` patterns,
matched segment by segment: `*` matches any characters except `/` (including a leading `.`), `?`
matches one character except `/`, and `[...]` matches one character from a set. A `**` segment matches zero or more
segments; a pattern ending with `/` matches a directory and everything below it. There is no
escape character. A glob must not be empty, start with `/`, or contain `//` or `\`.

`preserve` and `purge` are matched against paths relative to the workspace, even for
a mod: write `mods/MyMod/config/`, not `config/`. `purge` never matches `mods`
or `.lip` at the workspace root, nor anything below `.lip`, and a path below `mods`
does not match merely because `mods` does: `mods/` and `*/` delete nothing below `mods`.

### Hooks

| Field | Type | Description |
| --- | --- | --- |
| `pre_install` | `string[]` | Commands to run before the files are written. |
| `post_install` | `string[]` | Commands to run after the files are written. |
| `pre_uninstall` | `string[]` | Commands to run before the files are deleted. |
| `post_uninstall` | `string[]` | Commands to run after the files are deleted. |

Commands run in the workspace root with lip's environment variables. When the platform of the workspace [environment](#environment) is a
Windows platform, they run as `cmd /s /c "<command>"` so that `cmd` runs the command as written; otherwise, they run as `sh -c <command>`
with `sh` found through `PATH`. On a non-Windows system, a Windows platform runs them
through Wine (see [Linux and macOS](../guides/linux_macos.md)), where a command
containing `"` does not reach `cmd` as written. On Windows, when the Visual C++ runtime is installed
only for the user, lip puts its directory first in `PATH` for the commands (see
[System dependencies](internals.md#system-dependencies)). A command that exits with a non-zero code fails the operation. If an operation fails, lip undoes its file
changes, but not what hook commands have already done, so hook commands should be safe to run again.

## Templates

Every string in `lip.toml`, other than a key, is a template in the
[Scriban language](https://github.com/scriban/scriban/blob/7.5.0/site/docs/language.md), as in the
`tooth.json` of lip v0.37.0. lip renders each template before reading the file, so everything described
above—such as the version check and the validation of URLs and globs—applies to the rendered
values. The variables are the top-level fields as written: `{{version}}`, `{{id}}`, `{{format}}`,
`{{info.name}}`, `{{variants}}`, and any other top-level key you add. Each variable holds the field as
written, before its own templates are rendered.

```toml
version = "1.2.3"

[[variants."".assets]]
type = "mcmod"
urls = ["https://github.com/example/MyMod/releases/download/v{{version}}/MyMod-{{version}}.zip"]
```

A template may use any Scriban expression, e.g. `{{version | string.replace "." "_"}}`. An undefined
variable renders as nothing. If a template does not parse or fails to render, such as
`{{ if }}`, the archive is not a package. To write `{{` literally, write `{{ "{{" }}`.
The [state file](state_file.md) records the package file with its templates rendered.

## Mods

An entry is a **mod** if it has an `mcmod` asset; otherwise, the package is a **file package**, which only places files.

The `mcmod` asset archive must contain the mod's LeviLamina `manifest.json` at its root—a JSON object whose `name` matches `^[A-Za-z0-9][A-Za-z0-9._-]*$`. That `name` is the **mod
name**. lip extracts the entire archive into `mods/<mod name>/`, preserving its paths.

lip reads only the `name` field in `manifest.json` to name the mod directory. It neither checks nor modifies anything else in the file: `manifest.json` is written to the mod directory as-is, just like every other file in the archive. You are responsible for keeping its `dependencies` in sync with the entry's `deps`. If `manifest.json` is missing or lacks a valid `name`, the installation fails before making any changes.

Two mods with the same mod name (ignoring ASCII case) cannot be installed in one workspace.

An entry can include other assets alongside its `mcmod` asset, such as a `zip` asset that places files outside `mods/`.

## Identity

An installed package's **identity** is its package ID, followed by `#<variant>` when the variant is not `""` (for example, `github.com/LiteLDev/LegacyScriptEngine#lua`). A workspace can hold at most one package of each identity. [`lip list`](../reference/commands/list.md) displays identities, and [`lip uninstall`](../reference/commands/uninstall.md) accepts them.

The identity comes from the package's `id`, not from its installation source: a ZIP file whose `lip.toml` sets `id = "github.com/user/repo"` shares the same identity as the package from that repository, so the two cannot be installed together.

## Environment

A workspace's environment is a `(side, platform)` pair:

- **side**: `server` or `client`, indicating which side of the game the workspace is for. lip manages only server workspaces, so it always uses `server`. Client workspaces are managed by launchers such as LeviLauncher; lip rejects any workspace whose [state file](state_file.md) records `client`.
- **platform**: a [.NET RID](https://learn.microsoft.com/dotnet/core/rid-catalog), which is always `win-x64` regardless of the system lip runs on. On non-Windows systems, lip runs workspace programs through Wine (see [Linux and macOS](../guides/linux_macos.md)). The Linux server is not a separate platform, but rather the `linux` variant of `github.com/LiteLDev/bds`, whose entry targets `win-x64`. A state file from an earlier version of lip that records `linux-x64` is treated as `win-x64` (see [State file](state_file.md#workspaces-of-linux-x64)). Any platform starting with `win` is a **Windows platform**.

## Earlier Formats

In lip v0.39, `lip.toml` (also format 4) named the side `platform` and the platform `runtime`, e.g., `platform = "server"` and `runtime = "win-x64"`. lip does not read such entries: if an entry contains `runtime`, or its `platform` is `"server"` or `"client"`, lip rejects the archive as a package and prompts you to rename `platform` to `side` and `runtime` to `platform`. Rename those two keys in each entry and leave everything else unchanged.

Packages for lip v0.37.0 and earlier have a `tooth.json` of format version 1, 2, or 3 instead of `lip.toml`. lip still installs these packages, but never writes them; convert yours to `lip.toml` with [`lip pkg migrate`](../reference/commands/pkg_migrate.md). If an archive contains `lip.toml`, lip reads it regardless of any `tooth.json` also present, and ignores any `tooth.json` of another format.

Formats 1 and 2 are first read as format 3, just as in lip v0.37.0. A format 3 `tooth.json` is then converted completely into a package file for the workspace's environment. lip uses only this converted file: it is what lip resolves, installs, and records in the [state file](state_file.md). Nothing of format 3 remains at install time.

- `tooth` becomes `id`. `version` becomes the package version: at a version tag, this is the tag version regardless of what the `version` in `tooth.json` says, and that `version` otherwise.
- `info` is kept, except that `avatar_url` becomes `logo` if it starts with `https://` and is dropped otherwise.
- For each label, variants with that label whose `platform` is empty or matches the environment's platform (in `tooth.json`, `platform` is a RID pattern such as `win-*`) are merged, just as lip v0.37.0 merged them, into one entry for the environment's side and platform. A label with no matching variants produces no variant.
- `dependencies` becomes `deps` unchanged.
- Each asset keeps its `type` and `urls`, and its `placements` become `place` (see below). An asset of type `tar`, `tgz`, or `uncompressed`, which `lip.toml` does not support, leaves the label without a variant for the environment.
- `preserve_files` becomes `preserve`: `\` is replaced with `/`, and any pattern without `/` is prefixed with `**/`, so `config.json` becomes `**/config.json`.
- `remove_files` becomes `purge`: `\` is replaced with `/`, and any pattern that does not end with `/` is also added with a trailing `/`, so `logs` becomes `logs` and `logs/`.
- Scripts become `hooks`: `pre_install` stays `pre_install`, `install` followed by `post_install` becomes `post_install`, `pre_uninstall` followed by `uninstall` becomes `pre_uninstall`, and `post_uninstall` stays `post_uninstall`.

A placement `{ "type": ..., "src": ..., "dest": ... }` becomes a member of `place` after replacing `\` with `/` and removing empty and `.` segments from `src` and `dest`:

| Placement | `place` member |
| --- | --- |
| `type` `dir` | `src` and `dest`, each followed by `/` unless empty: the directory form. |
| `type` `file`, `src` containing `*`, `?` or `[` | `src`, and `dest` followed by `/` unless empty: the glob form. |
| `type` `file`, any other `src` | `src` and `dest`: the file form. |

Any converted glob or placement that is invalid in a package file is omitted. Placements are then applied just as they are for `lip.toml`: for example, a missing file now fails the installation, and the package's `tooth.json` is never written.

A package in an earlier format is always a file package. Its identity follows the same rule, e.g., `github.com/LiteLDev/LegacyScriptEngine#lua`.

The format 3 schema is [`manifest.schema.json`](https://github.com/LiteLDev/lip/blob/v0.37.0/schemas/manifest.schema.json) from lip v0.37.0, which documented the format in its [Package Manifest](https://github.com/LiteLDev/lip/blob/v0.37.0/docs/concepts/package_manifest.md) page:

```json
{
  "format_version": 3,
  "format_uuid": "289f771f-2c9a-4d73-9f3f-8492495a924d",
  "tooth": "github.com/user/repo",
  "version": "1.0.0",
  "info": { "name": "My Package", "description": "A short description" },
  "variants": [
    {
      "label": "",
      "platform": "win-x64",
      "dependencies": { "github.com/other/package": ">=1.0.0" },
      "assets": [
        {
          "type": "self",
          "placements": [{ "type": "dir", "src": "bin/", "dest": "bin/" }]
        }
      ],
      "preserve_files": ["config/*.json"],
      "remove_files": ["temp/"],
      "scripts": { "post_install": ["echo installed"] }
    }
  ]
}
```

## See also

- [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/) and [Migrating packages](../authors/migrating_packages.md)
- [`lip pkg init`](../reference/commands/pkg_init.md), and [Develop Tools](../interface/tools.md): a form in the interface that writes `lip.toml` and checks every value as you type.
- [State file](state_file.md): where the package file of each installed package is recorded.
- [Internals](internals.md): how lip resolves sources and versions.
