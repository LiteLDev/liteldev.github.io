# LeviLamina 模组 API：世界、方块与物品

## BDS 1.21.100 / LeviLamina 1.5 起 `BlockLegacy` 类找不到了，改成什么了？

Mojang 已将 `BlockLegacy` 更名为 `BlockType`，在代码中改用 `BlockType`（头文件为 `mc/world/level/block/BlockType.h`）即可。注意不要与枚举 `SharedTypes::v1_21_20::JigsawStructure::ProcessorRule::BlockType`（位于 `mc/deps/shared_types/v1_21_20/structure/BlockType.h`）混淆。

*适用版本：LeviLamina 1.5（BDS 1.21.100）及以上*

## C++ mod 中如何判断某个区块是否已加载？

调用 `ChunkSource` 的 `std::shared_ptr<LevelChunk> getAvailableChunk(ChunkPos const& cp)`（由 LeviLamina 以 LLAPI 导出），若返回 `nullptr`，则说明该区块未加载或尚未加载完成（状态未达到 `ChunkState::Loaded`）。`ChunkSource` 没有提供 `getAvailableChunkAt`，按方块坐标查询时需先转换坐标：`region.getChunkSource().getAvailableChunk(ChunkPos{blockPos})`。此外，也可以用 `BlockSource::hasChunk(ChunkPos const&, bool serverSideOnly)` 或 `BlockSource::getChunkAt(BlockPos const&)`（返回 `LevelChunk*`）来判断。

*适用版本：LeviLamina 26.60.x*

## LeviLamina C++ 模组中如何获取所有已加载实体？MC API 里实体类叫什么，继承关系是怎样的？

可参考 LSE 的实现：`ll::service::getLevel()->getEntities()` 返回 `std::vector<OwnerPtr<EntityContext>> const&`，遍历时先检查 `i.has_value() && i.tryUnwrap().has_value()`，再调用 `i.tryUnwrap().get()` 即可取得 `Actor&`。

BDS 中的实体基类名为 `Actor`（不存在 `Entity` 类），其继承关系为：`Mob`（生物）继承自 `Actor`，`Player` 继承自 `Mob`，`ServerPlayer` 继承自 `Player`。

## 在 LeviLamina 头文件里找不到与区块（chunk）相关的 API，应该用哪些类？LSE（LegacyScriptEngine）有区块相关 API 吗？

C++ 侧与区块相关的类主要是 `ChunkSource` 和 `LevelChunk`（位于 `mc/world/level/chunk/ChunkSource.h` 和 `LevelChunk.h`）。LSE 没有专门的区块 API（仅有 `player.refreshChunks()` 等零散接口），像为假人补充区块加载这类需求，需要用 C++ 原生 mod 实现。

*适用版本：LeviLamina 当前版本；LegacyScriptEngine 当前版本*

## 想修改生物血量，通过 `setNbt` 修改 `Attributes` 里的血量会导致进程直接退出，有更直接的办法吗？

无需修改 NBT，直接操作属性即可。当前写法是通过实体的 `AttributesComponent` 或 `Actor::getAttributes()` 获取 `BaseAttributeMap`，再调用 `setMaxValue`/`setCurrentValue`，例如：

```cpp
actor.getAttributes()->setMaxValue(SharedAttributes::HEALTH(), value);
```

也可参考 LSE 的实现：

```cpp
if (auto c = actor.getEntityContext().tryGetComponent<AttributesComponent>())
  c->mAttributes->setMaxValue(SharedAttributes::HEALTH(), value);
```

若要修改当前血量，调用 `setCurrentValue` 即可。
