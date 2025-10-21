"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
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
  const [plainText, setPlainText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-lg",
          },
        },
        hardBreak: {
          HTMLAttributes: {
            class: "break-line",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      CustomImage,
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "event-description focus:outline-none min-h-[200px] p-4 border rounded text-base leading-relaxed",
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          // Insert a hard break instead of paragraph
          const { state, dispatch } = view;
          const { selection } = state;
          
          const tr = state.tr.replaceSelectionWith(state.schema.nodes.hardBreak.create());
          dispatch(tr);
          return true;
        }
        return false;
      },
    },
  });

  const updateImageAttrs = useCallback(
    (attrs: Record<string, any>) => {
      if (!editor) return;

      const { state, view } = editor;
      const { selection } = state;

      if (selection instanceof NodeSelection && selection.node.type.name === "customImage") {
        const pos = selection.$anchor.pos;
        const node = selection.node;
        const newAttrs = { ...node.attrs, ...attrs };

        const tr = state.tr.setNodeMarkup(pos, undefined, newAttrs);
        view.dispatch(tr);
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
      {/* Toolbar */}
      <div className="border rounded-lg p-3 bg-gray-50">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("bold") ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("italic") ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("underline") ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Underline"
            >
              <UnderlineIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive("strike") ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-600" : ""
              }`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Image Upload */}
          <div className="flex items-center gap-1">
            <label
              htmlFor="editor-image-upload"
              className="p-2 rounded hover:bg-gray-200 cursor-pointer"
              title="Upload Image"
            >
              <ImagePlus size={16} />
            </label>
            <input
              id="editor-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

    </div>
  );
}