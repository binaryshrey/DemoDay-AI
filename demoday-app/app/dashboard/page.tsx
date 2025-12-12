// app/dashboard/page.tsx
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";

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
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Hey {user.firstName ?? user.email} 👋</p>

      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <form
        action={async () => {
          "use server";
          await signOut(); // redirects to your Sign-out redirect URL
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
