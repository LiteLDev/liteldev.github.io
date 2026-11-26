# 模组与集成

LeviLauncher 除了基础启动器功能外，还支持完整的模组工作流。

## 当前可用能力

=== "Windows"

    - 导入模组包（`.mcmod`）
    - 兼容 `.zip` 包和单独的 `.dll` 模组：在文件选择框中选择 **所有文件 (\*.\*)** 即可
    - 启用或禁用已安装的模组
    - 删除不再需要的模组
    - 浏览并获取 CurseForge 资源
    - 使用兼容 [lip](https://github.com/LiteLDev/lip) 的内置包管理器安装 LIP 软件包
    - 配合 LeviLamina 等加载器使用

    ::: warning 这是高级区域
    模组、加载器与包安装集成的兼容性变化往往更快，尤其是在 Minecraft 预览版（Preview）上。请将其视为高级功能，逐步测试。
    :::

=== "Android"

    - 向游戏加载原生模组（`.so` 库）
    - 在隔离版本中维护带模组的环境

    想开发原生模组？请参阅 LeviLamina 文档中的 [Android 原生模组](https://levimc.org/zh-Hans/LeviLamina/developer_guides/android/)。

## 推荐的模组工作流

1. 从一个干净的隔离版本开始。
2. 先确认该版本在未加模组时可以正常启动。
3. 每次只添加一个模组或做一小组改动。
4. 每次改动后都重新启动测试。
5. 始终为重要世界保留备份。

## CurseForge <Badge platform="windows" />

启动器支持在应用内浏览和获取 CurseForge 资源，方便你直接查找所需内容。

适合以下场景：

- 需要更直观的引导式查找体验
- 想快速查看某个项目的兼容文件
- 不想跳出启动器去搜索资源

## lip 与 LeviLamina <Badge platform="windows" />

LeviLauncher 内置了兼容 [lip](https://github.com/LiteLDev/lip) 的包管理器，无需另外安装 lip 或 .NET 运行时。它遵循 lip 的规范：每个版本的软件包记录在 `.lip/state.json` 中，软件包配置从其 `lip.toml` 读取（仅含 `tooth.json` 的旧软件包仍可使用）。曾用旧版启动器安装过 LeviLamina 或 LIP 软件包的版本（含 `tooth_lock.json`），会在首次执行软件包操作时自动迁移。开启 **使用镜像源** 时，从 GitHub 下载软件包会走[设置](./settings-personalization)中的 **GitHub 代理**；否则直接连接 GitHub（若已设置系统代理，则走系统代理）。此前保存过的 GitHub 代理，或 lip 的 `config.toml`（位于 `%APPDATA%\lip`，例如通过 `lip config set github_proxy <URL>` 设置）中的 `github_proxy`，在这两种情况下都会生效。点击 **清理缓存** 可删除已下载的软件包文件。

自 lip v0.40 起，`lip.toml` 与 `.lip/state.json` 中的每个条目都用 `side`（`server` 或 `client`）和 `platform`（.NET 运行时标识符，例如 `win-x64`）表示运行环境；而在 lip v0.39 及更早版本中，这两个字段分别叫作 `platform` 和 `runtime`。由 lip v0.39 及更早版本或旧版启动器写入、仍使用旧键名的 `.lip/state.json`，会在下一次包操作前自动转换：将 `platform` 改名为 `side`，将 `runtime` 改名为 `platform`。若转换后 lip 仍无法读取该文件，启动器会拒绝操作并提示所需的修改：将 `platform` 改名为 `side`、将 `runtime` 改名为 `platform`，或重新安装该版本的软件包。

这类集成更适合习惯使用包管理器或加载器工作流的高级用户。

最佳实践：

- 先从稳定的正式版（Release）开始
- 避免一次改动多个高风险项
- 记录下“最后一次正常运行”的版本组合

要为客户端版本添加 LeviLamina，请参阅 LeviLamina 文档中的[在Windows上安装客户端](https://levimc.org/zh-Hans/LeviLamina/user_guides/install_on_client/)。

### LeviMC 模组页面

**LeviMC 模组** 页面列出了 [levimc.org/mods](https://levimc.org/zh-Hans/mods/) 中提供 Windows x64 客户端构建的模组（即含 `side = "client"` 且 `platform = "win-x64"` 条目的模组）。你可以按名称、ID、作者、标签或简介搜索；按相关性、星标、最近更新或最新发布排序；还可以按游戏版本、LeviLamina 版本、标签（前置库 / API、经济等推荐标签排在最前，也支持排除特定标签）、许可证（宽松等类别或 SPDX ID）、依赖和作者（模组页面上的 **…的更多项目**）筛选。安装模组时会优先选择 `client` 变体，若无则选择默认变体，若仍无则选择第一个含客户端构建的其他变体；你也可以在模组页面中手动改选其他含客户端构建的变体。levimc.org 模组页面上的 **用 LeviLauncher 安装** 按钮是一个 `levilauncher://install/<mod id>?version=<version>` 链接，点击后会调用 LeviLauncher 安装该模组的指定版本。

## 原生模组 <Badge platform="android" />

原生模组会在游戏进程中运行原生代码。请仅安装来自可信来源的模组，并先在隔离版本中测试。

如需自行开发，请参阅 LeviLamina 文档中的 [Android 原生模组](https://levimc.org/zh-Hans/LeviLamina/developer_guides/android/)。

## 如果加了模组后出错

- 先禁用最新添加的模组
- 与上一个可正常工作的状态对比
- 进一步测试前，先转移或备份重要世界
- 继续参阅[更新与故障排查](./update-troubleshooting)
