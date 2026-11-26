# Version Management

LeviLauncher treats each installed setup as an independent version. In the app, installed versions are called instances and appear on the **Instances** page.

## What you can do

=== "Windows"

    - install Minecraft Release or Preview builds
    - give versions recognizable names
    - launch a selected version quickly
    - remove versions you no longer need
    - open version-specific settings
    - create a desktop shortcut for a version

=== "Android"

    - import official Minecraft APKs and run them inside the launcher without installing each version on the system
    - keep multiple versions and their data separate
    - choose which version the launch screen starts

## Minecraft Release vs Preview <Badge platform="windows" />

| Type | Best for | Notes |
| --- | --- | --- |
| Release | Stable daily play | Recommended for most players |
| Preview | Testing upcoming changes | May break worlds, packs, or mods more often |

## Isolation explained

=== "Windows"

    Isolation is available for GDK versions and for UWP x64 versions 1.19.70.2 or later. When enabled, LeviLauncher stores managed game data inside that version's own workspace instead of sharing the default data location.

    Isolation is useful when you want:

    - different content sets for different versions
    - safer testing for mods or Minecraft Preview builds
    - less risk of one setup affecting another

=== "Android"

    Enable version isolation for an imported version to keep its worlds, packs, and settings separate from the installed Google Play version. Imported versions often need isolation to launch.

## Common version tasks <Badge platform="windows" />

### Install a new version

Install the version on the **Download** page, then return to **Launch** when it finishes.

The **Install LeviLamina** switch on the install page is on by default; turn it off to install the game without LeviLamina. This setting applies only to versions that LeviLamina supports.

### Rename a version

In **Instances** or **Instance Settings**, give the setup a name that reflects its purpose, such as `Release Survival` or `Preview Test`.

### Delete a version

Remove versions you no longer need, such as outdated Minecraft Preview test installs.

::: warning Be careful before deleting
Deleting a version can remove the managed environment for that setup. Back up important worlds first.
:::

### Create a desktop shortcut

Select **Create Desktop Shortcut** from the menu next to the **Launch** button to create a shortcut that launches a specific version directly.

## Recommended version strategy <Badge platform="windows" />

- one isolated Minecraft Release version for normal play
- one isolated Minecraft Preview version only when needed
- one temporary test version for mods or troubleshooting

## Related guides

- [Downloads & Mirrors](./downloads-mirrors)
- [World Tools](./world-tools)
- [Update & Troubleshooting](./update-troubleshooting)
