# 🎨 Basic Game API

> The following APIs provide the ability to **modify** and **extension** game content.

Obviously, the game element interface is at the core of the entire plug-in system, which is related to the ability to control and expand game content.  
LSE provides a rich and powerful interface of game elements to facilitate your creativity.

## 🔮 Game Element Objects

For the indexing of game elements, LSE uses a special type of variable to keep track of each game element, and calls it "xx objects", such as "player objects" or "block objects".  
You can think of it as a unique identifier for a game element.   

Currently, LSE has the following game element objects:

| Object Type Name | Object Name                      | Purpose of Object                                                       |
| ---------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `IntPos`         | Integer Coordinate Object        | Identifies integer location (like block coordinates)                    |
| `FloatPos`       | Floating Point Coordinate Object | Identifies a floating point position (like entity coordinates)          |
| `DirectionAngle` | Direction Object                 | Identifies angle information (such as the direction a player is facing) |
| `Player`         | Player Object                    | Identify player or access player attributes                             |
| `Entity`         | Entity Object                    | Identify entity or access entity attributes                             |
| `Block`          | Block Object                     | Identify Block or access block attributes                               |
| `Item`           | Item Object                      | Identifies an item in an inventory                                      |
| `Container`      | Container Object                 | Identifies a container that can store items                             |
| `BlockEntity`    | Block Entity Object              | Identifies a block entity                                               |
| `Objective`      | Scoring Item Objective           | Identifies the scoring items of a scoreboard system                     |

You will come across them frequently in subsequent documentation.





## 🎯 Coordinate Object

In games, numerous APIs require coordinates.
The engine uses objects of type `IntPos` and `FloatPos` to indicate coordinates, called "coordinate objects".
Each member of the coordinate object is **readable and writable**.

1. `IntPos` object
    Its members are all **integers**, which are mostly used to represent **block coordinates** and other positions represented by integers.
    For a variable pos of type `IntPos`, there are the following members: 

   | Member    | Meaning        | Data Type |
   | --------- | -------------- | --------- |
   | pos.x     | x coordinate   | `Integer` |
   | pos.y     | y coordinate   | `Integer` |
   | pos.z     | z coordinate   | `Integer` |
   | pos.dim   | Dimension name | `String`  |
   | pos.dimid | Dimension ID   | `Integer` |

    Among them, the value of the **dimension ID** attribute is: `0` represents the Main World, `1` represents The Nether, and `2` represents The End.
   
    **Dimension text name:** The values of the attributes are: "Overworld", "Nether", "End".

   If in some cases the dimension is invalid, or cannot be obtained, you will find that the value of `dimid` is `-1`.

   

2. `FloatPos`object
    Its members are all **floating point numbers**, which are mostly used to represent **entity coordinates** and other positions that cannot be represented by integers  
    For a variable pos of type `FloatPos`, there are the following members:  

   | Member    | Meaning        | Data Type |
   | --------- | -------------- | --------- |
   | pos.x     | x coordinate   | `Float`   |
   | pos.y     | y coordinate   | `Float`   |
   | pos.z     | z coordinate   | `Float`   |
   | pos.dim   | Dimension Name | `String`  |
   | pos.dimid | Dimension ID   | `Integer` |

   Among them, the value of the **dimension ID** attribute is: `0` represents The Main World, `1` represents The Nether, and `2` represents The End.
   
   **Dimension text name:** The values of the attributes are: "Overworld", "Nether", "End"

   If in some case the dimension is invalid, or cannot be obtained, you will find that the value of `dimid` is `-1`.



### Coordinate Object Auxiliary Interface

For scripting languages ​​that naturally support object-oriented, you can directly construct the coordinate object and pass in the x, y, z, dimid parameters.
For some languages ​​that support general object orientation, LSE also provides auxiliary interfaces to help generate a coordinate object more easily.

#### Generate an Integer Coordinate Object

[JavaScript] `new IntPos(x,y,z,dimid)`  
[Lua] `IntPos(x,y,z,dimid)`

- Parameters: 
  - x : `Integer`  
    X coordinate.
  - y : `Integer`  
    Y coordinate.
  - z : `Integer`  
    Z coordinate.
  - dimid : `Integer`  
    Dimension ID: `0` represents the Overworld, `1` represents The Nether, and `2` represents The End.
- Return value: An integer coordinate object.
- Return value type: `IntPos`

#### Generate a Floating Point Coordinate Object

[JavaScript] `new FloatPos(x,y,z,dimid)`  
[Lua] `FloatPos(x,y,z,dimid)`

- Parameters: 
  - x : `Float`  
    X coordinate.
  - y : `Float`  
    Y coordinate.
  - z : `Float`  
    Z coordinate.
  - dimid : `Integer`  
    Dimension ID: `0` represents the Overworld, `1` represents The Nether, and `2` represents The End.
- Return value: A floating-point coordinate object.
- Return value type: `FloatPos`



## 📐 Bearing Angle Object

The engine uses a `DirectionAngle` object (called a "direction angle object") to represent an Euler angle. Its two members are **floating point numbers**, commonly used to represent directional data such as an entity's orientation. Each member of the direction angle object is **readable and writable**. 

A `DirectionAngle` variable ang has the following members:  

| Member    | Meaning                    | Data Type |
| --------- | -------------------------- | --------- |
| ang.pitch | Pitch angle (-90° ~ 90°)   | `Float`   |
| ang.yaw   | Yaw angle (rotation angle) | `Float`   |

Because the MC entity system has no concept of roll, there is no roll angle data.



##### Create Direction Angle

[JavaScript] `new DirectionAngle(pitch, yaw)`  
[Lua] `DirectionAngle(pitch, yaw)`

- Parameters: 
  - pitch : `Float`  
    Pitch angle.
  - yaw : `Float`  
    Yaw angle.
- Return value: A direction angle object.
- Return value type: `DirectionAngle`



##### Convert Direction Angle to Base Heading

`ang.toFacing()`

- Return value: The cardinal direction indicated by the current direction angle object.
- Return value type: `Integer`

Returns `0-3`, representing the four cardinal directions: **North, East, South, West**. Use this to quickly determine the general direction an entity is facing.

## Get Structure NBT

`mc.getStructure(pos1, pos2, ignoreBlocks = false, ignoreEntities = false)`

- Parameters:

  - pos1 : `IntPos` Diagonal coordinate 1, specified like the `from` parameter of the [fill command](https://minecraft.wiki/w/Commands/fill "view in wikipedia").
  - pos2 : `IntPos` Diagonal coordinate 2, specified like the `to` parameter of the [fill command](https://minecraft.wiki/w/Commands/fill "View in Wikipedia").
  - ignoreBlocks : `Boolean` Whether to ignore blocks.
  - ignoreEntities : `Boolean` Whether to ignore entities.
- Return value type : `NbtCompound`

## Set Structure NBT

`mc.setStructure(nbt, pos, mirror = 0, rotation = 0)`

- Parameters:

  - nbt : `NbtCompound`
  - pos : `IntPos` Placement coordinates.
  - mirror : `Integer` Mirror mode:
    - `0: no mirror` `1: X-axis` `2: Z-axis` `3: XZ-axis`
  - rotation : `Integer` Rotation angle:
    - `0: no rotation` `1: rotation 90°` `2: rotation 180°` `3: rotation 270°`
- Return value type : `Boolean`
