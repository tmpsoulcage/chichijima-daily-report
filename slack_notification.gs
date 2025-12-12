/**
 * 現場日報 Slack通知スクリプト（v5 - 全項目表示版）
 * 
 * ⚠️ 重要：このスクリプトはスプレッドシート側で設定してください
 *    フォーム側ではなく、回答が記録されるスプレッドシートの
 *    「拡張機能」→「Apps Script」から設定します。
 * 
 * トリガー設定：
 *   - イベントソース：スプレッドシートから
 *   - イベントタイプ：フォーム送信時
 * 
 * 対応スプレッドシート：父島事務所 日報（仮）v2（回答）
 * 
 * v5変更点：チェックボックス項目は「なし」や未選択でも表示
 */

// ========================================
// ⚠️ ここを自分のWebhook URLに置き換えてください
// ========================================
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX";

/**
 * フォーム送信時に実行される関数
 */
function onFormSubmit(e) {
  try {
    const v = e.namedValues;
    
    // ========================================
    // 各項目を取得（スプレッドシートの列名と完全一致）
    // ========================================
    
    // 基本情報
    const date = getValue(v, "■作業日");
    const weather = getValue(v, "■天候");
    const project = getValue(v, "■事業名");
    const workers = getValue(v, "■作業員");
    const workerCount = getValue(v, "■作業人数");
    const charter = getValue(v, "■傭船");
    
    // 作業場所
    const island = getValue(v, "■作業場所（島）");
    const area = getValue(v, "■作業場所（記番）");
    const landingSpot = getValue(v, "■上陸箇所");
    
    // 作業内容
    const work = getValue(v, "■作業内容");
    
    // 特記事項関連
    const note = getValue(v, "■特記事項");
    const rareSpecies = getValue(v, "■希少種確認");
    const nearMiss = getValue(v, "■ヒヤリハット");
    
    // 引継ぎ（有無と内容が分離）
    const handoverExists = getValue(v, "■引継ぎ事項の有無");
    const handoverContent = getValue(v, "■引継ぎ事項の内容");
    
    // 海況・気象
    const tide = getValue(v, "■潮位");
    const tideFlow = getValue(v, "■潮まわり");
    const waveDir = getValue(v, "■波向");
    const waveHeight = getValue(v, "■波高");
    const windDir = getValue(v, "■風向");
    const windSpeed = getValue(v, "■風速");
    
    // その他
    const photoUrl = getValue(v, "■写真URL");
    
    // ========================================
    // Slackメッセージ組み立て
    // ========================================
    let message = `📋 *日報* ${formatDate(date)}\n`;
    message += `━━━━━━━━━━━━━━\n`;
    
    // 基本情報
    message += `📍 *作業場所*：${island} ${area}\n`;
    
    if (landingSpot) {
      message += `🏝️ *上陸箇所*：${landingSpot}\n`;
    }
    
    if (project) {
      message += `📋 *事業名*：${project}\n`;
    }
    
    message += `👷 *作業員*：${workers}\n`;
    message += `👥 *作業人数*：${workerCount}名\n`;
    
    // 傭船（常に表示）
    message += `🚤 *傭船*：${charter || "未選択"}\n`;
    
    // 天候（常に表示）
    message += `🌤️ *天候*：${weather || "未選択"}\n`;
    
    // 作業内容
    message += `📝 *作業内容*：${work}\n`;
    
    // 希少種確認（常に表示）
    message += `🦎 *希少種確認*：${rareSpecies || "未選択"}\n`;
    
    // ヒヤリハット（常に表示）
    message += `🚨 *ヒヤリハット*：${nearMiss || "未選択"}\n`;
    
    // 特記事項
    if (note) {
      message += `⚠️ *特記事項*：${note}\n`;
    }
    
    // 引継ぎ（常に表示）
    message += `➡️ *引継ぎ*：${handoverExists || "未選択"}`;
    if (handoverExists && handoverExists.includes("あり") && handoverContent) {
      message += `\n　　${handoverContent}`;
    }
    message += `\n`;
    
    // 海況・気象（入力がある場合のみセクション表示）
    const hasSeaWeatherInfo = tide || tideFlow || waveDir || waveHeight || windDir || windSpeed;
    if (hasSeaWeatherInfo) {
      message += `\n🌊 *海況・気象*\n`;
      
      if (tide) {
        message += `　潮位：${tide}`;
        if (tideFlow) {
          message += `（${tideFlow}）`;
        }
        message += `\n`;
      }
      
      if (waveDir || waveHeight) {
        message += `　波：`;
        if (waveDir) message += `${waveDir}`;
        if (waveHeight) message += ` ${waveHeight}m`;
        message += `\n`;
      }
      
      if (windDir || windSpeed) {
        message += `　風：`;
        if (windDir) message += `${windDir}`;
        if (windSpeed) message += ` ${windSpeed}m/s`;
        message += `\n`;
      }
    }
    
    // 写真URL
    if (photoUrl) {
      message += `\n📷 *写真*：${photoUrl}\n`;
    }
    
    message += `━━━━━━━━━━━━━━`;
    
    // Slackに送信
    sendToSlack(message);
    
    Logger.log("日報をSlackに送信しました: " + date + " " + island);
    
  } catch (error) {
    Logger.log("エラーが発生しました: " + error.toString());
    sendToSlack("⚠️ 日報の送信中にエラーが発生しました。\nエラー: " + error.toString());
  }
}

/**
 * 値を安全に取得するヘルパー関数
 */
function getValue(namedValues, key) {
  if (namedValues[key] && namedValues[key][0]) {
    return namedValues[key][0].trim();
  }
  return "";
}

/**
 * Slackにメッセージを送信
 */
function sendToSlack(message) {
  const payload = {
    "text": message,
    "unfurl_links": false,
    "unfurl_media": false
  };
  
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  
  if (response.getResponseCode() !== 200) {
    Logger.log("Slack送信エラー: " + response.getContentText());
  }
}

/**
 * 日付をフォーマット
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekday = weekdays[date.getDay()];
    
    return `${year}/${month}/${day} (${weekday})`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * テスト用関数
 */
function testNotification() {
  const testEvent = {
    namedValues: {
      "■作業日": ["2024-12-13"],
      "■天候": ["晴れ"],
      "■事業名": ["請負"],
      "■作業員": ["新妻, 上村, 高岡"],
      "■作業人数": ["3"],
      "■傭船": ["なし"],
      "■作業場所（島）": ["兄島"],
      "■作業場所（記番）": ["Cライン"],
      "■上陸箇所": ["西海岸"],
      "■作業内容": ["ギンネム伐採 約50本"],
      "■希少種確認": ["なし"],
      "■ヒヤリハット": ["なし"],
      "■特記事項": [""],
      "■引継ぎ事項の有無": ["なし"],
      "■引継ぎ事項の内容": [""],
      "■潮位": ["中潮"],
      "■潮まわり": ["上潮"],
      "■波向": ["北東"],
      "■波高": ["1.5"],
      "■風向": ["北"],
      "■風速": ["5"],
      "■写真URL": [""]
    }
  };
  
  onFormSubmit(testEvent);
}

/**
 * デバッグ用：フォームの項目名を確認
 */
function debugShowKeys(e) {
  const keys = Object.keys(e.namedValues);
  let debugMsg = "📋 デバッグ情報\nフォーム項目名一覧:\n";
  
  keys.forEach(function(key) {
    debugMsg += "「" + key + "」→ " + e.namedValues[key][0] + "\n";
  });
  
  sendToSlack(debugMsg);
}