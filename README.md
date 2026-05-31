# TekipakiPC 全自動Unityゲーム開発システム

本システムは、仕様書（`siyo.pdf`）からAIが自律的にゲームを構成、アセット収集、スクリプト作成、ビルドまでを完結させるシステムです。

## 使用AIモデル
- **モデル**: Qwen2.5-1.5B-Instruct (via @mlc-ai/web-llm)
- **メモリ使用量**: 推論時 約1.5GB Memory 使用。CPU-onlyモードで動作します。

## セットアップ手順

### 1. Android署名鍵の準備
Androidビルドを行うには、以下の手順でSecretsを設定してください。

1. GitHub Actionsの `Generate Android Keystore (Cloud)` ワークフローを手動実行します。
2. ログから出力されたBase64文字列をコピーします。
3. リポジトリの `Settings > Secrets and variables > Actions` に以下の3つのSecretを登録します：
   - `ANDROID_KEYSTORE_BASE64`: コピーした文字列
   - `ANDROID_KEYSTORE_PASS`: `tekipaki2026gameesslend012KmaidjA`
   - `ANDROID_KEYALIAS_PASS`: `tekipaki2026gameesslend012KmaidjA`

### 2. Unityライセンスの設定
本システムでは、ビルドの都度ログイン・返却を行う「動的アクティベーション」を採用しています。`.ulf` ファイルの用意は不要です。

#### 設定手順:
リポジトリの `Settings > Secrets and variables > Actions` に以下の2つのSecretを登録してください：
- `UNITY_EMAIL`: Unityアカウントのメールアドレス
- `UNITY_PASSWORD`: Unityアカウントのパスワード

**注意**: ビルド完了時（または失敗時）にライセンスは自動的に返却されますが、万が一ライセンスの同時使用上限に達してビルドが失敗した場合は、Unityのマイページからアクティブなライセンスを手動で解除してください。

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
