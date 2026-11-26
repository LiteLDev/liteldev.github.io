# Developing LeviLamina mods: general questions

## Difference Between Server Commands and Client Commands

- Server commands are registered by the server. Both the server itself and any players connected to it can execute them.
- Client commands are handled entirely by the client. Only the client that registered them can execute them; neither the server nor other players know they exist.

When LeviLamina runs on **Bedrock Dedicated Server** (BDS), mods can only register server commands.  
When Minecraft runs a **local world**, it runs an internal BDS instance, so mods can register both server and client commands.  
When Minecraft is in **multiplayer mode**, mods can only register client commands.  

You can get the server-side and client-side `CommandRegistrar` instances to register commands like this:

```cpp
ll::command::CommandRegistrar::getInstance(false); // Server
ll::command::CommandRegistrar::getInstance(true);  // Client
```

## Commands Registered in the Mod's `enable()` Method Work on the Server (BDS) but Fail on the Client

This happens because the server (BDS) and the client enable mods at different points in the startup lifecycle:

* The server enables all mods after server initialization finishes (when the world is already loaded).
* The client enables all mods after game startup finishes (when the main menu window appears).

As a result, registering commands in `enable()` on the client always fails, whether they are client or server commands.

Instead, listen for `ServerCommandRegisterEvent` to register server commands, and `ClientCommandRegisterEvent` to register client commands.

## Does LeviLamina have C++ API documentation like the Bukkit Javadoc? Do Minecraft's own classes have documentation?

Yes. A Doxygen C++ reference generated automatically from the headers is available at <https://levimc.org/LeviLamina/api/>, and the LeviLamina API reference with explanations and examples is at <https://levimc.org/LeviLamina/api_reference/>. Vanilla Minecraft classes (the headers under `mc/`) have no official documentation, so you must read the headers yourself. The LSE script API documentation is hand-written and follows a different format.

## In which language can I develop client mods used through LeviLauncher? Does the LeviLamina client have headers for client classes such as the camera?

Client mods are written in C++ on top of LeviLamina (client). LeviLamina now includes headers for most commonly used client classes, such as `src/mc/client/camera/`, `src-client/mc/client/game/ClientInstance.h`, and `src-client/mc/client/gui/controls/renderers/HudCameraRenderer.h`.

*Applies to: LeviLamina client edition (versions after March 2026)*

## After upgrading BDS/LeviLamina, a C++ native mod that used to work reports memory access errors. What should I do?

C++ native mods are tightly coupled to specific BDS and LeviLamina versions. Running a mod on a different version without adapting it can cause memory access errors or crashes. Before you can use the mod, it must be recompiled against the matching LeviLamina SDK. Wait for the author to release an adapted version, or recompile the source against the new version yourself.

## After getting a `PlayerInfoEntry` by uuid, the name field is empty. Does PlayerInfo need `alwaysLaunch` enabled to record player names and uuids?

Yes. The PlayerInfo service is initialized only on first use. Enable `targeted.playerInfo.alwaysLaunch` (default `false`) in the LeviLamina config so that PlayerInfo is initialized at server startup and continuously records the mapping between player names and uuid/xuid.

*Applies to: LeviLamina server, current version*

## When using LeviLamina's config read/write API (based on struct reflection), how do I define multi-level nested JSON? What if a JSON key contains a colon (such as `minecraft:stone`)?

LL provides built-in `ll::config::loadConfig` / `saveConfig` (in `ll/api/Config.h`), which map JSON automatically through struct reflection. The struct must have an integer `version` member (when versions differ, the updater is called and the file is rewritten). Do not hard-code the config path; use the mod's own config directory (for example, `getSelf().getConfigDir()`). For nested objects, nest structs directly. For dynamic keys or keys that contain colons, use `std::unordered_map<std::string, T>` / `std::map`, for example:

```cpp
struct Item {
    std::string dropitem;
    int count;
};
struct Config {
    int version = 1;
    bool instant_destruction = false;
    std::unordered_map<std::string, std::unordered_map<std::string, Item>> destroy;
};
```

Reflection also supports enums. Specify default values in the member initializers (the type must be an aggregate, so do not define constructors).

*Applies to: LeviLamina 0.13 and later, up to the current version*

## After adding Sentry crash reporting to my LeviLamina mod, why do I receive a large number of reports whenever any server with my mod installed crashes, even when the crash is unrelated to my mod? How do I configure this?

Once `sentryDsn` is set in `extraInfo` of the mod's `manifest.json`, LL's crash logger reports crashes. `sentryUploadType` in `extraInfo` controls the scope: when set to `"all"`, every crash on any server with your mod installed is reported. If it is omitted or set to anything other than `"all"`, a crash is reported only when your mod is identified as a suspect module (that is, the crash stack involves the mod). Server owners can also disable reporting with the LL config option `modules.crashLogger.uploadToSentry`.

*Applies to: LeviLamina, current version*

## Do I have to click through the LeviLamina API documentation on the website one page at a time? Is there an easier way to search it?

In the website's C++ Reference (generated from the headers by Doxygen), press `Ctrl+K` or `/` to search for classes, functions, and files by name. A more efficient approach is to clone the LeviLamina repository and search the headers globally in a local editor such as VS Code (`src/ll/api` contains LL's own API, `src/mc` holds the public BDS headers, and `src-server` / `src-client` hold the server-only and client-only headers).

## The LeviLamina API documentation lacks client-related content (such as `ClientInstance`), and finding headers is hard. What can I do?

Client-related headers are in the `src-client` directory of the LeviLamina repository; for example, `ClientInstance` is at `src-client/mc/client/game/ClientInstance.h`. Clone the repository and search within `src-client`. In addition, the Doxygen input for the current website C++ Reference already includes `src-client/ll/api` and `src-client/mc`, so you can also search for client classes directly in the documentation.

*Applies to: LeviLamina current version (including versions with client support)*

## Can I use a release version format such as `v[mod version]-mc[MC version]` (for example `v0.3.1-mc26.51`) to mark the MC version a mod supports?

This is not recommended. Under SemVer 2.0.0, a version containing "-" is parsed as a pre-release (testing) version, and tools such as lip also follow SemVer (treating pre-release versions differently during version selection and self-updates). To attach MC version information, use build metadata instead (a "+" suffix, for example `1.0.0+mc26.51`).

*Applies to: All current versions (lip uses lip.toml, and versions must follow SemVer 2.0.0)*
