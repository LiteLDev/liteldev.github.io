# Form Guide

LeviLamina provides a minimalist form API that lets you build complex forms in just a few lines of code.  
The Form API headers are located in `ll/api/form`. Since Minecraft's form IDs are unique at runtime, LeviLamina also provides **FormIdManager** to obtain them, allowing you to implement your own form API.

## FormIdManager

The FormIdManager header is located at `ll/api/form/FormIdManager.h` and exports `ll::form::FormIdManager::genFormId`, which generates a unique form ID.

### Example

```cpp
#include "ll/api/form/FormIdManager.h"

void test() { uint formId = ll::form::FormIdManager::genFormId(); }
```

## SimpleForm

SimpleForm is a basic form with a title, content, and buttons.  
Its header is located at `ll/api/form/SimpleForm.h`.  
Methods such as `appendButton` return a reference to the SimpleForm object, so you can chain calls.

### Usage

1. Include the header file `ll/api/form/SimpleForm.h`.
2. Construct a SimpleForm object. You can use either the parameterized constructor, which takes a title and content, or the parameterless constructor, in which case you must call `setTitle` and `setContent` manually.
3. Add buttons with `appendButton`, and add visual-only elements with `appendHeader`, `appendLabel`, and `appendDivider`.
4. Call `sendTo` to send the form to a player, passing a reference to a `Player` object and a callback function. The callback receives a reference to the `Player` object, the index of the selected button, and an enumeration value indicating the cancellation reason. For the exact signature, see the `Callback` declaration in `ll/api/form/SimpleForm.h`.

!!! tip
    A button index of -1 means the player canceled the form.  
    `FormCancelReason` is an alias for `std::optional<ModalFormCancelReason>`, so check that it contains a value before accessing it, then compare it against the `ModalFormCancelReason` enumeration values to determine why the form was canceled. The example below uses the `magic_enum` library to get the enumeration value's name.

### Example

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

CustomForm is an advanced form that supports a title, labels, input fields, toggles, dropdowns, sliders, and step sliders.

### Usage

1. Include the header file `ll/api/form/CustomForm.h`.
2. Construct a CustomForm object. You can use either the parameterized constructor, which takes a title, or the parameterless constructor, in which case you must call `setTitle` manually.
3. Add form elements with `appendInput`, `appendToggle`, `appendDropdown`, `appendSlider`, and `appendStepSlider`, and add visual-only elements with `appendHeader`, `appendLabel`, and `appendDivider`.
4. Call `sendTo` to send the form to a player, passing a reference to a `Player` object and a callback function. The callback receives a reference to the `Player` object, the form result, and an enumeration value indicating the cancellation reason. For the exact signature, see the `Callback` declaration in `ll/api/form/CustomForm.h`.

!!! tip
    `CustomFormResult` is an alias for `std::optional<std::unordered_map<std::string, CustomFormElementResult>>`, an unordered map from element names to their results. Look up each result by its element name. Each value is a `CustomFormElementResult`—a variant (`std::variant<std::monostate, uint64, double, std::string>`)—so check its active type with `std::holds_alternative` before extracting the value with `std::get`.

### Example

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

ModalForm is a modal dialog with a title, content, and two buttons, typically used for yes/no or other binary choices.

### Usage

1. Include the header file `ll/api/form/ModalForm.h`.
2. Construct a ModalForm object. You can use either the parameterized constructor, which takes a title, content, upper button, and lower button, or the parameterless constructor, in which case you must call `setTitle`, `setContent`, `setUpperButton`, and `setLowerButton` manually.
3. Call `sendTo` to send the form to a player, passing a reference to a `Player` object and a callback function. The callback receives a reference to the `Player` object, the selected button, and an enumeration value indicating the cancellation reason. For the exact signature, see the `Callback` declaration in `ll/api/form/ModalForm.h`.

!!! tip
    `ModalFormResult` is an alias for `std::optional<ModalFormSelectedButton>`. `ModalFormSelectedButton` is a boolean-backed enumeration with two values, `Upper = true` and `Lower = false`, representing the upper and lower buttons respectively.

### Example

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

While the player has a form open, you can update it using `SimpleForm::sendUpdate`, `CustomForm::sendUpdate`, or `ModalForm::sendUpdate`. There are no restrictions on the content or type of the updated form, and the parameters are the same as those of `sendTo`. The player must still have a form open for these methods to work; otherwise, they have no effect.

### Example

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
