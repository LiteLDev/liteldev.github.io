# 🏷️ NBT API

> **NBT（二进制命名标签**，**N**amed **B**inary **T**ags**）** 格式是 Minecraft 用于在文件中存储数据的格式。  
> NBT 格式以树形结构配以众多*标签*来存储数据。每个标签都有独立的 ID 和名称。
>
> --- Minecraft Wiki

本节提供了在脚本中操作 **NBT** 数据的接口。对 **NBT** 接口的支持极大地提高了游戏的可扩展性。

游戏中使用称为 **NBT标签 **的节点来标识一项 NBT 数据。NBT 标签可以储存普通数据、List、Compound 等多种数据类型。  

在 LegacyScriptEngine 中，每种 NBT 数据类型都有对应的数据类型，统称为「NBT 对象」。  
脚本引擎类型与 NBT 数据类型的对照如下：

| NBT数据类型 | 对应的NBT对象类型 | 类型说明（来自MC Wiki）       |
| ----------- | ----------------- | ----------------------------- |
| `Byte`      | `NbtByte`         | 有符号字节或布尔值（8 位）    |
| `Short`     | `NbtShort`        | 有符号短整型（16 位）         |
| `Int`       | `NbtInt`          | 有符号整型（32 位）           |
| `Long`      | `NbtLong`         | 有符号长整型（64 位）         |
| `Float`     | `NbtFloat`        | 单精度浮点数                  |
| `Double`    | `NbtDouble`       | 双精度浮点数                  |
| `ByteArray` | `NbtByteArray`    | 字节数组                      |
| `String`    | `NbtString`       | UTF-8 字符串                  |
| `List`      | `NbtList`         | NBT 列表（类似于数组）        |
| `Compound`  | `NbtCompound`     | NBT 标签（类似于键值对列表）  |

不同数据类型的接口略有差异，下文将逐一介绍。



## 🎈  NBT 对象通用接口

每个 NBT 对象都包含一些可调用的成员函数（成员方法）。  
所有类型的 NBT 对象都支持以下通用接口。下面以名为 `nbt` 的 NBT 对象为例：

#### 获取NBT对象储存的数据类型

`nbt.getType()`

- 返回值：此 NBT 对象储存的数据类型
- 返回值类型：`Enum`

可能的返回值有：`NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### 将NBT对象转换为JSON字符串

`nbt.toString([space])`

- 参数
  - space : `Integer`  
    （可选参数）用于格式化输出字符串。  
    表示每一级缩进的空格数，使生成的字符串更易阅读。  
    默认为 -1，即不格式化输出字符串。
- 返回值：对应的 JSON 字符串
- 返回值类型：`String`

提示：如果该 NBT 对象储存的是 `List` 或 `Compound` 类型，则会递归展开为 `Array` 或 `Object`。  
如果储存的是 `ByteArray` 类型，输出的字节串会先经过 base64 编码。

> 该函数输出的字符串符合 JSON 标准格式，但无法反序列化。  
> 如需反序列化，请使用 NBT 标签类提供的 **SNBT** 接口。


#### 将 NBT 对象转换为 SNBT 字符串

`nbt.toSNBT([space[,format]])`

- 参数
  - space : `Integer`
    （可选参数）缩进空格数。传入 `-1` 或省略时不进行格式化输出。
  - format : `Enum`
    （可选参数）SNBT 输出格式，使用 `SnbtFormat` 枚举中的值。
- 返回值：对应的 SNBT 字符串
- 返回值类型：`String`

调用 `nbt.toSNBT()` 时，默认使用 `SnbtFormat.ForceQuote`。  
调用 `nbt.toSNBT(space)` 且 `space >= 0` 时，默认使用 `SnbtFormat.PartialLineFeed`。  
如需显式指定其他 SNBT 格式，请使用 `nbt.toSNBT(space, format)`。


## 🎨 SnbtFormat 枚举

`SnbtFormat` 是供 `nbt.toSNBT([space[,format]])` 使用的枚举。

可用的枚举值如下：

| 枚举值 | 数值 | 说明 |
| ------ | ---- | ---- |
| `SnbtFormat.Minimize` | `0` | 最小化输出。 |
| `SnbtFormat.CompoundLineFeed` | `1` | 对 Compound 成员进行换行。 |
| `SnbtFormat.ArrayLineFeed` | `2` | 对数组 / 列表内容进行换行。 |
| `SnbtFormat.Colored` | `4` | 为输出添加颜色格式。 |
| `SnbtFormat.Console` | `8` | 使用面向控制台的格式。 |
| `SnbtFormat.ForceAscii` | `16` | 强制使用 ASCII 输出。 |
| `SnbtFormat.ForceQuote` | `32` | 强制字符串使用引号输出。 |
| `SnbtFormat.CommentMarks` | `64` | 添加注释风格标记。 |
| `SnbtFormat.Jsonify` | `96` | 预设组合：`ForceQuote | CommentMarks`。 |
| `SnbtFormat.PartialLineFeed` | `1` | `CompoundLineFeed` 的别名。 |
| `SnbtFormat.AlwaysLineFeed` | `3` | 预设组合：`CompoundLineFeed | ArrayLineFeed`。 |
| `SnbtFormat.PrettyFilePrint` | `1` | `PartialLineFeed` 的别名。 |
| `SnbtFormat.PrettyChatPrint` | `5` | 预设组合：`PrettyFilePrint | Colored`。 |
| `SnbtFormat.PrettyConsolePrint` | `13` | 预设组合：`PrettyFilePrint | Colored | Console`。 |

其中 `CompoundLineFeed`、`ArrayLineFeed`、`Colored`、`Console`、`ForceAscii`、`ForceQuote`、`CommentMarks` 是位标记。  
其余项是预设组合或别名。


