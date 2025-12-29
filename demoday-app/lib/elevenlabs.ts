/**
 * ElevenLabs Conversational AI
 *
 * Handles WebSocket connection to ElevenLabs and microphone capture.
 */

import { MicrophoneCapture, arrayBufferToBase64 } from "chatdio";

const SAMPLE_RATE = 16000;

let websocket: WebSocket | null = null;
let micCapture: MicrophoneCapture | null = null;
let isInitialized = false;

interface ElevenLabsMessage {
  type: string;
  conversation_initiation_metadata_event?: {
    conversation_id: string;
    agent_output_audio_format: string;
  };
  audio_event?: { audio_base_64: string };
  user_transcription_event?: { user_transcript: string };
  agent_response_event?: { agent_response: string };
  ping_event?: { event_id: number };
}

let audioChunkCount = 0;

export interface ElevenLabsCallbacks {
  onReady?: () => void;
  onAudio?: (base64Audio: string) => void;
  onUserTranscript?: (text: string) => void;
  onAgentResponse?: (text: string) => void;
  onInterrupt?: () => void;
  onDisconnect?: () => void;
  onError?: () => void;
}

/**
 * Set up microphone capture and send audio to ElevenLabs
 */
async function setupMicrophone() {
  micCapture = new MicrophoneCapture({
    sampleRate: SAMPLE_RATE,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  });

  micCapture.on("data", (data: ArrayBuffer) => {
    if (websocket?.readyState === WebSocket.OPEN && isInitialized) {
      websocket.send(
        JSON.stringify({ user_audio_chunk: arrayBufferToBase64(data) })
      );
    }
  });

  await micCapture.start();
  console.log("[Mic] Capturing at 16kHz");
}

/**
 * Connect to ElevenLabs Conversational AI WebSocket
 */
export async function connectElevenLabs(
  agentId: string,
  callbacks: ElevenLabsCallbacks,
  initialAgentMessage?: string
) {
  websocket = new WebSocket(
    `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`
  );

  // Keep a pending message that will be injected once the conversation
  // has emitted its initiation metadata (server-ready).
  let pendingInitialMessage: string | undefined = initialAgentMessage;

  websocket.onopen = async () => {
    console.log("[11Labs] WebSocket connected");
    audioChunkCount = 0;
    await setupMicrophone();
    callbacks.onReady?.();
  };

  websocket.onmessage = (event) => {
    const msg: ElevenLabsMessage = JSON.parse(event.data);

    switch (msg.type) {
      case "conversation_initiation_metadata": {
        isInitialized = true;
        const meta = msg.conversation_initiation_metadata_event;
        console.log("[11Labs] Session started:", {
          conversationId: meta?.conversation_id,
          audioFormat: meta?.agent_output_audio_format,
        });
        // If the caller provided an initial message (e.g., tts_summary),
        // inject it now that the conversation is initialized.
        if (pendingInitialMessage) {
          try {
            // Use the same best-effort injection pathway.
            const preferred = {
              type: "synthesize_and_play",
              text: pendingInitialMessage,
            };
            websocket?.send(JSON.stringify(preferred));
            const fallback = {
              type: "agent_response_injection",
              agent_response: pendingInitialMessage,
            };
            websocket?.send(JSON.stringify(fallback));
            console.log(
              "[11Labs] Sent pending initial agent message (best-effort)"
            );
          } catch (err) {
            console.error(
              "[11Labs] Failed to send pending initial message:",
              err
            );
          }
          pendingInitialMessage = undefined;
        }
        break;
      }

      case "audio":
        if (msg.audio_event?.audio_base_64) {
          audioChunkCount++;
          const bytes = atob(msg.audio_event.audio_base_64).length;
          console.log(
            `[11Labs] Audio chunk #${audioChunkCount}: ${bytes} bytes`
          );
          callbacks.onAudio?.(msg.audio_event.audio_base_64);
        }
        break;

      case "agent_response":
        if (msg.agent_response_event?.agent_response) {
          console.log(
            "[11Labs] Agent:",
            msg.agent_response_event.agent_response
          );
          callbacks.onAgentResponse?.(msg.agent_response_event.agent_response);
        }
        break;

      case "user_transcript":
        if (msg.user_transcription_event?.user_transcript) {
          console.log(
            "[11Labs] User:",
            msg.user_transcription_event.user_transcript
          );
          callbacks.onUserTranscript?.(
            msg.user_transcription_event.user_transcript
          );
        }
        break;

      case "interruption":
        console.log("[11Labs] Interruption detected");
        callbacks.onInterrupt?.();
        break;

      case "ping":
        websocket?.send(
          JSON.stringify({ type: "pong", event_id: msg.ping_event?.event_id })
        );
        break;

      default:
        console.log("[11Labs] Unknown message:", msg.type, msg);
    }
  };

  websocket.onclose = (event) => {
    console.log("[11Labs] WebSocket closed:", event.code, event.reason);
    console.log(`[11Labs] Total audio chunks received: ${audioChunkCount}`);
    isInitialized = false;
    callbacks.onDisconnect?.();
  };

  websocket.onerror = (error) => {
    console.error("[11Labs] WebSocket error:", error);
    callbacks.onError?.();
  };
}

/**
 * Disconnect from ElevenLabs and stop microphone
 */
export function stopElevenLabs() {
  isInitialized = false;
  websocket?.close();
  websocket = null;
  micCapture?.stop();
  micCapture = null;
}

/**
 * Best-effort: Inject a text message to the ElevenLabs conversation so the
 * agent speaks it. The exact socket message schema for injection may vary
 * depending on ElevenLabs server support; we attempt a couple of likely
 * payload shapes. This is a client-side best-effort helper — server may
 * ignore unknown message types.
 */
export function injectAgentMessage(text: string): boolean {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    console.warn("[11Labs] Cannot inject agent message; websocket not open");
    return false;
  }

  try {
    // Preferred: ask server to synthesize and play text (some servers accept this)
    const preferred = { type: "synthesize_and_play", text };
    websocket.send(JSON.stringify(preferred));

    // Fallback: send an agent_response-like object which some proxies may accept
    const fallback = { type: "agent_response_injection", agent_response: text };
    websocket.send(JSON.stringify(fallback));

    console.log("[11Labs] Injected agent message (best-effort)");
    return true;
  } catch (err) {
    console.error("[11Labs] Failed to inject agent message:", err);
    return false;
  }
}
