# Configuring LeviLamina

## How do I stop a mod from loading when the server starts in LeviLamina without deleting its files? (For example, a mod does not match the current version and crashes the server on every start.)

Add `"passive": true` to `manifest.json` in the mod's directory (`mods/<mod name>/`); it is then not loaded actively and loads only when another mod depends on it. You can also rename the mod's `manifest.json` or the whole mod folder so that LeviLamina does not recognize it (a message may appear at startup). If a mod (such as a dll shown in the trace log) crashes the server because its version does not match the current LeviLamina, delete it or replace it with a matching version.

## Does LeviLamina print garbled color symbols in a console that does not support color output?

No. LL's log formatter checks whether colored logging (`ColorLog`, a switch provided by PreLoader) is enabled. When colored logging is off, LL automatically strips all color and escape sequences from messages and titles before printing them.

## LeviLamina's console log timestamps are precise to the millisecond. Can I change them to show only seconds through configuration?

There is no built-in config option for this. LeviLamina hard-codes the console format as `"{3:.3%T.} {2} {1} {0}"` (with 3 millisecond digits). To change it, you must either write a mod that replaces the format through the logging API (`setFormatter` on `Logger`/`Sink`, together with `PatternFormatter`) or modify the LeviLamina source code and recompile.

## Where do I set the plugin information (author, version) that `ll show` displays? Writing `Author` and `Version` in the manifest json has no effect.

Set these fields in the mod's `manifest.json`. Key names must be lowercase—for example, `"author"`, `"version"`, and `"description"`; capitalized keys are not recognized. Once set, run `ll show <mod name>` to view the information.

*Applies to: LeviLamina 0.9 to 26.60.x*

## How should a non-LeviLamina plugin (for example, a DLL to be loaded at the PreLoader stage) write its manifest? Can I use a LeviLamina plugin's manifest directly?

Do not use `"type": "native"`, which is for ordinary C++ mods loaded by LeviLamina's native mod manager. For a DLL that PreLoader must load before the game starts, set `"type": "preload-native"` in the manifest. PreLoader loads it before the game starts and before LeviLamina's mods (LeviLamina itself uses this type). LeviLamina's mod registry skips these manifests and does not count them as LeviLamina mods.

*Applies to: LeviLamina 1.x and later (currently 26.60.x)*
