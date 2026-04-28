# Phrasely ローンチチェックリスト

リリース前に必ず確認すること。各項目に責任者（**You** = あなた / **Done** = 完了済み）を明記。

---

## ✅ 自動化済み（コード/インフラ）

### セキュリティ
- [x] **DB行レベル制御 (RLS)**: 全テーブル有効化済み（migrations 001/002/003）
- [x] **Service role キー未露出**: `grep` で確認、anon key のみフロントで使用
- [x] **HTTPS + HSTS**: `Strict-Transport-Security: max-age=63072000; preload` 設定
- [x] **CSP**: Stripe / Supabase / Vercel Analytics のみ allowlist
- [x] **X-Frame-Options: DENY** + X-Content-Type-Options: nosniff
- [x] **Permissions-Policy**: camera/mic/geolocation 全て無効
- [x] **環境変数の本番分離**: Vercel に production キー設定済み
- [x] **レート制限**: 5 req/min burst + 3/day daily（IP ベース、Supabase 永続化）
- [x] **Bot フィルタ**: User-Agent なしリクエストを 403 ブロック
- [x] **Webhook 署名検証**: Stripe 署名を `constructEvent` で検証
- [x] **Prompt injection 対策**: System prompt 固定、ユーザー入力は文字数制限

### パフォーマンス
- [x] **Bundle size**: `/` ページ 4.84 kB, First Load JS 107 kB（軽量）
- [x] **next/image 利用**: 画像なし
- [x] **静的生成**: Privacy/Terms/Tokushoho/Library が SSG
- [x] **Edge Middleware**: `34 kB`、API ルートのみ適用

### モバイル/UX
- [x] **タップターゲット 44px+**: スタイル選択ボタン 44px、副ボタン 36px
- [x] **iOS 自動ズーム防止**: input/textarea 16px on mobile
- [x] **ダークテーマ**: 統一済み
- [x] **空状態**: サンプルプロンプト3つ表示
- [x] **エラー境界**: `app/error.tsx` バイリンガル
- [x] **404 ページ**: `app/not-found.tsx` バイリンガル

### 法務
- [x] **Privacy Policy**: Stripe / Anthropic / Supabase / Analytics 全部開示
- [x] **Terms of Service**: サブスク・自動更新・キャンセル・返金条項
- [x] **特定商取引法**: `/tokushoho` で日本法準拠表記
- [x] **Footer リンク**: 3ページ全てリンク済み

### SEO
- [x] **メタタグ**: title / description / OG / Twitter Card 全て設定
- [x] **metadataBase**: `https://phrasely.kyren.app`
- [x] **Schema.org**: SoftwareApplication 構造化データ（JSON-LD）
- [x] **sitemap.xml**: 5ページ全て登録
- [x] **robots.txt**: クロール許可
- [x] **lang 属性**: `<html lang="en">`

### アナリティクス
- [x] **Vercel Analytics**: 匿名ページビュー計測
- [ ] イベントトラッキング（Get Pro クリック等）— 後回し OK

### 言語対応
- [x] **入力言語自動検出**: 🇯🇵/🇬🇧 バッジ表示
- [x] **バイリンガル placeholder**: 英日両方
- [x] **changes 説明**: 英語 + 日本語切替

---

## 🔴 あなたが必ずやる（ローンチ前）

### Stripe（最重要・15〜20分）
詳細手順 → [`STRIPE_SETUP.md`](./STRIPE_SETUP.md)

- [ ] Stripe アカウント作成（または既存使用）
- [ ] Product `Phrasely Pro` + Price $4.99/月 作成
- [ ] Price ID コピー
- [ ] Test API キー取得（pk_test, sk_test）
- [ ] Webhook 登録: `https://phrasely.kyren.app/api/stripe/webhook`
- [ ] Webhook シークレット取得
- [ ] `.env.local` 更新（4つの STRIPE_* 変数）
- [ ] Vercel 環境変数追加（`vercel env add STRIPE_*`）
- [ ] `vercel --prod` で再デプロイ
- [ ] テストカード `4242 4242 4242 4242` で決済確認
- [ ] Supabase `subscribers` テーブルに記録確認

