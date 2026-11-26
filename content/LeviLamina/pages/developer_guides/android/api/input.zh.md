# Input API

## 作用

原生模组可通过 Input API 监听触摸、按键和鼠标事件，并控制 Android 软键盘。

## 头文件

```cpp
#include <pl/Input.hpp>
```

## 事件

```cpp
struct TouchEvent {
  int action;
  int pointerId;
  float x;
  float y;
};

struct KeyEvent {
  int keyCode;
  unsigned int unicodeChar;
  bool isKeyDown;
};

struct TextInputEvent {
  std::string text;
};

struct MouseEvent {
  int button;
  bool isDown;
};
```

callback 返回 `true` 即表示消费该事件。

## 函数

```cpp
void registerTouchCallback(pl::input::TouchCallback callback);
void registerKeyCallback(pl::input::KeyCallback callback);
void registerTextInputCallback(pl::input::TextInputCallback callback);
void registerMouseCallback(pl::input::MouseCallback callback);

void showKeyboard();
void hideKeyboard();

bool openDocument(std::string mimeType, pl::input::DocumentCallback callback);
```

`registerTextInputCallback()` 用于接收软键盘提交的文本。
`openDocument()` 按指定的 `mimeType`（留空则为 `*/*`）打开 Android 文档选择器，并传入 `DocumentResult`（包含 `success`、`path`、`displayName`、`error`）调用一次 callback；若已有未完成的请求或无法打开选择器，则返回 `false`。

## 示例

```cpp
#include <pl/Input.hpp>

bool MyMod::enable() {
  pl::input::registerTouchCallback([](const pl::input::TouchEvent &event) {
    (void)event;
    return false;
  });

  pl::input::registerKeyCallback([](const pl::input::KeyEvent &event) {
    return event.isKeyDown && event.keyCode == 111;
  });

  return true;
}
```

## 注意

- 目前未提供取消注册（unregister）的 API；请确保每个进程只注册一次，或在模组内部维护启用（enabled）状态来控制事件转发。
- 保持 callback 简短，切勿阻塞。
- 软键盘相关函数要求游戏的 Activity 处于可用状态。
