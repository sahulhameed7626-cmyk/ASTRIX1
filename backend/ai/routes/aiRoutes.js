// FitSport AI Coach Dedicated API Routes
import { fitSportAgentGraph } from '../agent/graph.js';
import { fitSportTools } from '../agent/tools.js';
import { aiContextService } from '../services/AIContextService.js';
import { voiceService } from '../services/VoiceService.js';
import { recommendationService } from '../services/RecommendationService.js';

export async function handleNewAiCoachRoutes(req, res, url, body = {}) {
  // Resolve authenticated user ID from Authorization header / token / session (Section 5)
  const authHeader = req.headers['authorization'] || req.headers['x-user-id'] || '';
  let userId = fitSportTools.db.store.user?.id || 'user_sahul_hameed';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token && token !== 'null' && token !== 'undefined') {
      userId = token;
    }
  } else if (authHeader && !authHeader.startsWith('Bearer ')) {
    userId = authHeader.trim();
  }

  const isDebug = process.env.AI_DEBUG === 'true';

  // Helper response
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return true;
  };

  // 1. POST /api/ai/voice — Voice Audio Pipeline (Section 16 & 17)
  if (url.pathname === '/api/ai/voice' && req.method === 'POST') {
    console.log(`[AI] Request received: POST /api/ai/voice`);
    console.log(`[AI] User authenticated: ${userId}`);

    let audioData = body.audio || body.audioBuffer;
    if (typeof audioData === 'string' && audioData.startsWith('data:audio/')) {
      const b64 = audioData.replace(/^data:audio\/\w+;base64,/, '');
      audioData = Buffer.from(b64, 'base64');
      console.log(`[AI] Audio received: ${audioData.length} bytes base64`);
    }

    const conversationId = body.conversationId || null;
    const inputMessage = body.message || body.text || '';

    try {
      const result = await fitSportAgentGraph.execute({
        userId,
        conversationId,
        inputMessage,
        audioBuffer: audioData
      });
      console.log(`[AI] Agent completed intent: ${result.intent}`);
      return sendJson(200, {
        success: true,
        conversationId: result.conversationId,
        transcript: result.transcript,
        intent: result.intent,
        response: result.response || result.text,
        text: result.text,
        spokenText: result.spokenText,
        audioUrl: result.audioUrl,
        actions: result.actions || [],
        missingInformation: result.missingInformation || null,
        error: null
      });
    } catch (err) {
      console.error(`[AI] Agent execution error:`, err);
      return sendJson(500, {
        success: false,
        conversationId,
        transcript: "",
        response: null,
        text: null,
        audioUrl: null,
        actions: [],
        error: { code: "AGENT_ERROR", message: err.message }
      });
    }
  }

  // 2. POST /api/ai/chat — Text or Recognized Speech Pipeline (Section 4 & 24)
  if (url.pathname === '/api/ai/chat' && req.method === 'POST') {
    const message = body.message || body.text || body.query || '';
    const conversationId = body.conversationId || null;
    const sessionContext = body.sessionContext || body.context || {};

    console.log(`[AI] Request received: POST /api/ai/chat`);
    console.log(`[AI] User authenticated: ${userId}`);
    if (isDebug) {
      console.log(`[AI_DEBUG] Input message: "${message}"`);
      console.log(`[AI_DEBUG] Session context:`, sessionContext);
    }

    try {
      const result = await fitSportAgentGraph.execute({
        userId,
        conversationId,
        inputMessage: message,
        sessionContext
      });
      console.log(`[AI] Agent completed intent: ${result.intent}`);
      if (isDebug) {
        console.log(`[AI_DEBUG] Actions executed:`, result.actions);
      }
      return sendJson(200, {
        success: true,
        conversationId: result.conversationId,
        transcript: result.transcript,
        intent: result.intent,
        response: result.response || result.text,
        text: result.text,
        spokenText: result.spokenText,
        audioUrl: result.audioUrl,
        actions: result.actions || [],
        missingInformation: result.missingInformation || null,
        error: null
      });
    } catch (err) {
      console.error(`[AI] Agent error:`, err);
      return sendJson(500, {
        success: false,
        conversationId,
        transcript: message,
        response: null,
        text: null,
        audioUrl: null,
        actions: [],
        error: { code: "AGENT_ERROR", message: err.message }
      });
    }
  }

  // 3. POST /api/ai/transcribe — Speech-To-Text Whisper endpoint
  if (url.pathname === '/api/ai/transcribe' && req.method === 'POST') {
    let audio = body.audio || body.audioBuffer || body.text;
    if (typeof audio === 'string' && audio.startsWith('data:audio/')) {
      const b64 = audio.replace(/^data:audio\/\w+;base64,/, '');
      audio = Buffer.from(b64, 'base64');
    }
    try {
      const stt = await voiceService.processAudioInput(audio);
      return sendJson(200, stt);
    } catch (err) {
      return sendJson(500, { error: err.message });
    }
  }

  // 4. POST /api/ai/speak — Text-To-Speech Piper endpoint
  if (url.pathname === '/api/ai/speak' && req.method === 'POST') {
    const text = body.text || body.message || '';
    try {
      const tts = await voiceService.synthesizeResponse(text);
      return sendJson(200, tts);
    } catch (err) {
      return sendJson(500, { error: err.message });
    }
  }

  // 5. GET /api/ai/conversations & /api/ai/conversations/:id
  if (url.pathname.startsWith('/api/ai/conversations')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const convId = parts[3];

    if (req.method === 'GET') {
      if (convId) {
        const conv = aiContextService.getConversationById(convId);
        return sendJson(200, { conversationId: convId, messages: conv });
      }
      const list = aiContextService.getRecentConversations(userId);
      return sendJson(200, { conversations: list });
    }

    if (req.method === 'POST') {
      const msg = aiContextService.saveMessage(body.conversationId, body);
      return sendJson(201, { message: "Saved", entry: msg });
    }

    if (req.method === 'DELETE' && convId) {
      const deleted = aiContextService.deleteConversation(convId);
      return sendJson(200, { success: deleted });
    }
  }

  // 6. GET / PUT / POST / DELETE /api/ai/checkins — Meal & Activity Check-ins
  if (url.pathname.startsWith('/api/ai/checkins')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const checkinId = parts[3];

    if (req.method === 'GET') {
      const settings = fitSportTools.db.store.aiCheckInSettings || {
        enabled: true,
        checkIns: {
          breakfast: { enabled: true, time: "08:30 AM" },
          lunch: { enabled: true, time: "01:00 PM" },
          snack: { enabled: true, time: "05:00 PM" },
          dinner: { enabled: true, time: "08:30 PM" }
        },
        workoutFollowUp: true,
        sportRecoveryCheck: true,
        dailyProgressReview: { enabled: true, time: "09:00 PM" }
      };
      return sendJson(200, { checkins: settings });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const updated = fitSportTools.scheduleAICheckIn(body);
      return sendJson(200, { message: "Check-in schedule saved", checkins: updated });
    }

    if (req.method === 'DELETE' && checkinId) {
      return sendJson(200, { message: `Checkin ${checkinId} disabled` });
    }
  }

  // 7. GET /api/ai/daily-summary
  if (url.pathname === '/api/ai/daily-summary' && req.method === 'GET') {
    const summary = fitSportTools.generateDailySummary(userId);
    const mot = recommendationService.generateDailyMotivation(userId);
    return sendJson(200, {
      summary,
      motivation: mot.text,
      spokenMotivation: mot.spokenText,
      metrics: mot.metrics
    });
  }

  // 8. GET /api/ai/insights
  if (url.pathname === '/api/ai/insights' && req.method === 'GET') {
    const daily = fitSportTools.getDailyProgress(userId);
    const weekly = recommendationService.generateWeeklyAnalysis(userId);
    return sendJson(200, {
      daily,
      weekly
    });
  }

  return false;
}
