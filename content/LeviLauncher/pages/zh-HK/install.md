# 安裝 LeviLauncher

LeviLauncher 提供 Windows 版和 Android 版，另有一個處於測試階段的 macOS 版。下方已自動選中適合你裝置的分頁。

## 需要什麼

=== "Windows"

    - Windows 10 或 11。
    - 從 Microsoft Store 取得的正版 Minecraft 基岩版（GDK / UWP）。

=== "Android"

    - 搭載 Android 9.0 或更高版本的 ARM64 裝置。
    - 在這部裝置上從 Google Play 購買並安裝的 Minecraft 基岩版 1.21.80 或更高版本。

=== "macOS"

    - 搭載 Apple 晶片、執行 macOS 14.6 或更高版本的 Mac。
    - 正版 Minecraft 基岩版。LeviLauncher 會透過 Wine 執行 Windows（GDK）版遊戲。

::: info iOS
LeviLauncher 沒有 iOS 版，我們也沒有開發 iOS 版的計劃。
:::

## 安裝

=== "Windows"

    1. 開啟 [LeviLauncher 的最新發行版](https://github.com/LiteLDev/LeviLauncher/releases/latest)，下載 `LeviLauncher-amd64-installer.exe`。
    2. 執行安裝檔並完成安裝精靈。由於預設安裝路徑是 `Program Files`，安裝程式會要求管理員權限。如果提示需要安裝 WebView2 或其他元件，請允許它繼續。

    發行版裡還有兩個檔案，一般用不到：

    | 檔案 | 用途 |
    | --- | --- |
    | `LeviLauncher.exe` | 可攜版：在純英文字母路徑下新建一個資料夾，將檔案單獨放進去直接執行。 |
    | `LeviLauncher.zip` | 啟動器自我更新時下載的更新包。 |

=== "Android"

    1. 在裝置上開啟 [LeviLauncher Android 版的最新發行版](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest)，下載檔名以 `-release.apk` 結尾的檔案。
    2. 開啟剛下載的檔案。如果 Android 提示不允許瀏覽器安裝應用程式，請點選**設定**，開啟**允許來自此來源的應用程式**，返回後再點選**安裝**。

=== "macOS"

    macOS 版仍在測試階段，只發佈於標有 **Pre-release** 的發行版中，不包含在最新的穩定版裡。

    1. 開啟 [LeviLauncher 的發行版列表](https://github.com/LiteLDev/LeviLauncher/releases)，找到包含 `LeviLauncher-macos-arm64-installer.dmg` 的最新發行版。
    2. 下載並開啟該檔案，把 **LeviLauncher** 拖進**應用程式**。

    UWP 實例僅支援 Windows。

## 確認裝好了

啟動 LeviLauncher，視窗隨即開啟；首次啟動時會顯示初始設定（Windows、macOS）或授權協議（Android）。

## 更新

=== "Windows"

    LeviLauncher 啟動時會自動檢查新版本並提示安裝，直接在原位完成更新。若要手動檢查，可開啟**設定**並點選**檢查更新**，或執行 `LeviLauncher.exe self-update`。

=== "Android"

    LeviLauncher 發現新版本時會發出提示，下載新版 APK 並交由 Android 安裝。如果你的網路連不上 GitHub，可直接從發行版列表下載新的 APK 覆蓋安裝。

=== "macOS"

    LeviLauncher 啟動時會自動檢查新版本並提示安裝。

## 測試版與歷史版本

各版本的檔案和更新內容皆列於發行版列表中：

- Windows 與 macOS：[LiteLDev/LeviLauncher Releases](https://github.com/LiteLDev/LeviLauncher/releases)
- Android：[LiteLDev/LeviLauncher-Android Releases](https://github.com/LiteLDev/LeviLauncher-Android/releases)

列表中標有 **Pre-release** 的發行版即為**測試版**（beta），例如 `v1.2.0-beta.1`。測試版包含下個版本尚未完成的新功能，可能會出現問題。若想試用，請按上述方法從對應的發行版下載檔案。在 Windows 上，已安裝的 LeviLauncher 也可以直接跟隨測試版更新：在**設定**中開啟**接收測試版更新**，之後每有新的測試版都會收到更新提示；關閉此選項則只接收穩定版。

## 下一步

=== "Windows"

    - [在 Windows 上玩模組](https://levimc.org/zh-Hant/tutorials/play/play-with-mods/)：從剛裝好的 LeviLauncher 到第一次帶模組進入遊戲。
    - [版本管理](/zh-Hant/guide/version-management?platform=windows)

=== "Android"

    - [在 Android 上玩模組](https://levimc.org/zh-Hant/tutorials/play/play-with-mods-android/)：從剛裝好的 LeviLauncher 到第一次帶模組進入遊戲。
    - [版本管理](/zh-Hant/guide/version-management?platform=android)

=== "macOS"

    - [版本管理](/zh-Hant/guide/version-management)
    - [更新與故障排查](/zh-Hant/guide/update-troubleshooting)
