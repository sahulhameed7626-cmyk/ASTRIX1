import { db } from '../db.js';

export const TELEGRAM_CONFIG = {
  botToken: '8900995248:AAGXq6_jOe7wKebndZl5ZctZHUKuXMLJ--I',
  botUsername: 'sgifesdf_bot',
  defaultChatId: '7032355691', // Sahul Hameed (Primary)
  defaultChatIds: ['7032355691', '5490113240']
};

export async function fetchTelegramUpdates() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getUpdates`);
    const data = await res.json();
    const chatIds = new Set(TELEGRAM_CONFIG.defaultChatIds);
    let latestChatId = '7032355691';
    let latestUsername = 'Sahul';

    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      for (let i = data.result.length - 1; i >= 0; i--) {
        const msg = data.result[i].message;
        if (msg?.chat?.id) {
          const cid = String(msg.chat.id);
          chatIds.add(cid);
          if (cid === '7032355691' || !latestChatId) {
            latestChatId = cid;
            latestUsername = msg.from?.first_name || msg.from?.username || 'Sahul';
          }
        }
      }
    }

    TELEGRAM_CONFIG.defaultChatId = latestChatId;
    const idList = Array.from(chatIds);
    return {
      chatId: latestChatId,
      chatIds: idList,
      username: latestUsername,
      updates: data.result || []
    };
  } catch (err) {
    console.error("Failed to fetch Telegram updates:", err);
    return { error: err.message, chatId: '7032355691', chatIds: TELEGRAM_CONFIG.defaultChatIds };
  }
}

export async function sendTelegramMessage({ chatId, chatIds, text }) {
  const token = TELEGRAM_CONFIG.botToken;
  const updateInfo = await fetchTelegramUpdates();
  
  // Build comprehensive recipient list: always include Sahul (7032355691) and maddy_06 (5490113240)
  const chatSet = new Set(['7032355691', '5490113240']);
  if (chatId) {
    if (Array.isArray(chatId)) chatId.forEach(c => c && chatSet.add(String(c).trim()));
    else chatSet.add(String(chatId).trim());
  }
  if (chatIds && Array.isArray(chatIds)) {
    chatIds.forEach(c => c && chatSet.add(String(c).trim()));
  }
  if (updateInfo.chatIds && Array.isArray(updateInfo.chatIds)) {
    updateInfo.chatIds.forEach(c => c && chatSet.add(String(c).trim()));
  }

  const targetChatIds = Array.from(chatSet);

  // Guard against Telegram 4096-character message length limit
  let messageText = String(text || '');
  if (messageText.length > 4000) {
    messageText = messageText.slice(0, 3950) + '\n\n...[Timeline continues in FitSport Platform]';
  }

  const results = [];
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  for (const cid of targetChatIds) {
    try {
      // 1. Try sending with HTML parse_mode
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cid,
          text: messageText,
          parse_mode: 'HTML'
        })
      });
      let data = await response.json();

      // 2. Fallback to clean plain text if Telegram entity parsing fails
      if (!response.ok || !data.ok) {
        console.warn(`[Telegram] HTML delivery failed for chat ${cid}, retrying plain text...`, data);
        const plainText = messageText.replace(/<[^>]+>/g, '');
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cid,
            text: plainText
          })
        });
        data = await response.json();
      }

      results.push({ chatId: cid, ok: response.ok && data.ok, data });
    } catch (err) {
      results.push({ chatId: cid, ok: false, error: err.message });
    }
  }

  const anySuccess = results.some(r => r.ok);
  const primaryData = results.find(r => r.ok && r.chatId === '7032355691')?.data || results.find(r => r.ok)?.data || results[0]?.data;

  return {
    ok: anySuccess,
    results,
    data: primaryData,
    chatIds: targetChatIds,
    message: anySuccess ? `Dispatched to ${results.filter(r => r.ok).length} Telegram chat(s)` : 'Failed to send'
  };
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatHistoryHtml(historyItems) {
  const athlete = escapeHtml(db.store.user?.name || "Sahul Hameed");
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  if (!historyItems || historyItems.length === 0) {
    return `🏆 <b>FITSPORT — Activity History Timeline</b>\n` +
      `👤 <b>Athlete:</b> ${athlete}\n` +
      `📅 <b>Date:</b> ${dateStr}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `<i>Status: No activity items logged yet. Timeline is reset.</i>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💪 <i>Train Smarter. Eat Better. Play Stronger.</i>\n` +
      `<i>FitSport Performance Platform</i>`;
  }

  const itemsFormatted = historyItems.map((item, idx) => {
    let icon = "⚡";
    if (item.type === "meals") icon = "🥗";
    else if (item.type === "water") icon = "💧";
    else if (item.type === "workouts") icon = "🏋️";
    else if (item.type === "sports") icon = "🚴";
    else if (item.type === "weight") icon = "⚖️";

    const title = escapeHtml(item.title || 'Activity');
    const time = escapeHtml(item.time || 'Today');
    const metric = escapeHtml(item.metric || 'Logged');
    const subtitle = escapeHtml(item.subtitle || '');
    const subMetric = item.subMetric ? ` (${escapeHtml(item.subMetric)})` : '';

    return `${idx + 1}. ${icon} <b>${title}</b>\n` +
           `   • Time: ${time} | Metric: <b>${metric}</b>\n` +
           `   • Details: ${subtitle}${subMetric}`;
  }).join('\n\n');

  return `🏆 <b>FITSPORT — Activity History Timeline</b>\n` +
    `👤 <b>Athlete:</b> ${athlete}\n` +
    `📅 <b>Date:</b> ${dateStr}\n` +
    `📊 <b>Total Activities:</b> ${historyItems.length}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `${itemsFormatted}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💪 <i>Train Smarter. Eat Better. Play Stronger.</i>\n` +
    `<i>FitSport Performance Platform</i>`;
}

export const TELEGRAM_SCHEDULE = {
  enabled: true,
  time: "20:45",
  time12: "08:45 PM",
  lastSentDate: null,
  targetChatId: "7032355691"
};

// Initialize schedule from DB if present
if (db.store.telegramSchedule) {
  Object.assign(TELEGRAM_SCHEDULE, db.store.telegramSchedule);
  if (!TELEGRAM_SCHEDULE.targetChatId) TELEGRAM_SCHEDULE.targetChatId = "7032355691";
} else {
  db.store.telegramSchedule = { ...TELEGRAM_SCHEDULE };
  db.saveStore();
}

let scheduleTimer = null;

export function startTelegramScheduler() {
  if (scheduleTimer) clearInterval(scheduleTimer);
  scheduleTimer = setInterval(async () => {
    try {
      const schedule = db.store.telegramSchedule || TELEGRAM_SCHEDULE;
      if (!schedule || !schedule.enabled) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hours}:${mins}`;
      const todayDate = now.toISOString().slice(0, 10);

      // Check if time matches and hasn't been sent today
      if (currentHHMM === schedule.time && schedule.lastSentDate !== todayDate) {
        console.log(`[Telegram Scheduler] Triggering automatic daily history dispatch at ${currentHHMM}...`);
        schedule.lastSentDate = todayDate;
        db.store.telegramSchedule = schedule;

        let targetChatId = schedule.targetChatId || TELEGRAM_CONFIG.defaultChatId || "7032355691";
        if (!targetChatId) {
          const updates = await fetchTelegramUpdates();
          if (updates.chatId) targetChatId = updates.chatId;
        }

        const historyItems = db.store.history || [];
        const text = formatHistoryHtml(historyItems);

        const result = await sendTelegramMessage({
          chatId: targetChatId,
          text: text
        });

        if (result.ok) {
          db.store.history.unshift({
            id: `h_tg_auto_${Date.now()}`,
            type: "telegram",
            title: "Automated Daily History Sent to Telegram",
            subtitle: `Scheduled delivery at ${schedule.time12 || schedule.time}`,
            metric: "Delivered",
            subMetric: `@${TELEGRAM_CONFIG.botUsername}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: "Today",
            icon: "clock"
          });
          db.saveStore();
          console.log(`[Telegram Scheduler] Successfully delivered automated history to Telegram!`);
        } else {
          console.warn(`[Telegram Scheduler] Automatic delivery notice: ${result.message || 'Needs user to start bot'}`);
        }
      }
    } catch (err) {
      console.error("[Telegram Scheduler] Error:", err);
    }
  }, 20000); // checks every 20 seconds
}

// Start scheduler when running as server daemon (skip in serverless environments)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startTelegramScheduler();
}

export async function handleTelegramRoutes(req, res, url, body) {
  const p = (url.pathname || '').toLowerCase();
  const isBaseTelegram = p === '/api/telegram' || p === '/telegram' || p.endsWith('/telegram');
  const actionParam = url.searchParams ? (url.searchParams.get('action') || '').toLowerCase() : '';
  const postAction = (body?.action || actionParam || '').toLowerCase();

  const isConfig = isBaseTelegram ? (actionParam === 'config' || !actionParam) : (p.endsWith('/telegram/config') || p.endsWith('/config'));
  const isSchedule = (isBaseTelegram && (actionParam === 'schedule' || postAction === 'schedule' || postAction === 'save-schedule' || body?.time || body?.time12 || typeof body?.enabled === 'boolean')) || p.endsWith('/telegram/schedule') || p.endsWith('/schedule');
  const isTestSchedule = (isBaseTelegram && (actionParam === 'test-schedule' || postAction === 'test-schedule')) || p.endsWith('/telegram/test-schedule') || p.endsWith('/test-schedule');
  const isUpdates = (isBaseTelegram && (actionParam === 'updates' || postAction === 'updates')) || p.endsWith('/telegram/updates') || p.endsWith('/updates');
  const isSendHistory = (isBaseTelegram && (actionParam === 'send-history' || postAction === 'send-history' || postAction === 'send' || body?.text)) || p.endsWith('/telegram/send-history') || p.endsWith('/send-history');

  // GET /api/telegram (or /api/telegram/schedule if ?action=schedule)
  if (isSchedule && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      schedule: db.store.telegramSchedule || TELEGRAM_SCHEDULE,
      botUsername: TELEGRAM_CONFIG.botUsername,
      botLink: `https://t.me/${TELEGRAM_CONFIG.botUsername}`,
      chatId: TELEGRAM_CONFIG.defaultChatId || "7032355691"
    }));
    return true;
  }

  // GET /api/telegram/config (or default GET /api/telegram)
  if (isConfig && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      botToken: "8900995248:AAGXq6_jOe7wKebndZl5ZctZHUKuXMLJ--I",
      botUsername: TELEGRAM_CONFIG.botUsername,
      botLink: `https://t.me/${TELEGRAM_CONFIG.botUsername}`,
      chatId: TELEGRAM_CONFIG.defaultChatId || "7032355691",
      schedule: db.store.telegramSchedule || TELEGRAM_SCHEDULE,
      status: "active"
    }));
    return true;
  }

  // POST /api/telegram/schedule (Save custom time and toggle)
  if (isSchedule && req.method === 'POST') {
    try {
      const schedule = db.store.telegramSchedule || { ...TELEGRAM_SCHEDULE };
      if (typeof body.enabled === 'boolean') schedule.enabled = body.enabled;
      if (body.time) {
        if (schedule.time !== body.time) schedule.lastSentDate = null; // Reset so new time can trigger today!
        schedule.time = body.time;
      }
      if (body.time12) {
        if (schedule.time12 !== body.time12) schedule.lastSentDate = null;
        schedule.time12 = body.time12;
      }
      if (body.chatId !== undefined) {
        schedule.targetChatId = body.chatId || "7032355691";
        TELEGRAM_CONFIG.defaultChatId = schedule.targetChatId;
      } else if (!schedule.targetChatId) {
        schedule.targetChatId = "7032355691";
      }
      db.store.telegramSchedule = schedule;
      db.saveStore();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Automated Telegram schedule updated to ${schedule.time12 || schedule.time} (${schedule.enabled ? 'Active' : 'Paused'})`,
        schedule: db.store.telegramSchedule
      }));
      return true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }

  // POST /api/telegram/test-schedule (Trigger test automated dispatch)
  if (isTestSchedule && req.method === 'POST') {
    try {
      const schedule = db.store.telegramSchedule || TELEGRAM_SCHEDULE;
      let targetChatId = body?.chatId || schedule.targetChatId || TELEGRAM_CONFIG.defaultChatId || "7032355691";
      
      if (!targetChatId) {
        const updates = await fetchTelegramUpdates();
        if (updates.chatId) targetChatId = updates.chatId;
      }

      const historyItems = db.store.history || [];
      const textToSend = formatHistoryHtml(historyItems);

      const result = await sendTelegramMessage({
        chatId: targetChatId,
        text: `⏰ <b>[TEST RUN — AUTOMATED SCHEDULED DISPATCH]</b>\n` + textToSend
      });

      if (result.ok) {
        db.store.history.unshift({
          id: `h_tg_test_${Date.now()}`,
          type: "telegram",
          title: "Telegram Automated Schedule Test Sent",
          subtitle: `Target: @${TELEGRAM_CONFIG.botUsername}`,
          metric: "Delivered",
          subMetric: `Chat ID: ${targetChatId || 'Linked'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: "Today",
          icon: "clock"
        });
        db.saveStore();
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: result.ok,
        botUsername: TELEGRAM_CONFIG.botUsername,
        botLink: `https://t.me/${TELEGRAM_CONFIG.botUsername}`,
        needsStart: result.needsStart || false,
        chatId: targetChatId || TELEGRAM_CONFIG.defaultChatId,
        message: result.ok ? "Test schedule dispatch sent to Telegram successfully!" : (result.message || "Ready to send"),
        rawText: textToSend,
        telegramResponse: result.data || result
      }));
      return true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }

  // GET /api/telegram/updates (Check for recent start messages)
  if (isUpdates && req.method === 'GET') {
    try {
      const updateData = await fetchTelegramUpdates();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updateData));
      return true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }

  // POST /api/telegram/send-history
  if (isSendHistory && req.method === 'POST') {
    try {
      const historyItems = db.store.history || [];
      const textToSend = body?.text || formatHistoryHtml(historyItems);
      const targetChatId = body?.chatId || TELEGRAM_CONFIG.defaultChatId || "7032355691";

      const result = await sendTelegramMessage({
        chatId: targetChatId,
        chatIds: body?.chatIds,
        text: textToSend
      });

      // Add dispatch event to history timeline if successful
      if (result.ok) {
        db.store.history.unshift({
          id: `h_tg_${Date.now()}`,
          type: "telegram",
          title: "Telegram History Dispatched",
          subtitle: `Sent to @${TELEGRAM_CONFIG.botUsername}`,
          metric: "Delivered",
          subMetric: `Chat ID: ${targetChatId || '7032355691'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: "Today",
          icon: "activity"
        });
        db.saveStore();
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: result.ok,
        botUsername: TELEGRAM_CONFIG.botUsername,
        botLink: `https://t.me/${TELEGRAM_CONFIG.botUsername}`,
        needsStart: false,
        chatId: targetChatId || TELEGRAM_CONFIG.defaultChatId,
        message: result.ok ? "History sent to Telegram successfully!" : (result.message || "Ready to send"),
        rawText: textToSend,
        telegramResponse: result.data || result
      }));
      return true;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return true;
    }
  }

  return false;
}

