# Events and Hooks

A mod has two ways to react to what the game does: it can **hook** a game function, or **listen** to an **event** published by LeviLamina. This page explains how both work and how they relate to each other. For practical instructions, see the [Hook Guide](../developer_guides/how_to_guides/hook_guide.md) and [Event Guide](../developer_guides/how_to_guides/event_guide.md); for the API reference, see [Memory & Hook](../api_reference/memory.md) and [Event](../api_reference/event.md).

## Hooks

A hook replaces a game function with a function in your mod, called the **detour**. When the game calls the function, your detour runs instead. The detour can call `origin(...)` to run the original function, modify the arguments or the return value, or skip calling the original function altogether. You specify the function to hook using a function pointer.

Several mods can hook the same function. Their detours form a chain ordered by `HookPriority` (`Highest`, `High`, `Normal`, `Low`, `Lowest`): each `origin(...)` call invokes the next detour in the chain, and the last one calls the original game function.

A hook is active only while it is installed:

- A hook declared with an `LL_AUTO_` macro is a static object in the DLL and is installed when the DLL loads, before the mod's `load()` runs.
- Any other hook is installed by calling its `hook()` method and removed by calling `unhook()`. A `ll::memory::HookRegistrar<Hooks...>` object installs its hooks when created and removes them when destroyed; a hook held by several registrars stays installed until the last one is destroyed.

## Events

An event is an object that describes something that happened, such as `PlayerJoinEvent`. Every event goes through a single `EventBus`:

- **Publishing.** The code that detects the action creates the event and calls `EventBus::publish`. The bus calls the listeners for that event type one after the other on the publishing thread.
- **Listening.** A listener is a callback registered for one event type with an `EventPriority`. Listeners are called from `Highest` to `Lowest`; listeners with the same priority are called in the order they were created.
- **Cancelling.** A listener can cancel any event that derives from `Cancellable`. Once cancelled, the bus stops calling the remaining listeners, and the publisher decides what cancelling means: a cancelled `PlayerAttackEvent`, for example, stops the attack. The [Event](../api_reference/event.md#built-in-events) page lists which built-in events can be cancelled.
- **Errors.** If a listener throws an exception, the bus catches it, logs it with the mod's name, and continues to the next listener.

## How Events Use Hooks

Most built-in events are published by hooks. For example, `PlayerAttackEvent` is published by a hook on the game function that performs the attack: the detour publishes the event and, if a listener cancels it, returns without calling the original function (see [Publishing Events](../developer_guides/how_to_guides/event_guide.md#publishing-events)).

These hooks are not installed all the time. Each event type has an **emitter**, a class that holds the event's hooks in a `HookRegistrar`. LeviLamina creates the emitter when the first listener for the event is added, and destroys it—removing its hooks—when the last listener is removed. If nothing is listening to an event, the underlying game function is not hooked.

A mod can provide its own events in the same way by defining an event class (which must be `final`), an emitter, and the hooks or code that publish it.

## Listeners Belong to Mods

Every listener belongs to a mod—by default, the mod whose code created it (`NativeMod::current()`). LeviLamina uses this ownership to clean up after a mod:

- When a mod is **disabled** while the game is running, its listeners are removed.
- When a mod is **unloaded**, its listeners are removed, along with any events the mod provided and any listeners for those events in other mods.

That is why a mod registers its listeners in `enable()`: they are removed when the mod is disabled and added again when it is re-enabled. See [Mod Lifecycle](mod_lifecycle.md).

`EventBus::publish(modName, event)` calls only the listeners that belong to the mod `modName`.

## Hook or Event?

- Use an **event** whenever one exists for what you need: it is shared across all mods, hooks the game only while someone is listening, and is automatically cleaned up with your mod.
- Use a **hook** when no event covers your use case (see the [Hook Guide](../developer_guides/how_to_guides/hook_guide.md)), and leave the priority at `Normal` unless you have a specific reason to change it.

## Related

- [Event](../api_reference/event.md) — `EventBus`, `Listener`, `EventPriority`, `Cancellable`, and the built-in events
- [Memory & Hook](../api_reference/memory.md) — the hook macros, `HookPriority`, and `HookRegistrar`
- [Architecture](../developer_guides/architecture.md) — how the event system and hooks fit into LeviLamina
