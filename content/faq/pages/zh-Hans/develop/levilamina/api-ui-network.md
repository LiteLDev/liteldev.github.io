# LeviLamina 模组 API：表单、数据包与网络

## LeviLamina 原生（C++）mod 如何自定义数据包，实现客户端 mod 与服务端 mod 互相通信？

LeviLamina 自 1.9.0 起内置了自定义数据包支持（`ll/api/network`）。当前用法如下：

- 继承 `ll::network::PacketBase<T>` 并实现 `write` / `read` 来定义数据包（继承即自动注册）。
- 继承 `ll::network::PacketHandlerBase<Handler, Packet>` 并实现 `handlePacket(NetworkIdentifier const&, NetEventCallback&, ll::network::PacketSide side, Packet const&)` 来处理数据包。
- 发送数据包时，客户端发往服务端使用 `packet.sendToServer()`，服务端发往客户端使用 `packet.sendTo(player)`、`sendToClient(networkId, subClientId)` 或 `sendToClients()`。

如果需要在运行时动态注册（例如用于脚本引擎），请使用 `ll::network::PacketRegistrar::getInstance()`。自 26.60 起，还可以声明 `CustomPacketId`、`PacketVersion`、处理端 `Side` 以及 `Optional`；缺少必需数据包的一端会在登录时被断开连接。

*适用版本：LeviLamina 1.9.0 及以上（`handlePacket` 签名与 `Side`/`Optional` 为 26.60.0 及以上）*

## `ll::form::ModalForm` 构造函数只接收标题、内容、两个按钮文本，回调放哪？按旧教程写 lambda 报 `No viable conversion ... to 'Callback'` 怎么办？

回调函数应在调用 `sendTo(player, callback)` 时传入。`ModalForm::Callback` 的签名为 `void(Player&, ll::form::ModalFormResult, ll::form::FormCancelReason)`，其中 `ModalFormResult = std::optional<ModalFormSelectedButton>`，`FormCancelReason = std::optional<ModalFormCancelReason>`。后两个参数都是 `optional`，使用前需先判断是否有值。最简单的写法是：`form.sendTo(player, [](Player& player, ll::form::ModalFormResult result, ll::form::FormCancelReason reason) { ... });`（参数类型也可以用 `auto`）。如果写错了参数类型（例如直接写成 `ModalFormSelectedButton` 而非 `optional`），就会出现上述类型转换错误。详情可参考官方表单指南 `developer_guides/how_to_guides/form_guide`。

*适用版本：LeviLamina 0.11 及以上*

## LeviLamina C++ mod 中如何编写表单（Form）？有没有官方教程？

官方文档提供了表单指南：<https://levimc.org/zh-Hans/LeviLamina/developer_guides/how_to_guides/form_guide/>（涵盖 `SimpleForm`、`ModalForm` 和 `CustomForm`，均通过 `sendTo` 发送并传入回调），API 参考见 `api_reference/form`。此外，也可以参考 LegacyScriptEngine 中表单 API 的实现代码。

## LeviLamina C++ 表单 `CustomForm` 中 `appendStepSlider` 的回调结果是什么类型？

与返回序号的 LSE 不同，在 LeviLamina C++ 中调用 `ll::form::CustomForm::appendStepSlider(name, text, std::vector<std::string> steps, defaultVal, tooltip)` 后，回调结果 `CustomFormResult`（`std::unordered_map<std::string, CustomFormElementResult>`）中对应的值是所选项的字符串本身（即存放在 `std::variant<std::monostate, uint64, double, std::string>` 中的 `std::string`），而不是索引。当前 v26.60.8 依然如此。

取值示例：

```cpp
std::get<std::string>(result->at("name"))
```

*适用版本：LeviLamina 0.11 及以上*

## LeviLamina 中的数据包（Packet）结构体是否完整，能否自己构造并发送数据包？

可以。LeviLamina 已补全了大量数据包结构体（位于 `mc/network/packet/` 下的数百个头文件中），能够满足自行构造并发送数据包的需求。构造完成后，可调用 LL 为 Packet 提供的发送方法，如 `packet.sendTo(player)`、`sendTo(actor)`、`sendTo(pos, dimId)`、`sendToClients()` 等。

## LeviLamina（LL3）的 C++ API 里还有 LL2 那样发起 HTTP 请求的功能（httplib）吗？

没有。LeviLamina 不提供公开的 HTTP 请求封装（`ll/api/network` 下只有 packet 相关内容）。你需要在 `xmake.lua` 中自行引入第三方库，例如 cpp-httplib（LegacyScriptEngine 即使用 cpp-httplib 实现网络请求，可参考其源码）或 cpr，也可以基于 asio 自行实现。

*适用版本：LeviLamina 所有版本（LL3 起）*
