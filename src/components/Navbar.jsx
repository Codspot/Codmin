import React from "react";
import { FaPen, FaPlus, FaBell, FaRocket } from "react-icons/fa";
import { HiOutlineViewGrid } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Custom Navbar for /projects/new
  if (location.pathname.startsWith("/projects/new")) {
    return (
      <header className="flex items-center justify-between px-6 py-3 bg-white border border-slate-200 rounded-b-xl rounded-t-none">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center text-slate-600 hover:text-primary-700 hover:bg-slate-50 px-2 py-1 rounded transition font-medium text-sm"
            onClick={() => window.history.back()}
          >
            <svg
              className="inline w-4 h-4 mr-1.5 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Projects</span>
          </button>
          <div className="w-px h-5 bg-slate-200 mx-2"></div>
          <h1 className="text-xl font-bold text-slate-900">
            Create New Project
          </h1>
        </div>
        {/* <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition border border-slate-200">
            <svg
              className="mr-2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">
            <FaRocket className="mr-2" />
            Publish
          </button>
        </div> */}
      </header>
    );
  }

  // Custom Navbar for /blogs/new
  if (location.pathname.startsWith("/blogs/new")) {
    return (
      <header className="flex items-center justify-between px-6 py-3 bg-white border border-slate-200 rounded-b-xl rounded-t-none">
        <div className="flex items-center">
          <button
            className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition font-medium text-base"
            onClick={() => window.history.back()}
          >
            <svg
              className="inline w-5 h-5 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Blog Posts</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="fa-solid fa-cog"></i>
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition border border-gray-200">
            <svg
              className="mr-2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Save Draft
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition">
            <FaRocket className="mr-2" />
            Publish
          </button>
        </div>
      </header>
    );
  }

  // Default Navbar
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Left: Logo + Title */}
      <div className="flex flex-col items-start justify-center">
        <img src={process.env.PUBLIC_URL + '/logo1.png'} alt="Codspot Logo" className="h-8 w-18 mb-1 object-contain" />
        <span className="text-xs text-gray-500 -mt-1 ml-2">Admin Panel</span>
      </div>

      {/* Right: Avatar + Notification */}
      <div className="flex items-center space-x-4">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
          <FaBell className="text-gray-500 text-sm" />
        </button>
      </div>
    </header>
  );
}
