import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaUpload,
  FaTrash,
  FaEye,
  FaCopy,
  FaFilter,
  FaImage,
  FaVideo,
  FaFile,
  FaSearch,
  FaCloudUploadAlt,
  FaFolder,
} from "react-icons/fa";
import { setCurrentScreen } from "../store/uiSlice";
import { supabase } from "../supabaseClient";

export default function Media() {
  const dispatch = useDispatch();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all, image, video, document
  const [dragActive, setDragActive] = useState(false);
  // All media will be stored in the "media" folder

  useEffect(() => {
    dispatch(setCurrentScreen("media"));
  }, [dispatch]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.storage
        .from("media")
        .list("media", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      // Only get files (no folders needed) and filter out placeholder files
      const files = data.filter(
        (item) =>
          item.name.includes(".") &&
          !item.name.startsWith(".emptyFolderPlaceholder") &&
          !item.name.startsWith(".") // Filter out any hidden files
      );

      // Get public URLs for all files
      const filesWithUrls = await Promise.all(
        files.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(`media/${file.name}`);

          return {
            ...file,
            url: urlData.publicUrl,
            type: getFileType(file.name),
            size: formatFileSize(file.metadata?.size || 0),
            isFolder: false,
          };
        })
      );

      setMedia(filesWithUrls);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension))
      return "image";
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) return "video";
    return "document";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 8)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      try {
        const { data, error } = await supabase.storage
          .from("media")
          .upload(filePath, file, {
            upsert: false,
            cacheControl: "3600",
          });

        if (error) throw error;
        return { success: true, fileName };
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        return { success: false, fileName: file.name, error: error.message };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      if (successful > 0) {
        await fetchMedia(); // Refresh the media list
      }

      if (failed > 0) {
        setError(
          `${failed} file(s) failed to upload. ${successful} uploaded successfully.`
        );
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from("media")
        .remove([`media/${fileName}`]);

      if (error) throw error;

      setMedia(media.filter((item) => item.name !== fileName));
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setSuccess("URL copied to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return <FaFolder className="w-8 h-8 text-yellow-500" />;
      case "image":
        return <FaImage className="w-8 h-8 text-blue-500" />;
      case "video":
        return <FaVideo className="w-8 h-8 text-red-500" />;
      default:
        return <FaFile className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-700">Media Library</h2>
          <p className="text-gray-500 mt-1">
            Manage your media assets. ({media.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100">
            <FaFilter />
          </button>
          <label className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors cursor-pointer">
            <FaUpload />
            <span>Upload Image</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center bg-white mb-8 transition-colors ${
          dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <FaCloudUploadAlt className="text-emerald-600 text-xl" />
          </div>
          <p className="text-lg font-medium text-gray-700">
            Drag & drop files here
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <label className="text-sm font-semibold text-emerald-600 hover:underline cursor-pointer">
            Select Files
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
          Uploading files...
        </div>
      )}

      {/* Media Grid */}
      {!loading && (
        <>
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No media files
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your first file to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.name}
                  className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    {item.type === "image" ? (
                      <img
                        className="w-full h-full object-cover"
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        {getFileIcon(item.type)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">{item.size}</p>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="text-white hover:text-emerald-400 transition-colors"
                      title="Copy URL"
                    >
                      <FaCopy className="w-5 h-5" />
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition-colors"
                      title="View"
                    >
                      <FaEye className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.name)}
                      className="text-white hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
