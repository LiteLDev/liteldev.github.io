# 表单指南

LeviLamina 提供了一套极简的表单 API，让开发者只需几行代码就能实现复杂的表单功能。  
表单 API 的头文件位于 `ll/api/form` 中。此外，由于 Minecraft 的表单 ID 在运行时是唯一的，我们还提供了 **FormIdManager** 用于获取 Minecraft 的表单 ID，方便开发者自行实现表单 API。

## FormIdManager

FormIdManager 的头文件位于 `ll/api/form/FormIdManager.h`，导出了 `ll::form::FormIdManager::genFormId` 方法，用于获取唯一的表单 ID。

### 示例

```cpp
#include "ll/api/form/FormIdManager.h"

void test() { uint formId = ll::form::FormIdManager::genFormId(); }
```

## SimpleForm

SimpleForm 是一种简单表单，包含标题、内容和按钮。  
SimpleForm 的头文件位于 `ll/api/form/SimpleForm.h`。  
此外，`appendButton` 等 SimpleForm 方法会返回 SimpleForm 的引用，因此支持链式调用。

### 用法

1. 引入头文件 `ll/api/form/SimpleForm.h`。
2. 构造 SimpleForm 对象。你可以使用有参或无参构造函数：有参构造函数需要传入标题和内容，无参构造函数则需要手动调用 `setTitle` 和 `setContent` 方法来设置标题和内容。
3. 调用 `appendButton` 方法添加按钮，调用 `appendHeader`、`appendLabel` 和 `appendDivider` 方法添加纯视觉元素。
4. 调用 `sendTo` 方法将表单发送给玩家。该方法需要传入 `Player` 对象的引用和一个回调函数；回调函数的参数依次为 `Player` 对象的引用、玩家所选按钮的索引和取消原因枚举。具体参数定义可参考头文件 `ll/api/form/SimpleForm.h` 中 `Callback` 的声明。

!!! tip
    按钮索引为 -1 时，代表玩家取消了表单。  
    `FormCancelReason` 本质上是 `std::optional<ModalFormCancelReason>`，因此在使用前需要先判断其是否有值，再通过 `ModalFormCancelReason` 的枚举值判断取消原因。示例中使用了 `magic_enum` 库来获取枚举值的名称。

### 示例

```cpp
#include "ll/api/form/SimpleForm.h"
#include "magic_enum/magic_enum.hpp"

void sendSimpleFormToPlayer(Player& player) {
    ll::form::SimpleForm form("I'm title", "I'm content");
    // Or
    //    ll::form::SimpleForm form;
    //    form.setTitle("I'm title").setContent("I'm content");
    form.appendHeader("header")
        .appendButton("Button1")
        .appendDivider()
        .appendHeader("header")
        .appendLabel("label")
        .appendButton("Button2")
        .sendTo(player, [](Player& player, int selected, ll::form::FormCancelReason reason) {
            switch (selected) {
            case 0: {
                player.sendMessage("You clicked Button1");
                break;
            }
            case 1: {
                player.sendMessage("You clicked Button2");
                break;
            }
            case -1: {
                player.sendMessage("You closed the form");
                player.sendMessage(
                    reason.transform(magic_enum::enum_name<ModalFormCancelReason>).value_or("Unknown Reason")
                );
                break;
            }
            }
        });
}
```

## CustomForm

CustomForm 是一种复杂表单，包含标题、标签 (Label)、输入框 (Input)、开关 (Toggle)、下拉框 (Dropdown)、滑块 (Slider) 和步进滑块 (StepSlider)。

### 用法

1. 引入头文件 `ll/api/form/CustomForm.h`。
2. 构造 CustomForm 对象。你可以使用有参或无参构造函数：有参构造函数需要传入标题，无参构造函数则需要手动调用 `setTitle` 方法来设置标题。
3. 调用 `appendInput`、`appendToggle`、`appendDropdown`、`appendSlider` 和 `appendStepSlider` 方法添加各类自定义表单元素，调用 `appendHeader`、`appendLabel` 和 `appendDivider` 方法添加各类纯视觉元素。
4. 调用 `sendTo` 方法将表单发送给玩家。该方法需要传入 `Player` 对象的引用和一个回调函数；回调函数的参数依次为 `Player` 对象的引用、表单结果和取消原因枚举。具体参数定义可参考头文件 `ll/api/form/CustomForm.h` 中 `Callback` 的声明。

!!! tip
    表单结果 `CustomFormResult` 实际上是 `std::optional<std::unordered_map<std::string, CustomFormElementResult>>`，即一个存储元素名称与对应结果的无序关联容器。你可以通过元素名称获取对应的结果，结果类型为 `CustomFormElementResult`，它是一个联合体 (`std::variant<std::monostate, uint64, double, std::string>`)，因此需要先使用 `std::holds_alternative` 判断其类型，再通过 `std::get` 获取值。

### 示例

