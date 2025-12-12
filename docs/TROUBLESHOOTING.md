# トラブルシューティング記録

Google フォーム + Slack 連携システム構築時に発生した問題と解決策

---

## 発生した問題

### エラーメッセージ
```
TypeError: Cannot read properties of undefined (reading 'namedValues')
TypeError: Cannot read properties of undefined (reading '■作業日')
```

---

## 原因

### 根本原因：トリガーの設定場所の違い

Google Apps Script でフォーム送信をトリガーにする場合、**設定場所によってイベントオブジェクト `e` の内容が異なる**。

| 設定場所 | イベントオブジェクト | 取得できるプロパティ |
|----------|---------------------|---------------------|
| **フォーム側** | FormResponse | `e.response`, `e.source`, `e.authMode` |
| **スプレッドシート側** | スプレッドシートイベント | `e.namedValues`, `e.values`, `e.range` |

### 参考：フォーム側トリガーの場合のイベントオブジェクト

```javascript
// フォーム側でトリガーを設定した場合
{
  "authMode": "FULL",
  "response": {},      // FormResponseオブジェクト
  "source": {},        // Formオブジェクト
  "triggerUid": "..."
}
// namedValues は存在しない！
```

### 参考：スプレッドシート側トリガーの場合のイベントオブジェクト

```javascript
// スプレッドシート側でトリガーを設定した場合
{
  "authMode": "FULL",
  "namedValues": {     // ← 列名をキーとした連想配列
    "■作業日": ["2024-12-13"],
    "■作業員": ["新妻"],
    // ...
  },
  "values": ["2024-12-13", "新妻", ...],
  "range": {},
  "source": {}
}
```

---

## 解決策

### 正しい設定手順

1. **スプレッドシート側**でApps Scriptを開く
   - フォームではなく、回答が記録されるスプレッドシートの「拡張機能」→「Apps Script」

2. トリガーを設定
   - イベントソース：**スプレッドシートから**（「フォームから」ではない）
   - イベントタイプ：**フォーム送信時**

3. コードの項目名をスプレッドシートの列名と一致させる

---

## 学んだこと

1. **Google Apps Script のトリガー設定場所によって、イベントオブジェクトの内容が異なる**
   - ドキュメントに明記すべき重要事項

2. **項目名は完全一致が必要**
   - スプレッドシートの列名を確認して、コードに反映する

3. **デバッグ時はイベントオブジェクトの中身を確認する**
   ```javascript
   function onFormSubmit(e) {
     sendToSlack("eオブジェクト:\n" + JSON.stringify(e, null, 2));
   }
   ```

---

## 参考リンク

- [Google Apps Script - Spreadsheet Triggers](https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events)
- [Google Apps Script - Form Triggers](https://developers.google.com/apps-script/guides/triggers/events#google_forms_events)

---

作成日：2024-12-13
