# LegacyScriptEngine API: data and files

## How do I create or handle ByteArray NBT in LSE (such as the `"FireworkFade":[B;...]` of a firework)? `new NbtByteArray(Uint8Array.from([15,7,8,...]))` prints as ASCII codes (`[B;49b,53b,44b,...]`). What do I do?

This is an LSE implementation issue: the `NbtByteArray` constructor (and `set`) writes the buffer you pass in character by character as a string (`describeUtf8`), so the array `[15,7,8]` is treated as the text `"15,7,8"` and converted to ASCII codes. Instead, parse SNBT at the C++ level: `NBT.parseSNBT("{FireworkFade:[B;15b,7b,8b]}")` parses a compound, from which you can extract the byte array and write it back. In the current version, `parseSNBT` is based on `CompoundTagVariant::parse` and can also parse `"[B;15b,7b,8b]"` directly to return an `NbtByteArray` (older versions only supported compounds, so you must wrap the value in one). For existing data, you can also convert it to text with `toSNBT()`, edit it, and write it back with `parseSNBT`.

*Applies to: current LSE version (the NbtByteArray constructor issue still exists in the 0.23.1 source)*

## In LSE, why is a path starting with `/`, such as `new JsonConfigFile("/plugins/xxx/config.json")`, not found or written to the wrong place?

LSE does no special processing on paths and passes them to the file system as-is. A path starting with `/` is an absolute path. On Windows, it points to the root of the current drive (such as `C:\plugins\...`), not to the `plugins` folder under the BDS directory. Use a path relative to the BDS root (the working directory), such as `new JsonConfigFile("./plugins/xxx/config.json")`.

## In LSE, how do I look up a player name from a UUID and the other way around?

To get the UUID from a player name, use `data.name2uuid(name)`. To get the player name from a UUID, LSE has no `data.uuid2name`, but you can use `data.fromUuid(uuid)` to get a player info object `{xuid, name, uuid}` and read its `name` (a `null` return means the lookup failed). Related functions include `data.name2xuid` / `data.xuid2name` / `data.xuid2uuid` / `data.fromName` / `data.fromXuid` / `data.getAllPlayerInfo` (`fromUuid` and similar functions were added in 0.8.13).

*Applies to: LSE 0.8.13 and later*

## In LSE, how do I build an NbtList that represents an integer array?

Build the NbtList from NbtInt elements, for example `new NbtList([new NbtInt(1), new NbtInt(2)])`. All elements in the array must be NBT objects of the same type; you cannot pass JS numbers directly.

## In an LSE plugin, parsing an item's NBT converted to a string (SNBT) with `JSON.parse()` throws an error. What should I do?

SNBT is not JSON, so you cannot parse the result of `nbt.toSNBT()` with `JSON.parse`. Use LSE's NBT object API directly (such as `comp.getTag(key)` and `comp.getData(key)` on an NbtCompound) to read and modify it; if you really need a plain JS object, use `comp.toObject()`.

*Applies to: all current LSE versions*

## I can't find APIs such as `File.readFrom` in the LSE documentation (the file system page link is broken). Do these APIs still exist?

The APIs still exist; the documentation site was only migrated. The file-related APIs are documented at <https://levimc.org/LegacyScriptEngine/apis/SystemAPI/File/>. `File.readFrom(path[,isBinary])` still works (the `isBinary` parameter has been supported since 0.19.1).

If you find something missing from the documentation, you can submit a PR to the LiteLDev/liteldev.github.io repository (`content/LegacyScriptEngine/pages`).

## Does LSE have a unified configuration file interface? Does LeviLamina provide a default configuration directory?

In LSE, you generally use `new JsonConfigFile(path[,default])`. The developer chooses `path`, and the optional `default` argument sets the initial content written when the file does not exist.

At the C++ level, LeviLamina provides default directories for mods: `config`, `data`, and `lang` (`Mod::getConfigDir` / `getDataDir` / `getLangDir`). There is no unified configuration mechanism fully managed by the loader.

## In LSE, after getting a child NBT with `let b = a.getTag("xxx")`, using `b` in a delayed callback such as `setTimeout` finds the data destroyed or crashes. Why?

This is a lifetime issue in the LSE NBT binding: the child NBT object returned by `getTag` holds only a raw pointer into the parent NBT's internal data and does not hold a reference to the parent (root) NBT. Once the parent object `a` is garbage collected, the data that child `b` points to is destroyed with it. To avoid this, keep the root NBT object alive in your script (for example, in a global variable), or convert it to another form first (such as `toSNBT()`/`toObject()`), store that, and convert it back when needed with `NBT.parseSNBT` or similar.

*Applies to: all current versions (up to LSE 0.23.1)*
