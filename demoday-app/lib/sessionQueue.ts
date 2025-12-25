/**
 * Session Queue Manager for Anam API
 * Handles concurrency limits by queueing requests when limit is reached
 */

interface QueueItem {
  id: string;
  type: "pitch" | "feedback";
  resolve: () => void;
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
    const sessionId = this.generateSessionId();

    // Check if we can proceed immediately
    if (this.activeSessions.size < this.maxConcurrentSessions) {
      this.activeSessions.add(sessionId);
      console.log(`[Queue] Immediate session granted: ${sessionId}`);

      try {
        await fetchToken(); // Execute the fetch but don't need the return value
        return sessionId; // Return sessionId for cleanup tracking
      } catch (error) {
        this.activeSessions.delete(sessionId);
        console.error(`[Queue] Failed to fetch token for ${sessionId}:`, error);
        throw error;
      }
    }

    // Queue the request
    console.log(
      `[Queue] Adding ${type} session to queue. Current position: ${
        this.queue.length + 1
      }`
    );

    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        id: sessionId,
        type,
        resolve: async () => {
          this.activeSessions.add(sessionId);
          try {
            await fetchToken();
            resolve(sessionId);
          } catch (error) {
            this.activeSessions.delete(sessionId);
            reject(error as Error);
          }
        },
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(queueItem);

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

      console.log(`[Queue] Processing ${item.type} session ${item.id}`);

      // Call the resolve function which will fetch the token and add to active sessions
      item.resolve();
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
