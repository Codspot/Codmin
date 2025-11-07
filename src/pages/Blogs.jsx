import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaFilter, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { setCurrentScreen } from "../store/uiSlice";
import { supabase } from "../supabaseClient";

export default function Blogs() {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(setCurrentScreen("blogs"));
  }, [dispatch]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from("Blogs")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-gray-500 text-sm">
            Manage your blog content ({filteredBlogs.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
            <FaFilter className="text-gray-600" />
          </button>
          <button
            onClick={() => window.location.href = "/create-blog"}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <FaPlus className="text-sm" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading blog posts...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? "No blog posts match your search." : "No blog posts found. Create your first blog post!"}
          </div>
        ) : (
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
              {filteredBlogs.map((blog, index) => (
                <tr
                  key={blog.id || index}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {blog.title}
                    </div>
                    {blog.excerpt && (
                      <div className="text-gray-500 text-xs mt-1">
                        {blog.excerpt.length > 100 
                          ? blog.excerpt.substring(0, 100) + '...' 
                          : blog.excerpt}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.published_at ? formatDate(blog.published_at) : formatDate(blog.date)}
                  </td>
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {blog.status === "Published" && (
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View"
                        >
                          <FaEye />
                        </button>
                      )}
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
