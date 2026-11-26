# Data-driven UI（数据驱动 UI）

`ll/api/ui/` · **通用**

## 概述

`ll::ui` 是 LeviLamina 为 Minecraft Bedrock 数据驱动 UI（DDUI）提供的类型化 C++ 接口。DDUI 将表单数据存放在同步的 DataStore 中，因此表单打开期间，文本、可见性、禁用状态、数值范围和输入值都能实时更新。

高级 API 提供 `CustomForm` 和 `MessageBox`，不向调用方暴露布局文档和属性路径。需要打开资源包中的自定义界面时，仍可直接使用底层的 `ScreenSession`、`Property` 和 `Binding<T>`。

本 API 对应 [`@minecraft/server-ui` 2.1.0](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/changelog?view=minecraft-bedrock-stable) 引入的稳定功能。微软的[数据驱动 UI 框架简介](https://learn.microsoft.com/zh-cn/minecraft/creator/documents/scripting/intro-to-ddui?view=minecraft-bedrock-stable)介绍了响应式模型；精确的兼容基线是 Mojang 的 [`@minecraft/server-ui` 2.1.0 绑定元数据](https://github.com/Mojang/bedrock-samples/blob/main/metadata/script_modules/%40minecraft/server-ui-bindings_2.1.0.json)。

!!! note "稳定版范围"

    这里不隐含支持后续的 preview 功能。即便 Microsoft Learn 的 stable 视图显示了带“预发行”警告的项目，当前 C++ API 也不包含 `CustomForm::image()` 及对应的图片选项。

## 头文件

| 头文件 | 用途 |
|--------|------|
| `ll/api/ui/base/UIRawMessage.h` | 字面量、翻译、替换参数和组合 UI 文本 |
| `ll/api/ui/base/Observable.h` | UI 专用 Observable 和值类型变体 |
| `ll/api/ui/form/CustomForm.h` | 类型化响应式自定义表单及全部组件选项 |
| `ll/api/ui/form/MessageBox.h` | 双按钮消息对话框 |
| `ll/api/ui/base/ScreenSession.h` | DDUI 界面生命周期和全局关闭操作 |
| `ll/api/ui/base/DataStore.h` | 底层 Property、Binding 和 Subscription 句柄 |
| `ll/api/data/Observable.h` | 通用 Observable 模板，详见 [Data](data.zh.md#observable) |

## 应该使用哪一层

| 需求 | API |
|------|-----|
| 构建响应式菜单或输入表单 | `CustomForm` |
| 提出一个双按钮问题 | `MessageBox` |
| 界面打开时更新内容和输入值 | UI Observable |
| 提供翻译文本或组合文本 | `UIRawMessage` |
| 打开资源包中的自定义 DDUI 界面 | `ScreenSession` |
| 绑定自定义界面的数据路径 | `Property` 和 `Binding<T>` |

使用 vanilla 的 Custom Form 和 Message Box 预设时，应优先选用高级表单类。它们会构造原生数据结构、桥接 Observable、校验客户端写入，并在表单结束时清理自身拥有的 DataStore 状态。

## 线程与生命周期

表单、Session、Property、Binding 和 Subscription 的操作（包括销毁仍持有活动 Session 的最后一个句柄）必须在服务器线程执行。`showAsync()` 返回的任务也必须在服务器线程等待或启动。

UI Observable 按值复制进表单，但其基类 `ll::data::Observable<T>` 会在各副本间共享状态。因此，在外部保留一份副本就是读取和更新表单值的标准方式。Observable 与可见表单绑定期间，调用 `setData()` 会写入玩家的 DDUI DataStore，因此也应在服务器线程调用。

`CustomForm` 和 `MessageBox` 只能移动，不能复制。`show()` 调用成功后，内部 Runtime 会自行保持存活，直到 Bedrock 完成该界面，因此外层对象不必留在当前调用栈中。但如果后续代码需要针对性地调用 `close()`，则仍需保留外层对象。

## 文本值

绝大多数文本参数接受 `TextValue`：

```cpp
using TextValue = std::variant<
    std::string,
    UIRawMessage,
    ObservableString,
    ObservableUIRawMessage
>;
```

`std::string` 和 `UIRawMessage` 是静态值；`ObservableString` 与 `ObservableUIRawMessage` 的值变化后会自动同步到客户端。

### UIRawMessage

`UIRawMessage` 是稳定字段 `text`、`translate`、`with` 和 `rawtext` 的类型化表示，对应微软的 [UIRawMessage 参考](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/uirawmessage?view=minecraft-bedrock-stable)。

```cpp
class UIRawMessage {
public:
    static UIRawMessage text(std::string value);
    static UIRawMessage translate(std::string key);
    static UIRawMessage translate(
        std::string key,
        std::vector<std::string> substitutions
    );
    static UIRawMessage translate(
        std::string key,
        UIRawMessage substitutions
    );
    static UIRawMessage rawText(std::vector<UIRawMessage> messages);

    bool operator==(UIRawMessage const&) const noexcept;
};
```

```cpp
using ll::ui::UIRawMessage;

auto literal = UIRawMessage::text("服务器在线");
auto translated = UIRawMessage::translate("gui.ok");
auto substituted = UIRawMessage::translate(
    "example.player_count",
    std::vector<std::string>{"5", "20"}
);
auto combined = UIRawMessage::rawText({
    UIRawMessage::text("状态："),
    UIRawMessage::translate("gui.yes")
});
```

翻译由客户端按玩家语言完成。高级 API 不接受也不暴露文本 JSON。

## UI Observable

四个 UI Observable 均继承自通用的 [`ll::data::Observable<T>`](data.zh.md#observable)，仅额外保存一个不可变的 UI 选项：

```cpp
struct ObservableOptions {
    bool clientWritable{false};
};

template <class T>
class UIObservable : public data::Observable<T> {
public:
    explicit UIObservable(T initial, ObservableOptions options = {});
    bool isClientWritable() const noexcept;
};

class ObservableBoolean      : public UIObservable<bool> {};
class ObservableNumber       : public UIObservable<double> {};
class ObservableString       : public UIObservable<std::string> {};
class ObservableUIRawMessage : public UIObservable<UIRawMessage> {};
```

它们分别对应微软稳定版的 [ObservableBoolean](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/observableboolean?view=minecraft-bedrock-stable)、[ObservableNumber](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/observablenumber?view=minecraft-bedrock-stable)、[ObservableString](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/observablestring?view=minecraft-bedrock-stable) 和 [ObservableUIRawMessage](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/observableuirawmessage?view=minecraft-bedrock-stable)。

`clientWritable` 决定桥接方向：

| 值 | 数据流向 |
|----|----------|
| `false`（默认） | 仅 Server Observable 到 UI |
| `true` | Server Observable 到 UI，同时允许通过校验的客户端改动回写 Observable |

传给 `dropdown()`、`slider()`、`textField()` 或 `toggle()` 的值 Observable 必须开启 `clientWritable`。向这些输入控件传入只读 Observable 会在构建表单时抛出 `std::invalid_argument`。

标签、说明、可见性、禁用状态、Slider 边界等完全由服务端控制的值，应使用默认的只读 Observable。无必要地开启客户端写入会扩大客户端可提交的数据范围。

```cpp
ll::ui::ObservableString status{"等待中"};
ll::ui::ObservableString name{"Steve", {.clientWritable = true}};

auto const id = name.subscribe([status](std::string const& value) mutable {
    status.setData("名称：" + value);
});
```

无论是否允许客户端写入，服务端调用 `setData()` 都会更新所有绑定位置。客户端写入仅在明确开放的路径上被接受，底层 Binding 会校验类型、有限数和更新版本，并拒绝重放更新。

## CustomForm

微软的对应类型见 [CustomForm](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/customform?view=minecraft-bedrock-stable)。

```cpp
class CustomForm {
public:
    using Result         = Expected<ScreenCloseReason>;
    using Callback       = brstd::move_only_function<void(Result)>;
    using ButtonCallback = brstd::move_only_function<void()>;

    CustomForm(Player& player, TextValue title);

    CustomForm& button(TextValue, ButtonCallback, ButtonOptions = {});
    CustomForm& closeButton();
    CustomForm& divider(DividerOptions = {});
    CustomForm& dropdown(
        TextValue,
        ObservableNumber,
        std::vector<DropdownItemData>,
        DropdownOptions = {}
    );
    CustomForm& header(TextValue, TextOptions = {});
    CustomForm& label(TextValue, TextOptions = {});
    CustomForm& slider(
        TextValue,
        ObservableNumber,
        NumberValue min,
        NumberValue max,
        SliderOptions = {}
    );
    CustomForm& spacer(SpacingOptions = {});
    CustomForm& textField(TextValue, ObservableString, TextFieldOptions = {});
    CustomForm& toggle(TextValue, ObservableBoolean, ToggleOptions = {});

    Expected<> show(Callback callback = {});
    coro::CoroTask<Result> showAsync();

    Expected<> close();
    bool isShowing() const noexcept;
};
```

所有组件方法均返回 `*this`，支持链式构造；组件的显示顺序即调用顺序。

### 组件

| 方法 | 用途 | 必需的响应式值 |
|------|------|----------------|
| `button(label, callback, options)` | 添加操作按钮 | 无；表单保持打开时回调可重复执行 |
| `closeButton()` | 启用预设底部关闭按钮和右上角关闭控件 | 无；标签使用客户端翻译键 `gui.close` |
| `divider(options)` | 添加水平分隔线 | 无 |
| `dropdown(label, value, items, options)` | 添加带数值的选择列表 | 可由客户端写入的 `ObservableNumber` |
| `header(text, options)` | 添加强调显示的分区标题 | 无 |
| `label(text, options)` | 添加普通只读文本 | 无 |
| `slider(label, value, min, max, options)` | 添加数值滑条 | 可由客户端写入的 `ObservableNumber` |
| `spacer(options)` | 添加垂直空白 | 无 |
| `textField(label, text, options)` | 添加文本输入框 | 可由客户端写入的 `ObservableString` |
| `toggle(label, toggled, options)` | 添加开关输入 | 可由客户端写入的 `ObservableBoolean` |

`NumberValue` 可以是 `double` 或 `ObservableNumber`。Slider 的最小值、最大值和步长均支持使用 Observable，因此在表单打开期间仍可动态改变。高级表单和底层 Binding 中的所有数值都必须是有限数。

每个 `DropdownItemData` 包含 `label`、数值 `value` 和可选的 `description`。Dropdown 的 Observable 绑定控件数值，应使用与资源包控件所需 Item Value 一致的值。

### Options

所有 Option 成员均为可选，省略时使用下表中的默认值。`TextValue`、`BooleanValue` 和 `NumberValue` 类型的成员也可传入 Observable，以实现动态更新。

```cpp
using BooleanValue = std::variant<bool, ObservableBoolean>;
using NumberValue  = std::variant<double, ObservableNumber>;
```

| 类型 | 成员 | 默认值 |
|------|------|--------|
| `ButtonOptions` | `disabled`、`tooltip`、`visible` | `false`、空、`true` |
| `DividerOptions` | `visible` | `true` |
| `DropdownOptions` | `description`、`disabled`、`visible` | 空、`false`、`true` |
| `SliderOptions` | `description`、`disabled`、`step`、`visible` | 空、`false`、`1.0`、`true` |
| `SpacingOptions` | `visible` | `true` |
| `TextFieldOptions` | `description`、`disabled`、`visible` | 空、`false`、`true` |
| `TextOptions` | `visible` | `true` |
| `ToggleOptions` | `description`、`disabled`、`visible` | 空、`false`、`true` |

```cpp
struct DropdownItemData {
    TextValue                label;
    double                   value;
    std::optional<TextValue> description;
};
```

### 显示和关闭

`show(callback)` 直接通过回调返回结果。其返回值 `Expected<>` 仅表示表单是否已成功准备并交给 Bedrock，不包含最终关闭原因；最终的 `Expected<ScreenCloseReason>` 会传给 callback。

`showAsync()` 返回协程任务，任务结果即为上述最终结果。普通 callback 版本的 `show()` 内部不会创建协程。

每个表单只能显示一次。首次调用 `show()` 或 `showAsync()` 后，即便后续准备或启动失败，再调用任何修改表单结构的方法也会抛出 `std::logic_error`；再次调用 `show()` 则会返回错误。

`close()` 仅关闭当前表单；若表单尚未进入 Showing 状态，调用将返回错误。在已请求关闭或已关闭后再次调用 `close()` 会直接成功，不会重复发送请求。等待 Bedrock 返回关闭结果期间，`isShowing()` 仍为 `true`。

表单结束时，系统会释放内部的 Observable 桥接、客户端写权限、原生订阅以及自有的 DataStore Property。

## MessageBox

微软对应的类型见 [MessageBox](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/messagebox?view=minecraft-bedrock-stable)，结果结构见 [MessageBoxResult](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/messageboxresult?view=minecraft-bedrock-stable)。

```cpp
struct MessageBoxResult {
    ScreenCloseReason             closeReason;
    std::optional<std::uint32_t> selection;
};

class MessageBox {
public:
    using Result   = Expected<MessageBoxResult>;
    using Callback = brstd::move_only_function<void(Result)>;

    MessageBox(Player& player, TextValue title);

    MessageBox& body(TextValue);
    MessageBox& button1(TextValue, std::optional<TextValue> tooltip = {});
    MessageBox& button2(TextValue, std::optional<TextValue> tooltip = {});

    Expected<> show(Callback callback = {});
    coro::CoroTask<Result> showAsync();

    Expected<> close();
    bool isShowing() const noexcept;
};
```

`body()`、两个按钮标签和两个 tooltip 均可使用静态值或 Observable。显示前应先设置两个按钮的标签。

`selection` 保持 Bedrock 稳定版 DDUI 的语义：

| 值 | 含义 |
|----|------|
| `1` | 玩家选择 `button1` |
| `2` | 玩家选择 `button2` |
| 空 | 对话框关闭时没有选择按钮 |

callback、协程、单次显示限制、显示后锁定结构、`close()` 以及清理规则均与 `CustomForm` 相同。

## Screen 结果

`ScreenCloseReason` 是 Bedrock 现有 `DataDrivenScreenClosedReason` 的类型别名，LeviLamina 并未另行定义关闭原因枚举。

| 枚举项 | 数值 | 含义 |
|--------|------|------|
| `ProgrammaticClose` | `0` | 通过实例的 `close()` 关闭指定表单 |
| `ProgrammaticCloseAll` | `1` | 通过 `closeScreen(player)` 关闭 DDUI 界面 |
| `ClientCanceled` | `2` | 客户端取消或关闭界面 |
| `UserBusy` | `3` | 玩家正忙于其他 UI |
| `InvalidForm` | `4` | Bedrock 拒绝了界面数据或布局 |

玩家离开和服务器停止会使 C++ 结果返回 `ll::Error`，不会为此另设关闭原因。

## 关闭玩家的全部 DDUI 界面

```cpp
#include "ll/api/ui/base/ScreenSession.h"

ll::ui::closeScreen(player);
```

`closeScreen(Player&)` 请求客户端关闭该玩家的全部 DDUI 界面，对应稳定版 Script API Manager 的 close-all 操作。由于这是全局关闭请求，无法同步返回单个 Session 的结果，因此该函数返回 `void`。各活动 Session 会分别以 `ScreenCloseReason::ProgrammaticCloseAll` 结束。

如果只需关闭某个已知界面，请使用 `CustomForm::close()`、`MessageBox::close()` 或 `ScreenSession::close()`。

## 底层 ScreenSession

`ScreenSession` 用于打开资源包提供的自定义 DDUI Screen。高级表单已自行管理 Session 和 Property，编写普通表单代码时无需直接使用它。

```cpp
enum class ScreenSessionState : std::uint8_t {
    Ready,
    Showing,
    Closed,
};

class ScreenSession {
public:
    using Result   = Expected<ScreenCloseReason>;
    using Callback = brstd::move_only_function<void(Result)>;

    ScreenSession(Player&, std::string screenId);
    ScreenSession(Player&, std::string screenId, uint instanceId);
    ScreenSession(Player&, std::string screenId, NoInstanceIdTag);

    ScreenSessionState getState() const noexcept;
    std::optional<uint> getInstanceId() const noexcept;
    std::optional<uint> getFormId() const noexcept;

    Expected<Property> createProperty(
        std::string datastore,
        std::string property,
        cereal::DynamicValue const& value
    ) const;
    Expected<Property> createProperty(
        std::string datastore,
        std::string property,
        std::string const& json
    ) const;
    Expected<Property> borrowProperty(
        std::string datastore,
        std::string property
    ) const;

    Expected<> show(Callback callback = {}) const;
    coro::CoroTask<Result> showAsync() const;
    Expected<> close() const;
};
```

双参数构造函数会自动生成 Instance ID。若自定义 Screen 协议要求固定 ID，可显式传入；不使用 Instance ID 时可传入 `NoInstanceId`。Bedrock Form ID 只有在开始显示后才会设置。

`createProperty()` 会创建或替换归 Session 所有的数据，这些自有数据会在 Session 关闭时清空。`borrowProperty()` 仅关联玩家已有的 DataStore Property，Session 清理时不会删除借用的数据。

构造结构化数据时，应优先使用 `cereal::DynamicValue` 重载。字符串重载仅作为底层兼容接口保留；高级表单既不使用也不暴露 JSON。

```cpp
auto data = cereal::DynamicValue::object({
    {"title", "状态"},
    {"visible", true},
    {"count", 0.0},
});

ll::ui::ScreenSession session{player, "example:status_screen"};
auto property = session.createProperty("example", "status", data);
if (!property) {
    // 处理 property.error()。
    return;
}
```

与高级表单一样，每个 Session 只能显示一次。复制 `ScreenSession` 会共享底层的实现与生命周期。

## Property 与 Binding

```cpp
using BindingValueTypes = meta::TypeList<
    double,
    bool,
    std::string,
    cereal::DynamicValue
>;

class Property {
public:
    Expected<> set(cereal::DynamicValue const& value) const;
    Expected<> setJson(std::string const& json) const;
    Expected<> erase() const;

    template <BindingValue T>
    Expected<Binding<T>> bind(std::string path) const;

    template <BindingValue T>
    Expected<Binding<T>> bindClientWritable(std::string path) const;

    explicit operator bool() const noexcept;
};

template <BindingValue T>
class Binding {
public:
    using Callback = brstd::move_only_function<void(T const&)>;

    Expected<T> get() const;
    Expected<> set(T value) const;
    Expected<Subscription> listen(Callback callback) const;

    Expected<> setClientWritable(bool writable) const;
    bool isClientWritable() const noexcept;

    explicit operator bool() const noexcept;
};

class Subscription {
public:
    Subscription() noexcept;
    ~Subscription();

    Subscription(Subscription const&) = delete;
    Subscription& operator=(Subscription const&) = delete;
    Subscription(Subscription&&) noexcept;
    Subscription& operator=(Subscription&&) noexcept;

    void reset() noexcept;
    explicit operator bool() const noexcept;
};
```

Binding Path 采用 Bedrock DDUI 路径语法，并相对于所属的 Property 解析。将同一路径再次绑定为不同的 C++ 类型会返回错误。Number Binding 以及 `DynamicValue` 中的所有嵌套数值均拒绝 NaN 与无穷大。

`bindClientWritable<T>()` 等价于依次调用 `bind<T>()` 和 `setClientWritable(true)`。请仅向客户端确需编辑的路径开放写权限。客户端更新会校验 Binding 的类型与版本；非法写入或重放不会触发 Listener，且系统会尽可能恢复为上一个合法值。

`listen()` 返回仅可移动的 RAII 对象 `Subscription`。在需要接收通知期间必须持有该对象；将其销毁或调用 `reset()` 会取消对应的 Listener。这与 `ll::data::Observable<T>::SubscriptionId` 不同，后者的生命周期不会触发取消订阅。

```cpp
auto binding = property->bindClientWritable<double>("count");
if (!binding) {
    return;
}

auto subscription = binding->listen([](double const& value) {
    // 处理通过校验的服务端或客户端 DataStore 更新。
});
if (!subscription) {
    return;
}

auto write = binding->set(42.0);
```

`Property` 和 `Binding<T>` 均为非拥有句柄；所属的 `ScreenSession` 失效后，这些句柄也将无法使用。Session 关闭后，`Subscription` 同样不再处于活动状态。

## 错误模型

与 Bedrock 交互的操作会返回 `Expected<T>` 或 `Expected<>`，使用结果前必须检查操作是否成功。无效句柄、玩家失效、Binding 类型不匹配、路径非法、DDUI 服务不可用、生命周期状态转换非法或界面数据被拒绝，都可能导致返回错误。

表单构造阶段存在两类表示编程错误的异常：

| 条件 | 异常 |
|------|------|
| 开始显示后继续修改 `CustomForm` 或 `MessageBox` | `std::logic_error` |
| 向输入控件传入只读 Observable，或传入非有限的高级数值 | `std::invalid_argument` |

通用 Observable 的回调异常会直接向外抛出，详见 [Data](data.zh.md#observable)。而 DDUI 完成回调和底层 Binding Listener 位于引擎回调边界上，从中抛出的异常会被 LeviLamina 捕获并记录到日志中。

## 与 Script API 的差异

C++ API 保持了稳定版 DDUI 的行为，但并非直接照搬 TypeScript 源码：

| Microsoft Script API | LeviLamina C++ API |
|----------------------|--------------------|
| `show()` 返回 Promise | 直接调用 `show(callback)`，另提供 `showAsync()` |
| Script 异常 | 运行时失败返回 `Expected<T>`；非法构造或修改抛出标准异常 |
| 以 Callback 本身作为取消订阅 Token | 每份状态使用 `std::uint32_t` 订阅 ID |
| `uiManager.closeAllForms(player)` | `ll::ui::closeScreen(player)` |
| Raw Message 对象字面量 | 类型化的 `UIRawMessage` 工厂函数 |
| Script Runtime 管理表单布局对象 | 提供类型化组件，不公开布局或 JSON |
| `ObservableString::getFilteredText()` | 当前 C++ 公共 API 未导出 |
| `image()` 等 preview 组件 | 未实现 |

## 相关模块

- [数据驱动 UI 操作指南](../developer_guides/how_to_guides/data_driven_ui_guide.zh.md) - callback、协程、动态状态和 MessageBox 的完整示例
- [Data](data.zh.md#observable) - `ll::data::Observable<T>` 的完整语义
- [Expected](expected.zh.md) - 处理 `Expected<T>` 和 `ll::Error`
- [Coroutine](coro.zh.md) - 启动和等待 `CoroTask<T>`
- [旧 Form API](form.zh.md) - 与 DDUI 独立的静态 `ll::form` 表单

## 官方参考

- [Microsoft：数据驱动 UI 框架简介](https://learn.microsoft.com/zh-cn/minecraft/creator/documents/scripting/intro-to-ddui?view=minecraft-bedrock-stable)
- [Microsoft：`@minecraft/server-ui` 模块](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/minecraft-server-ui?view=minecraft-bedrock-stable)
- [Microsoft：`CustomForm`](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/customform?view=minecraft-bedrock-stable)
- [Microsoft：`MessageBox`](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/messagebox?view=minecraft-bedrock-stable)
- [Microsoft：`UIRawMessage`](https://learn.microsoft.com/zh-cn/minecraft/creator/scriptapi/minecraft/server-ui/uirawmessage?view=minecraft-bedrock-stable)
- [Mojang：`@minecraft/server-ui` 2.1.0 绑定元数据](https://github.com/Mojang/bedrock-samples/blob/main/metadata/script_modules/%40minecraft/server-ui-bindings_2.1.0.json)
