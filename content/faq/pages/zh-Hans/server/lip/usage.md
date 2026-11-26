# lip 的使用与配置

## 配置

### 模组已被目录收录，之后修改了仓库里的包描述文件（`tooth.json` / `lip.toml`），为什么目录上的信息一直不更新？

目录读取的是每个版本标签（`v<版本>`）对应的包文件（优先读 `lip.toml`，没有时才读 `tooth.json`），列表中的名称、描述、标签等信息都取自最新版本的包文件，而不是默认分支上的最新文件。只修改仓库内容而不发布新标签，目录不会更新。

正确做法是先修改 `lip.toml`（调高 `version`），再打上新标签（如 `v0.2.0`）发布新版本。目录每小时构建一次，新标签会在下一次构建中生效。

详情页的 README 同样取自该版本标签下的仓库文件（`raw.githubusercontent.com/<作者>/<仓库>/v<版本>/README.md`），仅修改默认分支上的 README 也不会更新；只有 Gallery（默认分支上的 `docs/showcase/showcase.json`）会在下一次构建中直接生效。

*适用版本：当前 LeviMC 模组目录（levimc.org/mods）*

### 发布给 lip 的插件需要把编译好的二进制提交到源码仓库或单独开仓库存放吗？

不需要。在 `lip.toml` 的变体条目中添加一个 `type = "mcmod"`（LeviLamina 模组 ZIP）或 `type = "zip"` 的资源，将 `urls` 指向 GitHub Release 的附件即可，例如 `https://github.com/<you>/my-mod/releases/download/v{{version}}/my-mod-server-windows-x64.zip`。

- `zip` 资源需再用 `place` 指定把 ZIP 中的哪些文件放到哪里，例如 `place = [{ src = "my-mod/", dest = "mods/my-mod/" }]`。
- `mcmod` 则要求 ZIP 根目录下有 `manifest.json`，解压后会整体放入 `mods/<模组名>/`。
- LeviLamina、LSE 及 levilamina-mod-template 都采用 `zip` 配合 Release 附件的方式，模板的发布工作流会自动构建并上传 `<仓库名>-server-windows-x64.zip` 等 ZIP。

国内用户访问 GitHub 较慢时，可执行 `lip config set github_proxy <URL>` 设置 GitHub 代理，或使用 `HTTPS_PROXY` 等系统代理环境变量。

*适用版本：lip 0.40 及以上（lip.toml）*

### lip 安装包时下载超时（多次重试、换电脑都不行），怎么办？lip 如何指定安装到哪个文件夹？

当 GitHub 访问缓慢或被屏蔽时，可设置 GitHub 代理：`lip config set github_proxy <代理地址>`（0.41.1 之后的 lip 会将请求发往“该地址 + `/` + 完整的 GitHub 地址”，因此填代理服务本身的地址即可；0.41.1 及更早版本的 lip 只会在地址后拼接 `<所有者>/<仓库>/…`，对于 gh-proxy 这类服务，地址必须以 `https://github.com/` 结尾）。你也可以在终端设置 `HTTPS_PROXY` 等环境变量来使用普通网络代理，然后重试。可用 `curl "<代理地址>/https://github.com/LiteLDev/lip.git/info/refs?service=git-upload-pack"` 测试代理是否返回 200。

lip 直接以当前工作目录作为工作区，没有指定其他目录的选项：要安装到哪个文件夹，就先 `cd` 到该目录，再执行 lip 命令。

*适用版本：lip 0.40 及以上*

### lip 设置过 GitHub 代理等配置后，怎么删除（remove）该配置？

执行 `lip config delete <KEY>` 即可删除配置并恢复默认值，例如 `lip config delete github_proxy`（不走代理，界面连不上 GitHub 时会重新询问）。如果想明确指定“直接连接、不再询问”，可将其设为空值：`lip config set github_proxy ""`（在 PowerShell 中需写为 `lip config set github_proxy --% ""`）。

*适用版本：lip 0.40 及以上（“界面重新询问”的区别自 0.41.0 界面起才有意义）*

### lip 配置 GitHub 代理后下载 `bedrock-runtime-data` 报 HTTP 404（`Failed to download from https://gh-proxy.com/LiteLDev/bedrock-runtime-data/releases/download/...`），如何正确设置代理？

这是代理地址格式与当前 lip 版本不匹配导致的：gh-proxy 这类代理要求在地址后接上完整的 GitHub 地址，只写 `https://gh-proxy.com/` 或 `https://gh-proxy.org/` 会返回 404。0.41.1 及更早版本的 lip 会把 `<所有者>/<仓库>/...` 直接拼接在 `github_proxy` 后面，因此应按如下方式设置（0.41.1 之后的 lip 会自动接上完整的 GitHub 地址，只填代理服务本身的地址即可，但下面这种写法依然兼容）：

