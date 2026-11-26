# API 的工作方式

LSE 的 API 在每种语言中都相同：[参考](../apis/README.md)只描述一次，由各引擎映射到各自的语言。本页介绍 API 的结构：脚本在全局作用域中有哪些内容、拿到的对象是什么，以及引擎何时调用脚本提供的函数。

## 脚本一开始就有的东西

运行入口脚本之前，LSE 会把 API 绑定到每个插件的全局作用域中，无需 import 或 `require`。

全局函数：

- `log`、`colorLog` 和 `fastLog` 向服务器控制台输出日志；`setTimeout`、`setInterval` 和 `clearInterval` 延迟或定期运行代码（见[脚本辅助 API](../apis/ScriptAPI/ScriptHelp.md)）。Node.js 引擎使用 Node.js 自带的 `setTimeout` 和 `setInterval`。

命名空间（带有静态函数的对象）：

| 名称 | 内容 | 参考 |
|---|---|---|
| `mc` | 游戏：事件（`mc.listen`）、命令、玩家、实体、方块、物品、表单、计分板 | [GameAPI](../apis/GameAPI/Basic.md)、[EventAPI](../apis/EventAPI/Listen.md)、[GuiAPI](../apis/GuiAPI/FormBuilder.md) |
| `ll` | 加载器和插件：版本、插件信息、`ll.exports` / `ll.imports`、`ll.onUnload` | [ll](../apis/ScriptAPI/Ll.md) |
| `logger` | 插件的可配置日志 | [日志](../apis/ScriptAPI/Logger.md) |
| `data` | 数据辅助：玩家数据、JSON、MD5、SHA-1、Base64 | [其他数据](../apis/DataAPI/OtherData.md) |
| `money` | 经济系统 | [经济系统](../apis/DataAPI/Economy.md) |
| `File` | 文件与目录 | [文件](../apis/SystemAPI/File.md)、[目录与文件](../apis/SystemAPI/FileSystem.md) |
| `network` | HTTP 请求（WebSocket 客户端和 HTTP 服务器是对象 `WSClient` 和 `HttpServer`） | [网络](../apis/SystemAPI/Network.md) |
| `system` | 系统命令、进程和系统信息 | [系统调用](../apis/SystemAPI/SystemCall.md)、[系统信息](../apis/SystemAPI/SystemInfo.md) |
| `NBT` | 解析 NBT，以及 NBT 标签类型 | [NBT](../apis/NbtAPI/NBT.md) |
| `i18n` | 插件文本的翻译 | [国际化](../apis/ScriptAPI/i18n.md) |
| `Format` | Minecraft 文本的格式代码 | [游戏实用工具](../apis/GameAPI/GameUtils.md) |

枚举（如用于[命令](../apis/GameAPI/Command.md)的 `PermType` 和 `ParamType`）也在全局作用域中。

## 对象

API 的大部分功能通过对象完成。获取对象有两种方式：

- **来自游戏**，由 API 返回或传给你的函数：如来自 `mc.getPlayer` 或 `onJoin` 监听器的 `Player`，以及 `Entity`、`Block`、`Item`、`Container` 和命令回调中的 `CommandOrigin`。
- **自己创建**，调用构造函数：`new JsonConfigFile(path)`、`new KVDatabase(dir)`、`new DBSession(type, params)`、`new WSClient()`、`new IntPos(x, y, z, dimid)`、`new NbtCompound(...)`。在 Lua 中直接调用类，不写 `new`：`JsonConfigFile(path)`。

参考文档将这些类型简称为 `Player`、`Entity`、`Block` 等；它们在引擎中注册的实际类名为 `LLSE_Player`、`LLSE_Entity`、`LLSE_Block`……详见[参考概述](../apis/README.md)的「数据类型」一节。

### 玩家和实体是引用，不是副本

`Player` 或 `Entity` 对象直接指向游戏中的玩家或实体：访问属性时才读取数据，调用函数会直接作用于游戏。它持有的是弱引用：一旦玩家离开或实体消失，访问其属性就会返回 `Null`。因此，不要长期保存 `Player` 对象。应当保存能标识玩家的信息（如 `pl.xuid`、`pl.name`），需要时再用 `mc.getPlayer` 获取对象。

### 值与类型

参考文档使用通用的类型名（`Integer`、`Float`、`String`、`Boolean`、`Array`、`Object`、`Null`……），由各引擎映射到各自的类型：例如 `Object` 在 JavaScript 中是对象，在 Lua 中是 table；`Null` 在 JavaScript 中是 `null` 或 `undefined`，在 Lua 中是 `nil`。[参考概述](../apis/README.md)提供了完整的对照表和文档约定：参数写作 `名称 : 类型`，可选参数用 `[ ]` 括起。

许多函数在失败时返回 `Null`（如玩家不在线、表单无法发送），使用返回值前应先检查。另一些函数（如 SQL 数据库相关的函数）则会抛出错误。

## 你的代码何时运行

插件加载时，引擎会运行一次入口脚本。此后插件的所有操作，都在它传给 API 的函数中执行：

- **事件监听器**（`mc.listen`），每次事件发生时调用；
- **命令回调**（`mc.newCommand`、`mc.regPlayerCmd`、`mc.regConsoleCmd`），执行命令时调用；
- **表单回调**（`pl.sendForm`、`pl.sendModalForm`），玩家提交或关闭表单时调用；
- **定时任务**（`setTimeout`、`setInterval`），时间到达时调用；
- **卸载函数**（`ll.onUnload`），插件卸载时调用。

这些函数运行在服务器线程上，穿插在游戏自身的工作之间。耗时的函数会阻塞服务器：请保持监听器简短，不要在 `onTick` 这类高频事件中执行繁重的任务。

如果函数抛出错误，LSE 会捕获并输出到控制台，同时指明触发错误的事件或回调以及插件名称，插件本身会继续运行。调用 API 时若参数不足或类型有误，也会抛出指明该 API 和插件名称的错误。

### 事件会发给每个监听器

事件发生时，LSE 按注册顺序（通常就是插件的加载顺序）依次调用各插件为该事件注册的监听器。监听器返回 `false` 会拦截事件：游戏不再处理该事件（如同从未发生），但其他插件的监听器仍会被调用。详见[事件监听](../apis/EventAPI/Listen.md)。

## 接下来

- [插件与引擎](plugins.md)：插件如何加载和卸载。
- [语言支持](../apis/LanguageSupport.md)：各引擎的差异。
- 指南：[监听事件](../guides/events.md)、[注册命令](../guides/commands.md)、[显示表单](../guides/forms.md)、[存储数据](../guides/storing_data.md)以及[日志与定时任务](../guides/logging_and_timers.md)。
