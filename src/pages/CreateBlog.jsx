import React, { useState } from "react";
import BlogEditor from "../components/BlogEditor";


export default function CreateBlog() {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 bg-gray-50">
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-4xl ml-0 mr-auto p-8 space-y-8">
            {/* Blog Title Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Blog Title</label>
                  <input type="text" placeholder="Enter your compelling blog title..." className="w-full text-2xl font-bold placeholder-gray-300 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>
            </div>
            {/* Content Editor Card */}
            <BlogEditor value={content} onChange={setContent} />
          </div>
        </main>
      </div>
    </div>
  );
}
