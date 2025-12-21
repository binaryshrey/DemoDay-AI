/**
 * Session Queue Manager for Anam API
 * Handles concurrency limits by queueing requests when limit is reached
 */

interface QueueItem {
  id: string;
  type: "pitch" | "feedback";
  resolve: (token: string) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

class SessionQueueManager {
  private queue: QueueItem[] = [];
  private activeSessions = new Set<string>();
  private maxConcurrentSessions = 1; // Free tier limit
  private processing = false;

  async requestSession(
    type: "pitch" | "feedback",
    fetchToken: () => Promise<string>
  ): Promise<string> {
    // Check if we can proceed immediately
    if (this.activeSessions.size < this.maxConcurrentSessions) {
      const sessionId = this.generateSessionId();
      this.activeSessions.add(sessionId);

      try {
        const token = await fetchToken();
        return token;
      } catch (error) {
        this.activeSessions.delete(sessionId);
        throw error;
      }
    }

    // Queue the request
    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        id: this.generateSessionId(),
        type,
        resolve: async (token: string) => {
          try {
            resolve(token);
          } catch (error) {
            reject(error as Error);
          }
        },
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(queueItem);
      console.log(
        `[Queue] Added ${type} session to queue. Position: ${this.queue.length}`
      );

      // Start processing if not already
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (
      this.queue.length > 0 &&
      this.activeSessions.size < this.maxConcurrentSessions
    ) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeSessions.add(item.id);
      console.log(`[Queue] Processing ${item.type} session ${item.id}`);

      // Notify the waiting request
      item.resolve(item.id);
    }

    this.processing = false;
  }

  releaseSession(sessionId: string) {
    if (this.activeSessions.has(sessionId)) {
      this.activeSessions.delete(sessionId);
      console.log(
        `[Queue] Released session ${sessionId}. Active: ${this.activeSessions.size}`
      );

      // Process next in queue
      this.processQueue();
    }
  }

  getQueueStatus() {
    return {
      activeCount: this.activeSessions.size,
      queueLength: this.queue.length,
      maxConcurrent: this.maxConcurrentSessions,
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up stale sessions (optional, for safety)
  cleanupStaleSessions(maxAgeMs = 10 * 60 * 1000) {
    // 10 minutes
    const now = Date.now();
    this.queue = this.queue.filter((item) => {
      const age = now - item.timestamp;
      if (age > maxAgeMs) {
        item.reject(new Error("Session request timeout"));
        return false;
      }
      return true;
    });
  }
}

// Singleton instance
export const sessionQueue = new SessionQueueManager();
