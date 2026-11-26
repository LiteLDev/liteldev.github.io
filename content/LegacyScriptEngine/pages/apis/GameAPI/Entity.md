# 🎈 Entity Object API

In LSE, "entity objects" are used to manipulate entities and obtain information about them.

### In LSE, “Entity Objects” Are Used to Manipulate and Obtain Information About an Entity.

#### Get From Event or API

You can obtain an entity object from BDS by registering an **event listener** function or by calling a **returning entity
object** function.
For details, see [Event listener documentation - EventAPI](../EventAPI/Listen.md).

#### Get All Currently Loaded Entities

This function returns an array of entity objects, each corresponding to a loaded entity.

`mc.getAllEntities()`

- Return value: List of entity objects.
- Return value type: `Array<Entity,Entity,...>`

### Get entities in a specified area

`mc.getEntities(startPos[,range])`  
`mc.getEntities(startPos,endPos[,range])`

- Parameters:
    - startPos : `IntPos` / `FloatPos`  
      The starting position of the search.
    - endPos : `IntPos` / `FloatPos`  
      The ending position of the search.
    - range : `Number`  
      The search radius.
- Return value: List of entity objects.
- Return value type: `Array<Entity,Entity,...>`

#### Acquired From Existing Entitys

Use this function to manually generate an entity object from **entity information**. Note that the target entity must be online; otherwise, generation will fail.

!!! warning
    This function is only available in 0.9.5 and later.

`mc.getEntity(info)`

- Parameters:
    - info : `Number`  
      The entity's UniqueId or RuntimeId.
- Return value: The generated entity object.
- Return value type: `Entity`
    - A return value of `Null` indicates that retrieving the entity failed.

#### Spawn New Creature and Get Its Entity Object

This function spawns a new creature at the specified location and returns its corresponding entity object.

`mc.spawnMob(name,pos)`  
`mc.spawnMob(name,x,y,z,dimid)`

- Parameters:
    - name : `String`  
      The namespaced ID of the creature, such as `minecraft:creeper`.
    - pos : `IntPos `/ `FloatPos`  
      The coordinates where the mob is spawned (alternatively, use x, y, z, and dimid to specify the spawn location).
- Return value: The generated entity object.
- Return value type: `Entity`
    - A return value of `Null` indicates that spawning failed.

> Note: Do not store an entity object **long-term**.
> When the underlying entity is destroyed, its corresponding entity object becomes invalid.
> If you need to work with an entity over a long period, retrieve a fresh entity object in real time using the methods above.

#### Summon New Creature and Get Its Entity Object

!!! warning
    This function is only available in 0.19.1 and later.

This function summons a new creature at the specified location and returns its corresponding entity object.

`mc.summonMob(name,pos[,event])`  
`mc.summonMob(name,x,y,z,dimid[,event])`

- Parameters:
    - name : `String`  
      The namespaced ID of the creature, such as `minecraft:creeper`.
    - pos : `IntPos `/ `FloatPos`  
      The coordinates where the mob is spawned (alternatively, use x, y, z, and dimid to specify the spawn location).
    - event : `String`  
      Optional initialization event name.
- Return value: The generated entity object.
- Return value type: `Entity`
    - A return value of `Null` indicates that summoning failed.

> Note: Do not store an entity object **long-term**.
> When the underlying entity is destroyed, its corresponding entity object becomes invalid.
> If you need to work with an entity over a long period, retrieve a fresh entity object in real time using the methods above.

#### Load Creature From NBT and Get Its Entity Object

!!! warning
    This function is only available in 0.19.1 and later.

This function spawns a creature with the specified NBT data at the specified location and returns its corresponding entity object.

`mc.loadMob(nbt,pos)`  
`mc.loadMob(nbt,x,y,z,dimid)`

- Parameters:
    - nbt : `NbtCompound`  
      The creature's NBT object.
    - pos : `IntPos `/ `FloatPos`  
      The coordinates where the mob is spawned (alternatively, use x, y, z, and dimid to specify the spawn location).
