"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TipTapEditor from "./TiptapEditor";

type SectionData = {
  key: string;
  title?: string;
  content?: string;
};

export default function SectionEditor({ section }: { section: SectionData }) {
  const [title, setTitle] = useState(section.title || "");
  const [content, setContent] = useState(section.content || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("home_sections")
      .update({ title, content })
      .eq("key", section.key);

    if (error) {
      alert("Error saving: " + error.message);
    }

    setSaving(false);
  };

  const isPlainTextSection =
    section.key === "contact_cta" ||
    section.key === "hero" ||
    section.key === "about_preview";

  return (
    <div className="border p-4 rounded bg-muted mb-6">
      <h2 className="font-semibold text-lg mb-2">{section.key}</h2>

      <input
        type="text"
        className="w-full p-2 border mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Section title"
      />

      {isPlainTextSection ? (
        <textarea
          className="w-full h-32 p-2 border rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Section content"
        />
      ) : (
        <TipTapEditor content={content} onChange={setContent} />
      )}

      <button
        className="mt-4 bg-black text-white px-4 py-2 rounded"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
