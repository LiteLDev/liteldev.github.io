# Settings

This page explains how to change the interface language, configure how lip reaches GitHub, restart a server automatically after a crash, free disk space, and update lip.

## The page

To open the page, select **Settings** in the sidebar and press `Enter`.

![The Settings page: seven rows, each with its value, from Language to About. The line below the list says "The language of the interface."](/screenshots/en/settings-01-list.svg)

1. A setting and its current value. Use `↑` and `↓` to move between rows, and press `Enter` to change a setting or run its action.
2. A description of the selected row. If a value is too long to fit in its row, the full value appears here.

| Row | Does | Belongs to |
| --- | --- | --- |
| [Language](#language) | Sets the interface language. | You, on this computer. |
| [GitHub proxy](#github-proxy) | Configures how lip reaches GitHub. | You, on this computer. |
| [Auto restart](#auto-restart) | Restarts the server when it crashes. | The selected workspace. |
| [Clear cache](#clear-cache) | Deletes downloaded files. | You, on this computer. |
| [Check for updates](#updates) | Checks for a newer version of lip and installs it. | lip itself. |
| [Daemon](#daemon) | Shows the lip background process. | You, on this computer. |
| [About](#about) | Shows the version of lip. | lip itself. |

Changes on this page take effect immediately. There is no Save button.

## Language

The interface is available in English, Simplified Chinese, and Traditional Chinese.

1. Move to **Language** and press `Enter`.

   ![The Language dialog lists "Follow system", English, 简体中文 and 繁體中文.](/screenshots/en/settings-02-language.svg)

2. Select a language with `↑` and `↓`, then press `Enter`. The entire interface updates immediately without needing a restart.

   ![The Settings page in Simplified Chinese, just after the language was chosen. The row of the language reads 简体中文.](/screenshots/en/settings-23-language-changed.svg)

   1. The selected language.
   2. All interface text now appears in this language, including the sidebar and the bottom bar.

**Follow system** uses your operating system's language:

- On Windows, it uses your user account's display language.
- On other systems, it uses the first of the `LC_ALL`, `LC_MESSAGES`, or `LANG` environment variables that specifies a language.
- A Chinese locale for Taiwan, Hong Kong, or Macao, or one marked `Hant`, selects Traditional Chinese. Any other Chinese locale selects Simplified Chinese, and all other locales select English.

Only the interface itself is translated. Command output—including plan details, installation messages, and errors—remains in English regardless of the language setting.

::: details The same with a command
This setting corresponds to the `language` key in your configuration; see [Configuration](../reference/configuration.md).

```shell
lip config set language zh-Hans
lip config delete language
```

The valid values are `en`, `zh-Hans`, and `zh-Hant`. Deleting the key resets it to **Follow system**.
:::

## GitHub proxy

lip downloads LeviLamina and most mods from GitHub. If GitHub is slow or unreachable, you can use a **GitHub proxy**: a web address that lip prepends (followed by a `/`) to the GitHub URL of every download.

This row has one of three values:

| Value | Means |
| --- | --- |
| **Not set** | lip connects to GitHub directly. Each time the interface starts, lip checks in the background whether GitHub responds, and asks you what to do if it does not; see [When GitHub cannot be reached](home.md#when-github-cannot-be-reached). |
| **Direct** | lip connects to GitHub directly without checking or asking. |
| A URL | lip sends its GitHub requests through this proxy. If a request fails through the proxy, lip retries it directly with GitHub. |

Neither lip nor this documentation recommends a specific proxy. Only use a proxy you trust, as everything lip downloads from GitHub passes through it.

Pressing `Enter` on this row opens its actions:

![The menu "GitHub proxy" with three rows: "Set proxy…", "Connect directly" and "Reset". "Reset" is dimmed.](/screenshots/en/settings-06-proxy-menu.svg)

1. **Set proxy…** prompts for a proxy URL and tests it.
2. **Connect directly** sets the value to **Direct**. This option is dimmed if that is already the value.
3. **Reset** clears the setting, returning it to **Not set**. This option is dimmed when nothing is set.

### Set a proxy

1. Select **Set proxy…** and press `Enter`, then type or paste the proxy URL. The URL must start with `https://`. Enter only the address of the proxy service itself; lip appends the full GitHub address to it.

   ![The dialog "GitHub proxy" with the field "Proxy URL", which holds an example address that starts with https.](/screenshots/en/settings-07-proxy-url.svg)

2. Press `Enter`. lip tests the proxy by requesting lip's versions from GitHub through it, waiting up to 10 seconds. Press `Esc` to cancel the test and return to the URL.

   ![The dialog "Testing proxy" shows "Working…".](/screenshots/en/settings-08-testing.svg)

3. When GitHub responds through the proxy, lip saves the URL and displays **Saved.** The row now shows the URL.

   ![The row "GitHub proxy" now shows the address that was typed, and the bottom line ends with "Saved."](/screenshots/en/settings-09-proxy-saved.svg)

You must enter a valid URL. Without `https://` at the beginning, it is not accepted as one:

![The field holds old-proxy.example.com, and below it the message "Not a URL" is shown.](/screenshots/en/settings-10-not-a-url.svg)

### When the test fails

If GitHub does not respond through the proxy, lip explains why and does not save the URL yet.

![The dialog "Proxy failed" says "GitHub answered with the HTTP status 502." and has the buttons "Enter another", "Save anyway" and Cancel.](/screenshots/en/settings-11-proxy-failed.svg)

1. **Enter another** returns to the URL field with your entry intact so you can edit it.
2. **Save anyway** saves the proxy even though the test failed. Use this if you know the proxy works and only the test is being blocked.
3. **Cancel** (or `Esc`) leaves the setting unchanged, keeping its previous value.

The failure reason is shown in English. An HTTP status like 502 or 404 means the proxy responded, but not as GitHub would; a timeout means nothing responded within 10 seconds. For more details, see [Troubleshooting](../guides/troubleshooting.md).

### Connect directly, or reset

Use **Connect directly** if your network can reach GitHub reliably. lip will stop testing the connection and asking for a proxy.

![The row "GitHub proxy" shows "Direct", and the bottom line ends with "Saved."](/screenshots/en/settings-12-direct.svg)

**Reset** restores the setting to **Not set**: lip connects directly for now, and checks the connection again the next time the interface starts.

::: details The same with a command
This setting is stored under the `github_proxy` key in your configuration; see [Configuration](../reference/configuration.md).

```shell
lip config set github_proxy https://proxy.example.com/
lip config set github_proxy ""
lip config delete github_proxy
```

The second command corresponds to **Connect directly**, and the third to **Reset**. These commands do not test the proxy.
:::

## Auto restart

When **Auto restart** is enabled, lip automatically restarts the server of the selected workspace if it crashes—that is, if it exits with an error rather than being stopped normally.

Select **Auto restart** and press `Space` or `Enter` to toggle it between `[x]` **On** and `[ ]` **Off**.

![The row "Auto restart" shows a checked box and "On". The line below says "Restarts the server of this workspace when it crashes."](/screenshots/en/settings-13-auto-restart.svg)

1. This setting applies only to the selected workspace. Each workspace has its own setting; switch workspaces to view or change another.

- lip waits 5 seconds before restarting the server.
- A server that you stop manually is not restarted.
- A server that repeatedly crashes is restarted at most 5 times within 10 minutes.
- lip checks this setting when the server exits, so you can toggle it while the server is running.

The [Server](server.md) page has the same switch.

::: details The same with a command
```shell
lip config set restart on-failure --workspace
lip config set restart never --workspace
```
:::

## Clear cache

lip caches downloaded files so it does not have to download the same file twice. This row displays the cache folder path. Clearing the cache frees disk space; if lip needs any of those files later, it downloads them again.

1. Select **Clear cache** and press `Enter`. lip asks for confirmation.

   ![The dialog "Clear cache" asks "Delete all downloaded files?" with the buttons Clear and Cancel.](/screenshots/en/settings-14-clear-cache.svg)

2. Select **Clear** and press `Enter`.

   ![The dialog "Clear cache" says "Cache cleared." and has the button OK.](/screenshots/en/settings-15-cache-cleared.svg)

This deletes the cache folder and everything in it—all the files lip has downloaded, including game files, LeviLamina, mods, and any downloaded lip updates. Your workspaces, their servers and mods, and your settings are not affected.

The equivalent command is [`lip cache clean`](../reference/commands/cache_clean.md).

## Updates

lip updates itself.

### Check for updates

Select **Check for updates** and press `Enter`. lip checks GitHub for its latest release.

If no newer release is available, the row says so:

![The row "Check for updates" shows "Up to date" after the version 0.41.0, and the bottom line ends with "Up to date" too.](/screenshots/en/settings-16-up-to-date.svg)

If a newer release is available, lip offers to install it:

![The dialog "Install update" says "lip 0.42.0 is available." and has the buttons Install and Later.](/screenshots/en/settings-04-update-available.svg)

Select **Install** to install it now. Select **Later** to close the dialog; the newer version remains displayed on the page, and an **Install update** row appears below **Check for updates**:

![The row "Check for updates" shows "0.41.0 → 0.42.0", and below it a new row "Install update" shows 0.42.0.](/screenshots/en/settings-05-update-row.svg)

### Install the update

1. Press `Enter` on **Install update**, and again on **Install**.

   ![The dialog "Install update" asks "Install lip 0.42.0?" with the buttons Install and Cancel.](/screenshots/en/settings-19-install-question.svg)

2. lip downloads, verifies, and installs the release. What happens next depends on how you installed lip.

   If you installed lip from a portable archive, its files are replaced immediately:

   ![The dialog "Install update" says "lip 0.42.0 is installed. Quit lip, then run lip again to use the new version.", with the buttons Quit lip and Later.](/screenshots/en/settings-20-installed.svg)

   If you installed lip with the Windows installer, lip launches the installer for the new version. Because the installer modifies a program, Windows prompts you for permission:

   ![The dialog "Install update" says "The installer of lip 0.42.0 is running. Quit lip so that it can finish, then run lip again to use the new version.", with the buttons Quit lip and Later.](/screenshots/en/settings-22-installer.svg)

3. Select **Quit lip** to exit now; lip asks for confirmation only if a server is running. Select **Later** to close the dialog and keep lip open.

### After installing

The lip instance on your screen is still the old version until you restart it. The row reminds you:

![The row "Check for updates" shows "0.42.0 · Restart lip". The row "Install update" is gone.](/screenshots/en/settings-21-restart-lip.svg)

- **Restart lip**: quit lip and run it again to start the new version.
- **Installer running**: quit lip so the installer can replace it, then run lip again.

Until you restart, pressing `Enter` on **Check for updates** displays the same message again instead of checking for updates.

When the interface closes, lip also prints instructions in the terminal, such as "lip was updated to 0.42.0. Run lip again to start it." It does this regardless of how the interface closes—whether you quit it yourself or the Windows installer closes lip to replace it.

The equivalent commands are `lip self-update --check` and `lip self-update`. See [`lip self-update`](../reference/commands/self_update.md) for full details on updating.

## Daemon

The **daemon** is lip's background process. It runs commands, powers the interface, and manages the servers you start so that they keep running when you close the terminal. For more details, see [How lip works](../concepts/how_lip_works.md).

This row shows whether a daemon is running. Select it to view more details below the list:

![The row "Daemon" shows "Running · 0.41.0 · PID 4120", and the lines below the list end with "Commands in progress: 1 · Servers running: 0".](/screenshots/en/settings-17-daemon.svg)

1. **Running**, followed by the daemon's lip version.
2. **PID**: the daemon's process ID, which identifies it in your system's task manager.
3. **Commands in progress**: the number of commands the daemon is currently running. Each open interface counts as one, so this number is at least 1 here.
4. **Servers running**: the total number of servers the daemon is currently running across all workspaces. This appears only when this daemon is running your interface.

Press `Enter` to query the daemon again and refresh the numbers.

**Not running** means that no daemon is responding. In this case, lip runs the interface itself, and any servers you start in it stop when you quit lip.

You cannot stop the daemon from the interface, because the daemon is running the interface itself. Instead, quit lip and run [`lip daemon stop`](../reference/commands/daemon.md).

## About

The last row shows the currently running version of lip. Pressing `Enter` does nothing here.

![The row "About" is selected and shows "lip 0.41.0". The line below says "The version of lip that is running."](/screenshots/en/settings-18-about.svg)

Include this version when reporting a problem. The equivalent command is `lip --version`.
