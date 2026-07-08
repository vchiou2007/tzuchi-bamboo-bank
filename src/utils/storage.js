/**
 * 資料儲存工具 (localStorage)
 * Data persistence utility
 *
 * 所有資料都儲存在瀏覽器的 localStorage 中，
 * 不需要伺服器或資料庫，重新整理資料不遺失。
 */

const STORAGE_KEY = 'tzuchi_bamboo_bank';

/** 預設資料結構 */
const DEFAULT_DATA = {
  /** 每日投入紀錄: { "2026-07-18": 3, "2026-07-19": 1, ... } */
  dailyRecords: {},
  /** 總金額 */
  totalAmount: 0,
  /** 最後投入日期 (用於計算連續天數) */
  lastDate: null,
};

/**
 * 讀取所有資料
 * @returns {object}
 */
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // 確保所有欄位存在
      return {
        ...DEFAULT_DATA,
        ...data,
        dailyRecords: data.dailyRecords || {},
      };
    }
  } catch (e) {
    console.warn('[Storage] 讀取資料失敗，使用預設值');
  }
  return { ...DEFAULT_DATA, dailyRecords: {} };
}

/**
 * 儲存所有資料
 * @param {object} data
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[Storage] 儲存資料失敗', e);
  }
}

/**
 * 投入一元
 * @param {object} data - 當前資料 (會被修改)
 * @returns {object} 更新後的資料
 */
export function addCoin(data) {
  const today = getTodayStr();

  // 更新本日紀錄
  data.dailyRecords[today] = (data.dailyRecords[today] || 0) + 1;

  // 更新總金額
  data.totalAmount = (data.totalAmount || 0) + 1;

  // 更新最後投入日期
  data.lastDate = today;

  saveData(data);
  return data;
}

/**
 * 檢查今天是否已經投過
 * @param {object} data
 * @returns {boolean}
 */
export function hasDroppedToday(data) {
  const today = getTodayStr();
  return (data.dailyRecords[today] || 0) > 0;
}

/**
 * 取得今日投入次數
 * @param {object} data
 * @returns {number}
 */
export function getTodayCount(data) {
  const today = getTodayStr();
  return data.dailyRecords[today] || 0;
}

/**
 * 計算連續天數
 * @param {object} data
 * @returns {number}
 */
export function calculateStreak(data) {
  const records = data.dailyRecords;
  const dates = Object.keys(records).sort().reverse();
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = getTodayStr();

  // 從今天開始往回數
  let checkDate = new Date();
  // 如果今天有紀錄就從今天開始，否則從昨天開始
  if (!records[today]) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = formatDate(checkDate);
    if (records[dateStr] && records[dateStr] > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 取得所有有紀錄的天數
 * @param {object} data
 * @returns {number}
 */
export function getActiveDays(data) {
  return Object.keys(data.dailyRecords).length;
}

/**
 * 取得投入紀錄列表 (排序：最新在先)
 * @param {object} data
 * @returns {Array<{date: string, count: number}>}
 */
export function getHistory(data) {
  const entries = Object.entries(data.dailyRecords)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return entries;
}

/** @returns {string} 今天的日期 YYYY-MM-DD */
function getTodayStr() {
  return formatDate(new Date());
}

/** @param {Date} date @returns {string} */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
