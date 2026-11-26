# 开发工具

读完本页，你就能使用界面里为包作者准备的两个工具：在一个边输入边检查的表单里创建和编辑 `lip.toml`，以及迁移旧的 `tooth.json`。

如果你只是运行服务器，用不到这个页面。想了解什么是包、怎样发布包，请阅读[用 lip 发布你的模组](https://levimc.org/zh-Hans/tutorials/develop/publish-a-package/)。

## 页面

这些工具都在当前工作区里操作。要处理自己的模组，请在模组所在的文件夹里启动 `lip`，或者从顶部一行打开[工作区选择器](workspaces.md)并选择该文件夹。

打开页面：在侧边栏移到**开发工具**，按 `Enter`。

![文件夹 D:\projects\WelcomeMod 里的“开发工具”页：两个操作，其中“迁移 tooth.json”是灰色的；下面是关于所选操作的一句话，再下面是工作区，以及它有没有 lip.toml 和 tooth.json，两者都是“不存在”。](/screenshots/zh-Hans/tools-05-status.svg)

1. 所选操作的作用。用 `↑` `↓` 移动，按 `Enter` 执行。
2. 当前工作区：这些操作所在的文件夹。
3. 这个文件夹里有没有 `lip.toml` 和 `tooth.json`：**已存在**或**不存在**。lip 每两秒检查一次，因此你在 lip 之外做的改动也会及时反映在这两行里。
4. 灰色的操作：当前文件夹状态下无法执行的操作。见[灰色的操作](#灰色的操作)。

| 操作 | 作用 | 在命令行上 |
| --- | --- | --- |
| **创建 lip.toml** | 打开表单，为新包生成包文件。如果文件夹里已有 `lip.toml`，这个操作会变为**编辑 lip.toml**，用表单编辑现有文件。 | [`lip pkg init`](../reference/commands/pkg_init.md) 也能创建，但没有表单 |
| **迁移 tooth.json** | 把 lip 0.x 的包文件转换为 `lip.toml`。 | [`lip pkg migrate`](../reference/commands/pkg_migrate.md) |

## 灰色的操作

**迁移 tooth.json** 能否执行，取决于状态行里的两个文件。如果条件不满足，它会显示为灰色。选中它时，说明下方会多出一行原因，屏幕最底下一行也不再列出 `Enter`。

![选中了灰色的“迁移 tooth.json”操作。它的说明下面写着“这里没有 tooth.json。”](/screenshots/zh-Hans/tools-06-migrate-disabled.svg)

1. 原因。

| 何时变灰 | 页面上的说明 |
| --- | --- |
| 文件夹里已有 `lip.toml`。lip 不会替换它。 | **这里已有 lip.toml。** |
| 文件夹里没有 `tooth.json`。 | **这里没有 tooth.json。** |

第一个操作从不变灰：它要么创建 `lip.toml`，要么编辑现有文件。服务器是否在运行对这个页面没有影响：两个操作都不会改动服务器。

文件状态一变，操作就会恢复可用：你在 lip 之外做的改动，两秒之内就会反映出来。

## 创建 lip.toml

1. 移到**创建 lip.toml**，按 `Enter`。表单会取代列表，标题为**创建 lip.toml**，后面跟着要写入的文件路径。`lip.toml` 的每个键在表单里各占一行，并且已按 Windows x64 服务器预填好，版本为 `0.1.0`。唯一缺少的是包 ID：在你输入之前，标题下面一行会显示**有 1 项需要修正。**

2. 输入包 ID，即包的仓库地址，例如 `github.com/owner/repo`。

   ![路径为 D:\projects\WelcomeMod\lip.toml 的“创建 lip.toml”表单。顶部写着“✓ 所有内容均有效。”“包”一节里有“包 ID” github.com/steve/WelcomeMod 和“版本” 0.1.0，各自标着 ✓；“信息”一节里有“名称”“描述”“图标网址”和“标签”；下面开始是“默认变体”一节。底部是“保存”和“取消”两个按钮。](/screenshots/zh-Hans/tools-07-init-form.svg)

   1. 每个值都会在输入时即时检查，结果标在右侧：`✓` 合法，`✗` 不合法，`⋯` 正在联网检查。所选行下方会说明这个值的含义；如果标了 `✗`，下方会说明不合法的原因。
   2. 整个文件是否合法：**所有内容均有效。**，或者提示有几项需要修正、正在联网检查、未能确认。

   用 `↑`、`↓` 和 `Tab` 在各行之间移动，直接打字即可填入所选行。在内容较多的行上（例如变体的条目或列表），按 `Enter` 会打开菜单，用来添加或删除条目、资源、变体。每个变体的小节在第一屏下方继续延伸；按 `PgDn` 一次向下移动十行。

3. 按 `Ctrl+S`，或在底部的**保存**上按 `Enter`。lip 在写入文件前会先询问。只要还有标着 `✗` 的值，它就不会写入，而是提示**请先修正标记为 ✗ 的内容。**，并跳转到第一个有问题的项。

   ![“保存 lip.toml”对话框。“更改”下面是“将写入新的 lip.toml：”和五行以 + 开头的内容：format = 4、ID、版本 0.1.0、side "server" 和 platform "win-x64"。“预计安装情况”下面是“依据 Marketplace 的信息，针对使用以下版本的服务器。以 lip install 的实际结果为准。”、BDS ‹ 1.26.60 ›、LeviLamina ‹ 26.60.3 ›，以及“✓ github.com/steve/WelcomeMod  有适用于 server、win-x64 的条目。”底部是“保存”和“取消”。](/screenshots/zh-Hans/tools-08-init-save.svg)

   - **更改**：要写入的键。`+` 表示新增的键，`~` 表示修改的键（附带旧值和新值），`-` 表示删除的键。
   - **预计安装情况**：依据市场信息，把该包安装到上方两行所选 **BDS** 和 **LeviLamina** 版本的服务器上会有什么结果。用 `↑` 移到这两行，用 `←` `→` 切换版本；有多个变体的包还会多出第三行**变体**。该包及其每个依赖各占一行：会被安装的标 `✓`，不会被安装的标 `✗` 并注明原因。这只是预计，实际结果以 [`lip install`](../reference/commands/install.md) 为准。

   对话框打开时默认选中**保存**：按 `Enter` 写入文件，按 `Esc` 或**取消**返回表单。

4. lip 写出 `lip.toml`，关闭表单，并在屏幕底部提示**已保存 lip.toml。**

这个例子的 `lip.toml`：

```toml
format = 4
id = "github.com/steve/WelcomeMod"
version = "0.1.0"

[[variants.""]]
side = "server"
platform = "win-x64"
```

在表单里按 `Esc` 会将其关闭。如果你改过内容，lip 会先弹出**未保存的更改**对话框：**放弃**会关闭表单而不写入，**取消**会返回表单。切换到其他页面时也会同样询问。

每个键的含义见 [lip.toml](../concepts/lip_toml.md)。

### 编辑 lip.toml

文件夹里有了 `lip.toml` 之后，第一个操作就变成了**编辑 lip.toml**：

![“开发工具”页：第一个操作是“编辑 lip.toml”，它的说明是“在表单中编辑工作区的 lip.toml，输入时自动检查每一项。”，lip.toml 的状态行是“已存在”。右下角写着“已保存 lip.toml。”](/screenshots/zh-Hans/tools-09-edit.svg)

1. 文件夹里现在有 `lip.toml` 了：用同一个表单编辑它。

按 `Enter` 会在表单中打开该文件，标题为**编辑 lip.toml**。保存时，表单里没有对应行的键会保留下来。**保存 lip.toml** 对话框会说明文件里的注释和格式是否也会保留：**lip.toml 中的注释和其他键会保留。**，或者 **lip.toml 将被重写：其他键会保留，但注释和格式不会保留。** 如果打开表单后磁盘上的文件被改动过，lip 在写入前会再次询问是**覆盖**还是**取消**。

如果 `lip.toml` 不是合法的 TOML 文件，或者其中某个键的值类型不对，lip 不会在表单中打开它，而是提示**无法在这里编辑 lip.toml。请先手动修正：**并指出问题所在。请先用文本编辑器修好文件，再重新选择该操作。

### 依赖

变体的每个条目都有一行**依赖**，末尾是 **+ 添加…**。在上面按 `Enter` 有两个选项：

- **在 Marketplace 中查找…**：输入名称、ID 或标签，在[市场](get_mods.md)的模组中搜索，选中一个按 `Enter`；
- **输入包 ID…**：输入任意包 ID；如果不是默认变体，请在后面加上 `#` 和变体名。

接着 lip 会列出该包的版本，最新版本在前；如果包有多个变体，可在列表上方用 `←` `→` 选择变体。在某个版本上按 `Enter`，或者在最后一行**不选版本：直接输入范围**上按 `Enter`。然后 lip 会提供以下版本范围：

| 范围 | 允许 |
| --- | --- |
| **补丁更新（推荐）** | 不低于所选版本的所有补丁版本。 |
| **次版本更新** | 直到下一个主版本之前的所有版本。 |
| **此版本或更新** | 所选版本及所有更新的版本。 |
| **仅此版本** | 只允许所选版本。 |
| **任意版本** | 任意版本，总是取最新。 |
| **自定义** | 你输入的范围，例如 `>=1.2.0 <2.0.0`、`^1.2.0`、`~1.2.0` 或 `1.*`。 |

下方会显示所选范围内有多少个已知版本，以及其中的最新版本。按 `Enter` 采用该范围。

在列表中已有的依赖上按 `Enter`，可以选择**选择版本…**、**版本范围…**、**修改包 ID…**和**删除**。每个依赖都会联网检查：找到时标 `✓`，并显示**已找到；范围内最新：**及对应版本号；找不到该包、它的变体或范围内的版本时标 `✗`；lip 无法检查时标 `?`。联网检查的结果绝不会阻止你保存。

## 迁移 tooth.json

lip 0.x 的包通过 `tooth.json` 描述自身。此操作会生成内容相同的 `lip.toml`，并删除 `tooth.json`。

1. 移到**迁移 tooth.json**。只有当状态行显示 `lip.toml` **不存在**、`tooth.json` **已存在**时，该操作才可选。

   ![选中了“迁移 tooth.json”操作。状态行显示 lip.toml 不存在、tooth.json 已存在。](/screenshots/zh-Hans/tools-10-migrate.svg)

   1. 满足此操作执行条件的状态行。

2. 按 `Enter`。如果 `tooth.json` 缺少 `lip.toml` 所需的内容，lip 会逐项询问。此处旧文件未写明适用的平台：

   ![标题为“lip 询问”的对话框询问“the platforms (RIDs, comma-separated, e.g. win-x64) the variants without a platform apply to”，输入框里是 win-x64。](/screenshots/zh-Hans/tools-11-migrate-question.svg)

   输入回答，按 `Enter`。如果回答无效，lip 会重新询问。

3. lip 显示结果。按 `Enter`。

   ![“迁移 tooth.json”对话框里有一行以警告符号开头、关于 preserve_files 的内容，最后是“已将 tooth.json 迁移为 lip.toml。”和“确定”按钮。](/screenshots/zh-Hans/tools-12-migrate-result.svg)

   1. 以 `⚠` 标出的提示：在新文件中改用其他写法的内容，或新文件中无处存放的内容。提示为英文，请逐条阅读并检查 `lip.toml` 中对应的部分。
   2. 结果：`lip.toml` 已写入，`tooth.json` 已删除。

4. 此时状态行反转，该操作也随之变灰：已无可迁移的内容。第一个操作变为**编辑 lip.toml**，可用表单打开新文件检查一遍。

   ![第一个操作是“编辑 lip.toml”。选中了“迁移 tooth.json”，页面上写着“这里已有 lip.toml。”状态行显示 lip.toml 已存在、tooth.json 不存在。](/screenshots/zh-Hans/tools-13-migrated.svg)

关于两种格式之间的变化，请参见[迁移包](../authors/migrating_packages.md)。

## 操作失败时

页面仅根据两个状态行判断操作是否变灰。操作仍可能因其他原因失败，例如 `tooth.json` 格式损坏或文件夹刚被删除。此时 lip 不会改动任何内容，而是弹出一个对话框，标题为操作名称加上**失败**。

![“迁移 tooth.json · 失败”对话框以“错误: Cannot read tooth.json”开头，后面是三行以“caused by:”开头的内容，并给出一个报告文件。](/screenshots/zh-Hans/tools-23-failed.svg)

1. **错误**：说明出了什么问题，通常还会给出解决办法。每一行 **caused by:** 都会进一步深入说明原因，最后一行往往最具体（此处是 `tooth.json` 中缺少 `version`）。这段文字由命令输出，为英文。
2. **完整报告**：记录详细信息的文件，位于工作区的 `.lip/logs` 下。求助时请附上该文件，详见[故障排除](../guides/troubleshooting.md)。

按 `Enter` 或 `Esc` 关闭对话框。
