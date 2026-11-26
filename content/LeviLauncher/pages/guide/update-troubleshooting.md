# Update & Troubleshooting

Use this page when LeviLauncher does not install, update, or launch as expected.

## Common issues <Badge platform="windows" />

### The launcher says the Release version is not authorized

A Microsoft account can sign in to the Microsoft Store on up to 10 devices, and the launcher counts as a separate device.
Remove any devices you no longer need in [Microsoft Store device management](https://account.microsoft.com/devices/content).

### Gaming Services is missing or broken

- Repair or install it through the guided flow.
- If needed, check the Microsoft Store installation state for Minecraft Bedrock.

### GameInput is missing

- Install the required redistributable when LeviLauncher prompts you.
- Restart the launcher after installation if needed.

### Installation path is not writable

- Move your managed content path to a writable location in **Settings → Basic Settings**.
- If the launcher requests elevation to install or self-update, allow it if you trust the action.

### LeviLauncher closes immediately or never shows a window

- If the launcher fails before the UI appears, check `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`.
- Retry once after a failed launch. If it still fails, attach `startup.log` when opening a GitHub issue.

### A version fails to launch

- Test the same version without mods.
- Confirm that required Windows components are still installed.
- Verify that the version finished installing cleanly.
- Retry with a clean, isolated test setup.

### Downloads are too slow or fail repeatedly

- Switch mirrors.
- Retry later.
- Use a local package source if available.

## Common issues on Android <Badge platform="android" />

### Minecraft is missing or unsupported

Install or update the official Minecraft app from Google Play (1.21.80 or later), then reopen LeviLauncher.

### An imported version fails to launch

Imported versions often need version isolation. Enable it in the instance settings and try again.

### A launch fails

Open the launch log from the failure screen and check the reported reason before changing settings.

### Data migration

The launcher may migrate older data directories before continuing. Do not delete the old directory until the migration succeeds and your worlds, packs, and settings are available.

## Safe recovery steps

1. Back up important worlds.
2. Remove recent mods or packs.
3. Test with a clean, isolated version.
4. Reinstall the affected version if necessary.

## Self-update behavior <Badge platform="windows" />

LeviLauncher can check for, download, and install app updates. If the installation directory is not writable, the update may require elevated permissions.

## When to report a bug

Open a GitHub issue when:

- you can reproduce the problem consistently
- the problem persists after basic recovery steps
- the issue looks specific to LeviLauncher rather than a general Windows setup problem

When reporting, include:

- Windows version
- LeviLauncher version
- the exact steps you followed
- screenshots or logs, if available

Open issues here: [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

For the Android version, include the Android version, device model, and launch log, and open the issue in [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues).
