// FitSport AI Voice Coach — Voice-Powered Fitness and Sports Companion
import { appState } from "./state.js";
import { SPORTS_DATA } from "./data.js";

class FitSportAICoach {
  constructor() {
    this.isOpen = false;
    this.isListening = false;
    this.isSpeaking = false;
    this.voiceEnabled = true;
    this.currentState = "idle"; // idle, listening, processing, speaking, saved, error
    this.sessionContext = {}; // multi-turn conversation memory
    this.speechRecognition = null;
    this.speechSilenceTimer = null;
    this.restartTimer = null;
    this.manualStop = false;
    this.latestRecognizedText = '';
    this.lastTriggeredCheckIn = {};

    this.settings = {
      enabled: true,
      voiceEnabled: true,
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

    this.initSpeechEngine();
    this.initScheduler();
  }

  /**
   * Initialize Web Speech Recognition & Speech Synthesis
   */
  initSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.speechRecognition = new SpeechRecognition();
        const isMobileOrSafari = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (!window.chrome && Boolean(window.webkitSpeechRecognition));
        this.speechRecognition.continuous = !isMobileOrSafari;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.maxAlternatives = 1;

        // Auto-detect browser/system language with 'en-US' fallback
        const systemLang = navigator.language || navigator.userLanguage || 'en-US';
        this.speechRecognition.lang = systemLang.startsWith('en') ? systemLang : 'en-US';

        this.speechRecognition.onstart = () => {
          console.log(`[FitSport Voice] Web Speech Recognition active (lang: ${this.speechRecognition.lang}, continuous: ${this.speechRecognition.continuous})`);
          this.isListening = true;
          this.updateState("listening", "🎙️ Listening... Speak naturally now");
          const textInput = document.getElementById("aiCoachTextInput");
          if (textInput && !textInput.value) {
            textInput.placeholder = "Listening... Speak naturally (e.g. 'I had 2 boiled eggs')";
          }
        };

        this.speechRecognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          let hasFinal = false;
          for (let i = 0; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript + ' ';
              hasFinal = true;
            } else {
              interimTranscript += res[0].transcript;
            }
          }
          const cleanWords = (finalTranscript + interimTranscript).trim();

