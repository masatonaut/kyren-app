# Phrasely Stripe セットアップ完全ガイド

> **対象読者**: 初めて Stripe を触る人でも 100% 再現可能な手順書
> **所要時間**: 15〜20分（Stripe アカウント既存の場合）/ 30〜40分（新規作成の場合）
> **最終更新**: 2026-04-28

---

## 🎯 ゴール（このガイドが終わったときの状態）

`https://phrasely.kyren.app` で:
1. ✅ ユーザーが「Get Pro」ボタンを押す
2. ✅ Stripe Checkout 画面に遷移
3. ✅ テストカード `4242 4242 4242 4242` で決済成功
4. ✅ サイトに戻ると Header に **「Pro」** バッジ表示
5. ✅ Supabase の `subscribers` テーブルに該当行が `status=active` で存在
6. ✅ Rewrite が日次制限なし・2000文字まで使える

---

## 📋 事前準備（このガイドを始める前に確認）

| 項目 | 確認方法 |
|------|---------|
| ターミナルが開ける | Spotlight → Terminal |
| Node.js v20 が使える | `source ~/.nvm/nvm.sh && nvm use 20 && node -v` → `v20.x.x` |
| Vercel CLI ログイン済み | `vercel whoami` → ユーザー名表示 |
| 作業ディレクトリ | `/Users/_jadmin/Code/projects/kyren-app/phrasely` |
| `.env.local` が存在 | `ls -la .env.local` → ファイルあり |

**問題があれば先にこれらを解決してください。**

---

## STEP 0: 作業ディレクトリへ移動

```bash
cd /Users/_jadmin/Code/projects/kyren-app/phrasely
source ~/.nvm/nvm.sh && nvm use 20
```

**確認:**
```bash
pwd
# 期待値: /Users/_jadmin/Code/projects/kyren-app/phrasely

node -v
# 期待値: v20.x.x
```

---

## STEP 1: Stripe アカウント準備

### A. アカウント作成（既にある場合は B へ）

1. https://dashboard.stripe.com/register を開く
2. メールアドレス・パスワード・氏名・国（Japan）を入力
3. 認証メールのリンクをクリック
4. ダッシュボードに到達

### B. テストモード有効化

1. Stripe Dashboard を開く
2. **左上のトグルが「テスト環境」になっていることを確認**
   - 緑色の「Test mode」バッジが見える状態が正解
   - もし「Live mode」なら、トグルをクリックして切り替える

⚠️ **このガイドは全てテスト環境で進めます。本番化は最後のセクションで実行。**

---

## STEP 2: Product と Price を作成

### 2-1. Product 作成

1. 左サイドバー → **「Product catalog」** をクリック
2. 右上の **「+ Create product」** をクリック
3. 以下を入力:

| 項目 | 値 |
|------|-----|
| Name | `Phrasely Pro` |
| Description | `Unlimited English rewrites with AI-powered learning` |
| Image | （任意、後で追加可） |

### 2-2. Price 作成（同じ画面で）

スクロールして「Pricing」セクション:

| 項目 | 値 |
|------|-----|
| Pricing model | **Recurring** |
| Amount | `4.99` |
| Currency | **USD** |
| Billing period | **Monthly** |

「**Add product**」をクリック。

### 2-3. Price ID を取得

作成後、Product 詳細画面が表示される。

1. 「Pricing」セクションの行をクリック
2. URL が `https://dashboard.stripe.com/test/prices/price_xxxxxxxxxxxxx` に変わる
3. **`price_xxxxxxxxxxxxx` 部分をコピー**

例: `price_1QaBcDeFgHiJkLmNoPqRsT`

### 📝 一時メモ
ターミナルで以下を実行して、後で参照しやすくする:

```bash
echo "STRIPE_PRICE_ID=price_xxxxxxxxxxxxx" > /tmp/stripe-keys-temp.txt
# ↑ 実際の Price ID に置き換えて実行
```

---

## STEP 3: API キー取得

1. 左サイドバー → **「Developers」** → **「API keys」**
2. **「Publishable key」** の `pk_test_...` を **「Reveal」** クリック → コピー
3. **「Secret key」** の `sk_test_...` を **「Reveal」** クリック → コピー

