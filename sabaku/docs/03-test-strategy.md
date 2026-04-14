# テスト戦略: SABAKU

## テストピラミッド

```
        ╱╲
       ╱ E2E ╲          手動フロー 1本 + Playwright（V2）
      ╱────────╲
     ╱ Integration ╲    Supabase upsert / sync_history
    ╱────────────────╲
   ╱    Unit Tests    ╲  パーサー / Strip 変換 / タイマー
  ╱────────────────────╲
```

**ツール**: Vitest（ユニット + 統合） / Playwright（E2E、V2）
**カバレッジ目標**: パーサー 90%+ / ビジネスロジック 80%+ / UI 手動

---

## 1. ユニットテスト

### 1-1. Markdown パーサー

**テスト対象**: `packages/sync/src/parsers/`

#### Top3 パーサー

```typescript
describe('parseTop3', () => {
  it('標準フォーマットから3件抽出', () => {
    const md = `### 🎯 Today's Top 3
1. KASHITE Resend API 設定
2. Upwork proposal 送信
3. NeetCode DP問題 1問`;
    const result = parseTop3(md);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      title: 'KASHITE Resend API 設定',
      priority: 'urg',
      category: 'daily-top3',
      source: 'vault',
    });
  });

  it('2件のみの場合は2件返す', () => {
    const md = `### 🎯 Today's Top 3
1. タスクA
2. タスクB`;
    expect(parseTop3(md)).toHaveLength(2);
  });

  it('セクションが存在しない場合は空配列', () => {
    const md = '# 普通の見出し\nテキスト';
    expect(parseTop3(md)).toHaveLength(0);
  });

  it('emoji バリエーション（🎯 あり / なし）', () => {
    const md = `### Today's Top 3
1. タスクA`;
    expect(parseTop3(md)).toHaveLength(1);
  });
});
```

#### Checkbox パーサー

```typescript
describe('parseCheckboxes', () => {
  it('未完了チェックボックスを抽出', () => {
    const md = `- [ ] Phrasely Vercel deploy
