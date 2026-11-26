# LeviLamina mod API: players and entities

## What is the inheritance hierarchy of the player classes in BDS (`SimulatedPlayer`, `ServerPlayer`, `Player`, and so on)?

The hierarchy is `SimulatedPlayer` → `ServerPlayer` → `Player` → `Mob` → `Actor`. Note the `Mob` layer between `Player` and `Actor`; `Mob` represents a creature with AI logic (such as `aiStep`). On the client, the counterpart is `LocalPlayer` (`LocalPlayer` → `Player`).

## `player.getOrCreateUniqueID()` in C++ returns an `ActorUniqueID`. Where is this API documented?

This is an internal Minecraft C++ API with no official documentation. Check the headers provided by LeviLamina: the function is declared in `mc/world/actor/Actor.h` (`ActorUniqueID const& getOrCreateUniqueID() const;`), and `Player` inherits from `Actor`. In practice, search the headers directly or rely on IDE autocompletion.

## How do I get the string form of a player's UUID in a LeviLamina C++ plugin?

Call `player.getUuid().asString()`. `getUuid()` returns `mce::UUID const&`, and `asString()` converts it to a string (`mce::UUID` also supports explicit conversion via `std::string(uuid)`).

## How do I get a player object by xuid in LeviLamina? Calling `Level::getPlayerByXuid` directly gives an error or a memory fault.

`getPlayerByXuid` is a virtual member function of `Level`, not a static function, and you cannot instantiate a `Level` yourself. Instead, get the global `Level` through the LL service: `ll::service::getLevel()` returns an `optional_ref<Level>`, which you must check before use:

```cpp
if (auto level = ll::service::getLevel()) {
    Player* p = level->getPlayerByXuid(xuid);
    if (p) {
        // ...
    }
}
```

*Applies to: all versions*

## How do I implement flying in survival mode in a LeviLamina plugin (like a survival-fly plugin)?

Call LeviLamina's `Player::setAbility(AbilitiesIndex::MayFly, true)` (pass `false` to turn it off). In the current implementation, `setAbility` syncs the `Canfly` flag internally and sends `UpdateAbilitiesPacket` and `UpdateAdventureSettingsPacket` to the player, so you do not need to send packets manually. If you modify `LayeredAbilities` directly, you must send `UpdateAbilitiesPacket` yourself for the change to take effect on the client. LSE also provides a corresponding wrapper.

## How do I get an entity's main-hand and off-hand items in a LeviLamina mod? I only found the function for armor.

In the current LeviLamina headers, use `Actor::getCarriedItem()` (a virtual function) for the main-hand item and `Actor::getOffhandSlot()` for the off-hand item. Like `getArmor`, both are defined in the `Actor` class. The `Mob` class also provides `getAllHandEquipment()` to get all hand-held equipment at once. When searching `Actor.h` or `Mob.h`, do a case-insensitive search for `carried` or `offhand`.

*Applies to: LeviLamina current version*

## How do I play a sound to a player in LeviLamina? What if I cannot find a ready-to-use sound packet?

The simplest approach is to use the `playSound` family of functions on `Level` (`ILevel`), such as `playSound(LevelSoundEvent, Vec3 const&, float volume, float pitch)` or `playSound(PlaySoundOptions const&)`.

To send a sound to a single player only, construct the packet directly and send it—for example, `PlaySoundPacket(...).sendTo(player);` (Packet provides its own `sendTo(Player const&)` method). Because RAII destroys the temporary Packet object automatically, you do not need to free it manually. You can also refer to the implementation of the vanilla `playsound` command.

*Applies to: LeviLamina current version*

## How do I tell whether a player is using touch or keyboard and mouse, so I can decide between sending a form or a container UI?

Check the player's current input mode rather than their operating system. You can listen to or hook `PlayerAuthInputPacket` and read the `mInputMode` field from its payload (`PlayerAuthInputPacketPayload`). This field uses the `InputMode` enum (`Mouse`=1, `Touch`=2, `GamePad`=3). The `ConnectionRequest` sent at login also includes `currentInputMode`. Send a container UI for keyboard and mouse (`Mouse`) and a form for touch (`Touch`). Because players can switch input modes at any time, always use the most recently received value.

## How do I set a custom lore on a specific item in the inventory using C++ (a LeviLamina mod)?

Once you have the `ItemStack`, call `item.setCustomLore(std::vector<std::string>{...})` to set the lore, `item.clearCustomLore()` to clear it, and `getCustomLore()` to read it. For reference, see the LSE implementation of `ItemClass::setLore` in <https://github.com/LiteLDev/LegacyScriptEngine/blob/develop/src/legacy/api/ItemAPI.cpp>. After modifying the item, you must call `player.refreshInventory()` for the changes to appear on the client.

*Applies to: current LeviLamina version*
