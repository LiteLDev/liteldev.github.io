# 模組與整合

LeviLauncher 支援超出「基礎啟動器」範圍的模組工作流程。

## 當前可用功能

=== "Windows"

    - 匯入模組包（`.mcmod`）
    - 仍相容 `.zip` 包及單獨的 `.dll` 模組：在檔案對話框中選擇 **所有檔案 (\*.\*)** 即可
    - 啟用或停用已安裝的模組
    - 刪除不再需要的模組
    - 瀏覽並取得 CurseForge 上的資源
    - 使用相容 [lip](https://github.com/LiteLDev/lip) 的內置套件管理器安裝 LIP 套件
    - 配合 LeviLamina 等載入器的工作流程

    ::: warning 這是進階區域
    模組、載入器與套件安裝整合的相容性往往變化較快，在 Minecraft 預覽版（Preview）上尤其如此。請將此處視為進階功能，並逐步測試。
    :::

=== "Android"

    - 向遊戲載入原生模組（`.so` 程式庫）
    - 在隔離版本中維護帶模組的環境

    想開發原生模組？請參閱 LeviLamina 文檔中的 [Android 原生模組](https://levimc.org/zh-Hant/LeviLamina/developer_guides/android/)。

## 建議的模組工作流程

1. 從一個乾淨的隔離版本開始。
2. 先確認該版本在未裝模組時能正常啟動。
3. 一次只加入一個模組或一小批改動。
4. 每次改動後都重新測試能否啟動。
5. 為重要世界始終保留備份路徑。

## CurseForge <Badge platform="windows" />

啟動器整合了 CurseForge 的瀏覽與套件取得流程，方便直接在應用程式內尋找合適資源。

適合以下情況：

- 需要更具引導性的搜尋體驗
- 想更快查看某個專案的相容檔案
- 不希望每次搜尋都要離開啟動器

## lip 與 LeviLamina <Badge platform="windows" />

LeviLauncher 內置相容 [lip](https://github.com/LiteLDev/lip) 的套件管理器，毋須另外安裝 lip 或 .NET 執行階段。其運作方式遵循 lip：每個版本的套件記錄在 `.lip/state.json` 中，套件資訊則從 `lip.toml` 讀取（僅有 `tooth.json` 的舊套件仍可使用）。曾用舊版啟動器安裝過 LeviLamina 或 LIP 套件的版本（`tooth_lock.json`），會在第一次執行套件操作時自動遷移。開啟 **使用鏡像來源** 時，從 GitHub 下載套件會經過[設定](./settings-personalization)中的 **GitHub 代理**；否則直接連線 GitHub（若已設定系統代理，則經過系統代理）。無論哪種情況，先前儲存的 GitHub 代理，或 lip 的 `config.toml`（位於 `%APPDATA%\lip`，例如透過 `lip config set github_proxy <URL>` 設定）中的 `github_proxy` 都會生效。**清理快取** 可刪除已下載的套件檔案。

自 lip v0.40 起，`lip.toml` 與 `.lip/state.json` 中的每個項目都以 `side`（`server` 或 `client`）和 `platform`（.NET 執行階段識別碼，例如 `win-x64`）標示執行位置；lip v0.39 及更早版本則稱之為 `platform` 和 `runtime`。由 lip v0.39 及更早版本或舊版啟動器寫入、仍沿用舊鍵名的 `.lip/state.json`，會在下一次套件操作前自動轉換，將 `platform` 改名為 `side`、`runtime` 改名為 `platform`。lip 仍無法讀取的檔案會被拒絕，並提示所需的修改：將 `platform` 改名為 `side`、將 `runtime` 改名為 `platform`，或重新安裝該版本的套件。

這類整合較適合習慣以套件或載入器管理模組的進階用戶。

最佳做法：

- 先從穩定的正式版（Release）開始
- 避免一次變動多個高風險因素
- 記下「最後一次成功運作」的版本組合

若要為用戶端版本加入 LeviLamina，請參閱 LeviLamina 文檔中的[在Windows上安裝用戶端](https://levimc.org/zh-Hant/LeviLamina/user_guides/install_on_client/)。

### LeviMC 模組頁面

**LeviMC 模組** 頁面會列出 [levimc.org/mods](https://levimc.org/zh-Hant/mods/) 上提供 Windows x64 用戶端建置的模組（即含有 `side = "client"` 且 `platform = "win-x64"` 項目的模組）。你可按名稱、ID、作者、標籤或簡介搜尋；按相關性、星標、最近更新或最新發佈排序；並按遊戲版本、LeviLamina 版本、標籤（前置庫 / API、經濟等推薦標籤置頂，亦可排除特定標籤）、授權條款（寬鬆等類別或 SPDX ID）、依賴項目，以及作者（模組頁面上的 **…的更多專案**）篩選。安裝模組時會優先選用 `client` 變體，若無則選預設變體，再無則選第一個提供用戶端建置的其他變體；你也可以在模組頁面中改選其他符合條件的變體。levimc.org 模組頁面上的 **用 LeviLauncher 安裝** 按鈕為 `levilauncher://install/<mod id>?version=<version>` 連結，點擊後會要求 LeviLauncher 安裝該模組的這個版本。

## 原生模組 <Badge platform="android" />

原生模組會在遊戲程序中執行原生程式碼。請只安裝來源可信的模組，並先在隔離版本中測試。

如欲自行開發，請參閱 LeviLamina 文檔中的 [Android 原生模組](https://levimc.org/zh-Hant/LeviLamina/developer_guides/android/)。

## 如果加了模組後出錯

- 先停用最新加入的模組
- 與上一個正常運作的狀態比對
- 進一步測試前，先轉移或備份重要世界
- 接著參閱[更新與故障排查](./update-troubleshooting)
