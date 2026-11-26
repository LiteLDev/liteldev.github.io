# LeviAntiCheat

## After setting online-mode=false in BDS (disabling licensed-account verification), player data and inventories keep getting lost and players join like new players. How do I fix this?

With licensed-account verification disabled, player data may no longer be read the way it was before, making it look as if it was lost. LeviAntiCheat (LAC) includes built-in offline-mode inventory protection that fixes inventory loss for offline-mode players. In `mods/LeviAntiCheat/config/config.json`, set `worldSafety.offlineInventoryProtection` to `true` (default `false`), then restart the server or run `/lac reload`. You can also write your own plugin to save player data.

*Applies to: Current LeviAntiCheat (v0.18.0)*

## What does it mean when LeviAntiCheat (LAC) reports that NoPacket was detected?

It means the player has not sent any packets for longer than a configured time (packet-stop detection). This threshold is controlled by `movement.noPacketCheck.maxNoPacketTime` in `config.json` (default 12 seconds). If you get false positives, increase that value or disable the check by setting `movement.noPacketCheck.enable` to `false`. For development and debugging, you can also disable the check or handle it yourself by subscribing to `PlayerCheatEvent` (see LeviPenalizeCheat).

*Applies to: Current LeviAntiCheat (v0.18.0)*

## How do I use LeviAntiCheat's mute command? Typing mute directly doesn't work.

Muting is a subcommand of LAC's main `lac` command, not a standalone `mute` command. Use `/lac mute <player> [duration (minutes)]` to mute a player, `/lac unmute <player>` to unmute them, and `/lac query <player>` to check their ban/mute status.

*Applies to: LeviAntiCheat 0.4.4 and later*

## What is LeviAntiCheat's GitHub address? What is the difference between LLAC and LAC?

Repository: <https://github.com/LiteLDev/LeviAntiCheat>. Install it with `lip install github.com/LiteLDev/LeviAntiCheat`. LLAC (LLAntiCheat) is the legacy anti-cheat from the LiteLoaderBDS (LL2) era, and its repository is archived. LAC (LeviAntiCheat) is the actively maintained anti-cheat for LeviLamina.

## I want to use LeviAntiCheat to fix the item duplication bug that uses the crafting table / UI slots, but I don't want to enable all of LAC's features. What should I do?

LAC includes a built-in fix for UI slot duplication, controlled by `bugFixes.uiItemDuplicateFix` (default `true`). You can turn off every LAC feature individually in `mods/LeviAntiCheat/config/config.json`: leave `bugFixes.uiItemDuplicateFix` set to `true` and set the `enable` or boolean value of the checks you don't need to `false` (for example, `cheatPrevention.antiXray.enable`, `movement.timerCheck.enable`, `combat.autoClickCheck.enable`, and so on; to prevent players from being kicked as well, set `punish.enable` to `false`). Change the values rather than deleting the options. Afterward, run `/lac reload` or restart the server. Install with: `lip install github.com/LiteLDev/LeviAntiCheat`

*Applies to: LeviAntiCheat current version (0.18.0, LeviLamina 26.60.\*)*

## Which anti-cheat plugins can I use on a LeviLamina server? Is there a LeviLamina version of the old LLAC?

Yes: LiteLDev's official LeviAntiCheat (LAC), available at <https://github.com/LiteLDev/LeviAntiCheat>. Install it with lip (`lip install github.com/LiteLDev/LeviAntiCheat`) or download it from GitHub Releases. Make sure to choose the LAC version that matches your LeviLamina version (for example, LAC 0.18.0 depends on LeviLamina 26.60.*).

*Applies to: LeviLamina current version*

## After enabling LeviAntiCheat's anti-X-ray, players report that the diamonds and other ores they mined turned into stone. Is this a bug?

This is not a bug. With `engineMode: 1` or `2` (the default is 1), anti-X-ray misleads X-ray users by replacing solid blocks that are completely surrounded by other solid blocks with fake ores from `obfuscateBlocks` before sending them to the client. When a block changes (for example, when mining starts or an explosion occurs), the server resends the actual surrounding blocks, turning the fake ore back into real stone.

If players see ores changing right in front of them, increase `cheatPrevention.antiXray.dimensions.<dimension>.updateRadius` for that dimension (the default is 2). Note that a larger radius increases the area a client can see through.

*Applies to: LeviAntiCheat current version (configuration structure after the anti-X-ray rewrite in v0.17.2)*

## LeviAntiCheat's anti-X-ray (anti x-ray) seems to have no effect when enabled, or causes rubber-banding. How do I tune the parameters?

Tune the parameters according to the official documentation: <https://github.com/LiteLDev/LeviAntiCheat/blob/release/anti_x_ray.zh.md>. It explains each option under `cheatPrevention.antiXray` (`enable`, `maxThreads`, `autoSolidCheck`, `dimensions.<dimension>.engineMode`/`maxHeight`/`updateRadius`/`obfuscateBlocks`/`mainBlock`, and so on), provides recommended Overworld and Nether configurations for `engineMode` 0/1/2, and covers troubleshooting for common issues such as "ores are still visible" and "it does not work below y=0".

*Applies to: LeviAntiCheat current version*

## Is there a plugin that can detect banned items such as 32k items (illegal enchantments, bedrock, portal blocks, spawners, spawn eggs, blocks with special values, and so on)?

