# lip 基礎

這裡整理了新使用者最常問的問題，每個問題都提供簡短解答，並附上詳細說明頁面的連結。

## 關於 lip

### lip 是做什麼的？

lip 會在資料夾裡安裝並執行 Minecraft 基岩版伺服器，同時負責安裝和更新伺服器模組。你可以透過終端機介面或命令列操作它。詳見[首頁](https://levimc.org/zh-Hant/lip/)。

### 它只能用於 LeviLamina 嗎？

不是，不過它是為此設計的。lip 安裝的都是 LeviLamina 模組，而 LeviLamina 也是 lip 唯一會安裝的載入器。你也可以執行不含載入器的原版伺服器：Windows 版請用 `lip setup --game <version> --no-loader`，Linux 版請加上 `--build linux`。詳見[遊戲版本與組建](https://levimc.org/zh-Hant/lip/reference/commands/setup.html)。

### lip 能安裝客戶端模組嗎？

不能。lip 只管理伺服器。遊戲客戶端的模組是由 LeviLauncher 這類啟動器管理，不過兩者讀取的是相同的套件。

### 它能在哪些系統上執行？

Windows、x64 的 Linux，以及 macOS。在 Linux 和 macOS 上，lip 會自行下載 Wine 來執行 Windows 伺服器。lip 沒有 arm64 Linux 版本。詳見 [Linux 與 macOS](https://levimc.org/zh-Hant/lip/guides/linux_macos.html)。

### 需要 git、Wine 或別的東西嗎？

不需要。lip 會自行與 git 儲存庫通訊，並在需要時下載遊戲、載入器、Wine 和 Microsoft Visual C++ Redistributable。詳見[內部機制](https://levimc.org/zh-Hant/lip/concepts/internals.html)。

### 有繁體中文嗎？

有。介面支援英語、簡體中文和繁體中文，預設會跟隨系統語言。若要手動指定，可在設定頁面更改，或執行 `lip config set language zh-Hant`。本文件同樣提供這三種語言版本。至於命令在終端機輸出的內容，則一律是英語。詳見 [language](https://levimc.org/zh-Hant/lip/guides/configuration.html#language)。

## 使用 lip

### 可以不用介面嗎？

可以。介面執行的所有操作都有對應的命令：`lip setup`、`lip install`、`lip update`、`lip uninstall`、`lip run`、`lip config`。你可以從[用命令行開服](https://levimc.org/zh-Hant/tutorials/server/command-line/)開始入手。這些命令也能用於無人值守的指令碼中：詳見 [`lip setup`](https://levimc.org/zh-Hant/lip/reference/commands/setup.html) 的 `--accept-eula` 選項。

### 反過來呢：一定要學命令嗎？

不用。直接輸入 `lip`（後面不加任何參數），即可開啟介面操作。詳見[開你的第一個伺服器](https://levimc.org/zh-Hant/tutorials/server/first-server/)。

### 關掉終端機後伺服器會停止嗎？

這取決於你啟動它的方式。

- **在介面裡啟動的：** 不會。結束介面或關掉終端機後，伺服器仍會繼續執行。
- **用 `lip run --managed` 啟動的：** 不會。關掉終端機只是中斷連線。
- **用普通的 `lip run` 啟動的：** 會。lip 會通知伺服器停止，並等待它完全結束。

在前兩種情況下，伺服器會在 lip 的背景處理程序裡執行。你可以隨時透過介面或 `lip run --managed` 重新連回伺服器。詳見[託管伺服器](https://levimc.org/zh-Hant/lip/reference/commands/run.html)。

### 怎麼停止在背景執行的伺服器？

開啟介面，在伺服器頁面選擇「停止」；或者在伺服器資料夾中執行 `lip run --managed` 連回伺服器，再按 Ctrl+C。

### lip 能重新啟動當機的伺服器嗎？

能。在伺服器頁面開啟「自動重新啟動」，或執行 `lip config set restart on-failure --workspace`。詳見[重新啟動](https://levimc.org/zh-Hant/lip/reference/commands/run.html)。

### 伺服器執行時能安裝或更新模組嗎？

在介面裡不能，系統會要求你先停止伺服器。使用命令則可以，變更會在伺服器下次啟動時生效。在 Windows 上，執行中的伺服器可能會鎖定某些檔案，導致命令執行失敗；此時 lip 會自動復原已做的變更。詳見[介面與命令](https://levimc.org/zh-Hant/lip/concepts/how_lip_works.html)。

### 能執行多個伺服器嗎？

能。請將每個伺服器放在獨立的資料夾，並在各自的 `server.properties` 中設定不同的連接埠。一個資料夾同一時間只能執行一個伺服器。介面會在[工作區選擇器](https://levimc.org/zh-Hant/lip/interface/workspaces.html)中儲存你的伺服器資料夾清單，可從畫面頂端的工作區開啟。

### 怎麼更新 lip？

執行 `lip self-update`，或使用設定頁面的「檢查更新」。執行 `lip self-update --check` 則只會檢查是否有新版本。詳見 [`lip self-update`](https://levimc.org/zh-Hant/lip/reference/commands/self_update.html)。

### 怎麼變更伺服器的 Minecraft 版本？

在伺服器資料夾裡再次執行 `lip setup --game <version>`，或使用介面伺服器頁面上的**變更版本…**。模組會一併更新為相容於新遊戲版本的版本。詳見 [`lip setup`](https://levimc.org/zh-Hant/lip/reference/commands/setup.html)。

## 檔案

### 我的世界和設定在哪裡？

都在伺服器資料夾裡，也就是遊戲預設存放它們的位置。lip 不會搬移這些檔案。

| 內容 | 在伺服器資料夾裡的位置 |
| --- | --- |
| 世界 | `worlds/` |
| 遊戲的設定 | `server.properties`、`allowlist.json`、`permissions.json` |
| 模組，通常還有它的設定 | `mods/<名字>/` |

你可以透過介面的[遊戲設定](https://levimc.org/zh-Hant/lip/interface/game_config.html)和[模組設定](https://levimc.org/zh-Hant/lip/interface/mod_config.html)頁面來編輯這些設定。

### `.lip` 資料夾是什麼？

這是 lip 為該伺服器資料夾維護的記錄，包含已安裝的套件、工作區設定、失敗報告，以及 Linux 和 macOS 上的 Wine 前綴。在 Windows 上，這個資料夾是隱藏的。請勿手動修改它；搬移伺服器時，請將它連同資料夾一起移動。詳見[檔案和目錄](https://levimc.org/zh-Hant/lip/reference/files.html)。

### lip 在伺服器資料夾之外還存了什麼？

每個使用者帳號下會有四個專屬目錄，分別存放你的設定、下載快取、lip 的 Wine，以及介面的工作區清單。

| 內容 | Windows | Linux 和 macOS |
| --- | --- | --- |
| 設定 | `%APPDATA%\lip` | `~/.config/lip` |
| 快取 | `%LOCALAPPDATA%\lip\Cache` | `~/.cache/lip` |
| 資料：lip 為執行伺服器而安裝的東西，例如它的 Wine | `%LOCALAPPDATA%\lip\Data` | `~/.local/share/lip` |
| 狀態：工作區清單 | `%LOCALAPPDATA%\lip\State` | `~/.local/state/lip` |

你可以隨時用 `lip cache clean` 清除快取。lip 不會向系統的暫存目錄寫入任何檔案。詳見[使用者目錄](https://levimc.org/zh-Hant/lip/concepts/how_lip_works.html)。

### 變更遊戲版本會刪掉我的世界嗎？

不會。`worlds/`、`server.properties`、`allowlist.json` 和 `permissions.json` 都會保留。遊戲本身的部分資料夾（例如根目錄下的 `resource_packs/` 和 `behavior_packs/`）則會先刪除再重新寫入。詳見[更換遊戲後保留什麼](https://levimc.org/zh-Hant/lip/reference/files.html)。

### 怎麼把伺服器搬到另一個資料夾或另一臺機器？

先停止伺服器，將整個資料夾（包含 `.lip`）移動或複製到新位置，然後在新位置執行 lip。如果是搬到新機器，lip 在首次啟動時會自動重新安裝伺服器所需的系統元件。

## 套件

### 套件從哪裡來？

來自公開的 git 儲存庫，大多數託管在 GitHub 上。lip 沒有中央儲存庫，套件是透過儲存庫位址來指定，例如 `github.com/LiteLDev/LegacyScriptEngine`。介面的「取得模組」頁面列出的則是 [levimc.org](https://levimc.org) 上的模組。詳見[指定一個套件](https://levimc.org/zh-Hant/lip/guides/managing_packages.html)。

### 怎麼安裝磁碟上的套件？

準備好根目錄下含有 `lip.toml` 的 ZIP 檔案或資料夾，並將路徑傳給 `lip install`，例如 `lip install ./my-mod.zip`。詳見[磁碟上的 ZIP 檔案或資料夾](https://levimc.org/zh-Hant/lip/guides/managing_packages.html)。

### lip 支援私有儲存庫嗎？

不支援。lip 下載時不會進行登入驗證，因此只能使用公開儲存庫。

### 為什麼我儲存庫裡的某個標籤不算版本？

只有以 `v` 開頭並加上完整版本號的標籤（例如 `v1.2.3`）才算版本，`v1.2` 或 `1.2.3` 這類標籤則不算。不過任何標籤、分支或提交都可以安裝：`lip install github.com/user/repo@tag:1.2.3`。詳見 [git 儲存庫](https://levimc.org/zh-Hant/lip/guides/managing_packages.html)。

### 還能安裝為 lip v0.x 製作的、帶 `tooth.json` 的套件嗎？

能。lip 可以讀取這類套件，並像其他套件一樣安裝。當 lip 第一次處理 lip v0.x 的伺服器資料夾和設定時，會自動完成轉換。套件作者可以用 `lip pkg migrate` 轉換自己的套件：詳見[移轉套件](https://levimc.org/zh-Hant/lip/authors/migrating_packages.html)。

### `lip.toml` 是什麼？

用來描述套件的檔案，記錄套件的名稱、版本、相依項目，以及要安裝哪些檔案。只有製作套件時才需要它。詳見 [lip.toml](https://levimc.org/zh-Hant/lip/concepts/lip_toml.html)。

### `lip install` 會修改我的 `lip.toml` 嗎？

不會。`lip install` 會把套件安裝到伺服器資料夾，並記錄在 `.lip` 中，從不寫入 `lip.toml`。

## 出問題的時候

### 命令失敗了，去哪裡找原因？

先看 lip 輸出的 `error:` 和 `hint:` 兩行。更多細節載於伺服器資料夾下 `.lip/logs/` 裡的失敗報告，lip 會輸出該報告的路徑。詳見[讀懂失敗資訊](https://levimc.org/zh-Hant/lip/guides/troubleshooting.html)。

### 安裝到一半失敗了會怎樣？

不會留下做了一半的變更。凡是會變更伺服器資料夾的命令，要麼全部完成，要麼什麼都不改：失敗時或按下 Ctrl+C 時，lip 都會復原已做的變更。就算 lip 本身被強制結束，下次在該資料夾執行命令時也會先把狀態清理乾淨。詳見[操作](https://levimc.org/zh-Hant/lip/concepts/how_lip_works.html)。

### 這裡 GitHub 很慢或被屏蔽，怎麼辦？

設定 GitHub 代理伺服器，或使用你的網路代理伺服器。詳見 [GitHub 很慢或被屏蔽時](https://levimc.org/zh-Hant/lip/guides/configuration.html)。

### 能同時執行兩條 lip 命令嗎？

只要是在不同的伺服器資料夾就可以。同一個資料夾同一時間只能有一條命令做變更：第二條命令會立刻失敗，請等第一條結束後再執行。唯讀命令（例如 `lip list`）則隨時可用。詳見[另一個 lip 正在變更工作區](https://levimc.org/zh-Hant/lip/guides/troubleshooting.html)。

### 背景一直在執行的那個 lip 處理程序是什麼？

那是常駐程式，負責執行你的命令，並讓託管伺服器持續運作。只要沒有正在執行的伺服器，閒置 10 分鐘後它就會自動結束。你可以用 `lip daemon status` 檢視狀態，或用 `lip daemon stop` 在它閒置時結束它。詳見[常駐程式和客戶端](https://levimc.org/zh-Hant/lip/concepts/how_lip_works.html)。
