# Service（服务系统）

`ll/api/service/` · **通用 / 服务端 / 客户端**

## 概述

Service 模块是一个**带版本的服务注册表**。通过它，mod 可以用稳定的接口暴露功能，让其他 mod 无需直接链接提供方的实现就能调用，同时允许提供方并存发布同一逻辑服务的多个 ABI 不兼容版本。

整个注册表围绕三个概念构建：

- **`Service`**：所有服务的基类。
- **`ServiceId`**：由 `(name, version)` 组成，唯一标识一个服务的键。
- **`ServiceManager`**：进程级单例，负责协调服务的注册、查找、查询与生命周期事件。注册服务的 mod 卸载时，它还会自动清理相应服务。

此外，`ll/api/service/Bedrock.h` 提供了引擎单例（如 `Minecraft`、`Level`、`ServerInstance`、`CommandRegistry` 等）的访问器。这部分与用户态注册表互不相关，将在本文末尾单独说明。

## 为什么要用 Service

直接通过 `#include "other_mod/SomeApi.h"` 调用另一个 mod 会带来三个问题：

1. **ABI 耦合。** 提供方一旦修改接口，消费方即使不关心该改动，也必须重新编译。
2. **加载顺序耦合。** 消费方必须自行判断提供方是否已加载，以及何时加载。
3. **无法做版本协商。** 两个提供方无法以同一个逻辑名称暴露不同版本的服务。

服务注册表解决了这三个问题：

- 消费方只依赖 `Service` 接口（或版本化的包装类型），不依赖提供方的具体实现。
- 消费方调用 `getService<T>()` 时无需知道提供方是否存在；当提供方缺失、延迟加载或已卸载时，调用只会通过 `Expected` 返回失败结果，而不会引发链接错误。
- 同一逻辑服务的多个版本可以共存，并支持按需显式选择。

如果你的“服务”只是无状态、无需版本管理的纯静态工具，则无需使用本模块，一个普通头文件就足够了。

## 核心概念

### Service

```cpp
class Service : public std::enable_shared_from_this<Service> {
public:
    virtual ~Service() = default;

    [[nodiscard]] virtual ServiceId getServiceId() const noexcept = 0;

    // 服务从 ServiceManager 被移除时调用。
    virtual void invalidate() {}

    static constexpr ServiceIdView ServiceId{EmptyServiceId};
    ...
};
```

要点：

- 服务必须由 `std::shared_ptr` 管理——基类继承自 `enable_shared_from_this`。
- `invalidate()` 是**唯一**的生命周期钩子，由 `ServiceManager::unregisterService` 在移除服务时调用。释放资源、清理引用、取消订阅和关闭句柄等操作都应放在这里。
- 基类的 `Service::ServiceId` 是 `EmptyServiceId`，切勿依赖它；派生服务应当重新定义 `ServiceId`（参见下文 `ServiceImpl`）。

### ServiceId 与 ServiceIdView

`ServiceId` 由 `(name, version)` 以及一个预计算的组合 hash 构成：

```cpp
class ServiceId {
public:
    size_t      version;
    std::string name;
    ...
};

class ServiceIdView {
public:
    size_t           version;
    std::string_view name;
    ...
};
```

- `ServiceId` 持有 name 字符串的所有权，而 `ServiceIdView` 仅借用该字符串。注册表内部存储 `ServiceId`，外部查询则通常使用 `ServiceIdView`。
- 相等性比较与 hash 计算都基于**二元组**，而非仅凭名称。这正是“同名不同版本可以共存”的根本原因。
- `EmptyServiceId` 的值为 `{"", 0}`。如果 `getServiceId<T>` 得到的 `ServiceId` 与之相等，就会触发编译期错误，以此强制每个可用服务都提供真实的 ID。

### ServiceImpl

`ServiceImpl` 是一个便捷基类，能自动帮你定义好 `ServiceId`：

```cpp
template <class T, size_t version>
class ServiceImpl : public Service {
public:
    static constexpr ServiceIdView ServiceId{auto_name_t<T>{}, version};

    ServiceId getServiceId() const noexcept override { return ServiceId; }
};
```

