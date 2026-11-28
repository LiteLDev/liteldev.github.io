# Publish your mod with lip

By the end of this tutorial, your mod will have its first release on GitHub, and anyone will be able to install it on their server with a single command: `lip install github.com/<you>/my-mod`. You will describe the mod in `lip.toml`, let GitHub Actions build the release, verify that `lip` sees it, install it on your own server, and get it listed on [LeviMC Mods](https://levimc.org/mods/).

It takes about half an hour, most of which is spent waiting for the release build.

## What you need

- A mod in a public GitHub repository created from the mod template, which builds: [Your first LeviLamina mod](first-levilamina-mod.md). This tutorial calls the repository `github.com/<you>/my-mod`.
- `lip` and a server to test on: [Your first server](../server/first-server.md). This tutorial uses `D:\servers\survival`.
- Git, signed in to GitHub so that you can push.

::: warning The latest lip needed
The **Edit lip.toml** form on the **Develop Tools** page, which this tutorial uses, is available starting with the first release of lip after 0.41.1. Check your version with `lip -v`, and install the [latest release of lip](https://github.com/LiteLDev/lip/releases/latest) if needed.
:::

A **package** is anything `lip` can install. Its **package id** is its repository address without `https://`: `github.com/<you>/my-mod`. A **version** is a Git tag consisting of `v` plus the version number, such as `v0.1.0`, at which `lip.toml` specifies that same version. There is no upload step: publishing simply means pushing that tag.

## 1. Fill in lip.toml

The template includes `lip.toml`, the file that tells `lip` what to install. Open it and update the following fields, leaving the rest unchanged.

```toml
format = 4
id = "github.com/<you>/my-mod"          # the package id: your repository
version = "0.1.0"                       # the version you are about to release, without "v"

[info]                                  # shown on LeviMC Mods and in LeviLauncher; lip ignores it
name = "My Mod"
description = "Says hello."
tags = ["utility"]
logo = "https://avatars.githubusercontent.com/u/<your user id>"
```

Then, in both `[[variants.""]]` entries (one with `side = "server"` and one with `side = "client"`):

- In `deps`, set the range of LeviLamina versions the mod works with. The server entry takes a range such as `"26.60.*"`, matching the version you pinned in `xmake.lua`. Keep the comment and the format of the client range.
- In `urls`, replace `levilamina-mod-template` with the name of **your repository**: the release workflow uploads `<repository>-server-windows-x64.zip` and `<repository>-client-windows-x64.zip`.
- In `place`, replace `my-mod` in both `src` and `dest` with the **target name** from `xmake.lua`: each ZIP file contains the `<target>/` folder, which is extracted to `mods/<target>/`.

If your mod is for the server only, delete the entire client entry: the `[[variants.""]]` section with `side = "client"`, along with the `deps` and `assets` below it.

::: tip `{{id}}` and `{{version}}`
Every string in `lip.toml` is a template. `{{version}}` expands to the `version` field above, so a new release only requires updating `version`. `{{id}}` expands to the package id.
:::

::: details A repository without lip.toml, or with tooth.json
If your repository was not created from the template, run `lip pkg init` in its root directory: it prompts for the package id and writes a minimal `lip.toml` for you to fill in as shown above. Alternatively, start `lip` in the repository root and select **Create lip.toml** on the **Develop Tools** page. This opens the same form used in step 2 and writes the file when you save. To convert a `tooth.json` file from lip v0.x, run `lip pkg migrate`; see [Migrating packages](https://levimc.org/lip/authors/migrating_packages.html).
:::

## 2. Check that lip reads it

1. Start `lip` in the repository folder. This folder becomes the `lip` workspace, which is shown in the top bar.
2. In the sidebar, open **Develop Tools**, select **Edit lip.toml**, and press `Enter`.
3. `lip` opens `lip.toml` in a form that validates every value as you type, and previews the complete file as `lip` reads it with all templates expanded. It also checks your dependencies, such as LeviLamina, online. You should see **✓ Every value is valid.** at the top. Any value marked with **✗** explains what is wrong: fix it in the form and press `Ctrl+S` to save, or edit the file directly. If the file is not valid TOML, or a key has a value of the wrong type, `lip` displays **lip.toml cannot be edited here. Fix it by hand first:** along with the error.
4. Verify that the names in each **URL** match your repository and the ZIP files uploaded by the release workflow (step 1).
5. Press `Esc` to close the form.

## 3. Write the changelog

The release workflow copies the latest section of `CHANGELOG.md` into the release notes. Add a section for this version in the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format:

```md
## [0.1.0] - 2026-11-16

### Added

- The `/hello` command.
```

Commit and push everything:

```shell
git add -A
git commit -m "Release 0.1.0"
git push
```

## 4. Create the release

1. On your repository page on GitHub, open **Releases** → **Draft a new release**.
2. Under **Choose a tag**, type `v0.1.0` and choose **Create new tag: v0.1.0 on publish**. The target is your default branch, with the commit you just pushed.
3. Give the release a title, such as `0.1.0`, and press **Publish release**.
4. Open the **Actions** tab. A workflow run has started for the release: it builds the server and client mods and then uploads them. Wait a few minutes until it shows a green tick.
5. Open the release again. Under **Assets**, you should see two files—`my-mod-server-windows-x64.zip` and `my-mod-client-windows-x64.zip`—and your changelog as the release notes.

::: warning The tag must match `version`
The tag must be `v` followed by a full [semantic version](https://semver.org/): `v0.1.0`, not `0.1.0` or `v0.1`. At the tag `v0.1.0`, `lip.toml` must contain `version = "0.1.0"`, or `lip`, LeviMC Mods, and LeviLauncher will skip the tag.
:::

## 5. Check that lip sees the version

1. Stop your server. If the mod is still in `mods\my-mod` from the previous tutorial, delete that folder so that you test only what `lip` installs.
2. In the server folder, check what `lip` would install without changing anything:

   ```shell
   cd D:\servers\survival
   lip install github.com/<you>/my-mod --dry-run
   ```

   You should see lines starting with `Dry run:`, one of which would install your mod at version `0.1.0`. If `lip` finds no version, check that the tag and `version` match (step 4).

## 6. Install it like your users will

1. In the server folder, install your package:

   ```shell
   lip install github.com/<you>/my-mod
   lip list
   ```

   `lip list` should show `github.com/<you>/my-mod@0.1.0`.

2. Start the server. You should see `Hello from my first mod!` again, now coming from the files `lip` downloaded.

Once the mod is listed (step 7), players can install the client build of the same package with LeviLauncher: see [Play with mods on Windows](../play/play-with-mods.md).

## 7. Get listed on LeviMC Mods

[LeviMC Mods](https://levimc.org/mods/) is the catalog shown in `lip`'s **Marketplace** page and LeviLauncher. It is built from a list of repositories in [`content/mods/repos.txt`](https://github.com/LiteLDev/liteldev.github.io/blob/main/content/mods/repos.txt) in the levimc.org repository.

You usually do not need to do anything: every hour, a bot searches GitHub for repositories with a `lip.toml` and a version tag that `lip` can read, and opens a pull request to add them to the list. Once a maintainer merges the pull request, the mod appears a few minutes later when the site is rebuilt.

To get listed sooner, open that pull request yourself: edit [`content/mods/repos.txt`](https://github.com/LiteLDev/liteldev.github.io/blob/main/content/mods/repos.txt) on GitHub and add a line with `<you>/my-mod`.

The catalog lists a package when:

- its latest version depends on LeviLamina, directly or through other packages;
- it places files in `mods/` (or `plugins/`, or where the game loads add-ons from);
- the repository is not a GitHub template, and its name does not end in `-template`, `-example`, `-demo`, `-sample`, or `-test`.

You will then find your mod at `https://levimc.org/mods/github.com/<you>/my-mod/`, complete with its name, description, logo, tags, and installation command.

## Releasing the next version

1. Bump `version` in `lip.toml` (for example, to `0.2.0`) and add a corresponding section to `CHANGELOG.md`. Commit and push.
2. Create the `v0.2.0` release as in step 4.
3. On a server, run `lip update github.com/<you>/my-mod` to install it.

## What you have now

- A GitHub release of your mod, built by GitHub Actions.
- A package that installs via `lip install github.com/<you>/my-mod`, along with its dependency on LeviLamina.
- Your mod on LeviMC Mods, once it is added to the list.

## Next steps

- Every field of `lip.toml` (dependencies, variants, files to keep or delete, hooks): [lip.toml](https://levimc.org/lip/concepts/lip_toml.html).
- Commands for package authors: [`lip pkg init`](https://levimc.org/lip/reference/commands/pkg_init.html), [`lip pkg migrate`](https://levimc.org/lip/reference/commands/pkg_migrate.html).
- Installing a branch or a commit before releasing it: [Managing packages](https://levimc.org/lip/guides/managing_packages.html).
- Creating and editing `lip.toml`, and migrating a `tooth.json`, in the `lip` interface: [Develop Tools](https://levimc.org/lip/interface/tools.html).
- How servers install your package: [Install mods on your server](../server/install-mods.md).
