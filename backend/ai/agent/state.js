// FitSport AI Agent State & Multi-Turn Context Management
export const MAX_AGENT_STEPS = 8;

export class AgentState {
  constructor(userId, conversationId = null) {
    this.userId = userId || "default_user";
    this.conversationId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.currentIntent = null;
    this.currentMeal = null; // 'breakfast', 'lunch', 'snacks', 'dinner'
    this.pendingItems = []; // [{ foodName: 'rice', mealType: 'lunch' }, { foodName: 'chicken', mealType: 'lunch' }]
    this.recordedItems = []; // [{ foodName: 'rice', quantity: 1, unit: 'cup', grams: 160, ... }]
    this.missingInformation = null; // current item requiring user clarification
    this.pendingEntities = {};
    this.lastToolResults = null;
    this.stepCount = 0;
    this.actionStatus = "IDLE"; // IDLE, LISTENING, RECORDING, PROCESSING, SEARCHING, ANALYZING, SPEAKING, SAVED, ERROR
    this.history = [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  updateIntent(intent) {
    this.currentIntent = intent;
    this.updatedAt = new Date().toISOString();
  }

  setPendingItems(items, mealType = 'lunch') {
    this.currentMeal = mealType;
    this.pendingItems = Array.isArray(items) ? [...items] : [items];
    this.recordedItems = [];
    if (this.pendingItems.length > 0) {
      const next = this.pendingItems[0];
      this.missingInformation = {
        field: 'quantity',
        foodName: typeof next === 'string' ? next : (next.foodName || next.name),
        mealType
      };
    } else {
      this.missingInformation = null;
    }
    this.updatedAt = new Date().toISOString();
  }

  setMissingInfo(info) {
    this.missingInformation = info;
    if (info && info.foodName && (!this.pendingItems || this.pendingItems.length === 0)) {
      this.pendingItems = [{ foodName: info.foodName, mealType: info.mealType || this.currentMeal || 'lunch' }];
    }
    this.updatedAt = new Date().toISOString();
  }

  resolveCurrentPendingItem(resolvedItem) {
    this.recordedItems.push(resolvedItem);
    if (this.pendingItems.length > 0) {
      this.pendingItems.shift();
    }

    if (this.pendingItems.length > 0) {
      const next = this.pendingItems[0];
      this.missingInformation = {
        field: 'quantity',
        foodName: typeof next === 'string' ? next : (next.foodName || next.name),
        mealType: resolvedItem.mealType || this.currentMeal || 'lunch'
      };
      this.updatedAt = new Date().toISOString();
      return {
        hasMore: true,
        nextFood: this.missingInformation.foodName,
        allRecorded: this.recordedItems
      };
    } else {
      this.missingInformation = null;
      this.updatedAt = new Date().toISOString();
      return {
        hasMore: false,
        allRecorded: this.recordedItems
      };
    }
  }

  clearMissingInfo() {
    this.missingInformation = null;
    this.pendingItems = [];
    this.recordedItems = [];
    this.updatedAt = new Date().toISOString();
  }

  incrementStep() {
    this.stepCount += 1;
    if (this.stepCount > MAX_AGENT_STEPS) {
      throw new Error(`Maximum agent steps limit (${MAX_AGENT_STEPS}) exceeded.`);
    }
    return this.stepCount;
  }

  resetStep() {
    this.stepCount = 0;
  }

  addMessage(role, content, extra = {}) {
    this.history.push({
      role, // 'user' | 'assistant' | 'system' | 'tool'
      content,
      ...extra,
      timestamp: new Date().toISOString()
    });
    if (this.history.length > 50) {
      this.history.shift();
    }
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      userId: this.userId,
      conversationId: this.conversationId,
      currentIntent: this.currentIntent,
      currentMeal: this.currentMeal,
      missingInformation: this.missingInformation,
      pendingItems: this.pendingItems,
      recordedItems: this.recordedItems,
      actionStatus: this.actionStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory conversation state cache
export const activeConversations = new Map();

export function getOrCreateConversationState(userId, conversationId) {
  const key = conversationId || `${userId}_active`;
  if (!activeConversations.has(key)) {
    activeConversations.set(key, new AgentState(userId, conversationId));
  }
  return activeConversations.get(key);
}
