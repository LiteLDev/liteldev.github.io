# 用 lip 发布你的模组

完成本教程后，你的模组将在 GitHub 上拥有第一个发布版本，任何人只需运行一条命令 `lip install github.com/<you>/my-mod` 就能把它安装到自己的服务器上。你将在 `lip.toml` 中填写模组信息，通过 GitHub Actions 构建发布版本，确认 `lip` 能够读取该版本，在自己的服务器上安装测试，并让模组上架 [LeviMC 模组](https://levimc.org/zh-Hans/mods/)。

整个过程大约需要半小时，其中大部分时间是在等待构建完成。

## 你需要准备

- 一个放在公开 GitHub 仓库中、由模组模板创建且能够正常构建的模组：参见[你的第一个 LeviLamina 模组](first-levilamina-mod.md)。本教程将该仓库称为 `github.com/<you>/my-mod`。
- `lip` 以及一个用于测试的服务器：参见[开你的第一个服务器](../server/first-server.md)。本教程使用 `D:\servers\survival`。
- 已登录 GitHub、可以推送代码的 Git。

::: warning 需要最新的 lip
本教程用到的「开发工具」页面上的**编辑 lip.toml** 表单，随 lip 0.41.1 之后的第一个发行版提供。请用 `lip -v` 检查版本，如有需要，请从 [lip 的最新发行版](https://github.com/LiteLDev/lip/releases/latest)安装。
:::

`lip` 能安装的任何内容都称为**包**。它的**包 ID** 是去掉 `https://` 后的仓库地址，即 `github.com/<you>/my-mod`。一个**版本**对应一个以 `v` 加版本号命名的 Git 标签（例如 `v0.1.0`），且该标签下的 `lip.toml` 中必须写有相同的版本号。发布时无需单独上传：推送这个标签即代表发布。

## 1. 填写 lip.toml

模板自带的 `lip.toml` 用于告诉 `lip` 要安装什么。打开该文件，修改以下字段，其余保持不变。

```toml
format = 4
id = "github.com/<you>/my-mod"          # 包 ID：你的仓库
version = "0.1.0"                       # 即将发布的版本，不带 "v"

[info]                                  # 显示在 LeviMC 模组和 LeviLauncher 中；lip 忽略它
name = "My Mod"
description = "Says hello."
tags = ["utility"]
logo = "https://avatars.githubusercontent.com/u/<your user id>"
```

接着，修改两个 `[[variants.""]]` 条目（一个为 `side = "server"`，另一个为 `side = "client"`）：

- 在 `deps` 中设置模组适用的 LeviLamina 版本范围。服务端条目使用类似 `"26.60.*"` 的范围，与你在 `xmake.lua` 中固定的版本保持一致。客户端范围请保留原有的注释和写法。
- 在 `urls` 中，把 `levilamina-mod-template` 换成**你的仓库名**：发布工作流上传的文件名为 `<仓库名>-server-windows-x64.zip` 和 `<仓库名>-client-windows-x64.zip`。
- 在 `place` 中，把 `src` 和 `dest` 里的 `my-mod` 换成 `xmake.lua` 中的 **target 名**：每个 ZIP 文件内都有一个 `<target>/` 文件夹，安装时会被放到 `mods/<target>/`。

如果你的模组仅用于服务端，请删除整个客户端条目，即 `side = "client"` 的 `[[variants.""]]` 及其下方的 `deps` 和 `assets`。

::: tip `{{id}}` 和 `{{version}}`
`lip.toml` 中的所有字符串都是模板。`{{version}}` 会自动替换为上面填写的 `version`，因此发布新版本时只需修改 `version` 一处；`{{id}}` 则会替换为包 ID。
:::

::: details 没有 lip.toml 或只有 tooth.json 的仓库
如果仓库不是由模板创建的，请在其根目录下运行 `lip pkg init`：该命令会询问包 ID，并生成一个最简的 `lip.toml`，随后按上述说明填写即可。你也可以在仓库根目录下启动 `lip`，在「开发工具」页面选择**创建 lip.toml**：这会打开与第 2 步相同的表单，保存时直接写入文件。lip v0.x 的 `tooth.json` 可用 `lip pkg migrate` 转换，详见[迁移包](https://levimc.org/zh-Hans/lip/authors/migrating_packages.html)。
:::

## 2. 确认 lip 能读取它

1. 在仓库文件夹中启动 `lip`。该文件夹会成为 `lip` 的工作区，并显示在顶栏中。
2. 在侧边栏中打开「开发工具」，选中**编辑 lip.toml** 并按 `Enter`。
3. `lip` 会以表单形式展示 `lip.toml`：它会在你输入时逐项检查，并在填充模板后按 `lip` 的实际读取方式校验整个文件，同时联网查找 LeviLamina 等依赖项。校验通过后，顶部会显示 **✓ 所有内容均有效。** 标有 **✗** 的条目会注明错误原因：你可以在表单中修正并按 `Ctrl+S` 保存，也可以直接编辑文件。如果文件不是合法的 TOML，或某个键的值类型有误，`lip` 会提示**无法在这里编辑 lip.toml。请先手动修正：**并指出具体问题。
4. 检查每个**网址**中的名称是否与你的仓库名以及发布工作流上传的 ZIP 文件名（见第 1 步）一致。
5. 按 `Esc` 关闭表单。

## 3. 编写更新日志

发布工作流会将 `CHANGELOG.md` 中最新的一节复制到发布说明中。请按 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的格式为本次发布添加一节：

```md
## [0.1.0] - 2026-11-16

### Added

- The `/hello` command.
```

提交并推送所有改动：

```shell
git add -A
git commit -m "Release 0.1.0"
git push
```

## 4. 创建发布版本

1. 打开 GitHub 上的仓库页面，依次点击 **Releases** → **Draft a new release**。
2. 在 **Choose a tag** 中输入 `v0.1.0`，并选择 **Create new tag: v0.1.0 on publish**。目标分支保持为默认分支，即你刚刚推送提交的分支。
3. 为发布填写标题（例如 `0.1.0`），然后点击 **Publish release**。
4. 打开 **Actions** 标签页。刚才的发布操作触发了一次工作流运行，它会自动构建服务端和客户端模组并上传产物。等待几分钟，直到运行结果变为绿色对勾。
5. 回到刚才的发布页面。此时 **Assets** 下应当包含 `my-mod-server-windows-x64.zip` 和 `my-mod-client-windows-x64.zip` 两个文件，且发布说明已更新为你的更新日志。

::: warning 标签必须与 `version` 一致
标签格式为 `v` 加完整的[语义化版本](https://semver.org/lang/zh-CN/)（即 `v0.1.0`，不能写成 `0.1.0` 或 `v0.1`）。在标签 `v0.1.0` 处，`lip.toml` 中的版本必须为 `version = "0.1.0"`，否则 `lip`、LeviMC 模组和 LeviLauncher 都会跳过该标签。
:::

## 5. 确认 lip 能看到这个版本

1. 停止服务器。如果上一篇教程留下的 `mods\my-mod` 文件夹还在，请先将其删除，确保后续测试的完全是由 `lip` 安装的文件。
2. 在服务器文件夹中运行以下命令，仅查看 `lip` 将要安装的内容而不做实际改动：

   ```shell
   cd D:\servers\survival
   lip install github.com/<you>/my-mod --dry-run
   ```

   输出中应当有几行以 `Dry run:` 开头的文字，其中一行会提示将安装你的模组的 `0.1.0` 版本。如果 `lip` 找不到任何版本，请检查标签与 `version` 是否一致（见第 4 步）。

## 6. 像用户一样安装它

1. 在服务器文件夹中安装你的包：

   ```shell
   lip install github.com/<you>/my-mod
   lip list
   ```

   运行 `lip list`，应当能看到 `github.com/<you>/my-mod@0.1.0`。

2. 启动服务器。控制台应当会再次输出 `Hello from my first mod!`，这一次加载的是 `lip` 下载的文件。

模组上架后（见第 7 步），玩家还可以使用 LeviLauncher 安装同一个包的客户端构建：参见[在 Windows 上玩模组](../play/play-with-mods.md)。

## 7. 上架 LeviMC 模组

[LeviMC 模组](https://levimc.org/zh-Hans/mods/)是显示在 `lip`「市场」页和 LeviLauncher 中的模组目录，由 levimc.org 仓库中的 [`content/mods/repos.txt`](https://github.com/LiteLDev/liteldev.github.io/blob/main/content/mods/repos.txt) 仓库列表构建而成。

通常你无需进行任何操作：机器人每小时都会在 GitHub 上搜索包含 `lip.toml` 及可被 `lip` 读取的版本标签的仓库，并自动发起拉取请求将它们加入列表。维护者合并后，站点会立即重新构建，几分钟后就能看到你的模组。

如果想加快上架速度，你也可以自己发起拉取请求：在 GitHub 上编辑 [`content/mods/repos.txt`](https://github.com/LiteLDev/liteldev.github.io/blob/main/content/mods/repos.txt)，添加一行 `<you>/my-mod`。

目录收录包的条件如下：

- 最新版本直接或通过其他包间接依赖 LeviLamina；
- 将文件安装到 `mods/`（或 `plugins/`，或游戏加载附加包的位置）；
- 仓库不是 GitHub 模板，且名称不以 `-template`、`-example`、`-demo`、`-sample` 或 `-test` 结尾。

收录完成后，你就能在 `https://levimc.org/zh-Hans/mods/github.com/<you>/my-mod/` 看到自己的模组页面，上面会展示模组的名称、描述、图标、标签和安装命令。

## 发布下一个版本

1. 调高 `lip.toml` 中的 `version`（例如改为 `0.2.0`），并在 `CHANGELOG.md` 中添加对应的一节，然后提交并推送。
2. 按第 4 步的操作创建 `v0.2.0` 发布版本。
3. 在服务器上运行 `lip update github.com/<you>/my-mod` 即可安装新版本。

## 你现在有了什么

- 模组在 GitHub 上的首个发布版本，由 GitHub Actions 自动构建。
- 一个声明了 LeviLamina 依赖、可通过 `lip install github.com/<you>/my-mod` 安装的包。
- 加入收录列表后，展示在 LeviMC 模组上的模组页面。

## 下一步

- `lip.toml` 的全部字段（依赖、变体、要保留或删除的文件、钩子）：[lip.toml](https://levimc.org/zh-Hans/lip/concepts/lip_toml.html)。
- 包作者使用的命令：[`lip pkg init`](https://levimc.org/zh-Hans/lip/reference/commands/pkg_init.html)、[`lip pkg migrate`](https://levimc.org/zh-Hans/lip/reference/commands/pkg_migrate.html)。
- 发布前安装特定分支或提交：[管理包](https://levimc.org/zh-Hans/lip/guides/managing_packages.html)。
- 在 `lip` 界面中创建和编辑 `lip.toml`、迁移 `tooth.json`：[开发工具](https://levimc.org/zh-Hans/lip/interface/tools.html)。
- 在服务器上安装你的包：[给服务器安装模组](../server/install-mods.md)。
