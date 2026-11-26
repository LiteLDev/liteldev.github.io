# 📮 Block Entity Object API

In LSE, "block entity objects" are used to read and manipulate the additional data associated with a block.
Note: A **Block Entity Object** is not an **Entity**! There is no special relationship between them.

### Get a Block Entity Object

#### Obtained From Blocks


For an existing block object `bl`, call:

`bl.getBlockEntity()` 

- Return value: The block's block entity object.
- Return value type: `BlockEntity`
  - A return value of `Null` means that retrieving the block entity object failed, or that this block **doesn't** have a corresponding entity object.

> Note: Do not save a block entity object for long-term use.
> When the corresponding block is destroyed, the block entity object becomes invalid. If you need to work with a block entity over time, retrieve a fresh block entity object using the method above.




### Block Entity Object - Properties

Every block entity object has the following fixed properties. For a given block entity object `be`:

| Attributes | Meaning                                            | Data Type |
| ---------- | -------------------------------------------------- | --------- |
| be.name    | The block entity name (example: `container.chest`) | `String`  |
| be.pos     | The coordinates where the block entity is located. | `IntPos`  |
| be.type    | The Type ID of the block entity object.            | `Integer` |

These object properties are read-only and cannot be modified.



### Block Entity Object - Function

Every block entity object provides member functions (methods) that you can call. For a given block entity object `be`, you can perform the following operations:

#### Get the Block Entity's NBT Object 

`be.getNbt()`

- Return value: The NBT object of the block entity.
- Return value type: `NbtCompound`



#### Write to the Block Entity's NBT object 

`be.setNbt(nbt)`

- Parameters:
  - nbt : `NbtCompound`  
    The NBT object.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

For more information on using NBT objects, see [NBT Interface Documentation](../NbtAPI/NBT.md).



#### Get the Block Entity's Block Object

`be.getBlock()`

- Return value: The block entity's block object.
- Return value type: `Block`

#### Set Block Entity Custom Name

!!! warning
    This function is only available in 0.19.1 and later.

`be.setCustomName(name)`

- Parameters:
  - name : `String`
    The new custom name for the block entity.
- Return value: Whether setting the name succeeded.
- Return value type: `Boolean`

#### Get Block Entity Custom Name

!!! warning
    This function is only available in 0.19.1 and later.

`be.getCustomName()`

- Return value: The block entity's custom name.
- Return value type: `String`


