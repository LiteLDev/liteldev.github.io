# Network（网络）

`ll/api/network/` · **通用**

## 概述

Network 模块用于定义在客户端与服务器之间收发的自定义数据包。玩家进入游戏前，LeviLamina 会检查两端是否都处理了各自所需的数据包，并在之后持续同步各自处理的数据包列表。

## 头文件

| 头文件 | 说明 |
|--------|------|
| `ll/api/network/packet/Packet.h` | `Packet`、`PacketBase` 与 `PacketHandlerBase` |
| `ll/api/network/packet/PacketRegistrar.h` | `PacketRegistrar` 与 `PacketSide`，用于运行时注册数据包 |

## 使用方法

### 定义数据包

继承 `PacketBase` 并实现 `write` 与 `read`。继承即完成注册，无需调用其他函数。

```cpp
#include "ll/api/network/packet/Packet.h"

class SetLabelPacket : public ll::network::PacketBase<SetLabelPacket> {
public:
    std::string label;

    void write(BinaryStream& stream) const override { stream.writeString(label, nullptr, nullptr); }

    Bedrock::Result<void> read(ReadOnlyBinaryStream& stream) override {
        auto value = stream.getString(256);
        if (!value) {
            return nonstd::make_unexpected(value.error());
        }
        label = std::move(*value);
        return {};
    }
};
```

### 处理数据包

继承 `PacketHandlerBase` 并实现 `handlePacket`。继承即完成注册，LeviLamina 会自动创建一个处理器实例。`side` 表示处理该数据包的一端：客户端发来的数据包为 `PacketSide::Server`，服务器发来的为 `PacketSide::Client`。

```cpp
class SetLabelHandler : public ll::network::PacketHandlerBase<SetLabelHandler, SetLabelPacket> {
public:
    void handlePacket(
        NetworkIdentifier const& source,
        NetEventCallback&        callback,
        ll::network::PacketSide  side,
        SetLabelPacket const&    packet
    ) const {
        // ...
    }
};
```

### 发送数据包

```cpp
SetLabelPacket packet;
packet.label = "hello";

packet.sendToServer();                       // 客户端发往服务器
packet.sendTo(player);                       // 服务器发往某个玩家
packet.sendToClient(networkId, subClientId); // 服务器发往某个连接
packet.sendToClients();                      // 服务器发往所有客户端
```

`sendTo` 也可以传入方块坐标与维度，或传入一个实体，将数据包发给周围的玩家。

### 自定义数据包 ID 与版本

数据包在网络上默认以类型名标识，因此重命名类或其命名空间都会改变 ID；分开编写的服务端模组和客户端模组也必须使用相同的类型名。如需固定 ID，可声明 `CustomPacketId`，它与事件的 `CustomEventId` 一样在编译期读取。数据包的网络传输格式改变时，请递增 `PacketVersion`：版本不同的对端会将其视为另一个数据包，从而避免读取错误。

```cpp
class SetLabelPacket : public ll::network::PacketBase<SetLabelPacket> {
public:
    static constexpr std::string_view CustomPacketId{"mymod:set_label"};
    static constexpr uint             PacketVersion{2};
    // ...
};
```

`ll::network::getPacketId<T>` 返回 `T` 实际使用的 ID，`ll::network::makePacketRuntimeId(id, version)` 返回网络上实际发送的运行时 ID。版本为 0 时，运行时 ID 即为 ID 的哈希，因此未指定版本号的数据包运行时 ID 保持不变。脚本引擎通过 `makePacketRuntimeId` 与 C++ 定义的数据包互通。

### 处理端与必需数据包

`Side` 表示数据包由哪一端处理：`PacketSide::Server` 表示客户端发往服务器的数据包，`PacketSide::Client` 表示服务器发往客户端的数据包，`PacketSide::Both`（默认）表示两端都处理。处理器默认在数据包声明的一端工作，也可以通过 `PacketHandlerBase` 的第三个模板参数另行指定。主持世界的客户端同时作为服务器和客户端运行。

