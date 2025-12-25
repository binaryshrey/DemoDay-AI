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

  return (
    <DashboardLayout user={user} currentPage="files">
      <div className="px-4 pb-6">
        {/* Upload Section */}
        <div className="bg-white mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Files
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Add documents, photos or videos to your pitch files.
          </p>

          <label htmlFor="file-upload" className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <div className="flex justify-center mb-4">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600">
                Drop files here or{" "}
                <span className="text-[#fc7249] hover:text-[#ff4000] font-medium">
                  select files to upload
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Up to 5 files or 20 MB
              </p>
            </div>
            <input id="file-upload" type="file" multiple className="hidden" />
          </label>
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

          {/* Search and Filter Bar */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search Document"
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Files Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* File Row 1 */}

                {/* File Row 2 */}
                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: "#ffd4c4" }}
                        >
                          <FileText
                            className="w-5 h-5"
                            style={{ color: "#fc7249" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Financial Projections.xlsx
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    24 Jul, 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    1.8 MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                {/* File Row 3 */}

                {/* File Row 4 */}
                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: "#ffd4c4" }}
                        >
                          <FileText
                            className="w-5 h-5"
                            style={{ color: "#fc7249" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Product Demo Video.mp4
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    23 Jul, 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    15.6 MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>

                {/* File Row 6 */}
                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: "#ffd4c4" }}
                        >
                          <FileText
                            className="w-5 h-5"
                            style={{ color: "#fc7249" }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Business Plan 2024.docx
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    22 Jul, 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    3.2 MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
