// app/profile/page.tsx
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";
import Image from "next/image";

export default async function ProfilePage() {
  const { user } = await withAuth();

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not signed in</h1>
        <p>You should have been redirected. Try going back to the homepage.</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="relative h-32 bg-linear-to-r from-indigo-500 to-purple-600"></div>

          {/* Profile Image */}
          <div className="relative px-6 pb-6">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <Image
                  className="rounded-full border-4 border-white shadow-lg"
                  src={user?.profilePictureUrl || "/default-avatar.png"}
                  alt="Profile"
                  width={120}
                  height={120}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>

              {/* Stats or Additional Info */}
              <div className="mt-6 flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Practice Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Feedback Received</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <a
                  href="/dashboard"
                  className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center font-medium"
                >
                  Go to Dashboard
                </a>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">User ID</span>
              <span className="text-sm font-medium text-gray-900">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Email Verified</span>
              <span className="text-sm font-medium text-gray-900">
                {user.emailVerified ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Account Created</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