### 📝 一時メモに追記
```bash
cat >> /tmp/stripe-keys-temp.txt <<'EOF'
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
EOF
# ↑ 実際の値に置き換えて実行
```

---

## STEP 4: Webhook 登録

1. 左サイドバー → **「Developers」** → **「Webhooks」**
2. 右上の **「+ Add endpoint」** をクリック
3. 以下を入力:

| 項目 | 値 |
|------|-----|
| Endpoint URL | `https://phrasely.kyren.app/api/stripe/webhook` |
| Description | `Phrasely production webhook` |

4. 「Select events」をクリック → 以下3つにチェック:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`

5. 下部の **「Add endpoint」** をクリック

### 4-1. 署名シークレット取得

作成後の Webhook 詳細画面:

1. 「Signing secret」セクションの **「Reveal」** をクリック
2. `whsec_xxxxxxxxx...` をコピー

### 📝 一時メモに追記
```bash
cat >> /tmp/stripe-keys-temp.txt <<'EOF'
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
EOF
# ↑ 実際の値に置き換えて実行
```

---

## STEP 5: ローカル `.env.local` 更新

### 5-1. 現状確認

```bash
cd /Users/_jadmin/Code/projects/kyren-app/phrasely
grep "^STRIPE" .env.local
```

**期待される現状（プレースホルダー）:**
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 5-2. エディタで編集

```bash
open -a "Visual Studio Code" .env.local
# または: vim .env.local / nano .env.local
```

### 5-3. 以下4行を本物の値に置き換える

`.env.local` の Stripe 関連3行を更新し、**新しい行 `STRIPE_PRICE_ID` を追加**:

```bash
# Anthropic
ANTHROPIC_API_KEY=（既存のまま、変更しない）

# Supabase
NEXT_PUBLIC_SUPABASE_URL=（既存のまま）
NEXT_PUBLIC_SUPABASE_ANON_KEY=（既存のまま）

# Stripe (テスト環境)
STRIPE_SECRET_KEY=sk_test_実際のシークレットキー
STRIPE_WEBHOOK_SECRET=whsec_実際のシークレット
STRIPE_PRICE_ID=price_実際のPrice_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_実際の公開キー
```

⚠️ **重要**: `STRIPE_PRICE_ID` は新規追加項目（既存の `.env.local` に存在しない可能性大）

### 5-4. 確認

```bash
grep "^STRIPE\|^NEXT_PUBLIC_STRIPE" .env.local | sed 's/=.\{20\}.*/=...REDACTED.../'
```

**期待される出力（4行）:**
```
STRIPE_SECRET_KEY=...REDACTED...
STRIPE_WEBHOOK_SECRET=...REDACTED...
STRIPE_PRICE_ID=...REDACTED...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...REDACTED...
```

---

## STEP 6: Vercel 環境変数追加

### 6-1. 既存の Stripe 環境変数を確認

```bash
vercel env ls | grep -i stripe
```

何も出ない（=未設定）か、既存値があれば削除:

```bash
# 既存があれば削除（プロンプトは y で答える）
vercel env rm STRIPE_SECRET_KEY production --yes 2>/dev/null
vercel env rm STRIPE_WEBHOOK_SECRET production --yes 2>/dev/null
vercel env rm STRIPE_PRICE_ID production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes 2>/dev/null
```

### 6-2. 4つの環境変数を追加

⚠️ 各コマンド実行後、**プロンプトに値を貼り付けて Enter**。改行を入れないこと。

```bash
# 1/4: Secret Key
vercel env add STRIPE_SECRET_KEY production
# プロンプト: ? What's the value of STRIPE_SECRET_KEY?
# → sk_test_xxxxx を貼り付け → Enter

# 2/4: Webhook Secret
vercel env add STRIPE_WEBHOOK_SECRET production
# → whsec_xxxxx を貼り付け → Enter

# 3/4: Price ID
vercel env add STRIPE_PRICE_ID production
# → price_xxxxx を貼り付け → Enter

