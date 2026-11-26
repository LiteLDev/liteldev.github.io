# LegacyScriptEngine API：网络与系统

## LSE 插件如何实现自动更新自身？

可以定时检查更新（如用 `network.httpGet` 请求版本信息）。发现新版本后，先将其下载到本地并覆盖插件自身文件，再通过 `mc.runcmdEx` 执行 LeviLamina 的重载命令（如 `ll reload <插件名>`）重载插件。不建议每次加载时从网络拉取代码再通过 `eval` 执行。

*适用版本：LeviLamina + LSE 当前版本*

## LSE 的 `BinaryStream` 中 `writeVec3` 应该传什么参数？和连续调用三次 `writeFloat` 有区别吗？

`writeVec3` 需要传入一个 `FloatPos` 对象。它在底层就是依次调用 `writeFloat` 写入 x、y、z，与连续调用三次 `writeFloat` 等价。

## 在 LSE 的 JS 脚本插件里，能否让玩家进服时一直停留在“正在加载资源”阶段、几乎不下发数据包，等某个 `Promise` 返回后再决定是否放行进服？

脚本插件无法在登录或加载资源阶段挂起玩家连接、阻止下发数据包（`onPreJoin` 等事件回调是同步的，必须当场决定是否拦截，无法等待 `Promise`）。这类需求需要编写 C++ mod，自行 hook 网络或登录流程来实现。

## 基岩版两个服务器之间如何实现跨服传送（传服）？数据能互通吗？

跨服传送本身很简单：LSE 提供了 `pl.transServer(ip, port)`；C++ mod 则可以构造 `<mc/network/packet/TransferPacket.h>` 中的 `TransferPacket`（传入目标 IP 和端口），再通过 `player.sendNetworkPacket` 发送。但各个服务器的数据（包括各插件的数据）不会自动互通，需要自行通过 MySQL 等共享存储，或借助文件、WebSocket 中转来同步。

*适用版本：LSE / LeviLamina 当前版本*
