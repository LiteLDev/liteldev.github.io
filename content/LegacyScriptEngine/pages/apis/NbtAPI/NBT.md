# 🏷️ NBT API

> **NBT** (**N**amed **B**inary **T**ags) format is a storage format used in Minecraft to store data into files.
> The NBT format stores data in a tree structure with many *tags*. All tags have an independent ID and name.
>
> --- Minecraft Wiki

This API lets scripts manipulate the **NBT** data type. **NBT** interface support greatly improves the scalability of the game.

In the game, a node called an **NBT tag** identifies an item of NBT data. NBT tags can store a variety of data types, such as ordinary data, List, and Compound.

In LegacyScriptEngine, each NBT data type has a corresponding data type; together, they are called "NBT objects".
The following table compares LSE types with NBT data types:

| NBT Data Type | Corresponding NBT Object Type | Type Description (Wiki)                         |
| ------------- | ----------------------------- | ----------------------------------------------- |
| `Byte`        | `NbtByte`                     | Signed byte or boolean (8 bits)                 |
| `Short`       | `NbtShort`                    | Signed Short (16-bit)                           |
| `Int`         | `NbtInt`                      | Signed Integer (32-bit)                         |
| `Long`        | `NbtLong`                     | Signed Long (64-bit)                            |
| `Float`       | `NbtFloat`                    | Single precision floating point number          |
| `Double`      | `NbtDouble`                   | Double precision floating point number          |
| `ByteArray`   | `NbtByteArray`                | Byte Array                                      |
| `String`      | `NbtString`                   | UTF-8 string                                    |
| `List`        | `NbtList`                     | NBT List (similar to array)                     |
| `Compound`    | `NbtCompound`                 | NBT Tags (Similar to a list of Key-Value pairs) |

Each data type may have a slightly different interface. They are described separately below:



## 🎈 NBT Object Generic Interface 

Each NBT object has executable member functions (member methods).  
Assume an NBT object named `nbt`. Any kind of NBT object provides the following general interfaces:

#### Get the Data Type Stored by the NBT Object 

`nbt.getType()`

- Return value: The data type stored by this NBT object.
- Return value type: `Enum`

Possible return values are: `NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### Convert NBT Object to JSON String 

`nbt.toString([space])`

- Parameter:
  - space : `Integer`  
    (Optional parameter) Pass this parameter to format the output string.  
    Specifies the number of spaces per indent to make the output string more readable.  
    Defaults to `-1`, which leaves the output string unformatted.
- Return value: The JSON form of the NBT object.
- Return value type: `String`

Hint: If this NBT object stores a `List` or `Compoundtype`, it expands recursively into an `Array` or `Object`.
If this NBT object stores the `ByteArray` type, the output byte string is base64-encoded before output.

> The string returned by this function conforms to the standard JSON format, but it cannot be deserialized.
> If you need deserialization, use the **SNBT** interface provided by the NBT tag class.


#### Convert NBT Object to SNBT String

`nbt.toSNBT([space[,format]])`

- Parameter:
  - space : `Integer`
    (Optional parameter) Indent width. Pass `-1` or omit it to disable pretty formatting.
  - format : `Enum`
    (Optional parameter) SNBT output format, using a value from the `SnbtFormat` enum.
- Return value: The SNBT form of the NBT object.
- Return value type: `String`

Calling `nbt.toSNBT()` uses `SnbtFormat.ForceQuote` by default.  
Calling `nbt.toSNBT(space)` with `space >= 0` uses
`SnbtFormat.PartialLineFeed`.  
If you need to specify another SNBT format explicitly, use
`nbt.toSNBT(space, format)`.


## 🎨 SnbtFormat Enum

`SnbtFormat` is the enum used by `nbt.toSNBT([space[,format]])`.

The following values are available:

| Enum Value                  | Numeric Value | Description |
|----------------------------|---------------|-------------|
| `SnbtFormat.Minimize`      | `0`           | Minimal output. |
| `SnbtFormat.CompoundLineFeed` | `1`        | Insert line feeds for compound members. |
| `SnbtFormat.ArrayLineFeed` | `2`           | Insert line feeds for arrays and lists. |
| `SnbtFormat.Colored`       | `4`           | Add color formatting to the output. |
| `SnbtFormat.Console`       | `8`           | Use console-oriented formatting. |
| `SnbtFormat.ForceAscii`    | `16`          | Force ASCII output. |
| `SnbtFormat.ForceQuote`    | `32`          | Force quoted string output. |
| `SnbtFormat.CommentMarks`  | `64`          | Add comment-style marks. |
| `SnbtFormat.Jsonify`       | `96`          | Preset: `ForceQuote | CommentMarks`. |
| `SnbtFormat.PartialLineFeed` | `1`         | Alias for `CompoundLineFeed`. |
| `SnbtFormat.AlwaysLineFeed` | `3`          | Preset: `CompoundLineFeed | ArrayLineFeed`. |
| `SnbtFormat.PrettyFilePrint` | `1`         | Alias for `PartialLineFeed`. |
| `SnbtFormat.PrettyChatPrint` | `5`         | Preset: `PrettyFilePrint | Colored`. |
| `SnbtFormat.PrettyConsolePrint` | `13`    | Preset: `PrettyFilePrint | Colored | Console`. |

`CompoundLineFeed`, `ArrayLineFeed`, `Colored`, `Console`, `ForceAscii`, `ForceQuote`, and `CommentMarks` are bit flags.  
The remaining entries are predefined combinations or aliases.


