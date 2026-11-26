# LegacyScriptEngine API: entities

## `entity.hurt()` in LSE needs an integer damage type. How do I get the enum values? Can the `cause` from the `onMobHurt` event be passed straight to `hurt()`?

LSE registers a global damage-cause enum object, `DamageCause`, and keeps `ActorDamageCause` with the same contents for compatibility. Its keys are the enum names and its values are ints, so you can use them directly—for example, `pl.hurt(1.0, ActorDamageCause.Fire)` or `pl.hurt(1.0, DamageCause.Fire)`. The signature of `hurt` is `hurt(damage, type?, source?)`. The `cause` parameter of the `onMobHurt` callback is the integer value of this enum and can be passed directly to `hurt()`. For the authoritative enum definition, see `src/mc/deps/shared_types/legacy/actor/ActorDamageCause.h` in the LeviLamina source (the enum table in the docs may be incomplete).

*Applies to: current LSE version*

## In an LSE JS plugin, using an entity object as a Map key or comparing two entity objects with `==` fails to find or match them. What should I do?

Every entity or player object returned by LSE is a freshly created JS wrapper with no custom equality logic, so comparing two objects with `==`/`===` or using them as Map keys never matches. Compare or key by the entity's `uniqueId` instead—for example, `Boss.find(entity => entity.uniqueId == mob.uniqueId)`.

## Which parameters does `entity.distanceTo()` accept in LSE? Passing `pos.x`/`pos.y`/`pos.z` gives a parameter type error or `too few arguments`. What should I do?

With a single argument, `distanceTo` accepts an IntPos, FloatPos, Player, or Entity—pass a position object such as `player.pos` directly rather than splitting it into `.x` `.y` `.z`. Otherwise, pass 4 numeric arguments: `x, y, z, dimid` (passing only 3 causes an argument-count error). For example:

```js
const pos = player.pos;
if (entity.distanceTo(pos) > R) { /* ... */ }
```

If the target is in a different dimension from the entity, the return value is a very large number (`INT_MAX`). Player also has a `distanceTo` method with the same name, along with the alias `distanceToPos`.

## In LSE, why does checking whether an entity is a player with `entity.isPlayer` (without parentheses) always succeed?

`isPlayer` is a function, so call it with parentheses: `entity.isPlayer()` (just like `pl.isOP()`). Without parentheses, you are evaluating the function object itself, which is always truthy because the function exists.

## In LSE, how do I convert an entity object (Entity) to a player object (Player)?

Use `en.toPlayer()`. It returns `null` if the entity is not a player or the conversion fails, so you can check with `en.isPlayer()` first. This API is documented on the "Entity" page and in the d.ts type definitions in the legacy-script-engine-api repository (`GameAPI/Entity/Entity.d.ts`). To convert in the opposite direction, use `pl.toEntity()`.

## How do I apply an impulse or velocity to a player in LSE (like `applyImpulse` in ScriptAPI)?

Use `setPosDelta` on `Entity`: call `player.toEntity().setPosDelta(x, y, z)`, or pass a `FloatPos` with `en.setPosDelta(delta)`. This sets the entity's per-tick position change (its motion), works on players as well, and returns whether it succeeded.

## How do I attach custom data to an entity (like custom NBT on an item), and how do I get a single entity by `uniqueId` in LSE?

You can store the data in your plugin's own data file using the entity's `uniqueId`, or add a tag to the entity with `en.addTag(tag)` (`Actor::addTag` in C++). To get a single entity by `uniqueId`, use `mc.getEntity(id)` (added in LSE 0.9.5), which takes the entity's `UniqueId` or `RuntimeId` and returns `null` on failure. You can also iterate through the results of `mc.getAllEntities()` or `mc.getEntities(...)` to find it.

*Applies to: LegacyScriptEngine 0.9.5 and later*
