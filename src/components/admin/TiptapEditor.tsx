"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CustomImage } from "@/extensions/CustomImage";
import { NodeSelection } from "prosemirror-state";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ImagePlus,
  Layout,
  Columns,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const [selectedWidth, setSelectedWidth] = useState("300");
  const [selectedLayout, setSelectedLayout] = useState("single");
  const [selectedPosition, setSelectedPosition] = useState("left");
  const [textContent, setTextContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-lg",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomImage,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] border p-2 rounded",
      },
    },
    immediatelyRender: false,
  });

  // Selected image width state
  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      const selection = editor.state.selection;

      if (
        selection instanceof NodeSelection &&
        selection.node.type.name === "customImage"
      ) {
        const attrs = selection.node.attrs;
        const widthPx = parseInt(attrs.width?.replace("px", "") || "300");
        setSelectedWidth(widthPx.toString());
        setSelectedLayout(attrs.layout || "single");
        setSelectedPosition(attrs.position || "left");
        setTextContent(attrs.textContent || "");
      }
    };

    editor.on("selectionUpdate", handleSelectionChange);

    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
    };
  }, [editor]);

  const updateImageAttrs = useCallback(
    (
      attrs: Partial<{
        align: string;
        width: string;
        layout: string;
        position: string;
        textContent: string;
      }>
    ) => {
      if (!editor) return;

      const { state, commands } = editor;
      const selection = state.selection;

      // Only update if a customImage node is selected
      if (
        selection instanceof NodeSelection &&
        selection.node.type.name === "customImage"
      ) {
        commands.updateAttributes("customImage", {
          ...selection.node.attrs,
          ...attrs,
        });
      } else {
        // If no image is selected, try to find and update the last inserted image
        const { tr } = state;
        const customImageNodes: Array<{ node: { type: { name: string }; attrs: Record<string, unknown> }; pos: number }> = [];
        
        tr.doc.descendants((node, pos) => {
          if (node.type.name === "customImage") {
            customImageNodes.push({ node, pos });
          }
        });

        if (customImageNodes.length > 0) {
          // Update the last customImage node
          const lastImage = customImageNodes[customImageNodes.length - 1];
          const newAttrs = { ...lastImage.node.attrs, ...attrs };
          
          commands.updateAttributes("customImage", newAttrs);
        }
      }
    },
    [editor]
  );

  const uploadImage = useCallback(
    async (file: File) => {
      const filePath = `events/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        alert("Image upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      editor?.commands.focus();
      editor?.commands.insertCustomImage({
        src: data?.publicUrl ?? "",
        width: "300px",
        align: "center",
        layout: "single",
        position: "left",
        textContent: "",
      });
    },
    [editor]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-3">
      {/* Text Editing Area */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Text Editing</h3>
        <div className="flex gap-4 items-center flex-wrap border p-2 rounded bg-muted/30">
          {/* Text Alignment Group */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className="text-sm px-2 py-1 hover:border rounded"
            >
              <AlignLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              className="text-sm px-2 py-1 hover:border rounded"
            >
              <AlignCenter size={20} />
            </button>
            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              className="text-sm px-2 py-1 hover:border rounded"
            >
              <AlignRight size={20} />
            </button>
          </div>
        </div>

        {/* Image Management - Simplified */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Image Management
          </h3>
          <div className="flex gap-4 items-center flex-wrap border p-2 rounded bg-muted/30">
            {/* Image Upload */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="editor-image-upload"
                className="text-sm p-2 border rounded cursor-pointer inline-block hover:bg-gray-100"
              >
                <ImagePlus size={16} className="inline mr-1" />
                Upload
              </label>
              <input
                id="editor-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Image Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Size:</span>
              <input
                id="image-width"
                type="range"
                min={100}
                max={800}
                value={selectedWidth}
                onChange={(e) => {
                  setSelectedWidth(e.target.value);
                  updateImageAttrs({ width: `${e.target.value}px` });
                }}
                className="w-20"
              />
              <span className="text-sm">{selectedWidth}px</span>
            </div>

            {/* Layout */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Layout:</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedLayout("single");
                  updateImageAttrs({ layout: "single" });
                }}
                className={`text-sm px-2 py-1 border rounded ${
                  selectedLayout === "single" ? "bg-blue-100" : ""
                }`}
                title="Single Column"
              >
                <Layout size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedLayout("double");
                  updateImageAttrs({ layout: "double" });
                }}
                className={`text-sm px-2 py-1 border rounded ${
                  selectedLayout === "double" ? "bg-blue-100" : ""
                }`}
                title="Two Columns"
              >
                <Columns size={16} />
              </button>
            </div>

            {/* Image Position (Only shown when two columns) */}
            {selectedLayout === "double" && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Position:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosition("left");
                    updateImageAttrs({ position: "left" });
                  }}
                  className={`text-sm px-2 py-1 border rounded ${
                    selectedPosition === "left" ? "bg-green-100" : ""
                  }`}
                  title="Image Left"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPosition("right");
                    updateImageAttrs({ position: "right" });
                  }}
                  className={`text-sm px-2 py-1 border rounded ${
                    selectedPosition === "right" ? "bg-green-100" : ""
                  }`}
                  title="Image Right"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Text Input (Only shown when two columns) */}
          {selectedLayout === "double" && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Text:</span>
              <textarea
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  // Don't update image attributes immediately to prevent duplication
                }}
                onBlur={(e) => {
                  // Only update when user finishes editing
                  updateImageAttrs({ textContent: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    // Update when user presses Ctrl+Enter
                    updateImageAttrs({ textContent: e.currentTarget.value });
                    e.currentTarget.blur(); // Remove focus
                  }
                }}
                placeholder="Enter text... (Ctrl+Enter to save)"
                className="px-2 py-1 border rounded w-60 resize-none"
                style={{ fontSize: '1.125rem', lineHeight: '1.6' }}
                rows={3}
              />
            </div>
          )}
        </div>
        {/* Editor */}
        <div className="editor-wrapper clearfix">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
