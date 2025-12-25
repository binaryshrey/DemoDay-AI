// app/dashboard/page.tsx
import { withAuth, signOut } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "../../components/view/DashboardLayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Search,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

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
      <div>
        {/* Top bar with search and button */}
        <div className="flex items-center justify-between mb-4 mx-4">
          <div className="relative w-64 lg:w-120">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
            <Input
              type="text"
              placeholder="Search your pitch sessions"
              className="pl-10"
            />
          </div>
          <Button className="bg-[#fc7249] hover:bg-[#fc7249] cursor-pointer text-white px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
            <span className="hidden sm:inline">+ New Pitch Session</span>
            <span className="sm:hidden">+ New Pitch</span>
          </Button>
        </div>

        {/* Horizontal line */}
        <hr className="border-gray-300 mb-3" />

        {/* Date and Greeting */}
        <div className="mb-4 mx-4">
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <h1 className="text-2xl font-medium text-gray-900">
            {greeting}, {userName}!
          </h1>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-4 mt-2">
          {/* Total Pitch Sessions */}
          <div className="bg-[#ffab91] rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800 text-sm font-medium">
                Total Pitch Sessions
              </h3>
              <div className="bg-[#fc7249] p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-900 text-3xl font-bold">24</p>
          </div>

          {/* Completed Sessions */}
          <div className="bg-[#ffab91] rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800 text-sm font-medium">
                Completed Sessions
              </h3>
              <div className="bg-[#fc7249] p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-900 text-3xl font-bold">
              18{" "}
              <span className="text-lg text-gray-700 font-normal">(75%)</span>
            </p>
          </div>

          {/* Average Score */}
          <div className="bg-[#ffab91] rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800 text-sm font-medium">
                Average Score
              </h3>
              <div className="bg-[#fc7249] p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-900 text-3xl font-bold">8.2/10</p>
          </div>

          {/* Total Time on Pitches */}
          <div className="bg-[#ffab91] rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800 text-sm font-medium">
                Time on Pitches
              </h3>
              <div className="bg-[#fc7249] p-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-900 text-3xl font-bold">
              42h <span className="text-lg text-gray-700 font-normal">30m</span>
            </p>
          </div>
        </div>

        {/* Pitch Sessions Table */}
        <div className="mt-6 bg-white rounded-lg  overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Pitch Sessions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    AI SaaS Platform
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    45 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Strong value proposition, needs market validation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    8.5/10
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH002
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    HealthTech App
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    38 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Great user interface, consider partnership opportunities
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    9.0/10
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH003
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    EdTech Solution
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    52 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Improve monetization strategy and content quality
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    7.8/10
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH004
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    FinTech Startup
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    41 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Address regulatory concerns and scalability issues
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Review Needed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    6.5/10
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH005
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Green Energy Tech
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    55 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Excellent vision, strong team, ready for investment
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    9.5/10
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH006
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    E-Commerce Platform
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    42 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Strong market fit, focus on customer acquisition
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    8.2/10
                  </td>
                </tr>

                {/* Row 7 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH007
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Travel Tech App
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    36 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Innovative concept, needs better revenue model
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    7.5/10
                  </td>
                </tr>

                {/* Row 8 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #PITCH008
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Blockchain Solution
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    48 mins
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    Solid technology, clarify use cases and go-to-market
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    8.8/10
                  </td>
                </tr>

                {/* Row 5 */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
