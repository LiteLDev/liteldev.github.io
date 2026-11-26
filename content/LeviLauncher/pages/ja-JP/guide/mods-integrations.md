# Mod と統合

LeviLauncher は、単なる「基本ランチャー」にとどまらない Mod 関連のワークフローをサポートしています。

## 現在利用可能な機能

=== "Windows"

    - Mod パッケージ（`.mcmod`）のインポート
    - `.zip` パッケージや単体の `.dll` Mod も引き続き使用可能：ファイル選択ダイアログで **すべてのファイル (\*.\*)** を選択
    - インストール済み Mod の有効化または無効化
    - 不要になった Mod の削除
    - CurseForge の閲覧とパッケージの取得
    - [lip](https://github.com/LiteLDev/lip) 互換の内蔵パッケージマネージャーによる LIP パッケージのインストール
    - LeviLamina などのローダーワークフローとの連携

    ::: warning これは高度な領域です
    Mod、ローダー、パッケージ統合の互換性は、特に Minecraft プレビュー版（Preview）で頻繁に変わります。高度な機能として扱い、段階的にテストしてください。
    :::

=== "Android"

    - ネイティブ Mod（`.so` ライブラリ）をゲームに読み込む
    - 分離したバージョンで Mod 環境を管理する

    ネイティブ Mod を作りたい場合は、LeviLamina ドキュメントの [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/)（英語）を参照してください。

## 推奨される Mod ワークフロー

1. クリーンな分離バージョンから始める。
2. Mod なしの状態でそのバージョンが正常に起動することを確認する。
3. Mod や変更は、一度に 1 つか少数ずつ追加する。
4. 変更のたびに起動を再テストする。
5. 大切なワールドは、いつでもバックアップを復元できる状態にしておく。

## CurseForge <Badge platform="windows" />

ランチャーから CurseForge を閲覧してパッケージを取得できるため、アプリ内で目的のリソースを簡単に見つけられます。

次のような場合に適しています：

- 案内付きの画面で Mod を探したい場合
- 特定プロジェクトの互換ファイルをすばやく確認したい場合
- ランチャーの外で検索する手間を省きたい場合

## lip と LeviLamina <Badge platform="windows" />

LeviLauncher には [lip](https://github.com/LiteLDev/lip) 互換のパッケージマネージャーが内蔵されているため、lip や .NET ランタイムを別途インストールする必要はありません。lip の仕様に準拠しており、各バージョンのパッケージは `.lip/state.json` に記録され、パッケージ定義は `lip.toml` から読み込まれます（`tooth.json` のみの古いパッケージも引き続き使用できます）。以前のランチャーで LeviLamina や LIP パッケージをインストールしたバージョン（`tooth_lock.json`）は、最初のパッケージ操作時に自動移行されます。**ミラーソースを使用** がオンのときは、GitHub からのパッケージのダウンロードに[設定](./settings-personalization)の **GitHub プロキシ** が使われます。オフのときは GitHub に直接接続します（システムプロキシが設定されていればそれを経由します）。以前に保存した GitHub プロキシや、lip の `config.toml`（`%APPDATA%\lip` 内。例: `lip config set github_proxy <URL>`）で設定した `github_proxy` はどちらの場合にも適用されます。ダウンロード済みのパッケージファイルは **キャッシュを削除** で削除できます。

lip v0.40 以降、`lip.toml` と `.lip/state.json` の各エントリは、実行環境を `side`（`server` または `client`）と `platform`（`win-x64` などの .NET ランタイム識別子）で表します。lip v0.39 以前では、これらはそれぞれ `platform` と `runtime` と呼ばれていました。lip v0.39 以前や旧バージョンのランチャーが古いキーで書き込んだ `.lip/state.json` は、次のパッケージ操作の前に自動変換され、`platform` が `side` に、`runtime` が `platform` に書き換えられます。それでも lip が読み取れないファイルは、必要な修正内容を示すメッセージとともに拒否されます。その場合は、`platform` を `side` に、`runtime` を `platform` に手動で書き換えるか、そのバージョンのパッケージを再インストールしてください。

これらの統合機能は、パッケージやローダーを中心としたワークフローを使う上級ユーザーに適しています。

ベストプラクティス：

- まずは安定した正式版（Release）から始める
- リスクの高い要素を一度に複数変更しない
- 「最後に正常に動作した」バージョンの組み合わせを記録しておく

クライアントのバージョンに LeviLamina を追加する方法は、LeviLamina ドキュメントの [Install client on Windows](https://levimc.org/LeviLamina/user_guides/install_on_client/)（英語）を参照してください。

### LeviMC Mods ページ

**LeviMC Mods** ページには、[levimc.org/mods](https://levimc.org/mods/) の Mod のうち、Windows x64 のクライアント向けビルド（`side = "client"` かつ `platform = "win-x64"` のエントリ）があるものが表示されます。名前、ID、作者、タグ、説明で検索できるほか、関連度、スター数、更新順、新着順での並べ替えに対応しています。また、ゲームバージョン、LeviLamina バージョン、タグ（ライブラリ / API や経済などの推奨タグが先頭に並び、特定タグの除外も可能）、ライセンス（寛容型などの分類または SPDX ID）、依存関係、作者（Mod ページの **… の他の Mod**）で絞り込めます。Mod をインストールする際は、`client` バリアント、なければ既定のバリアント、それもなければクライアント向けビルドを含む最初のバリアントが選ばれます。Mod ページでは、これらのバリアントを手動で切り替えることもできます。levimc.org の Mod ページにある **Install with LeviLauncher** ボタンは `levilauncher://install/<mod id>?version=<version>` 形式のリンクになっており、指定されたバージョンの Mod のインストールを LeviLauncher に渡します。

## ネイティブ Mod <Badge platform="android" />

ネイティブ Mod はゲームのプロセス内でネイティブコードを実行します。信頼できる配布元の Mod のみをインストールし、まずは分離したバージョンで試してください。

自作する場合は、LeviLamina ドキュメントの [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/)（英語）を参照してください。

## Mod 追加後にエラーが発生した場合

- 直前に追加した Mod をまず無効にする
- 正常に動作していた直前の状態と比較する
- これ以上テストを続ける前に、大切なワールドを移動またはバックアップする
- その後、[更新とトラブルシューティング](./update-troubleshooting) を参照する
