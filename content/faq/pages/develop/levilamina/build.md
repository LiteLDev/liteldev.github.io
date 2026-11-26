# Building LeviLamina mods: toolchain

## When building with `levilamina-mod-template`, the version in `manifest.json` is always `0.0.0`, or I get `Failed to parse version tag, using 0.0.0`. Where do I set the version?

The version is not taken from `tooth.json`. At build time, the `levibuildscript` modpacker reads the git tag with `git describe --tags --abbrev=0` and parses it in `vX.Y.Z` format; if there is no tag, or the tag is in the wrong format, it falls back to `0.0.0`. To fix this:

1. Clone the repository with `git clone` (a downloaded zip does not contain `.git`).
2. Create a tag with a `v` prefix, such as `git tag v0.1.0`, and then build.

You can also set the version manually in `xmake.lua`: `add_rules("@levibuildscript/modpacker", {modVersion = "1.0.0"})`.

*Applies to: mod templates using the levibuildscript modpacker (current version)*

## Can the LeviLamina (LL3) mod template be used to write LiteLoaderBDS (LL2) plugins? Where is the LL2 C++ plugin template?

No. `levilamina-mod-template` only works with LeviLamina. The LL2 C++ plugin template is at <https://github.com/LiteLDev/liteloaderbds-plugin-template>. Both that repository and LiteLoaderBDS itself are archived and no longer maintained, so you should migrate to LeviLamina.

*Applies to: current version (LiteLoaderBDS is archived)*

## Building a LeviLamina mod with xmake keeps failing. How do I troubleshoot?

1. Make sure the toolchain is up to date: the Visual Studio/MSVC build tools (which provide the Windows SDK and the STL) and LLVM (mods are compiled with `clang-cl`);
2. Run `xmake repo -u`;
3. Delete `%LocalAppData%\.xmake`, then delete caches such as `.xmake` and `build` in the project directory;
4. Run `xmake f -y -p windows -a x64 -m release` again, check for errors during the configure stage, and then build with `xmake`.

## In an xmake package description (for example when submitting a package to xmake-repo or writing a custom package), what is the hash in `add_versions` and how do I get it?

If the package uses a source archive download URL (`set_urls`/`add_urls` pointing to a zip or tar.gz), the hash is the SHA-256 of that version's archive, which xmake uses to verify the download. If the package uses a Git repository URL (such as `https://github.com/xxx/yyy.git`), use the Git commit hash for the corresponding version.

*Applies to: current xmake / LiteLDev xmake-repo*

## Why does adding the LeviLamina dependency (`add_requires("levilamina")`) to an xmake project also pull in PreLoader?

This is normal. Installing the `levilamina` xmake package builds LeviLamina from source. Because LeviLamina is loaded by PreLoader and depends on it at runtime, LeviLamina's own `xmake.lua` includes `add_requires("preloader ...")`. As a result, installing the `levilamina` package also pulls in the `preloader` package.

## When using `levilamina-mod-template`, how do I rename `MyMod` (the class name) and `my_mod` (the namespace) in the template?

