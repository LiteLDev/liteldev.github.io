---
platforms: [windows]
---
# 命令列

不帶參數執行 `LeviLauncher.exe` 會開啟啟動器視窗。帶上指令時，程式會在終端機中執行，完成後即結束。指令格式為 `<名詞> <動詞>`：

```text
LeviLauncher.exe <command> [arguments] [flags]
```

本頁列出 LeviLauncher 1.1.0 的所有指令。執行 `LeviLauncher.exe help <command>` 可列印指定指令的參數與範例，執行 `LeviLauncher.exe help` 則列印總覽。命令列輸出為英文。

```text
LeviLauncher.exe install latest --loader --use
LeviLauncher.exe play
LeviLauncher.exe mod install LiteLDev/LegacyMoney
LeviLauncher.exe world export "My World" -o D:\Backups
LeviLauncher.exe instance list --json
```

## 在 shell 中執行

`LeviLauncher.exe` 是視窗程式，因此 shell 預設不會等待它結束。若要在提示字元返回前看到輸出，或需要取得結束代碼：

- 在 cmd 中執行 `start /wait LeviLauncher.exe ...`，再讀取 `%ERRORLEVEL%`；
- 在 PowerShell 中將輸出導向管線（`LeviLauncher.exe instance list | Out-String`），或使用 `Start-Process -Wait -NoNewWindow`。

命令列不會開啟視窗，即使啟動器視窗已開啟也能執行。

## 指令

### 日常

| 指令 | 作用 |
| --- | --- |
| `play [<instance>]` | 啟動遊戲並等待遊戲視窗出現（`launch` 的別名） |
| `install <version\|file>` | 下載 Minecraft 並安裝為新實例（同 `instance create`） |
| `use [<instance>]` | 設定或顯示預設實例 |
| `stop [<instance>\|<pid>...]` | 關閉執行中的 Minecraft（同 `process stop`） |

### 管理實例

| 指令 | 作用 |
| --- | --- |
| `instance list [<filter>]` | 列出已安裝的實例 |
| `instance show [<instance>]` | 顯示實例的設定、註冊狀態、載入器、玩家與內容數量（亦可寫作 `instance <instance>`） |
| `instance create <version\|file>` | 下載 Minecraft 並安裝為新實例 |
| `instance copy-data [<instance>] --from system\|<instance>` | 將遊戲資料（世界、設定）複製到使用自有資料的實例 |
| `instance rename <instance> <new-name>` | 重新命名實例 |
| `instance set [<instance>]` | 變更實例設定（主控台、編輯器模式、自有資料、啟動參數、環境變數、圖示） |
| `instance remove <instance>...` | 永久刪除實例及其資料夾內的所有內容 |
| `instance register [<instance>]` | 讓 Windows 將該實例視為對應通道已安裝的 Minecraft |
| `instance unregister [<instance>]` | 解除實例在 Windows 中的註冊（保留遊戲資料） |
| `instance shortcut [<instance>]` | 建立或刪除啟動該實例的桌面捷徑 |
| `instance path [<instance>] [<kind>]` | 列印實例的指定資料夾路徑（並可將其開啟） |
| `mod list [<filter>]` | 列出實例的模組 |
| `mod show <package>` | 顯示模組目錄中的指定模組 |
| `mod search [<words>]` | 搜尋 LeviLamina 模組目錄 |
| `mod install <package[@version]>...` | 從模組目錄安裝、升級或降級模組 |
| `mod update [<mod>...]` | 將目錄中的模組更新至最新版本 |
| `mod import <file>...` | 從 `.mcmod`、`.zip` 或 `.dll` 檔案加入模組 |
| `mod set <mod>` | 修改模組的清單（manifest） |
| `mod remove <mod>...` | 從實例中移除模組 |
| `mod enable <mod>... \| --all` | 啟用模組 |
| `mod disable <mod>... \| --all` | 停用模組但不移除 |
| `mod path [<mod>]` | 列印指定模組或實例模組資料夾的路徑 |
| `loader versions` | 列出指定遊戲版本可用的 LeviLamina 版本 |
| `loader install [<version>]` | 在實例中安裝 LeviLamina 或更換版本 |
| `loader remove` | 從實例中移除 LeviLamina |
| `world list [<filter>]` | 列出實例與玩家的世界 |
| `world import <file.mcworld>...` | 從 `.mcworld` 檔案匯入世界 |
| `world export <world>...` | 將世界匯出（備份）為 `.mcworld` 檔案 |
| `world copy <world>...` | 將世界複製到另一個實例 |
| `world rename <world> <new-name>` | 變更世界的顯示名稱 |
| `world get <world> [<key>[/<sub>...]]` | 讀取 `level.dat` 中的世界設定 |
| `world set <world> <key>[/<sub>...]=<value>...` | 修改 `level.dat` 中的世界設定 |
| `world remove <world>...` | 永久刪除世界 |
| `pack list [<filter>]` | 列出資源包、行為包與皮膚包 |
| `pack import <file.mcpack\|file.mcaddon>...` | 從 `.mcpack` 與 `.mcaddon` 檔案安裝資源包與附加元件 |
| `pack copy <pack>... \| --all` | 將資源包複製到另一個實例 |
| `pack remove <pack>...` | 刪除已安裝的資源包 |
| `screenshot list` | 列出實例與玩家的截圖（由新到舊） |
| `screenshot remove <name\|path>... \| --all` | 刪除截圖 |
| `server list [<filter>]` | 列出已儲存的伺服器並檢查是否在線 |
| `player list` | 列出 GDK 實例的玩家設定檔 |
| `backup list [<instance>]` | 列出實例備份與世界備份（預覽功能） |
| `backup create [<instance>]` | 備份實例的遊戲資料與模組（預覽功能） |
| `backup restore [<instance>] <archive.zip>` | 還原實例備份（預覽功能） |

