"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ImagePlus } from "lucide-react";

type Props = { initialImages: string[] };

export default function HeroSliderEditor({ initialImages }: Props) {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("home_sections")
      .update({ image_urls: images })
      .eq("key", "hero");
    setBusy(false);
    if (error) return alert(error.message);
    alert("Saved!");
  };

  const onUpload = async (file: File) => {
    setBusy(true);
    const path = `hero/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (error) {
      setBusy(false);
      return alert("Upload failed: " + error.message);
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setImages((prev) => [...prev, data.publicUrl]);
    setBusy(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...images];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return;
    [next[idx], next[to]] = [next[to], next[idx]];
    setImages(next);
  };

  const remove = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="border p-3 rounded bg-muted/40">
      <div className="mb-3 font-semibold">Hero Slider Images</div>

      <div className="flex gap-3 flex-wrap">
        {images.map((src, i) => (
          <div key={i} className="w-32 relative border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`img-${i}`}
              className="w-32 h-20 object-cover"
            />
            <div className="flex justify-between p-1 text-xs">
              <button onClick={() => move(i, -1)} className="underline">
                Up
              </button>
              <button onClick={() => move(i, 1)} className="underline">
                Down
              </button>
              <button
                onClick={() => remove(i)}
                className="text-red-600 underline"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {/* Image Upload button */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="bg-white border text-black p-1 rounded hover:bg-black hover:text-white transition"
          disabled={busy}
        >
          <ImagePlus size={22} className="inline mr-1" />
        </button>

        {/* Hidden Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onUpload(e.target.files[0]);
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        {/* Save Button */}
        <button
          onClick={save}
          disabled={busy}
          className="bg-white border text-black hover:bg-black hover:text-white transition px-3 py-1 rounded"
        >
          {busy ? "Saving..." : "Save Slider"}
        </button>
      </div>
    </div>
  );
}
