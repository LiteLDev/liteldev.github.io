# Internals

This page explains how lip finds package versions, talks to git repositories without `git`, caches data, resolves versions, and prepares the system for the server. It is intended for curious users and package authors. For a high-level overview, see [How lip works](how_lip_works.md); for the exact specification, see the [lip protocol](https://github.com/LiteLDev/lip/blob/main/protocol/README.md).

## The steps of an operation

`lip setup`, `lip install`, `lip uninstall`, and `lip update` all run the same steps:

1. **Lock and recover.** Acquire the workspace lock, `.lip/lock`, and finish or undo any interrupted operation.
2. **State file.** Read the installed packages from `.lip/state.json`. If this file does not exist, the workspace has no packages—unless it has a `tooth_lock.json` from lip v0.x, which lip reads instead.
3. **Environment.** Select packages for the `server` side and the `win-x64` platform, regardless of the host system.
4. **Resolve.** Turn each source into a sequence of candidates: the versions it names, from newest to oldest, each paired with the entry of the requested variant for the environment.
5. **Solve.** Choose one candidate for each request and each dependency so that every package appears only once and no two mods share a name.
6. **Plan.** Plan to uninstall packages leaving the set (in reverse installation order), then install packages entering it (dependencies first). Planning downloads every archive and asset to be written and checks everything that could fail: file ownership, `preserve`, paths, the `src` of each placement, each mod's name in its `manifest.json`, and whether `mods` is a link.
7. **Prepare the system**, when Windows programs will run. See [System dependencies](#system-dependencies).
8. **Apply.** Create `mods` if it is missing, then run the planned hook commands and file changes, recording each in the journal first.
9. **State file.** Save the state file once after every step succeeds.

A failure before step 8 leaves the workspace untouched. If step 8 fails or is interrupted with Ctrl+C, lip undoes every change made during the operation, except for changes made by hook commands.

A dry run stops after step 6; in step 1, it takes no lock and performs no recovery.

### One operation at a time

An operation holds `.lip/lock` exclusively: opened without sharing on Windows, and locked with an exclusive `flock` on Linux and macOS. The lock file is never deleted. A second operation on the same workspace does not wait; it fails immediately with:

```text
lip cannot take the workspace lock '<workspace>/.lip/lock': most likely another lip command is changing the workspace '<workspace>'. Wait for the other lip command to finish, then try again. If no other lip command is running, a program may be holding the lock file open: close it, then try again.
```

`lip run` acquires the same lock only briefly to recover any interrupted operation before starting the server. While the server is running, it holds the server lock, `.lip/server.lock`, in the same way. Starting a second server in the same workspace fails with:

```text
A server of the workspace '<workspace>' is already running: another lip run, the interface of lip or the daemon of lip runs it, and holds the server lock '<workspace>/.lip/server.lock'. Stop that server first, or attach to it with 'lip run --managed' when it is a managed server.
```

The two locks are independent. If a process is killed, the operating system closes its file handles and releases its locks, so a lock is never left behind.

## Package resolution

lip has no central registry or module proxy. A package ID such as `github.com/user/repo` maps directly to the git repository `https://github.com/user/repo.git`.

- **Versions.** A repository's versions are its tags named `v` followed by an exact [SemVer 2.0.0](https://semver.org/) version, such as `v1.2.3`. Other tags are ignored, including loose versions like `v1.2` or `v01.2.3`. An annotated tag resolves to the commit it points to.
- **Refs.** A source with a ref has only one candidate. `@branch:<name>` and `@tag:<name>` are looked up once per command. `@rev:<commit>` requires no lookup because the commit is fetched directly by ID. Short commit IDs are rejected: resolving them would require downloading the full repository history, which lip never does.
- **Lazy candidates.** Repository candidates are generated on demand, from newest to oldest. lip inspects only the versions that the solver actually evaluates.
- **What makes a candidate.** A version is a valid candidate only if its `lip.toml` is valid, its `id` matches the repository path, its `version` matches the tag version, and the requested variant has an entry for the target environment. Otherwise, lip moves on to the next version and records the reason in case no candidate matches.
- **Without a tag version.** For a branch, a commit, or a non-version tag, the package version is taken from the `version` field in its `lip.toml`.
- **The game** is the one exception. `github.com/LiteLDev/bds` is not a repository; lip generates its packages from the list of server builds at `https://levimc.org/api/v4/mc/versions/` and downloads the server from minecraft.net.
- **Other sources.** A URL points to a single ZIP archive downloaded over HTTPS. A local path points to a single ZIP file or folder. Each produces one candidate.

A version can be installed only while its tag exists in the repository. Only public repositories reachable over HTTPS are supported. Package IDs are compared case-insensitively for ASCII letters.

## The git client

lip communicates with git repositories using its own client for version 2 of git's smart HTTP protocol. **The `git` program is not needed and is never run.**

- **Listing tags.** lip queries the server's refs with `ls-refs`, restricted to `refs/tags/v`. For a branch or tag ref, it requests the exact `refs/heads/<name>` or `refs/tags/<name>`.
- **Reading a `lip.toml`.** lip fetches only the trees of the target commit—a shallow, partial fetch (`deepen 1`, `filter blob:none`) that transfers no file contents. It then fetches that single file, or `tooth.json` if there is no `lip.toml`. Inspecting a version therefore takes only a few kilobytes, no matter how large the repository is.
- **Installing.** lip fetches file contents only when installing a package, and only for the files that the package places from its own archive.
- **Integrity.** Every git object is verified against its object ID.
- **Proxy.** When `github_proxy` is set to a URL, requests for `github.com` repositories go through the proxy first—formed by the proxy URL, `/`, and the full request address—and fall back to `github.com` directly if the proxy fails. File downloads from GitHub addresses (`github.com`, `*.github.com`, `*.githubusercontent.com`) follow the same rule. See [When GitHub is slow or blocked](../guides/configuration.md#when-github-is-slow-or-blocked).

The server must support these features, as GitHub does. A proxy that only forwards file downloads cannot serve repositories.

## The cache

The cache directory stores files downloaded over HTTPS: ZIP archives from URL sources, package assets, and the game.

- **Entries.** Each download is saved as `http-<hash>`, where the hash is the SHA-256 of the URL specified by the package, regardless of any proxy used.
- **Writing.** Downloads are written to a `.tmp` file in the cache directory and renamed into place once complete. Any existing entry is therefore complete, allowing multiple lip processes to share the cache safely.
- **Repair.** If lip expects a ZIP archive and the cached file is not a valid ZIP, it deletes the entry and re-downloads it once.
- **Not cached.** Nothing from git repositories is cached on disk. Tag lists and trees are held in memory for the duration of a single command and fetched fresh on the next run, so moved tags take effect immediately.
- **No checksums of content.** lip verifies that downloaded ZIP archives and assets are valid ZIP files, but it does not record or compare checksums of their contents.

`lip cache clean` deletes the entire directory. A dry run downloads whatever it needs to verify, but writes nothing to the cache. lip never writes to the system's temporary directory.

## Solving

Solving selects which candidate to install for each requested package and dependency.

- **Pinning.** Installed packages are initially locked to their current versions, reconstructed from the state file without network access. If the request cannot be satisfied, lip solves again while holding only the explicitly requested packages in place, allowing dependencies to change versions. It tries the installed versions of those dependencies first, so only the ones that must change do.
- **Updating.** `lip update` uses this second pass from the start, ensuring that an installed dependency never holds back the newest version of a package being updated.
- **Preference.** Earlier candidates take precedence, favoring the newest version in a repository.
- **The game and the loader are fixed.** `lip install` and `lip update` solve around the installed game and loader. If no solution fits, the error reports their versions and points to `lip setup`. Running setup solves against the new game and loader, dropping a mod only if no version of it is compatible with them.
- **Order.** Dependencies are installed before the packages that depend on them. Packages in a dependency cycle are ordered by identity.
- **Clean-up.** Dependencies no longer needed by any explicitly requested package are uninstalled.
- **Same package.** An installed package is replaced only if the resolved candidate differs in identity, version, or commit. Packages from a URL or local path have no commit.
- **Installing again from the state file.** When lip needs to restore the files of an installed package, it uses the package file recorded in the state file rather than resolving it anew: for a repository, it fetches from the recorded commit; otherwise, it fetches from the archive that its source currently points to.

## Package file validation

[`lip.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/lip.schema.toml) describes `lip.toml`, [`config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/config.schema.toml) describes the user settings, [`workspace-config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/workspace-config.schema.toml) describes the workspace settings, and [`state.schema.json`](https://github.com/LiteLDev/lip/blob/main/protocol/state.schema.json) describes the state file.

- **Beyond the schema**, lip checks the requirements in [lip.toml(5)](https://github.com/LiteLDev/lip/blob/main/protocol/lip.toml.md): a valid package ID and version, valid dependency keys and ranges, valid sides and platforms, no two entries of a variant for the same side and platform, at most one `mcmod` asset per entry, and valid globs. An archive with an invalid `lip.toml` is not a package. It produces no candidate, and lip reports why.
- **Files of lip v0.x.** If an archive has no `lip.toml`, lip reads its `tooth.json` (format 1, 2, or 3) and converts it completely into a package file during resolution. The same installer therefore handles every package. A `tooth.json` at a version tag is installed with the tag's version, regardless of what its own `version` field says. The first time lip works with `tooth_lock.json` or `liprc.json`, it automatically converts them to `.lip/state.json` and `config.toml`. See [lip-compatibility(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-compatibility.md).

For the file format, see [lip.toml](lip_toml.md).

## Workspace state and the journal

For each installed package, the [state file](state_file.md) (`.lip/state.json`) records whether you requested it, the package file it was installed with, its source, its commit (if it came from a repository), and the files it owns.

Three kinds of files make each operation all-or-nothing:

- **The journal**, `.lip/journal`. lip records each change here and flushes it to disk before making the change. Because paths in the journal are relative to the workspace, moving or copying a workspace carries any interrupted operation along with it.
- **Backups.** Before an operation replaces or deletes a file, lip renames it to `.<name>.bak` in the same directory, or `.<name>.bak1`, `.<name>.bak2`, and so on if that name is already taken. On Windows, the backup file is also marked as hidden.
- **The staged state file.** lip writes the new state to `.lip/state.json.tmp` and renames it over `.lip/state.json`.

When an operation succeeds, lip marks the journal as committed, renames the staged state file into place, deletes the backups and any directories emptied by the operation, and deletes the journal. If a backup cannot be deleted because a program has it open, lip leaves it in place and names it in a warning.

When an operation fails or is cancelled, lip walks the journal backward, deleting what it created and renaming each backup to its original name.

If lip is killed, the journal remains on disk. The next operation or `lip run` reads the journal after acquiring the workspace lock. A journal with a commit mark is completed; one without a commit mark is undone. If a step cannot be undone yet, lip rewrites the journal with the remaining steps, and the command fails until the rollback can finish.

[journal(5)](https://github.com/LiteLDev/lip/blob/main/protocol/journal.md) and [lip-workspace(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-workspace.md) specify these formats so that other programs can interoperate with them.

## System dependencies

The programs in a workspace—package hook commands and the Windows server—have two system dependencies, both of which lip installs itself:

- **Wine**, on Linux and macOS. Each version of lip pins one Wine build for Linux on x64 from [Kron4ek/Wine-Builds](https://github.com/Kron4ek/Wine-Builds) and one for macOS from [Gcenx/macOS_Wine_builds](https://github.com/Gcenx/macOS_Wine_builds), which runs under Rosetta 2 on arm64. lip downloads the build once and extracts it into `wine/` in the data directory, where all workspaces share it. lip never runs any other `wine`.
- **The Microsoft Visual C++ runtime** for x64 (the Visual C++ Redistributable), on Windows. It counts as installed system-wide when the registry has `Installed` = 1 under `HKLM\SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64`. On Windows, it also counts as installed for the current user when its files—the runtime DLLs that Microsoft lets an application bundle (`msvcp140*.dll`, `vcruntime140*.dll`, `concrt140.dll`, and `vccorlib140.dll`)—have been fully extracted into `vc-runtime\14.44.35211` in the data directory. If it is installed neither way, lip on Windows downloads `Microsoft.VC.14.44.17.14.CRT.Redist.X64.base.vsix` from Microsoft and extracts those DLLs into that directory as the user running lip, without administrator privileges or a User Account Control prompt. When the runtime is installed for the user rather than system-wide, lip puts that directory first in the `PATH` for the server and hook commands. On Linux and macOS, lip does not install it: Wine includes its own Visual C++ runtime, which runs the server.

How lip keeps this safe:

- **Pinned downloads.** Each file's URL and SHA-256 hash are built into lip. If a download's SHA-256 does not match, lip deletes it without extracting or running anything.
- **Never half installed.** Wine and, on Windows, the Visual C++ runtime are extracted into a `.tmp` directory and then renamed into place. An interrupted build is never run, and interrupted runtime files are never used.
- **One at a time.** Concurrent lip processes that install dependencies wait for each other using the `lock` file in the data directory.
- **Before the workspace changes.** lip prepares the system before any operation that runs hook commands starts modifying the workspace, during `lip setup` of a Windows build, and before `lip run` starts a Windows server. A failure at this stage leaves the workspace unchanged.

The Linux server needs neither dependency. Once everything is installed, preparing the system takes only a check of the Wine directory, or on Windows a single registry lookup and a check of the runtime directory.

Through Wine, lip runs a hook command as `wine cmd /s /c <command>` and the server as `wine` with the absolute path to the server file. Unless you set them yourself, lip sets `WINEPREFIX` to `.lip/wine` in the workspace, `WINEDEBUG` to `-all`, and `WINEDLLOVERRIDES` to `mscoree,mshtml=;winemac.drv,winex11.drv=d`. See [Linux and macOS](../guides/linux_macos.md).

## The daemon

Except for `lip daemon` commands, the user's daemon runs every command and the interface. The daemon is a `lip` process started with the single argument `--daemon`, and the `lip` process you start acts as its client.

1. **Connect.** On Windows, the client connects through the named pipe `\\.\pipe\lip-<SID>`, which only your user can open. On Linux and macOS, it connects through the socket `$XDG_RUNTIME_DIR/lip/daemon.sock` (or `daemon.sock` in the state directory if `XDG_RUNTIME_DIR` is not set), created with mode `0600` in a directory of mode `0700`.
2. **Start.** If nothing is listening, the client starts the daemon from its own executable, detached from the terminal, and connects once the daemon is listening. If two clients do this at the same time, they still end up with one daemon: the second cannot create the endpoint and exits.
3. **Replace.** If the running daemon is from another version or executable (for example, after `lip self-update`), the client asks it to exit and starts a new one. However, if the daemon is running a command or a managed server, it stays running. The client then runs the command itself, except for `lip run --managed`, which the old daemon runs.
4. **Send.** The client sends the command along with its folder, its environment variables, whether its standard streams are terminals, and the terminal's size and colours. The daemon runs the command using these settings. Commands from different clients run side by side, each with its own folder, environment, proxy, and failure report.
5. **Relay.** The daemon reads the client's input only when the command needs it, and sends back the output written by the command and its programs. Signals received by the client are forwarded to the daemon. The client exits with the command's exit code.

The interface works the same way. The daemon draws it, while the client writes that output to the terminal and forwards your keystrokes and the terminal size.

Programs run by the daemon, including the server, do not run in your terminal session. Their output reaches lip through pipes rather than a terminal.

The daemon exits after 10 minutes with no connections and no managed server, after `lip self-update` replaces lip, or when you run `lip daemon stop`. For the exact rules, see [lip-daemon(1)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-daemon.md).

## Notes on the specification

lip manages server workspaces only: the side is always `server`. Client workspaces are handled by launchers that implement the same protocol, such as LeviLauncher.

lip implements the [lip protocol](https://github.com/LiteLDev/lip/blob/main/protocol/README.md). If this page and the protocol disagree, the protocol takes precedence.
