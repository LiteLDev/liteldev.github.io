# 实例隔离

在每台设备上，Minecraft 都会把世界、包和设置保存在一个游戏数据文件夹里。**实例隔离**（对应应用中 **实例设置** 里的 **启用实例隔离**，以及安装版本时的 **实例隔离**）会让实例改用位于实例内部的独立游戏数据文件夹。命令行将这两种方式称为 *own data*（自有数据）和 *shared data*（共享数据）。

## 共享数据与自有数据

=== "Windows"

    **未开启隔离**的实例使用本机上 Minecraft 默认的游戏数据，与 Microsoft Store 版游戏及同类型的其他未隔离实例共用世界、包和设置。

    **开启隔离**的实例将游戏数据保存在自己的文件夹中。它的世界、资源包、行为包、皮肤包、截图、服务器列表和游戏设置与所有其他实例及 Microsoft Store 版游戏完全分开。

    | 实例 | 共享数据（隔离关闭） | 自有数据（隔离开启） |
    | --- | --- | --- |
    | GDK，正式版 | `%APPDATA%\Minecraft Bedrock` | `<实例>\Minecraft Bedrock` |
    | GDK，预览版 | `%APPDATA%\Minecraft Bedrock Preview` | `<实例>\Minecraft Bedrock Preview` |
    | UWP，正式版 | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<实例>\Minecraft Bedrock` |
    | UWP，预览版 | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe\LocalState` | `<实例>\Minecraft Bedrock Preview` |
    | UWP，Beta | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState` | `<实例>\Minecraft Bedrock Beta` |

    `<实例>` 是该实例在 `Instances` 中的文件夹（见[文件夹与文件](../reference/files)）。在 GDK 数据文件夹中，每个玩家的数据位于 `Users\` 下（见[玩家档案](./instances#player-profiles)）；在 UWP 数据文件夹中，则位于 `games\com.mojang\` 下。

=== "Android"

    版本隔离会将该版本的游戏数据（世界、包和设置）与其他版本以及从 Google Play 安装的 Minecraft 分开。修改单个实例的此项设置不会影响其他实例。导入的版本通常需要开启隔离才能启动。

## 工作原理 <Badge platform="windows" />

游戏本身并不知道实例的存在。LeviLauncher 安装实例时，会将自带的加载器 `LeviLauncher.dll` 放在游戏可执行文件旁边（见[模组如何加载](./mod-loading)）。开启隔离的实例启动时，加载器会将游戏查找数据的路径（应用数据文件夹和临时文件夹）重定向到实例的数据文件夹。这一过程不复制也不链接任何文件，游戏直接在该文件夹中读写。

以下内容不受隔离影响：

- **模组**始终按实例存放在各自的 `mods\` 文件夹中，与是否开启隔离无关。
- **微软账号**和启动器自身的设置在所有实例间共用。
- 向 Windows **注册**（见[实例与游戏版本](./instances#registration-with-windows)）与是否开启隔离无关。

## 限制 <Badge platform="windows" />

- GDK 实例的所有版本均支持隔离；UWP 实例从 1.19.70.2 起支持，且仅限 x64。
- 开启隔离不会复制任何文件，实例会从空白的游戏数据起步。如需沿用现有数据，可以在安装版本时选择从本机已安装的游戏或同类型的其他隔离实例复制数据，也可以事后使用 `LeviLauncher.exe instance copy-data` 复制（GDK）。
- 关闭隔离后，实例会恢复使用共享数据，但原本的自有数据文件夹仍会保留在实例文件夹中。
- 删除实例会一并删除整个实例文件夹，**包括它自有数据中的世界**。删除前请先备份重要世界（见[世界工具](../guide/world-tools)）。
- 只有当目标实例开启了隔离，或是使用不同数据文件夹的 UWP 实例时，才能从其他实例向其复制内容。

## 什么时候使用

实例隔离适合以下场景：

- 在不同版本中使用不同的内容组合
- 更安全地测试模组或 Minecraft 预览版（Preview）
- 降低一个环境影响另一个环境的风险

推荐配置：准备一个隔离的正式版实例用于日常游玩，一个隔离的预览版实例按需使用，再加一个临时实例专门用于测试模组或排查问题。

## 相关页面

- [版本管理](../guide/version-management)
- [内容管理](../guide/content-management)
- [实例与游戏版本](./instances)
