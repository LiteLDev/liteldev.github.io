# 📒 NbtCompound - Tag Type

An `NbtCompound` represents a complete tag that stores a series of key-value pairs, much like an object or table.  
Only the `NbtCompound` object interface can perform certain operations unique to NBT tags.

### Get an NBT Tag Object

#### Parse From an Existing NBT Object 

See the [NbtList - List Type](./NBTList.md) and [NbtCompound - Tag Type](./NBTCompound.md) documentation.



#### Create a New NBT Tag Object

[JavaScript]  `new NbtCompound([data])`  
[Lua] `NbtCompound([data])`

- Parameter: 
  - data: Object<string, NBT Object> (Optional parameter)  
    An object consisting of NBT objects. The object may contain nested array or object structures, provided their contents are NBT objects. `Null` values are treated as `NBT.End`.
- Return value: The generated NBT object.
- Return value type: `NbtCompound`
  - Throws an exception if creation fails.

[JavaScript]
```js
var nbt = new NbtCompound({
        "name1": new NbtInt(3),
        "name2": new NbtString("test"),
        "name3": new NbtList([
            new NbtFloat(4.0),
            new NbtFloat(6.0)
        ]),
        "name4": new NbtLong(66666)
    });
```
[Lua]
```lua
local nbt = NbtCompound({
        "name1" = NbtInt(3),
        "name2" = NbtString("test"),
        "name3" = NbtList({
            NbtFloat(4.0),
            NbtFloat(6.0)
        }),
        "name4" = NbtLong(66666)
    });
```



#### Generate NBT Tag Object From SNBT String 

`NBT.parseSNBT(snbt)`  

- Parameter: 
  - snbt : `String`  
    The SNBT string to parse.
- Return value: The generated NBT object.
- Return value type: `NBT Object`
  - Returns `Null` if parsing fails.

> Supports script-exposed SNBT value types, including normal values, `List`, and `Compound`.



#### Generate NBT Tag Objects From Binary NBT Data

`NBT.parseBinaryNBT(nbt)`  

- Parameter: 
  - nbt : `ByteBuffer`  
    The binary NBT data to parse.
- Return value: The generated NBT object.
- Return value type: `NbtCompound`
  - Returns `Null` if parsing fails.

>  The binary NBT data must contain a complete Compound.

An object `comp` of type `NbtCompound` provides the following interfaces:

#### Get All Keys

`comp.getKeys()`

- Return value: All keys in the Compound.
- Return value type: `Array<String,String,...>`



#### Get the Data Type of the Value Corresponding to the Key

`comp.getTypeOf(key)`

- Parameter: 
  - key: `String`  
    The name of the key to query.
- Return value: The data type of the corresponding value.
- Return value type: `Enum`
  - Returns `Null` if the requested NBT does not exist.

Possible return values are: `NBT.End` `NBT.Byte` `NBT.Short` `NBT.Int` `NBT.Long`   
`NBT.Float` `NBT.Double` `NBT.ByteArray` `NBT.String`  
`NBT.List` `NBT.Compound`



#### Set the NBT Object Corresponding to the Key

`comp.setTag(key,tag)`

- Parameters: 
  - key: `String`   
    The name of the key to operate on.
  - tag:  `NBT Object`  
    The NBT object to write (which carries specific NBT data). If the key already exists, the original tag is replaced. If the key does not exist, a new key-value pair is created. Passing `Null` writes `NBT.End`.
- Return value: The CompoundTag itself.
- Return value type: `NbtCompound`



#### Read the NBT Object Corresponding to the Key

`comp.getTag(key)`

- Parameter: 
  - key: `String`   
    The name of the key to operate on.
- Return value: The NBT object corresponding to the key.
- Return value type:  `NBT Object`
  - Returns `Null` if the requested NBT does not exist.



#### Check Whether a Key Exists

`comp.hasTag(key)`

