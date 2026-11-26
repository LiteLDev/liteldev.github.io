# LegacyMoney

## LegacyMoney's `/money add` only takes a player name. Can I give players money with a target selector (such as `@s` or `@a`)? Is there something like `money_s` from LL2 LLMoney?

Yes. LegacyMoney reworked the commands. Instead of LLMoney's `money_s`, append `s` to the subcommand to use target selectors: `/money adds <selector> <amount>`, `/money reduces <selector> <amount>`, `/money sets <selector> <amount>`, and `/money querys <selector>` (for example, `/money adds @s 10`). The forms without `s` (`/money add`/`reduce`/`set`/`query`) take a player name and also work on offline players. These operations require OP (GameDirectors or higher) permission. See the repository README for usage details.

*Applies to: LegacyMoney 0.x to current (v0.23.0)*

## Does LeviLamina still have a built-in economy system like LiteLoaderBDS? Which economy plugin do I use on LeviLamina, and how do I install and use it?

LeviLamina no longer has a built-in economy system. LLMoney from LiteLoaderBDS has been ported as the standalone mod LegacyMoney (<https://github.com/LiteLDev/LegacyMoney>), which provides the economy features (the `money` API) used by most LSE script plugins.

When you install LegacyScriptEngine with lip (for example, `lip install github.com/LiteLDev/LegacyScriptEngine`), LegacyMoney is installed automatically as a dependency. You can also install it separately with `lip install github.com/LiteLDev/LegacyMoney`.

In game, use the `/money` command (`query`/`pay`/`add`/`reduce`/`set`/`hist`/`top`, and so on). The configuration file is `money.json` in the mod directory (`currency_symbol`, `def_money`, `enable_commands`, `pay_tax`).

*Applies to: all LeviLamina versions (currently LegacyMoney v0.23.0 / LSE v0.23.1)*

## The `/money` command of LegacyMoney "does not work": operating on a player says the player is not found or does nothing, or it says you lack permission. How do I fix it?

There are two common causes:

1. You get `Player not found`, or operations on a player have no effect: `/money add/set/reduce/query/hist <player name>` looks up the player by name through LeviLamina's PlayerInfo service (a player database that records uuid, xuid, and name). By default, this service is lazy-loaded and only starts recording joining players after it is first called, so players who joined earlier and were never recorded cannot be found. In LeviLamina's `Config.json`, set `alwaysLaunch` under `playerInfo` to `true` so that player info recording starts with the server (the resource cost is minimal). Players will then be recorded the next time they join.
2. You get `You don't have permission to do this`: the `/money` command itself is visible to everyone (its registered permission is Any), but add/reduce/set, querying another player's balance, `hist <player name>`, and purge require OP (GameDirectors) or higher at execution time, so ordinary players are rejected. The console has the highest permission and is not rejected for this reason, but pay and hist without a player name can only be run by a player; running them from the console returns `Console is not allowed to use this command`.

*Applies to: LeviLamina current version; LegacyMoney 0.23.0*

## How do I change a player's LegacyMoney balance while they are offline? Why do some offline players succeed and others fail?

Use the commands without `s` to operate by player name, such as `/money add <player name> <amount>` and `/money set <player name> <amount>`. These work on offline players, whereas the selector versions with `s` can only select online players.

Operating by name relies on LeviLamina's PlayerInfo records to resolve the name to an xuid:

- If PlayerInfo has never recorded the player (for example, the PlayerInfo service was not enabled at startup and the player has not joined since), the command reports `Player not found`.
- If the player's xuid is empty (for example, the player is in offline mode or not signed in to Xbox), LegacyMoney immediately returns a failure (`Failed to add money`).

You can set `playerInfo.alwaysLaunch` to `true` in LeviLamina's `Config.json` and have the player join the server once more to write the record. In script plugins, you can also operate on offline players directly by xuid, for example with `money.add(xuid, value)`.

*Applies to: LegacyMoney v0.23.0; current LeviLamina version*

## An LSE land claim plugin (or similar) requires spending "currency/coins" in its configuration. Where does this currency come from? What is LLMoney, and do I need to install it separately?

LSE plugins like this usually connect to the LLMoney economy system, which on LeviLamina is LegacyMoney (the port of LLMoney). The "currency/coins" the plugin refers to is the player's LegacyMoney balance. LegacyMoney is installed automatically as a dependency when you install LegacyScriptEngine (the engine that runs JS, Lua, and other script plugins), so you do not need to install it separately. You still need to give players a way to earn currency through other plugins or commands—for example, by having an admin run `/money add <player> <amount>`, or by setting `def_money` in `money.json` as the starting balance for new players.

*Applies to: all current LSE / LegacyMoney versions*

## Does LegacyMoney (LLMoney) support multiple currencies or decimal amounts?

No. LegacyMoney is a single-currency system: each player (xuid) has a single balance, and amounts must be integers (stored internally as `long long`; the LSE API parameter type is Integer). For multiple currencies, use a scoreboard or a similar approach. If you need decimals (for example, two decimal places), store the smallest unit as an integer (such as cents) and convert it when displaying.

*Applies to: LegacyMoney, all current versions*

## Does LegacyMoney (LLMoney) support using a UUID as the player identifier?

No. LegacyMoney identifies players by xuid, and all interfaces (`LLMoney_*` and LSE's `money.*` API) take an xuid. Players without an xuid (for example, in offline mode without an Xbox login) cannot use it, and related operations simply fail. If you only have a UUID, first convert it to an xuid using LeviLamina's PlayerInfo (`ll::service::PlayerInfo::fromUuid`) or LSE's data API.

*Applies to: LegacyMoney, all current versions*

## How do I view the economy (money) transaction history with LegacyMoney?

Players can run `/money hist` to view their own history (the optional `time` parameter is in seconds and defaults to the last 24 hours). Operators can run `/money hist <player name> [time]` to view another player's history (when run from the console, the player name is required). To clear the history, run `/money purge` and confirm with `/money purge confirm [time]`. In scripts, use LSE's `money.getHistory(xuid, time)`.

*Applies to: LegacyMoney, all current versions*

## What features does the refactored LegacyMoney have? Can it back up scoreboard data?

LegacyMoney supports a ranking query (`/money top [number]`, top 10 by default), a custom currency symbol via the `currency_symbol` config option, and Chinese localization (`lang/zh_CN.json`). It does not back up scoreboard data. Economy data is stored in `mods/LegacyMoney/economy.db` (SQLite); to back up scoreboards, use a third-party tool or plugin.

*Applies to: LegacyMoney 0.2 and later*

## A player's balance in the economy plugin (LegacyMoney) is -1 and setting any value with commands has no effect. What is the cause?

Usually, `online-mode` is turned off in `server.properties`. LegacyMoney uses the player's xuid as the database key, and players have no xuid when online mode is off. With an empty xuid, balance queries return -1 and set/add/reduce operations fail immediately. Keep `online-mode=true`; data created while it was off may not match any player because the xuid is missing or wrong. A database read/write error also returns -1, so check the console for `Database error` log lines.

*Applies to: LegacyMoney 0.8.4 and later*

## Can I just include `LLMoney.h` to call the LegacyMoney (LLMoney) API from a C++ plugin?

No. In `xmake.lua`, first add the `legacymoney` package from levimc-repo (for example, `add_requires("legacymoney 0.23.*")`) and call `add_packages("legacymoney")` in your target. You can then `#include "LLMoney.h"` and call functions such as `LLMoney_Get` and `LLMoney_Add` (you must link its import library). LegacyMoney must also be installed on the server at runtime, so declare it as a dependency of your mod.

*Applies to: LegacyMoney, all current versions*

## LLMoney downloaded manually from <https://github.com/LiteLDev/LLMoney/releases> breaks under LeviLamina (economy data is reset, the db/config files disappear). Does LLMoney not support LeviLamina?

LLMoney is a LiteLoaderBDS-era plugin; its repository is archived and it does not support LeviLamina. On LeviLamina, use its successor, LegacyMoney (<https://github.com/LiteLDev/LegacyMoney>), and install it with `lip install github.com/LiteLDev/LegacyMoney` rather than manually downloading and dropping files in as in the LL2 days. LegacyMoney stores its data in `mods/LegacyMoney/economy.db` and its config in `mods/LegacyMoney/money.json`. To keep existing data, copy your `economy.db` into that directory; if you have an old LL2-format `money.db`, place it at `mods/LegacyMoney/LLMoney/money.db` and it will be converted automatically on startup.

*Applies to: all LeviLamina versions*

## Why does the LegacyMoney (llmoney) database file keep growing? How do I clean it up?

In addition to the `money` balance table, the `mods/LegacyMoney/economy.db` database contains a transaction table named `mtrans`. It logs every transfer, addition, and deduction of money, so rows accumulate over time. To clear the transaction history, an OP (GameDirectors or higher) can run `/money purge confirm [time]`. (Running `/money purge` by itself only warns that the operation is dangerous and prompts you to add `confirm`. `time` is in seconds and deletes only transactions older than that value; the default of 0 clears everything.) You can also stop the server and use an SQLite tool to manually delete unneeded data, such as records with a zero balance.

*Applies to: LegacyMoney 0.7 and later*
