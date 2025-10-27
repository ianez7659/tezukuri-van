"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
// import TiptapEditor from "./TiptapEditor";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
});

type Event = {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  start_date?: string;
  end_date?: string;
};

type Props = {
  initialEvent: Event;
  onSaved: () => void;
  onCancel: () => void;
};

export default function EventForm({ initialEvent, onSaved, onCancel }: Props) {
  const [formData, setFormData] = useState<Event>({ ...initialEvent });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `events/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data?.publicUrl ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      ...(formData.start_date && { start_date: formData.start_date }),
      ...(formData.end_date && { end_date: formData.end_date }),
    };

    let error = null;

    if (formData.id) {
      const { error: updateError } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", formData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("events")
        .insert(eventData);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      console.error("Save failed:", error.message);
      alert("Failed to save event");
    } else {
      onSaved();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded-lg bg-[var(--background)] text-[var(--foreground)]"
    >
      <h2 className="text-xl font-semibold mb-6">Create Event</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 이미지 컬럼 */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Event Image</label>
          
          {/* Image preview */}
          {formData.image_url ? (
            <img
              src={formData.image_url}
              alt="preview"
              className="w-full h-64 md:h-80 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">No Image Selected</span>
            </div>
          )}

          {/* Upload Button */}
          <label
            htmlFor="main-image-upload"
            className="cursor-pointer bg-[var(--background)] text-[var(--foreground)] text-sm text-center px-4 py-2 rounded border border-[var(--foreground)] hover:bg-black hover:text-white transition-colors block"
          >
            Upload Image
          </label>

          <input
            id="main-image-upload"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImage(file);
              if (url) {
                setFormData((prev) => ({ ...prev, image_url: url }));
              }
            }}
            className="hidden"
          />

          {/* Image URL input */}
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="or enter image URL manually"
            className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 rounded text-[var(--foreground)] text-sm"
          />
        </div>

        {/* 텍스트 컬럼 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 rounded text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date (Optional)</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 rounded text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 rounded text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <TiptapEditor
              content={formData.description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, description: html }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
