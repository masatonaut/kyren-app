# UI/UX 設計書: SABAKU (捌く)

## 設計哲学

**メタファー**: 航空管制官の Flight Strip Board
**キーワード**: 捌く、シングルフォーカス、ゼロ入力、ダークモダン
**Kyren Design System**: Quiet Ambition — confident, restrained, premium

### Flight Strip TODO (nephros) との視覚的差別化

| 要素 | Flight Strip TODO | SABAKU |
|------|------------------|--------|
| カラースキーム | ATC 緑モノクロ / CRT 風 | ダーク (#0a0a0a) + マルチカラーアクセント |
| フォント | レトロ / モノスペース全体 | Geist Sans (本文) + Geist Mono (ID/タイマーのみ) |
| レイアウト | スケジュールボード固定 | 3ビュー切替（Focus / Kanban / Timeline） |
| 角丸 | なし or 丸い | border-radius: 0（紙の短冊感）※ストリップのみ |
| 操作感 | マウスドラッグ | キーボードファースト + ドラッグ |
| 情報密度 | ATC 用語準拠 | シンプル日英混在、emoji メタデータ |

---

## デザイントークン

### カラーパレット

```css
/* Base */
--bg-primary: #0a0a0a;        /* 背景 */
--bg-secondary: #141414;       /* カード / パネル */
--bg-tertiary: #1a1a1a;        /* ホバー / アクティブ背景 */
--border: #262626;              /* ボーダー */
--border-active: #404040;       /* アクティブボーダー */

/* Text */
--text-primary: #f5f5f4;        /* メインテキスト */
--text-secondary: #a3a3a3;      /* サブテキスト */
--text-tertiary: #737373;       /* プレースホルダー */

/* Priority */
--priority-urg: #ef4444;        /* 赤 — URG (Today's Top 3) */
--priority-nrm: #22c55e;        /* 緑 — NRM (通常タスク) */
--priority-low: #525252;        /* 灰 — LOW (いつでもOK) */

/* Semantic */
--timer-active: #facc15;        /* 黄 — タイマー動作中 */
--accent: #6366f1;              /* Kyren Indigo — アクセント */
--accent-hover: #5558e6;
--cleared: #404040;             /* CLEARED ストリップ（薄く） */

/* Source */
--source-vault: #818cf8;        /* Vault 自動連携マーク */
--source-manual: #a3a3a3;       /* 手動作成マーク */
```

### タイポグラフィ

```css
/* ID / タイマー / 数値 */
font-family: 'Geist Mono', monospace;

/* 本文 / UI テキスト */
font-family: 'Geist', sans-serif;

/* サイズスケール */
--text-xs: 11px;     /* カテゴリタグ */
--text-sm: 13px;     /* サブテキスト */
--text-base: 15px;   /* 本文 */
--text-lg: 18px;     /* ストリップタイトル */
--text-xl: 24px;     /* Focus ビュー タイトル */
--text-2xl: 32px;    /* Focus タイマー */
--text-3xl: 48px;    /* Focus タイマー（大） */
```

### スペーシング (4px ベース)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

### ストリップ固有

```css
/* ストリップカード */
border-radius: 0;              /* 紙の短冊感 */
min-height: 52px;
padding: 12px 16px;
border-left: 3px solid transparent;  /* ACTIVE 時にアクセントカラー */

/* ACTIVE ストリップ */
border-left-color: var(--accent);
background: var(--bg-tertiary);

/* CLEARED ストリップ */
opacity: 0.5;
text-decoration: line-through;
```

---

## 情報アーキテクチャ

### ストリップカード構造

```
┌─────────────────────────────────────────────────────────┐
│ ▌ [FS-0042] [URG] KASHITE Resend API設定     ⏱ 23:45  │
│   daily-top3 · 🔗 Vault · 2026-04-13                   │
└─────────────────────────────────────────────────────────┘
```

**情報優先順位（左→右、上→下）**:
1. **Priority インジケータ**: 左ボーダー色（URG=赤, NRM=緑, LOW=灰）
2. **Strip ID**: `FS-XXXX`（Geist Mono、text-tertiary）
3. **Priority バッジ**: テキストバッジ（URG / NRM / LOW）
4. **タイトル**: メインテキスト（Geist Sans、text-primary）
5. **タイマー**: 右端（Geist Mono、ACTIVE 時のみ表示、timer-active 色）
6. **メタデータ行**: カテゴリ + Source + 日付（text-secondary、text-sm）

### 優先度バッジ

```
URG: bg-red-500/20 text-red-400 border border-red-500/30
NRM: bg-green-500/20 text-green-400 border border-green-500/30
LOW: bg-neutral-500/20 text-neutral-400 border border-neutral-500/30
```

---

## 3ビュー設計

### View 1: Kanban ビュー（デフォルト）

```
┌──── ACTIVE (1) ────┐ ┌──── QUEUE (5) ─────┐ ┌──── CLEARED (12) ──┐
│                     │ │                     │ │                     │
│ ▌[FS-0042] [URG]   │ │ [FS-0039] [NRM]     │ │ [FS-0035] [NRM]    │
│   KASHITE Resend    │ │   Upwork proposal   │ │   note投稿 #7      │
│   ⏱ 23:45          │ │                     │ │   ✓ 15:32          │
│                     │ │ [FS-0040] [NRM]     │ │                     │
│                     │ │   NeetCode DP       │ │ [FS-0034] [LOW]    │
│                     │ │                     │ │   Eagle Eye DIFF   │
│                     │ │ [FS-0041] [URG]     │ │   ✓ 08:15          │
│                     │ │   英語 Speaking     │ │                     │
│                     │ │                     │ │                     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

**カラム仕様**:
- ACTIVE: max 1枚。背景をわずかに明るく。左ボーダーにアクセント
- QUEUE: スクロール可能。ドラッグで並び替え
- CLEARED: 折りたたみ可能。デフォルトは最新5件表示

**インタラクション**:
- ドラッグ＆ドロップ: QUEUE → ACTIVE, ACTIVE → QUEUE, ACTIVE → CLEARED
- ACTIVE に2枚目ドロップ → モーダル警告「1枚ずつ捌きましょう。入れ替えますか？」
- CLEARED → QUEUE に戻し可能（undo 的操作）

### View 2: Focus ビュー

```
┌─────────────────────────────────────────────┐
│                                             │
│              FS-0042  [URG]                 │
│                                             │
│        KASHITE Resend API 設定              │
│                                             │
│           daily-top3 · 🔗 Vault             │
│                                             │
│              ┌──────────┐                   │
│              │  23:45   │                   │
│              │  ⏱ ACTIVE │                  │
│              └──────────┘                   │
│                                             │
│     [ ⏸ Pause ]  [ ✓ Done ]  [ ← Queue ]  │
│                                             │
│  ─── Next in Queue ──────────────────────── │
│  → FS-0039  Upwork proposal 送信            │
│  → FS-0040  NeetCode DP問題 1問             │
│                                             │
└─────────────────────────────────────────────┘
```

**仕様**:
- 中央にACTIVEストリップ1枚を大きく表示
- タイマーは text-3xl（48px）で存在感
- 3アクションボタン: Pause / Done / Queue戻し
- 下部に Queue の次の2-3枚をプレビュー（クリックでACTIVE化）
- 背景は --bg-primary のまま。余計な情報なし
- ACTIVE なしの場合: 「QUEUE からストリップを選んで開始」メッセージ

### View 3: Timeline ビュー（V2 以降）

```
08:00 ┃ ██████ FS-0035 note投稿 #7 (15:32)
      ┃
09:00 ┃ ████████████ FS-0034 Eagle Eye DIFF (08:15)
      ┃
10:00 ┃
      ┃ ████████████████████ FS-0042 KASHITE Resend (23:45 進行中)
11:00 ┃
```

**仕様（V2）**:
- time_logs を時間軸で可視化
- 今日の作業ログが一目で分かる
- CLEARED ストリップのみ表示（完了した作業の記録）

---

## ナビゲーション

### ヘッダー

```
┌─────────────────────────────────────────────────────────┐
│ SABAKU                    [Focus] [Kanban]    [+] [⚙]  │
└─────────────────────────────────────────────────────────┘
```

- ロゴ: 「SABAKU」Geist Sans 700, tracking-tight
- ビュー切替: Focus / Kanban（タブ）
- [+]: 手動ストリップ作成
- [⚙]: 設定（Sync 状態、テーマ等）

### ショートカットパレット

`?` キーで表示:

| Key | Action |
|-----|--------|
| `n` | 新規ストリップ作成 |
| `s` | タイマー START / PAUSE |
| `d` | ACTIVE → CLEARED (Done) |
| `q` | ACTIVE → QUEUE 戻し |
| `↑↓` | QUEUE 内選択 |
| `Enter` | 選択 → ACTIVE 化 |
| `Esc` | モーダル / パレット閉じ |
| `1` | Focus ビュー |
| `2` | Kanban ビュー |
| `?` | ショートカット一覧 |

---

## モーダル: 手動ストリップ作成

```
┌─────────────────────────────────────┐
│ New Strip                      [×]  │
│                                     │
│ Title                               │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Priority   [ URG ] [ NRM ] [ LOW ]  │
│                                     │
│ Category   [manual ▾]               │
│                                     │
│        [ Cancel ]  [ Create ]       │
└─────────────────────────────────────┘
```

---

## レスポンシブ設計

### デスクトップ（1024px+）— メイン
- 3カラム Kanban フルレイアウト
- Focus ビューは中央 max-w-lg
- キーボードショートカット全機能

### タブレット（768px - 1023px）
- Kanban: 横スクロールで3カラム
- Focus: フル幅
- タッチドラッグ対応

### モバイル（< 768px）
- Kanban: カラム切替（タブ式）
- Focus: フル幅、ボタン大きく
- スワイプジェスチャー: 右 → Done, 左 → Queue

---

## アニメーション

```css
/* ストリップ → ACTIVE 化 */
transition: all 150ms ease-out;
/* 左ボーダー + 背景のフェード */

/* ストリップ → CLEARED */
transition: opacity 200ms ease-out;
/* フェードアウト + strikethrough */

/* タイマーパルス（ACTIVE時） */
@keyframes timer-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
/* 3秒間隔の穏やかなパルス */

/* ドラッグ中 */
transform: rotate(1deg);
box-shadow: 0 8px 32px rgba(0,0,0,0.4);

/* 新規ストリップ追加 */
@keyframes strip-enter {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: strip-enter 200ms ease-out;
```

**制約**: アニメーションは 300ms 以下。Kyren Design System 準拠。

---

## Empty States

### QUEUE が空
```
QUEUE にストリップがありません
/daily を実行して Today's Top 3 を取り込むか、
[+ 手動作成] で追加してください
```

### ACTIVE が空
```
管制塔スタンバイ
↑↓ で QUEUE から選んで Enter で開始
```

### 初回起動（Sync 未設定）
```
SABAKU へようこそ

Obsidian Vault を接続してタスクを自動取り込みするか、
手動でストリップを作成できます。

[ Vault を接続 ]  [ 手動で始める ]
```

---

## Sync ステータス表示

ヘッダー右 or 設定パネル:
```
🟢 Synced 2 min ago · 12 strips · 3 files watched
```
```
🟡 Syncing...
```
```
🔴 Sync error: Vault path not found
```
