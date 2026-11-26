# 模组生命周期

本页说明 LeviLamina 如何查找服务端或客户端的模组、按什么顺序加载它们，以及何时调用模组的 `load`、`enable`、`disable` 和 `unload`。文中涉及的类和字段详见 [Mod（模组系统）](../api_reference/mod.md)。

## 四个步骤

模组会经历四个步骤。每一步都会调用模组对应的回调；若回调返回 `false`，当前步骤即会中止，LeviLamina 会在日志中记录原因。

| 步骤 | 发生时机 | 回调 | 之后 |
|------|----------|------|------|
| **加载** | 启动时，针对每个应当运行的模组；运行时通过 `/ll load` | `load()` | 模组已加载，处于禁用状态 |
| **启用** | 游戏启动完成时；如果游戏已在运行，则在加载后立即启用 | `enable()` | 模组已启用 |
| **禁用** | 游戏停止时；运行时通过 `/ll disable` | `disable()` | 模组已禁用，但仍处于加载状态 |
| **卸载** | 仅在运行时，通过 `/ll unload` 或 `/ll reload` | `unload()` | 模组被移除，其 DLL 被释放 |

模组的状态（`Mod::State`）只有 `Enabled`（已启用）和 `Disabled`（已禁用）两种：刚加载的模组在启用前处于禁用状态。游戏停止时，模组只会禁用，不会卸载。

