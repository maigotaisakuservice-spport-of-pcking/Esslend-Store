# TekipakiPC 全自動Unityゲーム開発システム

本システムは、仕様書（`siyo.pdf`）からAIが自律的にゲームを構成、アセット収集、スクリプト作成、ビルドまでを完結させるシステムです。

## 使用AIモデル
- **モデル**: Qwen2.5-1.5B-Instruct (via @mlc-ai/web-llm)
- **メモリ使用量**: 推論時 約1.5GB VRAM/Memory 使用。軽量ながら指示追従性に優れています。

## セットアップ手順

### 1. Android署名鍵の準備
Androidビルドを行うには、以下の手順でSecretsを設定してください。

1. GitHub Actionsの `Generate Android Keystore (Cloud)` ワークフローを手動実行します。
2. ログから出力されたBase64文字列をコピーします。
3. リポジトリの `Settings > Secrets and variables > Actions` に以下の3つのSecretを登録します：
   - `ANDROID_KEYSTORE_BASE64`: コピーした文字列
   - `ANDROID_KEYSTORE_PASS`: `tekipaki2026gameesslend012KmaidjA`
   - `ANDROID_KEYALIAS_PASS`: `tekipaki2026gameesslend012KmaidjA`

### 2. Unityライセンスの設定（UNITY_LICENSE）
GitHub Actions上でUnityをビルドするには、Unityのライセンス情報を `UNITY_LICENSE` としてSecretに登録する必要があります。

#### 取得手順 (Personalライセンスの場合):
1. **ALFファイルの生成**: GitHub Actionsの `Unity Activation (Generate ALF)` ワークフローを手動実行します。実行完了後、Artifactsから `.alf` ファイルをダウンロードします。
2. **手動アクティベーション**: [Unity Manual Activation](https://license.unity3d.com/manual) サイトにアクセスし、生成した `.alf` ファイルをアップロードします。
3. **ULFファイルの取得**: サイトから `.ulf` ファイル（ライセンスファイル）をダウンロードします。
4. **Secretへの登録**: ダウンロードした `.ulf` ファイルの内容をすべてコピーし、GitHubリポジトリの `Settings > Secrets and variables > Actions` に `UNITY_LICENSE` という名前で保存してください。

詳細な手順は [Game-CI Documentation (Activation)](https://game.ci/docs/github/activation) を参照してください。

## 使い方

### 初回開発
`main` ブランチにプッシュするか、`Autonomous Build` ワークフローを手動実行します。`siyo.pdf` に基づいてゲームが生成されます。

### アップデート
1. `update.pdf` をルートディレクトリに配置します。
2. `Autonomous Build` ワークフローを手動実行します。
3. 実行時の入力項目で：
   - `Game Version`: 新しいバージョン番号を入力（例: `1.1.0`）
   - `Update from update.pdf?`: チェックを入れます。

## プロジェクト構造
- `agent/`: AIエージェントのロジック（Node.js）
- `UnityProject/`: 生成されたUnityプロジェクトのベース
- `siyo.pdf`: ゲームの基本仕様書
- `update.pdf`: アップデート指示書（任意）

## ライセンス
Copyright (C) 2026 TekipakiPC. All Rights Reserved.
アセットのクレジットは `UnityProject/Assets/Resources/assets_credits.json` に自動生成されます。
