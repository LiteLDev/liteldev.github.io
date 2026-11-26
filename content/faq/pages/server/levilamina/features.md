# What LeviLamina does on a server

## Is LeviLamina only for servers (BDS)? Can it be used in client single-player worlds?

No. LeviLamina is an unofficial mod loader for Minecraft Bedrock Edition. It loads into both the Bedrock Dedicated Server (BDS) and the Minecraft client on Windows. On the client, use LeviLauncher to install a game version, LeviLamina, and client mods, which you can then use in single-player worlds (see the official tutorial "Playing with mods on Windows"). LeviLauncher is only a launcher; the loader is LeviLamina.

*Applies to: LeviLamina current version (26.60.x), LeviLauncher 1.x*

## How do I check which LeviLamina version a server has installed?

Run the `version` command in the server console. It prints output such as `Game version <game version> with LeviLamina-<version>`. The corresponding command on the LeviLamina client is `cliversion`. You can enable or disable this command and set its permission level under `modules.command.versionCommand` in the LeviLamina configuration; if disabled, the command is not registered.

*Applies to: all current LeviLamina versions*

## Does LeviLamina itself support Data-Driven UI (DDUI)? Since which version? Can LSE script plugins use it?

Yes. LeviLamina has supported DDUI since 26.20.7 under the `ll::ui` namespace (with headers such as `ll/api/ui/form/CustomForm.h` and `ll/api/ui/form/MessageBox.h`), which is separate from the older `ll::form` interface. See the usage guide at <https://levimc.org/LeviLamina/developer_guides/how_to_guides/data_driven_ui_guide/> and the API reference under `api_reference/data_driven_ui`. Only the native C++ API is available for now, so you must write a C++ mod; LSE does not export these interfaces yet.

*Applies to: LeviLamina 26.20.7 and later*