          if (cleanWords) {
            console.log("[FitSport Voice] Live transcript:", cleanWords);
            this.latestRecognizedText = cleanWords;
            const textInput = document.getElementById("aiCoachTextInput");
            if (textInput) {
              textInput.value = cleanWords;
            }

            // Real-time visual feedback in status bar
            this.updateState("listening", `"${cleanWords}"`);

            // Auto-dispatch after natural pause: 850ms if sentence finalized, 1600ms if interim
            clearTimeout(this.speechSilenceTimer);
            const pauseMs = hasFinal ? 850 : 1600;
            this.speechSilenceTimer = setTimeout(() => {
              if (this.isListening && !this.manualStop && this.latestRecognizedText) {
                console.log("[FitSport Voice] Speech pause detected. Dispatching:", this.latestRecognizedText);
                this.dispatchCurrentSpeech();
              }
            }, pauseMs);
          }
        };

        this.speechRecognition.onerror = (event) => {
          console.warn("[FitSport Voice] Recognition error:", event.error);

          if (event.error === 'no-speech') {
            // Chrome fires no-speech on silence. Keep listening; onend will keep the engine alive.
            if (!this.latestRecognizedText) {
              this.updateState("listening", "🎙️ Listening... Please speak into your microphone");
            }
            return;
          }

          if (event.error === 'aborted') {
            // Harmless abort during restart or manual stop
            return;
          }

          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.manualStop = true;
            this.isListening = false;
            clearTimeout(this.speechSilenceTimer);
            clearTimeout(this.restartTimer);
            this.updateState("error", "Microphone access blocked. Click the lock/tune icon in browser address bar and Allow Microphone.");
            return;
          }

          if (event.error === 'audio-capture') {
            this.manualStop = true;
            this.isListening = false;
            clearTimeout(this.speechSilenceTimer);
            clearTimeout(this.restartTimer);
            this.updateState("error", "No microphone detected. Please connect or enable your microphone in Windows sound settings.");
            return;
          }

          if (event.error === 'network') {
            console.warn("[FitSport Voice] Network error from speech service.");
            if (!this.latestRecognizedText) {
              this.updateState("error", "Speech network error. Please check internet connection or type below.");
            }
            return;
          }

          // Any other error: if we already got text, dispatch it; else show error
          if (this.latestRecognizedText) {
            this.dispatchCurrentSpeech();
          } else {
            this.updateState("error", `Voice issue (${event.error}). Tap mic to speak again or type below.`);
          }
        };

        this.speechRecognition.onend = () => {
          clearTimeout(this.speechSilenceTimer);
          console.log("[FitSport Voice] onend. isListening:", this.isListening, "manualStop:", this.manualStop, "hasText:", !!this.latestRecognizedText);

          if (this.manualStop) {
            this.isListening = false;
            if (this.currentState === "listening") {
              this.updateState("idle", "Tap to talk");
            }
            return;
          }

          if (this.isListening) {
            // If user has spoken text, dispatch it
            if (this.latestRecognizedText && this.latestRecognizedText.trim()) {
              this.dispatchCurrentSpeech();
              return;
            }

            // Keep-alive: if no speech yet and not manually stopped, auto-restart!
            clearTimeout(this.restartTimer);
            this.restartTimer = setTimeout(() => {
              if (this.isListening && !this.manualStop) {
                try {
                  this.speechRecognition.start();
                  console.log("[FitSport Voice] Keep-alive re-activated microphone listening.");
                } catch (e) {
                  // Already starting/running
                }
              }
            }, 150);
          }
        };
      } catch (e) {
        console.warn("[FitSport Voice] SpeechRecognition init error:", e);
      }
    } else {
      console.info("[FitSport Voice] Web SpeechRecognition not supported in this browser. Falling back to text/audio recording.");
    }
  }

  /**
   * Check-in Scheduler: Runs check-ins at configured times
   */
  initScheduler() {
    // Check every 30 seconds
    setInterval(() => {
      this.evaluateScheduledCheckIns();
    }, 30000);
  }

  evaluateScheduledCheckIns() {
    if (!this.settings.enabled || !appState.isSessionLoggedIn()) return;

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Format current time to "HH:MM AM/PM"
    const period = currentHours >= 12 ? 'PM' : 'AM';
    const h12 = (currentHours % 12) || 12;
    const formattedNow = `${String(h12).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')} ${period}`;

    // Check Meal Check-ins
    const checkIns = this.settings.checkIns || {};
    for (const [mealKey, config] of Object.entries(checkIns)) {
      if (config.enabled && config.time) {
        const triggerKey = `${todayKey}_${mealKey}`;
        if (!this.lastTriggeredCheckIn[triggerKey] && this.isTimeMatch(config.time, formattedNow)) {
          this.lastTriggeredCheckIn[triggerKey] = true;
          this.triggerMealCheckIn(mealKey);
          return;
        }
      }
    }

    // Check Daily Review
    const revConfig = this.settings.dailyProgressReview;
    if (revConfig?.enabled && revConfig.time) {
      const triggerKey = `${todayKey}_daily_review`;
      if (!this.lastTriggeredCheckIn[triggerKey] && this.isTimeMatch(revConfig.time, formattedNow)) {
        this.lastTriggeredCheckIn[triggerKey] = true;
        this.triggerDailyReview();
      }
    }
  }

  isTimeMatch(targetTime, currentTime) {
    if (!targetTime || !currentTime) return false;
    const normTarget = targetTime.trim().toUpperCase().replace(/^0/, '');
    const normCurrent = currentTime.trim().toUpperCase().replace(/^0/, '');
    return normTarget === normCurrent;
  }

  triggerMealCheckIn(mealKey) {
    this.openPanel();
    this.sessionContext = { targetMealType: mealKey };

    const mealTitles = {
      breakfast: "Good morning! It's time to record your breakfast. Tell me what you ate.",
      lunch: "It's lunch time! What did you have for lunch?",
      snack: "Afternoon check-in: tell me what you had for your snack.",
      dinner: "Good evening! Let's record your dinner. What did you eat tonight?"
    };

    const promptText = mealTitles[mealKey] || `Tell me what you had for ${mealKey}.`;
    this.appendAgentMessage(promptText, { isCheckIn: true, mealKey });
    this.speak(promptText, () => {
      // Auto-listen after prompt if supported and voice enabled
      if (this.voiceEnabled) {
        this.startListening();
      }
    });
  }

  triggerDailyReview() {
    this.openPanel();
    this.sendUserMessage("Daily Review", true);
  }

  triggerPostWorkoutCheck(workoutTitle) {
    if (!this.settings.workoutFollowUp) return;
    this.openPanel();
    const prompt = `Nice work! You've completed your ${workoutTitle || 'workout'}. How are you feeling?`;
    this.appendAgentMessage(prompt);
    this.speak(prompt);
  }

  triggerPreSportCheck(sportId) {
    if (!this.settings.sportRecoveryCheck) return;
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
    const todayWorkouts = appState.state.workouts || [];
    if (todayWorkouts.length > 0) {
      const latestWk = todayWorkouts[todayWorkouts.length - 1];
      this.openPanel();
      this.checkOverlap(latestWk.title, sport.name);
    }
  }

  /**
   * Speech Recognition & Audio Recording Controls (Section 16)
   */
  async startListening() {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    this.manualStop = false;
    this.isListening = true;
    this.latestRecognizedText = '';
    clearTimeout(this.speechSilenceTimer);
    clearTimeout(this.restartTimer);

    const textInput = document.getElementById("aiCoachTextInput");
    if (textInput) {
      textInput.value = '';
      textInput.placeholder = "Listening... Speak naturally (e.g. 'I had 2 boiled eggs and rice')";
    }
    this.updateState("listening", "🎙️ Listening... Speak naturally now");

    // Primary: Web Speech API (Direct, zero-latency, no device locking)
    if (this.speechRecognition) {
      try {
        this.speechRecognition.start();
        console.log("[FitSport Voice] Web Speech started successfully.");
        return;
      } catch (e) {
        if (e.name === 'InvalidStateError') {
          // Already running or restarting
          try {
            this.speechRecognition.stop();
            setTimeout(() => {
              if (this.isListening && !this.manualStop) {
                try { this.speechRecognition.start(); } catch (err) {}
              }
            }, 150);
          } catch (err) {}
          return;
        } else {
          console.warn("[FitSport Voice] speechRecognition start error, falling back to MediaRecorder:", e);
        }
      }
    }

    // Fallback: MediaRecorder for browsers without Web Speech Recognition
    await this.startMediaRecorderFallback();
  }

  async startMediaRecorderFallback() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.isListening = false;
      this.updateState("error", "Voice input is not supported in this browser. Please use Chrome/Edge or type below.");
      return;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      const mimeType = (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')) ? 'audio/webm'
                     : (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/mp4')) ? 'audio/mp4'
                     : (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/ogg')) ? 'audio/ogg'
                     : '';
      this.mediaRecorder = new MediaRecorder(this.mediaStream, mimeType ? { mimeType } : undefined);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.audioChunks.push(e.data);
      };
      this.mediaRecorder.start();
      console.log("[FitSport Voice] MediaRecorder fallback started with mimeType:", mimeType || "default");
      this.updateState("listening", "🎙️ Recording audio... Tap mic when done");
    } catch (err) {
      console.warn("[FitSport Voice] Microphone permission / recording warning:", err.message);
      this.isListening = false;
      this.updateState("error", "Microphone access blocked. Click lock icon in browser address bar to Allow Microphone.");
    }
  }

  async dispatchCurrentSpeech() {
    this.manualStop = true;
    this.isListening = false;
    clearTimeout(this.speechSilenceTimer);
    clearTimeout(this.restartTimer);

    const textInput = document.getElementById("aiCoachTextInput");
    let toSend = (this.latestRecognizedText || textInput?.value || '').trim();

    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch (e) {}
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (e) {}
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      } catch (e) {}
    }

    this.latestRecognizedText = '';

    // If fallback MediaRecorder was used and no text yet, transcribe via backend
    if (!toSend && this.audioChunks && this.audioChunks.length > 0) {
      try {
        this.updateState("processing", "Transcribing audio...");
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        const reader = new FileReader();
        toSend = await new Promise(resolve => {
          reader.onloadend = async () => {
            try {
              const res = await fetch('/api/ai/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: reader.result })
              });
              const data = await res.json();
              resolve(data.transcript || data.text || '');
            } catch (err) {
              resolve('');
            }
          };
          reader.readAsDataURL(audioBlob);
        });
      } catch (err) {
        console.warn("[FitSport Voice] Fallback transcription error:", err);
      }
    }

    if (toSend) {
      if (textInput) {
        textInput.value = '';
        textInput.placeholder = "Tell me what you ate (e.g. 2 eggs, rice)...";
      }
      this.updateState("processing", `Understanding: "${toSend}"...`);
      await this.handleUserVoiceInput(toSend);
    } else {
      if (textInput) {
        textInput.placeholder = "Tell me what you ate (e.g. 2 eggs, rice)...";
      }
      if (this.currentState === "listening") {
        this.updateState("idle", "Tap to talk");
      }
    }
  }

  stopListening() {
    this.manualStop = true;
    this.isListening = false;
    clearTimeout(this.speechSilenceTimer);
    clearTimeout(this.restartTimer);

    if (this.speechRecognition) {
      try {
        this.speechRecognition.stop();
      } catch (e) {}
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      } catch (e) {}
    }

    this.latestRecognizedText = '';
    this.updateState("idle");
    const textInput = document.getElementById("aiCoachTextInput");
    if (textInput) textInput.placeholder = "Tell me what you ate (e.g. 2 eggs, rice)...";
  }

  toggleListening() {
    if (this.isListening) {
      this.dispatchCurrentSpeech();
    } else {
      this.startListening();
    }
  }

  /**
   * Text-to-Speech Engine
   */
  speak(text, onComplete) {
    if (!this.voiceEnabled || !window.speechSynthesis) {
      if (onComplete) onComplete();
      return;
    }

    // Stop existing speech
    this.stopSpeaking();

    // Clean markdown/special characters for clear speech pronunciation
    const cleanSpeech = text
      .replace(/[*_#`~]/g, '')
      .replace(/•/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Select natural sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")) && v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateState("speaking");
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateState("idle");
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateState("idle");
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.currentState === "speaking") {
      this.updateState("idle");
    }
  }

  toggleVoiceMute() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    }
    this.updateVoiceToggleUI();
  }

  /**
   * Update Agent UI State Indicator
   */
  updateState(state, customText) {
    this.currentState = state;
    const statusTextEl = document.getElementById("aiCoachStatusText");
    const statusDotEl = document.getElementById("aiCoachStatusDot");
    const waveEl = document.getElementById("aiCoachSoundWave");
    const micBtn = document.getElementById("aiCoachMicBtn");

    const stateTexts = {
      idle: "Tap to talk",
      listening: "Listening...",
      processing: "Understanding...",
      searching: "Searching nutrition database...",
      analyzing: "Analyzing athletic impact...",
      speaking: "AI Coach is speaking...",
      saved: "Saved to Common History ✓",
      error: "I couldn't understand that. Please try again."
    };

    if (statusTextEl) {
      statusTextEl.textContent = customText || stateTexts[state] || stateTexts.idle;
    }

    if (statusDotEl) {
      statusDotEl.className = `ai-status-dot ${state}`;
    }

    if (waveEl) {
      if (state === "listening" || state === "speaking") {
        waveEl.classList.add("active");
      } else {
        waveEl.classList.remove("active");
      }
    }

    if (micBtn) {
      if (state === "listening") {
        micBtn.classList.add("listening");
      } else {
        micBtn.classList.remove("listening");
      }
    }
  }

  /**
   * Process Natural Language Input
   */
  async handleUserVoiceInput(transcript) {
    if (!transcript || !transcript.trim()) return;
    this.appendUserMessage(transcript);
    await this.sendToAgent(transcript);
  }

  async sendUserMessage(text, isAutomated = false) {
    if (!text || !text.trim()) return;
    if (!isAutomated) {
      this.appendUserMessage(text);
    }
    await this.sendToAgent(text);
  }

  async sendToAgent(message) {
    this.updateState("processing");

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionContext: this.sessionContext
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      this.sessionContext = {
        missingInformation: result.missingInformation || null
      };

      const replyText = result.response || result.text || "Processed.";
      const spoken = result.spokenText || replyText;

      // Render agent visual response
      this.appendAgentMessage(replyText, result.actions, result.intent);

      // Speak response if voice output enabled
      if (this.voiceEnabled) {
        if (result.audioUrl) {
          const audio = new Audio(result.audioUrl);
          audio.play().catch(() => this.speak(spoken));
        } else {
          this.speak(spoken);
        }
      }

      // If action updated database, record in appState & Common History
      if (result.actions && result.actions.length > 0) {
        for (const act of result.actions) {
          if (typeof appState.recordAiAction === "function") {
            appState.recordAiAction(act);
          }
        }
        this.updateState("saved", "Saved to Common History ✓");
        await appState.syncWithBackend();
        appState.notify();
        if (window.fitSportApp && typeof window.fitSportApp.renderAllDynamicComponents === "function") {
          window.fitSportApp.renderAllDynamicComponents();
        }
        setTimeout(() => this.updateState("idle"), 2400);
      } else {
        this.updateState("idle");
      }

    } catch (err) {
      console.error("AI Coach request error:", err);
      const errorMsg = "I couldn't process that right now. Please check your connection or try again.";
      this.appendAgentMessage(errorMsg);
      this.updateState("error", errorMsg);
    }
  }

  async checkOverlap(workout, sport) {
    this.updateState("processing");
    try {
      const res = await fetch('/api/ai/overlap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout, sport })
      });
      const data = await res.json();
      this.appendAgentMessage(data.recommendation, data, "OVERLAP_ANALYSIS");
      this.speak(data.spokenRecommendation || data.recommendation);
    } catch (e) {
      console.error("Overlap check failed:", e);
    }
  }

  /**
   * UI Message Bubbles & Cards
   */
  appendUserMessage(text) {
    const list = document.getElementById("aiCoachMessagesList");
    if (!list) return;

    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble user";
    bubble.innerHTML = `
      <div class="ai-msg-content">${this.escapeHtml(text)}</div>
      <div class="ai-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    list.appendChild(bubble);
    this.scrollChatToBottom();
  }

  appendAgentMessage(text, cardData = null, action = null) {
    const list = document.getElementById("aiCoachMessagesList");
    if (!list) return;

    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble agent";

    let cardHtml = "";

    // 1. Structured Meal Preview Card
    if (action === "MEAL_SAVED" && cardData) {
      const foods = cardData.foods || (cardData.mealItem ? [cardData.mealItem] : []);
      cardHtml = `
        <div class="ai-meal-preview-card">
          <div class="ai-card-badge">MEAL RECORDED ✓</div>
          <div class="ai-meal-title">${cardData.category ? cardData.category.toUpperCase() : 'MEAL'}</div>
          <div class="ai-meal-food-list">
            ${foods.map(f => `
              <div class="ai-meal-food-row">
                <span>• ${f.quantity ? `${f.quantity} ` : ''}${f.name} (${f.grams}g)</span>
                <span class="ai-food-metrics">${f.calories} kcal • ${f.protein}g P</span>
              </div>
            `).join('')}
          </div>
          <div class="ai-meal-footer">
            <span>Calories: <strong>${cardData.totalCalories || 0} kcal</strong></span>
            <span>Protein: <strong>${cardData.totalProtein || 0}g</strong></span>
          </div>
        </div>
      `;
    }

    // 2. Structured Workout <-> Sport Overlap Card
    if (action === "OVERLAP_ANALYSIS" && cardData) {
      const badgeColor = cardData.overlapLevel === "High" ? "#ff5555" : (cardData.overlapLevel === "Moderate" ? "#f59e0b" : "#1FB622");
      cardHtml = `
        <div class="ai-overlap-card">
          <div class="ai-overlap-header">
            <span class="ai-card-badge" style="background: rgba(255,255,255,0.08); color: ${badgeColor}; border: 1px solid ${badgeColor};">
              OVERLAP: ${cardData.overlapLevel.toUpperCase()}
            </span>
            <span class="ai-overlap-tag">Biomechanical Kinetic Analysis</span>
          </div>
          <div class="ai-overlap-grid">
            <div class="ai-overlap-col">
              <span class="col-label">Workout Trained</span>
              <span class="col-val">${cardData.workout}</span>
              <span class="col-sub">${(cardData.musclesTrained || []).slice(0, 3).join(', ')}</span>
            </div>
            <div class="ai-overlap-arrow">⚡</div>
            <div class="ai-overlap-col">
              <span class="col-label">Target Sport</span>
              <span class="col-val">${cardData.sport}</span>
              <span class="col-sub">${(cardData.sportMuscles || []).slice(0, 3).join(', ')}</span>
            </div>
          </div>
          ${cardData.sharedMuscles && cardData.sharedMuscles.length > 0 ? `
            <div class="ai-overlap-shared">
              <span>Shared Muscles: <strong>${cardData.sharedMuscles.join(', ')}</strong></span>
            </div>
          ` : ''}
          <div class="ai-overlap-rec">
            💡 <strong>Recovery Guidance:</strong> ${cardData.recommendation}
          </div>
        </div>
      `;
    }

    // 3. Structured Progress Card
    if (action === "DAILY_PROGRESS_MOTIVATION" && cardData) {
      const nut = cardData.nutrition?.percentages || {};
      cardHtml = `
        <div class="ai-progress-preview-card">
          <div class="ai-card-badge">DAILY ATHLETIC SUMMARY</div>
          <div class="ai-prog-grid">
            <div class="ai-prog-item">
              <span class="prog-num">${nut.calories || 0}%</span>
              <span class="prog-lbl">Calories</span>
            </div>
            <div class="ai-prog-item">
              <span class="prog-num text-green">${nut.protein || 0}%</span>
              <span class="prog-lbl">Protein</span>
            </div>
            <div class="ai-prog-item">
              <span class="prog-num">${cardData.water?.percent || 0}%</span>
              <span class="prog-lbl">Hydration</span>
            </div>
            <div class="ai-prog-item">
              <span class="prog-num">${cardData.caloriesBurned || 0}</span>
              <span class="prog-lbl">Burned kcal</span>
            </div>
          </div>
        </div>
      `;
    }

    bubble.innerHTML = `
      <div class="ai-msg-avatar">🎙️</div>
      <div class="ai-msg-content">
        <div class="ai-msg-text">${this.formatMarkdown(text)}</div>
        ${cardHtml}
      </div>
      <div class="ai-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;

    list.appendChild(bubble);
    this.scrollChatToBottom();
  }

  scrollChatToBottom() {
    const list = document.getElementById("aiCoachMessagesList");
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  formatMarkdown(text) {
    return this.escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  /**
   * Panel Open/Close & Controls
   */
  openPanel() {
    this.isOpen = true;
    const panel = document.getElementById("aiCoachPanel");
    const fab = document.getElementById("aiCoachFab");
    if (panel) panel.classList.add("active");
    if (fab) fab.classList.add("panel-open");

    // Initial greeting if empty
    const list = document.getElementById("aiCoachMessagesList");
    if (list && list.children.length === 0) {
      const user = appState.state.user || {};
      const greeting = `Hello ${user.name ? user.name.split(' ')[0] : 'Athlete'}! I'm your FitSport AI Voice Coach. ` +
        `Tell me what you ate, check your workout-sport recovery overlap, or ask how your progress is today.`;
      this.appendAgentMessage(greeting);
    }

    this.scrollChatToBottom();
  }

  closePanel() {
    this.isOpen = false;
    const panel = document.getElementById("aiCoachPanel");
    const fab = document.getElementById("aiCoachFab");
    if (panel) panel.classList.remove("active");
    if (fab) fab.classList.remove("panel-open");
    this.stopListening();
    this.stopSpeaking();
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  updateVoiceToggleUI() {
    const btn = document.getElementById("aiCoachVoiceToggleBtn");
    if (btn) {
      btn.innerHTML = this.voiceEnabled 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      btn.title = this.voiceEnabled ? "Voice output enabled (Click to mute)" : "Voice output muted (Click to unmute)";
      btn.classList.toggle("muted", !this.voiceEnabled);
    }
  }

  /**
   * Bind event listeners in DOM
   */
  bindUIEvents() {
    // FAB Toggle
    document.getElementById("aiCoachFab")?.addEventListener("click", () => {
      this.togglePanel();
    });

    // Close button
    document.getElementById("aiCoachCloseBtn")?.addEventListener("click", () => {
      this.closePanel();
    });

    // Mic button
    document.getElementById("aiCoachMicBtn")?.addEventListener("click", () => {
      this.toggleListening();
    });

    // Voice mute toggle
    document.getElementById("aiCoachVoiceToggleBtn")?.addEventListener("click", () => {
      this.toggleVoiceMute();
    });

    // Stop speaking button
    document.getElementById("aiCoachStopBtn")?.addEventListener("click", () => {
      this.stopSpeaking();
    });

    // Text Input & Send
    const textInput = document.getElementById("aiCoachTextInput");
    const sendBtn = document.getElementById("aiCoachSendBtn");

    const doSend = () => {
      const val = textInput?.value?.trim();
      if (val) {
        textInput.value = "";
        this.sendUserMessage(val);
      }
    };

    sendBtn?.addEventListener("click", doSend);
    textInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    });

    // Quick action chips
    document.querySelectorAll(".ai-chip-btn").forEach(chip => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-query");
        if (query) {
          this.sendUserMessage(query);
        }
      });
    });

    // Load initial settings from server
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const res = await fetch('/api/ai/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
          this.voiceEnabled = this.settings.voiceEnabled !== false;
          this.updateVoiceToggleUI();
        }
      }
    } catch (e) {
      console.warn("Could not load AI settings from backend:", e);
    }
  }

  async saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.voiceEnabled = this.settings.voiceEnabled !== false;
    this.updateVoiceToggleUI();

    try {
      await fetch('/api/ai/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.settings)
      });
    } catch (e) {
      console.warn("Could not save AI settings to backend:", e);
    }
  }
}

export const aiCoach = new FitSportAICoach();
