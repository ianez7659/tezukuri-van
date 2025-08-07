"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ImagePlus } from "lucide-react";
import Link from "next/link";

type AboutSection = {
  id: string;
  section: "hero" | "intro" | "values";
  title: string;
  content: string | null;
  image_url?: string | null;
  value_items?: { title: string; description: string }[] | null;
};

const defaultValues = {
  hero: {
    title: "",
    content: "",
  },
  intro: {
    title: "",
    content: "",
    image_url: "",
  },
  values: {
    title: "",
    value_items: [],
  },
};

export default function AdminAboutPage() {
  const { user, loading: authLoading } = useUser();
  const [sections, setSections] = useState<Record<string, AboutSection>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/admin/login");
    }
  }, [authLoading, user]);

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase.from("about_sections").select("*");

      if (error) {
        console.error("Error fetching about_sections:", error.message);
      } else {
        const sectionMap: Record<string, AboutSection> = {};
        data.forEach((s: AboutSection) => {
          sectionMap[s.section] = s;
        });
        setSections(sectionMap);
      }

      setLoading(false);
    };

    fetchSections();
  }, []);

  const handleChange = (section: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleValueItemChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updated = [...(sections["values"].value_items ?? [])];
    updated[index][field] = value;
    handleChange("values", "value_items", updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.values(sections);

    for (const section of updates) {
      const { id, ...updateData } = section;
      const { error } = await supabase
        .from("about_sections")
        .update(updateData)
        .eq("id", id);

      if (error) {
        alert(`Failed to save section ${section.section}: ${error.message}`);
        console.error(error);
        setSaving(false);
        return;
      }
    }

    alert("Saved successfully!");
    setSaving(false);
  };

  if (authLoading || loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-12">
      <div className="mb-4">
        <Link
          href="/admin/dashboard"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit About Page</h1>

      {/* Hero Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Hero Section</h2>
        <input
          className="w-full border p-2 mb-2 rounded"
          value={sections.hero?.title ?? ""}
          onChange={(e) => handleChange("hero", "title", e.target.value)}
        />
        <textarea
          className="w-full border p-2 h-24 rounded"
          value={sections.hero?.content ?? ""}
          onChange={(e) => handleChange("hero", "content", e.target.value)}
        />
      </section>

      {/* Intro Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Intro Section</h2>
        <input
          className="w-full border p-2 mb-2 rounded"
          value={sections.intro?.title ?? ""}
          onChange={(e) => handleChange("intro", "title", e.target.value)}
        />
        <textarea
          className="w-full border p-2 h-24 mb-2 rounded"
          value={sections.intro?.content ?? ""}
          onChange={(e) => handleChange("intro", "content", e.target.value)}
        />
        <div className="flex gap-2 items-center mb-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Image URL"
            value={sections.intro?.image_url ?? ""}
            onChange={(e) => handleChange("intro", "image_url", e.target.value)}
          />

          {/* Hidden input for Button */}
          <input
            type="file"
            accept="image/*"
            id="introImageUpload"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const filePath = `about/intro-${Date.now()}-${file.name}`;
              const uploadResult = await supabase.storage
                .from("about-images")
                .upload(filePath, file, { upsert: true });

              if (uploadResult.error) {
                alert("Upload failed: " + uploadResult.error.message);
                return;
              }

              const publicUrlResult = supabase.storage
                .from("about-images")
                .getPublicUrl(filePath);

              const publicUrl = publicUrlResult.data?.publicUrl;

              if (publicUrl) {
                handleChange("intro", "image_url", publicUrl);
                alert("Image uploaded successfully!");
              } else {
                alert("Failed to get public URL.");
              }
            }}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => document.getElementById("introImageUpload")?.click()}
            className="p-2 text-sm border rounded hover:bg-gray-300"
          >
            <ImagePlus size={22} className="inline mr-1" />
          </button>
        </div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Values Section</h2>
        <input
          className="w-full border p-2 mb-2 rounded"
          value={sections.values?.title ?? ""}
          onChange={(e) => handleChange("values", "title", e.target.value)}
        />

        {(sections.values?.value_items ?? []).map((item, i) => (
          <div key={i} className="border p-2 mb-2 rounded space-y-1">
            <input
              className="w-full border p-1 rounded"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleValueItemChange(i, "title", e.target.value)
              }
            />
            <textarea
              className="w-full border p-1 rounded"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleValueItemChange(i, "description", e.target.value)
              }
            />
          </div>
        ))}
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="border bg-white text-black hover:bg-black hover:text-white px-6 py-2 rounded"
      >
        {saving ? "Saving..." : "Save All"}
      </button>
    </main>
  );
}
