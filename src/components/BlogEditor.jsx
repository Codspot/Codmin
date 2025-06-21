import React, { useRef, useState } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaHeading, FaQuoteLeft, FaListUl, FaListOl, FaLink, FaImage, FaCode, FaExpand, FaCompress, FaUndo, FaRedo
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function BlogEditor({ value, onChange }) {
  const [preview, setPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [history, setHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textareaRef = useRef(null);

  // Update content and history
  const handleContentChange = (val) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(val);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange(val);
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  // Helper to wrap selected text
  const formatText = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    let newText =
      value.slice(0, start) + before + selected + after + value.slice(end);
    handleContentChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  // Toolbar actions
  const actions = [
    { icon: <FaUndo />, onClick: undo, label: "Undo" },
    { icon: <FaRedo />, onClick: redo, label: "Redo" },
    { divider: true },
    { icon: <FaBold />, onClick: () => formatText("**", "**"), label: "Bold" },
    { icon: <FaItalic />, onClick: () => formatText("*", "*"), label: "Italic" },
    { icon: <FaUnderline />, onClick: () => formatText("<u>", "</u>"), label: "Underline" },
    { divider: true },
    { icon: <FaHeading />, onClick: () => formatText("# ", ""), label: "Heading" },
    { icon: <FaQuoteLeft />, onClick: () => formatText("> ", ""), label: "Quote" },
    { icon: <FaListUl />, onClick: () => formatText("- ", ""), label: "Bulleted List" },
    { icon: <FaListOl />, onClick: () => formatText("1. ", ""), label: "Numbered List" },
    { divider: true },
    { icon: <FaLink />, onClick: () => formatText("[", "](url)"), label: "Link" },
    { icon: <FaImage />, onClick: () => formatText("![", "](image-url)"), label: "Image" },
    { icon: <FaCode />, onClick: () => formatText("```\n", "\n```"), label: "Code Block" },
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${fullscreen ? "fixed inset-0 z-50 bg-white max-w-full max-h-full p-0 m-0" : ""}`} style={fullscreen ? {margin:0, padding:0} : {}}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Content Editor</h2>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-lg font-medium ${preview ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            onClick={() => setPreview((p) => !p)}
          >
            Preview
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            onClick={() => setFullscreen((f) => !f)}
          >
            {fullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center space-x-2 mb-4 flex-wrap">
          {actions.map((action, i) =>
            action.divider ? (
              <div key={i} className="w-px h-6 bg-gray-300 mx-1" />
            ) : (
              <button
                key={action.label}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                type="button"
                title={action.label}
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            )
          )}
        </div>
        {!preview ? (
          <textarea
            ref={textareaRef}
            className="w-full h-[600px] p-8 border-none outline-none resize-none text-gray-700 leading-relaxed text-lg bg-white text-left"
            placeholder={`Start writing your amazing content here...\n\nYou can use markdown formatting:\n# Heading 1\n## Heading 2\n**Bold text**\n*Italic text*\n[Link](https://example.com)\n![Image](image-url)\n\n> Blockquote\n- List item\n1. Numbered list\n\ncode block`}
            value={value}
            onChange={e => handleContentChange(e.target.value)}
            style={{textAlign: 'left'}}
          />
        ) : (
          <div className="prose prose-lg max-w-none bg-white p-8 min-h-[600px] border-none outline-none text-gray-700 leading-relaxed text-lg overflow-auto text-left">
            <ReactMarkdown>{value || "_Nothing to preview_"}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
