# Configuration

After reading this page, you will be able to view and change lip's settings with `lip config`, and you will know what to do when GitHub is slow or blocked in your region. In the interface, the same settings are on the [Settings](../interface/settings.md) page.

## Two sets of settings

lip has only a few settings. They come in two sets, called scopes:

| Scope | Applies to | Keys | Command |
| --- | --- | --- | --- |
| **User** | You, in every workspace | `github_proxy`, `language` | `lip config …` |
| **Workspace** | One server folder | `restart` | `lip config … --workspace` |

With `--workspace`, a command applies to your current folder. Without it, the command applies to your user settings, regardless of where you run it.

## Read and change settings

[`lip config`](../reference/commands/config.md) has four subcommands.

**See every setting** in a scope:

```sh
lip config list
```

```text
┌──────────────┬───────────┐
│ Key          │ Value     │
├──────────────┼───────────┤
│ github_proxy │ (not set) │
│ language     │ (not set) │
└──────────────┴───────────┘
```

```sh
lip config list --workspace
```

```text
┌─────────┬───────┐
│ Key     │ Value │
├─────────┼───────┤
│ restart │ never │
└─────────┴───────┘
```

`(not set)` means the key has no value. `(empty)` means it is set to an empty string, which is a distinct option for `github_proxy` (see below).

**See one setting:**

```sh
lip config get language
```

**Change a setting:**

```sh
lip config set language zh-Hans
```

```text
✓ Config key 'language' set to 'zh-Hans'.
```

If a value is not valid for the key, lip rejects it and changes nothing.

**Remove a setting** to reset it to its default:

```sh
lip config delete language
```

```text
✓ Config key 'language' deleted.
```

`lip config get` and `lip config list` accept `--json` for use in scripts. Using a key with the wrong scope fails with an error message telling you whether to add or remove `--workspace`.

## The keys

For a complete description of both files, see [Configuration files](../reference/configuration.md).

### github_proxy

Scope: user. Value: a URL, or empty. Default: not set.

Controls how lip reaches GitHub, where most packages are downloaded from.

| Value | lip |
| --- | --- |
| not set | connects to GitHub directly. The interface may prompt you to choose a proxy if it cannot reach GitHub. |
| empty | connects to GitHub directly, and the interface never prompts you. |
| a URL | sends GitHub requests through that URL first, falling back to a direct connection if the proxy fails. |

See [When GitHub is slow or blocked](#when-github-is-slow-or-blocked).

### language

Scope: user. Value: `en`, `zh-Hans` or `zh-Hant`. Default: not set.

Sets the interface language: English, Simplified Chinese, or Traditional Chinese. If not set, the interface matches your system language, defaulting to English if your system is set to neither English nor Chinese.

```sh
lip config set language zh-Hant
```

This setting affects only the interface. Terminal output from commands is always in English.

### restart

Scope: workspace. Value: `never` or `on-failure`. Default: `never`.

Controls whether lip restarts the workspace's server when it crashes (that is, when it exits with a code other than 0).

```sh
lip config set restart on-failure --workspace
```

With `on-failure`, lip waits 5 seconds before restarting the server, up to 5 times within 10 minutes. See [Restarting](../reference/commands/run.md#restarting).

## When GitHub is slow or blocked

lip downloads most packages from GitHub. If GitHub is slow or unreachable, installations fail with:

```text
hint: lip could not reach the server. Check your network connection. If GitHub is slow or blocked where you are, set a GitHub proxy with 'lip config set github_proxy <URL>'.
```

### What a GitHub proxy is

A GitHub proxy is a web service that fetches content from GitHub on your behalf. When you give lip the proxy's URL, lip prepends that URL and a `/` to the full GitHub URL it is requesting.

With `github_proxy` set to `https://proxy.example.com`, a request for

```text
https://github.com/LiteLDev/lip.git/info/refs
```

is sent to

```text
https://proxy.example.com/https://github.com/LiteLDev/lip.git/info/refs
```

Set this to the base URL of the proxy service itself—the part that goes in front of a GitHub link when you paste it into a browser. A URL ending in `/github.com` or `/https://github.com`, which older versions of lip required, still works because lip strips that suffix automatically. lip 0.41.1 and earlier require that suffix.

Three things to keep in mind:

- **Only GitHub goes through it.** Requests to `github.com` and any domain ending in `.github.com` or `.githubusercontent.com` (such as `raw.githubusercontent.com`) use the proxy. This includes repositories, files, and updates to lip itself. Downloads from other sites, such as the game from minecraft.net, bypass the proxy.
- **lip falls back.** If a request through the proxy fails, lip retries it directly against GitHub.
- **lip does not recommend a proxy.** A proxy can see and modify everything you download through it. Use one operated by you or someone you trust.

### Set a proxy

```sh
lip config set github_proxy https://proxy.example.com
```

Replace the URL with your proxy's address. All subsequent commands will use this setting.

### Test a proxy

lip checks whether it can reach GitHub by fetching the list of lip versions. You can make the same request through your proxy to test it. A working proxy returns `200`:

::: code-group

```powershell [Windows]
curl.exe -s -o NUL -w "%{http_code}" "https://proxy.example.com/https://github.com/LiteLDev/lip.git/info/refs?service=git-upload-pack"
```

```sh [Linux / macOS]
curl -s -o /dev/null -w "%{http_code}\n" "https://proxy.example.com/https://github.com/LiteLDev/lip.git/info/refs?service=git-upload-pack"
```

:::

The interface runs this test automatically: when you enter a proxy on the Settings page, it tests the address before saving it. See [Settings](../interface/settings.md).

Because lip falls back to connecting to GitHub directly, a successful command does not prove that your proxy works. If installations are still slow after you set a proxy, test the proxy directly.

### Remove a proxy

To stop using the proxy and have the interface ask again when GitHub cannot be reached:

```sh
lip config delete github_proxy
```

To stop using the proxy and tell lip that you connect directly, so that the interface does not ask, set it to an empty value:

::: code-group

```powershell [Windows]
lip config set github_proxy --% ""
```

```sh [Linux / macOS]
lip config set github_proxy ""
```

:::

PowerShell requires `--%`; without it, Windows PowerShell drops the empty value. In the interface, select "Connect directly" for the GitHub proxy on the Settings page.

### Your system's proxy

`github_proxy` is not a standard HTTP proxy. If your network uses an HTTP proxy, lip uses it automatically without its own setting:

- lip reads the `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, and `NO_PROXY` environment variables (or their lowercase equivalents) from the terminal where you run it.
- If those variables are not set, it uses your system proxy.

::: code-group

```powershell [Windows]
$env:HTTPS_PROXY = "http://proxy.example.com:8080"
lip install LegacyScriptEngine#lua
```

```sh [Linux / macOS]
HTTPS_PROXY=http://proxy.example.com:8080 lip install LegacyScriptEngine#lua
```

:::

Replace the address with your proxy's address. This proxy applies to all downloads, not just GitHub.

## Where the settings are kept

| Scope | File |
| --- | --- |
| User, on Windows | `%APPDATA%\lip\config.toml` |
| User, on Linux and macOS | `$XDG_CONFIG_HOME/lip/config.toml`, by default `~/.config/lip/config.toml` |
| Workspace | `.lip/config.toml` in the server folder |

Both are small text files that you can edit by hand. If a file is missing or unreadable, lip treats it as having no settings. See [Configuration files](../reference/configuration.md) for the file format, and [Files and directories](../reference/files.md) for a list of all files that lip uses.

Workspace settings travel with the server folder when you move or copy it. User settings do not.
