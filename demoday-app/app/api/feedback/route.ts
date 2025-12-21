import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const anamCoachApiKey = process.env.ANAM_COACH_API_KEY;
  const avatarCoachId = process.env.ANAM_COACH_AVATAR_ID;
  const elevenLabsCoachAgentId = process.env.ELEVENLABS_COACH_AGENT_ID;
  const anamAuthURI = process.env.ANAM_AUTH_URI;

  if (
    !anamCoachApiKey ||
    !avatarCoachId ||
    !elevenLabsCoachAgentId ||
    !anamAuthURI
  ) {
    return NextResponse.json(
      {
        error:
          "Missing environment variables. Check ANAM_COACH_API_KEY, ANAM_COACH_AVATAR_ID, ELEVENLABS_COACH_AGENT_ID, and ANAM_AUTH_URI",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(anamAuthURI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anamCoachApiKey}`,
      },
      body: JSON.stringify({
        personaConfig: {
          avatarId: avatarCoachId,
          enableAudioPassthrough: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anam API error (coach avatar):", error);
      return NextResponse.json(
        { error: "Failed to get Anam session token for coach" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      anamSessionToken: data.sessionToken,
      elevenLabsAgentId: elevenLabsCoachAgentId,
    });
  } catch (error) {
    console.error("Config error (coach):", error);
    return NextResponse.json(
      { error: "Failed to get feedback session config" },
      { status: 500 }
    );
  }
}
