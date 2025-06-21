import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaBriefcase,
  FaNewspaper,
  FaImage,
  FaEye,
  FaHeart,
  FaCog,
  FaQuestionCircle,
  FaCopy
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentProjectStep } from "../store/uiSlice";

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.ui.currentProjectStep);
  const currentScreen = useSelector((state) => state.ui.currentScreen);

  // Sidebar for /projects/new (Create Project)
  if (location.pathname.startsWith("/projects/new")) {
    // Stepper steps config for future dynamic highlighting
    const steps = [
      {
        label: "Basic Information",
        icon: <FaBriefcase className="text-white text-xs" />, // Only for step 1
      },
      { label: "Media & Assets" },
      { label: "Description" },
      { label: "Settings & SEO" },
    ];
    return (
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between h-full">
        <div>
          <div className="space-y-3">
            {/* Stepper */}
            {steps.map((step, idx) => {
              const isActive = currentStep === idx + 1;
              return (
                <div
                  key={step.label}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                    isActive
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-transparent hover:bg-blue-50 hover:border-blue-200"
                  }`}
                  onClick={() => dispatch(setCurrentProjectStep(idx + 1))}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      isActive
                        ? "bg-blue-600"
                        : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {isActive ? (
                      step.icon
                    ) : (
                      <span className="text-xs text-slate-500 font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "font-semibold text-blue-900"
                        : "font-normal text-slate-900"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="pt-6 border-t border-slate-200 mt-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <FaEye className="mr-3" />
                Preview Project
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <FaCopy className="mr-3" />
                Duplicate Template
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Sidebar for /blogs/new (Create Blog)
  if (location.pathname.startsWith("/blogs/new")) {
    return (
      <aside className="w-80 bg-transparent border-r border-gray-200 p-6 space-y-8 min-h-full">
        {/* Post Settings Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Post Settings</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select className="w-full h-12 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50">
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select className="w-full h-12 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50">
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <input type="text" placeholder="Add tags..." className="w-full h-11 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO URL</label>
              <input type="text" placeholder="blog-post-url" className="w-full h-11 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50" />
            </div>
          </div>
        </div>
        {/* SEO & Meta Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">SEO & Meta</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
              <textarea className="w-full h-16 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50 resize-none" placeholder="Brief description..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reading Time</label>
              <input type="text" placeholder="5 min read" className="w-full h-11 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800 bg-gray-50" />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 h-full bg-white border-r border-gray-100 shadow-sm h-screen flex flex-col justify-between">
      <div className="p-6">
        <nav className="space-y-2">
          {/* Projects */}
          <NavLink to="/projects" end>
            {({ isActive }) => (
              <div className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-100'}`}>
                    <FaBriefcase className={`text-sm ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                  </div>
                  <span className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-800 group-hover:text-gray-900'}`}>
                    Projects
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                  8
                </span>
              </div>
            )}
          </NavLink>

          {/* Blog Posts */}
          <NavLink
            to="/blogs" end
          >
            {({ isActive }) => (
              <div className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${isActive ? 'bg-emerald-50 border-emerald-200' : 'hover:bg-gray-50 border-transparent'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-emerald-500' : 'bg-gray-100 group-hover:bg-emerald-100'}`}>
                    <FaNewspaper className={`text-sm ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-emerald-600'}`} />
                  </div>
                  <span className={`font-semibold ${isActive ? 'text-emerald-900' : 'text-gray-800 group-hover:text-gray-900'}`}>
                    Blog Posts
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                  12
                </span>
              </div>
            )}
          </NavLink>

          {/* Media (non-clickable for now) */}
          <div className="group flex items-center justify-between px-4 py-3 rounded-xl border border-transparent hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors">
                <FaImage className="text-gray-600 group-hover:text-purple-600 text-sm" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">Media</span>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">24</span>
          </div>
        </nav>

        {/* Conditional button for createProject screen */}
        {currentScreen === "createProject" && (
          <div className="mt-6 flex justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition">
              Save Project
            </button>
          </div>
        )}

        {/* Analytics Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Analytics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Views</span>
                <FaEye className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">12.4K</p>
              <p className="text-xs text-blue-700">+12% from last month</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Engagement</span>
                <FaHeart className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">89%</p>
              <p className="text-xs text-green-700">+5% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <FaCog className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <FaQuestionCircle className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Help</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
