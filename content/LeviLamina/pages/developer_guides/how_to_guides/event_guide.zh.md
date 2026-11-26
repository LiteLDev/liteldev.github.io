# 事件指南

## 介绍

LeviLamina内置了一套事件系统，既提供现成的简单事件，也支持模组发布自定义事件。  
所有内置事件均位于`ll/api/event/`目录下，并按类别存放在`command`、`entity`、`player`、`world`等子目录中。

## 监听事件

### 示例: 服务端启动完成事件

```cpp
#include "ll/api/event/EventBus.h"
#include "ll/api/event/server/ServerStartedEvent.h"

void ListenEvents() {
    using namespace ll::event;
    EventBus& bus = EventBus::getInstance();
    bus.emplaceListener<ServerStartedEvent>([](ServerStartedEvent& event) {
        // 服务端启动完成后要执行的代码
    });
}
```

## 发布事件

### 示例: 服务端启动完成事件

- 创建`ServerStartedEvent.h`头文件，并在其中定义继承自`ll::event::Event`类的`ServerStartedEvent`类。

!!! tip "关于可取消的事件"
    若希望事件可以取消，请继承`ll::event::Cancellable<ll::event::Event>`类。

- 添加该事件的类成员及获取方法，并通过`__declspec(dllexport)`导出这些方法。

!!! tip "关于LLAPI"
    LeviLamina中的`LLAPI`宏是通过在`xmake.lua`中调用`add_defines("LL_EXPORT")`预定义`LL_EXPORT`实现的：编译LeviLamina时，`LLAPI`展开为`__declspec(dllexport)`；被其它模组引用时，则展开为`__declspec(dllimport)`，供其它模组导入该方法。以下是该宏的简单实现示例，实际使用时请将`MOD_EXPORT`和`MODAPI`重命名，以免与其它模组的宏冲突：

```cpp
#ifdef MOD_EXPORT
#define MODAPI __declspec(dllexport)
#else
#define MODAPI __declspec(dllimport)
#endif
```

这样，只需在模组的`xmake.lua`中添加`add_defines("MOD_EXPORT")`，再在待导出的方法前加上`MODAPI`，即可导出模组方法。  
如果希望其它模组无需链接你的模组即可使用你提供的事件，可以将事件成员设为`public`，或直接在头文件中实现获取方法。此外，建议在事件中声明并实现`serialize`方法，以便在控制台中输出事件信息。

```cpp
#pragma once

#include "ll/api/event/Event.h"

#include "mc/server/ServerInstance.h"

namespace ll::event::inline server {
class ServerStartedEvent final : public Event {
    ServerInstance& mInstance;

public:
    constexpr explicit ServerStartedEvent(ServerInstance& server) : mInstance(server) {}

    LLAPI void serialize(CompoundTag&) const override;

    LLNDAPI ServerInstance& server() const;
};
} // namespace ll::event::inline server
```

- 在`ServerStartedEvent.cpp`中实现`ServerStartedEvent`类的`serialize`和`server`方法，并在触发事件时调用`EventBus::publish`方法。

!!! tip "关于可取消的事件"
    如果事件是可取消的，还需根据`Event::isCancelled`方法的返回值来决定是否执行取消操作。示例如下：

```cpp
LL_TYPE_INSTANCE_HOOK(
    MyCancellableEventHook,
    HookPriority::Normal,
    TargetType,
    &TargetType::targetFunction, // placeholder
    bool,
    int arg
) {
    auto ev = MyCancellableEvent(*this, arg);
    EventBus::getInstance().publish(ev);
    if (ev.isCancelled()) {
        return false;
    }
    return origin(arg);
}
```

- 在源文件中声明一个返回类型为`std::unique_ptr<EmitterBase>`的静态函数，并定义一个继承自`Emitter<emitterFactory, ServerStartedEvent>`的类（此处命名为`ServerStartedEventEmitter`），用于通过`HookRegistrar`注册Hook。
- 在该类之后实现这个返回类型为`std::unique_ptr<EmitterBase>`的静态函数，使其返回由`std::make_unique`构造的`std::unique_ptr<ServerStartedEventEmitter>`。

```cpp
#include "ll/api/event/server/ServerStartedEvent.h"
#include "ll/api/event/Emitter.h"
#include "ll/api/event/EventRefObjSerializer.h"
#include "ll/api/memory/Hook.h"

#include "mc/deps/nbt/CompoundTag.h"

namespace ll::event::inline server {

void ServerStartedEvent::serialize(CompoundTag& nbt) const {
    Event::serialize(nbt);
    nbt["server"] = serializeRefObj(server());
}

ServerInstance& ServerStartedEvent::server() const { return mInstance; }

LL_TYPE_INSTANCE_HOOK(
    ServerStartedEventHook,
    ll::memory::HookPriority::Low,
    TargetType,
    &TargetType::targetFunction, // placeholder
    void,
    ::ServerInstance& ins
) {
    origin(ins);
    EventBus::getInstance().publish(ServerStartedEvent(ins));
}

static std::unique_ptr<EmitterBase> emitterFactory();
class ServerStartedEventEmitter : public Emitter<emitterFactory, ServerStartedEvent> {
    memory::HookRegistrar<ServerStartedEventHook> hook;
};

static std::unique_ptr<EmitterBase> emitterFactory() { return std::make_unique<ServerStartedEventEmitter>(); }
} // namespace ll::event::inline server
```
