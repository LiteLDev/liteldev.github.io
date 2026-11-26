# Install links

This page explains `lip://` links: what they contain, what `lip` does when you open one, and how Windows knows that `lip` handles them. You can use them by clicking an **Install with lip** button on [LeviMC Mods](https://levimc.org/mods/), or by placing a link on your own page.

For the normative specification, see the [lip-uri(7)](https://github.com/LiteLDev/lip/blob/main/protocol/lip-uri.md) protocol page.

## The link

```
lip://install/<module path>[?version=<version>][&variant=<variant>]
lip --uri <link>
```

For example, this link installs version 0.26.1 of the `headless` variant of PLand:

```
lip://install/github.com/IceBlcokMC/PLand?version=0.26.1&variant=headless
```

| Part | What it is |
| --- | --- |
| `install` | The only valid action. Case-insensitive. |
| `<module path>` | The package repository, with its case preserved, such as `github.com/LiteLDev/LegacyMoney`. It is never a URL, a local path, or a short name: `lip://install/LeviLamina` is not a valid link. The host, `github.com`, must be lowercase. |
| `version` | A SemVer version without a leading `v`, such as `0.26.1`. If omitted, the newest version is used. Branches, tags, and commits are not allowed. |
| `variant` | The package variant. If omitted, the default variant is used. |

Percent-encoded characters (`%2F`) are decoded, while `+` remains `+`. Any fragment (`#…`) or unknown parameter is ignored. A link is invalid if it exceeds 2048 characters, contains characters not allowed in a URI, specifies a different action, repeats `version` or `variant`, or has a module path, version, or variant that `lip install` would reject.

A link corresponds to the `<module path>[#<variant>][@<version>]` package argument of [`lip install`](commands/install.md): the example above is equivalent to `lip install github.com/IceBlcokMC/PLand#headless@0.26.1`.

LeviLauncher accepts `levilauncher://` links of the same form; LeviMC Mods shows an **Install with LeviLauncher** button for client-side mods.

## Opening a link

Opening a link only launches the interface. It installs nothing until you confirm, and you choose where to install the package.

`lip --uri <link>` opens the [interface](interface.md), with these differences from running `lip` alone:

1. If the link is invalid, or if standard input or standard output is not a terminal, `lip` writes a message to standard error and exits with a non-zero code. On Windows, if `lip` is running in its own console, it waits for a key press first so you can read the message.
2. The folder where `lip` was started is not added to the workspace list. Instead, the last workspace in the list is selected, or none if the list is empty.
3. Before anything else, the **Install from a link** dialog asks whether to install the package. It shows the package, its details from the [LeviMC catalogue](../interface/get_mods.md) (**Name**, **Author**, **Version**, **Variant**, **Needs**), and the workspace it will be installed **Into**, which you can change directly in the dialog.
4. If the catalogue does not list the mod or cannot be read, the dialog warns you and defaults to the option that installs nothing. It also warns you if the catalogue does not list the requested version. You can still install the package, just as `lip install` would.
5. **Install…** runs `lip install` for the package in the selected workspace: you review the plan and choose **Apply** or **Cancel**, just as with any other operation in the interface ([Preview, then Apply](../interface/tour.md#preview-then-apply)). If the workspace has no game yet, the interface offers to set up its server instead. If no workspace is selected, **Choose folder…** lets you pick one.
6. If you decline, nothing is installed and the interface continues normally.

`--uri` is recognized as an option only when it is the first of two arguments. `lip --uri` exits with the same status as the interface, or with a non-zero code in the cases described in step 1.

## Registration on Windows

The `lip` Windows Installer package (the `.msi`; see [Install lip](../install.md)) registers the `lip` scheme during installation—either for the current user or for all users, matching the installation scope of `lip` itself. It writes these keys under `Software\Classes\lip` in `HKEY_CURRENT_USER` or `HKEY_LOCAL_MACHINE`:

| Key | Value | Data |
| --- | --- | --- |
| `Software\Classes\lip` | (default) | `URL:lip` |
| `Software\Classes\lip` | `URL Protocol` | the empty string |
| `Software\Classes\lip\DefaultIcon` | (default) | `"<directory>lip.exe",0` |
| `Software\Classes\lip\shell\open\command` | (default) | `"<directory>lip.exe" --uri "%1"` |

`<directory>` is the installation directory, including a trailing path separator. When you open a link, Windows starts `lip` in its own console. Uninstalling `lip` removes these keys.

`install.sh`, which installs `lip` on Linux and macOS, does not register a URL scheme. On those platforms, run `lip --uri '<link>'` in a terminal, or run `lip install` with the package argument.

## When nothing happens

If clicking an **Install with lip** button in your browser does nothing, `lip` is either not installed, was installed without the `.msi`, or is an older version that does not support links. [Install lip](../install.md) using the `.msi`, or copy the `lip install` command from the mod's page and run it in your server folder.

## See also

- [Interface](interface.md)
- [Command line](cli.md)
- [lip install](commands/install.md)
- [Marketplace](../interface/get_mods.md)
