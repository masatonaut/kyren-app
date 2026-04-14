# Market Research: SABAKU ポジショニング

## 競合マップ

### Tier 1: 汎用タスク管理（間接競合）

#### Todoist
- **強み**: シンプル、クロスプラットフォーム、自然言語入力、Karma システム
- **弱み**: シングルフォーカス機能なし、時間記録なし、Obsidian 連携は Zapier 経由で脆い
- **価格**: Free / Pro $5/mo / Business $8/mo
- **ユーザー**: 4,000万+
- **SABAKU との距離**: 遠い。汎用 vs Vault ネイティブ

#### TickTick
- **強み**: ポモドーロ内蔵、習慣トラッカー、カレンダービュー統合
- **弱み**: Obsidian 連携なし、情報密度がやや低い
- **価格**: Free / Premium $35.99/year
- **SABAKU との距離**: 中。ポモドーロ + タスクの統合は類似概念

### Tier 2: 開発者向けプロジェクト管理（間接競合）

#### Linear
- **強み**: 高速 UI、キーボードファースト、サイクル管理、GitHub 統合
- **弱み**: チーム向け前提、個人タスクには重い、$8/user/mo
- **SABAKU との距離**: 遠い。チーム開発 vs 個人フォーカス

#### Height
- **強み**: AI タスク分類、柔軟なビュー、スプレッドシート的操作
- **弱み**: 個人無料プランが制限的、Obsidian 連携なし
- **SABAKU との距離**: 遠い

### Tier 3: Obsidian エコシステム内（直接競合）

#### Obsidian Tasks プラグイン
- **強み**: Vault 内完結、Dataview クエリ連携、豊富なフィルター
- **弱み**: テキストベースのまま。視覚的ビューなし。シングルフォーカスなし。タイマーなし
- **ユーザー**: 200,000+ DL
- **SABAKU との距離**: 近い。同じデータソースだが UI レイヤーが違う

#### Obsidian Kanban プラグイン
- **強み**: Vault 内でドラッグ＆ドロップ可能なボード
- **弱み**: Markdown ファイルベースで重い。自動パースなし。タイマーなし
- **ユーザー**: 300,000+ DL
- **SABAKU との距離**: 近い。ビューは類似だが自動連携とフォーカスモデルが違う

### Tier 4: ATC / Flight Strip インスパイア（直接競合）

#### Flightstrip (nephros/Codeberg)
- **概要**: Qt/QML デスクトップアプリ。ATC ストリップ + カレンダー統合
- **強み**: ATC メタファーの先行実装、スケジュールボード概念
- **弱み**: デスクトップ限定、Obsidian 連携なし、開発停滞気味
- **SABAKU との距離**: メタファーは最も近いが、プラットフォームとデータソースが全く違う

### Tier 5: タイムブロッキング / デイリープランナー（隣接競合）

#### Sunsama ($16/mo)
- **強み**: 禅的デイリープランニング、カレンダー統合、ワークライフバランス哲学
- **弱み**: 高価、Obsidian 連携なし、自社エコシステムに閉じる
- **哲学**: 「少なく、意図的に」→ SABAKU と近い思想

#### Akiflow ($15/mo)
- **強み**: キーボードドリブン、3,000+ Zapier 連携、高速 inbox
- **弱み**: 高価、パワーユーザー向けすぎる
- **哲学**: 「速くトリアージ」→ SABAKU の「捌く」と近い動詞

---

## ポジショニングマップ

```
                    高 ← 情報密度 → 低
                    │
         Linear     │     Todoist
         Height     │     TickTick
                    │
    ─── チーム ──────┼────── 個人 ───
                    │
         Akiflow    │     Sunsama
     Obsidian Tasks │   ★ SABAKU ★
     Obsidian Kanban│     Flightstrip
                    │
                    低 ← 自動化度 → 高
```

**SABAKU の独自ポジション**:
- X軸: 個人向け（チーム機能なし）
- Y軸: 高い自動化度（Vault 自動パース）
- Z軸（図に表現できない）: シングルフォーカス強制

---

## SABAKU の差別化サマリー

### Unique Value Proposition
**「Obsidian Vault から自動生成されるシングルフォーカス・タスクストリップ + 内蔵タイマー」**

### 3つの差別化軸

| 軸 | 競合の状況 | SABAKU |
|----|-----------|--------|
| **ゼロ入力** | 手動入力 or API 連携（設定が重い） | Vault Markdown を直接パース。設定は vault path のみ |
| **シングルフォーカス** | マルチタスク許容（Kanban = 全部見える） | ACTIVE 1枚。Focus ビューで「今これだけ」 |
| **時間記録一体化** | Toggl / Clockify 等の別ツール | Strip に内蔵。START → DONE で自動記録 |

### 競合にないもの
1. **Vault → Strip 自動変換パイプライン**（CLI sync）
2. **ACTIVE 1枚制限 + Focus ビュー**（管制官メタファーの実装）
3. **ATC フレーバーのダークモダン UI**（CRT風ではないクリーンデザイン）
4. **日本語 Vault ネイティブ対応**（emoji メタデータ、日英混在）

---

## TAM / SAM / SOM 推計

| 指標 | 推計 | 根拠 |
|------|------|------|
| **TAM** | Obsidian ユーザー 500万人 | 公式発表（2024年時点で数百万、成長中） |
| **SAM** | Tasks/Kanban プラグインユーザー ~50万人 | DL数ベース（Tasks 20万 + Kanban 30万、重複考慮） |
| **SOM** | Vault daily journal + タスク管理層 ~5,000人 | SAM の 1%。daily note + checkbox パターン利用者 |
| **初年度目標** | 200 ユーザー / $2,000 MRR | SOM の 4%。$10/mo × 200人 |

**ニッチだが深い市場**。Obsidian コミュニティは課金意欲が高い（プラグイン Catalyst、Sync/Publish の有料プランが成功）。

---

## Go-to-Market 示唆

1. **Obsidian Discord / Forum**: 最大の発見チャネル。「Vault からタスクを自動抽出するツール作った」で注目を集められる
2. **Product Hunt**: Kyren ライン4つ目としてストーリー性あり
3. **r/ObsidianMD**: 日次ユーザーが多い。daily note ワークフロー共有が人気
4. **Gumroad**: CLI sync ツール単体でも販売可能（$9.99 one-time）
5. **X/Twitter**: #ObsidianMD #PKM #BuildInPublic タグで開発過程を共有