- [ ] Eagle Eye DIFF 適用
- [x] note投稿 #7 完了`;
    const unchecked = parseCheckboxes(md, 'unchecked');
    expect(unchecked).toHaveLength(2);
    expect(unchecked[0].title).toBe('Phrasely Vercel deploy');
  });

  it('完了チェックボックスを抽出', () => {
    const md = `- [x] note投稿 #7 完了`;
    const checked = parseCheckboxes(md, 'checked');
    expect(checked).toHaveLength(1);
    expect(checked[0].status).toBe('cleared');
  });

  it('メタデータ付きチェックボックス', () => {
    const md = `- [ ] タスク名 #health 📅 2026-04-12 ⏳S [WM:低]`;
    const result = parseCheckboxes(md, 'unchecked');
    expect(result[0].title).toBe('タスク名');
    // メタデータはタイトルから除去される
  });

  it('ネストされたチェックボックスは無視', () => {
    const md = `- [ ] 親タスク
  - [ ] 子タスク`;
    const result = parseCheckboxes(md, 'unchecked');
    // トップレベルのみ取得（V1）
    expect(result).toHaveLength(1);
  });

  it('空行やテキスト行は無視', () => {
    const md = `テキスト

- [ ] タスク

もっとテキスト`;
    expect(parseCheckboxes(md, 'unchecked')).toHaveLength(1);
  });
});
```

#### TODO セクションパーサー

```typescript
describe('parseTodoSection', () => {
  it('📝 TODO セクション配下のリストを抽出', () => {
    const md = `## 📝 TODO
- [ ] Phrasely Vercel deploy
- [ ] Eagle Eye DIFF 適用
- [x] note投稿 #7 完了

## 次のセクション
テキスト`;
    const result = parseTodoSection(md);
    expect(result.unchecked).toHaveLength(2);
    expect(result.checked).toHaveLength(1);
  });

  it('TODO セクションが存在しない場合は空', () => {
    const md = '## 別のセクション\nテキスト';
    const result = parseTodoSection(md);
    expect(result.unchecked).toHaveLength(0);
  });
});
```

### 1-2. Strip 変換ロジック

```typescript
describe('toStrip', () => {
  it('パース結果から Strip オブジェクトに変換', () => {
    const parsed = {
      title: 'KASHITE Resend API 設定',
      priority: 'urg',
      category: 'daily-top3',
      source: 'vault',
    };
    const strip = toStrip(parsed, '/path/to/file.md');
    expect(strip.vault_ref).toBe('/path/to/file.md');
    expect(strip.status).toBe('queue');
    expect(strip.timer_seconds).toBe(0);
  });

  it('重複検出: 同じ vault_ref + title は同一 Strip', () => {
    const existing = { vault_ref: '/a.md', title: 'タスクA' };
    const incoming = { vault_ref: '/a.md', title: 'タスクA' };
    expect(isDuplicate(existing, incoming)).toBe(true);
  });

  it('異なるファイルの同名タスクは別 Strip', () => {
    const a = { vault_ref: '/a.md', title: 'タスクA' };
    const b = { vault_ref: '/b.md', title: 'タスクA' };
    expect(isDuplicate(a, b)).toBe(false);
  });
});
```

### 1-3. タイマー計算

```typescript
describe('timer', () => {
  it('START → PAUSE で経過時間を記録', () => {
    const log = createTimeLog(
      new Date('2026-04-13T10:00:00'),
      new Date('2026-04-13T10:23:45')
    );
    expect(log.duration_seconds).toBe(23 * 60 + 45);
  });

  it('累計タイマー: 複数セッションの合算', () => {
    const logs = [
      { duration_seconds: 600 },  // 10分
      { duration_seconds: 900 },  // 15分
    ];
    expect(totalSeconds(logs)).toBe(1500); // 25分
  });

  it('フォーマット: 秒 → HH:MM:SS', () => {
    expect(formatTimer(3661)).toBe('01:01:01');
    expect(formatTimer(0)).toBe('00:00:00');
    expect(formatTimer(59)).toBe('00:00:59');
  });
});
```

---

## 2. 統合テスト

### 2-1. Supabase Upsert

```typescript
describe('sync integration', () => {
  // テスト用 Supabase クライアント（テスト DB or モック）

  it('新規ストリップを upsert', async () => {
    const strips = [
      { title: 'テストタスク', priority: 'nrm', category: 'handoff', source: 'vault', vault_ref: '/test.md' }
    ];
    const result = await upsertStrips(strips);
    expect(result.created).toBe(1);
    expect(result.updated).toBe(0);
  });

  it('既存ストリップを更新（タイトル変更）', async () => {
    // 1回目: 作成
    await upsertStrips([{ title: 'タスクA', vault_ref: '/a.md' }]);
    // 2回目: 同じ vault_ref で更新
    const result = await upsertStrips([{ title: 'タスクA 改', vault_ref: '/a.md' }]);
    expect(result.updated).toBe(1);
    expect(result.created).toBe(0);
  });

  it('CLEARED ストリップは vault sync で上書きされない', async () => {
    // ユーザーが手動で CLEARED にしたストリップは保護
  });
});
```

### 2-2. sync_history ハッシュ比較

```typescript
describe('sync_history', () => {
  it('ファイル未変更ならスキップ', async () => {
    const hash1 = computeHash('file content');
    await recordSync('/test.md', hash1);

    const hash2 = computeHash('file content');
    expect(shouldSync('/test.md', hash2)).toBe(false);
  });

  it('ファイル変更あれば sync 実行', async () => {
    const hash1 = computeHash('old content');
    await recordSync('/test.md', hash1);

    const hash2 = computeHash('new content');
    expect(shouldSync('/test.md', hash2)).toBe(true);
  });

  it('新規ファイルは必ず sync', async () => {
    expect(shouldSync('/new-file.md', 'any-hash')).toBe(true);
  });
});
```

---

## 3. E2E テスト

### 3-1. 手動フローテスト（V1: 手動実行）

**シナリオ: ストリップ作成 → ACTIVE → タイマー → CLEARED**

```
1. [手動] 「+」ボタンでストリップ作成
   - Title: "テストタスク"
   - Priority: URG
   - → QUEUE に追加されることを確認

2. [手動] QUEUE のストリップを ACTIVE にドラッグ
   - → ACTIVE カラムに移動
   - → 左ボーダーにアクセント色
   - → Focus ビューで確認可能

