# Using and configuring lip

## Configuration

### My mod is already listed in the catalog, but after I changed the package description file (`tooth.json` / `lip.toml`) in the repository, the catalog information never updates. Why?

The catalog reads the package file (`lip.toml`, or `tooth.json` only if there is none) at each version tag (`v<version>`). The name, description, tags, and other details shown in the list come from the package file of the latest version, not from the latest file on the default branch. If you change the repository content without publishing a new tag, the catalog does not update.

Instead, update `lip.toml` first (bump `version`), then publish a new version with a new tag (such as `v0.2.0`). The catalog rebuilds every hour, and the new tag will appear in the next build.

The README on the detail page also comes from the repository file at that version tag (`raw.githubusercontent.com/<author>/<repo>/v<version>/README.md`), so changing only the README on the default branch will not update it either. Only the Gallery (`docs/showcase/showcase.json` on the default branch) takes effect directly in the next build.

*Applies to: current LeviMC mod catalog (levimc.org/mods)*

### Do I need to commit compiled binaries to the source repository, or keep them in a separate repository, for a plugin published for lip?

No. In `lip.toml`, add an asset with `type = "mcmod"` (a LeviLamina mod ZIP) or `type = "zip"` to the variant entry, and point `urls` to a GitHub Release attachment, for example `https://github.com/<you>/my-mod/releases/download/v{{version}}/my-mod-server-windows-x64.zip`.

- A `zip` asset also needs `place` to specify where each file in the ZIP goes, for example `place = [{ src = "my-mod/", dest = "mods/my-mod/" }]`.
- An `mcmod` asset requires a `manifest.json` at the root of the ZIP and is extracted as a whole into `mods/<mod-name>/`.
- LeviLamina, LSE, and levilamina-mod-template all use `zip` with Release attachments; the template's release workflow automatically builds and uploads ZIPs such as `<repository-name>-server-windows-x64.zip`.

If GitHub is slow in mainland China, set a GitHub proxy with `lip config set github_proxy <URL>`, or use a system proxy environment variable such as `HTTPS_PROXY`.

*Applies to: lip 0.40 and later (lip.toml)*

### Downloads time out when lip installs a package (retrying many times and switching computers did not help). What should I do? How do I choose which folder lip installs into?

