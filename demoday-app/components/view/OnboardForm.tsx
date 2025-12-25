"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Camera, Mic } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export default function OnboardForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "permissions">("form");
  const [duration, setDuration] = useState("1"); // Duration in minutes

  // Permission states
  const [micPermission, setMicPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      cleanupStreams();
    };
  }, []);

  useEffect(() => {
    // Connect camera stream to video element when it becomes available
    if (cameraStream && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = cameraStream;
      videoPreviewRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [cameraStream]);

  const cleanupStreams = () => {
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setMicPermission("granted");

      // Setup audio level monitoring
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (err) {
      console.error("Microphone permission denied:", err);
      setMicPermission("denied");
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraPermission("granted");

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        // Explicitly play the video to ensure it starts
        try {
          await videoPreviewRef.current.play();
        } catch (playError) {
          console.error("Error playing video:", playError);
        }
      }
    } catch (err) {
      console.error("Camera permission denied:", err);
      setCameraPermission("denied");
    }
  };

  const handleContinueToPermissions = () => {
    setStep("permissions");
    // Auto-request permissions when step changes
    setTimeout(() => {
      requestMicrophonePermission();
      requestCameraPermission();
    }, 500);
  };

  const handleStartPitch = () => {
    setIsLoading(true);

    // Keep streams alive and redirect with duration parameter
    // The pitch simulation page will handle the actual connection
    setTimeout(() => {
      router.push(`/pitch-simulation?autoStart=true&duration=${duration}`);
    }, 2000);
  };

  const allPermissionsGranted =
    micPermission === "granted" && cameraPermission === "granted";

  if (step === "permissions") {
    return (
      <div className="mt-8 space-y-6">
        {/* Permission Setup Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Setup Your Devices
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We need access to your microphone and camera for the pitch
              simulation
            </p>
          </div>

          <div className="space-y-6">
            {/* Microphone Check */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      micPermission === "granted"
                        ? "bg-green-100"
                        : micPermission === "denied"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Mic
                      className={`w-6 h-6 ${
                        micPermission === "granted"
                          ? "text-green-600"
                          : micPermission === "denied"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Microphone</h3>
                    <p className="text-sm text-gray-600">
                      {micPermission === "granted" && "Working perfectly!"}
                      {micPermission === "denied" && "Permission denied"}
                      {micPermission === "pending" && "Requesting access..."}
                    </p>
                  </div>
                </div>
                {micPermission === "granted" && (
                  <Check className="w-6 h-6 text-green-600" />
                )}
                {micPermission === "denied" && (
                  <X className="w-6 h-6 text-red-600" />
                )}
              </div>

              {micPermission === "granted" && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Audio Level</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-100"
                      style={{
                        width: `${Math.min((audioLevel / 128) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Speak to test your microphone
                  </p>
                </div>
              )}

              {micPermission === "denied" && (
                <Button
                  onClick={requestMicrophonePermission}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              )}
            </div>

            {/* Camera Check */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      cameraPermission === "granted"
                        ? "bg-green-100"
                        : cameraPermission === "denied"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Camera
                      className={`w-6 h-6 ${
                        cameraPermission === "granted"
                          ? "text-green-600"
                          : cameraPermission === "denied"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Camera</h3>
                    <p className="text-sm text-gray-600">
                      {cameraPermission === "granted" && "Working perfectly!"}
                      {cameraPermission === "denied" && "Permission denied"}
                      {cameraPermission === "pending" && "Requesting access..."}
                    </p>
                  </div>
                </div>
                {cameraPermission === "granted" && (
                  <Check className="w-6 h-6 text-green-600" />
                )}
                {cameraPermission === "denied" && (
                  <X className="w-6 h-6 text-red-600" />
                )}
              </div>

              {cameraPermission === "granted" && (
                <div className="mt-4">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full aspect-video bg-gray-900 rounded-lg"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <p className="text-xs text-gray-500 mt-2">Camera preview</p>
                </div>
              )}

              {cameraPermission === "denied" && (
                <Button
                  onClick={requestCameraPermission}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => {
                cleanupStreams();
                setStep("form");
                setMicPermission("pending");
                setCameraPermission("pending");
              }}
              variant="outline"
              size="lg"
              className="flex-1 cursor-pointer"
            >
              Back to Form
            </Button>
            <Button
              onClick={handleStartPitch}
              disabled={!allPermissionsGranted || isLoading}
              size="lg"
              className="flex-1 bg-[#fc7249] hover:bg-[#fc7249]/90 text-black font-semibold cursor-pointer"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
              {isLoading ? "Launching..." : "Start Pitch Simulation"}
            </Button>
          </div>

          {!allPermissionsGranted && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Please grant both microphone and camera permissions to continue
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 space-y-3">
      {/* First Input Group - Configuration with Selects */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Configuration
            </h3>
            <p className="text-sm text-gray-500 mt-1">Configure your setup</p>
          </div>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Duration
              </label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-45 cursor-pointer">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 seconds</SelectItem>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Language
              </label>
              <Select defaultValue="en">
                <SelectTrigger className="w-45 cursor-pointer">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                  <SelectItem value="fr">🇫🇷 French</SelectItem>
                  <SelectItem value="de">🇩🇪 German</SelectItem>
                  <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tone</label>
              <Select defaultValue="professional">
                <SelectTrigger className="w-45 cursor-pointer">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="friendly">😊 Friendly</SelectItem>
                  <SelectItem value="assertive">💪 Assertive</SelectItem>
                  <SelectItem value="casual">👋 Casual</SelectItem>
                  <SelectItem value="formal">🎩 Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Second Input Group - Links and Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="startupName"
              className="text-sm font-medium text-gray-700"
            >
              Startup Name
            </label>
            <Input
              id="startupName"
              type="text"
              placeholder="Enter your startup name"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="text-sm font-medium text-gray-700"
              >
                Website Link
              </label>
              <InputGroup>
                <InputGroupInput
                  id="website"
                  placeholder="example.com"
                  className="pl-1!"
                />
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="github"
                className="text-sm font-medium text-gray-700"
              >
                GitHub Link
              </label>
              <InputGroup>
                <InputGroupInput
                  id="github"
                  placeholder="github.com/username/repo"
                  className="pl-1!"
                />
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Describe your startup, product, team, and vision..."
              rows={2}
              className="w-full resize-none min-h-20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="attachments"
              className="text-sm font-medium text-gray-700"
            >
              Attachments (Optional)
            </label>
            <div className="relative">
              <input
                id="attachments"
                type="file"
                accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg
                  className="w-8 h-8 text-gray-00"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or PPTX files</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleContinueToPermissions}
        disabled={isLoading}
        size="lg"
        className="w-full px-8 py-6 text-base bg-[#fc7249] hover:bg-[#fc7249]/90 text-black font-semibold cursor-pointer"
      >
        Continue to Device Setup
      </Button>
    </div>
  );
}
