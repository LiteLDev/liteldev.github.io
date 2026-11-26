# 构建 LeviLamina 模组：工具链

## 用 `levilamina-mod-template` 构建时 `manifest.json` 中版本号总是 `0.0.0`，或提示 `Failed to parse version tag, using 0.0.0`，版本号在哪里设置？

版本号并非取自 `tooth.json`。构建时，`levibuildscript` 的 modpacker 会执行 `git describe --tags --abbrev=0` 读取 git tag，并按 `vX.Y.Z` 格式解析；如果没有 tag 或格式不符，就会回退到 `0.0.0`。因此需要：

1. 使用 `git clone` 获取仓库（直接下载的 zip 压缩包不含 `.git` 目录）；
2. 打一个带 `v` 前缀的标签（如 `git tag v0.1.0`），然后再构建。

你也可以在 `xmake.lua` 中手动指定版本号：`add_rules("@levibuildscript/modpacker", {modVersion = "1.0.0"})`。

*适用版本：使用 levibuildscript modpacker 的 mod 模板（当前版本）*

## LeviLamina（LL3）的 mod 模板能用来写 LiteLoaderBDS（LL2）的插件吗？LL2 的 C++ 插件模板在哪？

不能。`levilamina-mod-template` 只适用于 LeviLamina。LL2 的 C++ 插件模板位于 <https://github.com/LiteLDev/liteloaderbds-plugin-template>，但该仓库与 LiteLoaderBDS 本体均已归档且不再维护，建议迁移到 LeviLamina。

*适用版本：当前版本（LiteLoaderBDS 已归档）*

## LeviLamina mod 用 xmake 编译一直失败，怎么排查？

1. 确保工具链为最新：安装好 Visual Studio/MSVC 生成工具（提供 Windows SDK 与 STL）以及 LLVM（mod 需用 `clang-cl` 编译）；
2. 执行 `xmake repo -u`；
3. 删除 `%LocalAppData%\.xmake`，再删除项目目录中的 `.xmake`、`build` 等缓存文件夹；
4. 重新执行 `xmake f -y -p windows -a x64 -m release`，留意 configure 阶段是否有报错，最后运行 `xmake` 构建。

## xmake 包描述（如给 xmake-repo 提交包或写自定义包）里 `add_versions` 的哈希值是什么，怎么得到？

如果包使用的是源码压缩包下载地址（即 `set_urls`/`add_urls` 指向 zip 或 tar.gz 文件），该哈希值就是对应版本压缩包的 SHA-256，用于校验下载内容；如果包使用的是 git 仓库地址（如 `https://github.com/xxx/yyy.git`），则填写对应版本的 git commit hash。

*适用版本：当前 xmake / LiteLDev xmake-repo*

## 为什么在 xmake 项目里添加 LeviLamina 依赖（`add_requires("levilamina")`）时会连带拉取 PreLoader？

这是正常现象。xmake 安装 `levilamina` 包时会从源码构建 LeviLamina，而 LeviLamina 由 PreLoader 负责加载，运行时也依赖 PreLoader，其自身的 `xmake.lua` 中声明了 `add_requires("preloader ...")`，因此安装 `levilamina` 包时会一并拉取 `preloader` 包。

## 使用 `levilamina-mod-template` 时，模板里的 `MyMod`（类名）和 `my_mod`（命名空间）应该怎么改？

将命名空间 `my_mod` 改为你自己的 mod 名，类名 `MyMod` 则可按需修改（例如改为 `Entry` 或你的 mod 名）。注意必须同步修改 `src/mod/MyMod.h` 与 `MyMod.cpp` 中的类名和命名空间，以及 `MyMod.cpp` 末尾的 `LL_REGISTER_MOD(my_mod::MyMod, my_mod::MyMod::getInstance());`，否则会编译报错。此外，还需将 `xmake.lua` 中的 `target("my-mod")` 改为你的 mod 名（构建脚本会根据 target 名称自动填充 `manifest.json` 中的 `name` 字段）。

*适用版本：当前 levilamina-mod-template*

## 用 xmake 构建 `levilamina-mod-template`（native mod）时报错，或提示无法获取 cxx 程序（找不到 C++ 编译器），怎么办？