数据包默认为必需，声明 `Optional` 后才变为可选。玩家登录时，在发送世界数据之前，服务器会检查客户端是否处理了所有客户端侧的必需数据包，客户端也会检查服务器是否处理了所有服务端侧的必需数据包。缺少必需数据包的一方会被断开连接，并提示所缺的数据包；原版客户端或服务器视为缺失全部数据包。

```cpp
class SetLabelPacket : public ll::network::PacketBase<SetLabelPacket> {
public:
    static constexpr std::string_view        CustomPacketId{"mymod:set_label"};
    static constexpr ll::network::PacketSide Side{ll::network::PacketSide::Client};
    static constexpr bool                    Optional{true}; // 没有安装该模组的客户端也能进入服务器
    // ...
};
```

### 检查对端

必需数据包无需检查。缺少必需数据包的客户端或服务器会在登录时被断开，因此服务端从 `PlayerJoinEvent` 起即可直接向任何玩家发送必需数据包，客户端在世界开始加载后也可直接发给服务器。

只有可选数据包才可能在对端缺失。服务端用 `canSendTo` 检查（可传入玩家或连接的 `NetworkIdentifier`），客户端用 `canSendToServer` 检查：

```cpp
SetLabelPacket packet;            // 声明了 Optional{true}
if (packet.canSendTo(player)) {   // 服务端
    packet.sendTo(player);
}
if (packet.canSendToServer()) {   // 客户端
    packet.sendToServer();
}
```

两端的状态都会实时更新：加载或卸载模组时，只会将该模组处理的数据包变动同步给对端。

这些检查只是本地查找，不会发送任何数据。它们在 `PacketBase` 上也是静态函数，无需先构造数据包即可检查，适合在同一数据包的多个版本之间做出选择。对于运行时注册的数据包，可将运行时 ID 传给 `Packet::canSendTo(id, player)` 和 `Packet::canSendToServer(id)`：

```cpp
if (SetLabelPacketV2::canSendToServer()) {
    SetLabelPacketV2{/* ... */}.sendToServer();
} else {
    SetLabelPacket{/* ... */}.sendToServer();
}
```

### 运行时注册

脚本引擎以及在运行时定义数据包的模组可以直接使用 `PacketRegistrar`。请传入拥有该注册项的模组，以便在模组卸载时自动移除注册；处理器的变动会立即通知对端。

```cpp
auto& registrar = ll::network::PacketRegistrar::getInstance();
auto  id        = ll::network::makePacketRuntimeId("myscript:ping", 1);
registrar.registerPacket("myscript:ping", id, [] { return std::make_unique<ScriptPacket>(/* ... */); },
                         ll::network::PacketSide::Both, /*optional=*/false, scriptMod);
registrar.registerHandler("myscript:ping", id, scriptHandler, ll::network::PacketSide::Both, scriptMod);
// ...
registrar.unregisterHandler(id);
registrar.unregisterPacket(id);
```

处理器在注销或其所属模组卸载之前必须保持存活。

### 示例：SimpleTunnel

这是一个双向传递字符串的通道。`send` 发送消息，`co_await receive()` 等待下一条消息。收到的消息先放入队列，等待协程读取；消息到达时，`ConditionVariable` 会唤醒正在等待的协程。处理器会将消息放入接收端对应的通道；通道在所在端首次使用时才创建，纯服务器或纯客户端各只有一个，而主持世界的客户端则两端各有一个。每一端处理数据包的线程正是执行器运行的线程，因此队列无需加锁。由于该数据包是必需的，玩家进入游戏后，两端必定都已具备该通道。

服务端模组和客户端模组共用：

