# Install bedboo

bedboo is not published to npm yet. Because it fixes a few of its dependencies with pnpm patches that apply only inside its own workspace, you use it from a checkout of its repository and keep your bot as a package in that workspace.

## What you need

- [Node.js](https://nodejs.org/) **24** or newer. Check with `node -v`.
- [Git](https://git-scm.com).
- Windows, Linux, or macOS on an **x64** processor for the default RakNet transport, which has no ARM builds. The NetherNet transport is pure JavaScript and runs anywhere ([Connecting to a server](guide/connecting.md#transports)).
- A Bedrock Dedicated Server to connect to, running a version that bedboo supports (see [Supported versions](reference/versions/index.md)).

## Install

```shell
git clone https://github.com/LiteLDev/bedboo
cd bedboo
corepack enable
pnpm install
```

`corepack enable` provides the version of pnpm that the repository specifies.

::: details `corepack` is not found, or not allowed
Node.js 25 and newer no longer include corepack. Install it with `npm install -g corepack`, then run `corepack enable` again. On Windows, if Node.js is installed in `C:\Program Files`, run `corepack enable` once in a terminal opened as administrator.
:::

Your bot lives in a folder under `packages/`, with `"bedboo": "workspace:*"` in the dependencies of its `package.json`; run `pnpm install` again after adding it. [Your first bedboo bot](https://levimc.org/tutorials/automate/first-bedboo-bot/#_2-make-a-package-for-your-bot) walks through this setup.

## Check that it works

`pnpm install` finishes by listing the installed packages with no errors. From the root of the repository, the following command prints `function`:

```shell
node -e "console.log(typeof require('bedboo').createBot)"
```

## Update

In the checkout, pull the latest code and install again:

```shell
git pull
pnpm install
```

## Other versions

bedboo has no numbered releases yet: the `main` branch of the [repository](https://github.com/LiteLDev/bedboo) is the current version. To pin to a known state, check out a specific commit (`git checkout <commit>`) and run `pnpm install`.

## Next steps

- [Your first bedboo bot](https://levimc.org/tutorials/automate/first-bedboo-bot/): prepare a server and connect a bot that walks to you.
- [Connecting to a server](guide/connecting.md): versions, transports, and sign-in.
- [Using mineflayer plugins](guide/plugins.md).