```shell
lip config set github_proxy https://v4.gh-proxy.org/https://github.com/
```

设置前可用以下命令测试，返回 200 说明代理可用：

```shell
curl.exe -s -o NUL -w "%{http_code}" "https://v4.gh-proxy.org/https://github.com/LiteLDev/LeviLamina.git/info/refs?service=git-upload-pack"
```

*适用版本：lip 0.40 及以上*

### mod 迁移到新的 GitHub 仓库后，要被 lip/模组列表收录需要改什么？

包 ID 必须与仓库路径一致。现在的包使用 `lip.toml`，需要将其中 `id` 字段改为新仓库路径。例如，仓库为 `https://github.com/user/repo` 时，应写为 `id = "github.com/user/repo"`；否则该提交不会被视为包，lip 不会安装（模组列表自然也无法正常安装它；收录方式见 levimc.org 的「用 lip 发布你的模组」教程）。

旧格式 `tooth.json` 中对应的字段是 `tooth`（可用 `lip pkg migrate` 迁移到 `lip.toml`，`tooth` 会变为 `id`）。改完后打上新的版本标签 `v<版本>` 发布，注意 `version` 必须等于标签版本。

*适用版本：lip.toml 格式 4（当前）；旧 tooth.json 包同理改 `tooth` 字段*

### 发布 LeviLamina mod 时，包文件中对 LeviLamina 的依赖版本能否锁定为一个具体版本？模组图标应写在哪里？

不建议锁死单一版本。不带运算符的完整版本（如 `"26.60.8"`）只匹配该版本；一旦 LeviLamina 发布新版本，你的 mod 就无法通过 lip 或启动器安装到新版本上，只能手动放入。建议填写版本范围，例如：

```toml
[variants."".deps]
"github.com/LiteLDev/LeviLamina" = "26.60.*"
```

或写为 `">=26.60.0 <26.70.0"` 之类（语法同 Semver for .NET 的 `SemVersionRange`，支持 `^`、`~`、`*`、`>=…<…`、`||`）。

此外，`id` 必须与实际仓库地址一致。模组图标写在 `[info]` 下的 `logo` 字段中（必须以 `https://` 开头），例如 `logo = "https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/.../pack_icon.png"`。旧 `tooth.json` 中对应的是 `dependencies` 和 `info.avatar_url`，迁移时 `avatar_url` 会变为 `info.logo`。

补充：客户端条目（`side = "client"`）依赖的同样是不带 `#client` 的 LeviLamina，官方模板写作 `">26.60.6 <26.61.0"`（因为 26.60.6 及以前的 `tooth.json` 版本默认变体是服务端构建）。

*适用版本：lip.toml 格式 4（当前）；LeviLauncher 1.1.0+ 内置包管理器；旧 tooth.json 包对应 `dependencies`/`avatar_url`*

## 功能与版本

### 一个仓库里放了多个 mod/插件，不想拆成多个仓库，能发布到 lip 吗？发布 lip 包必须发 GitHub Release 吗？

lip 的包 ID 即仓库路径（如 `github.com/user/repo`）。虽然一个仓库对应一个包，但一个包可以有多个变体（variant），用来在同一仓库中存放多个 mod：在 `lip.toml` 里为每个 mod 写一个 `[[variants."<名字>"]]` 条目（名字需匹配 `^[a-z0-9_]+(/[a-z0-9_]+)?$`），用户通过 `lip install github.com/user/repo#<名字>` 选择要安装的变体（LSE 的 `#lua`、`#nodejs` 等引擎正是这样做的）。注意，同一仓库的所有变体共用版本标签。版本即名为 `v<SemVer>` 的 git 标签（如 `v1.2.3`），且该标签处 `lip.toml` 的 `version` 必须与之一致。“发布”本质上是推送这个标签，GitHub Release 只是用来托管 assets 中 `urls` 指向的 ZIP 文件。如果确实想让各 mod 拥有独立版本，也可以为每个 mod 单独建一个只放 `lip.toml` 的仓库，让其 zip/mcmod 资源的 `urls` 指向大仓库 Release 里的文件。

*适用版本：lip v0.40 及以上（lip.toml 格式 4）；旧版 tooth.json 中以 label 区分变体*

### lip 能否像 npm 一样在当前目录维护依赖清单，lip install 时自动写入，从而通过分享清单实现“整合包”？

不能。`lip install` 只会将包安装进服务器文件夹并记录在 `.lip/state.json` 中，从不写入 `lip.toml`，lip 也没有类似 `package.json` 的工作区清单。若想一次安装一组包（整合包），可以自己制作一个包，在其 `lip.toml` 的 `deps` 里写上所需的所有包（类似 LegacyScriptEngine 默认变体依赖 quickjs 与 lua 两个引擎变体的做法）。发布后，别人只需运行 `lip install <你的包>` 即可一并装好。发布教程见 <https://levimc.org/tutorials/develop/publish-a-package/>。此外，lip 只管理服务端；`lip.toml` 的条目通过 `side = "server"`/`"client"` 区分两端，客户端模组由 LeviLauncher 等启动器读取同样的包来完成安装。

