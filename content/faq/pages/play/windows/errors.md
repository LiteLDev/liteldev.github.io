# LeviLauncher on Windows: errors and crashes

## Where do I find the crash logs after the game crashes in LeviLauncher (PC)?

This applies to the current LeviLamina client. For a game with LeviLamina installed, crash logs are saved in `logs/crash` under that game version's (instance's) directory, named `trace_<time>.log` and `minidump_<time>.dmp`. The same `logs` directory also contains `latest.log`. This is not MC's own crash directory. When reporting an issue, send the latest trace and minidump.

The launcher's own logs are in `%LOCALAPPDATA%\LeviLauncher\Logs` (if the launcher exits before showing a window, check `startup.log` there). The error dialog also has a button to open the log folder.

*Applies to: LeviLauncher 1.1.0*
