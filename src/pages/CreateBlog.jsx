import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../supabaseClient";
import { setCurrentScreen } from "../store/uiSlice";
import RichTextEditor from "../components/RichTextEditor";
import MediaSelector from "../components/MediaSelector";

export default function CreateBlog() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featured_image: "",
    meta_title: "",
    meta_description: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const featuredInputRef = useRef();

  React.useEffect(() => {
    dispatch(setCurrentScreen("createBlog"));
  }, [dispatch]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    let wordCount = 0;

    try {
      // Try to parse as JSON (Lexical format)
      const parsedContent = JSON.parse(content);
      // Extract text from Lexical JSON structure
      const extractText = (node) => {
        if (node.type === "text") {
          return node.text || "";
        }
        if (node.children) {
          return node.children.map(extractText).join(" ");
        }
        return "";
      };

      if (parsedContent.root && parsedContent.root.children) {
        const textContent = parsedContent.root.children
          .map(extractText)
          .join(" ");
        wordCount = textContent
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
      }
    } catch (error) {
      // Fallback to treating as plain text
      wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    }

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Convert editor content to Markdown for publishing
  const convertToMarkdown = (content) => {
    try {
      // If it's JSON from Lexical editor
      const parsedContent = JSON.parse(content);

      const convertNode = (node) => {
        if (node.type === "text") {
          let text = node.text || "";

          // Apply formatting
          if (node.format) {
            if (node.format & 1) text = `**${text}**`; // Bold
            if (node.format & 2) text = `*${text}*`; // Italic
            if (node.format & 4) text = `\`${text}\``; // Code
            if (node.format & 8) text = `<u>${text}</u>`; // Underline
          }

          return text;
        }

        if (node.type === "paragraph") {
          const childText = node.children
            ? node.children.map(convertNode).join("")
            : "";
          return childText + "\n\n";
        }

        if (node.type === "heading") {
          const level = node.tag ? parseInt(node.tag.replace("h", "")) : 1;
          const headingPrefix = "#".repeat(level);
          const childText = node.children
            ? node.children.map(convertNode).join("")
            : "";
          return `${headingPrefix} ${childText}\n\n`;
        }

        if (node.type === "quote") {
          const childText = node.children
            ? node.children.map(convertNode).join("")
            : "";
          return `> ${childText}\n\n`;
        }

        if (node.type === "list") {
          const items = node.children
            ? node.children
                .map((item, index) => {
                  const itemText = item.children
                    ? item.children.map(convertNode).join("")
                    : "";
                  return node.listType === "number"
                    ? `${index + 1}. ${itemText}`
                    : `- ${itemText}`;
                })
                .join("\n")
            : "";
          return items + "\n\n";
        }

        if (node.children) {
          return node.children.map(convertNode).join("");
        }

        return "";
      };

      if (parsedContent.root && parsedContent.root.children) {
        let markdown = parsedContent.root.children.map(convertNode).join("");

        // Extract images from the actual DOM and add them to markdown
        const editorElement = document.querySelector(
          '[contenteditable="true"]'
        );
        if (editorElement) {
          const images = editorElement.querySelectorAll("img[data-image-url]");
          images.forEach((img) => {
            const imageMarkdown = `\n![${img.dataset.altText || "Image"}](${
              img.dataset.imageUrl
            })\n`;
            markdown += imageMarkdown;
          });
        }

        return markdown.trim();
      }

      return content;
    } catch (error) {
      // If it's already plain text/markdown, return as is
      return content;
    }
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "content" && { reading_time: calculateReadingTime(value) }),
    }));
  };

  // Handle tags
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        handleChange("tags", [...formData.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    handleChange(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  // Handle featured image
  const handleFeaturedChange = (e) => {
    if (e.target.files[0]) setFeaturedImage(e.target.files[0]);
  };

  // Handle media selection from gallery
  const handleMediaSelect = (selectedMedia) => {
    if (selectedMedia && selectedMedia.url) {
      // Create a mock file object for consistency with existing code
      const mockFile = {
        url: selectedMedia.url,
        name: selectedMedia.name,
        fromGallery: true,
      };
      setFeaturedImage(mockFile);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `blogs/${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  // Save blog post
  const handleSave = async (publishNow = false) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Blog title is required");
      }

      // Validate content (JSON format from Lexical editor)
      if (
        !formData.content ||
        formData.content.trim() === "" ||
        formData.content.trim() === "{}"
      ) {
        throw new Error("Blog content is required");
      }

      // Additional content validation for JSON
      try {
        const parsedContent = JSON.parse(formData.content);
        if (
          !parsedContent.root ||
          !parsedContent.root.children ||
          parsedContent.root.children.length === 0
        ) {
          throw new Error("Blog content is required");
        }
      } catch (jsonError) {
        // If it's not JSON, treat as plain text and validate
        if (formData.content.trim().length < 10) {
          throw new Error("Blog content must be at least 10 characters long");
        }
      }

      let featuredUrl = "";
      if (featuredImage) {
        if (featuredImage.fromGallery) {
          // Use existing URL from gallery
          featuredUrl = featuredImage.url;
        } else {
          // Upload new file
          featuredUrl = await uploadImage(featuredImage);
        }
      }

      // Generate slug
      const slug = generateSlug(formData.title);

      // Calculate reading time from content
      const calculatedReadingTime = calculateReadingTime(formData.content);

      // Generate excerpt if not provided
      let excerpt = formData.excerpt.trim();
      if (!excerpt) {
        try {
          // Try to extract text from JSON content for excerpt
          const parsedContent = JSON.parse(formData.content);
          const extractText = (node) => {
            if (node.type === "text") {
              return node.text || "";
            }
            if (node.children) {
              return node.children.map(extractText).join(" ");
            }
            return "";
          };

          const textContent =
            parsedContent.root?.children?.map(extractText).join(" ") || "";
          excerpt =
            textContent.substring(0, 200) +
            (textContent.length > 200 ? "..." : "");
        } catch {
          // Fallback for plain text content
          excerpt =
            formData.content.substring(0, 200) +
            (formData.content.length > 200 ? "..." : "");
        }
      }

      // Convert content to markdown for publishing, keep JSON for drafts
      const contentToSave = publishNow
        ? convertToMarkdown(formData.content)
        : formData.content;

      // Get current user (you may need to get this from your auth state)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Generate random ID for the blog post
      const randomId = Math.floor(Math.random() * 1000000000) + Date.now();

      // Prepare blog data - matching your database schema exactly
      const blogData = {
        id: randomId,
        title: formData.title.trim(),
        description:
          formData.excerpt.trim() ||
          contentToSave.substring(0, 200) +
            (contentToSave.length > 200 ? "..." : ""),
        content: contentToSave,
        image_url: featuredUrl || null,
        date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
        tags: formData.tags.length > 0 ? formData.tags.join(",") : null,
        meta_title: formData.meta_title.trim() || formData.title.trim(),
        meta_description: formData.meta_description.trim(),
        published_at: publishNow ? new Date().toISOString() : null,
      };

      // Insert into Supabase
      console.log("Inserting blog data:", blogData); // Debug log
      const { data, error: insertError } = await supabase
        .from("Blogs")
        .insert(blogData) // Remove array brackets - insert single object
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError); // Debug log
        throw insertError;
      }

      setSuccess(`Blog ${publishNow ? "published" : "saved"} successfully!`);

      setTimeout(() => {
        window.location.href = "/blogs";
      }, 1500);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => (window.location.href = "/blogs")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-semibold text-lg">Back to Blog Posts</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                {loading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8 min-h-0 overflow-hidden">
        <div className="h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left Sidebar */}
            <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div
                className="h-[calc(100vh-8rem)] overflow-y-hidden hover:overflow-y-auto space-y-6 pb-6 pr-2 transition-all duration-200 custom-scrollbar"
                style={{
                  scrollbarWidth: "none" /* Firefox */,
                  msOverflowStyle: "none" /* Internet Explorer 10+ */,
                }}
              >
                {/* Blog Title & Excerpt */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blog Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your compelling blog title..."
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full px-4 py-3 text-lg border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excerpt (Optional)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Brief description of your blog post..."
                      value={formData.excerpt}
                      onChange={(e) => handleChange("excerpt", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Post Settings Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">
                    Post Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Business">Business</option>
                        <option value="Tutorial">Tutorial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag, idx) => (
                          <span
                            key={tag}
                            className="inline-flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium"
                          >
                            {tag}
                            <button
                              className="ml-2 text-gray-400 hover:text-gray-700 bg-none border-none cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Image Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">
                    Featured Image
                  </h3>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    {featuredImage ? (
                      <div className="w-full">
                        <img
                          src={
                            featuredImage.fromGallery
                              ? featuredImage.url
                              : URL.createObjectURL(featuredImage)
                          }
                          alt="Preview"
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <button
                          onClick={() => setFeaturedImage(null)}
                          className="w-full text-sm text-red-500 hover:text-red-700 underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="space-y-2">
                          <div className="flex justify-center space-x-2">
                            <label className="bg-emerald-600 text-white px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-emerald-700 transition-colors">
                              Upload New
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                ref={featuredInputRef}
                                onChange={handleFeaturedChange}
                              />
                            </label>
                            <button
                              onClick={() => setShowMediaSelector(true)}
                              className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                            >
                              Choose from Gallery
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO & Meta Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">
                    SEO & Meta
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) =>
                          handleChange("meta_title", e.target.value)
                        }
                        placeholder="SEO title (optional)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) =>
                          handleChange("meta_description", e.target.value)
                        }
                        placeholder="SEO description (optional)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              {/* Content Editor - Fixed Height */}
              <div className="h-[calc(100vh-8rem)] mb-6">
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => handleChange("content", content)}
                  placeholder="Start writing your amazing content here..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error/Success Messages */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg">
          {success}
        </div>
      )}

      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={handleMediaSelect}
        allowMultiple={false}
      />
    </div>
  );
}
