// app/files/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "@/components/view/DashboardLayout";
import {
  Upload,
  Search,
  Filter,
  List,
  Grid,
  FileText,
  MoreVertical,
  FolderPlus,
} from "lucide-react";
import FilesUploader from "@/components/view/FilesUploader";
import FilesTableClient from "@/components/view/FilesTableClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function FilesPage() {
  const { user } = await withAuth();

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not signed in</h1>
        <p>You should have been redirected. Try going back to the homepage.</p>
      </main>
    );
  }
  // Fetch pitch sessions for this user from the backend API and extract file records
  const apiUrl = process.env.NEXT_PUBLIC_DEMODAY_API_URI;
  let sessions: any[] = [];
  if (apiUrl) {
    try {
      const res = await fetch(
        `${apiUrl}/pitch-sessions?user_id=${encodeURIComponent(
          user.id
        )}&limit=100`,
        { cache: "no-store" }
      );
      if (res.ok) {
        sessions = await res.json();
      } else {
        console.error("Failed to fetch pitch sessions", res.statusText);
      }
    } catch (err) {
      console.error("Error fetching pitch sessions:", err);
    }
  } else {
    console.warn("NEXT_PUBLIC_DEMODAY_API_URI not configured");
  }

  return (
    <DashboardLayout user={user} currentPage="files">
      <div className="px-4 pb-6">
        {/* Upload Section */}
        <div className="bg-white mb-6 ">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Files
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Add documents to your pitch files.
          </p>
          <FilesUploader />
        </div>

        {/* Files List Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Pitch Files
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  Sort by:{" "}
                  <select className="border-0 text-[#fc7249] font-medium focus:ring-0 cursor-pointer">
                    <option>Date: Most Recent</option>
                    <option>Name</option>
                    <option>Size</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <FilesTableClient sessions={sessions} />
        </div>
      </div>
    </DashboardLayout>
  );
}
