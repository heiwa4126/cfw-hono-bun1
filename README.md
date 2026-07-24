# cfw-hono-bun1

Hono と bun で Cloudflare Workers を書くテスト

```sh
# インストール
bun i
bun audit

# 開発
bun run dev
bun run cf-typegen # wrangler.jsoncを編集したら実行
bun test

# ログイン
bun run login
## または
bun run login-no-browser

# デプロイ
bun run deploy

# 消す
bun run delete
```

## これは何のために作ったか、というと

レート制限ルール(rate limit) の実験のため。

- Cloudflare Worker の「ドメイン」から「カスタムドメインとルーティングする」で、固定の FQDN で Worker を呼べるようにできる
  - **仮に** `iroiro.jp` というドメインを Cloudflare に登録済みで、この workers を　`api.iroiro.jp` で公開したとする
- Cloudflare はドメインごとにセキュリティルールでレート制限ルールを設定できる(free tier だと 1 個)。**仮に**以下のように設定したとする。
  - ルール: `(http.host eq "api.iroiro.jp" and http.request.uri.path eq "/hello" and http.request.method eq "GET")`
  - レートが次の値を超えた場合...: リクエスト 2 期間 10 秒
  - アクション: ブロック
  - 期間: 10 秒
  - 実行順序: 最初
  - ステータス: アクティブ

テスト手順は

1. `.env.example` を参考に `.env` を書く
2. 以下を実行

   ```sh
   # 12秒ごとにアクセスして動く
   bun run rate-limit-test-success

   # ものすごい速度でアクセスして3回目から失敗する
   bun run rate-limit-test-error
   ```

「リクエスト: 2 期間 10 秒」と「期間: 10 秒」のとこは
今ハードコーディングされてるので
ごめんなさい。

テストが終わったら、Cloudflare のレート制限のところに「イベント」として「ブロック」が出てるはずなので確認する。
