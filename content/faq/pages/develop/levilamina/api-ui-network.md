# LeviLamina mod API: forms, packets and network

## How can a LeviLamina native (C++) mod define custom packets so a client mod and a server mod can communicate with each other?

LeviLamina has built-in custom packet support (`ll/api/network`) since 1.9.0. To use it:

- Inherit from `ll::network::PacketBase<T>` and implement `write` and `read` to define a packet (inheriting registers it).
- Inherit from `ll::network::PacketHandlerBase<Handler, Packet>` and implement `handlePacket(NetworkIdentifier const&, NetEventCallback&, ll::network::PacketSide side, Packet const&)` to handle the packet.
- To send, use `packet.sendToServer()` (client to server) and `packet.sendTo(player)`, `sendToClient(networkId, subClientId)`, or `sendToClients()` (server to client).

To register packets dynamically at runtime (for example, in a script engine), use `ll::network::PacketRegistrar::getInstance()`. Since 26.60, you can also declare `CustomPacketId`, `PacketVersion`, the handling side `Side`, and `Optional`; a side that lacks a required packet is disconnected at login.

*Applies to: LeviLamina 1.9.0 and later (the `handlePacket` signature and `Side`/`Optional` are 26.60.0 and later)*

## The `ll::form::ModalForm` constructor takes only the title, content and two button texts. Where does the callback go? Writing a lambda as in old tutorials gives `No viable conversion ... to 'Callback'`. What should I do?

Pass the callback to `sendTo(player, callback)`. The signature of `ModalForm::Callback` is `void(Player&, ll::form::ModalFormResult, ll::form::FormCancelReason)`, where `ModalFormResult = std::optional<ModalFormSelectedButton>` and `FormCancelReason = std::optional<ModalFormCancelReason>`. Because the last two parameters are both `optional`, check whether they have a value first. At its simplest: `form.sendTo(player, [](Player& player, ll::form::ModalFormResult result, ll::form::FormCancelReason reason) { ... });` (you can also use `auto`). Using the wrong parameter type—such as writing `ModalFormSelectedButton` directly instead of an `optional`—causes that conversion error. For details, see the official form guide at `developer_guides/how_to_guides/form_guide`.

*Applies to: LeviLamina 0.11 and later*

## How do I write a form in a LeviLamina C++ mod? Is there an official tutorial?

Yes. The official documentation includes a form guide at <https://levimc.org/LeviLamina/developer_guides/how_to_guides/form_guide/>, which covers `SimpleForm`, `ModalForm`, and `CustomForm`, sent with `sendTo` and a callback. For the API reference, see `api_reference/form`. You can also look at how LegacyScriptEngine implements the form API.

## What type does the callback result of `appendStepSlider` in a LeviLamina C++ `CustomForm` have?

Unlike LSE, which returns the index, `ll::form::CustomForm::appendStepSlider(name, text, std::vector<std::string> steps, defaultVal, tooltip)` in LeviLamina C++ puts the selected item's string itself—not its index—into the callback result `CustomFormResult` (`std::unordered_map<std::string, CustomFormElementResult>`), as a `std::string` inside `std::variant<std::monostate, uint64, double, std::string>`. This remains true as of v26.60.8.

Example of reading the value:

```cpp
std::get<std::string>(result->at("name"))
```

*Applies to: LeviLamina 0.11 and later*

## Are the packet structs in LeviLamina complete, and can I build and send packets myself?

Yes. LeviLamina defines a large number of packet structs (hundreds of headers under `mc/network/packet/`), enough to build and send packets yourself. Once you build a packet, send it using the methods LL provides on `Packet`, such as `packet.sendTo(player)`, `sendTo(actor)`, `sendTo(pos, dimId)`, and `sendToClients()`.

## Does the LeviLamina (LL3) C++ API still have an HTTP request feature (httplib) like LL2?

No. LeviLamina does not provide a public HTTP request wrapper (`ll/api/network` contains only packet-related code). Add a third-party library in `xmake.lua`, such as cpp-httplib (which LegacyScriptEngine uses for network requests—you can check its source for reference) or cpr, or build your own on top of asio.

*Applies to: all LeviLamina versions (LL3 onward)*
