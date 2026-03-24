/**
 * Message Queue — Shared store for cross-surface messaging
 *
 * Allows dashboard check-in chips, buddy cards, and parent cards to
 * send messages that appear in the Messaging surface's thread list.
 *
 * Pattern:
 *   1. Dashboard chip calls queueMessage({ recipientId, recipientName, content, senderRole })
 *   2. Messaging surface calls consumeMessages() on mount to inject queued messages
 *   3. Messages are stored in localStorage so they survive navigation
 *
 * Used by:
 *   - EdgeParent dashboard → child check-in chips
 *   - BuddyDashboardCard → buddy check-in chips
 *   - Messaging surface → reads and injects into thread list
 */

const STORAGE_KEY = "ce-message-queue";

export interface QueuedMessage {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientInitial: string;
  content: string;
  senderRole: string;
  timestamp: number;
  threadType: "dm";
}

/** Queue a message to be delivered to the Messaging surface */
export function queueMessage(msg: Omit<QueuedMessage, "id" | "timestamp">): QueuedMessage {
  const full: QueuedMessage = {
    ...msg,
    id: `qm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as QueuedMessage[];
    existing.push(full);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {}
  return full;
}

/** Read all queued messages (does not remove them) */
export function peekMessages(): QueuedMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as QueuedMessage[];
  } catch {
    return [];
  }
}

/** Consume (read + clear) all queued messages */
export function consumeMessages(): QueuedMessage[] {
  try {
    const msgs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as QueuedMessage[];
    localStorage.removeItem(STORAGE_KEY);
    return msgs;
  } catch {
    return [];
  }
}

/** Get count of unread queued messages for badge display */
export function queuedCount(): number {
  return peekMessages().length;
}
