# iListenAttentively

## LSE 插件中如何拦截末影人搬运方块？C++ mod 如何使用 iListenAttentively（ila）事件库？

LSE：现已提供原生事件 `onEndermanTakeBlock`（回调签名为 `function(entity, block, pos)`，返回 `false` 即可拦截；自 LSE 0.11.3 起提供，当前版本内部基于 ila 的 `MobTakeBlockBeforeEvent` 实现），直接使用即可。

C++ mod：使用 iListenAttentively 的 `ila::mc::MobTakeBlockBeforeEvent`（可拦截）。在 `xmake.lua` 中添加：

```lua
add_repositories("levimc-repo https://github.com/LiteLDev/xmake-repo.git")
add_requires("ilistenattentively 0.18.*")
```

并在 target 中添加 `add_packages("ilistenattentively")`，然后通过 `ll::event::EventBus::getInstance().emplaceListener<ila::mc::MobTakeBlockBeforeEvent>(...)` 监听。服务端需安装 iListenAttentively（`lip install github.com/LiteLDev/iListenAttentively`），版本号请根据当前 LeviLamina 版本选择对应的 ila 版本。

*适用版本：LSE 0.11.3 及以上（`onEndermanTakeBlock`）；iListenAttentively 0.14.0 及以上，当前为 0.18.0（对应 LeviLamina 26.60.\*）*

## LeviLamina C++ mod 如何监听玩家丢弃物品事件？LeviLamina 的 API 和源码里都找不到，需要自己 hook 吗？

LeviLamina 本体没有该事件，但无需自己 hook，直接使用 iListenAttentively（ila，LiteLDev 官方事件扩展库，<https://github.com/LiteLDev/iListenAttentively>）提供的 `ila::mc::PlayerDropItemBeforeEvent`（可拦截）和 `PlayerDropItemAfterEvent` 即可。在 xmake 中添加 levimc-repo 后，加入 `add_requires("ilistenattentively")`（版本需与 LeviLamina 对应，当前为 `0.18.*`）。

*适用版本：iListenAttentively 0.14.0 及以上；当前 0.18.0 对应 LeviLamina 26.60.\**