关键细节：**`T` 是服务*名字*的来源，不是派生类本身**。`auto_name_t<T>` 采用编译器对类型 `T` 的名称拼写；在下文未限定命名空间的示例中，得到的名称为 `MyService`。

由此引出两条规则：

- `class MyService : public ServiceImpl<MyService, 1>`：服务名为 `MyService`，版本号为 `1`。这是最简单的写法。
- `class BackendServiceV1 : public ServiceImpl<Backend, 1>` 与 `class BackendServiceV2 : public ServiceImpl<Backend, 2>`：两者**都叫** `Backend`，仅版本号不同。这才是定义版本化服务的正确方式。

如果误写成 `ServiceImpl<BackendServiceV1, 1>` 和 `ServiceImpl<BackendServiceV2, 2>`，得到的将是**两个不同的名字**，而非同一名称的两个版本。这是最常见的误用。

当类型名称本身就能作为预期的接口契约时，`ServiceImpl` 非常方便。但如果外部服务需要固定且不依赖编译器类型拼写的 ID，则应直接定义 `ServiceId` 和 `getServiceId()`。

### ServiceManager

它是进程级单例，所有状态均为全局状态。由 mod 注册的服务会在该 mod 卸载时自动移除。

```cpp
ServiceManager& ServiceManager::getInstance();

template <IsService T>
Expected<std::shared_ptr<T>> getService();

Expected<std::shared_ptr<Service>> getService(ServiceIdView const& id);

template <IsService T>
event::ListenerPtr subscribeService(
    std::function<void(std::shared_ptr<T> const&)> const& fn);

std::optional<QueryServiceResult>       queryService(std::string_view name);
std::vector<QueryServiceResult>         queryServices(std::string_view name);

bool registerService(std::shared_ptr<Service> const&  service,
                     std::shared_ptr<mod::Mod> const& mod = mod::NativeMod::current());

bool unregisterService(ServiceIdView const& id);
void unregisterService(mod::Mod const& mod);
```

`IsService` concept 要求满足 `std::is_base_of_v<Service, T>`，**且** `T::ServiceId` 的类型为 `ServiceId` 或 `ServiceIdView`。`ServiceImpl` 同时满足这两个条件。

注册表仅按 `ServiceId` 建立索引；`getService<T>()` 不会校验所存储对象的动态 C++ 类型。因此，应将 `(name, version)` 视为接口契约，切勿将其复用于不兼容的类型。

## 快速开始

### 定义服务

最简、非版本化的写法如下：

```cpp
#include "ll/api/service/Service.h"

class MyService : public ll::service::ServiceImpl<MyService, 1> {
public:
    void doSomething() {}

    void invalidate() override {
        // 释放引用、取消订阅等
    }
};
```

若上述声明位于全局作用域，则 `MyService::ServiceId` 为 `{"MyService", 1}`。

### 注册服务

```cpp
#include <memory>

#include "ll/api/service/ServiceManager.h"
#include "ll/api/mod/NativeMod.h"

auto service = std::make_shared<MyService>();
bool ok = ll::service::ServiceManager::getInstance()
              .registerService(service);
```

如果完全相同的 `(name, version)` 已被占用，注册将返回 `false`。同名但不同版本的服务彼此独立、互不影响。`service` 参数不能为空。

注册成功后，注册表会持有该服务的 `shared_ptr`，你无需仅为了维持注册状态而在外部额外保留引用。由 mod 注册的服务会在该 mod 卸载时自动移除。

### 使用服务

```cpp
#include "ll/api/service/ServiceManager.h"

auto& sm = ll::service::ServiceManager::getInstance();
if (auto res = sm.getService<MyService>(); res) {
    (*res)->doSomething();
} else {
    // 处理“不存在”或“版本不匹配”，见“错误处理”。
}
```

除非同时订阅了生命周期事件（参见“订阅服务变化”），否则切勿跨重载长期缓存 `getService` 的返回值。

## 版本化服务

### 问题

假设你发布了 `Backend` 服务，接口为 `add(int, int)`，后来又需要提供 `add(int, int, int)`。如果两个版本共用名称 `Backend` 和相同的版本号，第二次注册就会失败，消费方也无法表达“我要带 `add(int, int)` 的那一个”。

注册表以 `(name, version)` 为键来解决此问题：你可以同时发布 `Backend@1` 和 `Backend@2`，消费方则按自己编译时所依赖的精确类型来获取服务。

