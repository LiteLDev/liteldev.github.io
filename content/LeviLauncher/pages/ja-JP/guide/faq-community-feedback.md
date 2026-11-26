# FAQ、コミュニティ、フィードバック

## よくある質問

### Minecraft Bedrock の正規版が必要ですか？

はい。LeviLauncher は **Minecraft Bedrock Edition (GDK / UWP)** の**正規版**と連携するように設計されています。

### macOS や Linux でも使えますか？

LeviLauncher には **Windows 版**と **Android 版**（[Android 版ガイド](/ja-JP/guide/version-management?platform=android)）があります。macOS 版や Linux 版はありません。

### iOS 版はありますか？

ありません。iOS 版 LeviLauncher の開発予定もありません。

### Release と Preview、どちらを選ぶべきですか？

日常的なプレイでは、**正式版（Release）** を選んでください。**プレビュー版（Preview）** は、今後のコンテンツをいち早く体験したい場合や、不安定さを許容できる場合にのみ検討してください。

### 隔離（Isolation）は必須ですか？

必須ではありませんが、テスト環境、Minecraft **プレビュー版（Preview）** 環境、Mod 環境では強く推奨します。隔離は GDK バージョンと、1.19.70.2 以降の UWP x64 バージョンで利用できます。

### ランチャー内でワールドやリソースパックを管理できますか？

はい。LeviLauncher には、ワールド、リソースパック、ビヘイビアパック、スキンパック、スクリーンショット、サーバーリストなどのコンテンツを管理する画面が用意されています。

### Mod をインストールできますか？

はい。ただし、これは高度な操作にあたります。まずはクリーンな隔離バージョンを用意し、段階的にテストしていくことを推奨します。

### LeviLauncher をコマンドラインから使えますか？

はい、Windows 版で使えます。引数なしで `LeviLauncher.exe` を実行するとウィンドウが開きます。`install latest`、`play`、`instance list`、`mod install <Mod>` などのコマンドを指定すると、ターミナル上で処理を実行して終了します。すべてのコマンドは `LeviLauncher.exe help` で、各コマンドのオプションや使用例は `LeviLauncher.exe help <コマンド>` で確認できます。

### Android 版に必要なものは？

ARM64 デバイス上の Android 9.0 以降と、Google Play からインストールした Minecraft 統合版 1.21.80 以降が必要です。詳しくは[インストール](../install?platform=android)を参照してください。

### Android で複数の Minecraft バージョンを使えますか？

はい。公式の Minecraft APK をインポートすればランチャー内で別のバージョンを実行でき、バージョン分離機能でデータを個別に管理できます。

## コミュニティ

- **公式 Discord：** [discord.gg/v5R5P4vRZk](https://discord.gg/v5R5P4vRZk)
- **個人 Discord チャンネル：** [discord.gg/VqQaC8vWz8](https://discord.gg/VqQaC8vWz8)
- **QQ グループ：** [458083875](https://qm.qq.com/q/1z791rJgJG)

## 問題や機能要望の報告方法

以下の内容は [GitHub Issues](https://github.com/LiteLDev/LeviLauncher/issues) から報告してください。

- 再現可能なバグ
- LeviLauncher に関連する明確なインストール問題
- ドキュメントの分かりにくい箇所の改善提案
- 具体的な利用シーンが明確な機能リクエスト

Android 版の問題は [LiteLDev/LeviLauncher-Android Issues](https://github.com/LiteLDev/LeviLauncher-Android/issues) に報告してください。

## Issue を作成する前に確認すること

- 最新バージョンに更新する
- クリーンな隔離バージョンで比較テストを行う
- 追加した Mod やリソースパックを一時的に無効化する
- 問題が発生する正確な手順を記録する