Rename the `my_mod` namespace to match your mod; you can change the `MyMod` class name to whatever you like (such as `Entry` or your mod's name). Make sure to update all of the following together, or the build will fail: the class name and namespace in `src/mod/MyMod.h` and `MyMod.cpp`, and `LL_REGISTER_MOD(my_mod::MyMod, my_mod::MyMod::getInstance());` at the end of `MyMod.cpp`. Also update `target("my-mod")` in `xmake.lua` to your mod's name (the build script uses the target name to populate `name` in `manifest.json` automatically).

*Applies to: current levilamina-mod-template*

## Building `levilamina-mod-template` (native mod) with xmake fails, or reports that the cxx program cannot be found (no C++ compiler). What should I do?

Usually, the build environment is incomplete. On Windows, the current template uses the `clang-cl` toolchain, which requires the following:

1. Install Visual Studio 2022 or later with the "Desktop development with C++" workload (including MSVC and the latest Windows SDK, since `clang-cl` depends on its standard library and SDK).
2. Install LLVM (the official CI currently uses LLVM 22) and make sure `clang-cl` is in your `PATH`.
3. Install or update xmake to version 3.0.0 or later.

After installing these components, clear the cache with `xmake c -a`, then reconfigure and build with `xmake f -c -y -p windows -a x64 -m release`.

*Applies to: current levilamina-mod-template / LeviLamina 26.x*

## All dependencies are set to the latest versions, but building a mod gives LeviLamina header errors about the platform macros `LL_PLAT_S` / `LL_PLAT_C`. How do I fix it?

This happens because no platform macro is defined. The `levilamina` xmake package in levimc-repo now defines `LL_PLAT_S` (server) or `LL_PLAT_C` (client) automatically based on `target_type`, so the template no longer defines them manually. To fix this:

1. Run `xmake repo -u` to update the package repository to the latest version.
2. Declare `option("target_type")` and write `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})`, as in the latest template.
3. If you are using an older package repository that does not define them automatically, add them manually in the target:

```lua
if is_config("target_type", "server") then
    add_defines("LL_PLAT_S")
else
    add_defines("LL_PLAT_C")
end
```

*Applies to: LeviLamina 26.x and later*

## After upgrading LeviLamina (such as 1.9.2 and later), my own mod fails to build both locally and on GitHub Actions. How do I fix it?

Update the mod's `xmake.lua` to match the latest `levilamina-mod-template`: add the `target_type` option (`option("target_type")` defaults to `server`, with `server` and `client` as choices) and declare the dependency with `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})`. At the end of the target, separate server and client sources with `is_config("target_type", "server")`. Sync the GitHub Actions `build.yml` with the template as well (use a matrix to build both server and client with `xmake f ... --target_type=${{ matrix.target_type }}`).

*Applies to: LeviLamina 1.9.x and later (including 26.x)*

## How do I build and enable LeviLamina's own tests (such as EventTest)?

Enable the tests option when building LeviLamina: `xmake f --tests=y` (optionally with `--target_type=server/client`), then run `xmake`. This pulls in gtest and builds the `src-test` directory (the server event test is in `src-test/server/EventTest.cpp`). Because xmake configuration is sticky, if behavior is odd after switching configurations, delete the project's `.xmake` directory or reconfigure with `xmake f -c`.

*Applies to: LeviLamina 26.x*

## How do I build LeviLamina itself?

You need XMake 3.0.0+, LLVM/Clang (`clang-cl` must be in PATH), Visual Studio 2022 or its Build Tools (with the C++ desktop development workload, which provides the Windows SDK and standard library that `clang-cl` depends on), and Git. Run `xmake` in the repository root to build the server (the default). To build the client, run `xmake f --target_type=client` and then `xmake`; add `--tests=y` to enable tests. The server can also be built for Linux x86_64 with `-p linux` (clang toolchain), whereas the client can only be built on Windows. If the cache misbehaves, run `xmake c -a` and `xmake f -c`.

*Applies to: LeviLamina 26.20 and later*

## I want to build a native Android mod. After cloning LeviLamina on Termux/arm64 Linux, `xmake f -p linux -a arm64` fails with `` `arm64` is not a valid complation arch for this project, please use one of x86_64 ``. What should I do?

LeviLamina supports only x86_64: the client targets `windows|x64` only, and the server targets `windows|x64` and `linux|x86_64`, so you cannot use it to build Android mods. Native mods on Android use a separate system: the Android version of LeviLauncher loads them through the Preloader SDK (`LiteLDev/preloader-android`, the `pl::` API). Instead of using LeviLamina, follow the tutorial "Write Your First Android Native Mod" (<https://levimc.org/tutorials/develop/first-android-mod/>) and the API pages under `developer_guides/android` in the LeviLamina documentation.

## When packaging a LeviLamina mod, what happens if I do not change the LeviLamina version that the package description file depends on? Is it the latest version by default?

No, it does not pick the latest version automatically; you must update the dependency to the target version yourself. The current template uses `lip.toml` instead of `tooth.json`: under `[variants."".deps]`, set the version range for `"github.com/LiteLDev/LeviLamina"` (the template uses `"26.60.*"` for the server and `">26.60.6 <26.61.0"` for the client; the client dependency uses the bare ID, not `"#client"`). Also update `add_requires("levilamina x.x.x")` in `xmake.lua` to the target version; otherwise, your mod will depend on the wrong LL version.

*Applies to: lip.toml format (templates after LeviLamina 26.60.6); the old tooth.json works the same way*

## Building a client mod, xmake reports `error: Invalid option: --target_type=client`. What causes this?

`--target_type` is a configuration option declared in the project's `xmake.lua` with `option("target_type")` (values `server`/`client`, default `server`); you can pass it only if `xmake.lua` declares the option. This error means your `xmake.lua` is from an older version or has been modified and lacks the `target_type` option. Use the `xmake.lua` from the latest `levilamina-mod-template` (which declares `option("target_type")` and passes it to the `levilamina` package via `add_requires("levilamina", {configs = {target_type = get_config("target_type")}})`), make sure xmake is up to date (`xmake --version`), and then run `xmake f -a x64 -m release -p windows --target_type=client -y` followed by `xmake -v -y` to build.

*Applies to: LeviLamina 26.x, current levilamina-mod-template*

## The author of an open-source native LeviLamina mod has stopped updating it. How can I update it to a new LeviLamina version myself?

Fork the repository and replace its `xmake.lua` with the latest one from `levilamina-mod-template`. Update the mod name and LeviLamina version, and sync `lip.toml` and `manifest.json` if necessary. Then update the include paths and APIs to match the new headers—if Mojang has removed or changed functions, you will need to rewrite that code. Once the mod compiles, open a PR to the original repository.

## Building a LeviLamina mod with xmake fails with `error: package(bedrockdata): version(xxx) not found!` (for example 1.21.60.10-server). What should I do?

Your local xmake package repository (`levimc-repo`) cache is out of date. Run `xmake repo -u` to update the repository, then rebuild. In general, if a package version has already been published but xmake reports that it cannot be found, update the repository cache.

*Applies to: all LeviLamina versions built with xmake + levimc-repo*

## Building a mod for an older LeviLamina (such as 1.4.1) with the latest levilamina-mod-template, the GitHub Actions client build fails (the old version has no client build). How do I make the action build only the server?

LeviLamina officially supports the client only starting from 1.9.0. When targeting an older version, remove the `client` entry from `matrix.target_type` in `build.yml` and `release.yml` under `.github/workflows/` so that only the `server` target is built. Also remove the variant with `side = "client"` in `lip.toml`, and set the LeviLamina dependency version to the one you actually use.

*Applies to: projects using the new template that target LeviLamina before 1.9.0*