### 设计版本化服务

以一个共享的命名类型作为 `T`，并为每个版本编写对应的包装类：

```cpp
#include "ll/api/service/Service.h"

struct Backend {}; // 仅用于命名，不是服务基类。

class BackendServiceV1 : public ll::service::ServiceImpl<Backend, 1> {
public:
    int add(int a, int b) { ... }
    void invalidate() override { ... }
};

class BackendServiceV2 : public ll::service::ServiceImpl<Backend, 2> {
public:
    int add(int a, int b, int bias) { ... }
    void invalidate() override { ... }
};
```

当上述声明位于全局作用域时，两个服务的名称均为 `Backend`，仅版本号不同。`Backend` 仅用于提供稳定的名称；各版本的包装类可以将调用转发给底层的共享实现，无需继承 `Backend`。接着再加一层 selector，让调用方可以直接写 `BackendService<2>`，而不必写出具体的类名：

```cpp
template <size_t Version> struct BackendServiceSelector;
template <> struct BackendServiceSelector<1> { using type = BackendServiceV1; };
template <> struct BackendServiceSelector<2> { using type = BackendServiceV2; };

template <size_t Version>
using BackendService = typename BackendServiceSelector<Version>::type;

using BackendServiceLatest = BackendService<2>;
```

这样消费方就可以写成：

```cpp
auto v1 = sm.getService<BackendService<1>>();
auto v2 = sm.getService<BackendService<2>>();
```

两次调用会解析为不同的 `ServiceId`（即 `Backend@1`、`Backend@2`），因此两个版本可以共存。

> **不要**将各个具体版本的类名同时用作名称来源：写成 `class BackendV1 : public ServiceImpl<BackendV1, 1>` 得到的服务名是 `BackendV1`，而不是 `Backend`。这种写法无法实现同名服务的多版本共存。

### 批量注册

版本一多，手动逐个注册很容易遗漏。常见做法是结合“编译期探测 + 上限断言”：

```cpp
#include <memory>

#include "ll/api/base/Meta.h"
#include "ll/api/service/ServiceManager.h"

constexpr size_t kVersionProbeLimit = 5;

auto& sm = ll::service::ServiceManager::getInstance();

auto registerVersions = [&]<template <size_t> class ServiceTemplate>() {
    ll::meta::unroll<kVersionProbeLimit>([&]<size_t Index> {
        constexpr size_t version = Index + 1;   // 探测 1 .. kVersionProbeLimit
        if constexpr (requires { typename ServiceTemplate<version>; }) {
            static_assert(
                version < kVersionProbeLimit,
                "探测到了 kVersionProbeLimit，请在新版本加入时调高上限"
            );
            auto service = std::make_shared<ServiceTemplate<version>>();
            if (!sm.registerService(service)) {
                // 处理 ID 重复或注册失败。
            }
        }
    });
};

registerVersions.template operator()<WidgetService>();
registerVersions.template operator()<GadgetService>();
// ...
```

机制说明：

- `ll::meta::unroll<N>` 会展开 `Index = 0 .. N-1`，因此对应的 `version = 1 .. N`。
- `if constexpr (requires { typename ServiceTemplate<version>; })` 会自动跳过未定义的版本。
- 当新增的版本号等于 `kVersionProbeLimit` 时，`requires` 表达式求值为真，进而触发 `static_assert`，强制你调高探测上限。这样就能将“版本 5 从来没被注册”转化为编译错误，避免埋下静默 bug。

注册成功后，注册表会持有一份引用，局部的 `shared_ptr` 即可安全离开作用域。建议在 mod 加载阶段注册服务，以便在卸载时自动清理；只有当你需要在 mod 卸载前提前移除服务时，才需要保留显式的 ID。

## 生命周期与失效

服务的完整生命周期如下：

1. `registerService(service, mod)`：插入服务，并触发 `ServiceRegisterEvent`。
2. 消费方通过 `getService<T>()` / `subscribeService<T>()` 使用服务。
3. `unregisterService(id)`：触发 `ServiceUnregisterEvent`，调用 `service->invalidate()`，随后从注册表中移除服务。
4. `unregisterService(mod)`：对该 mod 名下的所有服务执行上述操作。
5. mod 卸载：自动对该 mod 名下的所有服务执行相同的移除流程。

