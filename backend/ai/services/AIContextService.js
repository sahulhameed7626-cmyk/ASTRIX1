// FitSport AI Context Service: Multi-Turn Conversation Memory & Sessions
import { db } from '../../db.js';
import { getOrCreateConversationState } from '../agent/state.js';

export class AIContextService {
  constructor(dbInstance = db) {
    this.db = dbInstance;
  }

  getSession(userId, conversationId) {
    return getOrCreateConversationState(userId, conversationId);
  }

  saveMessage(conversationId, { role, content, intent, toolName, toolResult, audioUrl }) {
    if (!this.db.store.aiConversations) {
      this.db.store.aiConversations = [];
    }

    const message = {
      id: `aim_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      conversationId: conversationId || `conv_${Date.now()}`,
      role: role || 'assistant',
      content,
      intent: intent || null,
      toolName: toolName || null,
      toolResult: toolResult || null,
      audioUrl: audioUrl || null,
      createdAt: new Date().toISOString()
    };

    this.db.store.aiConversations.push(message);
    if (this.db.store.aiConversations.length > 100) {
      this.db.store.aiConversations.shift();
    }

    this.db.saveStore();
    return message;
  }

  getRecentConversations(userId = 'default_user', limit = 20) {
    const list = this.db.store.aiConversations || [];
    return list.slice(-limit);
  }

  getConversationById(conversationId) {
    const list = this.db.store.aiConversations || [];
    return list.filter(m => m.conversationId === conversationId);
  }

  deleteConversation(conversationId) {
    if (this.db.store.aiConversations) {
      this.db.store.aiConversations = this.db.store.aiConversations.filter(m => m.conversationId !== conversationId);
      this.db.saveStore();
      return true;
    }
    return false;
  }
}

export const aiContextService = new AIContextService();
