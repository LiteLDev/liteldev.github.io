# iListenAttentively

## How do I intercept an Enderman picking up a block in an LSE plugin? How does a C++ mod use the iListenAttentively (ila) event library?

LSE: use the native `onEndermanTakeBlock` event (callback `function(entity, block, pos)`, return `false` to intercept). It has been available since LSE 0.11.3, and in the current version it is implemented internally on top of ila's `MobTakeBlockBeforeEvent`.

C++ mod: use iListenAttentively's `ila::mc::MobTakeBlockBeforeEvent` (interceptable). In `xmake.lua`:

```lua
add_repositories("levimc-repo https://github.com/LiteLDev/xmake-repo.git")
add_requires("ilistenattentively 0.18.*")
```

Then call `add_packages("ilistenattentively")` in the target, and register a listener with `ll::event::EventBus::getInstance().emplaceListener<ila::mc::MobTakeBlockBeforeEvent>(...)`. The server must have iListenAttentively installed (`lip install github.com/LiteLDev/iListenAttentively`); choose the ila version that matches your LeviLamina version.

*Applies to: LSE 0.11.3 and later (`onEndermanTakeBlock`); iListenAttentively 0.14.0 and later, currently 0.18.0 (LeviLamina 26.60.\*)*

## How does a LeviLamina C++ mod listen to the player item drop event? It is not in the LeviLamina API or source. Do I need to hook it myself?

LeviLamina does not provide this event, and you do not need to hook it yourself. Instead, use `ila::mc::PlayerDropItemBeforeEvent` (which can be intercepted) or `PlayerDropItemAfterEvent` from iListenAttentively (ila, the official LiteLDev event extension library: <https://github.com/LiteLDev/iListenAttentively>). In xmake, once you have added levimc-repo, simply add `add_requires("ilistenattentively")` (its version tracks LeviLamina and is currently `0.18.*`).

*Applies to: iListenAttentively 0.14.0 and later; current 0.18.0 matches LeviLamina 26.60.\**
