# 监听事件

插件通过事件响应游戏中的行为，例如玩家加入、发送聊天消息、破坏方块。本指南介绍如何监听事件、阻止游戏处理事件，以及查找所需的事件。

在开始之前，你需要一个可以加载的插件，请参考[写你的第一个脚本插件](https://levimc.org/zh-Hans/tutorials/develop/first-script-plugin/)。本指南的示例使用 JavaScript，但各语言的 API 完全相同。

## 1. 监听事件

调用 `mc.listen`，传入事件名和每次事件发生时要调用的函数。在入口脚本的顶层调用它，以便在插件加载时注册监听器：

```js
mc.listen("onJoin", (player) => {
    player.tell(`Welcome, ${player.name}!`);
    log(`${player.name} has joined the server.`);
});
```

该函数会接收事件的参数，例如 `onJoin` 会传入进入游戏的玩家。每个事件的文档页面都列出了对应的参数，`onJoin` 的说明详见[玩家相关事件](../apis/EventAPI/PlayerEvents.md)。

用 Lua 编写同样的监听器：

```lua
mc.listen("onJoin", function(player)
    mc.broadcast(player.name .. " has joined the server.")
end)
```

如果无法注册监听器（例如事件名不存在），`mc.listen` 会返回 `false`。

## 2. 拦截事件

许多事件支持拦截，这类事件的文档页面会注明「拦截事件：函数返回 `false`」。在监听器中返回 `false`，游戏就不再处理该事件，就像它从未发生过一样。下面的监听器会屏蔽包含特定词的聊天消息：

```js
mc.listen("onChat", (player, msg) => {
    if (msg.includes("badword")) {
        player.tell("Please keep the chat friendly.");
        return false;
    }
});
```

这条消息不会显示给任何人。不返回任何值（或返回 `false` 以外的值）则会放行事件。

拦截只会阻止游戏本身的处理，其他插件为同一事件注册的监听器仍会被调用。LSE 会按注册顺序（通常即插件的加载顺序）依次调用该事件的所有监听器。如果想让你的监听器先于另一个插件运行，请在那个插件的 `manifest.json` 中将你的插件设为依赖项（见[插件与引擎](../concepts/plugins.md)）。

## 3. 检查拿到的值

有些参数可能为 `Null`。例如，[玩家死亡事件](../apis/EventAPI/PlayerEvents.md)会传入杀死玩家的实体，但如果死亡不是由实体造成的，该参数就为 `Null`。使用这类值之前请先检查：

```js
mc.listen("onPlayerDie", (player, source) => {
    if (source) {
        log(`${player.name} was killed by ${source.name}.`);
    } else {
        log(`${player.name} died.`);
    }
});
```

请保持监听器简短。监听器在服务器线程上运行，耗时过长会拖慢服务器，对于 `onTick` 这类高频事件更是如此。

## 4. 避免死循环

如果监听器再次触发自身监听的事件，就会陷入死循环。例如，在 `onConsoleCmd` 监听器中调用 `mc.runcmd` 会再次触发 `onConsoleCmd`。请先检查输入再执行操作，或者改用其他事件。

## 找到你需要的事件

事件按主题分类如下：

- [玩家相关事件](../apis/EventAPI/PlayerEvents.md)：加入、离开、聊天、命令、死亡、使用物品……
- [实体相关事件](../apis/EventAPI/EntityEvents.md)和[方块相关事件](../apis/EventAPI/BlockEvents.md)。
- [经济系统事件](../apis/EventAPI/EconomicEvents.md)：金钱的变化。
- [其他事件](../apis/EventAPI/OtherEvents.md)：服务器启动（`onServerStarted`）、每个游戏刻（`onTick`）、控制台命令、计分板分数。

关于 `mc.listen` 本身的详细说明，请参考[事件监听 API](../apis/EventAPI/Listen.md)。
