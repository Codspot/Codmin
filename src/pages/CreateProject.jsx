import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentScreen, setCurrentProjectStep } from "../store/uiSlice";
import { supabase } from "../supabaseClient";

export default function CreateProject() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.ui.currentProjectStep);

  // Form state
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [url, seturl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const featuredInputRef = useRef();
  const galleryInputRef = useRef();

  useEffect(() => {
    dispatch(setCurrentScreen("createProject"));
  }, [dispatch]);

  // Tag input handler
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  // Image upload handlers
  const handleFeaturedChange = (e) => {
    if (e.target.files[0]) setFeaturedImage(e.target.files[0]);
  };
  const handleGalleryChange = (e) => {
    setGallery([...gallery, ...Array.from(e.target.files)]);
  };
  const removeGalleryImage = (idx) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  // Upload image to Supabase Storage with CORS handling
  const uploadImage = async (file, folder = "projects") => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 8)}.${fileExt}`;

      // Upload with explicit options for CORS
      const { data, error } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  // Publish handler with enhanced error handling
  const handlePublish = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error("Project title is required");
      }

      let featuredUrl = "";
      let galleryUrls = [];

      // Upload images with error handling
      if (featuredImage) {
        try {
          featuredUrl = await uploadImage(featuredImage, "projects/featured");
        } catch (imgError) {
          throw new Error(`Featured image upload failed: ${imgError.message}`);
        }
      }

      if (gallery.length > 0) {
        try {
          galleryUrls = await Promise.all(
            gallery.map((img) => uploadImage(img, "projects/gallery"))
          );
        } catch (imgError) {
          throw new Error(`Gallery images upload failed: ${imgError.message}`);
        }
      }

      // Prepare project data without manual ID
      const projectData = {
        title: title.trim(),
        client: client.trim() || null,
        type: type || null,
        start_date: startDate || null,
        end_date: endDate || null,
        tags: tags.length > 0 ? tags.join(",") : null,
        featured_image: featuredUrl || null,
        project_gallery: galleryUrls.length > 0 ? galleryUrls : null,
        short_desc: shortDesc.trim() || null,
        long_desc: longDesc.trim() || null,
        meta_title: metaTitle.trim() || null,
        meta_desc: metaDesc.trim() || null,
        keywords: keywords.trim() || null,
        status: "Published",
      };

      // Insert project into Supabase with retry logic
      let insertAttempts = 0;
      const maxAttempts = 3;

      while (insertAttempts < maxAttempts) {
        try {
          const { data, error: insertError } = await supabase
            .from("projects")
            .insert([projectData])
            .select();

          if (insertError) {
            throw insertError;
          }

          setSuccess("Project published successfully!");
          setTimeout(() => {
            window.location.href = "/projects";
          }, 1200);
          break;
        } catch (insertError) {
          insertAttempts++;
          console.error(
            `Insert attempt ${insertAttempts} failed:`,
            insertError
          );

          if (insertAttempts >= maxAttempts) {
            throw new Error(
              `Database insert failed after ${maxAttempts} attempts: ${insertError.message}`
            );
          }

          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {
      console.error("Publish error:", err);
      setError(err.message || "Failed to publish project.");
    } finally {
      setLoading(false);
    }
  };

  // Render only the current step's section
  let StepContent = null;
  if (currentStep === 1) {
    StepContent = (
      <section className="bg-white border border-slate-200 rounded-xl p-8">
        {/* Basic Information content */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">
            Basic Information
          </span>
          <span className="text-base text-slate-500 font-normal">
            Essential project details
          </span>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Client
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
                placeholder="Client name"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project Type
              </label>
              <select
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select type</option>
                <option>Web Design</option>
                <option>Mobile App</option>
                <option>Branding</option>
                <option>UI/UX Design</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Completion Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded flex items-center"
                >
                  {tag}{" "}
                  <span
                    className="ml-1 text-blue-400 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Enter project Url"
              value={title}
              onChange={(e) => seturl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              github Url
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Enter project Url"
              value={title}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
        </div>
      </section>
    );
  } else if (currentStep === 2) {
    StepContent = (
      <section
        className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-stretch"
        style={{ minHeight: "480px" }}
      >
        {/* Media & Assets content */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M4 15l4-4a3 3 0 014 0l4 4" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">
            Media & Assets
          </span>
          <span className="text-base text-slate-500 font-normal">
            Upload project images and files
          </span>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Featured Image
          </label>
          <div
            className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center py-12 mb-6 relative"
            style={{ minHeight: "160px" }}
          >
            {featuredImage ? (
              <div className="mb-2 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(featuredImage)}
                  alt="Preview"
                  className="h-24 rounded mb-2 object-cover"
                />
                <button
                  className="text-xs text-red-500 underline"
                  onClick={() => setFeaturedImage(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="w-10 h-10 text-slate-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 16v-2a4 4 0 00-8 0v2" />
                  <path d="M12 12v4" />
                  <path d="M8 16h8" />
                  <path d="M12 4v4" />
                  <path d="M4 12h16" />
                </svg>
                <p className="text-slate-500 mb-1">
                  Drop your featured image here
                </p>
                <p className="text-xs text-slate-400 mb-2">
                  PNG, JPG up to 10MB
                </p>
                <button
                  className="px-5 py-2 bg-blue-500 text-white rounded font-medium text-sm hover:bg-blue-600 transition"
                  onClick={() => featuredInputRef.current.click()}
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={featuredInputRef}
                  onChange={handleFeaturedChange}
                />
              </>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Project Gallery
          </label>
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-center border border-slate-200 rounded-lg h-32 bg-slate-50 text-slate-300"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt="Gallery"
                  className="object-cover w-full h-full rounded"
                />
                <button
                  className="absolute top-1 right-1 bg-white text-red-500 rounded-full px-2 py-0.5 text-xs"
                  onClick={() => removeGalleryImage(idx)}
                >
                  ×
                </button>
              </div>
            ))}
            <div
              className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg h-32 cursor-pointer text-slate-300 text-3xl"
              onClick={() => galleryInputRef.current.click()}
            >
              <span className="text-3xl">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={galleryInputRef}
                onChange={handleGalleryChange}
              />
            </div>
          </div>
        </div>
      </section>
    );
  } else if (currentStep === 3) {
    StepContent = (
      <section
        className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-stretch"
        style={{ minHeight: "380px" }}
      >
        {/* Description content */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 12h8M8 16h8M8 8h8" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">
            Project Description
          </span>
          <span className="text-base text-slate-500 font-normal">
            Tell the story of your project
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Short Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              rows={2}
              placeholder="Brief overview of your project..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Long Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              rows={4}
              placeholder="Detailed description of your project..."
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
            />
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
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg mr-2">
            Settings & SEO
          </span>
          <span className="text-base text-slate-500 font-normal">
            Optimize your project for search engines
          </span>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Enter meta title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Meta Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              rows={3}
              placeholder="Enter meta description..."
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900 text-base"
              placeholder="Enter keywords (comma-separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
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
          {/* Error/Success */}
          {error && (
            <div className="mt-6 text-red-600 font-semibold">{error}</div>
          )}
          {success && (
            <div className="mt-6 text-green-600 font-semibold">{success}</div>
          )}
          {/* Publish button only on last step */}
          {currentStep === 4 && (
            <div className="mt-8 flex justify-end">
              <button
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold transition disabled:opacity-60"
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? "Publishing..." : "Publish Project"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
