# LeviLamina 的版本与兼容性

## LeviLamina 有没有对应 BDS 26.0 的版本？该如何选择 BDS 版本？

没有。LeviLamina 从 1.9.x（BDS 1.21.132）直接跳到了 26.10.0（适配 26.10），并未适配 26.0。LL 只支持特定的 BDS 版本，并非每个 BDS 版本都会适配。

正确的做法是先确定要使用的 LeviLamina 版本，再安装与之对应的 BDS 版本。使用 lip 安装 LeviLamina 时，会通过依赖 `github.com/LiteLDev/bds` 自动安装匹配的 BDS（如当前 LeviLamina 26.60.x 对应 BDS 1.26.60）。不建议盲目追新。

## Minecraft 改用 26 开头的版本号后，LeviLamina 的版本号怎么变？1.9.x 之后的下一个版本是什么？

从适配 BDS 1.26.10 开始，LeviLamina 的版本号改为跟随 MC 版本号：1.9.x（对应 BDS 1.21.132）之后的下一个版本是 26.10.0（随后是 26.10.1 等），中间没有 26.0。之后的系列依次为 26.20.x、26.32.x、26.40.x、26.51.x、26.60.x，主次版本号对应所适配的 MC 版本（例如 LeviLamina 26.60.x 对应 BDS 1.26.60.6）。

*适用版本：LeviLamina 26.10.0 及以上*

## LeviLamina 现在不再绑定基岩版 BDS 的具体版本了吗？怎么获得对应版本的 BDS？

每个 LeviLamina 版本仍然对应特定的 BDS 版本（例如 LeviLamina 26.60.8 对应 BDS 1.26.60）。用 lip 安装 LeviLamina 时，会自动下载并安装对应版本的 BDS（即 `github.com/LiteLDev/bds` 包），无需手动匹配：运行 `lip install LeviLamina` 可安装最新 LeviLamina 及其支持的游戏版本；运行 `lip setup --game <版本>` 则可指定游戏版本（lip 会自动选择支持该版本的最新 LeviLamina，若无匹配版本则会提示）。

## 能否手动降级 LeviLamina？只替换 LeviLamina 文件后服务器（面板服）不再加载 LeviLamina 了怎么办？

LeviLamina 版本与 BDS 版本绑定，降级 LL 必须同时换用对应版本的 BDS，仅替换 LL 文件是不可行的。推荐在本地电脑的服务器目录（或空目录）中用 lip 指定版本：执行 `lip setup --game <BDS版本> --loader levilamina@<LL版本>`，lip 会同时安装匹配的 BDS 和 LeviLamina，并保留其他仍兼容的包；完成后再将整个服务端上传到面板。注意，`lip install` 和 `lip update` 不会更改游戏和加载器版本，必须使用 `lip setup`。
