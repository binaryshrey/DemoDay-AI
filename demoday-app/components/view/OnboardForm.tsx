"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

  const handleStartPitch = () => {
    setIsLoading(true);

    // Simulate processing for 10 seconds then redirect
    setTimeout(() => {
      router.push("/pitch-simulation");
    }, 10000);
  };
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
              <Select defaultValue="1">
                <SelectTrigger className="w-45">
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
                <SelectTrigger className="w-45">
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
                <SelectTrigger className="w-45">
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
              rows={10}
              className="w-full resize-none min-h-[100px]"
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

      {/* Submit Button */}
      <Button
        onClick={handleStartPitch}
        disabled={isLoading}
        size="lg"
        className="w-full px-8 py-6 text-base bg-[#fc7249] hover:bg-[#fc7249]/90 text-black font-semibold"
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? "Preparing Your Pitch Simulation..." : "Start Your Pitch"}
      </Button>
    </div>
  );
}
