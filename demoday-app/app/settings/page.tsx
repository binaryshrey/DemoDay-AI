// app/settings/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "@/components/view/DashboardLayout";
import SettingsClient from "@/components/view/SettingsClient";

export default async function SettingsPage() {
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
    <DashboardLayout user={user} currentPage="settings">
      <SettingsClient />
    </DashboardLayout>
  );
}
