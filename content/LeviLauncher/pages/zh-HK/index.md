# LeviLauncher

適用於 Windows 與 Android 的 Minecraft Bedrock 啟動器：在 Windows 電腦或 Android 裝置上安裝、管理、隔離、設定模組並啟動 Minecraft Bedrock。

**安裝：** [安裝](./install)頁面說明了各版本的系統需求、下載管道、更新方式，以及試用測試版的方法。

::: info Windows 版與 Android 版
LeviLauncher 提供支援 Minecraft Bedrock Edition (GDK / UWP) 的 **Windows 版**，以及支援 Google Play 官方 Minecraft 的 **Android 版**。兩者皆須擁有**正版授權**。我們目前沒有開發 iOS 版的計劃。
:::

::: tip 從這裏開始
第一次使用 LeviLauncher？[在 Windows 上玩模組](https://levimc.org/zh-Hant/tutorials/play/play-with-mods/)教學會帶你從下載 LeviLauncher 開始，一步步完成模組安裝並進入遊戲。
:::

## LeviLauncher 能做什麼

- **以版本為核心。** 安裝、重新命名、啟動及移除 Minecraft 正式版或預覽版，讓每個環境都井井有條。每個已安裝的副本稱為一個「實例」：詳見[版本管理](./guide/version-management)與[實例與遊戲版本](./concepts/instances)。
- **乾淨隔離。** 需要更安全的工作區時，可將世界、資源包與遊戲檔案與預設的 AppData 安裝目錄分開存放：詳見[實例隔離](./concepts/isolation)。
- **內容管理。** 在同一處集中管理世界、資源包、行為包、外觀包、截圖與伺服器列表：詳見[內容管理](./guide/content-management)。
- **模組就緒。** 匯入 `.mcmod` 模組包、瀏覽 CurseForge，並透過內建套件管理器安裝 LeviLamina 與 LIP 套件：詳見[模組與整合](./guide/mods-integrations)與[模組如何載入](./concepts/mod-loading)。
- **世界工具。** 匯出備份、檢視世界資訊，並直接在啟動器內編輯部分 `level.dat` 欄位：詳見[世界工具](./guide/world-tools)。
- **使用者設定。** 調整語言、外觀、下載行為、私隱偏好、更新通道與套件管理：詳見[設定與個人化](./guide/settings-personalization)與[全部設定](./reference/settings)。
- **Android 專屬功能。** 在啟動器內切換 Xbox 帳號，並透過 URI 快速啟動遊戲：詳見[帳號與快速啟動](./guide/accounts-quick-launch)。

## 一個簡短的例子

在 Windows 上，所有能在啟動器視窗執行的操作，都可以在終端機中完成。以下三條指令會將最新的 Minecraft 正式版連同 LeviLamina 安裝為新實例並設為預設，接著從 [LeviMC 模組](https://levimc.org/zh-Hant/mods/)為該實例安裝一個模組，最後啟動遊戲：

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe play
```

安裝 GDK 版本前，必須先登入擁有 Minecraft 的 Microsoft 帳號（`LeviLauncher.exe account login`）。若使用圖形介面，上述步驟分別對應 **下載** 頁面、**LeviMC 模組** 頁面與 **啟動** 按鈕。完整指令列表請參閱[命令列](./reference/command-line)參考。

## 這個網站包含什麼

本文件專為**最終用戶**編寫，而非維護者或開發者。

- **指南**：每頁介紹一項操作任務。請先從[安裝](./install)頁面取得應用程式，接著了解如何管理[版本](./guide/version-management)、[下載與鏡像](./guide/downloads-mirrors)、[內容](./guide/content-management)、[帳號與快速啟動](./guide/accounts-quick-launch)（Android）、[模組](./guide/mods-integrations)、[世界](./guide/world-tools)與[設定](./guide/settings-personalization)。「協助」分類則包含[更新與故障排查](./guide/update-troubleshooting)及[社群與回饋](./guide/faq-community-feedback)。
- **概念**：說明 LeviLauncher 的運作機制，包括[實例與遊戲版本](./concepts/instances)（正式版與預覽版、GDK 與 UWP、Windows 與 Android）、[實例隔離](./concepts/isolation)以及[模組如何載入](./concepts/mod-loading)。
- **參考**：提供[命令列](./reference/command-line)、[全部設定](./reference/settings)、LeviLauncher 使用的[資料夾與檔案](./reference/files)、Android 的[快速啟動 URI](./reference/quick-launch-uri)，以及 Android 版的[私隱政策](./privacy-policy)。

建議閱讀順序：先閱讀[在 Windows 上玩模組](https://levimc.org/zh-Hant/tutorials/play/play-with-mods/)教學，再參閱[版本管理](./guide/version-management)與[內容管理](./guide/content-management)。

## 社群與回饋

- **官方 Discord：** [discord.gg/v5R5P4vRZk](https://discord.gg/v5R5P4vRZk)
- **個人 Discord 頻道：** [discord.gg/VqQaC8vWz8](https://discord.gg/VqQaC8vWz8)
- **QQ 群組：** [458083875](https://qm.qq.com/q/1z791rJgJG)
- **問題回饋：** [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)
