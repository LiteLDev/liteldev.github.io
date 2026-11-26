---
platforms: [windows]
---
# フォルダーとファイル

Windows 版 LeviLauncher（1.1.0 時点）が読み書きするすべてのファイルとフォルダーを説明します。ランチャーはシステムの一時フォルダー（`%TEMP%`）には何も書き込みません。

## 概要

| フォルダー | 場所 | 内容 |
| --- | --- | --- |
| 設定フォルダー | `%APPDATA%\LeviLauncher\` | `config.json` のみ。サイズは小さく、Windows プロファイルと一緒にローミングされる |
| ローカルフォルダー | `%LOCALAPPDATA%\LeviLauncher\` | ログ、Microsoft アカウント、ウィンドウの WebView2 データ。既定のデータルートでもある |
| データルート | 別の場所を指定しない限りローカルフォルダー（**設定 → 基本設定** の **基本ルート**、または `config set data-root`） | `Instances\`、`Backups\`、`Cache\` |

```text
%APPDATA%\LeviLauncher\
  config.json                      ランチャーの設定
%LOCALAPPDATA%\LeviLauncher\        既定のデータルート
  Logs\startup.log                 ランチャーのログと、それ以前の startup.1.log … startup.4.log
  Accounts\                        Microsoft アカウントとデバイスの記録。現在の Windows ユーザー用に暗号化
  WebView2\                        ランチャーのウィンドウのデータ
  storage-migration.json           旧レイアウトからの移行記録（後述）
<データルート>\
  Instances\<インスタンス>\         1 つのインスタンス（後述）
  Backups\
    Worlds\<インスタンス>\<フォルダー>_<ワールド>\<ワールド>_<yyyyMMdd-HHmmss>.mcworld
    Instances\<インスタンス>\<インスタンス>_<yyyyMMdd-HHmmss>.zip
  Cache\
    Installers\                    ゲームのインストーラー、Visual C++ と WebView2 のインストーラー
    Updates\                       ランチャーの更新。インストール後に削除
    Downloads\                     インポート用にダウンロードしたファイル。1 日経つと起動時に削除
    Imports\                       インポートに渡されたファイル。1 日経つと起動時に削除
    gdk-pending-versions.json
    gamertags.json                 ランチャーが見たプレイヤープロファイルのゲーマータグ
```

`Cache\` の中身はすべて、データを失うことなく削除できます。`LeviLauncher.exe cache clean` はパッケージキャッシュ、インポート用にダウンロードしたファイル、未完了のダウンロードを削除し、`LeviLauncher.exe installer remove` はダウンロード済みのゲームインストーラーを削除します。データルートを変更しても参照先のフォルダーが変わるだけで、既存のインスタンス、ダウンロード、バックアップは移動しません。

## インスタンスのフォルダー

```text
Instances\<インスタンス>\
  Minecraft.Windows.exe …          ビルドのゲームファイル
  LeviLauncher.dll                 LeviLauncher のネイティブローダー（x64 ビルド）
  .levilauncher\                   インスタンス内のランチャーの状態（隠しフォルダー）
    instance.json                  名前、ゲームバージョン、チャンネル、隔離、起動オプション
    icon.ico                       ゲームの LargeLogo.png から作ったインスタンスのアイコン
    xbox-auth-key-v1               Xbox サインイン用の UWP インスタンスの目印
  .lip\                            インスタンスにインストールしたパッケージの状態（lip の形式）
  mods\                            Mod（「Mod の読み込み」を参照）
  Minecraft Bedrock\               隔離が有効なときのゲームデータ（プレビュー版: Minecraft Bedrock Preview）
```

隔離の有無によるインスタンスのゲームデータフォルダーについては[インスタンスの隔離](../concepts/isolation)を、`mods\` については[Mod の読み込み](../concepts/mod-loading)を参照してください。

## LeviLauncher のフォルダー以外

| パス | 内容 |
| --- | --- |
| デスクトップの `Minecraft - <インスタンス>.lnk` | インスタンスのデスクトップショートカット（**デスクトップにショートカットを作成**、または `instance shortcut`）。`--launch=<インスタンス>` を付けてランチャーを開きます。個人のデスクトップにのみ書き込まれ、パブリックデスクトップには書き込まれません。 |
| `%APPDATA%\lip\` | lip の設定ファイル `config.toml`。たとえば `github_proxy` の設定は内蔵パッケージマネージャーも読み込みます。 |
| `%LOCALAPPDATA%\lip\Cache\` | 内蔵パッケージマネージャーのパッケージキャッシュ（lip と共通）。**設定 → パッケージ管理** の **キャッシュを削除** で空にできます。 |
| `%APPDATA%\Minecraft Bedrock\`、`%APPDATA%\Minecraft Bedrock Preview\` | 隔離していない GDK インスタンスの共有ゲームデータ。 |
| `%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\`（プレビュー版: `Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe`） | 隔離していない UWP インスタンスの共有ゲームデータ。 |

## ファイルの書き込み方

- ファイルは保存先と同じ場所に一旦 `<名前>.<ランダム文字列>.tmp` として書き込まれ、完了後に本来の名前に変更されます。そのため、書きかけのファイルが見えることはありません。再開可能な未完了のダウンロードは `<名前>.partial.tmp` として保存されます。
- ユーザーが付けた名前（インスタンスやワールド）は Windows の命名規則に合わせて整形されます。`<>:"/\|?*` の文字および末尾のピリオドや空白は取り除かれ、`CON` や `NUL` などの予約名は避けられます。
- ランチャーが生成するファイルの名前は `<名前>_<yyyyMMdd-HHmmss>.<拡張子>` の形式になります（例: `MyWorld_20261107-142301.mcworld`）。

## 旧レイアウト

1.1.0 より前の LeviLauncher は、すべてのデータを `%APPDATA%\<プログラム名>\`（例: `%APPDATA%\levilauncher.exe\`）に保存していました。この中に `versions\`、`backups\`、`installers\`、`updates\`、`logs\` フォルダーと、`config.json`、`user_gamertag_map.json`、`gdk_pending_versions.json` ファイルがあり、各インスタンスには `version.json` と `LargeLogo.ico` がありました。

LeviLauncher 1.1.0 以降は初回起動時に、これらのデータを上記の新しいレイアウトへ一度だけ移行します（元のデータは削除しません）。同じドライブ内のデータは名前を変更して移動し、別ドライブのデータは元のファイルを残したままコピーし、古い `config.json` は `config.migrated.json` に名前を変更します。独自に指定したデータルートはそのままの場所に残ります。インスタンスからゲームを実行中であるなど、移行できないデータがある場合は、すべての処理が元に戻され、次回の起動まで旧レイアウトのまま動作します。何をどこへ移したかは `storage-migration.json` に記録され、最後にデスクトップショートカットのリンク先が新しい場所へ更新されます。
