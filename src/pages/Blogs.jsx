import React from "react";
import { FaFilter } from "react-icons/fa";

const blogs = [
  {
    title: "Building a Design System with Tailwind CSS",
    date: "June 20, 2025",
    status: "Published",
  },
  {
    title: "How to Use React Router Dom v6",
    date: "June 10, 2025",
    status: "Draft",
  },
];

export default function Blogs() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-gray-500 text-sm">Manage your blog content</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search blog posts..."
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
            <FaFilter className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {blog.title}
                </td>
                <td className="px-6 py-4 text-gray-600">{blog.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      blog.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-blue-600 font-medium cursor-pointer">
                  Edit
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
