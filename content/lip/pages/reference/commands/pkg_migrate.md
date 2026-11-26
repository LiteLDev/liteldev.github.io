# lip pkg migrate

Migrate a lip v0.x `tooth.json` in the current directory to `lip.toml`.

## Synopsis

```
lip pkg migrate [-h | --help]
```

## Description

`lip pkg migrate` converts the [package file](../../concepts/lip_toml.md) in the current working directory from `tooth.json` to `lip.toml`, and then deletes `tooth.json`. Run it in the root directory of your package repository.

It fails without changing anything when:

- `lip.toml` already exists;
- `tooth.json` is missing; or
- `tooth.json` is not in format version 1, 2, or 3, or lip cannot read it.

How fields are converted:

- `tooth` becomes `id`. `version` and `info` are copied; if `info.avatar_url` starts with `https://`, it becomes `info.logo`, and is dropped otherwise.
- Each label becomes a variant. For each platform (RID) a label applies to, its variants are merged just as lip v0.37.0 merged them: into a client entry when the merged variants depend on `github.com/LiteLDev/LeviLamina#client`, into a server entry when they depend on another variant of `github.com/LiteLDev/LeviLamina`, or into an entry for each side when they do not depend on LeviLamina.
- LeviLamina has had no `client` variant since 26.60.8, its first version with a `lip.toml`; instead, its `""` variant has an entry for each side. Accordingly, a dependency on `github.com/LiteLDev/LeviLamina#client` (or `#client_<y>`) whose range allows a version of at least 26.60.8 is rewritten to `github.com/LiteLDev/LeviLamina` (or `#<y>`), with its range narrowed to versions of at least 26.60.8, unless the entry already has that dependency. A range that allows no such version is kept as is. Any client entries under the `client` (or `client_<y>`) label that now depend on LeviLamina then move to the `""` (or `<y>`) variant, unless that variant already has a client entry for the same platform. Each of these changes is reported as a warning.
- Each entry is converted the same way lip reads a `tooth.json` in an [earlier format](../../concepts/lip_toml.md#earlier-formats): `dependencies` becomes `deps`; assets keep their `type` and `urls`, and their `placements` become `place`; `preserve_files` becomes `preserve`; `remove_files` becomes `purge`; and scripts become `hooks`. Placements and patterns that are not valid in `lip.toml` are omitted.
- A platform whose merged variants have an asset of type `tar`, `tgz`, or `uncompressed` gets no entry, because `lip.toml` does not support these asset types.
- [Templates](../../concepts/lip_toml.md#templates) are preserved. A value such as `https://example.com/v{{version}}/tool.zip`, or `$(version)` in formats 1 and 2, is written as the same template, with `{{tooth}}` (`$(path)` in formats 1 and 2) renamed to `{{id}}`. A template that would render to a different value in `lip.toml` is written as its rendered value instead.

### Questions

`lip.toml` does not support platform patterns: every entry names a single platform. When a required value is missing or invalid, lip prompts for it in the terminal until you provide a valid answer. It asks for:

- the platforms (RIDs) that a pattern such as `win-*` stands for;
- the platforms that a non-RID `platform` value, such as `windows/amd64`, stands for;
- the platforms that variants without a `platform` apply to; and
- a replacement for any invalid dependency range.

If standard input or standard error is not a terminal, the command fails instead, names the value it would have asked for, and changes nothing.

### Warnings

Anything that is dropped or converted with a different meaning is reported as a warning naming the source field in its format 3 form. Warnings do not cause the command to fail.

Treat the result as a starting point and review it before publishing; [Migrating packages](../../authors/migrating_packages.md) lists what to check.

`lip pkg migrate` is not a workspace operation.

## Options

| Option | Description |
| --- | --- |
| `-h`, `--help` | Write the help and exit. |

## Output

`lip pkg migrate` writes nothing to standard output. Questions, warnings, and the final summary line are written to standard error.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | `lip.toml` was written and `tooth.json` was deleted, with or without warnings. |
| not `0` | Usage error; `lip.toml` already exists; `tooth.json` is missing or unreadable; or lip cannot prompt for a required value. Nothing was changed. |

## Examples

```shell
cd MyTool
lip pkg migrate
```

## See also

- [Migrating packages](../../authors/migrating_packages.md)
- [Develop Tools](../../interface/tools.md): **Migrate tooth.json** in the interface.
- [lip.toml](../../concepts/lip_toml.md#earlier-formats)