`invalidate()` 是唯一的清理钩子。切勿依赖析构函数进行清理：由于注册表持有 `shared_ptr`，服务对象的实际存活时间很可能远超你自己持有的引用。请务必将资源释放逻辑写在 `invalidate()` 中，而不是 `~T` 中。

## 订阅服务变化

`subscribeService<T>(fn)` 会先**立即**投递当前服务实例（如果已存在），随后持续投递该精确 `ServiceId` 的注册与注销事件：

```cpp
auto listener = sm.subscribeService<MyService>(
    [&](std::shared_ptr<MyService> const& s) {
        if (s) {
            // 已注册（或订阅时已经存在）。
            current = s;
        } else {
            // 已注销。清掉任何缓存的指针。
            current.reset();
        }
    });
```

细节说明：

- 若服务在订阅时就已注册，初始回调会在 `subscribeService` 内部同步执行一次。
- 服务注销时，回调会收到 `nullptr`，这就是“可以丢弃缓存引用”的信号。`ServiceUnregisterEvent` 会在调用 `invalidate()` 之前触发。
- 返回的 `event::ListenerPtr` 指向本次订阅，但事件总线内部也持有该监听器。因此，仅销毁自己手中的指针并不会取消订阅；必须显式调用 `ll::event::EventBus::getInstance().removeListener(listener)`。
- 仅投递与 `T::ServiceId` 对应的事件，即订阅精确到具体版本。
- 初始查找与安装监听器是两个独立的操作。请勿在与注册或注销并发的环境下调用订阅，而应在 mod 初始化阶段完成订阅。

这是“长期持有服务引用”的唯一安全方式。裸调用 `getService<T>()` 得到的结果，随时可能在某个注销边界失效。

## 查询服务

以下两个查询 API 的语义各有不同：

```cpp
std::optional<QueryServiceResult>       queryService(std::string_view name);
std::vector<QueryServiceResult>         queryServices(std::string_view name);
```

`QueryServiceResult` 包含 `{ name, version, modName, service }`。

- `queryService(name)`：返回该名称下已注册的**最高**版本；若名称不存在，则返回 `std::nullopt`。这是一个兼容性接口，用于查询“这个名字下最新的是哪个”。
- `queryServices(name)`：按版本号升序返回该名称下的**全部**版本。适用于诊断、UI 展示或显式选择兼容版本。

对查询而言，“名称不存在”是正常的空结果而非错误，因此这两个接口分别返回 `optional` 和空数组，而不是 `Expected`。

`QueryServiceResult::service` 只是查询瞬间的快照，并非持续有效的租约。查询返回后，服务仍可能因注销而失效；如需跨生命周期持有引用，请使用 `subscribeService`。

## 错误处理

`getService<T>()` 返回 `Expected<std::shared_ptr<T>>`，失败时返回 `GetServiceError`：

```cpp
struct GetServiceError : ErrorInfoBase {
    enum class ErrorType : char {
        NotExist        = 0,
        VersionMismatch = 1,
    };
    ErrorType code;
    size_t    version;   // 仅对 VersionMismatch 有意义
};
```

错误语义如下：

- **`NotExist`**：该名称下未注册任何服务。
- **`VersionMismatch`**：名称存在，但请求的版本不存在。此时 `error.version` 会携带该名称下已注册的**当前最高**版本，便于输出类似“你请求的是 v3，目前只有 v2”的日志。

这一区分在实际开发中尤为重要：

```cpp
auto res = sm.getService(ServiceIdView{"Backend", 3});
if (!res) {
    auto& e = res.error().as<GetServiceError>();
    if (e.code == GetServiceError::NotExist) {
        // 提供方 mod 没装。
    } else if (e.code == GetServiceError::VersionMismatch) {
        // 提供方装了，但只到 v{e.version}。
        // 可以考虑回退到 v{e.version}，或报告不兼容。
    }
}
```

不要将 `VersionMismatch` 视作“未安装”：它通常意味着提供方存在，消费方应当作优雅降级处理。

## 最佳实践

