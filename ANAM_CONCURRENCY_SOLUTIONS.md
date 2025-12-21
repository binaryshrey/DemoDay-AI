# Handling Anam API Concurrency Limits on Free Tier

## Problem

Even with two different Anam API keys (one for investor avatar, one for coach avatar), you're hitting concurrency limits. This is because Anam's free tier has an **account-wide concurrency limit** (typically 1 concurrent session), not a per-API-key limit.

## Solutions

### ✅ Solution 1: Session Queueing (Implemented)

**Best for: Free tier users who want a working solution immediately**

We've implemented a session queue manager that ensures only one Anam session runs at a time. When a user tries to start a session while another is active, they're placed in a queue.

**Files Created/Modified:**

- `lib/sessionQueue.ts` - Queue manager
- `app/api/feedback/route.ts` - Updated to use queue
- `app/api/pitch/route.ts` - Updated to use queue

**How it works:**

1. User requests a session (pitch or feedback)
2. Queue checks if under concurrency limit (1 for free tier)
3. If available, session starts immediately
4. If not, request is queued and processed when a slot opens
5. When user ends session, next queued request is processed

**Client-side implementation needed:**
You'll need to update the client components to:

1. Store the `queueSessionId` from the API response
2. Call the DELETE endpoint when session ends
3. Show queue position to user (optional but recommended)

### 🎯 Solution 2: Retry with Exponential Backoff

**Best for: Quick fix without major refactoring**

Add retry logic when you hit the concurrency limit:

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        // Rate limit
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000); // Max 10s
        console.log(`Rate limited, retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }
}
```

### 💰 Solution 3: Upgrade to Paid Tier

**Best for: Production apps with multiple users**

Anam's paid tiers offer:

- Higher concurrency limits (5-10+ concurrent sessions)
- Better SLA and support
- More API calls per month

**Cost considerations:**

- Check Anam's pricing page for current rates
- Calculate expected concurrent users
- Factor in peak usage times

### 🔀 Solution 4: Multiple Anam Accounts

**Best for: Testing/development with separate teams**

⚠️ **Warning:** Check Anam's Terms of Service before doing this!

Create separate Anam accounts with different email addresses:

- Account A: Investor avatar
- Account B: Coach avatar

**Pros:**

- Each account gets its own concurrency limit
- Free tier on both accounts

**Cons:**

- May violate ToS
- Hard to manage multiple accounts
- Not scalable

### 🎨 Solution 5: Session Scheduling

**Best for: Apps with predictable usage patterns**

Implement time-slot booking:

- Users book 30-minute slots for pitch practice
- No concurrent sessions during same time slot
- Calendar integration for scheduling

### 🔄 Solution 6: Alternative Avatar Provider

**Best for: Long-term flexibility**

Consider these alternatives with better free tiers:

- **Synthesia** - Higher limits, different pricing model
- **D-ID** - Video avatar generation
- **HeyGen** - Interactive avatars
- **Tavus** - AI video conversations

Compare based on:

- Concurrency limits
- Price per session
- Quality of avatars
- API ease of use

## Recommended Approach

### For Immediate Fix (Free Tier):

1. ✅ Use **Solution 1: Session Queueing** (already implemented)
2. Add **Solution 2: Retry with Backoff** as a fallback
3. Show users their queue position with a friendly message

### For Production Launch:

1. Start with **Solution 1** to validate product
2. Monitor concurrent session metrics
3. When you hit consistent bottlenecks, upgrade to **Solution 3: Paid Tier**

### For Scaling:

1. Upgrade to Anam paid tier
2. Implement load balancing across multiple API keys (if supported)
3. Add analytics to monitor usage patterns
4. Consider **Solution 6** if costs become prohibitive

## Implementation Checklist

- [x] Created session queue manager
- [x] Updated API routes to use queue
- [ ] Update client components to handle queueing
- [ ] Add DELETE calls when sessions end
- [ ] Show queue position in UI
- [ ] Add loading states for queued sessions
- [ ] Test with concurrent users
- [ ] Add monitoring/analytics
- [ ] Document for users

## Testing the Queue

1. Open two browser windows
2. Start a pitch session in window 1
3. Try to start a feedback session in window 2
4. Window 2 should queue and wait
5. End session in window 1
6. Window 2 should automatically start

## Next Steps

### Client Component Updates Needed:

**FeedbackSessionClient.tsx:**

```typescript
const [queueSessionId, setQueueSessionId] = useState<string | null>(null);

// In initializeSession:
const config = await res.json();
setQueueSessionId(config.queueSessionId);

// In cleanup/disconnect:
if (queueSessionId) {
  await fetch("/api/feedback", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: queueSessionId }),
  });
}
```

**PitchSimulationClient.tsx:**

```typescript
// Same pattern as above
```

## Monitoring

Add these logs to track queue behavior:

- Session start/end times
- Queue wait times
- Concurrent session attempts
- Queue overflow scenarios

## FAQ

**Q: Will users see delays?**
A: Yes, if one session is active, others will wait. Show queue position and estimated wait time.

**Q: What happens if someone closes their browser?**
A: Implement session timeout cleanup (already in queue manager with `cleanupStaleSessions`)

**Q: Can I increase maxConcurrentSessions?**
A: Not on free tier. The queue manager is set to 1. If you upgrade to paid tier, update:

```typescript
private maxConcurrentSessions = 5; // Update based on your plan
```

**Q: What if the queue gets too long?**
A: Add a max queue length and reject new requests with a friendly message to try later.

## Resources

- [Anam AI Documentation](https://docs.anam.ai)
- [Anam Pricing](https://anam.ai/pricing)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
