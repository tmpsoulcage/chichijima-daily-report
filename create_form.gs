/**
 * 現場日報フォーム自動生成スクリプト（最終版）
 * 
 * 使い方：
 * 1. https://script.google.com にアクセス
 * 2. 「新しいプロジェクト」を作成
 * 3. このコードを貼り付けて保存
 * 4. 「createDailyReportForm」を選択して実行
 * 5. 認証を許可
 * 6. Google Drive に新しいフォームとスプレッドシートが作成される
 * 7. ログに表示されるURLを確認
 * 
 * 対応フォーム：父島事務所 日報（仮）v2
 * 項目数：22項目（Timestamp除く）
 */

function createDailyReportForm() {
  // フォーム作成
  const form = FormApp.create("父島事務所 日報（仮）v2");
  form.setDescription("野外作業の日報入力フォームです。必須項目を入力して送信してください。");
  
  // ========================================
  // 1. 作業日（日付・必須）
  // ========================================
  form.addDateItem()
    .setTitle("■作業日")
    .setRequired(true);
  
  // ========================================
  // 2. 天候（チェックボックス・任意）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■天候")
    .setChoiceValues(["晴れ", "曇り", "雨"])
    .showOtherOption(true);
  
  // ========================================
  // 3. 事業名（チェックボックス・必須）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■事業名")
    .setChoiceValues(["請負", "委託", "オガ森", "補助事業"])
    .showOtherOption(true)
    .setRequired(true);
  
  // ========================================
  // 4. 作業員（チェックボックス・必須）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■作業員")
    .setChoiceValues([
      "新妻", "上村", "その他職員",
      "高岡", "前澤", "齋藤", "藤田", "菅生", "田谷", "その他作業員"
    ])
    .showOtherOption(true)
    .setRequired(true);
  
  // ========================================
  // 5. 作業人数（プルダウン・必須）
  // ========================================
  form.addListItem()
    .setTitle("■作業人数")
    .setChoiceValues(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"])
    .setRequired(true);
  
  // ========================================
  // 6. 傭船（チェックボックス・必須）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■傭船")
    .setChoiceValues(["あり", "なし"])
    .showOtherOption(true)
    .setRequired(true);
  
  // ========================================
  // 7. 作業場所（島）（プルダウン・必須）
  // ========================================
  form.addListItem()
    .setTitle("■作業場所（島）")
    .setChoiceValues(["父島", "兄島", "弟島", "孫島"])
    .setRequired(true);
  
  // ========================================
  // 8. 作業場所（記番）（記述式・必須）
  // ========================================
  form.addTextItem()
    .setTitle("■作業場所（記番）")
    .setHelpText("例：カ-12、Cライン")
    .setRequired(true);
  
  // ========================================
  // 9. 作業内容（記述式・必須）
  // ========================================
  form.addTextItem()
    .setTitle("■作業内容")
    .setHelpText("1行で簡潔に")
    .setRequired(true);
  
  // ========================================
  // 10. 上陸箇所（記述式・任意）
  // ========================================
  form.addTextItem()
    .setTitle("■上陸箇所")
    .setHelpText("上陸した場所を記入");
  
  // ========================================
  // 11. 特記事項（段落・任意）
  // ========================================
  form.addParagraphTextItem()
    .setTitle("■特記事項")
    .setHelpText("その他気づいた点など");
  
  // ========================================
  // 12. 希少種確認（チェックボックス・任意）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■希少種確認")
    .setChoiceValues(["あり", "なし"])
    .showOtherOption(true);
  
  // ========================================
  // 13. ヒヤリハット（チェックボックス・任意）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■ヒヤリハット")
    .setChoiceValues(["あり", "なし"])
    .showOtherOption(true);
  
  // ========================================
  // 14. 引継ぎ事項の有無（チェックボックス・任意）
  // ========================================
  form.addCheckboxItem()
    .setTitle("■引継ぎ事項の有無")
    .setChoiceValues(["あり", "なし"])
    .showOtherOption(true);
  
  // ========================================
  // 15. 潮位（プルダウン・任意）
  // ========================================
  form.addListItem()
    .setTitle("■潮位")
    .setChoiceValues(["大潮", "中潮", "小潮", "長潮", "若潮"]);
  
  // ========================================
  // 16. 潮まわり（プルダウン・任意）
  // ========================================
  form.addListItem()
    .setTitle("■潮まわり")
    .setChoiceValues(["上潮", "下潮"]);
  
  // ========================================
  // 17. 波向（プルダウン・任意）
  // ========================================
  const directions = [
    "北", "北北東", "北東", "東北東",
    "東", "東南東", "南東", "南南東",
    "南", "南南西", "南西", "西南西",
    "西", "西北西", "北西", "北北西"
  ];
  
  form.addListItem()
    .setTitle("■波向")
    .setChoiceValues(directions);
  
  // ========================================
  // 18. 波高（記述式・任意）
  // ========================================
  form.addTextItem()
    .setTitle("■波高")
    .setHelpText("数値のみ入力（単位：m）");
  
  // ========================================
  // 19. 風向（プルダウン・任意）
  // ========================================
  form.addListItem()
    .setTitle("■風向")
    .setChoiceValues(directions);
  
  // ========================================
  // 20. 風速（記述式・任意）
  // ========================================
  form.addTextItem()
    .setTitle("■風速")
    .setHelpText("数値のみ入力（単位：m/s）");
  
  // ========================================
  // 21. 写真URL（記述式・任意）
  // ========================================
  form.addTextItem()
    .setTitle("■写真URL")
    .setHelpText("Google Drive共有リンクを貼り付け");
  
  // ========================================
  // 22. 引継ぎ事項の内容（段落・任意）
  // ========================================
  form.addParagraphTextItem()
    .setTitle("■引継ぎ事項の内容")
    .setHelpText("引継ぎ事項の有無が「あり」の場合に記入");
  
  // ========================================
  // スプレッドシートにリンク
  // ========================================
  const ss = SpreadsheetApp.create("父島事務所 日報（仮）v2（回答）");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  
  // 完了メッセージ
  Logger.log("✅ フォーム作成完了！");
  Logger.log("━━━━━━━━━━━━━━━━━━━━");
  Logger.log("フォーム編集URL: " + form.getEditUrl());
  Logger.log("フォーム回答URL: " + form.getPublishedUrl());
  Logger.log("スプレッドシートURL: " + ss.getUrl());
  Logger.log("━━━━━━━━━━━━━━━━━━━━");
  Logger.log("");
  Logger.log("次のステップ：");
  Logger.log("1. スプレッドシートを開く");
  Logger.log("2. 拡張機能 → Apps Script");
  Logger.log("3. slack_notification.gs を貼り付け");
  Logger.log("4. SLACK_WEBHOOK_URL を設定");
  Logger.log("5. トリガーを設定（スプレッドシートから → フォーム送信時）");
  
  return {
    formEditUrl: form.getEditUrl(),
    formPublishUrl: form.getPublishedUrl(),
    spreadsheetUrl: ss.getUrl()
  };
}