- Return value: The generated entity object.
- Return value type: `Entity`
    - A return value of `Null` indicates that spawning failed.

#### Clone A Creature and Get Its Entity Object

Clones a creature at the specified location and returns the new entity object.

`mc.cloneMob(entity,pos)`  
`mc.cloneMob(entity,x,y,z,dimid)`

- Parameters:
    - entity : `Entity`  
      The entity object to clone.
    - pos : `IntPos `/ `FloatPos`  
      A coordinate object for where to spawn the mob (or use x, y, z, and dimid to specify the spawn location).
- Return value: The cloned entity object.
- Return value type: `Entity`
    - Returns `Null` if spawning fails.

> Note: Do not save an entity object **long-term**.
> When the underlying entity is destroyed, its entity object becomes invalid.
> If you need to work with an entity over time, fetch a fresh entity object using the methods above.

### Entity Object - Properties

Every entity object has a fixed set of properties. A specific entity object `en` has the following properties:

| Attributes               | Meaning                                                | Data Type        |
|--------------------------|--------------------------------------------------------|------------------|
| en.name                  | Entity name                                            | `String`         |
| en.type                  | Entity type name                                       | `String`         |
| en.id                    | Entity's in-game ID                                    | `Integer`        |
| en.pos                   | Entity's coordinates                                   | `FloatPos`       |
| en.posDelta              | Entity's motion (position delta per tick)              | `FloatPos`       |
| en.feetPos               | Coordinates of the entity's legs                       | `FloatPos`       |
| en.blockPos              | Coordinates of the block the entity is standing on     | `IntPos`         |
| en.maxHealth             | Entity's maximum health                                | `Integer`        |
| en.health                | Entity's current health                                | `Integer`        |
| en.canFly                | Whether the entity can fly                             | `Boolean`        |
| en.canFreeze             | Whether the entity can be frozen                       | `Boolean`        |
| en.canSeeDaylight        | Whether the entity can see daylight                    | `Boolean`        |
| en.canPickupItems        | Whether the entity can pick up items                   | `Boolean`        |
| en.inAir                 | Whether the entity is in the air                       | `Boolean`        |
| en.inWater               | Whether the entity is in water                         | `Boolean`        |
| en.inLava                | Whether the entity is in lava                          | `Boolean`        |
| en.inRain                | Whether the entity is in rain                          | `Boolean`        |
| en.inSnow                | Whether the entity is in snow                          | `Boolean`        |
| en.inWall                | Whether the entity is on a wall                        | `Boolean`        |
| en.inWaterOrRain         | Whether the entity is in water or rain                 | `Boolean`        |
| en.inWorld               | Whether the entity is in the world                     | `Boolean`        |
| en.speed                 | Entity's current speed                                 | `Float`          |
| en.direction             | Entity's orientation                                   | `DirectionAngle` |
| en.uniqueId              | Entity's unique identifier                             | `String`         |
| en.runtimeId             | Entity's runtime identifier (added in 0.9.5)           | `String`         |
| en.isInvisible           | Whether the entity is invisible                        | `Boolean`        |
| en.isInsidePortal        | Whether the entity is inside a portal                  | `Boolean`        |
| en.isTrusting            | Whether the entity is trusted                          | `Boolean`        |
| en.isTouchingDamageBlock | Whether the entity is touching a damage block          | `Boolean`        |
| en.isOnFire              | Whether the entity is on fire                          | `Boolean`        |
| en.isOnGround            | Whether the entity is on the ground                    | `Boolean`        |
| en.isOnHotBlock          | Whether the entity is on a hot block (magma, etc.)     | `Boolean`        |
| en.isTrading             | Whether the entity is trading                          | `Boolean`        |
| en.isRiding              | Whether the entity is riding                           | `Boolean`        |
| en.isDancing             | Whether the entity is dancing                          | `Boolean`        |
| en.isSleeping            | Whether the entity is sleeping                         | `Boolean`        |
| en.isAngry               | Whether the entity is angry                            | `Boolean`        |
| en.isBaby                | Whether the entity is a baby                           | `Boolean`        |
| en.isMoving              | Whether the entity is moving                           | `Boolean`        |

