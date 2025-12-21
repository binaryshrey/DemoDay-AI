import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json(
        { error: "Failed to get Anam session token" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      anamSessionToken: data.sessionToken,
      elevenLabsAgentId: elevenLabsInvestorAgentId,
    });
  } catch (error) {
    console.error("Config error:", error);
    return NextResponse.json(
      { error: "Failed to get config" },
      { status: 500 }
    );
  }
}
