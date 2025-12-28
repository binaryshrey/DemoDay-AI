// app/dashboard/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "../../components/view/DashboardLayout";
import DashboardClient from "../../components/view/DashboardClient";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  const month = months[now.getMonth()];

  return `${dayName}, ${day}${suffix} ${month}`;
}

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

  const greeting = getGreeting();
  const formattedDate = getFormattedDate();
  const userName = user.firstName || user.email?.split("@")[0] || "User";

  return (
    <DashboardLayout user={user} currentPage="dashboard">
      <DashboardClient
        greeting={greeting}
        formattedDate={formattedDate}
        userName={userName}
        userId={user.id ?? user.email}
      />
    </DashboardLayout>
  );
}
