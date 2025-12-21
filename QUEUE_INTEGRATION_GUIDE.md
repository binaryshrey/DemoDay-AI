# Integration Guide: Session Queue for Client Components

This guide shows how to integrate the session queue system into your existing Anam client components.

## Overview

The queue system consists of:

1. **Backend**: `sessionQueue.ts` - Manages concurrency limits
2. **API Routes**: Updated `/api/pitch` and `/api/feedback` with queue logic
3. **React Hook**: `useSessionQueue` - Easy integration for components
4. **UI Component**: `QueueStatus` - Shows queue position to users

## Quick Integration

### Step 1: Import the Hook and UI Component

```typescript
import { useSessionQueue } from "@/lib/hooks/useSessionQueue";
import QueueStatus from "@/components/view/QueueStatus";
```

### Step 2: Use in Your Component

```typescript
export default function YourSessionComponent() {
  const {
    isQueued,
    queuePosition,
    estimatedWait,
    sessionConfig,
    error,
    requestSession,
    releaseSession,
    isReady,
  } = useSessionQueue({
    sessionType: "feedback", // or "pitch"
    onSessionReady: (config) => {
      console.log("Session ready!", config);
      // Initialize Anam client with config.anamSessionToken
    },
  });

  // Request session on mount or button click
  useEffect(() => {
    requestSession();
  }, []);

  // Release session on cleanup
  useEffect(() => {
    return () => {
      releaseSession();
    };
  }, [releaseSession]);

  return (
    <div>
      {/* Show queue status */}
      <QueueStatus
        isQueued={isQueued}
        position={queuePosition}
        estimatedWaitSeconds={estimatedWait}
        sessionType="feedback"
      />

      {/* Your session UI */}
      {isReady && <div>Session is ready!</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

## Full Example: FeedbackSessionClient Integration

Here's how to integrate into your existing `FeedbackSessionClient.tsx`:

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@anam-ai/js-sdk";
import type AnamClient from "@anam-ai/js-sdk/dist/module/AnamClient";
import { connectElevenLabs, stopElevenLabs } from "../../lib/elevenlabs";
import { useSessionQueue } from "@/lib/hooks/useSessionQueue";
import QueueStatus from "@/components/view/QueueStatus";

export default function FeedbackSessionClient({ autoStart = false }) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const anamClientRef = useRef<AnamClient | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use the session queue hook
  const {
    isQueued,
    queuePosition,
    estimatedWait,
    sessionConfig,
    error: queueError,
    requestSession,
    releaseSession,
    isReady,
  } = useSessionQueue({
    sessionType: "feedback",
    onSessionReady: async (config) => {
      console.log("[Feedback] Session ready, initializing...");
      await initializeAnamSession(config);
    },
  });

  // Initialize Anam session with config from queue
  const initializeAnamSession = async (config: any) => {
    try {
      const anamClient = createClient(config.anamSessionToken, {
        disableInputAudio: true,
      });

      if (videoRef.current) {
        await anamClient.streamToVideoElement(videoRef.current.id);
        console.log("[Anam] Coach avatar ready");
      }

      anamClientRef.current = anamClient;

      // Connect ElevenLabs
      const agentAudioInputStream = anamClient.createAgentAudioInputStream({
        encoding: "pcm_s16le",
        sampleRate: 16000,
        channels: 1,
      });

      await connectElevenLabs(
        config.elevenLabsAgentId,
        agentAudioInputStream,
        (text) => {
          setMessages((prev) => [...prev, { role: "agent", text }]);
        }
      );

      setIsConnected(true);
      console.log("[Feedback] Session fully initialized");
    } catch (err) {
      console.error("[Feedback] Init error:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize");
    }
  };

  // Request session on mount
  useEffect(() => {
    console.log("[Feedback] Requesting session...");
    requestSession();

    return () => {
      console.log("[Feedback] Component unmounting, cleaning up...");
      cleanup();
    };
  }, []);

  // Cleanup function
  const cleanup = async () => {
    try {
      if (anamClientRef.current) {
        await anamClientRef.current.stopStreaming();
        anamClientRef.current = null;
      }

      await stopElevenLabs();

      // Release the queue slot
      await releaseSession();

      setIsConnected(false);
    } catch (err) {
      console.error("[Feedback] Cleanup error:", err);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    await cleanup();
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      {/* Queue Status Overlay */}
      <QueueStatus
        isQueued={isQueued}
        position={queuePosition}
        estimatedWaitSeconds={estimatedWait}
        sessionType="feedback"
      />

      {/* Error Display */}
      {(error || queueError) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
          {error || queueError}
        </div>
      )}

      {/* Session UI (only show when ready) */}
      {isReady && (
        <div className="container mx-auto p-4">
          {/* Video Avatar */}
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
            <video
              ref={videoRef}
              id="anamVideo"
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Messages */}
          <div className="bg-gray-900 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.role === "agent" ? "text-blue-400" : "text-gray-300"
                }`}
              >
                <strong>{msg.role === "agent" ? "Coach" : "You"}:</strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDisconnect}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Key Integration Points

### 1. Request Session on Mount

```typescript
useEffect(() => {
  requestSession();
}, []);
```

### 2. Release Session on Cleanup

```typescript
useEffect(() => {
  return () => {
    releaseSession();
  };
}, [releaseSession]);
```

### 3. Initialize Anam When Ready

```typescript
onSessionReady: async (config) => {
  const anamClient = createClient(config.anamSessionToken, {
    disableInputAudio: true,
  });
  // ... rest of initialization
};
```

### 4. Show Queue Status

```typescript
<QueueStatus
  isQueued={isQueued}
  position={queuePosition}
  estimatedWaitSeconds={estimatedWait}
  sessionType="feedback"
/>
```

## Testing

### Test Queue with Multiple Users

1. **Terminal 1**: Start dev server

```bash
npm run dev
```

2. **Browser 1**: Navigate to `/pitch-simulation`
3. **Browser 2**: Navigate to `/feedback` (incognito/different browser)
4. **Result**: Browser 2 should show queue UI

### Test Cleanup

1. Start a session
2. Close the tab/browser
3. Open a new session
4. **Result**: Should start immediately (previous session cleaned up)

## Troubleshooting

### Queue not working?

- Check console logs for `[Queue]` messages
- Verify both API routes are updated with queue logic
- Ensure `sessionQueue.ts` is imported correctly

### Sessions not releasing?

- Make sure `releaseSession()` is called in cleanup
- Check that `queueSessionId` is being returned from API
- Look for DELETE endpoint errors in network tab

### UI not showing queue status?

- Verify `isQueued` state is true
- Check QueueStatus component is rendered
- Ensure z-index is high enough (z-50)

## Advanced: Custom Queue Configuration

To adjust concurrency limits (when you upgrade to paid tier):

```typescript
// In lib/sessionQueue.ts
class SessionQueueManager {
  private maxConcurrentSessions = 5; // Change this based on your plan
  // ...
}
```

## Next Steps

1. ✅ Integrate queue into `FeedbackSessionClient.tsx`
2. ✅ Integrate queue into `PitchSimulationClient.tsx`
3. ✅ Test with multiple concurrent users
4. ✅ Add analytics to track queue metrics
5. ✅ Consider upgrading to Anam paid tier for higher limits

## Support

For issues or questions:

- Check the main documentation: `ANAM_CONCURRENCY_SOLUTIONS.md`
- Review console logs for `[Queue]` tagged messages
- Test with single user first, then multiple users
