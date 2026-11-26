# 模組如何載入

Minecraft Bedrock 本身不支援模組：模組是原生程式碼，由載入器在遊戲啟動時注入遊戲程序。本頁說明 LeviLauncher 使用哪些載入器、模組放在哪裏，以及幾種加入模組方式的區別。

## 模組放在哪裏 <Badge platform="windows" />

每個實例都有一個 `mods\` 資料夾（見[資料夾與檔案](../reference/files)）。每個模組是其中的一個子資料夾，內有描述該模組的 `manifest.json`：

| 欄位 | 含義 |
| --- | --- |
| `name` | 模組名稱。 |
| `entry` | 載入器載入的檔案（`.dll`），路徑相對於模組資料夾。 |
| `version` | 模組版本。 |
| `type` | 由哪個載入器載入：`preload-native` 由 LeviLauncher 的原生載入器載入；LeviLamina 模組則有各自的類型。 |
| `author` | 作者（選填）。 |

模組跟隨實例，不受[隔離](./isolation)影響；隔離只涉及遊戲資料。

**關閉模組**（在 **管理模組** 中，或執行 `LeviLauncher.exe mod disable`）會將 `manifest.json` 改名為 `manifest.json.close`，重新開啟時再改回原名。模組檔案會留在原處，只是尋找 `manifest.json` 的載入器不會再載入這個模組。

## 兩個載入器 <Badge platform="windows" />

### LeviLauncher 的原生載入器

LeviLauncher 安裝或準備實例時，會將自帶的載入器 `LeviLauncher.dll` 放在遊戲執行檔旁，並寫入執行檔的匯入表，讓 Windows 隨遊戲一併載入。這適用於 GDK 與 UWP 的 x64 建置版本，[隔離](./isolation)功能也是靠它實現。

遊戲啟動時，原生載入器會按名稱順序掃描 `mods\` 中的資料夾，載入每個 `type` 為 `preload-native` 的模組的 `entry`，並略過沒有 `manifest.json` 的資料夾及其他類型的模組。若實例中已有另一個預載入器（位於遊戲執行檔旁的 `preloader.dll`），原生載入器會將所有模組載入工作交給它。原生載入器需要 Visual C++ 執行階段（x64），LeviLauncher 會檢查並提供安裝。

### LeviLamina

[LeviLamina](https://levimc.org/zh-Hant/LeviLamina/) 是 LeviMC 的模組載入器。[LeviMC 模組](https://levimc.org/zh-Hant/mods/)上的模組大多是 LeviLamina 模組，需要搭配支援該實例遊戲版本的 LeviLamina。只要實例的遊戲版本受支援，LeviLauncher 就能在 GDK 實例上透過內置套件管理器安裝 LeviLamina（可在安裝版本時開啟 **安裝 LeviLamina**，或前往 **實例設定** 的 **載入器** 分頁安裝）。

## 加入模組的三種方式 <Badge platform="windows" />

| 加入項目 | LeviLauncher 的做法 |
| --- | --- |
| **LeviMC 模組** 中的模組（或 `mod install owner/repo`） | 透過內置且相容於 [lip](https://github.com/LiteLDev/lip) 的套件管理器安裝：下載適用於當前平台的發佈版本，安裝相依套件，並記錄於實例的 `.lip\state.json`。若模組需要 LeviLamina，但目前尚未安裝或已安裝的版本不相容，則會先安裝相容的 LeviLamina。以此方式安裝的模組可作為套件更新與移除。 |
| `.mcmod` 模組包（或 `.zip`） | 解壓縮到 `mods\` 下的新資料夾。壓縮檔內必須包含 `manifest.json`。 |
| 單個 `.dll` | 放進 `mods\` 下的新資料夾，並自動產生 `manifest.json`：預設以檔案名稱為名稱，類型設為 `preload-native`，版本設為 `0.0.0`。 |

套件會在 `lip.toml` 和 `.lip\state.json` 中透過 `side`（`client` 或 `server`）與 `platform`（例如 `win-x64`）記錄執行環境。在用戶端上，LeviLauncher 會優先安裝模組的 `client` 變體（如有），否則安裝預設變體。詳情（包含舊套件的遷移方式）見[模組與整合](../guide/mods-integrations)。

## Android <Badge platform="android" />

Android 版支援載入原生模組，即在遊戲程序中執行的 `.so` 函式庫。建議在獨立隔離的版本中使用模組，並只安裝來源可信的模組。如需自行開發，請參閱 LeviLamina 文件中的 [Android 原生模組](https://levimc.org/zh-Hant/LeviLamina/developer_guides/android/)。

## 相關頁面

- [模組與整合](../guide/mods-integrations)
- [實例與遊戲版本](./instances)
- [命令列](../reference/command-line)
