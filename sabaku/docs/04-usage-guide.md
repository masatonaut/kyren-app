# SABAKU 使い方ガイド

## SABAKUとは

SABAKUは航空管制のフライトストリップをモチーフにした、**Obsidian Vault 自動連携タスク管理アプリ**。

「捌く」= 管制官がフライトを次々さばくように、目の前のタスクを**シングルフォーカス**で片付ける。

**URL**: https://sabaku.kyren.app

---

## 1日のワークフロー

### 朝（/daily 後）

```
Obsidian で /daily 実行
    ↓
Today's Top 3 + TODO が自動生成
    ↓
sabaku sync --once（or ウォッチャー常駐）
    ↓
SABAKU に URG×3 + NRM ストリップが出現
```

1. Obsidian で `/daily` を実行 → daily note が生成される
2. `pnpm sync:once` を実行（または `pnpm sync` でウォッチャー常駐）
3. SABAKU を開く → QUEUE に今日のストリップが並ぶ
4. `p` キーでプロジェクトフィルタリング → 朝一のプロジェクトに集中

### 作業中

```
QUEUE からストリップを選択（↑↓ + Enter）
    ↓
Focus ビューで 1枚だけ表示
    ↓
s でタイマー開始 → 作業
    ↓
d で完了（CLEARED へ）→ 次のストリップ
```

- **Focus ビュー**: `1` キーで切替。ACTIVE 1枚 + タイマーだけの集中画面
- **Kanban ビュー**: `2` キーで切替。全体の状況確認
- **中断時**: `q` で QUEUE に戻す。緊急タスクは `n` で手動作成

### 昼〜午後（/routing 後）

```
Obsidian で /routing 実行
    ↓
handoff docs に新しい - [ ] が追加
    ↓
sabaku sync が検知 → 新 NRM ストリップ追加
```

- `/routing` で生成された handoff ドキュメントのチェックボックスが自動で QUEUE に入る
- ファイル名から自動でプロジェクト判定（`kashite-*.md` → `KASHITE`）
- ハッシュタグからも判定（`#phrasely` → `PHRASELY`）

### 夜（/log 後）

```
Obsidian で /log 実行
    ↓
✅ Done セクション + 📝 TODO セクション生成
    ↓
sabaku sync で CLEARED 同期 + 翌日 carryover 生成
```

1. `/log` で今日の振り返りを記録
2. `[x]` チェック済みは CLEARED として同期
3. `## 📝 TODO` の `[ ]` は翌日の carryover ストリップとして生成

---

## キーボードショートカット

| Key | Action |
|-----|--------|
| `n` | 新規ストリップ作成 |
| `s` | タイマー START / PAUSE |
| `d` | ACTIVE → CLEARED (Done) |
| `q` | ACTIVE → QUEUE 戻し |
| `p` | プロジェクトフィルター切替 |
| `↑↓` | QUEUE 内選択 |
| `Enter` | 選択 → ACTIVE 化 |
| `1` | Focus ビュー |
| `2` | Kanban ビュー |
| `?` | ショートカット一覧 |

---

## プロジェクト機能

ストリップはプロジェクトに自動 or 手動で割り当てられる。

### 自動検出（Vault sync 時）

| ソース | 例 | 結果 |
|--------|---|------|
| ハッシュタグ | `- [ ] API設定 #kashite` | project: `KASHITE` |
| ファイルパス | `handoff/kashite-distribution.md` | project: `KASHITE` |
| なし | `- [ ] 普通のタスク` | project: `null` |

### 手動割当

- `n` キーで新規作成時にプロジェクト名を入力
- 既存プロジェクトは auto-suggest

### フィルタリング

- Header のドロップダウンでプロジェクト選択
- `p` キーでサイクル切替（All → KASHITE → PHRASELY → ... → All）
- フィルター中は StatusBar にプロジェクト名表示

---

## Sync CLI コマンド

```bash
# 1回スキャン
pnpm sync:once

# ドライラン（変更プレビュー）
pnpm sync:dry

# ウォッチモード（常駐、ファイル変更を自動検知）
pnpm sync

# 同期状態確認
npx tsx packages/sync/src/cli.ts sync --status
```

### 設定ファイル（sabaku-sync.config.json）

```json
{
  "vaultPath": "/Users/you/Documents/Obsidian Vault",
  "watchPaths": ["010-journal/daily", "010-journal/handoff"],
  "parseRules": {
    "top3": true,
    "checkboxUnchecked": true,
    "checkboxChecked": true,
    "todoSection": true
  }
}
```

---

## ストリップの優先度

| バッジ | 色 | ソース |
|--------|---|--------|
| `URG` | 赤 | Today's Top 3 から自動生成 |
| `NRM` | 緑 | handoff / TODO チェックボックス |
| `LOW` | 灰 | 手動作成時に選択 |

---

## ビュー

### Kanban ビュー（デフォルト）
- 3カラム: ACTIVE / QUEUE / CLEARED
- ドラッグ&ドロップで移動
- ACTIVE は常に 1枚（シングルフォーカス）

### Focus ビュー
- ACTIVE 1枚を中央に大きく表示
- タイマー大表示
- 下部に次の QUEUE プレビュー