这通常是因为编译环境未安装完整。当前模板在 Windows 上使用 `clang-cl` 工具链，需要完成以下配置：

1. 安装 Visual Studio 2022 及以上版本，勾选“使用 C++ 的桌面开发”工作负载（包含 MSVC 与最新 Windows SDK，`clang-cl` 依赖其标准库与 SDK）；
2. 安装 LLVM（官方 CI 当前使用 LLVM 22），并确保 `clang-cl` 已加入 `PATH`；
3. 安装 xmake 或将其更新至 3.0.0 以上版本。

安装完成后，执行 `xmake c -a` 清理缓存，再执行 `xmake f -c -y -p windows -a x64 -m release` 重新配置并构建。

*适用版本：当前 levilamina-mod-template / LeviLamina 26.x*

## 依赖都填了最新版本，但编译 mod 时 LeviLamina 头文件报错（提示平台宏 `LL_PLAT_S` / `LL_PLAT_C` 相关问题），怎么解决？

这是因为缺少平台宏定义。目前 levimc-repo 中的 `levilamina` xmake 包会根据 `target_type` 自动为 mod 定义 `LL_PLAT_S`（server）或 `LL_PLAT_C`（client），模板中已无需手动编写。请按以下步骤解决：

1. 执行 `xmake repo -u` 将包仓库更新至最新；
2. 参照最新模板声明 `option("target_type")`，并配置 `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})`；
3. 如果使用的旧版包仓库不会自动定义该宏，可在 target 中手动添加：

```lua
if is_config("target_type", "server") then
    add_defines("LL_PLAT_S")
else
    add_defines("LL_PLAT_C")
end
```

*适用版本：LeviLamina 26.x 及以上*

## 升级 LeviLamina（如 1.9.2 及以后）后自己的 mod 本地和 GitHub Actions 构建都出错，怎么解决？

请参照最新的 `levilamina-mod-template` 更新 mod 的 `xmake.lua`：添加 `target_type` 选项（`option("target_type")` 默认设为 `server`，可选 `server`/`client`），通过 `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})` 引入依赖，并在 target 末尾根据 `is_config("target_type", "server")` 区分服务端与客户端源码。同时，将 GitHub Actions 配置与模板的 `build.yml` 同步（使用 matrix 构建 server 和 client，并传入 `xmake f ... --target_type=${{ matrix.target_type }}`）。

*适用版本：LeviLamina 1.9.x 及以后（含 26.x）*

## 如何编译并启用 LeviLamina 自带的测试（如 EventTest）？

构建 LeviLamina 时开启 tests 选项：先执行 `xmake f --tests=y`（可附加 `--target_type=server/client`），再执行 `xmake`。这会引入 gtest 并编译 `src-test` 目录（服务端事件测试位于 `src-test/server/EventTest.cpp`）。由于 xmake 会保留上次的配置，切换配置后若出现异常，请删除项目下的 `.xmake` 目录，或执行 `xmake f -c` 重新配置。

*适用版本：LeviLamina 26.x 当前版本*

## 如何自己编译 LeviLamina 本体？

请先安装以下工具：XMake 3.0.0+、LLVM/Clang（需将 `clang-cl` 加入 PATH）、Visual Studio 2022 或其生成工具（勾选“使用 C++ 的桌面开发”工作负载，为 `clang-cl` 提供 Windows SDK 与标准库）以及 Git。在仓库根目录直接执行 `xmake` 即可构建服务端（默认目标）；如需构建客户端，先执行 `xmake f --target_type=client` 再运行 `xmake`；附加 `--tests=y` 可启用测试。服务端还支持通过 `-p linux`（使用 clang 工具链）构建 Linux x86_64 版本，客户端则仅支持在 Windows 下构建。若遇到缓存问题，请执行 `xmake c -a` 和 `xmake f -c`。

*适用版本：LeviLamina 26.20 及以后*

## 想做安卓原生 mod，在 Termux/arm64 Linux 上克隆 LeviLamina 后执行 `xmake f -p linux -a arm64` 报错 `` `arm64` is not a valid complation arch for this project, please use one of x86_64 ``，怎么办？

