# 安装 bedboo

bedboo 还没有发布到 npm。它用 pnpm 补丁修正了几个依赖，而这些补丁只在它自己的工作区里生效，因此需要检出它的仓库来使用，把你的机器人作为这个工作区里的一个包。

## 需要什么

- [Node.js](https://nodejs.org/) **24** 或更新版本。用 `node -v` 检查。
- [Git](https://git-scm.com)。
- 默认的 RakNet 传输需要运行在 **x64** 处理器上的 Windows、Linux 或 macOS，没有 ARM 版本。NetherNet 传输由纯 JavaScript 编写，在任何平台上都能运行（见[连接服务器](guide/connecting.md#transports)）。
- 一个可以连接的 Bedrock Dedicated Server，版本需在 bedboo 的支持范围内，详见[支持的版本](reference/versions/index.md)。

## 安装

```shell
git clone https://github.com/LiteLDev/bedboo
cd bedboo
corepack enable
pnpm install
```

`corepack enable` 会准备好仓库所要求的 pnpm 版本。

::: details 找不到 `corepack`，或者没有权限
Node.js 25 及更新版本不再自带 corepack，请先运行 `npm install -g corepack` 安装，然后再运行一次 `corepack enable`。在 Windows 上，如果 Node.js 安装在 `C:\Program Files`，需要以管理员身份打开终端再运行一次 `corepack enable`。
:::

安装完成后，把你的机器人放在 `packages/` 下的一个文件夹里，在它的 `package.json` 依赖中加入 `"bedboo": "workspace:*"`，然后再运行一次 `pnpm install`。[你的第一个 bedboo 机器人](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)详细演示了这一过程。

## 确认装好了

`pnpm install` 结束时会列出已安装的包，且没有任何报错。在仓库根目录下运行以下命令，应当输出 `function`：

```shell
node -e "console.log(typeof require('bedboo').createBot)"
```

## 更新

在检出的仓库中拉取最新代码，然后重新安装：

```shell
git pull
pnpm install
```

## 其他版本

bedboo 目前还没有带版本号的发行版，[仓库](https://github.com/LiteLDev/bedboo)的 `main` 分支就是当前版本。如果想固定在某个状态，可以检出对应的提交（`git checkout <提交>`），然后运行 `pnpm install`。

## 下一步

- [你的第一个 bedboo 机器人](https://levimc.org/zh-Hans/tutorials/automate/first-bedboo-bot/)：准备服务器，连接一个会走到你身边的机器人。
- [连接服务器](guide/connecting.md)：版本、传输方式和登录。
- [生态插件](guide/plugins.md)。
