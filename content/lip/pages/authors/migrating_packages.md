# Migrating packages

This guide shows you how to turn a package of lip v0.x, which has a `tooth.json`, into a package with a `lip.toml`, and what to check before you publish it.

Packages for lip v0.37.0 and earlier have a `tooth.json` of format version 1, 2 or 3. Packages now have a `lip.toml` instead (see [lip.toml](../concepts/lip_toml.md)). lip still installs packages with such a `tooth.json`, but new versions of your package should use `lip.toml`. The `lip pkg migrate` command helps you convert it.

## Using `lip pkg migrate`

Run `lip pkg migrate` without arguments in the root directory of your package repository, the one that contains `tooth.json`:

```sh
cd MyTool
lip pkg migrate
git add lip.toml tooth.json
git commit -m "Migrate tooth.json to lip.toml"
```

It writes `lip.toml` converted from `tooth.json`, then deletes `tooth.json`. In the interface, **Migrate tooth.json** on the [Develop Tools](../interface/tools.md) page does the same for the selected workspace, and asks its questions in the interface. When `lip.toml` already exists, or `tooth.json` is missing or is not a `tooth.json` of format 1, 2 or 3 that lip can read, the command fails and changes nothing.

### Questions

`lip.toml` has no RID patterns: every entry names one platform, a RID. When the result needs a value that the old file does not provide, lip asks for it on the terminal and asks again until the answer is valid:

-   the platforms (RIDs) a `platform` pattern of `tooth.json` such as `win-*` stands for, as a comma-separated list (each must match the pattern);
-   the platforms (RIDs) a `platform` of `tooth.json` that is not a RID, such as `windows/amd64`, stands for, as a comma-separated list;
-   the platforms (RIDs) that variants without a `platform` apply to, when there are such variants.

When standard input or standard error is not a terminal (in CI, for example), `lip pkg migrate` fails instead, naming the value it would ask for, and changes nothing.

### Warnings

Everything that is dropped, or converted with another meaning, is printed as a warning that names the field it comes from, such as `variants (label '', win-x64).assets[1]`. Fields of `tooth.json` format 1 and 2 files are named as in format 3, which lip converts them to first. Warnings do not make the command fail; review them, fix `lip.toml` where needed, and commit.

## What Changes

`format` is set to `4`, `tooth` becomes `id`, and `version` and `info` are copied, except that `info.avatar_url` becomes `info.logo` if it starts with `https://` and is dropped with a warning otherwise. Variants are rewritten as follows:

-   Each label becomes a variant of the same name; the empty label becomes the variant `""`.
-   For each platform a label applies to (the `platform` of its variants, with patterns and non-RID values expanded to the RIDs you gave), the label's variants that apply to that platform are merged as lip v0.37.0 merged them, producing one entry with that `platform`. Its `side` is `client` if the merged variants depend on `github.com/LiteLDev/LeviLamina#client`, and `server` if they depend on another variant of `github.com/LiteLDev/LeviLamina`; without a dependency on LeviLamina, the result becomes two entries, one for each side.
-   Since 26.60.8, its first version with a `lip.toml`, LeviLamina has no `client` variant: its `""` variant includes the client build as well. A dependency on `github.com/LiteLDev/LeviLamina#client` (or `#client_<y>`) whose range allows a version of at least 26.60.8 becomes one on `github.com/LiteLDev/LeviLamina` (or `#<y>`), with its range narrowed to versions of at least 26.60.8; a range that allows no such version is kept, as is the dependency when the entry already depends on `github.com/LiteLDev/LeviLamina` (or `#<y>`). Then a client entry of the label `client` (or `client_<y>`) whose dependency changed in this way moves to the variant `""` (or `<y>`), unless that variant already has a client entry for the same platform. Each change is noted with a warning.
-   `dependencies` become `deps`, keeping their ranges. If a range is not valid now, the command prompts for one on the terminal until a valid range is entered; without a terminal, the command fails and changes nothing.
-   Each asset keeps its `type` and `urls`, and its `placements` become `place`, converted in the same way lip reads a `tooth.json` of an [earlier format](../concepts/lip_toml.md#earlier-formats): after `\` is replaced with `/` and empty and `.` segments are removed, a `dir` placement takes the directory form (`src` and `dest` ending with `/`, or `""`), a `file` placement whose `src` contains `*`, `?`, or `[` takes the glob form (`dest` ending with `/`, or `""`), and any other `file` placement takes the file form. Any placement that is invalid in `lip.toml` is omitted with a warning.
-   `lip.toml` has no `tar`, `tgz`, or `uncompressed` asset types. A platform whose merged variants use such an asset gets no entry, with a warning, just as lip installs no entry for that platform.
-   `preserve_files` becomes `preserve` and `remove_files` becomes `purge`, with `\` replaced by `/`; a `preserve_files` pattern without `/` gets a `**/` prefix, and a `remove_files` pattern without a trailing `/` is also written with one (see [Limitations](#limitations)).
-   Scripts become `hooks`: `pre_install`, `post_install` (`install` first, then `post_install`), `pre_uninstall` (`pre_uninstall`, then `uninstall`), and `post_uninstall`.
-   Other empty values outside `info` are omitted.

## Limitations

`lip pkg migrate` is a helper, not a guarantee. Always review its output.

-   At a tag, `lip.toml` must use the tag version as its `version` and the repository path as its `id`. lip v0.37.0 installed a `tooth.json` that broke these rules; check yours before publishing.
-   Placements are converted by the rules above without inspecting the files they place, and then behave according to `lip.toml` rules: a `file` placement whose `src` is a pattern preserves the subdirectories of matched files (whereas `tooth.json` placed them by file name only), and a placement of a missing file fails the installation (whereas `tooth.json` skipped it). Check such placements.
-   A `preserve_files` pattern without `/` matched the file name in any directory; it becomes `**/<pattern>`. A `remove_files` pattern also removed matching directories, so it is also written with a trailing `/`. Patterns that are not valid globs, such as those starting with `/`, are dropped.
-   Format 1 and 2 dependencies whose ranges cannot be read in format 3 (e.g. `2.16.x`) were already ignored when installing the `tooth.json`; they are reported so you can add them by hand.
-   Scripts other than the install and uninstall hooks (such as `pre_pack` or custom scripts), along with `prerequisites` from format 2, have no equivalent and are dropped.
-   A migrated package is a file package that places files where the old `tooth.json` did. If your package is a LeviLamina mod, consider publishing it as an `mcmod` asset instead (see [lip.toml: Mods](../concepts/lip_toml.md#mods)), which installs to `mods/<name>/`.
-   Dependencies on other packages that still use `tooth.json` continue to work, because lip still installs them.

Tags count as versions only when named exactly `v<SemVer>` (e.g. `v1.2.3`). Tags such as `v1.2` are not versions.

## After migrating

1. Read the warnings and fix `lip.toml` where needed.
2. Check the result: run `lip` in the folder and select **Edit lip.toml** on the [Develop Tools](../interface/tools.md) page. The form highlights any invalid values, and before saving, it previews what the package would install on a server.

3. Install the package on a test server, as described in [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/).
4. Commit your changes and publish a new version with a tag, as described in [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/).

Previously published versions keep their `tooth.json`, and lip continues to install them.

## See also

- [`lip pkg migrate`](../reference/commands/pkg_migrate.md)
- [lip.toml](../concepts/lip_toml.md#earlier-formats): how lip reads a `tooth.json`.
- [Publish your mod with lip](https://levimc.org/tutorials/develop/publish-a-package/)
- [Develop Tools](../interface/tools.md): the same action in the interface, along with a form that validates `lip.toml`.
