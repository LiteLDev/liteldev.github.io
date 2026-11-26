# 更新與故障排查

若 LeviLauncher 在安裝、更新或啟動時出現異常，請先參考本頁。

## 常見問題 <Badge platform="windows" />

### 啟動器顯示 Release 版本未獲授權

每個 Microsoft 帳戶最多只能在 10 台裝置上登入 Microsoft Store，而啟動器本身會被視為一台獨立裝置。  
請前往 [Microsoft Store 裝置管理](https://account.microsoft.com/devices/content)，移除其他不需要的裝置。

### Gaming Services 缺失或損壞

- 按照啟動器的引導安裝或修復該服務。
- 如有需要，請返回 Microsoft Store 檢查 Minecraft Bedrock 的安裝狀態。

### GameInput 缺失

- 按照 LeviLauncher 的提示安裝所需的 Redistributable 組件。
- 安裝完成後，視需要重新開啟啟動器。

### 安裝路徑不可寫入

- 前往 **設定 → 基礎設定**，將託管內容路徑改為可寫入的位置。
- 若啟動器在安裝或自我更新時要求提升權限，請先確認來源可信，再允許執行。

### LeviLauncher 一閃即退或從不顯示視窗

- 若啟動器在顯示介面之前就退出，請先檢查 `%LOCALAPPDATA%\LeviLauncher\Logs\startup.log`。
- 啟動失敗後可先重試一次；若問題依舊，請在提交 GitHub Issue 時附上 `startup.log`。

### 某個版本無法啟動

- 先測試該版本在無模組的情況下能否啟動
- 檢查所需的 Windows 組件是否仍然存在
- 確認該版本已完整安裝
- 嘗試建立乾淨的隔離測試環境以復現問題

### 下載很慢或反覆失敗

- 切換鏡像
- 稍後重試
- 如有條件，改用本地包來源

## Android 上的常見問題 <Badge platform="android" />

### 找不到 Minecraft 或版本不受支援

請從 Google Play 安裝或更新官方 Minecraft（1.21.80 或更高版本），然後重新打開 LeviLauncher。

### 匯入版本無法啟動

匯入的版本通常需要開啟版本隔離。請在實例設定中啟用後再試。

### 啟動失敗

請在失敗頁面打開啟動日誌，先查看報告的原因，再調整設定。

### 資料遷移

啟動器可能需要先遷移舊的資料目錄。在遷移完成並確認世界、資源包及設定均可正常使用前，請勿刪除舊目錄。

## 更安全的恢復步驟

1. 先備份重要世界。
2. 移除最近新增的模組或資源包。
3. 使用乾淨的隔離版本進行對照測試。
4. 必要時重新安裝受影響的版本。

## 關於自我更新 <Badge platform="windows" />

LeviLauncher 可以檢查、下載並安裝應用程式更新。在某些環境下，若安裝目錄不可寫入，更新時可能需要管理員權限。

## 什麼時候應該提交 Issue

若符合以下條件，建議前往 GitHub 提交問題：

- 問題可以穩定復現
- 執行基礎恢復步驟後問題仍然存在
- 問題看起來源於 LeviLauncher 本身，而非一般的 Windows 環境問題

提交時請盡量附上：

- Windows 版本
- LeviLauncher 版本
- 具體的操作步驟
- 截圖或日誌（如有）

問題反饋入口：[GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues)

回報 Android 版問題時，請附上 Android 版本、裝置型號及啟動日誌，並提交至 [LiteLDev/LeviLauncher-Android](https://github.com/LiteLDev/LeviLauncher-Android/issues)。