```cpp
#include "ll/api/form/CustomForm.h"
#include "magic_enum/magic_enum.hpp"

void sendCustomFormToPlayer(Player& player) {
    ll::form::CustomForm     form;
    std::vector<std::string> names;
    form.setTitle("CustomForm")
        .appendHeader("header")
        .appendLabel("label")
        .appendInput("input1", "input")
        .appendToggle("toggle", "toggle")
        .appendSlider("slider", "slider", 0, 100, 1)
        .appendDivider()
        .appendStepSlider("stepSlider", "stepSlider", {"a", "b", "c"})
        .appendDropdown("dropdown", "dropdown", {"a", "b", "c"})
        .appendLabel("label")
        .appendDropdown("emptydropdown", "empty dropdown", names)
        .setSubmitButton("Apply")
        .sendTo(
            player,
            [](Player& player, ll::form::CustomFormResult const& data, ll::form::FormCancelReason reason) {
                if (!data) {
                    player.sendMessage("CustomForm callback canceled");
                    player.sendMessage(reason.transform(magic_enum::enum_name<ModalFormCancelReason>)
                                            .value_or("Unknown Reason"));
                    return;
                }
                for (auto [name, result] : *data) {
                    if (std::holds_alternative<uint64_t>(result)) {
                        player.sendMessage(
                            fmt::format("CustomForm callback {} = {}", name, std::get<uint64_t>(result))
                        );
                    } else if (std::holds_alternative<double>(result)) {
                        player.sendMessage(
                            fmt::format("CustomForm callback {} = {}", name, std::get<double>(result))
                        );
                    } else if (std::holds_alternative<std::string>(result)) {
                        player.sendMessage(
                            fmt::format("CustomForm callback {} = {}", name, std::get<std::string>(result))
                        );
                    }
                }
            }
        );
}
```

## ModalForm

ModalForm 是一种模态表单，包含标题、内容和两个按钮，通常用于实现二选一交互。

### 用法

1. 引入头文件 `ll/api/form/ModalForm.h`。
2. 构造 ModalForm 对象。你可以使用有参或无参构造函数：有参构造函数需要传入标题、内容、上方按钮和下方按钮，无参构造函数则需要手动调用 `setTitle` 和 `setContent` 方法设置标题和内容，并调用 `setUpperButton` 和 `setLowerButton` 方法设置上方按钮和下方按钮。
3. 调用 `sendTo` 方法将表单发送给玩家。该方法需要传入 `Player` 对象的引用和一个回调函数；回调函数的参数依次为 `Player` 对象的引用、玩家所选按钮的结果和取消原因枚举。具体参数定义可参考头文件 `ll/api/form/ModalForm.h` 中 `Callback` 的声明。

!!! tip
    `ModalFormResult` 实际上是 `std::optional<ModalFormSelectedButton>` 的别名，而 `ModalFormSelectedButton` 是一个布尔枚举，包含 `Upper = true` 和 `Lower = false` 两个值，分别代表上方按钮和下方按钮。

### 示例

```cpp
#include "ll/api/form/ModalForm.h"
#include "magic_enum/magic_enum.hpp"

void sendModalFormToPlayer(Player& player) {
    ll::form::ModalForm form;
    form.setTitle("ModalForm")
        .setUpperButton("Upper")
        .setLowerButton("Lower")
        .sendTo(
            player,
            [](Player& player, ll::form::ModalFormResult selected, ll::form::FormCancelReason reason) {
                if (!selected) {
                    player.sendMessage("ModalForm callback canceled");
                    player.sendMessage(reason.transform(magic_enum::enum_name<ModalFormCancelReason>)
                                            .value_or("Unknown Reason"));
                    return;
                }
                player.sendMessage(fmt::format("ModalForm callback {}", (bool)selected));
            }
        );
}
```

## sendUpdate

当玩家已打开表单时，调用 `SimpleForm::sendUpdate`、`CustomForm::sendUpdate` 或 `ModalForm::sendUpdate` 即可更新当前表单。更新时不限制表单的内容和类型，参数与 `sendTo` 相同。调用这些方法时必须确保玩家的表单处于打开状态，否则不会生效。

### 示例

```cpp
#include "ll/api/chrono/GameChrono.h"
#include "ll/api/coro/CoroTask.h"
#include "ll/api/form/CustomForm.h"
#include "ll/api/service/Bedrock.h"
#include "ll/api/thread/ServerThreadExecutor.h"
#include "mc/server/ServerLevel.h"
#include <fmt/chrono.h>

std::unique_ptr<ll::form::CustomForm> buildStatusWindow() {
    auto form = std::make_unique<ll::form::CustomForm>("Status");
    auto now  = std::chrono::system_clock::now();
    auto ticks =
        ll::service::getLevel().transform([](auto& level) { return level.getCurrentServerTick().tickID; }).value_or(-1);
    form->appendHeader("System Info")
        .appendLabel(fmt::format("Time: {}", now))
        .appendLabel(fmt::format("Ticks: {}", ticks))
        .appendDivider()
        .setSubmitButton("Close");
    return std::move(form);
}

void openStatusWindow(Player& player) {
    ll::coro::keepThis([uid = player.getOrCreateUniqueID()]() -> ll::coro::CoroTask<void> {
        auto closed   = std::make_shared<bool>(false);
        auto callback = [closed](auto const&...) { *closed = true; };

        auto player = ll::service::getLevel().transform([uid](auto& level) { return level.getPlayer(uid); });
        if (!player || *closed) co_return;
        buildStatusWindow()->sendTo(*player, callback);

        while (true) {
            co_await ll::chrono::ticks{20};

            player = ll::service::getLevel().transform([uid](Level& level) { return level.getPlayer(uid); });
            if (!player || *closed) co_return;
            buildStatusWindow()->sendUpdate(*player, callback);
        }
    }).launch(ll::thread::ServerThreadExecutor::getDefault());
}
```
