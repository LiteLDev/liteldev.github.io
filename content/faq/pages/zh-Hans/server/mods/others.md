# 其他 LiteLDev 项目

## 旧版 LiteLoaderBDS（LL2，如 2.9.3、2.15.0、2.16.2）现在还能在哪里下载？各版本对应哪个 BDS 版本？

LL2 的历史版本可在 GitHub 已归档仓库 LiteLDev/LiteLoaderBDS 的 Releases 页面下载：<https://github.com/LiteLDev/LiteLoaderBDS/releases>（例如最终版 2.16.2：<https://github.com/LiteLDev/LiteLoaderBDS/releases/download/2.16.2/LiteLoaderBDS.zip>）。旧链接 <https://github.com/LiteLDev/LiteLoaderBDSv2> 会自动重定向到该仓库。每个版本的发布说明都标注了对应的 BDS 版本（较新的版本使用徽章，2.9.3 等旧版本则写在正文里，如 `Support BDS 1.19.50 & 1.19.51`），请务必选择与 BDS 版本严格匹配的 LL2。LL2 已停止维护，最高仅支持 BDS 1.20.31.01，更高版本的 BDS 请使用 LeviLamina。

*适用版本：LiteLoaderBDS 2.x（已归档），BDS ≤ 1.20.31.01*

## LiteLoaderBDS v2（LL2）最后支持的 BDS 版本是多少？有没有支持 BDS 1.20.40 及以后版本的 LL2？LL2 启动报找不到 LiteLoader/无法加载怎么办？

LL2 的最终版本是 2.16.2，对应 BDS 1.20.31.01，没有支持 BDS 1.20.40 及更高版本的 LL2。LL 必须与对应的 BDS 版本严格配套，版本不匹配（例如用 BDS 1.19.30.04 搭配新版 LL2）就会无法加载。LL2 已停止更新并归档，后续重构为 LeviLamina（<https://github.com/LiteLDev/LeviLamina>），新版本 BDS 请使用 LeviLamina。

*适用版本：LiteLoaderBDS 2.x（已归档）；新版 BDS 使用 LeviLamina*

## 如何方便地下载/升级 BDS 服务端？

推荐使用 LiteLDev 的命令行工具 bdsdown（<https://github.com/LiteLDev/bdsdown>），可通过 `lip install github.com/LiteLDev/bdsdown` 安装。用法如下：

```text
bdsdown.exe [--yes] [--source SOURCE] [--proc PROC] [--exclude EXCLUDE]
```

`--source` 默认为 `version://windows/latest`，`--proc` 为并发下载数（默认 4），`--exclude` 用于排除无需覆盖的文件（如保留配置文件）。可通过设置环境变量 `BDSDOWN_MIRROR_URL` 使用镜像加速，也可以直接用 lip 仅安装 BDS。
