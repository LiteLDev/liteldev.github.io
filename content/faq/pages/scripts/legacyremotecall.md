# LegacyRemoteCall

## When a C++ mod exports a function to LSE scripts with LegacyRemoteCall (`RemoteCall::exportAs`), using `std::variant` for a parameter or return value fails to compile with `static_assert` "Unsupported Type". What can I do?

RemoteCall parameters and return values support only a fixed set of types (`bool`, `std::string`, `nullptr_t`, integers/floating-point numbers (`NumberType`), `Player*`/`Actor*`/`BlockActor*`/`Container*`, positions (`WorldPosType`/`BlockPosType`), `ItemType`, `BlockType`, `NbtType`, and `std::vector` and `std::unordered_map<std::string, T>` built from these types). `std::variant` is not supported, so it triggers `static_assert(is_supported_type_v<...>, "Unsupported Type")`.

To fix it, change the parameter to a supported type. The simplest way is to serialize the data into a JSON string (`std::string`) and parse it on the receiving side. You can also write your own template to convert the variant (possible in theory, but cumbersome).

Also note that numbers passed to JS are converted as double (in LSE: `Number::newNumber(v.get<double>())`), so large integers such as `long long` may lose precision; pass them as strings if necessary.

*Applies to: LegacyRemoteCall, all current versions (up to 0.23.x)*

## If an async function is exported with `ll.exports` in LSE, can another plugin that imports it with `ll.imports` await the async return value?

No. Remote calls (`ll.exports`/`ll.imports`) execute synchronously: the return value of the called function is packed immediately (converted to `RemoteCall::ValueType`) and returned to the caller. A Promise is not passed across plugins, so the caller cannot await an asynchronous result, and if the called function blocks, it blocks the server main thread as well. When you need an asynchronous result, use another approach, such as having the other side call a different function you export when it finishes, writing to a database or file, or notifying through an event.

*Applies to: LSE, all current versions*

## Calling a function exported by another plugin with `ll.imports("namespace", "function name")` in an LSE plugin fails (for example because the function is not exported). How do I check first whether the exported function exists?

Use `ll.hasExported(namespace, name)` to check whether the function has been exported, and only then call the function obtained from `ll.imports` (calling it when it is not exported raises `Fail to import! Function [ns::name] has not been exported`). Also, RemoteCall parameters must be convertible: you cannot pass a function (`kFunction`) or a `ByteBuffer` as a parameter, or `Unsupported Type` is thrown. When troubleshooting, add logger output at every step and check return values with `typeof`.

*Applies to: LSE, all current versions*

## Which parameter types does RemoteCall on LeviLamina (cross-plugin calls with `ll.exports`/`ll.imports`) support? Can I pass objects such as Player, block and item?

Yes. The current LegacyRemoteCall + LSE support null, strings, numbers, booleans, arrays, plain objects (converted recursively by key and value), and game objects such as Player, Entity, Item, Block, BlockEntity, Container, FloatPos, IntPos and NbtCompound. Functions and `ByteBuffer` are not supported. If the other plugin does not know these types, you can pass a uuid/xuid, a position as JSON, an SNBT string and so on instead.

*Applies to: LSE 0.x release and later*

## What is `LLSEGlobal` that I see in LSE?

When you call `ll.exports`, `ll.imports`, or `ll.hasExported` without specifying a namespace (passing only the function name), LSE automatically uses the default namespace `LLSEGlobal`.

*Applies to: LSE, all current versions*

## After an upgrade, LSE's support libraries such as nodejs fail to install or load, with errors related to LegacyRemoteCall. What should I do?

This happens when LegacyRemoteCall, LegacyScriptEngine, and LeviLamina have mismatched versions; all three must match. The current LSE `lip.toml` already declares LegacyRemoteCall as a dependency (for example, LSE 0.23.x depends on LegacyRemoteCall 0.23.* and LeviLamina 26.60.*), so installing or updating with lip pulls in the matching version automatically. Update the package with `lip update` (or `lip update github.com/LiteLDev/LegacyScriptEngine`), and use `lip setup` to change the LeviLamina version itself. If you install manually, be sure to replace LegacyRemoteCall as well. Commands follow the current lip.

## When exporting a function/event with RemoteCall for LSE to call, the call works but throws `bad variant access`. What is the cause?

`bad variant access` means the actual type of a parameter or return value does not match the type declared in `RemoteCall::exportAs` or `importAs` (internally, the value is extracted from a `std::variant` with `std::get`, which throws `std::bad_variant_access` on a type mismatch). Check that the types passed from JS match the signature of the exported C++ function. Do not declare parameters of basic numeric types—or of the converted types `WorldPosType` and `BlockPosType`—as references (neither `int&` nor `const int&` works); pass them by value instead. Newer versions of `RemoteCallAPI.h` add a `static_assert` against extracting references from conversions such as `NumberType`, so this form fails to compile (since 0.21.1, reference parameters cause a compile-time error).

*Applies to: LegacyRemoteCall current version*
