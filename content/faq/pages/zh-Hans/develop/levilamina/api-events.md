# LeviLamina 模组 API：事件

## LeviLamina 有没有玩家“预加入”（连接服务器、早于进入世界/`PlayerJoinEvent`）的事件可以监听？

有，可使用 `PlayerConnectEvent`（`ll::event::PlayerConnectEvent`）。该事件在 `PlayerJoinEvent` 之前触发，支持取消，且可从中获取 `networkIdentifier()` 和 `connectionRequest()`。使用时需 `#include "ll/api/event/player/PlayerConnectEvent.h"`，再通过 `ll::event::EventBus::getInstance().emplaceListener<ll::event::PlayerConnectEvent>(...)` 订阅。

*适用版本：LeviLamina 0.4 及以上至当前版本（服务端）*

## C++ mod 中监听服务器启动事件时报错（clangd 也报错），文档里没写需要 include 什么，怎么办？

需要包含 `EventBus` 的头文件和对应事件的头文件：

```cpp
#include "ll/api/event/EventBus.h"
#include "ll/api/event/server/ServerStartedEvent.h"
```

然后在 mod 主类的 `load`/`enable` 等函数中，通过 `ll::event::EventBus::getInstance().emplaceListener<ll::event::ServerStartedEvent>(...)` 订阅事件（请保存返回的 listener，以便在 `disable` 时移除）。其他事件的头文件位于 `ll/api/event/` 下按类别划分的子目录中（如 `server`、`player`、`entity`、`world`、`command` 等）。

*适用版本：LeviLamina 1.x 及以上*

## LeviLamina C++ mod 中如何拦截（取消）一个事件？

对于可取消事件（继承自 `ll::event::Cancellable<...>` 的事件，如 `PlayerChatEvent`、`ExecutingCommandEvent` 等），在监听回调中调用 `event.cancel()`（等价于 `setCancelled(true)`）即可拦截。不可取消的事件没有该方法。

## LeviLamina C++ mod 中想监听玩家执行命令，参照 LLSE 的写法监听器触发不了，应该监听哪个事件？

这说明监听的事件类型不对。监听命令相关操作应使用 `ll::event::ExecutingCommandEvent`（执行前触发，可调用 `cancel` 拦截）或 `ExecutedCommandEvent`（执行后触发）。这两个事件定义在 `ll/api/event/command/ExecuteCommandEvent.h` 中，可通过 `ll::event::EventBus::getInstance().emplaceListener<...>(...)` 注册。具体用法可参考官方文档的事件 API 与事件指南。

## LeviLamina mod 中监听两个不同事件时，是否需要分别定义/获取两次 `EventBus`？

不需要。`EventBus` 是单例，使用同一个 `ll::event::EventBus::getInstance()` 分别对两个事件调用 `emplaceListener<EventA>(...)` 和 `emplaceListener<EventB>(...)` 即可，同时保存返回的 `ListenerPtr` 以便在 `disable` 时调用 `removeListener`。

*适用版本：所有版本*

## LeviLamina 中直接销毁自己持有的 `ListenerPtr` 而不调用 `EventBus` 的 `removeListener`，会有问题吗？

不会有问题。`ListenerPtr` 是 `std::shared_ptr<ListenerBase>`，`EventBus` 内部也持有一份引用，因此销毁自己持有的 `ListenerPtr` 不会导致崩溃或悬垂指针。但请注意，这样做并不会注销监听器，监听器仍会继续接收事件；如需停止监听，应调用 `EventBus::getInstance().removeListener(listener)`。模组卸载时，`EventBus` 会通过 `removeModListeners` / `clearMod` 清理该模组的所有监听器。

*适用版本：LeviLamina 1.x 及以上*

## LeviLamina 的事件监听能否指定优先级？例如聊天翻译类插件如何避免与其他聊天插件冲突？

可以。创建 Listener 时可传入 `ll::event::EventPriority`（可选值为 `Highest`/`High`/`Normal`/`Low`/`Lowest`，默认为 `Normal`），例如 `EventBus::getInstance().emplaceListener<PlayerChatEvent>(callback, EventPriority::High)`。高优先级的监听器会先处理事件，因此可借此先于普通聊天插件处理或修改消息。一般不建议随意使用 `Highest`，以免与其他插件产生兼容性问题。

*适用版本：所有版本*

## 照着 LeviLamina 文档写玩家加入事件监听，编译时提示找不到事件类型，怎么办？

LeviLamina 的每个事件都定义在单独的头文件中，使用哪个事件就必须 `#include` 对应的头文件，仅引入 `EventBus` 是不够的。例如：

```cpp
#include "ll/api/event/player/PlayerJoinEvent.h"

ll::event::EventBus::getInstance().emplaceListener<ll::event::PlayerJoinEvent>([](ll::event::PlayerJoinEvent& ev){ /* ... */ });
```

（`player` 是 inline namespace，写 `ll::event::PlayerJoinEvent` 或 `ll::event::player::PlayerJoinEvent` 均可。）此外，修改代码后请先保存再编译。

*适用版本：所有 LeviLamina 版本*
