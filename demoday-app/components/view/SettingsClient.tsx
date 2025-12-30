"use client";

import { useRef, useState } from "react";
import { RiFilePaper2Line } from "@remixicon/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { handleSignOut } from "../../app/actions/auth";

export default function SettingsClient() {
  // default both toggles to OFF per request
  const [saveRecordings, setSaveRecordings] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const signOutFormRef = useRef<HTMLFormElement | null>(null);

  const { user, loading: authLoading } = useAuth({ ensureSignedIn: false });

  return (
    <div className="mx-4">
      <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      <p className="text-sm mt-2 text-gray-600">
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
            <a
              href="https://github.com/binaryshrey/DemoDay-AI/blob/main/PRIVACY_POLICY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
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
            </a>

            {/* Terms and conditions */}
            <a
              href="https://github.com/binaryshrey/DemoDay-AI/blob/main/TERMS_OF_SERVICE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
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
            </a>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium bg-[#fc7249] text-white rounded-md hover:bg-[#fc7249] focus:outline-none focus:ring-2 focus:ring-[#fc7249] focus:ring-offset-2 cursor-pointer md:px-4 md:py-2 md:text-sm"
                  >
                    Delete Account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                      Cancel
                    </AlertDialogCancel>

                    {/* Hidden form used to invoke server action that signs the user out */}
                    <form
                      ref={signOutFormRef}
                      action={handleSignOut}
                      style={{ display: "none" }}
                    />

                    {/* Use a plain button (not AlertDialogAction) so the dialog does NOT auto-close
                        — we will only sign the user out / navigate away after the delete succeeds. */}
                    <button
                      type="button"
                      onClick={async () => {
                        // prevent double click
                        if (deleting) return;
                        setDeleting(true);

                        try {
                          // Resolve backend API base from env (client-safe NEXT_PUBLIC var)
                          const apiBase = (
                            process.env.NEXT_PUBLIC_DEMODAY_API_URI ||
                            (process.env.DEMODAY_API_URI as string) ||
                            ""
                          ).replace(/\/$/, "");

                          if (!apiBase) {
                            throw new Error(
                              "DEMODAY API URL not configured. Please set NEXT_PUBLIC_DEMODAY_API_URI"
                            );
                          }

                          const userId = user?.id ?? user?.email;
                          if (!userId) {
                            throw new Error(
                              "No user id available for deletion"
                            );
                          }

                          const res = await fetch(
                            `${apiBase}/users/${encodeURIComponent(
                              userId
                            )}/data`,
                            { method: "DELETE" }
                          );

                          if (!res.ok) {
                            const txt = await res
                              .text()
                              .catch(() => res.statusText);
                            throw new Error(
                              `Delete failed: ${res.status} ${txt}`
                            );
                          }

                          // On success, submit the hidden server-action form to sign the user out
                          // This triggers the same server-side signOut flow used elsewhere in the app.
                          if (signOutFormRef.current) {
                            // requestSubmit will trigger the server action form
                            // and perform the sign out on the server
                            // @ts-ignore - requestSubmit exists on modern browsers
                            signOutFormRef.current.requestSubmit();
                          } else {
                            // as a fallback, redirect to homepage
                            window.location.href = "/";
                          }
                        } catch (err) {
                          console.error("Failed to delete user data:", err);
                          // Optionally surface to user
                          alert(
                            err instanceof Error
                              ? err.message
                              : "Failed to delete account data"
                          );
                          setDeleting(false);
                        }
                      }}
                      disabled={deleting || authLoading}
                      className="px-4 py-2 bg-[#fc7249] text-white text-sm font-medium rounded-md hover:bg-[#fc7249] focus:outline-none focus:ring-2 focus:ring-[#fc7249] focus:ring-offset-2"
                    >
                      {deleting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