*适用版本：当前 lip（lip.toml 时代）*

### lip 可以用来下载 BDS 吗？

可以。lip 的游戏包是 `github.com/LiteLDev/bds`。运行 `lip install github.com/LiteLDev/bds@<version>` 可安装不带加载器的 Windows 版服务器，加上 `#linux` 则为 Linux 版；也可以用 `lip setup --game <version> --no-loader`。如果要连同 LeviLamina 一起安装，直接运行 `lip install LeviLamina`，lip 会自动配好对应的 BDS。如果只需要下载 BDS 文件，也可以使用 bdsdown 工具（`lip install github.com/LiteLDev/bdsdown`）。

*适用版本：lip v0.41.0 及以上*

### lip 能否像 `npm -g` 那样把软件包安装到全局环境？

不能。lip 没有全局安装的概念。每条命令的工作区就是当前工作目录（服务器文件夹），软件包都安装到这个工作区中，也没有参数可以指定其他工作区，因此需要先 `cd` 到服务器目录再执行命令。

*适用版本：当前所有版本 lip*

### 用 lip 安装 LeviLamina 后多出一个名为 loc 的包（levilamina-loc），这是什么？需要手动安装吗？

这是 LeviLamina 的语言包（Localization）`github.com/LiteLDev/levilamina-loc`，内容会放到 `mods/LeviLamina/lang/`。它是 LeviLamina 声明的依赖，安装 LeviLamina 时 lip 会自动装上，不需要手动处理。

*适用版本：当前所有 LeviLamina 版本（服务端和客户端）*

### lip 的源码仓库在哪？从 BDS 官网下载的最新 BDS 能直接配 LeviLamina 用吗？

lip 的仓库地址为 <https://github.com/LiteLDev/lip>（旧地址 `futrime/lip` 会重定向过去）。从官网下载的最新 BDS 往往比 LeviLamina 支持的版本要新，不能直接使用，必须使用与 LeviLamina 对应的 BDS 版本。推荐直接使用 lip：运行 `lip install LeviLamina` 会安装最新 LeviLamina 及其支持的最新游戏版本；也可以运行 `lip setup --game <版本> --loader levilamina`，指定游戏版本并自动选择匹配的 LeviLamina。

### 发布供 lip 安装的包时，GitHub 版本标签有什么格式要求？标签没带 `v` 导致装不上、目录搜不到怎么办？

lip 只把名称恰好为 `v` 加 SemVer 2.0.0 版本号的标签当作版本，例如 `v1.1.0-rc.1`、`v2.0.0`。像 `1.1.0-rc.1`、`2.0.0`、`v1.2`、`v01.2.3` 等标签都会被忽略，lip、LeviMC 模组目录以及 LeviLauncher 都会跳过它们。此外，标签处 `lip.toml` 的 `version` 必须与标签一致（不带 `v`，如 `version = "2.0.0"`）。

修复方法：补发一个带 `v` 的标签或 Release。现在的 lip 直接通过 git 协议查询仓库标签，不经过 Go 模块代理，也不缓存标签列表，因此新标签会立刻生效，不需要再换 GOPROXY。

在 `lip.toml` 中，可以用 `{{version}}` 引用版本号（例如在资源 URL 里），用 `{{id}}` 引用包 ID。可运行 `lip install github.com/<作者>/<仓库>@<版本> --dry-run` 来确认版本是否被识别。

*适用版本：lip 0.40 及以上（lip.toml 格式 4）；旧 tooth.json 包的标签规则相同*

### lip 能安装本地的包吗？开发时能否不发布就在本地测试自己的包？

可以。把根目录含有 `lip.toml` 的 ZIP 文件或文件夹路径传给 `lip install` 即可，例如 `lip install ./my-mod.zip` 或 `lip install ../MyTool`（也支持 `https://` 上的 ZIP）。ZIP 只按内容识别，扩展名无所谓，以前改名为 `.tth` 的做法已不再需要。打包时将文件夹压缩成 ZIP，确保 `lip.toml` 位于压缩包根目录即可。你可以用 `lip install <文件夹> --dry-run` 检查 lip 能否正常读取。

另外，在推送标签前，也可以用 `lip install github.com/user/repo@branch:main` 或 `@rev:<40位提交>` 来测试。

建议尽量都用 lip 管理（包括 LeviLamina 本身）。手动放入的文件不在 lip 的状态记录中，lip 无法据此解析依赖关系。

*适用版本：lip 0.40 及以上（`lip pkg` 系列命令需 lip 0.41+）*
