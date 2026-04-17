# Devil's Advocate v2 — 実装後レビュー

v0.1 の初期 devil's advocate の後、v0.2 まで実装した。
今回は「収益化・採用担当者・アクティブユーザー」の3視点で再度全否定する。

---

## Q1: 「採用担当者に見せて採用される？」

### 反論

- GitHub star 数 < 10、本番ユーザー 0。採用担当者は数字を見る
- Next.js + Supabase + Tailwind は全員書ける。差別化にならない
- 「Obsidian 連携」を説明するのに 2分かかる。Recruiter は 5秒で判断する
- 2026年は GitHub star も 301,000 アカウントから 600万の fake star がばらまかれている時代。star 数は逆にシグナルにならない
- 小プロジェクト多数より大プロジェクト1つ完成の方が採用される

### 反論への答え

**技術力の depth を示すアセットは複数ある**:
1. **monorepo + sync CLI**: Markdown パーサー + chokidar watcher + SHA-256 差分検知を TypeScript でゼロから実装（300行超）
2. **テスト**: 40/40 pass (vitest) — フロントエンド / パーサー / 統合
3. **live demo**: sabaku.kyren.app で実際に動く。これは書類選考より強い
4. **architecture docs**: `docs/` に Devil's Advocate / Market Research / UI/UX spec / Test strategy の4本。思考プロセスを全部公開
5. **Kyren line の4つ目**: 単発プロジェクトではなく、4プロダクト並行運営（KASHITE / YOMU / Phrasely / SABAKU）の一環。「one founder, many products」として話せる

**Recruiter 向けの "5秒パッチ"**:
- ランディング: 「One task. One timer. No distraction.」(5秒で価値がわかる)
- README 先頭: 動作 GIF + live demo リンク + "Built with Next.js 16, Supabase, Tailwind v4"
- GitHub topic: `productivity` `obsidian` `typescript` `nextjs` で検索にかかる

**判定**: ★★★★☆
「汎用的な採用」には中くらい。ただし「Obsidian を知っている人」「Indie hacker 志向の会社」「Kyren 的製品運営に興味がある人」には強く刺さる。**ニッチに強い**構成。

---

## Q2: 「$8/月払う価値がある？」

### 反論

- Todoist は $5/月で全ユーザー向けに完成している
- TickTick は $36/年（$3/月）でポモドーロ込み
- Obsidian Sync $5 + SABAKU $8 = $13/月。Obsidian ユーザーは既に払っている別料金がある
- シングルフォーカスだけなら Forest app が無料
- 時間記録なら Toggl free で十分

### 反論への答え

**$8/月の justification**:
- Akiflow $15/月、Sunsama $20/月がライバル。**$8 は約半額**
- Pro tier だけの機能を積む:
  - Supabase クラウド sync（3デバイス間）
  - Obsidian Vault 自動 sync（CLI が Pro アカウントで起動）
  - 無制限履歴
  - プロジェクト分析（Stats panel の強化版）
  - 優先サポート
- Free tier は十分な機能あり（ローカル無制限、Kanban / Focus / 手動プロジェクト / JSON export）

**価値の核**:
- 「タスクを書く手間 0」は Todoist / Akiflow にはない。これが差別化の全て
- `/daily` 実行 → 10秒後に SABAKU に URG×3 が自動出現。Todoist でこれを再現するには API 連携を自分で書く必要がある（1-2日かかる）
- ADHD-PI / HSP の人には、シングルフォーカスの強制が価値。マルチタスクさせない

**judgement**:
- 払う人: Obsidian daily journal + ADHD-PI / HSP + 時間記録したい人
- 払わない人: 汎用タスク管理で満足、Obsidian ライト ユーザー

**判定**: ★★★☆☆
payer はニッチだが、刺さる層には確実に刺さる。mass market を狙わず、深さで勝つ戦略。

---

## Q3: 「Active user を維持できる？」

### 反論

- タスク管理アプリの 70% は 2週間で dropout する（業界平均）
- 最初の wow があっても、Obsidian 使わない日は SABAKU を開かない
- 管理したいタスクが少ない日は Notion の方が便利
- モバイルサポートなし（PWA のみ）
- オフライン fallback はあっても、チーム機能なし

### 反論への答え

**Retention の仕掛け**:
1. **Streak / Stats panel**: 「今日 5件 cleared · 今週 32件」がダッシュボードに出る。ゲーミフィケーション要素
2. **Vault sync**: Obsidian で /daily を実行している人は毎朝開く。その人だけが自動で SABAKU に流れ込む
3. **タイマー**: 作業中に SABAKU を開き続ける理由（タイマー動作中）
4. **ショートカット**: 一度覚えると他のアプリが遅く感じる（Linear / Superhuman 同じ効果）
5. **Kanban & Focus 切替**: 気分やタスクの性質で使い分けられる