Use LiteLDev's official anti-cheat plugin, LeviAntiCheat (LAC). In `mods/LeviAntiCheat/config/config.json`, add the namespaced IDs of the items you want to ban (such as `"minecraft:bedrock"`) to `inventoryManagement.banItem.blacklist`. To detect over-leveled enchantments, enable `inventoryManagement.enchantCheck` (disabled by default) and set the maximum level for each enchantment in `maxEnchantLevel`. LAC also provides checks such as `anvilEnchantLimits` (anvil enchantment check), `invalidItemDetection`, `invalidStackDetection`, and `antiInvalidNbtItem`.

*Applies to: LeviAntiCheat current version (config version 21)*

## I installed LeviAntiCheat but cannot find its configuration file. Where is it?

The configuration file is generated at `mods/LeviAntiCheat/config/config.json` only after you start the server once and the plugin loads successfully. After editing the file, restart the server or run `/lac reload` to apply your changes.

*Applies to: LeviAntiCheat current version (0.18.0)*

## After installing LeviAntiCheat (LAC), blocks in the overworld display incorrectly. How do I fix it?

This is usually caused by LAC's anti-X-ray feature, which obfuscates blocks fully enclosed by solid blocks (with the default `engineMode` of 1, these hidden solid blocks are randomly replaced with ores from `obfuscateBlocks` before being sent to the client). In `mods/LeviAntiCheat/config/config.json`, set `cheatPrevention.antiXray.dimensions.overworld.enable` to `false` to disable anti-X-ray in the overworld (or set `cheatPrevention.antiXray.enable` to `false` to disable it everywhere), then run `/lac reload` or restart the server. If the display issue affects addon blocks, also check settings such as `treatAddonBlocksAsNonSolid` and `nonSolidBlocks`.

*Applies to: All current versions (config keys as of LAC 0.17.x/0.18.0)*

## After installing LeviAntiCheat (LAC), startup reports a version-related error and it cannot load. What should I do?

LAC is compiled against specific LeviLamina versions, so the two versions must match. Install the LAC release that matches your current LeviLamina version (or upgrade both to matching versions). Installing with lip is recommended so dependencies are resolved automatically: `lip install github.com/LiteLDev/LeviAntiCheat`. For example, the latest LAC 0.18.0 requires LeviLamina 26.60.*; check the CHANGELOG to see which LL version each LAC release supports.

*Applies to: All current versions (LAC 0.18.0 corresponds to LeviLamina 26.60.\*)*

## What does the ban duration (`duration`) field in LeviAntiCheat (LAC) punishment settings mean?

It specifies the ban duration, not a count of cheating incidents. In the current config, this corresponds to `punish.banDuration`, measured in seconds (`0` means a permanent ban). `punish.banVL` determines whether a player is banned (`-1` disables banning), while `kickVL` sets the violation level for kicking. Note that the manual command `/lac ban <player> [reason] [duration (minutes)]` takes its duration in minutes.

*Applies to: current version (LeviAntiCheat 0.18.0, config version 21)*

## Is there Chinese documentation or a tutorial for LeviAntiCheat's configuration file?

Yes. The repository's Chinese README (<https://github.com/LiteLDev/LeviAntiCheat/blob/release/README.zh.md>) provides the full default configuration with Chinese comments (the config file is located at `mods/LeviAntiCheat/config/config.json`). The anti-X-ray submodule also has its own documentation, `anti_x_ray.zh.md`. Note that the `"version"` field in the config file indicates the config version number (currently 21); do not edit it manually.

*Applies to: LeviAntiCheat current version (0.18.0)*

## After installing LeviAntiCheat (LAC), the server console keeps kicking players, even all players, so nobody can join. How do I fix it?

This is usually a false positive from LAC's no-packet check (NoPacket). That check detects players who stop sending packets to the server for an extended time; turning it off does not make cheaters "invincible". In `mods/LeviAntiCheat/config/config.json`, set `movement.noPacketCheck.enable` to `false`, or raise `movement.noPacketCheck.maxNoPacketTime` (default 12 seconds). Also, version 0.4.5 fixed NoPacket false positives when the server's main thread lags, so first make sure you are running the latest LAC.

*Applies to: LeviAntiCheat current version (0.18.0)*

## Some plugins that change player name display by sending packets conflict with LeviAntiCheat's fake-name check. What should I do?

In `mods/LeviAntiCheat/config/config.json`, set `cheatPrevention.antiFakeName` to `false` (it is `false` by default in the current version).

*Applies to: LeviAntiCheat current version (0.18.0)*

## After installing LeviAntiCheat (LAC), some players can still spam and I cannot stop them. What should I do?

Adjust the `playerInteractions.antiSpam` settings in `mods/LeviAntiCheat/config/config.json`: make sure `enable` is `true`, lower `maxChatRate` (maximum chat messages within `chatRateDuration` seconds; default is 5 messages in 10 seconds), `maxCmdRate` (maximum commands per second), and `maxChatLength` (maximum chat length), and enable `disableSelector` to forbid target selectors in commands. You can also raise the violation values for `Spam` / `CommandSpam` / `MessageTooLong` in `punish.checkTypeViolationMap` to kick spammers sooner.

*Applies to: LeviAntiCheat current version (0.18.0)*
