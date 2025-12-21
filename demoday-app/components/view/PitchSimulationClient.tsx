"use client";

/**
 * ElevenLabs + Anam Integration Component
 *
 * Client component that orchestrates the pitch simulation with AI investor
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@anam-ai/js-sdk";
import type AnamClient from "@anam-ai/js-sdk/dist/module/AnamClient";
import { connectElevenLabs, stopElevenLabs } from "../../lib/elevenlabs";

interface Config {
  anamSessionToken: string;
  elevenLabsAgentId: string;
  error?: string;
}

interface Message {
  role: "user" | "agent" | "system";
  text: string;
}

interface PitchSimulationClientProps {
  autoStart?: boolean;
  duration?: number; // Duration in minutes
}

export default function PitchSimulationClient({
  autoStart = false,
  duration = 2,
}: PitchSimulationClientProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isEnding, setIsEnding] = useState(false);
  const [endingMessage, setEndingMessage] = useState("");
  const isIntentionalDisconnectRef = useRef(false);

  const anamClientRef = useRef<AnamClient | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const hasAutoStarted = useRef(false);
  const configRef = useRef<Config | null>(null);
  const agentAudioInputStreamRef = useRef<any>(null);

  // Initialize Anam session on mount (pre-warm the avatar)
  useEffect(() => {
    const initializeSession = async () => {
      console.log("[Session] Initializing fresh session...");

      try {
        // Clean up any existing sessions
        if (anamClientRef.current) {
          try {
            await anamClientRef.current.stopStreaming();
            anamClientRef.current = null;
          } catch (err) {
            console.error("[Session] Error cleaning up:", err);
          }
        }

        // Fetch fresh config and initialize Anam avatar
        const res = await fetch("/api/config");
        const config: Config = await res.json();

        if (!res.ok) {
          throw new Error(config.error || "Failed to get config");
        }

        console.log("[Anam] Pre-initializing avatar with fresh session token");

        // Initialize Anam avatar immediately
        const anamClient = createClient(config.anamSessionToken, {
          disableInputAudio: true,
        });

        if (videoRef.current) {
          await anamClient.streamToVideoElement(videoRef.current.id);
          console.log(
            "[Anam] Avatar ready, session:",
            anamClient.getActiveSessionId()
          );
        }

        // Create audio input stream and keep it ready
        const agentAudioInputStream = anamClient.createAgentAudioInputStream({
          encoding: "pcm_s16le",
          sampleRate: 16000,
          channels: 1,
        });

        anamClientRef.current = anamClient;
        agentAudioInputStreamRef.current = agentAudioInputStream;
        configRef.current = config;
        setShowVideo(true);

        console.log("[Session] Avatar initialized and ready");

        // Keep loader visible for a moment to let avatar settle
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("[Session] Initialization error:", err);
        showError(err instanceof Error ? err.message : "Failed to initialize");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, []);

  useEffect(() => {
    // Auto-start if enabled and hasn't started yet
    if (
      autoStart &&
      !hasAutoStarted.current &&
      !isConnected &&
      !isLoading &&
      !isInitializing
    ) {
      hasAutoStarted.current = true;
      // Add a small delay so user sees the avatar before agent speaks
      setTimeout(() => {
        handleStart();
      }, 500);
    }
  }, [autoStart, isInitializing]);

  useEffect(() => {
    // Auto-scroll transcript to bottom
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  // Countdown timer effect
  useEffect(() => {
    if (!isConnected || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - end the session with feedback
          clearInterval(interval);
          handleStopWithFeedback();
          addMessage("system", "Time's up. Session has ended!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, timeRemaining]);

  // Cleanup on unmount - silent cleanup without feedback
  useEffect(() => {
    return () => {
      isIntentionalDisconnectRef.current = true; // Mark as intentional on unmount
      stopElevenLabs();
      if (anamClientRef.current) {
        anamClientRef.current.stopStreaming();
      }
    };
  }, []);

  // Format time remaining as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const addMessage = (role: "user" | "agent" | "system", text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleStart = async () => {
    setIsLoading(true);
    isIntentionalDisconnectRef.current = false; // Reset the flag

    try {
      // Use pre-initialized config and streams
      if (
        !configRef.current ||
        !anamClientRef.current ||
        !agentAudioInputStreamRef.current
      ) {
        throw new Error("Session not initialized. Please refresh the page.");
      }

      console.log("[ElevenLabs] Connecting with pre-initialized avatar...");

      // Connect to ElevenLabs using the pre-initialized audio stream
      await connectElevenLabs(configRef.current.elevenLabsAgentId, {
        onReady: () => {
          setIsConnected(true);
          addMessage("system", "Connected. Start pitching your startup...");
        },
        onAudio: (audio: string) => {
          agentAudioInputStreamRef.current?.sendAudioChunk(audio);
        },
        onUserTranscript: (text: string) => addMessage("user", text),
        onAgentResponse: (text: string) => {
          agentAudioInputStreamRef.current?.endSequence();
          addMessage("agent", text);
        },
        onInterrupt: () => {
          addMessage("system", "Interrupted");
          anamClientRef.current?.interruptPersona();
          agentAudioInputStreamRef.current?.endSequence();
        },
        onDisconnect: () => {
          // Only set isConnected to false if this was an intentional disconnect
          if (isIntentionalDisconnectRef.current) {
            setIsConnected(false);
          }
        },
        onError: () => showError("Connection error"),
      });
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to start");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopWithFeedback = async () => {
    // Mark this as an intentional disconnect
    isIntentionalDisconnectRef.current = true;

    // Show ending sequence and navigate to feedback
    setIsEnding(true);
    setEndingMessage("Saving your pitch...");

    // Stop connections
    stopElevenLabs();
    await anamClientRef.current?.stopStreaming();
    anamClientRef.current = null;
    setShowVideo(false);
    setIsConnected(false);

    // Wait 2 seconds, then change message
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setEndingMessage("Generating feedback...");

    // Wait another 2 seconds, then navigate
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/feedback");
  };

  const handleToggle = () => {
    if (isConnected) {
      handleStopWithFeedback();
    } else {
      handleStart();
    }
  };

  const getMessageColor = (role: string) => {
    switch (role) {
      case "user":
        return "text-blue-600";
      case "agent":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  const getMessageLabel = (role: string) => {
    switch (role) {
      case "user":
        return "You";
      case "agent":
        return "Investor";
      default:
        return "•";
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "#000" }}
    >
      {/* Countdown Timer - Top Right (below menu) */}
      {isConnected && !isInitializing && (
        <div className="absolute top-20 right-6 z-40">
          <div
            className="bg-white/5 backdrop-blur-2xl border border-white/30 rounded-xl px-6 py-3 shadow-2xl"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-white">
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ending Loader - Blocks UI */}
      {isEnding && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-6 font-medium">{endingMessage}</p>
          <p className="text-white/60 text-sm mt-2">Please wait...</p>
        </div>
      )}

      {/* Initialization Loader - Blocks UI */}
      {isInitializing && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-6 font-medium">
            Initializing Session...
          </p>
          <p className="text-white/60 text-sm mt-2">
            Preparing your pitch simulation
          </p>
        </div>
      )}

      {/* Connecting Overlay - Shows when starting */}
      {isLoading && !isInitializing && (
        <div className="absolute inset-0 bg-black/50 z-40 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg mt-4 font-medium">
            Starting Session...
          </p>
          <p className="text-white/60 text-sm mt-2">Get ready to pitch!</p>
        </div>
      )}

      {/* Scaled Video Container - Centered */}
      <div className="relative w-full max-w-5xl aspect-video">
        <video
          ref={videoRef}
          id="anam-video"
          className="w-full h-full object-contain rounded-lg"
          autoPlay
          playsInline
        />
      </div>

      {/* Placeholder when not streaming */}
      {!showVideo && !isInitializing && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: "#000" }}
        >
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-gray-700 transition-colors duration-300" />
            <div className="absolute inset-2 rounded-full bg-gray-800 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>
          <p className="text-white text-lg">
            {isLoading
              ? "Connecting..."
              : isConnected
              ? "Listening"
              : "Ready to start"}
          </p>
        </div>
      )}

      {/* Transcript - Bottom Left (Glass Effect) */}
      <div className="absolute bottom-6 left-6 max-w-md w-full max-h-64 overflow-hidden">
        <div
          ref={transcriptRef}
          className="bg-white/5 backdrop-blur-2xl border border-white/30 rounded-xl p-4 space-y-2 overflow-y-auto max-h-64 shadow-2xl"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.4) transparent",
            boxShadow:
              "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {messages.length === 0 ? (
            <p className="text-white/60 text-xs">
              Conversation will appear here...
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in">
                <span
                  className={`font-semibold ${
                    msg.role === "user"
                      ? "text-blue-400"
                      : msg.role === "agent"
                      ? "text-green-400"
                      : "text-white/60"
                  }`}
                >
                  {getMessageLabel(msg.role)}:
                </span>{" "}
                <span className="text-white/90 text-sm">{msg.text}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* End Call Button - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="px-10 py-3 rounded-full font-semibold text-white shadow-2xl transition-all transform  flex items-center gap-3 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: isLoading ? "#4b5563" : "#fc7249",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "#ff4000";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "#fc7249";
            }
          }}
        >
          {isLoading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h12v12H6z" />
              </svg>
              <span>End Your Pitch</span>
            </>
          ) : (
            <>
              <span>Begin Your Pitch</span>
            </>
          )}
        </button>
      </div>

      {/* Speaking Indicator - Center Bottom */}
      {isConnected && showVideo && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 bg-green-400 rounded-full animate-pulse shadow-lg"
              style={{
                height: `${40 + i * 12}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Error Display - Top Center */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-md">
          <div className="bg-red-600/90 backdrop-blur-md border border-red-400 rounded-lg px-6 py-3 shadow-xl">
            <p className="text-white text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