# 4/4: Publishable Key
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# → pk_test_xxxxx を貼り付け → Enter
```

### 6-3. 確認

```bash
vercel env ls | grep STRIPE
```

**期待される出力（4行、Production 含む）:**
```
STRIPE_SECRET_KEY                  Encrypted    Production    just now
STRIPE_WEBHOOK_SECRET              Encrypted    Production    just now
STRIPE_PRICE_ID                    Encrypted    Production    just now
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  Encrypted   Production    just now
```

---

## STEP 7: 再デプロイ

```bash
cd /Users/_jadmin/Code/projects/kyren-app/phrasely
vercel --prod
```

**期待される最終行:**
```
✓ Production: https://phrasely-xxxxxx.vercel.app
✓ Aliased: https://phrasely.kyren.app
```

エラーが出た場合 → トラブルシューティングセクションへ。

---

## STEP 8: 一時メモ削除（セキュリティ）

```bash
rm /tmp/stripe-keys-temp.txt
```

---

## STEP 9: テスト決済（最重要検証）

### 9-1. ブラウザで開く

https://phrasely.kyren.app をブラウザで開く（**シークレットウィンドウ推奨**）

### 9-2. 「Get Pro」ボタンを押す

1. ページ下部までスクロール
2. **Pro カード**の **「Get Pro」** をクリック
3. ブラウザのプロンプトが出る:
   - 「Enter your email for Pro upgrade:」
   - **実在するメールアドレス**を入力（例: `自分@gmail.com`）
   - OK をクリック

### 9-3. Stripe Checkout 画面で決済

Stripe ホスティングの Checkout ページに遷移。以下を入力:

| 項目 | 値 |
|------|-----|
| カード番号 | `4242 4242 4242 4242` |
| 有効期限 | `12 / 34`（未来の日付） |
| CVC | `123` |
| カード保有者名 | `Test User` |
| 国 | Japan |
| 郵便番号 | `100-0001` |

**「Subscribe」** または **「Pay $4.99」** をクリック。

### 9-4. 戻り画面確認

数秒後、`https://phrasely.kyren.app/?success=true&email=...` にリダイレクト。

**確認すべき表示:**
- ✅ Header に **「Pro」** バッジ（オレンジ系のピル）
- ✅ Pricing カードに **「Active」** バッジ
- ✅ 「Get Pro」ボタンが消える
- ✅ Rewrite 欄下の表示が「Pro — Unlimited rewrites」に変わる

### 9-5. Supabase で記録確認

1. https://supabase.com/dashboard を開く
2. プロジェクト `kaymyaizwjmthbwnxzli` を選択
3. 左サイドバー → **「Table Editor」** → **`subscribers`** テーブル
4. 該当行が存在することを確認:

| カラム | 期待値 |
|--------|--------|
| `email` | テストで使ったメール |
| `stripe_customer_id` | `cus_xxx` |
| `stripe_subscription_id` | `sub_xxx` |
| `status` | `active` |
| `plan` | `pro` |
| `current_period_end` | 1ヶ月後の日時 |

### 9-6. Webhook 配信ログ確認

1. Stripe Dashboard → **Developers** → **Webhooks**
2. 作成した Endpoint をクリック
3. 下部の「Events」セクションで `checkout.session.completed` イベント
4. **HTTP Status: 200** であれば成功 ✅

---

## ❌ トラブルシューティング

### Q1: 「Get Pro」を押しても何も起きない

**原因**: ブラウザコンソールにエラー

```bash
# ブラウザで F12 → Console タブを開いた状態で「Get Pro」を再クリック
# 表示されるエラーで原因切り分け
```

**よくあるエラー**:
- `STRIPE_PRICE_ID is not set` → Vercel 環境変数を再確認（STEP 6-3）
- `Pricing not configured` → 同上
- `Failed to fetch` → ネットワーク or CORS、再デプロイ（STEP 7）

### Q2: Stripe Checkout に遷移するが決済後 Pro バッジが出ない

**原因**: Webhook が動いていない

1. Stripe Dashboard → Webhooks → エンドポイント
2. 「Recent deliveries」タブで直近の配信を確認
3. ステータスが 200 以外の場合:
   - **400** → `STRIPE_WEBHOOK_SECRET` が違う → STEP 4-1 をやり直し
   - **404** → URL が違う → `https://phrasely.kyren.app/api/stripe/webhook` か確認
   - **500** → サーバーログ確認: `vercel logs --follow`

