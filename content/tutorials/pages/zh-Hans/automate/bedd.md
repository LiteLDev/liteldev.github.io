# 用 Be.D.D. 驱动游戏客户端

学完本教程后，你将能用脚本驱动在后台运行的 Minecraft 基岩版：脚本把当前界面读取为文字，截一张图，然后关闭游戏。全程无需触碰游戏窗口，也不耽误正常使用鼠标和键盘。这正是 Be.D.D.（Bedrock Deep Dive）的用途——测试 LeviLamina 客户端模组（端到端测试），或应对其他需要用程序控制真实游戏客户端的场景。

整个过程大约需要半小时，大部分时间花在下载游戏上。

::: warning 这是测试工具
一旦 `mods\` 中装有 Be.D.D.，游戏就会忽略真实的鼠标和键盘输入，且画面只显示在 Be.D.D. 的管理窗口中。Be.D.D. 只会装入它自己创建的游戏副本，绝不会改动你日常游玩的实例。
:::

## 你需要准备

- 一台 Windows 10 或 11 电脑（x64）。
- 一个拥有 Minecraft（Windows 版）的 Microsoft 账号。
- [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) 1.1 或更高版本。如果尚未安装，请先完成[在 Windows 上玩模组](../play/play-with-mods.md)的第 1、2 步。
- [Node.js](https://nodejs.org/zh-cn) 24 或更高版本，用于运行脚本（可用 `node -v` 检查版本）。

不需要安装 PowerShell 模块、`lip` 或 .NET 运行时。

## 1. 安装基础实例

Be.D.D. 0.4 用于驱动装有 LeviLamina **26.60.x** 的 Minecraft **1.26.60**（GDK 正式版）。它会复制 LeviLauncher 中的这个实例，而绝不会修改或启动原实例。这个原实例称为**基础实例**。

在终端中运行以下 LeviLauncher 命令（如果 `LeviLauncher.exe` 不在 `PATH` 中，请替换为完整路径）：

```powershell
LeviLauncher.exe account login              # 每台电脑一次：登录拥有 Minecraft 的账号
LeviLauncher.exe install 1.26.60 --loader   # 1.26.60 GDK 正式版，带 LeviLamina
LeviLauncher.exe instance list              # 检查结果
```

你应该会在列表中看到一个游戏版本为 `1.26.60.xx`、加载器为 `26.60.x` 的实例。

如果你习惯用图形界面，也可以按照[在 Windows 上玩模组](../play/play-with-mods.md)的第 3 步，在 LeviLauncher 窗口中添加带 LeviLamina 的 1.26.60 版本，效果相同。

## 2. 安装 Be.D.D.

1. 从[最新发布](https://github.com/LiteLDev/BeDD/releases/latest)页面下载并运行 `bedd-windows-x64-setup.exe`。安装无需管理员权限，默认按当前用户安装到 `%LOCALAPPDATA%\Programs\BeDD`，在开始菜单中添加 **BeDD**，并将安装目录加入 `PATH`。
2. 打开一个**新的**终端，运行：

   ```powershell
   BeDD.exe version
   ```

   终端应输出 `Be.D.D. 0.4.0`（或更高版本），以及它所支持的 Minecraft 和 LeviLamina 版本。

如需免安装压缩包或供 CI 使用的静默安装方式，请参见[安装 Be.D.D.](https://levimc.org/zh-Hans/BeDD/install)。

## 3. 在后台启动游戏

```powershell
BeDD.exe launch --slot 1 --json
```

`launch` 命令会一次性完成以下操作：

1. 为基础实例创建一个**克隆**，命名为 `<游戏版本>-<槽位>`（例如 `1.26.60.05-1`）。克隆拥有独立的 `mods\`、存档、设置和日志；而游戏本体文件则通过硬链接指向基础实例，几乎不占用额外磁盘空间。
2. 将 Be.D.D. 模组装入该克隆。
3. 在后台启动游戏并打开**管理窗口**；待游戏就绪后，向终端输出一行 JSON 并退出命令，游戏则继续在后台运行。

终端会输出类似下面的一行内容：

```json
{"pid":12345,"instance":"1.26.60.05-1","instanceDir":"…","url":"ws://127.0.0.1:53021/v1","token":"9f3c…","label":"…"}
```

同时屏幕上会弹出显示游戏画面的管理窗口。脚本通过返回结果中的 `url` 和 `token` 与游戏通信：每个游戏实例都在 `127.0.0.1` 上开放一个 WebSocket 端口，且每次启动都会生成新的访问令牌。

你可以随时运行 `BeDD.exe ps` 查看正在运行的游戏实例。

## 4. 编写你的第一个脚本

脚本与游戏通过 JSON 消息通信：脚本每发一条请求（例如 `{"id": 1, "op": "ping"}`），游戏处理完后就会回复一条带有相同 `id` 的消息。新建一个文件夹，在里面创建 `hello-bedd.mjs` 文件：

```js
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

