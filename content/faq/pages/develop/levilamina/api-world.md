# LeviLamina mod API: world, blocks and items

## Since BDS 1.21.100 / LeviLamina 1.5 the `BlockLegacy` class can no longer be found. What was it renamed to?

Mojang renamed `BlockLegacy` to `BlockType`; use `BlockType` in your code (header `mc/world/level/block/BlockType.h`). Be careful not to confuse it with the `SharedTypes::v1_21_20::JigsawStructure::ProcessorRule::BlockType` enum (`mc/deps/shared_types/v1_21_20/structure/BlockType.h`).

*Applies to: LeviLamina 1.5 (BDS 1.21.100) and later*

## How do I check whether a chunk is loaded in a C++ mod?

Call `std::shared_ptr<LevelChunk> getAvailableChunk(ChunkPos const& cp)` on `ChunkSource` (implemented by LeviLamina as an LLAPI). It returns `nullptr` if the chunk is not loaded or has not finished loading (its state has not reached `ChunkState::Loaded`). `ChunkSource` has no `getAvailableChunkAt`; to query by block position, convert it first: `region.getChunkSource().getAvailableChunk(ChunkPos{blockPos})`. You can also use `BlockSource::hasChunk(ChunkPos const&, bool serverSideOnly)` or `BlockSource::getChunkAt(BlockPos const&)` (which returns `LevelChunk*`).

*Applies to: LeviLamina 26.60.x*

## How do I get all loaded entities in a LeviLamina C++ mod? What is the entity class called in the MC API, and what is its inheritance hierarchy?

You can follow LSE's implementation: `ll::service::getLevel()->getEntities()` returns `std::vector<OwnerPtr<EntityContext>> const&`. When iterating over it, first check `i.has_value() && i.tryUnwrap().has_value()`, then call `i.tryUnwrap().get()` to get an `Actor&`.

In BDS, the base entity class is `Actor` (there is no `Entity` class). `Mob` (living creatures) inherits from `Actor`, `Player` inherits from `Mob`, and `ServerPlayer` inherits from `Player`.

## I can't find chunk-related APIs in the LeviLamina headers. Which classes should I use? Does LSE (LegacyScriptEngine) have chunk APIs?

In C++, the main chunk classes are `ChunkSource` and `LevelChunk` (`mc/world/level/chunk/ChunkSource.h`, `LevelChunk.h`). LSE has no dedicated chunk API—only scattered interfaces such as `player.refreshChunks()`—so tasks like making chunks load for a simulated player require a native C++ mod.

*Applies to: LeviLamina current version; LegacyScriptEngine current version*

## I want to change a mob's health, but modifying the health in `Attributes` through `setNbt` makes the process exit immediately. Is there a more direct way?

You don't need to modify NBT; modify the attributes directly. Get the `BaseAttributeMap` from the entity's `AttributesComponent` or `Actor::getAttributes()`, then call `setMaxValue` or `setCurrentValue`. For example:

```cpp
actor.getAttributes()->setMaxValue(SharedAttributes::HEALTH(), value);
```

Or, following LSE:

```cpp
if (auto c = actor.getEntityContext().tryGetComponent<AttributesComponent>())
  c->mAttributes->setMaxValue(SharedAttributes::HEALTH(), value);
```

Use `setCurrentValue` to change the current health.
