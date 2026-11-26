# LeviLamina mod API: events

## Is there a LeviLamina event for a player "pre-join" (connecting to the server, before entering the world and before `PlayerJoinEvent`)?

Yes, use `PlayerConnectEvent` (`ll::event::PlayerConnectEvent`). It fires before `PlayerJoinEvent`, can be cancelled, and provides `networkIdentifier()` and `connectionRequest()`. Add `#include "ll/api/event/player/PlayerConnectEvent.h"`, then subscribe with `ll::event::EventBus::getInstance().emplaceListener<ll::event::PlayerConnectEvent>(...)`.

*Applies to: LeviLamina 0.4 and later, up to the current version (server)*

## Listening to the server started event in a C++ mod gives errors (clangd reports them too), and the docs don't say what to include. What should I do?

Include both the `EventBus` header and the event's header:

```cpp
#include "ll/api/event/EventBus.h"
#include "ll/api/event/server/ServerStartedEvent.h"
```

Then subscribe in a method such as `load` or `enable` on your main mod class with `ll::event::EventBus::getInstance().emplaceListener<ll::event::ServerStartedEvent>(...)` (save the returned listener so you can remove it in `disable`). Other event headers are in subdirectories of `ll/api/event/`, grouped by category (`server`, `player`, `entity`, `world`, `command`, and so on).

*Applies to: LeviLamina 1.x and later*

## How do I intercept (cancel) an event in a LeviLamina C++ mod?

For cancellable events (those that inherit from `ll::event::Cancellable<...>`, such as `PlayerChatEvent` and `ExecutingCommandEvent`), call `event.cancel()` (equivalent to `setCancelled(true)`) inside the listener callback. Events that cannot be cancelled do not have this method.

## In a LeviLamina C++ mod I want to listen for players running commands. The listener written like in LLSE never fires. Which event should I listen to?

You are listening to the wrong event type. For commands, listen to `ll::event::ExecutingCommandEvent` (fires before execution; call `cancel` to intercept it) or `ExecutedCommandEvent` (fires after execution). Both are defined in `ll/api/event/command/ExecuteCommandEvent.h` and registered with `ll::event::EventBus::getInstance().emplaceListener<...>(...)`. See the event API and the event guide in the official documentation for details.

## When listening to two different events in a LeviLamina mod, do I need to define/get the `EventBus` twice?

No. `EventBus` is a singleton: call `emplaceListener<EventA>(...)` and `emplaceListener<EventB>(...)` on the same `ll::event::EventBus::getInstance()`, and keep the returned `ListenerPtr` values so you can pass them to `removeListener` in `disable`.

*Applies to: all versions*

## Is it a problem to destroy a `ListenerPtr` I hold without calling `removeListener` on the `EventBus` in LeviLamina?

No. `ListenerPtr` is a `std::shared_ptr<ListenerBase>` and the `EventBus` also holds an internal reference, so destroying your own `ListenerPtr` will not cause a crash or a dangling pointer. However, this does not unregister the listener—it keeps receiving events. To stop listening, call `EventBus::getInstance().removeListener(listener)`. When a mod is unloaded, the `EventBus` cleans up that mod's listeners through `removeModListeners` / `clearMod`.

*Applies to: LeviLamina 1.x and later*

## Can LeviLamina event listeners specify a priority? For example, how can a chat translation plugin avoid conflicting with other chat plugins?

Yes. When creating a Listener, you can pass an `ll::event::EventPriority` (`Highest`/`High`/`Normal`/`Low`/`Lowest`, default `Normal`)—for example, `EventBus::getInstance().emplaceListener<PlayerChatEvent>(callback, EventPriority::High)`. Higher-priority listeners handle the event first, allowing you to process or modify a message before standard chat plugins see it. Avoid using `Highest` unless necessary to prevent compatibility issues with other plugins.

*Applies to: all versions*

## I followed the LeviLamina documentation to write a player join event listener, but the compiler can't find the event type. What should I do?

Each LeviLamina event has its own header, so you must `#include` the header for every event you use; including `EventBus` alone is not enough. For example:

```cpp
#include "ll/api/event/player/PlayerJoinEvent.h"

ll::event::EventBus::getInstance().emplaceListener<ll::event::PlayerJoinEvent>([](ll::event::PlayerJoinEvent& ev){ /* ... */ });
```

(`player` is an inline namespace, so both `ll::event::PlayerJoinEvent` and `ll::event::player::PlayerJoinEvent` work.) Also make sure you save your source files before compiling.

*Applies to: all LeviLamina versions*
