# lip errors

## Installing packages with lip keeps failing (interrupted downloads, corrupted cache and so on). How do I clear the lip cache, and where is it?

Run `lip cache clean` to delete lip's cache and then install again (the old command `lip cache purge` no longer exists). On Windows, the cache directory is `%LOCALAPPDATA%\lip\Cache`; on other systems, it is `$XDG_CACHE_HOME/lip` (default `~/.cache/lip`), regardless of which drive the server or lip is installed on. In lip's own interface, you can also click "Clear cache" on the settings page. Because the cache only holds content that can be downloaded again, clearing it does not affect the server, installed packages, or configuration. Do not clear it while another lip command is downloading. Newer versions of lip automatically replace cache files that are not valid ZIPs, so manual cleanup is rarely needed now.

To find the cause of a failure, check the error and hint in the command output and the full report under `.lip/logs/` in the server directory. Set configuration options with `lip config set <key> <value>` and list them with `lip config list` (for example, the GitHub proxy `github_proxy`).

*Applies to: lip 0.41.x*

## `lip install` fails when the package name has an `https://` prefix (such as `https://github.com/...`). What should I do?

Do not include a protocol prefix in the identifier of a Git repository package. Remove `https://` and check the case and spelling of the path, for example `lip install github.com/LiteLDev/LegacyScriptEngine`. lip treats any argument starting with `https://` as "the download URL of a ZIP archive"; because a repository web address is not a ZIP, the installation fails.

## Right-click updating an installed mod in LeviLauncher (a new version is shown) fails with `ERR_NO_UPDATE_SOURCE` (no update source available). What should I do?

`ERR_NO_UPDATE_SOURCE` is an error raised by LeviLauncher itself. The launcher cannot map the installed mod to a single lip package in the mod catalog (either no package matches, or several match by name), or no target version is available, so it does not know where to update from. First, update LeviLauncher to the latest version. As a workaround, find the mod on the launcher's LeviMC mods (mod catalog) page and reinstall the new version directly.

*Applies to: LeviLauncher (including the lip-compatible package manager built into 1.1.0)*

## Installing LeviLamina with lip fails because dependencies cannot be fetched (for example the PreLoader package cannot be obtained). What should I do?

Access to GitHub most likely failed. First, check the `error:`/`hint:` lines printed by lip and the failure report under `.lip/logs/` to find the cause. If GitHub is slow or blocked, set a GitHub proxy with `lip config set github_proxy <proxy-address>` (the proxy must support git repositories), or use a network proxy: lip reads the terminal's `HTTPS_PROXY`/`HTTP_PROXY`/`ALL_PROXY` environment variables and falls back to the system proxy when they are not set (for example, in PowerShell run `$env:HTTPS_PROXY = "http://127.0.0.1:7890"` and then `lip install`). If you suspect the download cache is corrupted, run `lip cache clean` and retry (do not clean the cache while another lip command is downloading).

*Applies to: lip 0.40 and later (the new C# lip)*
