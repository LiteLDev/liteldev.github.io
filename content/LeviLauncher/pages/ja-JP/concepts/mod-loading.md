# Mod の読み込み

Minecraft Bedrock 自体には Mod の仕組みがありません。Mod はネイティブコードであり、ゲームの起動時にローダーによってゲームのプロセスへ読み込まれます。このページでは、LeviLauncher が使うローダー、Mod の配置場所、および Mod を追加する各方法の関係を説明します。

## Mod の置き場所 <Badge platform="windows" />

どのインスタンスにも `mods\` フォルダーがあります（[フォルダーとファイル](../reference/files)を参照）。各 Mod はその中の 1 つのフォルダーとして配置され、Mod の情報を記した `manifest.json` を含みます。

| フィールド | 意味 |
| --- | --- |
| `name` | Mod の名前。 |
| `entry` | ローダーが読み込むファイル。Mod のフォルダーからの相対パス（`.dll`）。 |
| `version` | Mod のバージョン。 |
| `type` | どのローダーが読み込むか。`preload-native` は LeviLauncher のネイティブローダー用で、LeviLamina 用の Mod には独自の種類があります。 |
| `author` | 作者（省略可）。 |

Mod は 1 つのインスタンスに属します。[隔離](./isolation)はゲームデータのみを対象とするため、Mod には影響しません。

**Mod管理** または `LeviLauncher.exe mod disable` で **Mod をオフにする** と、`manifest.json` の名前が `manifest.json.close` に変更され、オンにすると元に戻ります。Mod のファイル自体はそのまま残りますが、`manifest.json` を探すローダーからは認識されなくなります。

## 2 つのローダー <Badge platform="windows" />

### LeviLauncher のネイティブローダー

インスタンスのインストール時または準備時に、LeviLauncher は自身のローダー `LeviLauncher.dll` をゲームの実行ファイルと同じ場所に配置し、実行ファイルのインポートに追加します。これにより、Windows がゲームと一緒にローダーを読み込むようになります。これは x64 ビルドで、GDK でも UWP でも同じように動作します。[隔離](./isolation)もこの仕組みを利用しています。

ゲームが起動すると、ネイティブローダーは `mods\` 内のフォルダーを名前順に調べ、`type` が `preload-native` である各 Mod の `entry` を読み込みます。`manifest.json` のないフォルダーや、ほかの種類の Mod はスキップします。インスタンスに別のプリローダー（ゲームの実行ファイルと同じ場所にある `preloader.dll`）が存在する場合、ネイティブローダーは Mod の読み込みをすべてそちらに委ねます。ネイティブローダーの動作には Visual C++ ランタイム（x64）が必要です。LeviLauncher はその有無を確認し、インストールを提案します。

### LeviLamina

[LeviLamina](https://levimc.org/LeviLamina/) は LeviMC の Mod ローダーです。[LeviMC Mods](https://levimc.org/mods/) で公開されている Mod の多くは LeviLamina 用であり、インスタンスのゲームバージョンに対応したバージョンの LeviLamina が必要です。LeviLauncher は、対応バージョンの GDK インスタンスに対し、内蔵パッケージマネージャーを使って LeviLamina をパッケージとしてインストールします（バージョンのインストール時の **LeviLamina をインストール** スイッチ、または **インスタンス設定** の **ローダー** タブ）。

## Mod を追加する 3 つの方法 <Badge platform="windows" />

| 追加するもの | LeviLauncher の動作 |
| --- | --- |
| **LeviMC Mods** の Mod（または `mod install owner/repo`） | [lip](https://github.com/LiteLDev/lip) 互換の内蔵パッケージマネージャーを使い、パッケージとしてインストールします。対象プラットフォーム向けのリリースをダウンロードして依存パッケージをインストールし、インスタンスの `.lip\state.json` に記録します。Mod が LeviLamina を必要としており、未インストールまたはインストール済みのものが合わない場合は、互換性のある LeviLamina を先にインストールします。この方法で追加した Mod は、パッケージとして更新・削除できます。 |
| `.mcmod` パッケージ（または `.zip`） | `mods\` 内の新しいフォルダーに展開します。アーカイブには `manifest.json` が含まれている必要があります。 |
| 単体の `.dll` | `mods\` 内の新しいフォルダーに配置し、`manifest.json` を生成します。既定では、名前にファイル名、種類に `preload-native`、バージョンに `0.0.0` が設定されます。 |

パッケージは、`lip.toml` と `.lip\state.json` 内の `side`（`client` または `server`）および `platform`（`win-x64` など）で動作環境を指定します。クライアントには、LeviLauncher は Mod に `client` バリアントがあればそれをインストールし、なければ既定のバリアントをインストールします。古いパッケージの移行など、詳細は[Mod と統合](../guide/mods-integrations)を参照してください。

## Android <Badge platform="android" />

Android 版はネイティブ Mod、つまりゲームのプロセス内で動作する `.so` ライブラリを読み込みます。Mod を導入した環境は隔離したバージョンにまとめ、信頼できる入手元の Mod のみをインストールしてください。自作する場合は、LeviLamina のドキュメントの [Android native mods](https://levimc.org/LeviLamina/developer_guides/android/) に従ってください。

## 関連ページ

- [Mod と統合](../guide/mods-integrations)
- [インスタンスとゲームバージョン](./instances)
- [コマンドライン](../reference/command-line)
