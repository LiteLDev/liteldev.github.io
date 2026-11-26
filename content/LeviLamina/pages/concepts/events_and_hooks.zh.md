# 事件与钩子

模组可以通过两种方式响应游戏中的行为：**钩住**（hook）游戏的某个函数，或者**监听** LeviLamina 发布的**事件**。本页说明这两者的工作原理及相互关系。具体用法见“如何做到”系列中的[钩子指南](../developer_guides/how_to_guides/hook_guide.md)和[事件指南](../developer_guides/how_to_guides/event_guide.md)；API 见 [Memory & Hook（内存与钩子）](../api_reference/memory.md)和 [Event（事件系统）](../api_reference/event.md)页面。

## 钩子

钩子用模组中的函数（称为 **detour**）替换游戏中的函数。游戏调用该函数时，实际运行的是你的 detour；detour 通过调用 `origin(...)` 来运行原函数，并且可以修改参数、修改返回值，甚至完全不调用原函数。要钩住的目标函数通过函数指针来指定。

多个模组可以钩住同一个函数。它们的 detour 按 `HookPriority`（`Highest`、`High`、`Normal`、`Low`、`Lowest`）排成一条调用链：每次调用 `origin(...)` 都会进入下一个 detour，最后一个 detour 才会调用游戏的原函数。

钩子安装后才会生效：

- 用 `LL_AUTO_` 宏声明的钩子是 DLL 的静态对象，会在 DLL 加载时、模组的 `load()` 运行之前自动安装。
- 其他钩子通过自身的 `hook()` 安装，通过 `unhook()` 移除。`ll::memory::HookRegistrar<Hooks...>` 对象会在创建时安装其管理的钩子，并在销毁时将其移除；如果一个钩子被多个 registrar 持有，它会一直保持安装状态，直到最后一个 registrar 销毁。

## 事件

事件是描述所发生事情的对象，例如 `PlayerJoinEvent`。所有事件都通过同一个 `EventBus` 分发：

- **发布。** 感知到某事发生的代码会创建事件并调用 `EventBus::publish`。事件总线会在调用发布的线程上，逐一调用该事件类型的监听器。
- **监听。** 监听器是针对特定事件类型、带有 `EventPriority` 的回调函数。监听器按优先级从 `Highest` 到 `Lowest` 依次调用；优先级相同的监听器按创建的先后顺序调用。
- **取消。** 派生自 `Cancellable` 的事件可由监听器取消。一旦取消，事件总线将不再调用后续监听器，而取消的具体含义由发布者决定（例如，取消 `PlayerAttackEvent` 会阻止当次攻击）。支持取消的内置事件列表见 [Event（事件系统）](../api_reference/event.md#内置事件)页面中的“内置事件”。
- **错误。** 监听器抛出的异常会被捕获，并连同其所属模组的名称记录到日志中；后续监听器仍会照常运行。

## 事件如何使用钩子

大多数内置事件都由钩子发布。例如，`PlayerAttackEvent` 由执行攻击的游戏函数上的钩子发布：detour 先发布该事件，如果有监听器将其取消，detour 就不调用原函数而直接返回（参见[事件指南](../developer_guides/how_to_guides/event_guide.md#发布事件)中的“发布事件”）。

这些底层钩子并非始终处于安装状态。每种事件类型都有一个**发射器**（emitter），它是持有该事件所需钩子的类（存放在 `HookRegistrar` 中）。LeviLamina 会在添加该事件的第一个监听器时创建发射器，并在移除最后一个监听器时销毁发射器，同时卸载其持有的钩子。因此，无人监听的事件不会钩住对应的游戏函数。

模组也可以按同样的方式提供自定义事件：定义一个事件类（必须声明为 `final`）、一个发射器，以及用于发布该事件的钩子或代码。

## 监听器属于模组

每个监听器都归属于一个模组，默认是创建它的代码所在的模组（`NativeMod::current()`）。LeviLamina 借此在模组状态变更时自动清理资源：

- 模组在游戏运行时被**禁用**时，其所有监听器都会被移除。
- 模组被**卸载**时，其监听器会被移除；该模组提供的自定义事件，以及其他模组注册在这些事件上的监听器，也会一并移除。

正因如此，模组应当在 `enable()` 中添加监听器：禁用时监听器会自动移除，再次启用时则会重新添加。参见[模组生命周期](mod_lifecycle.md)。

调用 `EventBus::publish(modName, event)` 可以只触发属于指定模组 `modName` 的监听器。

## 用钩子还是事件？

- 只要有对应的**事件**，就优先使用事件：它由所有模组共享，仅在有人监听时才安装底层钩子，并且会随你的模组自动清理。
- 没有事件覆盖的场景再使用**钩子**。可参考[钩子指南](../developer_guides/how_to_guides/hook_guide.md)；除非有特殊需求，否则请将优先级保持为 `Normal`。

## 相关文档

- [Event（事件系统）](../api_reference/event.md) — `EventBus`、`Listener`、`EventPriority`、`Cancellable` 和内置事件
- [Memory & Hook（内存与钩子）](../api_reference/memory.md) — 钩子宏、`HookPriority` 和 `HookRegistrar`
- [项目架构](../developer_guides/architecture.md) — 事件系统和钩子在 LeviLamina 中的位置
