import { NextRequest, NextResponse } from "next/server";
import { sessionQueue } from "@/lib/sessionQueue";

export async function GET(request: NextRequest) {
  const anamApiKey = process.env.ANAM_INVESTOR_API_KEY;
  const avatarInvestorId = process.env.ANAM_INVESTOR_AVATAR_ID;
  const elevenLabsInvestorAgentId = process.env.ELEVENLABS_INVESTOR_AGENT_ID;
  const anamAuthURI = process.env.ANAM_AUTH_URI;

  if (
    !anamApiKey ||
    !avatarInvestorId ||
    !elevenLabsInvestorAgentId ||
    !anamAuthURI
  ) {
    return NextResponse.json(
      {
        error:
          "Missing environment variables. Check ANAM_INVESTOR_API_KEY, ANAM_INVESTOR_AVATAR_ID, ELEVENLABS_INVESTOR_AGENT_ID, and ANAM_AUTH_URI",
      },
      { status: 500 }
    );
  }

  try {
    // Use queue to manage concurrency
    const queueStatus = sessionQueue.getQueueStatus();
    console.log(`[Pitch API] Queue status:`, queueStatus);

    // Store the token from inside the queue callback
    let anamToken: string | null = null;

    // Wait for our turn in the queue
    const sessionId = await sessionQueue.requestSession("pitch", async () => {
      console.log("[Pitch API] Fetching Anam token...");
      const response = await fetch(anamAuthURI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anamApiKey}`,
        },
        body: JSON.stringify({
          personaConfig: {
            avatarId: avatarInvestorId,
            enableAudioPassthrough: true,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Anam API error:", error);
        throw new Error("Failed to get Anam session token");
      }

      const data = await response.json();
      anamToken = data.sessionToken; // Store the token
      console.log("[Pitch API] Token acquired successfully");
      return data.sessionToken;
    });

    console.log("[Pitch API] Session ID:", sessionId);

    if (!anamToken) {
      throw new Error("Failed to acquire Anam token");
    }

    // Return the token and session ID for cleanup
    return NextResponse.json({
      anamSessionToken: anamToken,
      elevenLabsAgentId: elevenLabsInvestorAgentId,
      queueSessionId: sessionId, // For cleanup
    });
  } catch (error) {
    console.error("Config error:", error);
    return NextResponse.json(
      { error: "Failed to get config" },
      { status: 500 }
    );
  }
}

// Add endpoint to release session when done
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    if (sessionId) {
      sessionQueue.releaseSession(sessionId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: "No session ID provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error releasing session:", error);
    return NextResponse.json(
      { error: "Failed to release session" },
      { status: 500 }
    );
  }
}