### ローンチ前の最終確認（30分）
- [ ] **20-50人のベータテスター**でフロー検証（フレンズ・SNS）
- [ ] テスティモニアル 3-5件回収
- [ ] **Lighthouse**: https://pagespeed.web.dev/ で 90+ 確認
- [ ] **Mobile Simulator** で iPhone Safari / Android Chrome 動作確認
- [ ] お問合せメール `hey@kyren.app` 受信確認

### マーケティング素材（必要に応じて）
- [ ] **OG 画像** 1200×630（[og.image](https://og-image.vercel.app/) で生成可能）
- [ ] **デモ動画** 60-90秒（Loom / QuickTime で画面録画）
- [ ] **スクリーンショット** 5-8枚（Casual/Formal/Academic/Business Email/Social の各 rewrite 例）
- [ ] **タグライン**: 「日本語の感覚を残したまま、ネイティブに伝わる英語に。」
- [ ] **X スレッド** ローンチ用 8-12ツイート
- [ ] **Product Hunt 用 LP**: 既存 LP で十分（or `?utm_source=producthunt` でカスタマイズ）

---

## 🟡 ローンチ後すぐやる（48時間）

- [ ] 全コメント・DM に72h以内に返信
- [ ] サインアップ全員に手書きパーソナルメール
- [ ] 「Featured on Product Hunt」バッジ追加（PH ローンチ時）
- [ ] ローンチ retrospective を note / dev.to に投稿
- [ ] Vercel Analytics でトラフィック確認
- [ ] Supabase で waitlist / subscribers の数確認
- [ ] Anthropic ダッシュボードで API コスト確認

---

## 🟢 ローンチ後 30日（成長フェーズ）

### Day 3-7
- [ ] テックメディアにピッチ（PH ランキング social proof として）
- [ ] フィードバックを P0/P1/P2 で分類
- [ ] 1-2 quick wins を即時リリース

### Week 2-4
- [ ] **アクティベーション率** 測定（目標 20-40%）
- [ ] **Day 7 / Day 30 リテンション**
- [ ] **月次チャーン** ≤ 5%
- [ ] **CAC vs LTV** 初期計算
- [ ] 高エンゲージユーザー 5-10人にインタビュー

### 30日リフレクション
- [ ] 全 KPI ドキュメント化
- [ ] うまくいった/いかなかった 各3つ
- [ ] 次プロダクトのチェックリストにフィードバック反映

---

## 既知の制限事項（受容済み）

| 項目 | 状態 | 理由 |
|------|------|------|
| 認証なし | 受容 | Stripe Checkout でメール → DB 照合で十分（MVP） |
| Sentry なし | 受容 | Vercel ログで初期は十分。トラフィック増えたら追加 |
| Email 取引メールなし | 受容 | Stripe が自動で領収書を送る。ウェイトリスト用は後で Resend 追加可 |
| OG 画像なし | TODO | あなたの作業 |
| Posthog なし | TODO | Vercel Analytics で初期 OK。コンバージョン funnel 必要なら追加 |
| 多言語 LP（完全 JA 版） | 受容 | バイリンガル UI で十分。完全分離は需要見てから |
| npm audit 3 moderate | 受容 | next/postcss の transitive、breaking change 必要 |

---

## ベンチマーク KPI（目標）

| 指標 | 目標 | 計測方法 |
|------|------|---------|
| アクティベーション | 20-40% | Vercel Analytics → 「最初の Rewrite を完了」 |
| Day 7 リテンション | ≥ 30% | Supabase api_usage で IP ベース集計 |
| Pro 転換率 | 5-15% | subscribers / unique visitors |
| 月次チャーン | ≤ 5% | Stripe Dashboard |
| サイト速度 LCP | < 2.5s | Vercel Speed Insights |
| API レスポンス | < 5s | Vercel Functions log |

---

質問・トラブルは hey@kyren.app まで。Good luck! 🚀
