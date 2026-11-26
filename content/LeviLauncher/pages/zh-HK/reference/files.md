---
platforms: [windows]
---
# 資料夾與檔案

以下列出 Windows 版 LeviLauncher 讀寫的所有檔案與資料夾（以 LeviLauncher 1.1.0 為準）。啟動器不會向系統暫存資料夾（`%TEMP%`）寫入任何內容。

## 概覽

| 資料夾 | 位置 | 內容 |
| --- | --- | --- |
| 設定資料夾 | `%APPDATA%\LeviLauncher\` | 只有 `config.json`：體積小，會隨 Windows 設定檔漫遊 |
| 本機資料夾 | `%LOCALAPPDATA%\LeviLauncher\` | 記錄檔、微軟帳號、視窗的 WebView2 資料；也是預設的資料根目錄 |
| 資料根目錄 | 本機資料夾，除非你另行指定（**設定 → 基礎設定** 中的 **根目錄**，或 `config set data-root`） | `Instances\`、`Backups\`、`Cache\` |

```text
%APPDATA%\LeviLauncher\
  config.json                      啟動器的設定
%LOCALAPPDATA%\LeviLauncher\        預設的資料根目錄
  Logs\startup.log                 啟動器記錄檔，以及之前的 startup.1.log … startup.4.log
  Accounts\                        微軟帳號和裝置記錄，按目前 Windows 使用者加密
  WebView2\                        啟動器視窗的資料
  storage-migration.json           從舊佈局遷移的記錄（見下文）
<資料根目錄>\
  Instances\<實例>\                 一個實例（見下文）
  Backups\
    Worlds\<實例>\<資料夾>_<世界>\<世界>_<yyyyMMdd-HHmmss>.mcworld
    Instances\<實例>\<實例>_<yyyyMMdd-HHmmss>.zip
  Cache\
    Installers\                    遊戲安裝包，以及 Visual C++ 和 WebView2 安裝程式
    Updates\                       啟動器更新包，安裝後刪除
    Downloads\                     為匯入而下載的檔案，超過 1 天後在啟動時清理
    Imports\                       交給匯入處理的檔案，超過 1 天後在啟動時清理
    gdk-pending-versions.json
    gamertags.json                 啟動器見過的玩家檔案的玩家代號
```

`Cache\` 中的所有內容都可以安全刪除，不會遺失任何資料。執行 `LeviLauncher.exe cache clean` 可刪除套件快取、為匯入而下載的檔案及未完成的下載；執行 `LeviLauncher.exe installer remove` 則會刪除已下載的遊戲安裝包。更改資料根目錄只會讓啟動器改用新的資料夾，原有的實例、下載和備份不會自動移動。

## 實例的資料夾

```text
Instances\<實例>\
  Minecraft.Windows.exe …          該建置的遊戲檔案
  LeviLauncher.dll                 LeviLauncher 的原生載入器（x64 建置）
  .levilauncher\                   啟動器在實例內的狀態（隱藏）
    instance.json                  名稱、遊戲版本、通道、隔離與啟動選項
    icon.ico                       實例圖示，由遊戲的 LargeLogo.png 產生
    xbox-auth-key-v1               UWP 實例用於 Xbox 登入的標記
  .lip\                            實例中已安裝套件的狀態（lip 的格式）
  mods\                            模組（見「模組如何載入」）
  Minecraft Bedrock\               開啟隔離時的遊戲資料（預覽版：Minecraft Bedrock Preview）
```

關於開啟與未開啟隔離的實例遊戲資料資料夾，請參閱[實例隔離](../concepts/isolation)；關於 `mods\`，請參閱[模組如何載入](../concepts/mod-loading)。

## LeviLauncher 資料夾之外

| 路徑 | 說明 |
| --- | --- |
| 桌面上的 `Minecraft - <實例>.lnk` | 實例的桌面捷徑（透過 **建立桌面捷徑** 或 `instance shortcut` 建立）。它會以 `--launch=<實例>` 參數開啟啟動器，且只會寫入你個人的桌面，不會寫入公用桌面。 |
| `%APPDATA%\lip\` | lip 的設定檔 `config.toml`（例如其中的 `github_proxy`），內置套件管理器也會讀取此設定。 |
| `%LOCALAPPDATA%\lip\Cache\` | 內置套件管理器的套件快取，與 lip 共用。按一下 **設定 → 套件管理** 中的 **清理快取** 即可清空。 |
| `%APPDATA%\Minecraft Bedrock\`、`%APPDATA%\Minecraft Bedrock Preview\` | 未開啟隔離的 GDK 實例共用的遊戲資料。 |
| `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\`（預覽版：`Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`） | 未開啟隔離的 UWP 實例共用的遊戲資料。 |

## 檔案如何寫入

- 寫入檔案時，系統會先在目標位置旁建立 `<名稱>.<隨機字串>.tmp`，寫入完成後再重新命名為最終檔名，因此不會出現寫了一半的檔案。支援續傳的未完成下載則會儲存為 `<名稱>.partial.tmp`。
- 你為實例或世界取的名稱會依 Windows 規則清理：系統會移除 `<>:"/\|?*` 等字元以及結尾的句號與空格，並避開 `CON`、`NUL` 等保留名稱。
- 啟動器產生的檔案會命名為 `<名稱>_<yyyyMMdd-HHmmss>.<副檔名>`，例如 `MyWorld_20261107-142301.mcworld`。

## 舊佈局

1.1.0 之前的 LeviLauncher 會將所有檔案放在 `%APPDATA%\<程式名稱>\`（例如 `%APPDATA%\levilauncher.exe\`），其中包含 `versions\`、`backups\`、`installers\`、`updates\`、`logs\` 資料夾，以及 `config.json`、`user_gamertag_map.json` 和 `gdk_pending_versions.json` 檔案。實例資料夾內則有 `version.json` 和 `LargeLogo.ico`。

首次啟動 LeviLauncher 1.1.0 或更高版本時，啟動器會將這些資料一次性遷移至上述的新佈局，且不會刪除任何檔案：位於同一磁碟機的資料會直接重新命名並移至新位置；位於不同磁碟機的資料則會複製過去並保留原檔，而舊的 `config.json` 會重新命名為 `config.migrated.json`。如果你曾自訂資料根目錄，該目錄會留在原處。若有任何項目無法遷移（例如某個實例正在執行遊戲），所有步驟都會復原，啟動器本次會沿用舊佈局執行，待下次啟動時再行嘗試。`storage-migration.json` 會記錄各項目的遷移位置，隨後桌面捷徑也會更新並指向新位置。
