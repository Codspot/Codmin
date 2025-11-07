import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaImage,
  FaVideo,
  FaFile,
  FaUpload,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { supabase } from "../supabaseClient";

export default function MediaSelector({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = false,
}) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

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

      // Only get files (filter out any folders and placeholder files)
      const files = data.filter(
        (item) =>
          item.name.includes(".") &&
          !item.name.startsWith(".emptyFolderPlaceholder") &&
          !item.name.startsWith(".") // Filter out any hidden files
      );

      // Get public URLs for all files
      const mediaWithUrls = await Promise.all(
        files.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(`media/${file.name}`);

          return {
            ...file,
            url: urlData.publicUrl,
            type: getFileType(file.name),
            size: formatFileSize(file.metadata?.size || 0),
          };
        })
      );

      setMedia(mediaWithUrls);
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

      try {
        const { data, error } = await supabase.storage
          .from("media")
          .upload(`media/${fileName}`, file, {
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

      if (successful > 0) {
        await fetchMedia(); // Refresh the media list
      }
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleItemSelect = (item) => {
    if (allowMultiple) {
      const isSelected = selectedItems.find(
        (selected) => selected.name === item.name
      );
      if (isSelected) {
        setSelectedItems(
          selectedItems.filter((selected) => selected.name !== item.name)
        );
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      onSelect(item);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    onSelect(allowMultiple ? selectedItems : selectedItems[0]);
    onClose();
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <FaImage className="w-8 h-8 text-blue-500" />;
      case "video":
        return <FaVideo className="w-8 h-8 text-red-500" />;
      default:
        return <FaFile className="w-8 h-8 text-gray-500" />;
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Select Media
            </h2>
            <p className="text-gray-600">
              Choose from your media library or upload new files
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-6 border-b bg-gray-50">
          <div className="relative flex-1 min-w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>

          <label className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center">
            <FaUpload className="mr-2" />
            Upload
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItems.find(
                      (selected) => selected.name === item.name
                    );
                    return (
                      <div
                        key={item.name}
                        onClick={() => handleItemSelect(item)}
                        className={`bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        } relative`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center z-10">
                            <FaCheck className="w-3 h-3" />
                          </div>
                        )}

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
                          <h3
                            className="text-sm font-medium text-gray-900 truncate"
                            title={item.name}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">{item.size}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {allowMultiple && (
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={selectedItems.length === 0}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select{" "}
                {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
