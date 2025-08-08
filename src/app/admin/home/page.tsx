"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SectionEditor from "@/components/admin/SectionEditor";
import HeroSliderEditor from "@/components/admin/HeroSliderEditor";
import Link from "next/link";

type Section = {
  id: string;
  key: string;
  content: string;
  title?: string;
  subtitle?: string;
  image_urls?: string[];
  updated_at?: string;
};

export default function AdminHomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("home_sections")
        .select("*")
        .order("key", { ascending: true });

      if (error) {
        setError("Failed to load sections.");
        console.error(error);
      } else {
        setSections(data as Section[]);
      }

      setLoading(false);
    };

    fetchSections();
  }, []);

  if (loading) {
    return <p className="p-6 text-muted">Loading sections...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <main className="p-6 space-y-12 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          href="/admin/dashboard"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-heading">Edit Home Page</h1>

      {sections.map((section) => (
        <div key={section.key} className="space-y-4">
          <SectionEditor section={section} />
          {section.key === "hero" && (
            <HeroSliderEditor initialImages={section.image_urls ?? []} />
          )}
        </div>
      ))}
    </main>
  );
}
