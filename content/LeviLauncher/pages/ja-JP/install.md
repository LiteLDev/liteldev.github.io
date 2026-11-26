# LeviLauncher のインストール

LeviLauncher には Windows 版と Android 版があり、macOS 版はベータ段階です。お使いのデバイスに合ったタブが自動で選ばれます。

## 必要なもの

=== "Windows"

    - Windows 10 または 11。
    - Microsoft Store で入手した正規ライセンスの Minecraft 統合版（GDK / UWP）。

=== "Android"

    - ARM64 デバイス上の Android 9.0 以降。
    - そのデバイスに Google Play から購入・インストールした Minecraft 統合版 1.21.80 以降。

=== "macOS"

    - Apple シリコン搭載 Mac 上の macOS 14.6 以降。
    - 正規ライセンスの Minecraft 統合版。LeviLauncher は Windows（GDK）版のゲームを Wine で実行します。

::: info iOS
LeviLauncher に iOS 版はなく、開発の予定もありません。
:::

## インストール

=== "Windows"

    1. [LeviLauncher の最新リリース](https://github.com/LiteLDev/LeviLauncher/releases/latest)を開き、`LeviLauncher-amd64-installer.exe` をダウンロードします。
    2. ファイルを実行し、セットアップウィザードを完了します。既定では `Program Files` にインストールされるため、管理者権限を求められます。WebView2 などのコンポーネントのインストールを求められたら、そのまま続行してください。

    リリースにはほかに 2 つのファイルもありますが、通常は不要です：

    | ファイル | 内容 |
    | --- | --- |
    | `LeviLauncher.exe` | ポータブル版：パスが英字のみの新しいフォルダーにこのファイルだけを置き、そこから実行します。 |
    | `LeviLauncher.zip` | ランチャーが自己更新時にダウンロードするパッケージ。 |

=== "Android"

    1. デバイスで [Android 版 LeviLauncher の最新リリース](https://github.com/LiteLDev/LeviLauncher-Android/releases/latest)を開き、名前が `-release.apk` で終わるファイルをダウンロードします。
    2. ダウンロードしたファイルを開きます。ブラウザーからのアプリのインストールが許可されていない旨が表示されたら、**設定**をタップして**この提供元のアプリを許可**をオンにし、元の画面に戻って**インストール**をタップします。

=== "macOS"

    macOS 版はベータ段階のため、最新の安定版ではなく **Pre-release** と表示されたリリースに含まれています。

    1. [LeviLauncher のリリース一覧](https://github.com/LiteLDev/LeviLauncher/releases)を開き、`LeviLauncher-macos-arm64-installer.dmg` を含む最新のリリースを探します。
    2. そのファイルをダウンロードして開き、**LeviLauncher** を**アプリケーション**にドラッグします。

    UWP インスタンスは Windows 専用です。

## 動作を確認する

LeviLauncher を起動します。ウィンドウが開き、初回は初期設定（Windows、macOS）またはライセンス契約（Android）が表示されます。

## 更新

=== "Windows"

    LeviLauncher は起動時に新しいバージョンを確認し、見つかればインストールを提案します。更新はその場で行われます。手動で確認するには、**設定**を開いて**更新を確認**を押すか、`LeviLauncher.exe self-update` を実行します。

=== "Android"

    LeviLauncher は新しいバージョンを見つけると通知し、APK をダウンロードして Android のインストーラーを起動します。ネットワークから GitHub に接続できない場合は、リリースページから新しい APK をダウンロードして上書きインストールしてください。

=== "macOS"

    LeviLauncher は起動時に新しいバージョンを確認し、見つかればインストールを提案します。

## ベータ版と過去のバージョン

すべてのバージョンとそのファイル、変更内容はリリースページで確認できます：

- Windows と macOS：[LiteLDev/LeviLauncher のリリース](https://github.com/LiteLDev/LeviLauncher/releases)
- Android：[LiteLDev/LeviLauncher-Android のリリース](https://github.com/LiteLDev/LeviLauncher-Android/releases)

**ベータ版**は、リリースページで **Pre-release** と表示されているものです（例：`v1.2.0-beta.1`）。次期バージョンの開発中の内容を含んでおり、不具合が起きることがあります。試すには、上記と同じ手順で該当リリースからファイルをダウンロードします。Windows では、インストール済みの LeviLauncher でベータ版を受け取ることも可能です。**設定**で**ベータ版アップデートを受信**をオンにすると、新しいベータ版が更新として提案されるようになります。安定版のままにするにはオフにします。

## 次のステップ

=== "Windows"

    - [Play with mods on Windows](https://levimc.org/tutorials/play/play-with-mods/)（英語）：インストールしたばかりの LeviLauncher で、Mod を入れて最初にプレイするまでの手順。
    - [バージョン管理](/ja-JP/guide/version-management?platform=windows)

=== "Android"

    - [Play with mods on Android](https://levimc.org/tutorials/play/play-with-mods-android/)（英語）：インストールしたばかりの LeviLauncher で、Mod を入れて最初にプレイするまでの手順。
    - [バージョン管理](/ja-JP/guide/version-management?platform=android)

=== "macOS"

    - [バージョン管理](/ja-JP/guide/version-management)
    - [更新とトラブルシューティング](/ja-JP/guide/update-troubleshooting)
