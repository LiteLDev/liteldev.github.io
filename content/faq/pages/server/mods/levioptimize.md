# LeviOptimize

## Can LeviOptimize (which has ported Endstone optimizations since 0.17.1) fix client-side rendering lag?

No. LeviOptimize only optimizes server-side logic (chunk publishing, entity broadcasting, redstone, random ticks, and so on) and does not touch client rendering. All current optimizations are marked as server features in the source (`FeatureSide::server`). The client build's `/clilo` command only manages client-side features and reports `not available on this side` for these server-side optimizations.

*Applies to: LeviOptimize 0.17.1 and later*

## My LeviLamina server lags when many players are online. How do I install and configure the optimization plugin LeviOptimize?

Install it with lip: `lip install github.com/LiteLDev/LeviOptimize` (the current version is 0.18.0, which requires LeviLamina 26.60.x). The first launch generates `mods/LeviOptimize/config/config.json` with all optimizations enabled by default. You can disable or adjust them under `features` (such as the sub-options of `push_entity_opt`). After editing the file, run `/lo reload` to apply the changes without restarting, or use `/lo enable <feature>` and `/lo disable <feature>` to toggle a feature and save the change directly.

*Applies to: LeviOptimize 0.17.1 and later*

## Is there a plugin that can raise the TPS of a LeviLamina server? What is the difference between LeviOptimize and levilamina-loc?

Use LeviOptimize (LO for short, <https://github.com/LiteLDev/LeviOptimize>), a performance mod for LeviLamina that optimizes the vanilla hot paths behind low TPS. Install it with `lip install github.com/LiteLDev/LeviOptimize`. By contrast, levilamina-loc (<https://github.com/LiteLDev/levilamina-loc>) is LeviLamina's language pack (localization). lip installs it automatically as a dependency of LeviLamina, and it has nothing to do with performance optimization, so don't confuse the two.

## How do I check the TPS of a LeviLamina server (LSE has no TPS API)?

Install LeviOptimize (`lip install github.com/LiteLDev/LeviOptimize`) and run `/lo profile`. It prints the current and average full-frame MSPT and the corresponding TPS from the `full_frame_timing` diagnostics (over the last 20 samples). The command requires the GameDirectors permission (OP) and can also be run from the server console. Make sure `diagnostics.full_frame_timing` and `commands.server_feature_manage_command` in `config.json` are set to `true` (the default).

*Applies to: LeviOptimize 0.17.1 and later; LeviLamina 26.60.x*
