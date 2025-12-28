"use client";

import React, { useMemo, useState } from "react";
import { Search, MoreVertical, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilesTableClientProps {
  sessions: any[];
}

export default function FilesTableClient({ sessions }: FilesTableClientProps) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    const normalizedQuery = query.trim().toLowerCase();

    const deriveFilename = (s: any) => {
      let filename = "file";
      try {
        if (s.gcp_object_path) {
          filename = String(s.gcp_object_path).split("/").pop() || filename;
        } else if (s.gcp_file_url) {
          const url = new URL(s.gcp_file_url);
          filename = url.pathname.split("/").pop() || filename;
        } else if (s.gcp_bucket) {
          const parts = String(s.gcp_bucket).split("-");
          filename = parts.length > 0 ? parts[parts.length - 1] : filename;
        }
      } catch (e) {
        // ignore
      }
      return filename;
    };

    const mapped = sessions
      .filter((s) => s.gcp_file_url || s.gcp_object_path || s.gcp_bucket)
      .map((s) => ({
        ...s,
        _filename: deriveFilename(s),
        _uploadDate: s.created_at ? new Date(s.created_at) : null,
      }));

    if (!normalizedQuery) return mapped;

    return mapped.filter((r) => {
      const fileMatch = String(r._filename || "")
        .toLowerCase()
        .includes(normalizedQuery);
      const startupMatch = String(r.startup_name || "")
        .toLowerCase()
        .includes(normalizedQuery);
      return fileMatch || startupMatch;
    });
  }, [sessions, query]);

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search Document or Startup"
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
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
            {rows && rows.length > 0 ? (
              rows.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
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
                          <a
                            href={s.gcp_file_url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {s._filename}
                          </a>
                        </div>
                        {s.startup_name && (
                          <div className="text-xs text-gray-500">
                            {s.startup_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {s._uploadDate
                      ? s._uploadDate.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-8 text-center text-sm text-gray-500"
                  colSpan={5}
                >
                  No files match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