```cpp
#include "ll/api/coro/CoroTask.h"
#include "ll/api/coro/ConditionVariable.h"
#include "ll/api/network/packet/Packet.h"

class SimpleTunnelPacket : public ll::network::PacketBase<SimpleTunnelPacket> {
public:
    static constexpr std::string_view CustomPacketId{"mymod:simple_tunnel"};

    std::string data;

    SimpleTunnelPacket() = default;

    explicit SimpleTunnelPacket(std::string data) : data(std::move(data)) {}

    void write(BinaryStream& stream) const override { stream.writeString(data, nullptr, nullptr); }

    Bedrock::Result<void> read(ReadOnlyBinaryStream& stream) override {
        auto value = stream.getString(4096);
        if (!value) {
            return nonstd::make_unexpected(value.error());
        }
        data = std::move(*value);
        return {};
    }
};

class SimpleTunnel {
public:
    struct Message {
        NetworkIdentifierWithSubId source;
        std::string                data;
    };

    static SimpleTunnel& of(ll::network::PacketSide side) {
        if (side == ll::network::PacketSide::Server) {
            static SimpleTunnel server;
            return server;
        }
        static SimpleTunnel client;
        return client;
    }

    void send(std::string data) const { SimpleTunnelPacket{std::move(data)}.sendToServer(); }

    void send(NetworkIdentifierWithSubId const& client, std::string data) const {
        SimpleTunnelPacket{std::move(data)}.sendToClient(client);
    }

    ll::coro::CoroTask<Message> receive() {
        while (received.empty()) {
            co_await arrived.wait();
        }
        auto message = std::move(received.front());
        received.pop_front();
        co_return message;
    }

    void push(NetworkIdentifierWithSubId source, std::string data) {
        received.push_back({std::move(source), std::move(data)});
        arrived.notifyOne();
    }

private:
    std::deque<Message>          received;
    ll::coro::ConditionVariable  arrived;
};

class SimpleTunnelHandler : public ll::network::PacketHandlerBase<SimpleTunnelHandler, SimpleTunnelPacket> {
public:
    void handlePacket(
        NetworkIdentifier const&  source,
        NetEventCallback&,
        ll::network::PacketSide   side,
        SimpleTunnelPacket const& packet
    ) const {
        SimpleTunnel::of(side).push({source, packet.mSenderSubId}, packet.data);
    }
};
```

服务端模组在启用时启动循环，原样回显每条消息：

```cpp
#include "ll/api/thread/ServerThreadExecutor.h"

void serveTunnel() {
    ll::coro::keepThis([]() -> ll::coro::CoroTask<> {
        auto& tunnel = SimpleTunnel::of(ll::network::PacketSide::Server);
        while (true) {
            auto message = co_await tunnel.receive();
            tunnel.send(message.source, "echo: " + message.data);
        }
    }).launch(ll::thread::ServerThreadExecutor::getDefault());
}
```

客户端模组发送消息并等待回复：

```cpp
#include "ll/api/thread/ClientThreadExecutor.h"

void talkToServer() {
    ll::coro::keepThis([]() -> ll::coro::CoroTask<> {
        auto& tunnel = SimpleTunnel::of(ll::network::PacketSide::Client);
        tunnel.send("hello");
        auto reply = co_await tunnel.receive();
        // reply.data == "echo: hello"
    }).launch(ll::thread::ClientThreadExecutor::getDefault());
}
```

### 检查的过程

客户端通过身份验证后，在协商资源包期间，服务器会发送 `levilamina:register`，列出自己处理的数据包的运行时 ID。LeviLamina 客户端收到后会立即回复自己的 `levilamina:register`；原版客户端则会丢弃这个无法识别的数据包。由于服务器在发送资源包栈之前就发出了该数据包，LeviLamina 客户端的回复总会在它报告资源包栈加载完成之前到达。服务器收到加载完成的报告后，会在创建玩家之前检查自身所需的数据包；若发现缺失则断开客户端连接，因此被拒绝的客户端不会触发 `PlayerConnectEvent`。在玩家创建之前，服务器只接受客户端发来的 `levilamina:register` 这一个自定义数据包。客户端则在收到 StartGame 时检查自身所需的数据包。

此后，任一端处理的数据包发生变化时，都会再次发送 `levilamina:register`。其内容依次为一个布尔值（true 表示开始处理这些数据包，false 表示不再处理）、一个表示数量的 64 位无符号变长整数，以及对应数量的 64 位运行时 ID。

## 相关模块

- [Event（事件系统）](event.zh.md) — `PlayerJoinEvent`，服务器可从此时起发送必需数据包
- [Coroutine（协程）](coro.zh.md) — SimpleTunnel 示例使用的 `CoroTask` 与 `ConditionVariable`
