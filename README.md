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
