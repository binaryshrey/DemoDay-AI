"use client";

import { useState } from "react";
import { RiFilePaper2Line } from "@remixicon/react";

export default function SettingsClient() {
  const [saveRecordings, setSaveRecordings] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  return (
    <div className="mx-4">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">
        Manage your account settings and preferences
      </p>

      <div className="mt-8 space-y-6">
        {/* General Section */}
        <div className="bg-white rounded-lg">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            General
          </h2>
          <div className="space-y-1">
            {/* Data privacy terms */}
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RiFilePaper2Line className="w-5 h-5 text-gray-700" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Data privacy terms
                  </h3>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Terms and conditions */}
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RiFilePaper2Line className="w-5 h-5 text-gray-700" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-900">
                    Terms and conditions
                  </h3>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Privacy & Security
          </h2>
          <div className="space-y-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Save Session Recordings
                </h3>
                <p className="text-sm text-gray-500">
                  Store recordings for future review
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSaveRecordings(!saveRecordings)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#fc7249] focus:ring-offset-2 ${
                  saveRecordings ? "bg-[#fc7249]" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={saveRecordings}
              >
                <span
                  className={`${
                    saveRecordings ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Share Analytics
                </h3>
                <p className="text-sm text-gray-500">
                  Help improve the platform with usage data
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareAnalytics(!shareAnalytics)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#fc7249] focus:ring-offset-2 ${
                  shareAnalytics ? "bg-[#fc7249]" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={shareAnalytics}
              >
                <span
                  className={`${
                    shareAnalytics ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Danger Zone
          </h2>
          <div className="space-y-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-[#fc7249] text-white text-sm font-medium rounded-md hover:bg-[#e86239] focus:outline-none focus:ring-2 focus:ring-[#fc7249] focus:ring-offset-2 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
