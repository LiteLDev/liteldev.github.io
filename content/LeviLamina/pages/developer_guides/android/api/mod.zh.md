# Mod API

!!! note "Android，而不是 LeviLamina"
    本系列页面记录了适用于 **Android 上 Minecraft 基岩版原生模组**的 `pl::` API。这类模组由 Android 版 [LeviLauncher](https://levimc.org/zh-Hans/LeviLauncher/) 通过 Preloader SDK（[LiteLDev/preloader-android](https://github.com/LiteLDev/preloader-android)）加载，而非由 LeviLamina 加载。
    初次接触？请先阅读教程[写你的第一个 Android 原生模组](https://levimc.org/zh-Hans/tutorials/develop/first-android-mod/)。

## 作用

Mod API 是原生模组的生命周期入口。它包含 `<pl/Mod.hpp>`、`ll::mod::NativeMod::current()`，以及通过 `PL_REGISTER_MOD` 注册的常驻 C++ 对象。

## 头文件

```cpp
#include <pl/Mod.hpp>
```

## 注册

```cpp
#include <pl/Mod.hpp>

class MyMod {
public:
  static MyMod &instance();

  MyMod();

  [[nodiscard]] ll::mod::NativeMod &getSelf() const { return mSelf; }

  bool load();
  bool enable();
  bool disable();
  bool unload();

private:
  ll::mod::NativeMod &mSelf;
};

PL_REGISTER_MOD(MyMod, MyMod::instance())
```

```cpp
MyMod::MyMod() : mSelf(*ll::mod::NativeMod::current()) {}
```

`load()` 为必需实现；`enable()`、`disable()`、`unload()` 为可选实现，若未提供，注册辅助宏会默认按成功处理。各个阶段也可以接收 `ll::mod::ModContext &` 参数（例如 `bool load(ll::mod::ModContext &context)`），通过该上下文可以获取 Java VM、清单 `info()`、`logger()`，以及模组的 `dataDir()`、`configDir()` 和 `resourceDir()`。

每个原生模组库只需在一个源文件中调用一次 `PL_REGISTER_MOD`。

## 生命周期

| 方法 | 建议职责 |
| --- | --- |
| `load()` | 读取配置、创建目录、初始化模组自身状态。 |
| `enable()` | 注册 hook、输入回调和运行时 UI。 |
| `disable()` | 撤销对游戏的修改并注销运行时 UI。 |
| `unload()` | 在禁用后释放剩余的 C++ 状态。 |

每个方法在成功时返回 `true`，失败时返回 `false`。

## NativeMod

`ll::mod::NativeMod` 提供清单元数据、包路径、Java VM、生命周期状态以及模组专属的 logger。

```cpp
bool MyMod::load() {
  auto &self = getSelf();
  std::filesystem::create_directories(self.getConfigDir());
  self.getLogger().info("Loading {}", self.getName());
  return true;
}
```

常用成员：

| 成员 | 用途 |
| --- | --- |
| `getJavaVM()` | 当前 `JavaVM *`。 |
| `getLogger()` | 当前模组的 `pl::log::Logger`。 |
| `getId()` | 稳定的运行时模组 ID。 |
| `getName()` | 清单中的显示名称。 |
| `getAuthor()` | 清单中的作者。 |
| `getVersion()` | 清单中的版本。 |
| `getEntryPath()` | 解析后的入口文件路径。 |
| `getEntryFileName()` | 清单中的入口文件名。 |
| `getIconPath()` | 解析后的图标路径；未配置时为空路径。 |
| `getModDir()` | 模组包根目录。 |
| `getDataDir()` | `<mod root>/data`。 |
| `getConfigDir()` | `<mod root>/config`。 |
| `getResourceDir()` | `<mod root>/resources`。 |
| `getManifestPath()` | 解析后的 `manifest.json` 路径。 |
| `getLibraryPath()` | 解析后的原生库路径。 |
| `getState()` | 当前原生模组的生命周期状态。 |
| `isLoaded()` / `isEnabled()` / `isDisabled()` / `isUnloaded()` | 常用状态判断。 |

关于运行时 UI、悬浮按钮和 HUD 覆盖层绘制，请参阅 [Mod Menu API](./mod_menu.md)。

## 注意

- 注册的模组实例必须在整个进程生命周期内保持有效。
- 不要让异常逃逸出生命周期函数边界；请捕获异常并返回 `false`。
- 供用户编辑的配置文件应存放在 `getSelf().getConfigDir()` 下。
