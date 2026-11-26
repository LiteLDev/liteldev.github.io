# LeviStone

## 如何在 LeviLamina 上安装 LeviStone 来运行 Endstone 插件？Endstone 插件放在哪？有什么限制？

在已安装 LeviLamina 的 BDS 目录下执行：

```shell
pip install levistone --target mods/EndstoneRuntime
```

如需安装指定版本，可执行 `pip install levistone==0.11.15 --target mods/EndstoneRuntime`（版本列表见 PyPI）。0.11.15 之前的旧版本需安装到 `plugins/EndstoneRuntime`。LeviStone 版本必须与 LeviLamina 版本匹配（对应关系见 CHANGELOG）。安装后，将 Endstone 插件的 `.whl` 文件放进服务端的 `plugins/` 目录即可（从 0.11.15 起，LeviStone 加载时会自动创建从 `plugins` 指向 `mods` 的目录链接；若服务端目录下已有名为 `plugins` 的文件夹，则不会创建链接并在日志中报错，此时需先移走原有的 `plugins` 文件夹）。注意，LeviStone 只支持 Endstone 的 Python 插件，不支持 C++（native）插件。

*适用版本：LeviStone 0.11.15 及以上；LeviLamina `>=26.60.4 <26.70.0`；更早版本安装目录为 `plugins/EndstoneRuntime`*

## LeviStone 启动时 EndstoneRuntime 长时间卡住，之后突然开始下载，服务器启动很慢甚至起不来，怎么解决？

LeviStone 本身以及 Endstone 插件（`.whl`）的依赖都是通过 pip 从 PyPI 下载的（Endstone 加载插件时会调用 `python -m pip install <插件.whl>`）。未配置镜像时，直连 PyPI 会非常慢甚至失败。可以先配置国内镜像，再在 BDS 根目录下手动安装：

```shell
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
pip install levistone --target mods/EndstoneRuntime
```

如需指定版本，可写成 `levistone==<版本>`，并确保与 LeviLamina 版本匹配；0.11.15 之前的版本需将 `mods` 改为 `plugins`。安装完成后再运行 `bedrock_server_mod.exe`。如果使用 Docker 镜像，可以通过环境变量 `PYPI_MIRROR_URL` 配置镜像。

*适用版本：LeviStone 0.11.15 及以上*
