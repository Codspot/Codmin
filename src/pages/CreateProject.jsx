import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentScreen } from "../store/uiSlice";

export default function CreateProject() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.ui.currentProjectStep);

  useEffect(() => {
    dispatch(setCurrentScreen("createProject"));
  }, [dispatch]);

  // Render only the current step's section
  let StepContent = null;
  if (currentStep === 1) {
    StepContent = (
      <section className="bg-white border border-slate-200 rounded-xl p-8">
        {/* Basic Information content */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">Basic Information</span>
          <span className="text-base text-slate-500 font-normal">Essential project details</span>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
            <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="Enter project title" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
              <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="Client name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
              <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base">
                <option>Select type</option>
                <option>Web Design</option>
                <option>Mobile App</option>
                <option>Branding</option>
                <option>UI/UX Design</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="mm/dd/yyyy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
              <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="mm/dd/yyyy" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded flex items-center">UI/UX <span className="ml-1 text-blue-400 cursor-pointer">×</span></span>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded flex items-center">React <span className="ml-1 text-green-400 cursor-pointer">×</span></span>
            </div>
            <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="Add tags (press Enter)" />
          </div>
        </div>
      </section>
    );
  } else if (currentStep === 2) {
    StepContent = (
      <section className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-stretch" style={{ minHeight: '480px' }}>
        {/* Media & Assets content */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 15l4-4a3 3 0 014 0l4 4" /></svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">Media & Assets</span>
          <span className="text-base text-slate-500 font-normal">Upload project images and files</span>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center py-12 mb-6 relative" style={{ minHeight: '160px' }}>
            <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 16v-2a4 4 0 00-8 0v2" />
              <path d="M12 12v4" />
              <path d="M8 16h8" />
              <path d="M12 4v4" />
              <path d="M4 12h16" />
            </svg>
            <p className="text-slate-500 mb-1">Drop your featured image here</p>
            <p className="text-xs text-slate-400 mb-2">PNG, JPG up to 10MB</p>
            <button className="px-5 py-2 bg-blue-500 text-white rounded font-medium text-sm hover:bg-blue-600 transition">Browse Files</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Gallery</label>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg h-32 cursor-pointer text-slate-300 text-3xl">
              <span className="text-3xl">+</span>
            </div>
            <div className="flex items-center justify-center border border-slate-200 rounded-lg h-32 bg-slate-50 text-slate-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 16l2-2a2 2 0 012.8 0l2 2" /></svg>
            </div>
            <div className="flex items-center justify-center border border-slate-200 rounded-lg h-32 bg-slate-50 text-slate-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 16l2-2a2 2 0 012.8 0l2 2" /></svg>
            </div>
          </div>
        </div>
      </section>
    );
  } else if (currentStep === 3) {
    StepContent = (
      <section className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-stretch" style={{ minHeight: '380px' }}>
        {/* Description content */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 12h8M8 16h8M8 8h8" /></svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">Project Description</span>
          <span className="text-base text-slate-500 font-normal">Tell the story of your project</span>
        </div>
        <div className="flex-1 flex flex-col gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <textarea className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" rows={2} placeholder="Brief overview of your project..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Long Description</label>
            <textarea className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" rows={4} placeholder="Detailed description of your project..." />
          </div>
        </div>
      </section>
    );
  } else if (currentStep === 4) {
    StepContent = (
      <section className="bg-white border border-slate-200 rounded-xl p-8">
        {/* Settings & SEO content */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">Settings & SEO</span>
          <span className="text-base text-slate-500 font-normal">Optimize your project for search engines</span>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
            <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="Enter meta title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
            <textarea className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" rows={3} placeholder="Enter meta description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
            <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base" placeholder="Enter keywords (comma-separated)" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl ml-0 mr-auto p-8">
          {StepContent}
        </div>
      </main>
    </div>
  );
}
