# Monetization Strategy

## TL;DR

Path C Hybrid: Gumroad → Freemium SaaS。ニッチだが深い市場で $1-5K MRR を目指す。

---

## 価格設計

### Free (Hobby)

**$0 · forever**

- ローカル無制限 strips
- Kanban + Focus view
- 全キーボードショートカット
- Timer + project grouping
- JSON export
- Obsidian Vault sync CLI (open source)

**目的**: validation + 口コミ + Recruiter 向け開発者ブランディング

### Pro

**$8/月 (annual $72 = $6/月で 25% off)**

- Hobby の全機能
- **Supabase クラウド sync** (最大 3デバイス)
- **Obsidian Vault 自動 sync** (CLI を Pro アカウントで起動)
- **無制限履歴**
- **プロジェクト分析** (Stats panel 強化版、日別 / 週別 / 月別グラフ)
- **Priority サポート** (Discord)

**目的**: 継続収益の柱。retention 最適化

### Lifetime

**$49 one-time (Gumroad)**

- Pro の全機能 × 永続
- 最初の 100 ユーザー限定
- Gumroad fulfillment
- Early access to new features

**目的**: Phase 1 の validation + キャッシュフロー確保

---

## 競合価格 Benchmark

| プロダクト | モデル | 価格 | ターゲット |
|------------|--------|------|------------|
| Todoist | Freemium | $5/月 ($60/年) | 汎用 |
| TickTick | Freemium | $36/年 ($3/月) | バリュー意識層 |
| Sunsama | SaaS only | $20/月 ($240/年) | パワーユーザー |
| Akiflow | SaaS only | $15/月 ($180/年) | パワーユーザー |
| Things 3 | One-time | $50 | Apple 信者 |
| Obsidian Sync | Optional | $5/月 | Obsidian 層 |
| Obsidian Publish | Optional | $10/月 | Obsidian 層 |
| **SABAKU Pro** | **Freemium** | **$8/月 ($72/年)** | **Obsidian + 深い集中** |

**ポジショニング**:
- Obsidian Sync の延長として（$5 → $8 は心理的に払える）
- Sunsama の半額以下で、Obsidian ネイティブ機能を強調

---

## ロードマップ

### Phase 1: Validation (Month 1-3)

**目標**: $1K one-time sales

**施策**:
- Gumroad で $49 Lifetime を出す
- Reddit `r/ObsidianMD` で self-post（禁止事項に注意、valuable な content として投稿）
- Hacker News `Show HN`
- Twitter / X で build-in-public 投稿（Kyren アカウントで）
- Obsidian Discord で feedback 集め（宣伝禁止なので注意）
- Personal blog 記事: 「Why I built SABAKU」「Flight strips for knowledge work」

**KPI**:
- Gumroad Lifetime sales: 20-30 人
- Free user signup: 100-200 人
- GitHub stars: 50+

**Time investment**: 週 5-10時間（マーケ中心）

### Phase 2: Pro tier 追加 (Month 4-8)

**目標**: $1-2K MRR

**施策**:
- Supabase Auth + cloud sync を実装（Pro 機能）
- 既存 Lifetime 買い切り user に「Pro の新機能来ました」メール
- 月次 changelog で feature drop
- IndieHackers milestone post
- Podcast 出演（Obsidian Today、Focused Podcast 等）

**KPI**:
- Pro subscription: 50-100 人
- MRR: $400-800
- Churn rate: <5%
- Free → Pro conversion: 3-5%

**Time investment**: 週 10-15時間

### Phase 3: Scale (Month 9-12)

**目標**: $3-5K MRR

**施策**:
- **Obsidian Plugin 版** リリース（Community Plugin Registry）
- Product Hunt launch
- 有料広告実験（Twitter ads、小規模）
- Affiliate program（Obsidian template creators に 20%）
- 企業契約（5+ seats で $6/user/mo）

**KPI**:
- Pro subscriptions: 300-500 人
- MRR: $2,500-4,000
- Annual conversion rate: 30%

**Time investment**: 週 20時間

---

## Unit Economics

### Pro subscriber

- ARPU: $8/mo (mix of monthly + annual)
- Gross margin: 85%+ (Supabase Free tier ~1K user まで無料、Vercel 無料枠、Stripe 2.9%)
- COGS: $0.50/mo (Stripe + インフラ按分)
- CAC (organic only): $0
- LTV (at 5% monthly churn): $160 = 20ヶ月平均

### Lifetime buyer

- ARPU: $49 one-time
- Gumroad fee: 10% + $0.50 = $5.40
- Net: $43.60 per sale
- 実質: SaaS 5.5ヶ月分の収益を先に受け取り

---

## リスクとヘッジ

| リスク | 確率 | 対策 |
|--------|------|------|
| Obsidian が競合機能を公式実装 | 中 | プラットフォーム企業と競合せず、extension 的ポジション維持 |
| TAM が想定より小さい | 高 | Notion / Logseq 向け拡張を V2 で検討 |
| Free tier でみんな満足して有料に移行しない | 高 | Pro 限定機能を段階的に追加（cloud sync, Vault sync） |
| Churn が高い | 中 | 月次 changelog、stats feature で retention |
| solo dev burnout | 中 | 1日 3-4時間制限、週末 off |

---

## Next Actions (this quarter)

1. [x] v0.2 UX polish + Landing page（完了）
2. [ ] Supabase Auth + クラウド sync 実装（2週間）
3. [ ] Gumroad product page 作成 + Lifetime license 販売
4. [ ] Stripe Checkout 統合 (Pro tier)
5. [ ] `/pricing` ページ追加
6. [ ] HN Show HN 投稿準備（スクリーンキャスト + post draft）
7. [ ] Obsidian Discord に soft-launch（宣伝ではなく「build in public」として）
