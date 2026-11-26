# 實例與遊戲版本

LeviLauncher 把每一份 Minecraft 安裝為一個**實例**——即一個獨立的遊戲版本，擁有專屬的名稱、設定，以及（按需要而定）獨立的遊戲資料。你可以同時保留多個相同或不同版本的實例，隨時啟動所需的一個。所有實例都會列於 **實例** 頁面。

## 實例是什麼

=== "Windows"

    實例是啟動器 `Instances` 資料夾中的一個子資料夾（見[資料夾與檔案](../reference/files)），實例名稱就是該資料夾的名稱。資料夾包含以下內容：

    - 從安裝包解壓出來的 Minecraft 建置遊戲檔案；
    - `.levilauncher\instance.json`：啟動器記錄的實例資訊，包括遊戲版本、通道、是否使用獨立的遊戲資料，以及啟動選項（主控台、編輯器模式、啟動參數、環境變數）；
    - `mods\`：實例的模組；`.lip\`：內置套件管理器所安裝套件的狀態（見[模組如何載入](./mod-loading)）；
    - 開啟[隔離](./isolation)時，實例專屬的遊戲資料（世界、資源包、設定）。

    模組始終屬於單一實例。遊戲資料則只有在開啟隔離時才屬於該實例；否則，實例會使用這部電腦上 Minecraft 平常使用的遊戲資料。

=== "Android"

    實例是你匯入 LeviLauncher 的官方 Minecraft APK，直接在啟動器內執行，無需安裝到系統中。不過，裝置上仍須安裝 Google Play 上的 Minecraft（1.21.80 或更高版本）；LeviLauncher 會將它與匯入的版本一同列出。

    版本隔離能將匯入版本的世界、資源包和設定，與已安裝的 Google Play 版本分開。匯入的版本通常需要開啟隔離才能啟動。

## 正式版與預覽版

每個 Minecraft 建置都屬於一個**通道**：

| 通道 | 說明 |
| --- | --- |
| Release（正式版） | 大多數玩家使用的穩定版遊戲。 |
| Preview（預覽版） | 即將推出版本的測試建置，較容易出現世界、資源包或模組的相容性問題。 |
| Beta | 僅為 UWP 發佈的測試建置。 <Badge platform="windows" /> |

在 Windows 上，正式版和預覽版各有獨立的遊戲資料資料夾（`Minecraft Bedrock` 和 `Minecraft Bedrock Preview`），因此即使未開啟隔離，預覽版實例也不會與正式版實例共用世界。

## GDK 與 UWP 建置 <Badge platform="windows" />

Windows 版 Minecraft 先後以兩種套件格式發佈，LeviLauncher 兩種都能安裝。同一版本兩種格式都有時，選擇 GDK。

| | GDK | UWP |
| --- | --- | --- |
| 安裝包 | `.msixvc`，從 LeviLauncher 測速後選出的鏡像下載 | `.appx` / `.msix`（或其套件組合），從 Windows Update 下載 |
| 安裝需要 | 已登入且擁有 Minecraft 的微軟帳號 | — |
| 執行需要 | Microsoft Gaming Services 與 Microsoft GameInput | Windows 開發人員模式，用於向 Windows 註冊套件 |
| 共用遊戲資料 | `%APPDATA%\Minecraft Bedrock`（預覽版：`Minecraft Bedrock Preview`），在 `Users\` 下每個玩家檔案各有一個資料夾 | `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState`（預覽版：`Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`） |
| 隔離 | 所有版本 | 1.19.70.2 及更高版本的 x64 版本 |
| LeviLamina | 在支援的版本上由 LeviLauncher 安裝 | LeviLauncher 不安裝 |
| 啟動參數與環境變數 | 支援 | 不支援 |

匯入的本機安裝包（`.msixvc`、`.appx`、`.msix`、`.appxbundle` 或 `.msixbundle`）會按副檔名安裝為 GDK 或 UWP。

### 玩家檔案 {#player-profiles}

GDK 實例會按**玩家檔案**保存世界、截圖和伺服器列表：每個玩家檔案是 `Users\` 下以玩家 ID 命名的資料夾，若啟動器知道對應的玩家代號（gamertag），便會顯示該代號。資源包和行為包由所有檔案共用（`Users\Shared\`）；皮膚包自遊戲 1.26 起共用，此前則按檔案分別保存。UWP 實例沒有玩家檔案。

## 向 Windows 註冊 <Badge platform="windows" /> {#registration-with-windows}

Windows 在每個通道中只會識別一個已安裝的 Minecraft。**註冊**一個實例，就是讓 Windows 將它視為系統的 Minecraft：此後，開始功能表、`minecraft://` 連結和 Xbox 功能都會使用這個實例。註冊會取代正式版或預覽版位置的目前持有者（Microsoft Store 中的遊戲或另一個實例），但原有資料會保留下來。註冊和取消註冊都不會改動遊戲資料。

UWP 實例會在啟動時自動註冊。已註冊的實例需要先取消註冊，才能重新命名或刪除。

## 相關頁面

- [版本管理](../guide/version-management)
- [實例隔離](./isolation)
- [資料夾與檔案](../reference/files)
