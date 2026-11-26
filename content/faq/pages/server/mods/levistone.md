# LeviStone

## How do I install LeviStone on LeviLamina to run Endstone plugins? Where do Endstone plugins go? What are the limitations?

In the BDS directory where LeviLamina is installed, run:

```shell
pip install levistone --target mods/EndstoneRuntime
```

To install a specific version, run `pip install levistone==0.11.15 --target mods/EndstoneRuntime` (see PyPI for available versions). Versions earlier than 0.11.15 must be installed to `plugins/EndstoneRuntime`. The LeviStone version must match the LeviLamina version (check the CHANGELOG for the LeviLamina version required by each release). Place the `.whl` files for Endstone plugins into the server's `plugins/` directory. (Starting in 0.11.15, LeviStone automatically creates a `plugins` directory link pointing to `mods` when it loads. If a `plugins` folder already exists in the server directory, LeviStone logs an error and does not create the link, so move any existing `plugins` folder out of the way first.) Only Endstone's Python plugins are supported, not C++ (native) plugins.

*Applies to: LeviStone 0.11.15 and later; LeviLamina `>=26.60.4 <26.70.0`; earlier versions install to `plugins/EndstoneRuntime`*

## When LeviStone starts, EndstoneRuntime hangs for a long time and then suddenly starts downloading, so the server starts very slowly or not at all. How do I fix it?

Both LeviStone itself and the dependencies of Endstone plugins (`.whl`) are downloaded from PyPI through pip (when Endstone loads a plugin, it calls `python -m pip install <plugin.whl>`). Without a configured mirror, connecting directly to PyPI is very slow and can even fail. Configure a mirror in mainland China first, then install LeviStone manually in the BDS root directory:

```shell
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
pip install levistone --target mods/EndstoneRuntime
```

To install a specific version, write `levistone==<version>` and make sure it matches the LeviLamina version; for versions before 0.11.15, change `mods` to `plugins`. Then run `bedrock_server_mod.exe`. If you use the Docker image, you can set the `PYPI_MIRROR_URL` environment variable.

*Applies to: LeviStone 0.11.15 and later*
