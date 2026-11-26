# 📦 Block Object API

In LSE, you use "block objects" to manipulate and inspect blocks.

### Get a Block Object

#### Get From Event or API 

You can obtain a block object from BDS by registering an **event listener** function or calling a function that **returning a block object**.
For details, see [Event listener documentation - EventAPI](../EventAPI/Listen.md).

#### Obtained by Block Coordinates

Use this function to retrieve a block object by its coordinates. Note that the target block must be in a loaded area; otherwise, errors will occur.

`mc.getBlock(pos)`  
`mc.getBlock(x,y,z,dimid)`

- Parameters: 
  - pos : `IntPos` or `FloatPos`  
    The coordinates of the block (or pass x, y, z, and dimid to specify the block position).
- Return value: The generated `Block` object. 
- Return value type: `Block`
  - If the return value is `Null`, retrieving the block failed.

> Note: Do not save a block object **long-term**.
> When the corresponding block is destroyed, the block object becomes invalid. If you need to work with a block over a long period, retrieve a fresh block object in real time using the method above.



### Block Object - Properties

Every block object has a fixed set of properties. A specific block object `bl` has the following properties:

| Attributes              | Meaning                                     | Data Type |
| ----------------------- | ------------------------------------------- | --------- |
| bl.name                 | The name of the block displayed in the game | `String`  |
| bl.type                 | Standard block type name                    | `String`  |
| bl.id                   | The in-game ID of the block                 | `Integer` |
| bl.pos                  | The coordinates of the block                | `IntPos`  |
| bl.tileData             | The block's data value                      | `Integer` |
| bl.variant              | The block variant                           | `Integer` |
| bl.translucency         | The block translucency                      | `Integer` |
| bl.thickness            | The block thickness                         | `Integer` |
| bl.isAir                | Whether the block is air                    | `Boolean` |
| bl.isBounceBlock        | Whether the block is a bounce block         | `Boolean` |
| bl.isButtonBlock        | Whether the block is a button               | `Boolean` |
| bl.isCropBlock          | Whether the block is a crop                 | `Boolean` |
| bl.isDoorBlock          | Whether the block is a door                 | `Boolean` |
| bl.isFenceBlock         | Whether the block is a fence                | `Boolean` |
| bl.isFenceGateBlock     | Whether the block is a fence gate           | `Boolean` |
| bl.isThinFenceBlock     | Whether the block is a thin fence block     | `Boolean` |
| bl.isHeavyBlock         | Whether the block is heavy                  | `Boolean` |
| bl.isStemBlock          | Whether the block is a stem                 | `Boolean` |
| bl.isSlabBlock          | Whether the block is a slab                 | `Boolean` |
| bl.isUnbreakable        | Whether the block is unbreakable            | `Boolean` |
| bl.isWaterBlockingBlock | Whether the block can block water           | `Boolean` |

These properties are read-only and cannot be modified.



#### Destroy The Block

`bl.destroy(drop)`

- Parameters:
  - drop : `Boolean`  
    Whether to generate drops.
- Return value: Whether the block was successfully destroyed.
- Return value type: `Boolean`



### Block Object - Function

Every block object provides member functions (methods) that you can call. For a specific block object `bl`, you can call the following functions to operate on the block.

#### Get the Block's NBT Object

`bl.getNbt()`

- Return value: The NBT object of the block.
- Return value type: `NbtCompound`



#### Write to the Block's NBT Object

`bl.setNbt(nbt)`

- Parameters: 
  - nbt : `NbtCompound`  
    The NBT object.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

For more details on using NBT objects, see [NBT Interface Documentation](../NbtAPI/NBT.md).
Note: Use this API with caution; consider using mc.setBlock() instead.



#### Get the BlockState of the Block 

`bl.getBlockState()`

- Return value: The BlockState of the block.
- Return value type: `Object`

A convenience function that parses the block's BlockState and converts it into an `Object` for easy reading and inspection.
Equivalent to running `block.getNbt().getTag("states").toObject()` in a script.



#### Determine if a Block Has a Container

`bl.hasContainer()`

- Return value: Whether this block has a container.
- Return value type: `Boolean`

Blocks such as boxes, buckets, and other containers each have their own container object.



#### Get the Container Object Owned by the Block

`bl.getContainer()`

- Return value: The container object owned by this block.
- Return value type: `Container`

For more information on using container objects, see the [Container Object API Documentation](Container.md).



#### Determine if a Block Has a Block Entity

`bl.hasBlockEntity()`

- Return value: Whether the block has a block entity.
- Return value type: `Boolean`



#### Get the Block Entity Owned by the Block

`bl.getBlockEntity()`

- Return value: The block entity owned by this block.
- Return value type: `BlockEntity`



#### Remove the Block Entity Owned by the Block

`bl.removeBlockEntity()`

- Return value: Whether the removal succeeded.
- Return value type: `Boolean`

For more information on using block entity objects, see the [Block entity object API documentation](BlockEntity.md).



### Other Block Function API

The following APIs interact with blocks at specified locations in the game:

#### Set the Block at the Specified Location

`mc.setBlock(pos, blockObject)`   
`mc.setBlock(pos, blockString, tileData)`  
`mc.setBlock(x, y, z, dimId, blockObject)`  
`mc.setBlock(x, y, z, dimId, blockString, tileData)`

- Parameters: 
  - pos : `IntPos ` or `FloatPos`  
    Target block position (or use x, y, z, dimId to specify the block position).
    
  - blockObject : `Block` or `NbtCompound`  
    The target block object or the NBT data representing the block.
    
  - blockString: `String`  
    The standard block type name (such as `minecraft:stone`).
  
  - tileData : `Integer`  
    Block state value, identical to the tileData parameter of the vanilla /setBlock command. Defaults to 0 and applies only when placing a block by its type name.
  
- Return value: Whether the block was set successfully.

- Return value type: `Boolean`

This function replaces the block at the given coordinates with another block, similar to the `/setblock` command.



#### Generate Particle Effects at Specified Locations

`mc.spawnParticle(pos,type)`  
`mc.spawnParticle(x,y,z,dimid,type)`

- Parameters: 
  - pos : `IntPos `/ `FloatPos`  
    Target spawn position (or use x, y, z, dimid to specify the block position).
  - type : `String`  
    The name of the particle effect to spawn (see the wiki for details).
- Return value: Whether the particle was spawned successfully.
- Return value type: `Boolean`

For particle effect names, see the [Minecraft Wiki](https://minecraft.wiki/w/Particles#Types_of_particles). Include the namespace prefix when passing this parameter, such as `minecraft:heart_particle`.