使用 `LL_REGISTER_MOD(Class, instance)`（参见 [Mod（模组系统）](../api_reference/mod.md#注册模组入口)中的“注册模组入口”）时，`load()` 是必需的，而 `enable()`、`disable()` 和 `unload()` 仅在类中定义时才会被调用。未定义 `unload()` 的原生模组无法在运行时卸载，LeviLamina 会拒绝该操作并提示“The mod does not register an unload function”。

## 查找模组

启动时，LeviLamina 会扫描模组根目录下的每个文件夹：服务端为 `plugins/`，客户端为 `mods/`（参见 [Mod（模组系统）](../api_reference/mod.md#目录结构)中的“目录结构”）。

- 没有 `manifest.json` 或其内容为空的文件夹会被跳过。
- 清单中的 `name` 必须与文件夹名一致，否则该模组不会加载（报错“Mod name … do not match folder …”）。
- 类型为 `preload-native` 的清单会被跳过：这类模组由 PreLoader 在游戏启动前加载，不属于 LeviLamina 模组（参见 [Mod（模组系统）](../api_reference/mod.md#模组类型)中的“模组类型”）。

## 选择与排序

在加载任何模组之前，LeviLamina 会先根据清单制定加载计划：

1. **加载哪些模组。** 从所有非 `passive` 模组出发，加上它们所需的模组，包括 `dependencies` 以及已安装且版本匹配的 `optionalDependencies`。`passive` 模组仅在被其他即将加载的模组依赖时才会加载。
2. **其中哪些不能运行。** 满足以下任一情况的模组会被排除：缺少依赖，或依赖版本不在要求范围内；`platform` 与当前平台不符（`server` 或 `client`；若为 `universal` 或未填写 `platform`，则两端均可运行）；`conflicts` 中列出了计划内另一个版本匹配的模组；某个依赖已被排除；处于依赖环中。日志会记录具体原因，例如“… will not be loaded because it conflicts with …”。
3. **按什么顺序。** 依赖和可选依赖排在使用它们的模组之前；声明了 `loadBefore` 的模组排在它所列出的模组之前。无先后顺序要求的模组按名称排序。

随后，LeviLamina 按此顺序逐一加载模组。若某个模组的依赖加载失败，该模组也会被跳过。

## 加载

在服务端，LeviLamina 在游戏的 `main` 开始时、游戏本体运行前加载模组；在客户端，则在 PreLoader 将 LeviLamina 加载进游戏时加载。此时游戏本体、世界和玩家都尚未创建。

模组的 `type` 决定由谁来加载它。`native` 模组由 LeviLamina 自身加载；其他类型则由对应类型注册的模组管理器（例如脚本引擎）加载。对于原生模组，LeviLamina 会依次执行以下操作：

1. 将模组所在文件夹加入 `PATH`，以便找到同目录下的随附 DLL；
2. 加载清单中 `entry` 指定的 DLL。如果因缺少导入的 DLL 或函数导致 Windows 无法加载，LeviLamina 会在日志中列出缺失项；
3. 检查该 DLL 是否使用了 LeviLamina 的内存分配运算符（`ll/api/memory/MemoryOperators.h`），未使用的 DLL 不会加载；
4. 调用模组的 `load()`。

DLL 的静态对象会在加载 DLL 时、`load()` 调用前创建，用 `LL_AUTO_` 宏声明的钩子便是在此时安装的（参见[事件与钩子](events_and_hooks.md)）。

## 启用

在服务端，模组在服务器线程启动后启用；在客户端，则在游戏完成初始化时启用。模组按加载顺序依次启用，LeviLamina 会为每个模组输出“Enabling … v…”。只有当模组的所有 `dependencies` 均已启用时，该模组才会启用。

模组从 `enable()` 开始正式介入游戏，例如注册监听器、命令等。游戏运行时通过 `/ll load` 加载的模组，会在 `load()` 执行完毕后立即启用。

## 禁用与卸载

服务器停止或客户端窗口关闭时，LeviLamina 会按与加载相反的顺序禁用模组，确保上层模组先于其依赖的模组被禁用。

模组也可以在游戏运行时禁用或卸载，此时 LeviLamina 会自动完成清理：

- 在游戏运行时**禁用**：移除该模组的事件监听器，并禁用其命令。
- **卸载**：先禁用该模组，再执行其 `unload()`，从事件总线移除其监听器和它提供的事件，最后释放其 DLL。

如果依赖某个模组的其他模组仍处于启用或加载状态，则该模组无法禁用或卸载，LeviLamina 会提示“… still depends on …”。`loadBefore` 不会建立这种依赖关系（参见 [Mod（模组系统）](../api_reference/mod.md#依赖语义)中的“依赖语义”）。

## 在运行时管理模组

在游戏运行时，可以使用 LeviLamina 的 `/ll` 命令对模组执行上述步骤：

| 命令 | 作用 |
|------|------|
| `/ll load <mod> [cascade]` | 加载位于模组根目录下尚未加载的模组，并将其启用 |
| `/ll unload <mod> [cascade]` | 禁用并卸载模组 |
| `/ll reload <mod> [cascade]` | 卸载模组后重新加载 |
| `/ll reactivate <mod> [cascade]` | 禁用模组后重新启用 |
| `/ll enable <mod> [cascade]` | 启用已禁用的模组 |
| `/ll disable <mod> [cascade]` | 禁用模组 |
| `/ll show <mod> [cascade]` | 显示模组清单：名称、作者、描述、类型、版本、入口、额外信息 |
| `/ll list` | 列出已加载的模组 |

`/ll load` 要求目标模组的依赖均已加载。附上 `cascade` 参数时，关联的模组会一并处理：`load` 会同时加载模组根目录下依赖它的模组；`unload`、`reload` 和 `disable` 会连带处理依赖它的模组；`enable` 会先启用它的依赖；`show` 会以树状结构列出它的依赖以及依赖它的模组。

在服务端，该命令为 `/levilamina`（简写 `/ll`），默认需要 `Admin` 权限等级；在客户端为 `/clilevilamina`（简写 `/clill`），任何人都可使用。相关配置位于模组根目录下的 LeviLamina 配置文件 `LeviLamina/config/Config.json` 中的 `modules.command.modManageCommand`（包含 `enabled` 以及服务端使用的 `permission`）。

## 相关文档

- [Mod（模组系统）](../api_reference/mod.md) — `Mod`、`Manifest`、`LL_REGISTER_MOD` 和模组的文件夹
- [事件与钩子](events_and_hooks.md) — 模组启用、禁用或卸载时，监听器和钩子的行为
- [写你的第一个 LeviLamina 模组](https://levimc.org/zh-Hans/tutorials/develop/first-levilamina-mod/) — 从模板开始一步步编写模组
