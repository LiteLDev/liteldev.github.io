# LeviLamina 模组 API：玩家与实体

## BDS 中玩家相关类（`SimulatedPlayer`、`ServerPlayer`、`Player` 等）的继承关系是怎样的？

继承链为 `SimulatedPlayer` → `ServerPlayer` → `Player` → `Mob` → `Actor`（`Player` 和 `Actor` 之间还有一层 `Mob`，`Mob` 是带 AI 逻辑的生物，例如 `aiStep`）。客户端对应的类是 `LocalPlayer`（`LocalPlayer` → `Player`）。

## C++ 代码 `player.getOrCreateUniqueID()` 返回 `ActorUniqueID`，这个 API 在哪里有文档？

这是 MC 原生的 C++ API，没有官方文档，需要在 LeviLamina 提供的头文件中查找：该函数声明于 `mc/world/actor/Actor.h`（`ActorUniqueID const& getOrCreateUniqueID() const;`），而 `Player` 继承自 `Actor`。平时可以直接在头文件中搜索，或借助 IDE 的自动补全功能查找。

## LeviLamina C++ 插件中如何获取玩家 UUID 的字符串形式？

调用 `player.getUuid().asString()`。其中 `getUuid()` 返回 `mce::UUID const&`，再调用 `asString()` 即可转为字符串（`mce::UUID` 也支持显式转换 `std::string(uuid)`）。

## LeviLamina 中如何通过 xuid 获取玩家对象？直接调用 `Level::getPlayerByXuid` 报错/内存错误。

`getPlayerByXuid` 是 `Level` 的成员（虚）函数，而非静态函数，不能自行声明或构造 `Level`。应通过 LL 服务获取全局 `Level`：`ll::service::getLevel()` 返回 `optional_ref<Level>`，使用时需判空，例如：

```cpp
if (auto level = ll::service::getLevel()) {
    Player* p = level->getPlayerByXuid(xuid);
    if (p) {
        // ...
    }
}
```

*适用版本：所有版本*

## LeviLamina 插件中如何实现生存模式下的飞行（类似生存飞行插件）？

调用 LeviLamina 提供的 `Player::setAbility(AbilitiesIndex::MayFly, true)`（关闭时传入 `false`）。在当前实现中，`setAbility` 内部会自动同步 `Canfly` 标志，并向该玩家发送 `UpdateAbilitiesPacket` 和 `UpdateAdventureSettingsPacket`，无需手动发包。如果直接修改 `LayeredAbilities`，则需要自行发送 `UpdateAbilitiesPacket` 才能在客户端生效。LSE 中也有对应的封装。

## 在 LeviLamina mod 中如何获取实体的主手和副手物品？只找到了获取护甲的函数。

在当前版本的 LeviLamina 头文件中，获取主手物品使用虚函数 `Actor::getCarriedItem()`，获取副手物品使用 `Actor::getOffhandSlot()`，二者与 `getArmor` 一样定义在 `Actor` 类中；此外，`Mob` 类还提供了 `getAllHandEquipment()`，可一次性获取所有手持装备。查找时可在 `Actor.h` / `Mob.h` 中不区分大小写地搜索 `carried` / `offhand`。

*适用版本：LeviLamina 当前版本*

## 在 LeviLamina 中如何给玩家播放声音？找不到能直接用的播放声音数据包怎么办？

简单的做法是调用 `Level`（`ILevel`）上的 `playSound` 系列函数，例如 `playSound(LevelSoundEvent, Vec3 const&, float volume, float pitch)` 或 `playSound(PlaySoundOptions const&)`。

如果只需播放给特定玩家，可以直接构造数据包并发送，例如 `PlaySoundPacket(...).sendTo(player);`（Packet 自带 `sendTo(Player const&)` 方法）。Packet 临时对象会按 RAII 机制自动析构，无需手动释放。也可以参考原版 `playsound` 指令的实现。

*适用版本：LeviLamina 当前版本*

## 开发 mod 时如何判断玩家是触屏还是键鼠，以决定发表单还是容器 UI？

不要根据操作系统判断，而应根据玩家当前的输入方式判断：`PlayerAuthInputPacket` 的负载（`PlayerAuthInputPacketPayload`）包含 `mInputMode` 字段（枚举 `InputMode`：`Mouse`=1、`Touch`=2、`GamePad`=3），可以通过监听或 hook 该数据包获取；登录时的 `ConnectionRequest` 中也带有 `currentInputMode`。键鼠（`Mouse`）发送容器界面，触屏（`Touch`）发送表单。注意玩家可以中途切换输入方式，因此应以最近一次收到的值为准。

## 用 C++（LeviLamina mod）怎么给背包里指定物品设置自定义 lore？

获取到 `ItemStack` 后，调用 `item.setCustomLore(std::vector<std::string>{...})` 设置 lore，调用 `item.clearCustomLore()` 清除，调用 `getCustomLore()` 读取。具体可参考 LSE 的实现：<https://github.com/LiteLDev/LegacyScriptEngine/blob/develop/src/legacy/api/ItemAPI.cpp> 中的 `ItemClass::setLore`。修改完成后，需调用 `player.refreshInventory()` 刷新玩家背包，客户端才会显示出来。

*适用版本：当前 LeviLamina 版本*
