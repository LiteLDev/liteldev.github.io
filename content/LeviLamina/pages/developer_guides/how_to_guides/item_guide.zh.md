# 物品相关指南

## 基本介绍

物品是 Minecraft 的重要组成部分，常见的内部类有：

ItemStack -> ItemStackBase：物品栈，存储该物品的 Item 及相关数据。

Item：概念意义上的物品，存储该物品的基本信息。


## 物品栈

粗略来讲，物品栈就是物品在槽位中的信息，包括数量、附魔、耐久等。

### 物品栈的创建

创建物品栈的方法有很多种：

```cpp
// 通过物品名称、数量和特殊值创建物品栈：
ItemStack stack;
stack.reinit("minecraft:diamond", 1, 0);

// 通过NBT（CompoundTag）创建物品栈：
ItemStack::fromTag(tag);
```
更多详情请查看 LeviLamina 提供的头文件 [ItemStack.h](https://github.com/LiteLDev/LeviLamina/blob/main/src/mc/world/item/ItemStack.h)。

## 物品

物品承载物品栈的基本信息，包括名称、最大堆叠数量等。

LeviLamina 目前尚未提供自定义物品的注册接口，该部分内容将在后续版本中提供。

## 一些注意事项

修改服务端的物品栈后，必须将其同步到客户端，否则客户端与服务端数据不一致会导致问题。

如果该物品栈存储在实体中，可以调用 `Mob::refreshInventory()` 刷新实体的背包。