3. [キーボード] `s` でタイマー START
   - → タイマーがカウントアップ開始
   - → timer-active 色で表示

4. [キーボード] `s` で PAUSE
   - → タイマー停止
   - → time_logs に記録

5. [キーボード] `d` で Done
   - → CLEARED カラムに移動
   - → strikethrough + opacity:0.5
   - → timer_seconds に累計保存
   - → cleared_at に時刻記録

6. [確認] Kanban ビューで CLEARED にストリップが表示
7. [確認] Focus ビューで「管制塔スタンバイ」表示
```

### 3-2. Sync フローテスト（V1: 手動実行）

```
1. テスト用 Markdown ファイルを Vault に配置:

### 🎯 Today's Top 3
1. KASHITE Resend API 設定
2. Upwork proposal 送信
3. NeetCode DP問題 1問

## 📝 TODO
- [ ] Phrasely Vercel deploy
- [ ] Eagle Eye DIFF 適用
- [x] note投稿 #7 完了

2. `sabaku sync --once` 実行
3. 確認:
   - URG ストリップ 3枚（Top3）
   - NRM ストリップ 2枚（未完了 checkbox）
   - CLEARED ストリップ 1枚（完了 checkbox）
   - sync_history にレコード
4. ファイル無変更で再実行 → 「No changes」表示
5. タスク追加して再実行 → 差分のみ追加
```

---

## 4. エッジケース

| ケース | 期待動作 | テスト方法 |
|--------|---------|-----------|
| 空の daily note | ストリップ 0枚、エラーなし | ユニット |
| Top3 が 1件のみ | 1枚の URG ストリップ | ユニット |
| 巨大ファイル（1000行+） | パフォーマンス劣化なし（< 100ms） | ユニット + ベンチマーク |
| 同名タスクが複数ファイルに存在 | vault_ref で区別、別ストリップ | ユニット |
| チェックボックスの記号バリエーション | `- [ ]`, `* [ ]`, `+ [ ]` | ユニット |
| 日本語 + 英語混在タイトル | 正常パース | ユニット |
| emoji 含むタイトル | 正常パース | ユニット |
| ACTIVE に 2枚目ドロップ | 警告モーダル表示 | E2E 手動 |
| 100枚のストリップ | スムーズスクロール（60fps） | E2E 手動 + Chrome DevTools |
| Vault パスが不正 | エラーメッセージ表示、クラッシュなし | 統合 |
| ネットワーク断 | オフライン状態表示、データ損失なし | E2E 手動 |
| 同時にファイル変更 + sync | 後勝ち（last-write-wins） | 統合 |

---

## 5. テスト実行コマンド

```bash
# 全ユニットテスト
pnpm test

# 特定ファイル
pnpm test src/lib/parsers/top3.test.ts

# カバレッジ
pnpm test --coverage

# ウォッチモード
pnpm test --watch

# E2E（V2 で Playwright 導入後）
pnpm test:e2e
```

---

## 6. CI パイプライン（V2）

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    steps:
      - pnpm install
      - pnpm test --coverage
      - pnpm build
      - pnpm lint
```

**V1 ではローカル実行のみ**。CI は安定後に追加。

---

## 7. テスト用サンプルデータ

### fixtures/daily-sample.md

```markdown
---
date: 2026-04-13
day: Sunday
tags: [daily, journal]
---

## Zeigarnik 棚卸し
- [ ] I-20 資金証明準備 [WM:高]
- [ ] AMEX 支払い確認 [WM:高]

### 🎯 Today's Top 3
1. KASHITE Resend API 設定
2. Upwork proposal 送信
3. NeetCode DP問題 1問

## Tasks Due Today

### ⏪ 昨日からの引き継ぎ
- [ ] アラームルール作成 #health 📅 2026-04-12 ⏳S [WM:低]

## 📝 TODO
- [ ] Phrasely Vercel deploy
- [ ] Eagle Eye DIFF 適用
- [x] note投稿 #7 完了
```

### fixtures/handoff-sample.md

```markdown
---
date: 2026-04-13
tags: [handoff]
---

# KASHITE Distribution Strategy

- [ ] Gumroad ページ最終確認
- [ ] X 告知文ドラフト
- [x] OG 画像生成
- [ ] Product Hunt 準備
```