- **长期持有的引用一律走 `subscribeService`，不要裸用 `getService`。** 缓存的 `shared_ptr` 在服务注销后依然存在，会导致后续调用落到已失效的服务上。
- **清理逻辑写进 `invalidate()`。** 由于注册表自身也持有 `shared_ptr`，析构函数的触发时机过晚且不可控。
- **在 mod 加载阶段注册服务。** 服务会在 mod 卸载时自动移除；仅当需要提前移除时，才显式调用 `unregisterService`。
- **名字来源要选对。** 单个服务可以直接使用 `ServiceImpl<Self, N>`；版本化服务则应使用共享的命名类型作为 `T`，使所有版本保持同名。
- **版本数量要克制。** 每个版本在整个服务器生命周期内都是存活的对象。发布到 v7 就意味着要同时承担七份开销。
- **把服务名和版本视为公开契约。** 请使用稳定且带有提供方标识的名称，切勿为不兼容的接口复用同一个 `(name, version)`；只有首个成功注册的实例会生效。
- **纯静态工具不要包 service。** 为其引入版本控制和生命周期管理只会徒增复杂度。
- **不要跨事件缓存 `getService` 结果。** 仅在 `subscribeService` 回调中缓存引用，并在服务注销时将其置空。

## Bedrock 访问器

`ll/api/service/Bedrock.h` 提供了独立于 `ServiceManager` 的引擎实例访问器：

```cpp
namespace ll::service::inline bedrock {
optional_ref<Minecraft>              getMinecraft(bool isClientSide = false);
optional_ref<Level>                  getLevel();
optional_ref<ServerInstance>         getServerInstance();
optional_ref<ServerNetworkHandler>   getServerNetworkHandler(bool isClientSide = false);
optional_ref<CommandRegistry>        getCommandRegistry(bool isClientSide = false);
optional_ref<RakNet::RakPeer>        getRakPeer();
optional_ref<NetworkSystem>          getNetworkSystem(bool isClientSide = false);
optional_ref<DBStorage>              getDBStorage();
optional_ref<ResourcePackRepository> getResourcePackRepository(bool isClientSide = false);
}
```

每个访问器都会返回一个 `optional_ref`；在对应的引擎子系统就绪前，或在当前客户端/服务端目标上不可用时，该返回值为空。使用前请先判空，切勿假设它在某个 mod 生命周期阶段必定存在。

### 特定构建目标的访问器

`ll/api/service/TargetedBedrock.h` 提供了仅在特定构建目标中存在的访问器，同样位于 `ll::service::bedrock` 命名空间下：

```cpp
#include "ll/api/service/TargetedBedrock.h"

// 服务端构建（src-server/）
optional_ref<PropertiesSettings> getPropertiesSettings();
optional_ref<DedicatedServer>    getDedicatedServer();

// 客户端构建（src-client/）
optional_ref<ClientInstance> getClientInstance();
optional_ref<Level>          getMultiPlayerLevel();
optional_ref<AppPlatform>    getAppPlatform();
```

### 其他工具

同一目录下还提供了 `GamingStatus.h`（`ll::getGamingStatus()`）、`PlayerInfo.h`（已知玩家 UUID、XUID 与名称的缓存，可通过 `fromUuid` / `fromXuid` / `fromName` 查询）以及 `ServerInfo.h`（`ll::setServerMotd`、`ll::getWorldPath`、`ll::getWorldDataRoot`、`ll::getWorldConfigRoot`）：

```cpp
#include "ll/api/service/GamingStatus.h"
#include "ll/api/service/PlayerInfo.h"
#include "ll/api/service/ServerInfo.h"

ll::GamingStatus status = ll::getGamingStatus(); // Default、Starting、Running 或 Stopping

auto& players = ll::service::PlayerInfo::getInstance();
if (auto entry = players.fromName("Steve")) {
    // entry->uuid, entry->xuid, entry->name
}

std::optional<std::filesystem::path> world = ll::getWorldPath();
ll::setServerMotd("My Server");
```

## 相关模块

- [Event（事件系统）](event.zh.md) — `ServiceRegisterEvent`、`ServiceUnregisterEvent`
- [Mod（模组系统）](mod.zh.md) — `mod::Mod`，用作 `registerService` 的 mod 参数，以及自动或手动清理的目标
