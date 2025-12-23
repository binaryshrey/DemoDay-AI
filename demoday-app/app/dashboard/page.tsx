// app/dashboard/page.tsx
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "../../components/view/DashboardLayout";

export default async function DashboardPage() {
  const { user } = await withAuth();

  // In theory, middleware already prevented unauthenticated access,
  // but this is a safe guard and useful on its own if you skip middleware.
  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not signed in</h1>
        <p>You should have been redirected. Try going back to the homepage.</p>
      </main>
    );
  }

  return (
    <DashboardLayout user={user} currentPage="dashboard">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Hey {user.firstName ?? user.email} 👋
        </p>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Name:</span>{" "}
              <span className="text-gray-600">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>{" "}
              <span className="text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
