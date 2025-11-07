import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $createParagraphNode,
  $createTextNode,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import {
  $createListNode,
  $createListItemNode,
  ListNode,
  ListItemNode,
} from "@lexical/list";

// Import supabase for image upload
import { supabase } from "../supabaseClient";

// Custom image command
const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

// Image upload function
const uploadImageToSupabase = async (file) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `media/${Date.now()}-${Math.random()
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

// Custom toolbar component
function ToolbarPlugin({ onFormat }) {
  const [editor] = useLexicalComposerContext();
  const [isUploading, setIsUploading] = React.useState(false);
  const imageInputRef = React.useRef();

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const insertHeading = (level) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(`h${level}`);
        selection.insertNodes([heading]);
      }
    });
  };

  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quote = $createQuoteNode();
        selection.insertNodes([quote]);
      }
    });
  };

  const insertList = (type) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const list = $createListNode(type);
        const listItem = $createListItemNode();
        list.append(listItem);
        selection.insertNodes([list]);
      }
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImageToSupabase(file);

      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Create a new paragraph with the image HTML
          const paragraph = $createParagraphNode();
          const imageText = $createTextNode(
            `📷 Image: ${file.name} - ${imageUrl}`
          );
          paragraph.append(imageText);

          // Insert the paragraph
          selection.insertNodes([paragraph]);
        }
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-start space-x-1 bg-gray-50">
      {/* Undo/Redo */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => editor.dispatchCommand("UNDO_COMMAND")}
        title="Undo"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => editor.dispatchCommand("REDO_COMMAND")}
        title="Redo"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
          />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Text Formatting */}
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md font-bold transition-colors"
        onClick={() => formatText("bold")}
        title="Bold"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
          />
        </svg>
      </button>
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md italic transition-colors"
        onClick={() => formatText("italic")}
        title="Italic"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="19" y1="4" x2="10" y2="4" />
          <line x1="14" y1="20" x2="5" y2="20" />
          <line x1="15" y1="4" x2="9" y2="20" />
        </svg>
      </button>
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => formatText("underline")}
        title="Underline"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Headings */}
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md font-semibold text-sm transition-colors"
        onClick={() => insertHeading(1)}
        title="Heading 1"
      >
        H1
      </button>
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md font-semibold text-sm transition-colors"
        onClick={() => insertHeading(2)}
        title="Heading 2"
      >
        H2
      </button>
      <button
        className="px-3 py-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md font-semibold text-sm transition-colors"
        onClick={() => insertHeading(3)}
        title="Heading 3"
      >
        H3
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Quote */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={insertQuote}
        title="Quote"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Lists */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => insertList("bullet")}
        title="Bullet List"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => insertList("number")}
        title="Numbered List"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="10" y1="6" x2="21" y2="6" />
          <line x1="10" y1="12" x2="21" y2="12" />
          <line x1="10" y1="18" x2="21" y2="18" />
          <path d="m6 6-2 2 2 2" />
          <path d="m6 14 2-2-2-2" />
          <path d="M6 18.5v.5c0 .5-.4 1-1 1s-1-.5-1-1v-.5c0-.3.2-.6.5-.8l1.5-1c.3-.2.5-.5.5-.8v-.5c0-.5-.4-1-1-1s-1 .5-1 1" />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Alignment */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => formatElement("left")}
        title="Align Left"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      </button>
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => formatElement("center")}
        title="Align Center"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => formatElement("right")}
        title="Align Right"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="9" y1="12" x2="21" y2="12" />
          <line x1="6" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Link */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => {
          /* Link functionality */
        }}
        title="Insert Link"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="m9 15 6-6" />
          <path d="m21 3-6.5 6.5a7.5 7.5 0 1 1-11-11L10 2" />
        </svg>
      </button>

      {/* Code */}
      <button
        className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors"
        onClick={() => formatText("code")}
        title="Code"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2"></div>

      {/* Image Upload */}
      <button
        className={`p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-md transition-colors ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => imageInputRef.current?.click()}
        disabled={isUploading}
        title={isUploading ? "Uploading..." : "Insert Image"}
      >
        {isUploading ? (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

// Placeholder component
function Placeholder() {
  return (
    <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none">
      Start writing your amazing content here...
    </div>
  );
}

// Main editor configuration
const theme = {
  // Theme styling
  ltr: "text-left",
  rtl: "text-right",
  placeholder: "text-gray-400",
  paragraph: "mb-4",
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4",
  heading: {
    h1: "text-3xl font-bold mb-4 text-gray-900",
    h2: "text-2xl font-semibold mb-3 text-gray-900",
    h3: "text-xl font-semibold mb-2 text-gray-900",
    h4: "text-lg font-semibold mb-2 text-gray-900",
    h5: "text-base font-semibold mb-2 text-gray-900",
    h6: "text-sm font-semibold mb-2 text-gray-900",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside mb-4 pl-4",
    ul: "list-disc list-inside mb-4 pl-4",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
  },
};

const initialConfig = {
  namespace: "BlogEditor",
  theme,
  onError(error) {
    console.error("Lexical Error:", error);
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleChange = (editorState) => {
    editorState.read(() => {
      // Convert editor state to JSON for Supabase storage
      const json = JSON.stringify(editorState.toJSON());
      onChange(json);
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of imageFiles) {
        const imageUrl = await uploadImageToSupabase(file);

        // Insert image reference as text in the editor
        const imageText = `📷 Image: ${file.name} - ${imageUrl}`;

        // Find the contentEditable element and insert the text
        const contentEditable = document.querySelector(
          '[contenteditable="true"]'
        );
        if (contentEditable) {
          // Focus the editor
          contentEditable.focus();

          // Insert the image reference text
          document.execCommand("insertText", false, imageText + "\n");
        }

        console.log("Image uploaded and inserted:", imageUrl);
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert("Failed to upload one or more images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Initialize editor with existing content
  React.useEffect(() => {
    if (value && initialConfig.editorState === undefined) {
      try {
        const parsedValue = JSON.parse(value);
        initialConfig.editorState = parsedValue;
      } catch (error) {
        // If parsing fails, treat as plain text
        console.log("Initializing with plain text");
      }
    }
  }, [value]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Content Editor</h3>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div
            className={`relative flex-1 min-h-0 overflow-hidden ${
              isDragOver ? "bg-blue-50 border-blue-300" : ""
            } ${isUploading ? "opacity-75" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="h-full overflow-y-auto">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="p-6 outline-none focus:outline-none resize-none text-gray-900 leading-relaxed prose prose-lg max-w-none min-h-full"
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />

            {/* Drag overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center border-2 border-dashed border-blue-300 rounded">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21,15 16,10 5,21" />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-blue-600">
                    Drop images here to upload
                  </p>
                </div>
              </div>
            )}

            {/* Upload overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-blue-500 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Uploading images...
                  </p>
                </div>
              </div>
            )}
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
