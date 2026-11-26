---
platforms: [windows]
---
# 文件夹与文件

以下列出 Windows 版 LeviLauncher 读写的所有文件和文件夹（以 LeviLauncher 1.1.0 为准）。启动器不会向系统临时文件夹（`%TEMP%`）写入任何内容。

## 概览

| 文件夹 | 位置 | 内容 |
| --- | --- | --- |
| 设置文件夹 | `%APPDATA%\LeviLauncher\` | 只有 `config.json`：体积小，随 Windows 配置文件漫游 |
| 本机文件夹 | `%LOCALAPPDATA%\LeviLauncher\` | 日志、微软账号、窗口的 WebView2 数据；也是默认的数据根目录 |
| 数据根目录 | 本机文件夹，除非你另选一个（**设置 → 基础设置** 中的 **根目录**，或 `config set data-root`） | `Instances\`、`Backups\`、`Cache\` |

```text
%APPDATA%\LeviLauncher\
  config.json                      启动器的设置
%LOCALAPPDATA%\LeviLauncher\        默认的数据根目录
  Logs\startup.log                 启动器日志，以及之前的 startup.1.log … startup.4.log
  Accounts\                        微软账号和设备记录，按当前 Windows 用户加密
  WebView2\                        启动器窗口的数据
  storage-migration.json           从旧布局迁移的记录（见下文）
<数据根目录>\
  Instances\<实例>\                 一个实例（见下文）
  Backups\
    Worlds\<实例>\<文件夹>_<世界>\<世界>_<yyyyMMdd-HHmmss>.mcworld
    Instances\<实例>\<实例>_<yyyyMMdd-HHmmss>.zip
  Cache\
    Installers\                    游戏安装包，以及 Visual C++ 和 WebView2 安装程序
    Updates\                       启动器更新包，安装后删除
    Downloads\                     为导入而下载的文件，超过 1 天后在启动时清理
    Imports\                       交给导入处理的文件，超过 1 天后在启动时清理
    gdk-pending-versions.json
    gamertags.json                 启动器见过的玩家档案的玩家代号
```

`Cache\` 中的所有内容都可以放心删除，不会丢失任何数据。运行 `LeviLauncher.exe cache clean` 会删除软件包缓存、为导入而下载的文件和未完成的下载；运行 `LeviLauncher.exe installer remove` 则会删除已下载的游戏安装包。更改数据根目录只是让启动器改用另一个文件夹，已有的实例、下载和备份不会随之移动。

## 实例的文件夹

```text
Instances\<实例>\
  Minecraft.Windows.exe …          该构建的游戏文件
  LeviLauncher.dll                 LeviLauncher 的原生加载器（x64 构建）
  .levilauncher\                   启动器在实例内的状态（隐藏）
    instance.json                  名称、游戏版本、通道、隔离与启动选项
    icon.ico                       实例图标，由游戏的 LargeLogo.png 生成
    xbox-auth-key-v1               UWP 实例用于 Xbox 登录的标记
  .lip\                            实例中已安装软件包的状态（lip 的格式）
  mods\                            模组（见“模组如何加载”）
  Minecraft Bedrock\               开启隔离时的游戏数据（预览版：Minecraft Bedrock Preview）
```

开启和未开启隔离时实例游戏数据文件夹的位置见[实例隔离](../concepts/isolation)，`mods\` 的详情见[模组如何加载](../concepts/mod-loading)。

## LeviLauncher 文件夹之外

| 路径 | 说明 |
| --- | --- |
| 桌面上的 `Minecraft - <实例>.lnk` | 实例的桌面快捷方式（通过 **创建桌面快捷方式** 或 `instance shortcut` 创建）。它会以 `--launch=<实例>` 参数打开启动器，且只写入当前用户的桌面，不写入公共桌面。 |
| `%APPDATA%\lip\` | lip 的设置文件 `config.toml`（例如其中的 `github_proxy`），内置包管理器也会读取。 |
| `%LOCALAPPDATA%\lip\Cache\` | 内置包管理器的软件包缓存，与 lip 共用。点击 **设置 → 包管理** 中的 **清理缓存** 会清空此文件夹。 |
| `%APPDATA%\Minecraft Bedrock\`、`%APPDATA%\Minecraft Bedrock Preview\` | 未开启隔离的 GDK 实例共用的游戏数据。 |
| `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\`（预览版：`Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`） | 未开启隔离的 UWP 实例共用的游戏数据。 |

## 文件如何写入

- 写入文件时，会先在目标位置旁生成 `<名称>.<随机串>.tmp`，写完后再重命名为最终文件名，因此不会出现只写了一半的文件。支持断点续传的未完成下载则保存为 `<名称>.partial.tmp`。
- 用户输入的名称（如实例名、世界名）会按 Windows 规则清理：去除 `<>:"/\|?*` 字符以及末尾的句点和空格，并避开 `CON`、`NUL` 等系统保留名。
- 启动器生成的文件按 `<名称>_<yyyyMMdd-HHmmss>.<扩展名>` 格式命名，例如 `MyWorld_20261107-142301.mcworld`。

## 旧布局

1.1.0 之前的 LeviLauncher 将所有内容存放在 `%APPDATA%\<程序名>\`（例如 `%APPDATA%\levilauncher.exe\`）下，其中包含 `versions\`、`backups\`、`installers\`、`updates\`、`logs\` 文件夹，以及 `config.json`、`user_gamertag_map.json` 和 `gdk_pending_versions.json` 文件；实例文件夹内则是 `version.json` 和 `LargeLogo.ico`。

首次启动 LeviLauncher 1.1.0 及更高版本时，启动器会将旧数据一次性迁移到新布局，且不删除任何文件：同一驱动器上的数据直接移动到位，不同驱动器上的数据则复制过去并保留原件，旧的 `config.json` 会重命名为 `config.migrated.json`。如果此前自定义过数据根目录，该目录会留在原处。若有内容无法迁移（例如某个实例中的游戏仍在运行），所有已执行的操作都会回滚，启动器本次仍按旧布局运行，待下次启动时再试。迁移记录保存在 `storage-migration.json` 中；迁移完成后，桌面快捷方式也会更新为新位置。