**Dropout 対策**:
- Onboarding: 3-step で何ができるかを明確化（v0.2 で追加済み）
- Empty states: Queue 空時に「n で新規」を明示
- localStorage: データが消えない安心感（既に実装）
- Stats panel: 「続けると成果が可視化される」インセンティブ

**判定**: ★★★☆☆
Obsidian 使う層には stickiness がある。その他の層は流出する。
→ そもそも mass market ターゲットではないので、**deep niche retention** を狙う戦略。

---

## Q4: 「技術的な差別化は十分？」

### 反論

- Next.js + Supabase は「2026年の新規 SaaS の 80%」が使う。差別化なし
- Tailwind v4 も普及期
- Markdown パーサーは remark で 50行で書ける
- 技術的に新規性なし

### 反論への答え

**技術的な新規性は実は有る**:
1. **タイマー精度**: `setInterval` ティック加算は誤差が溜まる（タブ非アクティブ時 1秒 → 実測 30秒など）。v0.2 で `Date.now()` 壁時計方式に refactor。この問題を認識しているエンジニアは少ない
2. **Drag vs click 判別**: 5px 閾値で onClick と onMouseDown を区別。@hello-pangea/dnd のデフォルトでは実装されていない
3. **vault_ref + title dedup**: 同名タスクが複数ファイルにある場合の重複排除（ハッシュベース）
4. **Project auto-detection**: hashtag + path inference の組み合わせで zero-config
5. **Test coverage**: Markdown パーサーだけで 18 unit tests。edge case 網羅

**判定**: ★★☆☆☆
新規性は中程度。ただし「ちゃんと動く」レベルを超えて、edge case ハンドリングまで作り込んでいる点は評価される。
「機能一覧だけの履歴書」より「このコミットでこういう問題を解いた」と話せるほうが強い。

---

## Q5: 「Monetization は本当にワークするのか？」

### 反論

- Indie SaaS の 90% は $1K MRR に到達しない（statista 2026）
- Gumroad の個人 micro-product 売上中央値は $500/年未満
- Obsidian community は「無料で使える代替があるのに払わない」文化
- CAC > LTV のリスク（単発購入に限定される）

### 反論への答え

**MRR $1K までの現実的な道**:

| Phase | 戦略 | Timeline | 期待収益 |
|-------|------|----------|----------|
| Phase 1 | Gumroad $49 one-time、Reddit r/ObsidianMD, HN post | 1-3ヶ月 | 20-30 users × $49 = $1K total |
| Phase 2 | Pro $8/mo 追加、既存 user に upsell | 4-8ヶ月 | 50 Pro × $8 + 継続 Gumroad = $400-800/mo |
| Phase 3 | Obsidian Plugin 版、Product Hunt launch | 9-12ヶ月 | 200 Pro × $8 = $1.6K/mo |

**CAC**:
- Reddit r/ObsidianMD: 無料（Self-post）
- HN Show: 無料
- Twitter build-in-public: 無料
- Gumroad: 10% + $0.50 fee
- Vercel + Supabase Free tier: $0
- CAC 実質ゼロに近い（organic）

**judgement**:
- 楽観ケース: 6ヶ月で $1K MRR
- 悲観ケース: 12ヶ月でも $300 MRR
- **どちらでもポートフォリオ効果は ある**（採用 / 副業 / 起業ネタとして）

**判定**: ★★★☆☆
「生活できる額」には足りないが、「ポートフォリオ + α」としては成立。

---

## 最終判定

| 観点 | 評価 | コメント |
|------|------|----------|
| 採用担当者への印象 | ★★★★☆ | ニッチに強い。Kyren line の文脈で強い |
| $8/月の価値 | ★★★☆☆ | 刺さる層は限定的だが確実に払う |
| Active retention | ★★★☆☆ | Obsidian 層には stickiness あり |
| 技術的新規性 | ★★☆☆☆ | edge case 対応は評価されるが革新ではない |
| Monetization 現実性 | ★★★☆☆ | $1K MRR は 6-12ヶ月で可能 |

**総合**: ★★★☆☆
「すごい」ではなく「確実にニーズに刺さる」プロダクト。
mass appeal は捨てて、depth で勝つ戦略を貫く。

---

## やらないこと（意図的）

1. Electron 版 / ネイティブアプリ → PWA で十分
2. マルチユーザー / チーム機能 → 複雑化してフォーカス失う
3. AI 機能（Claude で自動タスク分割など） → コストが跳ね上がる、差別化にならない
4. 汎用 iCal / Google Calendar 連携 → Sunsama / Akiflow のレッドオーシャンに入る
5. モバイルネイティブアプリ → PWA install で対応
