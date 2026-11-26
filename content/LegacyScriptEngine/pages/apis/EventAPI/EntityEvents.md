# 🎈 Entity Related Events

#### `"onMobDie"` - Mob/Player Death Event

- Listener function prototype:
  `function(mob,source,cause)`
- Parameters:
    - mob : `Entity`  
      The dead entity object.
    - source : `Entity`  
      The entity object that dealt the final damage (may be `Null`).
    - cause : `Integer`   
      The cause of the damage.
- Intercept event: Cannot be intercepted.

Note that when a player dies, this event triggers once in addition to the `onPlayerDie` event.

#### `"onMobHurt"` - Mob/Player Hurt Event

- Listener function prototype:
  `function(mob,source,damage,cause)`
- Parameters:
    - mob : `Entity`  
      The damaged entity.
    - source : `Entity`  
      The entity that dealt the damage (may be `Null`).
    - damage : `Float`  
      The amount of damage dealt.
    - cause : `ActorDamageCause`   
      The cause of the damage.

- Intercept event: Return `false` from the function.

The values of `ActorDamageCause` are:

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

#### `"onEntityExplode"` - Entity Explosion Event

- Listener function prototype:
  `function(source,pos,radius,maxResistance,isDestroy,isFire)`
- Parameters:
    - source : `Entity`  
      The entity object that caused the explosion.
    - pos : `FloatPos`  
      The coordinates of the explosion.
    - radius : `Float`    
      The blast radius.
    - maxResistance : `Float`  
      The maximum blast resistance of blocks that will break.
    - isDestroy : `Boolean`  
      Whether the explosion destroys blocks.
    - isFire : `Boolean`  
      Whether the explosion produces fire.

- Intercept event: Return `false` from the function.

#### `"onMobTrySpawn"` - Mob try Naturally Spawn Event

- Listener function prototype:
  `function(typeName,pos)`
- Parameters:
    - typeName : `String`  
      The entity name.
    - pos : `FloatPos`  
      The spawn coordinates.

- Intercept event: Return `false` from the function.

#### `"onMobSpawned"` - Mob Naturally Spawn Finished Event

- Listener function prototype:
  `function(entity,pos)`
- Parameters:
    - entity: `Entity`  
      The spawned entity.
    - pos : `FloatPos`  
      The spawn coordinates.

- Intercept event: Cannot be intercepted.

You can call entity.despawn() or entity.remove() to remove the spawned entity.

#### `"onPortalTrySpawnPigZombie"` - Nether Portal Try Spawn Zombified Piglin Event

- Listener function prototype:
  `function(pos,axis)`
- Parameters:
    - pos : `IntPos`
      The coordinates of the portal block where the spawn attempt occurred.
    - axis : `Integer`
      The portal axis enum value (`0` = Unknown, `1` = X, `2` = Z).

- Intercept event: Return `false` from the function.

#### `"onProjectileHitEntity"` - Entity Hit by Projectile Event

- Listener function prototype:
  `function(entity,source)`
- Parameters:
    - entity: `Entity`  
      The entity hit by the projectile.
    - source : `Entity`  
      The projectile entity (such as an arrow).
- Intercept event: Return `false` from the function.

#### `"onWitherBossDestroy"` - Block Broken by Wither Event

- Listener function prototype:
  `function(witherBoss,AAbb,aaBB)`
- Parameters:
    - witherBoss: `Entity`  
      The Wither entity object.
    - AAbb: `IntPos`
      Corner A of the bounding box that the Wither will destroy.
    - aaBB: `IntPos`
      The opposite corner B of the bounding box that the Wither will destroy.

- Intercept event: Return `false` from the function.

Note that this event does not include damage from the Wither's explosions.

#### `"onRide"` - Mob Ride Event

- Listener function prototype
  `function(entity1,entity2)`
- Parameters:
    - entity1 : `Entity`  
      The entity that is riding the other entity.
    - entity2 : `Entity`  
      The entity that is being ridden.
- Intercept events: function returns `false`

Note: Riding includes minecarts, boats, horses, pigs, and similar entities.

#### `"onStepOnPressurePlate"` - Pressure Plate Step Event

- Listener function prototype
  `function(entity,pressurePlate)`
- Parameters:
    - entity : `Entity`  
      The entity that stepped on the plate.
    - pressurePlate : `Block`  
      The pressed pressure plate block.
- Intercept events: function returns `false`

Note: This event triggers repeatedly while a creature stands on a pressure plate.

#### `"onSpawnProjectile"` - Projectile Spawn Event

- Listener function prototype
  `function(shooter,type)`
- Parameters:
    - shooter : `Entity`  
      The entity that fired the projectile.
    - type : `String`  
      Standard type name of the projectile.

- Intercept events: function returns `false`

Note: Projectiles that can be intercepted include eggs, ender pearls, snowballs, tridents, arrows, and fishing rods (fish hooks).

#### `"onProjectileCreated"` - Projectile Created Event

- Listener function prototype
  `function(shooter,entity)`
- Parameters:
    - shooter : `Entity`  
      The entity that created the projectile.
    - entity : `Entity`  
      The projectile entity object being created.

- Intercept event: cannot be intercepted.

#### `"onNpcCmd"` - NPC Command Execution Event

!!! warning
    This event is only available in 0.9.6 and later versions.

- Listener function prototype
  `function(npc,pl,cmd)`
- Parameters:
    - npc : `Entity`  
      The NPC entity that executed the command.
    - pl : `Player`  
      The player that triggered the NPC command.
    - cmd : `String`  
      The command executed by the NPC. Multiple commands are separated by `;`.
- Intercept events: function returns `false`

#### `"onChangeArmorStand"` - Armor Stand Change Event

- Listener function prototype
  `function(as,pl,slot)`

- Parameters:

    - as: `Entity`  
      The manipulated armor stand entity object.
    - pl : `Player`  
      The player that manipulated the armor stand.
    - slot : `Number`
      Equipment slot number.

- Intercept events: function returns `false`

#### `"onEntityTransformation"` - Entity Transformation Event

- Listener function prototype
  `function(uniqueId,entity)`
- Parameters:

    - uniqueId: `String`
      Unique identifier of the entity before transformation.
    - entity : `Entity`
      The transformed entity.
- Intercept event: cannot be intercepted.

Note: This event triggers when the `TransformationComponent` of an entity in `Addons` is activated, and is mainly used for interaction between the engine and the Addon. Because the entity pointer from before the transformation is quickly destroyed, only its `UniqueId` is provided.

#### `"onEndermanTakeBlock"` - Enderman Take Block Event

!!! warning
    This event is only available in 0.11.3 and later versions.

- Listener function prototype
  `function(entity, block, pos)`
- Parameters
    - entity : `Entity`  
      The Enderman entity.
    - block : `Block`  
      The block being picked up.
    - pos : `IntPos`  
      The coordinates of the block.
- Intercept events: function returns `false`