- Parameter:
  - key: `String`
    The name of the key to query.
- Return value: Whether the key exists in this compound.
- Return value type: `Boolean`



#### Delete the NBT Object Corresponding to the Key 

`comp.removeTag(key)`

- Parameter: 
  - key: `String`  
    The name of the key to operate on. The key must already exist.
- Return value: The modified NBT object (for chaining further operations).
- Return value type: `NbtCompound`



## Some Convenience Functions to Assist in the Manipulation of NBT Objects

Working exclusively with NBT objects can be cumbersome and verbose when modifying individual NBT values. To simplify these operations, several convenience functions are provided. They let you read and write data at a given key directly, without wrapping values in intermediate NBT objects, which keeps your code shorter.

#### Set the Specific Data of the Value Corresponding to the Key

`comp.setEnd(key)`  
`comp.setByte(key,data)`  
`comp.setShort(key,data)`  
`comp.setInt(key,data)`  
`comp.setLong(key,data)`  
`comp.setFloat(key,data)`  
`comp.setDouble(key,data)`  
`comp.setByteArray(key,data)`  
`comp.setString(key,data)`    

- Parameters: 
  - key: `String`   
    The name of the key to operate on.
  - data: `Above type`  
    The data to write.  
    If the key does not exist, it is created automatically.
- Return value: The modified NBT object (for chaining further operations).
- Return value type: `NbtCompound`



#### Read the Specific Data of the Value Corresponding to the Key

`comp.getData(key)`  

- Parameter: 
  - key: `String`   
    The name of the key to operate on.
- Return value: The data stored at the specified key.
- Return value type: `Any type`, matching the type of the stored data.
  - Returns an `NbtList` object if the target location stores a `List` NBT, or an `NbtCompound` object if it stores a `Compound` NBT.
  - Returns `Null` if the NBT to read does not exist.



#### Convert NBT Tag Object to Object

`comp.toObject()`

- Return value: The object/table representation of the NBT Tag object.
- Return value type: `Object`

Converts the contents of the Compound into an LSE object. All data items are converted to LSE data types and stored under the corresponding keys of the object, making them easy to read and process.  
If an item in the Compound stores a `List` or `Compound` NBT, it is recursively expanded in place as an `Array` or `Object`.



#### Serialize NBT Tag Object to SNBT
`comp.toSNBT([space[,format]])`

- Parameters:
  - space : `Integer`  
     (Optional) Pass this parameter to format the output string.  
    Specifies the number of spaces per indentation level to make the resulting string more human-readable.  
    Defaults to `-1`, which leaves the output string unformatted.
  - format : `Enum`
    (Optional) The SNBT output format, using a value from the `SnbtFormat` enum.
- Return value: The serialized SNBT string.
- Return value type: `String`

Calling `comp.toSNBT()` uses `SnbtFormat.ForceQuote` by default.  
Calling `comp.toSNBT(space)` with `space >= 0` uses `SnbtFormat.PartialLineFeed`.  
To specify a different SNBT format explicitly, call `comp.toSNBT(space, format)`.

> Alongside standard binary NBT, there is a plain-text form that players are more familiar with, typically used in [commands](https://minecraft.wiki/w/Commands). This format is often referred to as **SNBT** (**Binary Named Tag,**, **S**tringified **NBT**).
>
> --- Minecraft Wiki



#### Serialize NBT Tag Object to Binary NBT

`comp.toBinaryNBT()`

- Return value: The corresponding binary NBT data.
- Return value type: `ByteBuffer`
> Only complete top-level Compound tags can be converted to binary NBT.



#### Destroy This NBT Tag Object
`comp.destroy()`

- Return value: Whether the cleanup succeeded.
- Return value type: `Boolean`

Only the root Compound tag can be destroyed. Use this function with caution, as improper use will crash the server.  
Destroying objects properly helps reduce memory usage. Once destroyed, never access this NBT object or any of its sub-objects again.
