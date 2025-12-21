import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Feedback() {
  const { user } = await withAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <img className="h-10" src="/demoday.svg" alt="demoday-ai" />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pitch Session Complete!
            </h1>
            <p className="text-gray-600">Your feedback is being generated...</p>
          </div>

          {/* Feedback Section - Placeholder */}
          <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                AI Investor Feedback
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                </div>
                <p className="text-gray-500 mt-4 text-sm">
                  Analyzing your pitch performance...
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/pitch-simulation"
                className="px-6 py-3 bg-[#fc7249] hover:bg-[#ff4000] text-white font-semibold rounded-lg transition-colors"
              >
                New Pitch Session
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
