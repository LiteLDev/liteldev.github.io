# Item Guide

## Basic Introduction

Items are an essential part of Minecraft. Common internal classes include:

ItemStack -> ItemStackBase: Stores an item and its associated data.

Item: Represents the concept of an item and stores its basic properties.

## ItemStack

Roughly speaking, an ItemStack holds the data for an item in a slot, including its count, enchantments, durability, and so on.

### Creating an ItemStack

You can create an ItemStack in several ways:

```cpp
// Create an ItemStack from an item name, count and aux value:
ItemStack stack;
stack.reinit("minecraft:diamond", 1, 0);

// Create an ItemStack from an NBT CompoundTag:
ItemStack::fromTag(tag);
```
For more details, see the [ItemStack.h](https://github.com/LiteLDev/LeviLamina/blob/main/src/mc/world/item/ItemStack.h) header file provided by LeviLamina.

## Item

An Item holds the basic properties of an ItemStack, such as the item's name and maximum stack size.

LeviLamina does not yet provide an interface for registering custom items. This will be added in a future version.

## Some Notes

Because you are modifying a server-side ItemStack, you need to synchronize any changes to the client. Otherwise, the client and server will fall out of sync, which can cause issues.

If the ItemStack is stored in an entity, you can call `Mob::refreshInventory()` to refresh the entity's inventory.