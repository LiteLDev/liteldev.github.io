# Be.D.D.

在后台运行的 Minecraft 测试：脚本操控 Minecraft 基岩版，你的鼠标、键盘和窗口照常归你用。
[安装](/zh/install)它，或者[从这里开始](https://levimc.org/zh-Hans/tutorials/automate/bedd/)。

![管理窗口里的三个无头 Minecraft 游戏跟着测试脚本动](/showcase/desktop.webp)

## 是什么

Be.D.D. 在后台运行 [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) 客户端模组的端到端测试：游戏从不抢占前台、光标或按键，还能同时开多个游戏。每个游戏内都有一个提供 WebSocket 的客户端模组，而 `BeDD.exe` 负责克隆、准备和启动游戏。

```powershell
BeDD.exe launch --slot 1 --json   # {"pid":…,"url":"ws://127.0.0.1:53021/v1","token":"…",…}
```

```js
import bedboo from 'bedboo';
const bot = bedboo.createBot({ transport: 'bedd', bedd: { url, token } });
bot.once('spawn', () => bot.setControlState('forward', true));
```

按键、聊天、键位绑定、菜单、悬停提示、点击和视角，全都和玩家操作一样生效。每个请求处理完毕后才会返回。

- **测试时照常用电脑。** 游戏从不抢占前台、光标或你的按键（[工作原理](/zh/reference/how-it-works)）。
- **三种驱动方式，省的优先：** 优先用 bedboo 的游戏层操作，其次把菜单读作文本，最后才模拟输入（[操作模式](/zh/guide/operation-modes)）。
- **多开一起测。** 每个游戏一条 WebSocket 连接；克隆一个实例只需几秒（[多开](/zh/guide/several-games)）。
- **一个窗口看全部。** 电脑上的所有游戏实时显示在同一个管理窗口里，关闭窗口即可关闭全部游戏（[管理窗口](/zh/guide/several-games#管理窗口)）。
- **结果确定。** 每个请求都等游戏处理完才返回（[工作原理](/zh/reference/how-it-works)）。
- **任何语言。** 基于本地 WebSocket 的 JSON 协议，附带 AsyncAPI 规范（[接入你的测试](/zh/guide/integrating)）。

![你的输入只到你自己的应用；脚本通过各自的 WebSocket 驱动三个后台游戏](/showcase/how-it-feels.svg)

::: warning 这是测试工具
`mods\` 里装有 Be.D.D. 的游戏不会响应你真实的鼠标和键盘，且只显示在管理窗口中。Be.D.D. 只会装进它自己克隆的实例，从不装进你平时游玩的实例。
:::

## 看它运行

直接录制自管理窗口和终端（[方法](https://github.com/LiteLDev/BeDD/blob/main/CONTRIBUTING.md#docs-and-showcase)）。

### 三个无头游戏，一个管理窗口

<video controls muted playsinline preload="none" poster="/BeDD/showcase/desktop-poster.webp" src="/BeDD/showcase/desktop.mp4" width="1280" height="720" style="width:100%;height:auto"></video>

一个脚本驱动三个游戏，每个都显示各自的实例、pid 和输入活动。

### 脚本每一行，游戏里立刻生效

<video controls muted playsinline preload="none" poster="/BeDD/showcase/script-and-game-poster.webp" src="/BeDD/showcase/script-and-game.mp4" width="1020" height="360" style="width:100%;height:auto"></video>

`key E` 打开背包，`mouse` 移动剑，`key ESC` 关闭背包。

### 聊天命令，替你输入

![text 操作在聊天栏里输入 /summon sheep 和 /summon cow](/showcase/chat-summon.webp)

### 指哪儿悬停，指哪儿点

![虚拟光标在背包里触发物品提示](/showcase/inventory-hover.webp)

对移出屏幕的窗口截取的 `screenshot`。

### 所有游戏，一个窗口

![管理窗口里的三个无头游戏，旁边是运行脚本的终端](/showcase/desktop-poster.webp)

## 给谁用

适合 LeviLamina 客户端模组作者，以及任何需要测试真实 Minecraft 基岩版客户端的人：CI 任务、回归测试，或是需要真实客户端而非协议模拟的机器人。只需装在测试机上。它不是 lip 包，也没在 LeviMC 模组站上架，安装方式见[安装](/zh/install)。

第一次用？教程[用 Be.D.D. 驱动游戏客户端](https://levimc.org/zh-Hans/tutorials/automate/bedd/)会带你安装、配置电脑，并运行第一个脚本。

## 包含什么

| 发行版内容 | |
|---|---|
| `BeDD.exe` | 双击打开[管理窗口](/zh/guide/several-games#管理窗口)；带参数运行则是负责克隆、准备和启动游戏的命令行工具 |
| `mod\BeDD\` | 由 `BeDD.exe mod install` 装入实例的客户端模组 |
| `mod\BeDD-server\` | 服务端模组，用于[客户端 + 服务端测试](/zh/guide/modes) |
| `spec\bedd.asyncapi.yaml` | [WebSocket 协议](/zh/reference/websocket)，供代码生成器使用 |

## 系统要求

x64 的 Windows 10 或 11，以及装有 Minecraft 基岩版 1.26.60（带 LeviLamina）实例的 LeviLauncher。详细要求和安装程序见[安装](/zh/install)。

## 在生态里的位置

| 项目 | 作用 |
|---|---|
| [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) | 安装游戏及其 LeviLamina 实例；Be.D.D. 只克隆该实例，从不往里写入 |
| [LeviLamina](https://levimc.org/zh-Hans/LeviLamina/) | 在游戏（及专用服务器）中加载 Be.D.D. 模组；待测模组也运行在它上面 |
| [bedboo](https://levimc.org/zh-Hans/bedboo/) | 推荐的客户端：提供 mineflayer 风格的机器人 API，通过 Be.D.D. 的 WebSocket 驱动游戏 |

如果不使用 bedboo，任何有 WebSocket 客户端的语言都能直接接入（[操作模式](/zh/guide/operation-modes)、[接入你的测试](/zh/guide/integrating)）。

## 本站的其他内容

- **指南**：[驱动游戏](/zh/guide/usage)、[多开](/zh/guide/several-games)、[接入你的测试](/zh/guide/integrating)、[安装与克隆](/zh/guide/installs)（升级、CI、目录），以及[故障排查](/zh/guide/troubleshooting)。
- **概念**：三种[操作模式](/zh/guide/operation-modes)、[世界在哪里运行](/zh/guide/modes)和[工作原理](/zh/reference/how-it-works)。
- **参考**：[命令行](/zh/reference/cli)、[配置](/zh/guide/configuration)、[WebSocket 接口](/zh/reference/websocket)、[UI 控件树](/zh/reference/ui)和 [Tap 协议](/zh/reference/tap)。

## 名字

Bedrock Deep Dive，得名于《绝区零》中的 H.D.D.：绳匠在远处引导代理人穿行空洞，你的脚本在后台引导 Minecraft。