// 找到游戏：`BeDD.exe ps --json` 列出每个运行中的游戏及其 url 和 token。
const games = JSON.parse(execFileSync('BeDD.exe', ['ps', '--json'], { encoding: 'utf8' }));
const game = games.find((g) => g.kind === 'client' && g.status === 'ready');
if (!game) throw new Error('No game runs: start one with BeDD.exe launch --slot 1');

// 连接，并用 call(op, fields) 发送请求：它会以回复作为结果。
const ws = new WebSocket(`${game.url}?token=${game.token}`);
const waiting = new Map();
let nextId = 1;
ws.onmessage = (event) => {
  if (typeof event.data !== 'string') return; // 二进制帧是数据包，不是回复
  const reply = JSON.parse(event.data);
  waiting.get(reply.id)?.(reply);
  waiting.delete(reply.id);
};
const call = (op, fields = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  waiting.set(id, (r) => (r.ok ? resolve(r) : reject(new Error(`${op}: ${r.error}`))));
  ws.send(JSON.stringify({ id, op, ...fields }));
});
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

// 1. 这个游戏能做什么？
const ping = await call('ping');
console.log('instance:', game.instance, '| default mode:', ping.defaultMode);

// 2. 把最前面的界面读成文字。
const { view } = await call('ui');
console.log(view);

// 3. 截图。窗口隐藏时也能截。
const shot = await call('screenshot', { format: 'png' });
writeFileSync('screen.png', Buffer.from(shot.data, 'base64'));
console.log(`saved screen.png (${shot.width}x${shot.height})`);

ws.close();
```

运行脚本：

```powershell
node hello-bedd.mjs
```

终端应输出实例名称、`default mode: bedboo`，以及转为文字的标题界面，如下所示：

```text
screen start_screen
- button "Play" [e1]
- button "Settings" [e2]
- text "v26.60/LeviLamina-26.60.5"
```

同时，脚本所在目录下会生成一张名为 `screen.png` 的标题界面截图。文字输出中控件后面的 `[e1]` 是它的 **ref**（引用标识），调用 `call('ui', { action: 'click', ref: 'e1' })` 即可点击 **Play** 按钮。

## 5. 停止游戏

```powershell
BeDD.exe stop 1.26.60.05-1
```

请将命令中的实例名替换为 `launch` 实际输出的名称。执行后终端会显示 `stopped 1.26.60.05-1 (pid …)`，游戏画面也会从管理窗口中消失。你也可以直接在管理窗口中关闭游戏。

克隆实例会保留在磁盘上：下次运行 `BeDD.exe launch --slot 1`，只需几秒钟就能重新启动。若指定 `--slot 2`，则会创建第二个克隆，让两个游戏实例同时运行。

## 你现在有了什么

- 已安装好的 Be.D.D.，以及一个可在后台运行的 Minecraft 1.26.60 克隆实例。
- 一个能够自动发现运行中的游戏、通过 WebSocket 与其通信、读取界面结构并保存截图的脚本。

## 下一步

- 了解驱动游戏的推荐方式及原因（优先用 bedboo，其次用 UI 树，最后才用模拟输入）：[操作模式](https://levimc.org/zh-Hans/BeDD/guide/operation-modes.html)。
- 使用 mineflayer 风格的机器人控制移动、转视角、使用物品和战斗：先读[你的第一个 bedboo 机器人](first-bedboo-bot.md)，再看 bedboo 文档中的[驱动真实客户端（BeDD）](https://levimc.org/zh-Hans/bedboo/guide/bedd.html)。
- 读取和点击游戏菜单：[UI 控件树](https://levimc.org/zh-Hans/BeDD/reference/ui.html)；查阅所有请求格式与字段说明：[WebSocket 接口](https://levimc.org/zh-Hans/BeDD/reference/websocket.html)。
- 同时运行多个游戏实例并使用管理窗口：[多开](https://levimc.org/zh-Hans/BeDD/guide/several-games.html)。
- 配合专用服务器一起测试客户端：[世界在哪里运行](https://levimc.org/zh-Hans/BeDD/guide/modes.html)。
- 调整窗口大小等模组设置：[配置](https://levimc.org/zh-Hans/BeDD/guide/configuration.html)。
- 排查使用中遇到的问题：[常见问题](https://levimc.org/zh-Hans/BeDD/guide/troubleshooting.html)。
