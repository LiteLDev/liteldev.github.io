# LegacyRemoteCall

## C++ mod 用 LegacyRemoteCall（`RemoteCall::exportAs`）导出函数给 LSE 脚本时，参数/返回值用 `std::variant` 编译失败，报 `static_assert` "Unsupported Type"，怎么办？

RemoteCall 的参数和返回值仅支持一组固定类型，包括 `bool`、`std::string`、`nullptr_t`、整数/浮点数（`NumberType`）、`Player*`/`Actor*`/`BlockActor*`/`Container*`、坐标（`WorldPosType`/`BlockPosType`）、`ItemType`、`BlockType`、`NbtType`，以及由这些类型组成的 `std::vector` 和 `std::unordered_map<std::string, T>`。它不支持 `std::variant`，因此会触发 `static_assert(is_supported_type_v<...>, "Unsupported Type")`。

解决办法是将参数改为受支持的类型。最简单的做法是把数据序列化为 JSON 字符串（`std::string`）传递，由接收方解析；也可以自己编写模板为 variant 实现类型转换（理论上可行，但较为繁琐）。

此外，数字传给 JS 时会按 double 转换（LSE 中使用 `Number::newNumber(v.get<double>())`），`long long` 等大整数可能会丢失精度，必要时请改用字符串传递。

*适用版本：LegacyRemoteCall 当前所有版本（至 0.23.x）*

## LSE 中用 `ll.exports` 导出的异步函数，别的插件通过 `ll.imports` 导入后能否 await 拿到异步返回值？

不能。远程调用（`ll.exports`/`ll.imports`）是同步执行的：被调函数的返回值会立即打包（转换为 `RemoteCall::ValueType`）并返回给调用方，Promise 无法跨插件传递，因此调用方无法通过 await 获取异步结果；如果被调函数发生阻塞，还会连带阻塞服务器主线程。如需获取异步结果，请改用其他方式，例如由对方在任务完成后调用你导出的另一个回调函数、写入数据库/文件，或通过事件通知。

*适用版本：LSE 当前所有版本*

## LSE 插件中用 `ll.imports("命名空间", "函数名")` 调用其他插件导出的函数时报错（如函数未导出），如何先判断该导出函数是否存在？

先调用 `ll.hasExported(namespace, name)` 检查目标函数是否已导出，再调用 `ll.imports` 获取的函数（若未导出直接调用，会报错 `Fail to import! Function [ns::name] has not been exported`）。此外，RemoteCall 的参数必须支持类型转换，不能将函数（`kFunction`）或 `ByteBuffer` 作为参数传递，否则会抛出 `Unsupported Type`。排查问题时，可在每一步添加 logger 输出，并用 `typeof` 检查返回值。

*适用版本：LSE 当前所有版本*

## LeviLamina 下的 RemoteCall（`ll.exports`/`ll.imports` 跨插件调用）支持哪些参数类型？能传 Player、方块、物品等对象吗？

可以。当前版本的 LegacyRemoteCall + LSE 支持以下类型：null、字符串、数字、布尔值、数组、普通对象（按键值递归转换），以及 Player、Entity、Item、Block、BlockEntity、Container、FloatPos、IntPos、NbtCompound 等游戏对象。不支持函数和 `ByteBuffer`。如果接收方插件无法识别这些游戏对象类型，也可以改传 uuid/xuid、坐标 JSON 或 SNBT 字符串等。

*适用版本：LSE 0.x 正式版及以后*

## LSE 中看到的 `LLSEGlobal` 是什么？

调用 `ll.exports`、`ll.imports` 或 `ll.hasExported` 时，如果未指定命名空间（只传入了函数名），系统会自动使用默认命名空间 `LLSEGlobal`。

*适用版本：LSE 当前所有版本*

## 升级后 LSE 的 nodejs 等支持库装不上/加载报错，提示 LegacyRemoteCall 相关问题怎么办？

这是因为 LegacyRemoteCall、LegacyScriptEngine 与 LeviLamina 的版本不匹配，需要让三者版本配套。当前 LSE 的 `lip.toml` 已将 LegacyRemoteCall 声明为依赖（例如 LSE 0.23.x 依赖 LegacyRemoteCall 0.23.* 与 LeviLamina 26.60.*），使用 lip 安装或更新时会自动拉取匹配版本：可执行 `lip update`（或 `lip update github.com/LiteLDev/LegacyScriptEngine`）更新包；如需更换 LeviLamina 本体版本，请使用 `lip setup`。如果采用手动安装，请务必同时替换 LegacyRemoteCall。具体命令以当前版本的 lip 为准。

## 用 RemoteCall 导出函数/事件给 LSE 调用时，能调用但报错 `bad variant access`，是什么原因？

`bad variant access` 表示参数或返回值的实际类型与 `RemoteCall::exportAs` / `importAs` 声明的类型不匹配（底层使用 `std::get` 从 `std::variant` 中取值，类型不符时便会抛出 `std::bad_variant_access`）。请检查 JS 侧传入的类型是否与 C++ 导出函数的签名一致。此外，基础数值类型（以及 `WorldPosType`、`BlockPosType` 等转换类型）的参数不能声明为引用（`int&` 或 `const int&` 均不可），必须改为按值传递；新版 `RemoteCallAPI.h` 已对从 `NumberType` 等转换结果中提取引用的操作添加了 `static_assert`，这类写法会直接导致编译报错（自 0.21.1 起，使用引用参数会在编译期报错）。

*适用版本：LegacyRemoteCall 当前版本*
