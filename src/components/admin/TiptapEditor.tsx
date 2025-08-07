"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CustomImage } from "@/extensions/CustomImage";
import { NodeSelection } from "prosemirror-state";
import TextAlign from "@tiptap/extension-text-align";
import { ImagePlus, AlignCenter, AlignLeft, AlignRight } from "lucide-react";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const [selectedWidth, setSelectedWidth] = useState("300");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-base",
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
      }
    };

    editor.on("selectionUpdate", handleSelectionChange);

    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
    };
  }, [editor]);

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

      editor
        ?.chain()
        .focus()
        .insertCustomImage({
          src: data?.publicUrl,
          width: "300px",
          align: "center",
        })
        .run();
    },
    [editor]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const updateImageAttrs = (
    attrs: Partial<{ align: string; width: string }>
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
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex gap-4 items-center flex-wrap border p-2 rounded bg-muted/30">
        <label
          htmlFor="editor-image-upload"
          className="text-sm p-2 border rounded cursor-pointer inline-block hover:bg-gray-100"
        >
          <ImagePlus size={20} className="inline mr-1" />
        </label>
        <input
          id="editor-image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className="text-sm px-2 py-1 hover:border rounded"
        >
          <AlignLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className="text-sm px-2 py-1 hover:border rounded"
        >
          <AlignCenter size={20} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className="text-sm px-2 py-1 hover:border rounded"
        >
          <AlignRight size={20} />
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="image-width" className="text-sm">
            Width
          </label>
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
          />
          <span className="text-sm">{selectedWidth}px</span>
        </div>
      </div>

      {/* Editor */}
      <div className="editor-wrapper clearfix">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