LeviLamina 仅支持 x86_64 架构（客户端仅支持 `windows|x64`，服务端支持 `windows|x64` 和 `linux|x86_64`），无法用于编译安卓 mod。安卓端原生 mod 采用另一套独立体系，由 Android 版 LeviLauncher 通过 Preloader SDK（`LiteLDev/preloader-android`，提供 `pl::` API）加载。请参考教程“写你的第一个 Android 原生模组”（<https://levimc.org/zh-Hans/tutorials/develop/first-android-mod/>）以及 LeviLamina 文档 `developer_guides/android` 目录下的 API 说明，不要使用 LeviLamina 本体。

## 打包 LeviLamina mod 时，包描述文件里依赖的 LeviLamina 版本不改会怎样？是否默认为最新版？

不会默认使用最新版，必须手动将依赖修改为目标版本。当前模板已用 `lip.toml` 替代 `tooth.json`：需要在 `[variants."".deps]` 下设置 `"github.com/LiteLDev/LeviLamina"` 的版本范围（模板中服务端为 `"26.60.*"`，客户端为 `">26.60.6 <26.61.0"`，注意客户端依赖使用裸 id 而非 `"#client"`），同时将 `xmake.lua` 中的 `add_requires("levilamina x.x.x")` 改为对应的目标版本，否则拉取的 LL 版本将不匹配。

*适用版本：lip.toml 格式（LeviLamina 26.60.6 之后的模板）；旧 tooth.json 同理*

## 构建客户端 mod 时 xmake 报错 `error: Invalid option: --target_type=client`，是什么原因？

`--target_type` 是项目 `xmake.lua` 中通过 `option("target_type")` 声明的配置项（取值为 `server` 或 `client`，默认 `server`），必须在 `xmake.lua` 中声明后才能传入。出现此错误，说明你的 `xmake.lua` 版本过旧或经过修改，缺少 `target_type` 选项。请改用最新 `levilamina-mod-template` 中的 `xmake.lua`（其中定义了 `option("target_type")`，并通过 `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})` 将其传给 `levilamina` 包），通过 `xmake --version` 确认 xmake 已更新至最新版本，然后依次执行 `xmake f -a x64 -m release -p windows --target_type=client -y` 和 `xmake -v -y` 进行构建。

*适用版本：LeviLamina 26.x，当前 levilamina-mod-template*

## 某个开源的 LeviLamina 原生 mod 作者已停更，如何自行更新到新版 LeviLamina？

Fork 该仓库，将 `xmake.lua` 替换为 `levilamina-mod-template` 中的最新版本（注意修改 mod 名称和 LeviLamina 版本，必要时同步更新 `lip.toml` 和 `manifest.json`），然后根据新版头文件调整 include 路径与 API（Mojang 可能删除或改动了部分函数，需要相应改写），编译通过后即可向原仓库提交 PR。

## 用 xmake 构建 LeviLamina mod 时报错 `error: package(bedrockdata): version(xxx) not found!`（例如 1.21.60.10-server），该怎么处理？

这是因为本地的 xmake 包仓库（`levimc-repo`）缓存过旧。执行 `xmake repo -u` 更新仓库后重新构建即可。一般来说，只要某个包版本已经发布，但 xmake 却提示找不到，就需要更新仓库缓存。

*适用版本：使用 xmake + levimc-repo 构建的所有 LeviLamina 版本*

## 用最新的 levilamina-mod-template 编译面向旧版 LeviLamina（如 1.4.1）的 mod，GitHub Actions 构建 client 版本失败（旧版没有 client 版），如何让 action 只构建服务端？

LeviLamina 从 1.9.0 起才正式支持客户端。开发面向旧版本的 mod 时，请打开 `.github/workflows/` 下的 `build.yml` 和 `release.yml`，删除 `matrix.target_type` 中的 `client` 项，只保留 `server` 构建。同时，还应一并删除 `lip.toml` 中 `side = "client"` 对应的 variant，并将 LeviLamina 依赖版本修改为你实际使用的版本。

*适用版本：LeviLamina 1.9.0 之前版本，使用新版模板的项目*
