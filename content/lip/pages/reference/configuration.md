# Configuration

This page lists every lip setting: the two configuration files, their format, each key's values, default, and effect, and how to change them.

## The two files

| Scope | File | Applies to | Changed with |
| --- | --- | --- | --- |
| User | `config.toml` in the [config directory](files.md#config-directory) | Everything lip does for you. | `lip config ...` |
| Workspace | `.lip/config.toml` in a workspace | That workspace. | `lip config ... --workspace`, run in the workspace |

The config directory is `%APPDATA%\lip` on Windows and `$XDG_CONFIG_HOME/lip` elsewhere (`~/.config/lip` by default).

Each scope has its own keys. A key from one scope is not valid in the other: for example, running `lip config get restart` without `--workspace` fails.

## Format

Each file is a [TOML 1.0](https://toml.io/en/v1.0.0) file with `format = 4` and the keys for its scope:

::: code-group

```toml [config.toml]
format = 4
github_proxy = "https://proxy.example.com/"
language = "zh-Hans"
```

```toml [.lip/config.toml]
format = 4
restart = "on-failure"
```

:::

- Any key omitted from the file uses its default. If the key has no default, it has **no value**.
- Keys that do not belong to the scope are ignored.
- A missing, unreadable, or invalid file is treated as empty, leaving every key in its scope absent. If any key has an unaccepted value, the entire file is invalid.
- lip writes a file only when you change a value. It writes `format` and the keys you have set, omitting keys at their default or without a value.
- Writing `.lip/config.toml` creates `.lip` if it does not exist. Because it takes no lock, it works while the server is running.

The files are described by the JSON Schemas [`config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/config.schema.toml) and [`workspace-config.schema.toml`](https://github.com/LiteLDev/lip/blob/main/protocol/workspace-config.schema.toml), written as TOML.

## User configuration

| Key | Values | Default |
| --- | --- | --- |
| `github_proxy` | A URI, or the empty string. | none |
| `language` | `en`, `zh-Hans` or `zh-Hant`. | none |

### github_proxy

Controls how lip sends its **GitHub requests**: HTTPS requests to `github.com`, or to any address ending with `.github.com` or `.githubusercontent.com`. These include git repositories, downloads, and lip releases and updates.

| Value | Effect |
| --- | --- |
| A URI, such as `https://proxy.example.com` | To request an address U, lip sends the request to the URI, followed by `/` (unless the URI already ends with one), followed by U: `https://proxy.example.com/https://github.com/…`. If a request through the proxy fails, lip sends it to U directly. If the URI ends with `/github.com` or `/https://github.com` (optionally followed by `/`), that ending is stripped. |
| The empty string (`lip config set github_proxy ""`) | lip sends requests directly to GitHub. |
| No value (`lip config delete github_proxy`) | lip sends requests directly to GitHub, and `github_proxy` is **not configured**. |

The last two options differ only in the interface: when `github_proxy` is not configured, the interface checks at startup whether it can reach GitHub, and asks you how to reach it if it cannot. When set to any value, including the empty string, it does not ask.

[`lip self-update`](commands/self_update.md) also reads the list of releases and downloads the update through this proxy.

### language

Sets the [interface](interface.md) language: English (`en`), Simplified Chinese (`zh-Hans`), or Traditional Chinese (`zh-Hant`).

With no value, the interface follows your system language: the display language on Windows, and the first of `LC_ALL`, `LC_MESSAGES`, and `LANG` that specifies a language elsewhere. If that language is neither English nor Chinese, the interface falls back to English.

`language` affects only the interface. Command messages and results are always in English.

## Workspace configuration

| Key | Values | Default |
| --- | --- | --- |
| `restart` | `never` or `on-failure`. | `never` |

### restart

Controls whether the workspace server restarts when it exits with a non-zero exit code (anything other than 0).

| Value | Effect |
| --- | --- |
| `never` | The server is not restarted. |
| `on-failure` | lip writes a message, waits 5 seconds, and starts the server again, up to 5 times within 10 minutes. A server that you asked to stop is not restarted. |

lip reads `restart` each time the server exits, so you can change it while the server is running. See [`lip run`](commands/run.md#restarting).

## Changing the configuration

To change settings from the command line, use [`lip config`](commands/config.md):

```shell
lip config list
lip config set github_proxy https://proxy.example.com/
lip config delete github_proxy
lip config set restart on-failure --workspace
```

If a key does not accept the given value, `lip config set` fails and changes nothing.

In the interface, the [Settings](../interface/settings.md) page edits the same files:

| In Settings | Key | Equivalent command |
| --- | --- | --- |
| Language | `language` | `lip config set language <value>`; **Follow system** is `lip config delete language`. |
| GitHub proxy | `github_proxy` | `lip config set github_proxy <URI>`; **Direct** sets an empty string; **Reset** is `lip config delete github_proxy`. |
| Auto restart | `restart` of the selected workspace | `lip config set restart on-failure --workspace` when on, or `never` when off. |

The interface also writes `github_proxy` when it asks how to reach GitHub: choosing a proxy sets the URI, **Connect directly** sets an empty string, and **Later** changes nothing.

You can also edit the files by hand. lip reads them whenever a command needs them.

## liprc.json

lip v0.x stored its configuration in `liprc.json` in the config directory. If the config directory has no `config.toml` but has a `liprc.json`, lip reads `github_proxy` from it, writes the setting to `config.toml`, and deletes `liprc.json`. This happens once, before the first command reads the configuration.

A [dry run](cli.md#dry-run) reads `liprc.json` the same way, but does not write `config.toml` and keeps `liprc.json`.

## See also

- [`lip config`](commands/config.md)
- [Configuring lip](../guides/configuration.md): a guide to the same topic.
- [Settings](../interface/settings.md) in the interface.
- [Files](files.md): where these files are located on each system.
