# 显示表单

表单是 Minecraft 基岩版中的对话框，可以是带标题、文本和按钮的窗口，也可以是带输入控件的窗口。插件把表单发给玩家，并在回调中获取玩家的输入。
本指南将实现一个命令：打开菜单，请玩家输入内容，最后请玩家确认。

示例使用 JavaScript，但各语言的 API 相同。参考文档见[普通表单构建器 API](../apis/GuiAPI/FormBuilder.md) 和[表单 API](../apis/GuiAPI/Form.md)。

## 1. 按钮菜单

普通表单包含标题、文本和按钮。用 `mc.newSimpleForm()` 构建表单，每个方法都返回表单自身，因此可以链式调用：

```js
const menu = mc.newSimpleForm()
    .setTitle("Menu")
    .setContent("What do you want to do?")
    .addButton("Rules", "textures/items/apple")
    .addButton("Players online")
    .addButton("Close");
```

`addButton` 的第二个参数是可选的图片，可以传入游戏内纹理的路径（例如 `textures/items/apple`）或 URL。

## 2. 发送表单并处理回答

`pl.sendForm(form, callback)` 向玩家显示表单。回调会收到玩家对象和所按按钮的序号（从 0 开始）；如果玩家直接关闭表单，序号为 `Null`：

```js
function openMenu(player) {
    player.sendForm(menu, (player, id) => {
        if (id == null) return; // 已关闭
        switch (id) {
            case 0:
                player.tell("Be nice, and have fun.");
                break;
            case 1:
                player.tell(`Online: ${mc.getOnlinePlayers().map((p) => p.name).join(", ")}`);
                break;
        }
    });
}

mc.regPlayerCmd("menu", "Opens the menu", (player, args) => {
    openMenu(player);
});
```

重启服务器，在游戏中输入 `/menu`。同一个表单对象可以向任意多个玩家发送任意多次，每次发送都有独立的回调。

## 3. 带输入控件的表单

自定义表单包含供玩家填写的控件：输入框、开关、下拉菜单和滑块。用 `mc.newCustomForm()` 构建：

```js
const settings = mc.newCustomForm()
    .setTitle("Settings")
    .addInput("Nickname", "Enter a nickname", "")
    .addSwitch("Show welcome messages", true)
    .addDropdown("Team", ["Red", "Blue", "Green"], 0)
    .addSlider("View distance", 2, 16, 1, 8);
```

回调会收到一个数组，按控件在表单中的顺序存放对应的值；如果玩家直接关闭表单，则为 `Null`：

```js
player.sendForm(settings, (player, data) => {
    if (data == null) return; // 已关闭
    const [nickname, welcome, team, distance] = data;
    player.tell(`Nickname: ${nickname}, welcome messages: ${welcome}, team: ${team}, view distance: ${distance}`);
});
```

构建自己的表单时，可以先用 `log` 输出一次 `data`，确认各个下标对应的控件以及值的格式。

## 4. 请玩家确认

模式表单包含一段文本和两个按钮，调用一次 `pl.sendModalForm` 即可发送。玩家按下第一个按钮时回调收到 `true`，按下第二个按钮时收到 `false`，直接关闭表单时收到 `Null`：

```js
player.sendModalForm("Reset", "Reset your settings?", "Yes", "No", (player, result) => {
    if (result) {
        player.tell("Your settings were reset.");
    }
});
```

## 须知

- `sendForm` 和 `sendModalForm` 返回表单的 ID；无法发送时返回 `Null`。
- 回调还会收到第三个参数，表示表单关闭的原因：`0` 表示玩家关闭了表单，`1` 表示玩家正忙。该参数可能为 `Null`。
- `pl.closeForm()` 用于关闭玩家当前打开的表单。
- 也可以不通过构建器直接发送表单：`pl.sendSimpleForm` 用文本数组和图片数组指定按钮，`pl.sendCustomForm` 则直接接受表单的 JSON。详见[表单 API](../apis/GuiAPI/Form.md)。
