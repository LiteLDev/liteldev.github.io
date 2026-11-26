# LeviLamina errors and crashes

## Server errors

### LeviLamina reports an error at startup because the `bedrock-runtime-data` version is too old. How do I fix it, and do I need to upgrade BDS?

The `bedrock_runtime_data` data in the server root directory does not match the current LeviLamina. This is not a problem with BDS itself (the BDS version only needs to match what LeviLamina requires). `bedrock-runtime-data` is a lip dependency of LeviLamina with an exact pinned version. Set up the game and loader again with lip to install the matching version automatically—for example, `lip setup --game 1.26.60 --loader levilamina@26.60.8` (note that in current lip versions, `lip update` refuses to operate on LeviLamina/BDS and tells you to use `lip setup` instead). You can also download the version required by LeviLamina's `lip.toml` from the releases at <https://github.com/LiteLDev/bedrock-runtime-data> and replace the `bedrock_runtime_data` folder in the root directory.

*Applies to: All current versions (LeviLamina 26.60.8 depends on bedrock-runtime-data 26.60.6-server.16)*

### A mod cannot load when LeviLamina starts and reports a missing dependency (`... is missing` / `missing module`). What does it mean?

It means what it says: either a dependency mod declared by the mod is not installed (`xxx will not be loaded because dependency yyy is missing`), or a DLL or symbol that the mod's DLL depends on does not exist (`missing module` / `missing content`). Install the mod with lip to pull in dependencies automatically (`lip install <package>`), or manually install the missing dependency mod or runtime. For missing content (missing symbols), the mod usually does not match the current LeviLamina or BDS version.

### What does the LeviLamina log message `LOG FILE SINK: failed to archive ./logs/latest.log as ./logs\2026-10-28.log: The process cannot access the file because it is being used by another process., continuing in the new file` mean?

When archiving the log by date (renaming `latest.log` to a dated file), another process was using the file, so the rename failed. LeviLamina continues writing to a new log file instead, and the server is not affected. Check whether another program (such as a log viewer, a panel, or another server instance) has `logs/latest.log` open.

*Applies to: Current LeviLamina 26.x versions*

### When starting a LeviLamina server, the console says another BDS process with the same path was detected (showing a PID) and asks whether to terminate it. What does this mean and what should I choose?

LeviLamina detected that another BDS process (`bedrock_server.exe` / `bedrock_server_mod.exe`) from the same path is already running, holding the port and the world. The prompt reads `Do you want to terminate the process with PID xxx? (y=Yes, n=No, e=Exit)`: enter `y` to end the old process and continue starting, `n` to leave it running and continue starting, or `e` to abort startup. Usually you should choose `y`, or close the other BDS window manually first. You can disable this check with `checkRunningBDS` in the LeviLamina configuration (enabled by default); it is skipped automatically when there is no console input (for example, when running as a service).

*Applies to: Current LeviLamina server versions*
