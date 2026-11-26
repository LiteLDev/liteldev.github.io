# 你的第一个脚本插件

完成本教程后，你的服务器将运行一个用 JavaScript 编写的插件。它会问候每个加入的玩家，显示一条欢迎提示，在他们脚下掉落一颗钻石，并添加一个控制台命令。该插件基于 LegacyScriptEngine（LSE）运行。LSE 让你能用 JavaScript、Lua 或 Python（而非 C++）编写 LeviLamina 插件：无需编译器，无需构建，只要一个文本文件和一次重启。

全程大约需要二十分钟。

## 你需要准备

- 一个用 `lip` 搭建、装有 LeviLamina 的服务器，详见[开你的第一个服务器](../server/first-server.md)。本教程使用 `D:\servers\survival`。
- 一个文本编辑器。[Visual Studio Code](https://code.visualstudio.com/) 是不错的选择，任何能保存纯文本的编辑器都可以。
- 任意设备上能连到服务器的 Minecraft 基岩版，用来在游戏中查看问候效果。没有它也可以完成第 1 到 4 步。

你不需要精通 JavaScript：代码很短，并且会逐行解释。如果你从没写过 JavaScript，可以先看 [MDN 的 JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)了解基础知识。

## 1. 安装 JavaScript 引擎

LSE 为每种语言提供一个包，称为**变体**。本教程使用 JavaScript 引擎 `#quickjs`。

1. 如果服务器正在运行，先停止它。
2. 在服务器文件夹中安装该变体：

   ```shell
   cd D:\servers\survival
   lip install github.com/LiteLDev/LegacyScriptEngine#quickjs
   ```

3. 运行 `lip list`。你会看到 `github.com/LiteLDev/LegacyScriptEngine#quickjs` 及其版本号，下方还会列出它的依赖。

你也可以在 `lip` 的「市场」页安装，详见[给服务器安装模组](../server/install-mods.md)。

## 2. 创建插件文件夹

和 C++ 模组一样，插件也是 `mods` 下的一个文件夹，里面放着脚本和 `manifest.json`。

1. 创建文件夹 `D:\servers\survival\mods\MyPlugin`。
2. 在其中创建 `manifest.json`，内容如下：

   ```json
   {
       "entry": "main.js",
       "name": "MyPlugin",
       "type": "lse-quickjs",
       "dependencies": [
           {
               "name": "legacy-script-engine-quickjs"
           }
       ]
   }
   ```

   - `entry`：要运行的脚本。
   - `name`：插件名称，请与文件夹名保持一致。
   - `type`：运行该插件的引擎。JavaScript 为 `lse-quickjs`，其他引擎为 `lse-lua`、`lse-nodejs` 和 `lse-python`。
   - `dependencies`：让 LeviLamina 先加载引擎。

3. 在同一文件夹下创建一个空的 `main.js`。

::: tip `plugins` 和 `mods` 是同一个文件夹
LSE 启动时会把服务器的 `plugins` 文件夹链接到 `mods`，因此 `plugins\MyPlugin` 指向同一个位置。如果你直接把单个旧版脚本（如 `MyPlugin.js`）放进去，LSE 会在下次启动时自动为它创建文件夹和 `manifest.json`，再重启一次即可加载。
:::

## 3. 让插件打个招呼

在 `main.js` 中写入：

```js
log("MyPlugin is running!");
```

`log` 会向服务器控制台输出一行文本。你不需要导入或定义它：LSE 会为每个脚本自动提供 `log`、`mc` 以及 API 中的其他对象。

启动服务器（在 `lip` 中选择**启动服务器**，或运行 `lip run`）。在 LeviLamina 加载模组的日志中，你会看到一行 `MyPlugin is running!`。如果插件有误，控制台也会在那里显示错误信息和行号。

进入下一步前，先停止服务器。

## 4. 添加控制台命令

添加一个只能在服务器控制台执行的命令：

```js
mc.regConsoleCmd("greet", "Greets someone from the console", (args) => {
    log(`Hello, ${args[0] ?? "world"}!`);
});
```

`mc.regConsoleCmd` 用于注册命令及执行该命令时要调用的函数。LSE 会把命令后面的内容拆分为参数，传入 `args`。

启动服务器，在输入行中输入 `greet Steve`，你会看到 `Hello, Steve!`。

## 5. 在玩家加入时问候

接下来响应一个游戏事件。每当事件发生，`mc.listen` 就会调用你的函数。`onJoin` 是玩家进入游戏的事件，会把对应的玩家对象传给你的函数：

```js
mc.listen("onJoin", (player) => {
    log(`${player.name} has joined the server.`);
    player.sendToast("Welcome!", "Thanks for joining the server!");
    const loginReward = mc.newItem("minecraft:diamond", 1);
    mc.spawnItem(loginReward, player.pos);
});
```

逐行说明：

1. `log(...)`：把玩家的名字输出到控制台。
2. `player.sendToast(title, message)`：在玩家屏幕顶部显示一条提示。
3. `mc.newItem(name, count)`：创建一个物品堆（一颗钻石）。
4. `mc.spawnItem(item, pos)`：把物品掉落在玩家所在的位置。

现在，你的 `main.js` 已经包含第 3、4、5 步的三段代码。重启服务器，从 Minecraft 加入游戏（若在同一台电脑上，地址填 `127.0.0.1`，端口填 `19132`）。你会看到：

- 控制台输出 `<你的名字> has joined the server.`；
- 游戏中弹出提示 **Welcome!**，身旁的地上有一颗钻石。

::: tip 小步前进
每次只改一处，然后重启并检查。这样一旦出问题，你就知道是哪次修改引起的。插件及其所调用 API 的所有错误都会显示在服务器控制台中。
:::

## 6. 获取编辑器提示（可选）

编辑器本身不认识 `mc`、`log` 等 API。[legacy-script-engine-api](https://github.com/LiteLDev/legacy-script-engine-api) 仓库提供了 JavaScript、TypeScript 和 Python 的类型定义，可实现自动补全和内联文档。请参照该仓库的 README 配置你的编辑器。

## 你现在有了什么

- 服务器上的 LSE JavaScript 引擎。
- 插件 `mods\MyPlugin`：包含一个 `manifest.json`，以及一个写有控制台命令和加入事件的 `main.js`。
- 基本开发流程：编辑 `main.js`，重启服务器，查看控制台。

## 下一步

- 所有可监听的事件：[事件监听](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/EventAPI/Listen/)与[玩家事件](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/EventAPI/PlayerEvents/)。
- 对玩家可执行的操作：[玩家 API](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/GameAPI/Player/)。
- 带参数和权限、可供玩家使用的命令：[命令 API](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/GameAPI/Command/)。
- 向玩家展示对话框：[表单 API](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/GuiAPI/Form/)；在文件中保存设置：[配置文件 API](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/DataAPI/ConfigFile/)。
- 完整 API 与其他语言：[LegacyScriptEngine API](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/) 与[语言支持](https://levimc.org/zh-Hans/LegacyScriptEngine/apis/LanguageSupport/)。
- 常见问题：[LegacyScriptEngine FAQ](https://levimc.org/zh-Hans/faq/scripts/lse/basics/)。
- 将插件作为 `lip` 包分享：[lip.toml](https://levimc.org/zh-Hans/lip/concepts/lip_toml.html) 中的 `self` 资源会安装你仓库中的文件，发布步骤详见[用 lip 发布你的模组](publish-a-package.md)。
- 需要更高的性能或访问游戏底层：[你的第一个 LeviLamina 模组](first-levilamina-mod.md)。