### Q3: Supabase に行が作成されない

**原因**: Webhook はOKだが DB 書き込みでエラー

```bash
vercel logs --follow
# 別ターミナルで再度テスト決済
# ログにエラーが出ないか確認
```

`subscribers` テーブルが存在しない場合:
- Supabase Dashboard → SQL Editor で `supabase/migrations/003_subscribers.sql` の内容を実行

### Q4: テストカード `4242` で「Card declined」になる

**原因**: ライブモードを誤って有効化している

1. Stripe Dashboard 左上のトグル → **「Test mode」** に戻す
2. STEP 2-4 をテスト環境でやり直し
3. テストキー（`sk_test_`, `pk_test_`）を `.env.local` と Vercel に再設定

---

## 🚀 本番モード移行（テスト成功後）

### Phase 1: Stripe ライブモード有効化

1. Stripe Dashboard 左上のトグル → **「Live mode」** に切替
2. アカウント審査完了確認:
   - ビジネス情報入力（個人事業主可）
   - 銀行口座登録
   - 本人確認書類（運転免許証等）
   - 通常 1〜2 営業日で承認

### Phase 2: ライブ用キー再取得

STEP 2〜4 をライブモードで繰り返す:
- Product を再作成（Test と Live はデータ独立）
- API キー取得（`pk_live_...`, `sk_live_...`）
- Webhook 再登録（同じ URL: `https://phrasely.kyren.app/api/stripe/webhook`）
- 新しい Webhook シークレット取得

### Phase 3: Vercel 環境変数を上書き

```bash
# 既存（テスト用）を削除
vercel env rm STRIPE_SECRET_KEY production --yes
vercel env rm STRIPE_WEBHOOK_SECRET production --yes
vercel env rm STRIPE_PRICE_ID production --yes
vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes

# ライブ用を追加（STEP 6-2 と同じ手順）
vercel env add STRIPE_SECRET_KEY production
# → sk_live_xxxxx
vercel env add STRIPE_WEBHOOK_SECRET production
# → whsec_xxxxx (新しい)
vercel env add STRIPE_PRICE_ID production
# → price_xxxxx (live 用)
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# → pk_live_xxxxx
```

### Phase 4: 再デプロイ + 実カードテスト

```bash
vercel --prod
```

⚠️ **本番モードでは実際のカード決済になります。**
- テストカード `4242` は使えません
- 自分のクレジットカードで $4.99 決済 → Stripe Dashboard ですぐ refund 可能
- これで E2E が動くことを確認

---

## ✅ 完了チェックリスト

このガイド完了時に全て ✅ になっているはず:

### テスト環境
- [ ] Stripe Dashboard で Product `Phrasely Pro` 作成済み
- [ ] Price `$4.99/月` 作成済み、Price ID 取得済み
- [ ] API キー（`sk_test_`, `pk_test_`）取得済み
- [ ] Webhook エンドポイント登録済み（3イベント）
- [ ] Webhook 署名シークレット取得済み
- [ ] `.env.local` の STRIPE_* 4変数を本物に更新済み
- [ ] `vercel env ls | grep STRIPE` で4変数が Production に存在
- [ ] `vercel --prod` で再デプロイ完了
- [ ] テストカード `4242` で決済成功
- [ ] Header に「Pro」バッジ表示確認
- [ ] Supabase `subscribers` テーブルに行作成確認
- [ ] Webhook 配信が 200 OK 確認

### 本番環境（後日）
- [ ] Stripe Live モード有効化（審査通過）
- [ ] ライブ用 Product/Price/Webhook 再作成
- [ ] Vercel 環境変数をライブ用に置換
- [ ] 自分のカードで実決済 → refund して E2E 確認

---

## 📞 困ったら

- ガイドの不明点 → このファイルを再確認
- Stripe API エラー → https://stripe.com/docs/error-codes
- Webhook デバッグ → Stripe Dashboard の「Webhooks」→「Send test webhook」
- 全部ダメ → Stripe サポート（24/7、英語/日本語）

---

最終確認日: 2026-04-28