If GitHub is slow or blocked, set a GitHub proxy with `lip config set github_proxy <proxy-address>` or set an environment variable such as `HTTPS_PROXY` in the terminal to use a regular network proxy, and then retry. (Versions of lip after 0.41.1 append a `/` and the full GitHub URL to the proxy address, so the service's base URL alone is enough. In lip 0.41.1 and earlier, lip appends only `<owner>/<repo>/…`, so the proxy address must end with `https://github.com/` for services like gh-proxy.) You can test whether the proxy returns 200 with `curl "<proxy-address>/https://github.com/LiteLDev/lip.git/info/refs?service=git-upload-pack"`.

lip uses the current working directory as its workspace and has no option to specify another one. To install into a specific folder, `cd` to that directory first and then run the lip command.

*Applies to: lip 0.40 and later*

### After setting a GitHub proxy or another option for lip, how do I remove that setting?

Delete the setting with `lip config delete <KEY>` to restore the default—for example, `lip config delete github_proxy` (which uses no proxy and makes the interface ask again when it cannot reach GitHub). To explicitly specify "connect directly, do not ask again", set it to an empty value instead: `lip config set github_proxy ""` (in PowerShell, run `lip config set github_proxy --% ""`).

*Applies to: lip 0.40 and later (the "interface asks again" distinction only matters since the 0.41.0 interface)*

### After configuring a GitHub proxy for lip, downloading `bedrock-runtime-data` fails with HTTP 404 (`Failed to download from https://gh-proxy.com/LiteLDev/bedrock-runtime-data/releases/download/...`). How do I set the proxy correctly?

The proxy address is formatted incorrectly for your version of lip. Proxies like gh-proxy require the full GitHub URL after their own address (entering only `https://gh-proxy.com/` or `https://gh-proxy.org/` returns a 404). Because lip 0.41.1 and earlier append `<owner>/<repo>/...` directly to `github_proxy`, set the proxy as follows (versions after 0.41.1 add the full GitHub URL automatically, so the service's base URL alone works there, though this full form still works too):

```shell
lip config set github_proxy https://v4.gh-proxy.org/https://github.com/
```

Before setting the proxy, you can test it with the following command (200 means the proxy works):

```shell
curl.exe -s -o NUL -w "%{http_code}" "https://v4.gh-proxy.org/https://github.com/LiteLDev/LeviLamina.git/info/refs?service=git-upload-pack"
```

*Applies to: lip 0.40 and later*

### After a mod moves to a new GitHub repository, what must change for lip/the mod list to include it?

The package ID must match the repository path. Current packages use `lip.toml`; update its `id` field to the new repository path—for example, `id = "github.com/user/repo"` for `https://github.com/user/repo`. Otherwise, the commit is not recognized as a package and lip will not install it (meaning the mod list cannot install it properly either; to learn how a mod gets listed, see the "Publish your mod with lip" tutorial on levimc.org).

In the legacy `tooth.json` format, the corresponding field is `tooth` (you can migrate to `lip.toml` by running `lip pkg migrate`, which converts `tooth` to `id`). After making this change, publish a new release with a version tag `v<version>`, where `version` matches the tag's version.

*Applies to: lip.toml format 4 (current); for old tooth.json packages, change the `tooth` field likewise*

### When publishing a LeviLamina mod, can the LeviLamina dependency in the package file be pinned to one specific version? Where does the mod icon go?

Pinning a single version is not recommended: a full version without an operator (such as `"26.60.8"`) matches only that version, so as soon as LeviLamina releases a new version, your mod cannot be installed onto it through lip or the launcher and can only be added by hand. Use a version range instead, for example:

```toml
[variants."".deps]
"github.com/LiteLDev/LeviLamina" = "26.60.*"
```

or something like `">=26.60.0 <26.70.0"` (the syntax follows `SemVersionRange` from Semver for .NET, which supports `^`, `~`, `*`, `>=…<…`, and `||`).

Also, `id` must match the actual repository address. Set the mod icon in `logo` under `[info]` (the URL must start with `https://`), for example `logo = "https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/.../pack_icon.png"`. In the old `tooth.json` format, the equivalents are `dependencies` and `info.avatar_url`; when migrating, `avatar_url` becomes `info.logo`.

Note that a client entry (`side = "client"`) also depends on LeviLamina without `#client`; the official template uses `">26.60.6 <26.61.0"` (because in `tooth.json` versions up to 26.60.6, the default variant is the server build).

*Applies to: lip.toml format 4 (current); built-in package manager of LeviLauncher 1.1.0+; old tooth.json packages use `dependencies`/`avatar_url`*

## Features and versions

### I keep several mods/plugins in one repository and do not want to split it. Can I publish it to lip? Do I have to publish a GitHub Release to publish a lip package?

In lip, a package ID is the repository path (such as `github.com/user/repo`), and one repository is one package. However, a package can have several variants, which lets you keep multiple mods in one repository. Write one `[[variants."<name>"]]` entry per mod in `lip.toml` (where the name matches `^[a-z0-9_]+(/[a-z0-9_]+)?$`), and users can choose which one to install with `lip install github.com/user/repo#<name>` (this is how LSE's `#lua` and `#nodejs` engines work). Note that all variants in a repository share the same version tags. A version is a git tag named `v<SemVer>` (such as `v1.2.3`), and the `version` in `lip.toml` at that tag must match it. "Publishing" simply means pushing that tag; a GitHub Release is only needed to host the ZIP files referenced by the `urls` in the assets. If you really want each mod to have its own version, you can create a separate repository for each mod containing only a `lip.toml`, with the `urls` of its zip/mcmod assets pointing to files in the Releases of the main repository.

*Applies to: lip v0.40 and later (lip.toml format 4); in the old tooth.json, variants are distinguished by label*

### Can lip keep a dependency list in the current directory like npm, write to it on `lip install`, and so let people share a list as a "server pack"?

No. `lip install` only installs packages into the server folder and records them in `.lip/state.json`; it never writes to `lip.toml`, and lip has no workspace manifest like `package.json`. To install a set of packages at once (a server pack), you can create a package of your own and list all the required packages under `deps` in its `lip.toml` (similar to the default variant of LegacyScriptEngine, which depends on the quickjs and lua engine variants). Once you publish it, others can install everything with `lip install <your package>`. For the publishing tutorial, see <https://levimc.org/tutorials/develop/publish-a-package/>. Note that lip only manages the server; entries in `lip.toml` distinguish the two sides with `side = "server"`/`"client"`, and client mods are installed by launchers such as LeviLauncher reading the same packages.

*Applies to: current lip (the lip.toml era)*

### Can lip be used to download BDS?

Yes. lip's game package is `github.com/LiteLDev/bds`: `lip install github.com/LiteLDev/bds@<version>` installs the Windows server without a loader, and appending `#linux` installs the Linux version; you can also run `lip setup --game <version> --no-loader`. To install LeviLamina along with it, simply run `lip install LeviLamina`, which sets up the matching BDS automatically. If you only need to download the BDS files, you can also use the bdsdown tool (`lip install github.com/LiteLDev/bdsdown`).

*Applies to: lip v0.41.0 and later*

### Can lip install packages globally, like `npm -g`?

No. lip has no concept of global installation. Every command uses the current working directory (the server folder) as its workspace and installs packages there. Because there is no option to specify a different workspace, you must `cd` into the server directory before running a command.

*Applies to: all current versions of lip*

### After installing LeviLamina with lip, an extra package named loc (levilamina-loc) appeared. What is it? Do I need to install it manually?

This is `github.com/LiteLDev/levilamina-loc`, LeviLamina's language pack (localization), which installs its files to `mods/LeviLamina/lang/`. Because LeviLamina declares it as a dependency, lip installs it automatically alongside LeviLamina; you do not need to manage it manually.

*Applies to: all current LeviLamina versions (server and client)*

### Where is the lip source repository? Can the latest BDS downloaded from the official BDS site be used with LeviLamina directly?

The lip repository is at <https://github.com/LiteLDev/lip> (the old address, `futrime/lip`, redirects there). The latest BDS from the official site is often newer than the version LeviLamina supports and cannot be used directly; you must use the BDS version that matches LeviLamina. Using lip is recommended: run `lip install LeviLamina` to install the latest LeviLamina and the latest game version it supports, or run `lip setup --game <version> --loader levilamina` to specify a game version and let lip select the matching LeviLamina automatically.

### What format must GitHub version tags have when publishing a package for lip? What if a tag without `v` cannot be installed and does not appear in the catalog?

lip only treats a tag as a version if its name is `v` followed by an exact SemVer 2.0.0 version, such as `v1.1.0-rc.1` or `v2.0.0`. Tags like `1.1.0-rc.1`, `2.0.0`, `v1.2`, and `v01.2.3` are ignored by lip, the LeviMC mod catalog, and LeviLauncher. Also, `version` in `lip.toml` at that tag must match the tag without the `v` (for example, `version = "2.0.0"`).

To fix this, publish a new tag or Release with the `v` prefix. Because lip now queries repository tags directly over the git protocol without using a Go module proxy or caching the tag list, new tags take effect immediately and you no longer need to change GOPROXY.

In `lip.toml`, you can reference the version with `{{version}}` (for example, in an asset URL) and the package ID with `{{id}}`. Run `lip install github.com/<author>/<repo>@<version> --dry-run` to confirm that lip recognizes the version.

*Applies to: lip 0.40 and later (lip.toml format 4); the same tag rules apply to old tooth.json packages*

### Can lip install a local package? Can I test my own package locally during development without publishing it?

Yes. Pass `lip install` the path to a ZIP file or a folder with a `lip.toml` at its root, such as `lip install ./my-mod.zip` or `lip install ../MyTool` (a ZIP at an `https://` URL also works). Because lip detects ZIP files by content rather than file extension, you no longer need to rename them to `.tth`. To build the ZIP, compress the folder so that `lip.toml` is at the archive root; run `lip install <folder> --dry-run` to verify that lip can read it.

You can also test a package before pushing a tag by running `lip install github.com/user/repo@branch:main` or `@rev:<40-char-commit>`.

Manage all packages with lip, including LeviLamina itself. Files you add manually are not recorded in lip's state, so lip cannot use them to resolve dependencies.

*Applies to: lip 0.40 and later (the `lip pkg` commands require lip 0.41+)*
