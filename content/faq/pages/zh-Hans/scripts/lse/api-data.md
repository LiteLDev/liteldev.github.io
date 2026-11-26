# LegacyScriptEngine API：数据与文件

## LSE 中如何创建/处理 ByteArray 类型 NBT（如烟花的 `"FireworkFade":[B;...]`）？`new NbtByteArray(Uint8Array.from([15,7,8,...]))` 打印出来变成 ASCII 码（`[B;49b,53b,44b,...]`）怎么办？

这是 LSE 的实现问题：`NbtByteArray` 构造函数（以及 `set`）会将传入的缓冲区当作字符串（`describeUtf8`）逐字符写入，导致数组 `[15,7,8]` 被视为文本 `"15,7,8"` 并转为 ASCII 码。可改用 SNBT 在 C++ 层解析：通过 `NBT.parseSNBT("{FireworkFade:[B;15b,7b,8b]}")` 解析出 compound，再取出其中的字节数组写回。当前版本的 `parseSNBT` 基于 `CompoundTagVariant::parse`，也可直接解析 `"[B;15b,7b,8b]"` 并返回 `NbtByteArray`（旧版本仅支持 compound，需在外层包裹一层）。处理已有数据时，同样可以先用 `toSNBT()` 转为文本，修改后再用 `parseSNBT` 写回。

*适用版本：当前 LSE 版本（NbtByteArray 构造问题在 0.23.1 源码中仍存在）*

## LSE 中 `new JsonConfigFile("/plugins/xxx/config.json")` 这种以 `/` 开头的路径为什么找不到/写错位置？

LSE 不会对路径做特殊处理，而是原样交给文件系统。以 `/` 开头的是绝对路径，在 Windows 上代表当前盘符根目录（如 `C:\plugins\...`），而非 BDS 目录下的 `plugins`。因此应使用相对于 BDS 根目录（工作目录）的路径，如 `new JsonConfigFile("./plugins/xxx/config.json")`。

## LSE 中如何在玩家名和 UUID 之间互相查询？

由玩家名查 UUID 可用 `data.name2uuid(name)`。由 UUID 查玩家名时，LSE 没有提供 `data.uuid2name`，可用 `data.fromUuid(uuid)` 获取玩家信息对象 `{xuid, name, uuid}`，再读取其 `name` 属性（返回 `null` 表示查询失败）。同类接口还有 `data.name2xuid`、`data.xuid2name`、`data.xuid2uuid`、`data.fromName`、`data.fromXuid` 和 `data.getAllPlayerInfo`（`fromUuid` 等接口自 0.8.13 起新增）。

*适用版本：LSE 0.8.13 及以上*

## LSE 中如何构造表示整型数组的 NbtList？

使用 NbtInt 元素构造 NbtList，例如 `new NbtList([new NbtInt(1), new NbtInt(2)])`。数组中的元素必须是同一种 NBT 类型的对象，不能直接传入 JS 数字。

## LSE 插件里把物品 NBT 转成字符串（SNBT）后用 `JSON.parse()` 解析报错，怎么办？

SNBT 不等于 JSON，不能用 `JSON.parse` 解析 `nbt.toSNBT()` 的返回值。应直接使用 LSE 的 NBT 对象 API（如 NbtCompound 的 `comp.getTag(key)`、`comp.getData(key)`）进行读写；若确实需要普通 JS 对象，可调用 `comp.toObject()`。

*适用版本：当前所有 LSE 版本*

## LSE 文档里找不到 `File.readFrom` 等 API（文件系统页面链接失效），这些 API 还存在吗？

这些 API 依然存在，只是文档站迁移过。文件相关 API 现位于 <https://levimc.org/zh-Hans/LegacyScriptEngine/apis/SystemAPI/File/>。`File.readFrom(path[,isBinary])` 仍可正常使用（自 0.19.1 起支持 `isBinary` 参数）。

如发现文档遗漏，可向 LiteLDev/liteldev.github.io 仓库（`content/LegacyScriptEngine/pages`）提交 PR。

## LSE 有没有统一的配置文件接口？LeviLamina 提供默认的配置目录吗？

LSE 中通常使用 `new JsonConfigFile(path[,default])`，其中 `path` 由开发者自行决定，可选的 `default` 参数用于指定文件不存在时写入的默认内容。

在 C++ 层面，LeviLamina 为 mod 提供了 `config`、`data`、`lang` 三个默认目录（通过 `Mod::getConfigDir` / `getDataDir` / `getLangDir` 获取），但并没有完全由加载器托管的统一配置机制。

## LSE 中通过 `let b = a.getTag("xxx")` 取得子 NBT，然后在 `setTimeout` 等延迟回调里使用 `b` 时数据已被销毁/崩溃，是什么原因？

这是 LSE NBT 绑定的生命周期问题：`getTag` 返回的子 NBT 对象仅持有指向父 NBT 内部数据的裸指针，而不持有父（根）NBT 的引用。一旦父对象 `a` 被垃圾回收，子对象 `b` 指向的数据也会随之销毁。规避方法：在脚本中持久持有根 NBT 对象（如存入全局变量），或先用 `toSNBT()` / `toObject()` 转为其他形式保存，需要时再用 `NBT.parseSNBT` 等方法转回。

*适用版本：当前所有版本（截至 LSE 0.23.1）*