### 尋找可安裝的內容

| 指令 | 作用 |
| --- | --- |
| `installer search [<version>]` | 列出可安裝的 Minecraft 建置版本 |
| `installer download <version>` | 僅下載指定建置版本的安裝包，不安裝 |
| `installer list` | 列出已下載的安裝包（包含未完成的下載） |
| `installer remove <version\|file>...` | 刪除已下載的安裝包以釋放磁碟空間 |
| `installer mirrors <version>` | 測試指定 GDK 建置版本的下載鏡像速度 |
| `curseforge search [<words>]` | 在 CurseForge 上搜尋世界、附加元件、資源包與皮膚（名詞別名：`cf`） |
| `curseforge show <id>` | 顯示指定的 CurseForge 專案 |
| `curseforge categories` | 列出可用於篩選的 CurseForge 類別與分類 |
| `curseforge install <id>` | 下載 CurseForge 檔案並匯入至實例 |

### 這部電腦與啟動器

| 指令 | 作用 |
| --- | --- |
| `process list` | 列出執行中的 Minecraft 程序，包含非啟動器啟動的程序（別名：`ps`） |
| `process stop [<instance>\|<pid>...]` | 強制關閉執行中的 Minecraft（上次自動儲存後的進度將會遺失） |
| `account status` | 顯示已登入的 Microsoft 帳號及其擁有的版本 |
| `account login` | 登入或切換 Microsoft 帳號 |
| `account logout` | 讓啟動器忘記已登入的 Microsoft 帳號 |
| `config list` | 列出啟動器設定與資料夾 |
| `config get <key>` | 列印指定設定的值 |
| `config set <key> <value>` | 修改指定設定 |
| `config unset <key>` | 將指定設定還原為預設值 |
| `cache clean [packages\|downloads\|partial]...` | 清除快取以釋放磁碟空間 |
| `doctor [--fix [<fix>...]]` | 檢查這部電腦上 Minecraft 與模組所需的環境；加上 `--fix` 可修復問題（`vcruntime`、`gameinput`、`loader-migration`、`developer-mode`） |
| `self-update` | 將 LeviLauncher 更新至最新版本 |
| `version` | 列印版本資訊 |
| `help [<command>...]` | 顯示任意指令的說明與範例 |

所有 `list` 動詞皆可縮寫為 `ls`，所有 `remove` 動詞皆可縮寫為 `rm`。`config` 可讀寫的設定項目請參閱[全部設定](./settings#command-line-keys)。

### 版本與套件

- `install` 與 `installer` 的 `<version>` 對應 `installer search` 列出的建置版本：可填寫完整版本號（`1.21.50.07`）、以點分隔的前綴（`1.21.50` 代表最新的 `1.21.50.x`，`1.21.5` 則不會匹配）或 `latest`。`<file>` 為本機的 `.msixvc`、`.appx`、`.msix`、`.appxbundle` 或 `.msixbundle` 檔案。
- `mod install` 的 `<package>` 可為 `owner/repo`、`github.com/owner/repo` 或 URL，後面可加上 `#variant` 與 `@version`。

## 全域參數

以下參數適用於所有指令：

| 參數 | 含義 |
| --- | --- |
| `-i`、`--instance <name>` | 要操作的實例 |
| `-p`、`--player <id\|gamertag>` | 玩家檔案（GDK 實例） |
| `--json` | 將機器可讀的結果輸出到 stdout |
| `-q`、`--quiet` | 只列印識別碼，不顯示進度和提示 |
| `-v`、`--verbose` | 顯示更多細節，並將啟動器記錄輸出到 stderr |
| `-y`、`--yes` | 對所有確認提示回答「是」 |
| `--no-input` | 一律不提示輸入 |
| `-h`、`--help` | 顯示指令說明 |
| `--version` | 列印版本 |

**使用哪個實例：**依序採用 `-i`、環境變數 `LEVILAUNCHER_INSTANCE`、預設實例（`use`）或唯一的實例。**使用哪個玩家：**依序採用 `-p`、`LEVILAUNCHER_PLAYER`、唯一的檔案或已登入帳號的檔案。

## 輸出

- 結果輸出到 stdout；進度、提示和錯誤輸出到 stderr。錯誤訊息以 `error:` 開頭，並附帶 `hint:` 和錯誤代碼（例如 `[ERR_GAME_RUNNING]`）。
- `--json` 會輸出單一 JSON 文件：清單為陣列，其餘為物件；鍵名採用 camelCase，時間為 RFC 3339 格式，大小以位元組為單位。
- `-q` 只列印識別碼，每行一個。

## 結束代碼

| 代碼 | 含義 |
| --- | --- |
| 0 | 成功 |
| 1 | 失敗 |
| 2 | 用法錯誤 |
| 3 | 找不到 |
| 4 | 衝突（例如遊戲正在執行） |
| 5 | 登入或授權 |
| 6 | 網絡 |
| 7 | 部分完成 |
| 8 | 需要更改系統設定或管理員權限 |
| 9 | 逾時 |
| 10 | 已取消 |
| 130 | 被中斷（Ctrl-C） |

`launch --wait-exit` 會改為回傳遊戲本身的結束代碼。

## 視窗參數

以下參數會開啟視窗，而不會執行指令：

| 參數 | 作用 |
| --- | --- |
| `--launch=<instance>` | 開啟啟動器並啟動指定實例（桌面捷徑即使用此參數）。若啟動器已在執行，則直接在該啟動器中啟動實例。 |
| `--debug` | 同時在主控台視窗中顯示啟動器記錄（亦可寫作 `debug`、`-debug` 或 `/debug`）。 |