These properties are read-only and cannot be modified.

- For a detailed explanation of the **entity's current orientation** attribute, see the [Basic Game Interface Documentation](./Basic.md).
- **coordinates** and **leg coordinates**: If an entity is two blocks high, `pos` differs from `feetPos`. `pos` is the coordinate at the entity's eye level, while `feetPos` is the coordinate of the block where its legs are located.

### Entity Object - Function

Each entity object has member functions (methods) that you can call. For a specific entity object `en`, you can perform operations on the entity using the following functions:

#### Teleport Entity to Specified Location

`en.teleport(pos[,rot])`  
`en.teleport(x,y,z,dimid[,rot])`

- Parameters:
    - pos : `IntPos `/ `FloatPos`  
      Target position coordinates (or use x, y, z, and dimid to specify the entity's position).

    - rot: `DirectionAngle`

      (Optional) The entity's orientation after teleporting. Defaults to its orientation before teleporting.
- Return value: Whether the teleport succeeded.
- Return value type: `Boolean`

#### Set the Entity's Motion

`en.setPosDelta(delta)`  
`en.setPosDelta(x,y,z)`

- Parameters:
    - delta : `FloatPos`  
      The entity's new motion (position delta per tick), or use x, y, and z to set it.
- Return value: Whether the change succeeded.
- Return value type: `Boolean`

#### Kill the Specified Entity

`en.kill()`

- Return value: Whether the entity was killed.
- Return value type: `Boolean`

#### Make the Specified Entity Despawn

`en.despawn()`

- Return value: Whether the entity despawned.
- Return value type: `Boolean`

#### Remove the Specified Entity

`en.remove()`

- Return value: Whether the entity was removed.
- Return value type: `Boolean`

#### Inflict Damage to Entities

`en.hurt(damage[,type[,source]])`

- Parameters:
    - damage : `Float`  
      The amount of damage to deal to the entity.
    - type : `Integer`  
      (Optional) Actor Damage Cause. Defaults to `0` (`ActorDamageCause.Override`).
    - source: `Entity`  
      (Optional) The source of the damage.
- Return value: Whether the damage was dealt.
- Return value type: `Boolean`

Note that this deals true damage, which cannot be reduced by protective equipment such as armor.

| `ActorDamageCause` ENUM            | Value |
| ---------------------------------- | --- |
| `ActorDamageCause.None`            | -1 |
| `ActorDamageCause.Override`        | 0 |
| `ActorDamageCause.Contact`         | 1 |
| `ActorDamageCause.EntityAttack`    | 2 |
| `ActorDamageCause.Projectile`      | 3 |
| `ActorDamageCause.Suffocation`     | 4 |
| `ActorDamageCause.Fall`            | 5 |
| `ActorDamageCause.Fire`            | 6 |
| `ActorDamageCause.FireTick`        | 7 |
| `ActorDamageCause.Lava`            | 8 |
| `ActorDamageCause.Drowning`        | 9 |
| `ActorDamageCause.BlockExplosion`  | 10 |
| `ActorDamageCause.EntityExplosion` | 11 |
| `ActorDamageCause.Void`            | 12 |
| `ActorDamageCause.SelfDestruct`    | 13 |
| `ActorDamageCause.Magic`           | 14 |
| `ActorDamageCause.Wither`          | 15 |
| `ActorDamageCause.Starve`          | 16 |
| `ActorDamageCause.Anvil`           | 17 |
| `ActorDamageCause.Thorns`          | 18 |
| `ActorDamageCause.FallingBlock`    | 19 |
| `ActorDamageCause.Piston`          | 20 |
| `ActorDamageCause.FlyIntoWall`     | 21 |
| `ActorDamageCause.Magma`           | 22 |
| `ActorDamageCause.Fireworks`       | 23 |
| `ActorDamageCause.Lightning`       | 24 |
| `ActorDamageCause.Charging`        | 25 |
| `ActorDamageCause.Temperature`     | 26 |
| `ActorDamageCause.Freezing`        | 27 |
| `ActorDamageCause.Stalactite`      | 28 |
| `ActorDamageCause.Stalagmite`      | 29 |
| `ActorDamageCause.RamAttack`       | 30 |
| `ActorDamageCause.SonicBoom`       | 31 |
| `ActorDamageCause.Campfire`        | 32 |
| `ActorDamageCause.SoulCampfire`    | 33 |
| `ActorDamageCause.MaceSmash`       | 34 |
| `ActorDamageCause.All`             | 35 |

#### Heal the Entity

`en.heal(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts to heal.
- Return value: Whether the entity was healed.
- Return value type: `Boolean`

#### Set Health for Entity

`en.setHealth(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts.
- Return value: Whether setting the entity's health succeeded.
- Return value type: `Boolean`

#### Set Absorption Attribute for Entity

`en.setAbsorption(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether setting the attribute value succeeded.
- Return value type: `Boolean`

#### Set Attack Damage Attribute for Entity

`en.setAttackDamage(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether setting the attribute value succeeded.
- Return value type: `Boolean`

#### Set Maximal Attack Damage Attribute for Entity

`en.setMaxAttackDamage(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether setting the attribute value succeeded.
- Return value type: `Boolean`

#### Set Follow Range Attribute for Entity

`en.setFollowRange(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether setting the attribute value succeeded.
- Return value type: `Boolean`

#### Set Knockback Resistance Attribute for Entity

`en.setKnockbackResistance(value)`

- Parameters:
    - value : `Integer`  
      New value (0 or 1).
- Return value: Whether setting the attribute value succeeded.
- Return value type: `Boolean`

#### Set Luck Attribute for Entity

`en.setLuck(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set.
- Return value type: `Boolean`

#### Set Movement Speed for Entity

`en.setMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set.
- Return value type: `Boolean`

#### Set Underwater Movement Speed for Entity

`en.setUnderwaterMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set.
- Return value type: `Boolean`

#### Set Lava Movement Speed for Entity

`en.setLavaMovementSpeed(value)`

- Parameters:
    - value : `Integer`  
      New value.
- Return value: Whether the attribute value was set.
- Return value type: `Boolean`

#### Set Max Health for Entity

`en.setMaxHealth(health)`

- Parameters:
    - health : `Integer`  
      Number of hearts.
- Return value: Whether the entity's max health was set.
- Return value type: `Boolean`

#### Set the Specified Entity on Fire

`en.setFire(time, isEffect)`

- Parameters:
    - time : `Integer`  
      Fire duration, in seconds.
    - isEffect : `Boolean`  
      Whether to show a fire effect.
- Return value: Whether the entity was set on fire.
- Return value type:  `Boolean`

#### Put Out The Entity

`en.stopFire()`

- Return value: Whether the fire was extinguished.
- Return value type: `Boolean`

#### Scale Entity

`en.setScale(scale)`

- Parameters:
    - scale : `Float`  
      New entity size.
- Return value: Whether the entity was scaled.
- Return value type: `Boolean`

#### Set Entity Custom Name

!!! warning
    This function is only available in 0.19.1 and later.

`en.setCustomName(name)`

- Parameters:
    - name : `String`
      The entity's new custom name.
- Return value: Whether the custom name was set.
- Return value type: `Boolean`

#### Get Entity Custom Name

!!! warning
    This function is only available in 0.19.1 and later.

`en.getCustomName()`

- Return value: The entity's custom name.
- Return value type: `String`

#### Get Entity Distance To Pos

`en.distanceTo(pos)`
`en.distanceToSqr(pos)`

- Parameters:
    - pos : `Entity` / `Player` / `IntPos` / `FloatPos`
      The target position.
- Return value: Distance to the coordinates (in blocks).
- Return value type:  `Number`

#### Determine if an Entity Object Is a Player

`en.isPlayer()`

- Return value: Whether the current entity object is a player.
- Return value type:  `Boolean`

#### Convert Entity Object to Player Object

`en.toPlayer()`

- Return value: The converted `Player` object.
- Return value type:  `Player`
    - Returns `Null` if this entity object does not point to a player, or if the conversion fails.

If the current entity object points to a player, you can use this function to convert it to a player object and access player-related APIs.

#### Determine Whether an Entity Object Is a Dropped Item Entity

`en.isItemEntity()`

- Return value: Whether the current entity object is a dropped item entity.
- Return value type:  `Boolean`

#### Get the Item Object in the Drop Entity

`en.toItem()`

- Return value: The obtained `Item` object.
- Return value type:  `Item`
    - Returns `Null` if this entity object is not a drop entity, or if retrieving the item fails.

If the current entity object is a drop entity, you can use this function to get its item object and access item-related APIs.

#### Get the Block the Entity Is Currently Standing On

`en.getBlockStandingOn()`

- Return value: The block object the entity is standing on.
- Return value type:  `Block`

#### Gets the Container Object for the Mob’s Armor Slot

`en.getArmor()`

- Return value: The container object corresponding to this entity's armor slot.
- Return value type:  `Container`

For more information on using container objects, see the [Container Object API Documentation](./Container.md).

#### Determines if a Mob Has a Container (Except for the Armor Slot)

`en.hasContainer()`

- Return value: Whether this biological entity has a container.
- Return value type:  `Boolean`

For example, the boxes on an alpaca each have their own container object.

#### Get the Container Object Owned by the Mob (Except the Armor Slot)

`en.getContainer()`

- Return value: The container object owned by this biological entity.
- Return value type:  `Container`

For more information on using container objects, see the [Container Object API Documentation](./Container.md).

#### Refresh Creature Inventory, Armor Slot

`en.refreshItems()`

- Return value: Whether the refresh succeeded.
- Return value type:  `Boolean`

After modifying a creature's items, you must refresh all of its items for the changes to take effect on the client.

#### Add a Tag to the Entity

`en.addTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to add.
- Return value: Whether the `Tag` was added.
- Return value type:  `Boolean`

#### Remove a Tag From an Entity

`en.removeTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to remove.
- Return value: Whether the tag was removed.
- Return value type: `Boolean`

#### Check if an Entity Has a Tag

`en.hasTag(tag)`

- Parameters:
    - tag: `String`  
      The tag string to check.
- Return value: Whether the entity has the tag.
- Return value type: `Boolean`

#### Returns a List of All Tags Owned by the Entity

`en.getAllTags()`

- Return value: A list of all tag strings on the entity.
- Return value type: `Array<String,String,...>`

#### Get the Entity's NBT Object

`en.getNbt()`

- Return value: The entity's NBT object.
- Return value type: `NbtCompound`

#### Write to the Entity's NBT Object

`en.setNbt(nbt)`

- Parameters:
    - nbt : `NbtCompound`  
      The NBT object.
- Return value: Whether the write succeeded.
- Return value type: `Boolean`

For more information on using NBT objects, see the [NBT Interface Documentation](../NbtAPI/NBT.md).

#### Get the Entity in the Entity's Line of Sight

`en.getEntityFromViewVector([maxDistance])`

- Parameters:
    - maxDistance : `Float`  
      Maximum search distance.
- Return value: The entity in the entity's line of sight, or `Null` if none is found.
- Return value type: `Entity`

#### Get the Block in the Entity's Line of Sight

`en.getBlockFromViewVector([includeLiquid,solidOnly,maxDistance,fullOnly])`

- Parameters:
    - includeLiquid : `Boolean`  
      Whether to include liquid blocks.
    - solidOnly : `Boolean`  
      Whether to include only `Solid` blocks.
    - maxDistance : `Float`  
      Maximum search distance.
    - fullOnly : `Boolean`  
      Whether to include only full blocks.
- Return value: The block in the entity's line of sight, or `Null` if none is found.
- Return value type: `Block`

#### Get the Entity's Biome ID

`en.getBiomeId()`

- Return value: Biome ID.
- Return value type: `Integer`

#### Get the Entity's Biome Name

`en.getBiomeName()`

- Return value: Biome name.
- Return value type: `String`

#### Get entity's effects

`en.getAllEffects()`

- Return value: IDs of the effects currently on the entity.
- Return value type: `Array<Integer,Integer,...>`

#### Add an effect for entity

`en.addEffect(id, tick, level, showParticles)`

- Parameters:
    - id : `Number`
      Effect ID.
    - tick : `Number`
      Duration in ticks.
    - level : `Number`
      Effect level.
    - showParticles : `Boolean`
      Whether to display particles.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

#### Remove an effect for entity

`en.removeEffect(id)`

- Parameters:
    - id : `Number`
      Effect ID.
- Return value: Whether the operation succeeded.
- Return value type: `Boolean`

| Name            | ID |
|-----------------|----|
| speed           | 1  |
| slowness        | 2  |
| haste           | 3  |
| mining_fatigue  | 4  |
| strength        | 5  |
| instant_health  | 6  |
| instant_damage  | 7  |
| jump_boost      | 8  |
| nausea          | 9  |
| regeneration    | 10 |
| resistance      | 11 |
| fire_resistance | 12 |
| water_breathing | 13 |
| invisibility    | 14 |
| blindness       | 15 |
| night_vision    | 16 |
| hunger          | 17 |
| weakness        | 18 |
| poison          | 19 |
| wither          | 20 |
| health_boost    | 21 |
| absorption      | 22 |
| saturation      | 23 |
| levitation      | 24 |
| fatal_poison    | 25 |
| conduit_power   | 26 |
| slow_falling    | 27 |
| bad_omen        | 28 |
| village_hero    | 29 |
| darkness        | 30 |
| trial_omen      | 31 |
| wind_charged    | 32 |
| weaving         | 33 |
| oozing          | 34 |
| infested        | 35 |
| raid_omen       | 36 |
| breath_of_the_nautilus | 37 |

### Other Entity Function API

The following APIs interact with entities at specified locations in the game:

#### Create an Explosion at the Specified Location

`mc.explode(pos,source,maxResistance,radius,isDestroy,isFire)`  
`mc.explode(x,y,z,dimid,source,maxResistance,radius,isDestroy,isFire)`  
`mc.explode(pos,source,radius,isDestroy,isFire)`  
`mc.explode(x,y,z,dimid,source,radius,isDestroy,isFire)`

- Parameters:
    - pos : `IntPos `/ `FloatPos`  
      The coordinates of the explosion (or pass x, y, z, and dimid to specify the location).
    - source : `Entity`  
      The entity that caused the explosion. Can be `Null`.
    - maxResistance : `Float`  
      Maximum blast resistance. Blocks with a resistance below this value are destroyed. If omitted, there is no limit.
    - radius : `Float`  
      The explosion radius, which determines the blast area.
    - isDestroy : `Boolean`  
      Whether the explosion destroys blocks.
    - isFire : `Boolean`  
      Whether the explosion leaves fire behind.
- Return value: Whether the explosion was created.
- Return value type: `Boolean`

#### Quick execute Molang expression

`en.quickEvalMolangScript(str)`

- Parameters:
    - str : `String`  
      Molang expression string.
- Return value: The result of the Molang expression.
- Return value type: `Float`

For detailed Molang usage, see the [MOLANG Doc bedrock.dev](https://bedrock.dev/docs/stable/Molang).

