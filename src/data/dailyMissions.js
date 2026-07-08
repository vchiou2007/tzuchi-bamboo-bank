/**
 * 今日好事與今日好話建議
 * 每日隨機顯示
 */

export const GOOD_DEEDS = [
  '對遇到的每一個人微笑 😊',
  '扶長者過馬路 🚶',
  '撿起路邊的垃圾丟進垃圾桶 🗑️',
  '對家人說一聲「我愛你」💕',
  '打電話問候久未聯絡的朋友 📞',
  '讓座給需要的人 🚌',
  '對服務人員說聲謝謝 🙏',
  '捐出零錢幫助需要的人 💰',
  '稱讚身邊的人 🌟',
  '幫忙做一件家事 🏠',
  '寫一張感謝卡片 ✍️',
  '對同事說一句鼓勵的話 🤝',
  '分享一個正向的故事 📖',
  '耐心聽一個人說完話 👂',
  '為植物澆水、照顧它們 🌱',
  '餵食流浪動物 🐱',
  '不抱怨、不批評，度過這一天 🕊️',
  '祝福世界和平、人人平安 🌍',
  '隨手關燈、節約能源 💡',
  '買東西時多買一份送給街友 🥖',
  '傳一個溫馨的訊息給朋友 📱',
  '幫忙倒垃圾 🗑️',
  '排隊時不插隊、遵守秩序 🚶',
  '把不要的衣物捐出去 👕',
  '煮一頓飯給家人吃 🍳',
  '陪長輩聊天、聽他們說話 👴',
  '在社群平台分享一篇正向文章 📲',
  '讓路給行人先行 🚦',
  '對自己說一句肯定的話 💪',
  '參與環保分類、愛護地球 ♻️',
];

export const GOOD_WORDS = [
  '感恩的人最有福。',
  '知足常樂。',
  '心寬就是福。',
  '祝福別人，就是祝福自己。',
  '每一天都是新的開始。',
  '你笑，世界就對你笑。',
  '平安就是最大的幸福。',
  '多一分感恩，少一分煩惱。',
  '善念是最好的護身符。',
  '凡事感恩，時時感恩。',
  '簡單就是美。',
  '有心就有福，有願就有力。',
  '不要小看自己，人有無限可能。',
  '用愛心看待世界，世界充滿愛。',
  '知福、惜福、再造福。',
  '歡喜做，甘願受。',
  '結好緣，做好事。',
  '為善不欲人知。',
  '施比受更有福。',
  '待人寬一分是福。',
  '退一步海闊天空。',
  '心存善念，處處是好日。',
  '愛要說出口。',
  '你用什麼心看世界，世界就是什麼樣子。',
  '一日一善，日日是善。',
  '心美，看什麼都美。',
  '今天也要加油哦！💪',
  '給人希望是最大的慈悲。',
  '說好話如口吐蓮花。',
  '你就是自己生命的貴人。',
];

/**
 * 取得今日好事
 * @returns {string}
 */
export function getDailyGoodDeed() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 7;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
  }
  return GOOD_DEEDS[Math.abs(hash) % GOOD_DEEDS.length];
}

/**
 * 取得今日好話
 * @returns {string}
 */
export function getDailyGoodWord() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 13;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
  }
  return GOOD_WORDS[Math.abs(hash) % GOOD_WORDS.length];
}
