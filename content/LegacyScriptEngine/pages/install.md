# Install LegacyScriptEngine

LegacyScriptEngine (LSE) is a LeviLamina mod. You install it on a server using [lip](https://levimc.org/lip/), or into the game on Windows using [LeviLauncher](https://levimc.org/LeviLauncher/). It comes as a separate package for each script language, called a **variant**.

## What you need

- A server or game instance with LeviLamina already installed. See [Install LeviLamina](https://levimc.org/LeviLamina/install/).
- The variant for your plugins' language:

    | Variant | Language | Engine |
    |---|---|---|
    | `#lua` | Lua | CLua |
    | `#quickjs` | JavaScript | QuickJS, with ES modules |
    | `#nodejs` | JavaScript | Node.js, with npm packages |
    | `#python` | Python | CPython, with pip packages |

- For `#python` only, Python on the machine running the engine:

    | LSE version | Python version |
    |---|---|
    | >=0.16.2 | 3.12.10 |
    | >=0.9.0 <0.16.2 | 3.12.8 |
    | <0.9.0 | 3.10.11 |

## Install

### On a server

Stop the server if it is running. In the server folder, install the variant you need:

```shell
lip install LegacyScriptEngine#quickjs
```

Without a variant, `lip install LegacyScriptEngine` installs both the QuickJS and Lua engines. lip selects the newest LSE version compatible with the server's LeviLamina and installs its dependencies. You can also install it from the **Marketplace** page in the lip interface by searching for LegacyScriptEngine.

### In the game on Windows

In LeviLauncher, open the instance's **LeviMC Mods** page, find LegacyScriptEngine, and install it. LeviLauncher selects the build for the client and the instance's LeviLamina.

## Check that it works

On a server, run `lip list`. It shows `github.com/LiteLDev/LegacyScriptEngine` along with the variant (such as `#quickjs`) and its version.

## Update

```shell
lip update LegacyScriptEngine#quickjs
```

Specify the variant you installed. Running `lip update` without a name updates every package you requested. To switch to a specific version or roll back to an older one, specify the version: `lip update LegacyScriptEngine#quickjs@0.23.1`.

## Other versions

Every release is listed on the [releases page](https://github.com/LiteLDev/LegacyScriptEngine/releases). Each LSE version is built for one LeviLamina version, and lip offers only those that match your server. To install one of them, append it after `@`: `lip install LegacyScriptEngine#quickjs@0.23.1`.

## Next steps

- [Install mods on your server](https://levimc.org/tutorials/server/install-mods/): install LSE and other mods on a server using the lip interface and with commands.
- [Your first script plugin](https://levimc.org/tutorials/develop/first-script-plugin/): write a plugin, load it, and see it run.
- Already have LLSE plugins? Put them in `plugins/` and start the server. See [Plugins and engines](concepts/plugins.md).
