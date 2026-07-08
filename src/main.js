/**
 * ============================================================================
 * 竹筒歲月 — 每日一善 主程式
 * Tzu Chi Bamboo Bank - Main Application
 * ============================================================================
 *
 * 功能：每天投入一元、閱讀靜思語、做好事說好話、統計紀錄
 * 技術：Vite + vanilla JS + localStorage
 *
 * @version 1.0.0
 */

import { getDailyAphorism } from './data/jingSiAphorisms.js';
import { getDailyGoodDeed, getDailyGoodWord } from './data/dailyMissions.js';
import {
  loadData, saveData, addCoin, getTodayCount,
  calculateStreak, getActiveDays, getHistory,
} from './utils/storage.js';

// ============================================================================
// DOM 元素快取
// ============================================================================
const $ = (id) => document.getElementById(id);

const els = {
  greeting: $('greeting'),
  dateDisplay: $('dateDisplay'),
  aphorismText: $('aphorismText'),
  goodDeed: $('goodDeed'),
  goodWord: $('goodWord'),
  totalAmount: $('totalAmount'),
  todayCount: $('todayCount'),
  statStreak: $('statStreak'),
  statDays: $('statDays'),
  statTotal: $('statTotal'),
  dropBtn: $('dropBtn'),
  bambooContainer: $('bambooContainer'),
  rippleEffect: $('rippleEffect'),
  coinInside: document.querySelector('#coinInside'),
  historyToggle: $('historyToggle'),
  historyList: $('historyList'),
};

// ============================================================================
// 應用狀態
// ============================================================================
let data = loadData();

// ============================================================================
// 初始化
// ============================================================================
function init() {
  // 早安問候
  updateGreeting();

  // 日期
  updateDate();

  // 今日靜思語
  els.aphorismText.textContent = getDailyAphorism();

  // 今日好事 & 好話
  els.goodDeed.textContent = getDailyGoodDeed();
  els.goodWord.textContent = getDailyGoodWord();

  // 統計數據
  updateStats();

  // 綁定投幣事件
  els.dropBtn.addEventListener('click', handleDropCoin);
  els.bambooContainer.addEventListener('click', handleDropCoin);

  // 歷史紀錄
  els.historyToggle.addEventListener('click', toggleHistory);

  console.log('[竹筒歲月] 初始化完成');
}

// ============================================================================
// 時段問候語
// ============================================================================
function updateGreeting() {
  const hour = new Date().getHours();
  let msg = '早安，菩薩早安 🌅';
  if (hour >= 5 && hour < 11) msg = '早安，菩薩早安 🌅';
  else if (hour >= 11 && hour < 13) msg = '午安，用餐愉快 ☀️';
  else if (hour >= 13 && hour < 18) msg = '午安，下午吉祥 🌤️';
  else if (hour >= 18 && hour < 22) msg = '晚安，晚間吉祥 🌆';
  else msg = '夜深了，早點休息 🌙 菩薩晚安';
  els.greeting.textContent = msg;
}

function updateDate() {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const w = weekdays[now.getDay()];
  els.dateDisplay.textContent = `${y} 年 ${m} 月 ${d} 日（星期${w}）`;
}

// ============================================================================
// 統計更新
// ============================================================================
function updateStats() {
  const total = data.totalAmount || 0;
  const today = getTodayCount(data);
  const streak = calculateStreak(data);
  const days = getActiveDays(data);

  // 總金額顯示
  els.totalAmount.textContent = total;
  els.todayCount.textContent = `今日已投入 ${today} 元`;

  // 統計卡
  els.statStreak.textContent = streak;
  els.statDays.textContent = days;
  els.statTotal.textContent = total;

  // 竹筒內有錢時顯示錢幣
  if (total > 0 && els.coinInside) {
    els.coinInside.style.opacity = '0.6';
  }

  // 按鈕狀態：每人每天只能投一次（但可以累積多個1元）
  // 其實根據需求，一天可投多次，不用禁用
}

// ============================================================================
// 投幣處理
// ============================================================================
function handleDropCoin(e) {
  // 防止雙重點擊
  if (els.dropBtn.disabled) return;
  els.dropBtn.disabled = true;

  // === 資料更新 ===
  data = addCoin(data);

  // === 飛幣動畫 ===
  createCoinFly(e);

  // === 漣漪效果 ===
  showRipple();

  // === 小閃光 ===
  createSparkles();

  // === 更新畫面 ===
  setTimeout(() => {
    updateStats();
    els.dropBtn.disabled = false;
  }, 400);

  // === 音效 (簡化：無檔案) ===
  // 可選加入 "叮" 的音效
}

// ============================================================================
// 動畫：飛幣效果
// ============================================================================
function createCoinFly(e) {
  const coin = document.createElement('div');
  coin.className = 'coin-fly';
  coin.textContent = '💰';

  // 點擊位置或竹筒上方
  const rect = els.bambooContainer.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 - 18;
  const startY = rect.top + 20;

  coin.style.left = startX + 'px';
  coin.style.top = startY + 'px';
  document.body.appendChild(coin);

  // 動畫結束後移除
  setTimeout(() => coin.remove(), 900);
}

// ============================================================================
// 動畫：漣漪
// ============================================================================
function showRipple() {
  const ripple = els.rippleEffect;
  if (!ripple) return;

  // 重新觸發動畫
  ripple.style.display = 'block';
  ripple.style.animation = 'none';
  ripple.offsetHeight; // 強制 reflow
  ripple.style.animation = 'rippleAnim 0.6s ease-out forwards';

  setTimeout(() => {
    ripple.style.display = 'none';
  }, 700);
}

// ============================================================================
// 動畫：小閃光
// ============================================================================
function createSparkles() {
  const colors = ['#C8974A', '#9BC53D', '#FFFFFF', '#FFD700'];
  const rect = els.bambooContainer.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.className = 'sparkle';
    const size = 4 + Math.random() * 6;
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    spark.style.cssText = `
      width:${size}px; height:${size}px;
      left:${cx}px; top:${cy}px;
      background:${colors[i % colors.length]};
      border-radius:50%;
      --dx:${Math.cos(angle) * dist}px;
      --dy:${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

// ============================================================================
// 歷史紀錄切換
// ============================================================================
let historyOpen = false;
function toggleHistory() {
  historyOpen = !historyOpen;
  const list = els.historyList;
  if (historyOpen) {
    renderHistory();
    list.classList.add('open');
    els.historyToggle.textContent = '📋 收起紀錄';
  } else {
    list.classList.remove('open');
    els.historyToggle.textContent = '📋 查看投入紀錄';
  }
}

function renderHistory() {
  const history = getHistory(data);
  const list = els.historyList;

  if (history.length === 0) {
    list.innerHTML = '<div style="padding:12px;text-align:center;color:#A09070;font-size:13px;">還沒有紀錄喔，開始投入第一塊錢吧！</div>';
    return;
  }

  list.innerHTML = history.map(item => {
    // 格式化日期顯示
    const parts = item.date.split('-');
    const displayDate = `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    return `
      <div class="history-item">
        <span class="date">${displayDate}</span>
        <span class="count">${item.count} 元</span>
      </div>
    `;
  }).join('');
}

// ============================================================================
// 啟動
// ============================================================================
document.addEventListener('DOMContentLoaded', init);
