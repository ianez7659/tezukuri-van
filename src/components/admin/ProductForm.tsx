"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import { Edit } from "lucide-react";

type ProductFormProps = {
  initialProduct: Product;
  onSaved: () => void;
  onCancel: () => void;
};

export default function ProductForm({
  initialProduct,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({ ...initialProduct });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "order" ? parseFloat(value) : value,
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `products/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload failed:", error.message);
      alert("Image upload failed");
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image_url: formData.image_url,
      gallery_images: formData.gallery_images,
      brand: "TEZUKURI VAN",
      category: formData.category,
      in_stock: formData.in_stock,
      order: formData.order ?? 0,
    };

    let error = null;

    if (formData.id) {
      // Update existing product
      const { error: updateError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", formData.id);
      error = updateError;
    } else {
      // Add new product
      const { data: insertedData, error: insertError } = await supabase
        .from("products")
        .insert(productData)
        .select() // Ensure we get the inserted data
        .single(); // Use .single() to get a single object back

      error = insertError;

      if (!insertError && insertedData) {
        // Update formData with the new product ID
        setFormData({ ...formData, id: insertedData.id });
      }
    }

    setLoading(false);

    if (error) {
      console.error("Save failed:", error.message);
      alert("Failed to save product");
    } else {
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50">
      <h2 className="flex gap-2 text-lg font-semibold mb-4">
        <Edit size={25} /> Edit Product
      </h2>

      <div className="mb-2">
        <label className="block text-sm">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price ?? 0}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {/* Category field */}
      {/* <div className="mb-2">
        <label className="block text-sm">Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div> */}

      {/* Order field */}
      <div className="mb-2">
        <label className="block text-sm">Display Order</label>
        <input
          type="number"
          name="order"
          value={formData.order ?? 0}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          placeholder="Display order (lower numbers appear first)"
        />
      </div>

      {/* inStock field */}
      <div className="mb-4">
        <label className="block text-sm mb-1">In Stock</label>
        <select
          name="in_stock"
          value={formData.in_stock ? "true" : "false"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              in_stock: e.target.value === "true",
            }))
          }
          className="w-full border px-2 py-1 rounded"
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Main image input + upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Main Image</label>
        <div className="flex items-center gap-2">
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="or paste image URL"
            className="flex-1 border px-2 py-1 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImage(file);
              if (url) {
                setFormData({ ...formData, image_url: url });
              }
            }}
            className="text-sm"
          />
        </div>
      </div>

      {/* Gallery Images Preview */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gallery Images</label>
        <div className="flex flex-wrap gap-4">
          {formData.gallery_images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt={`gallery-${i}`}
                className="w-24 h-24 object-cover rounded border"
              />

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    gallery_images: prev.gallery_images.filter(
                      (_, idx) => idx !== i
                    ),
                  }))
                }
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Upload button */}
          <label className="w-24 h-24 flex items-center justify-center border border-dashed rounded cursor-pointer hover:bg-gray-100">
            <span className="text-xl">＋</span>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const filePath = `products/gallery/${Date.now()}-${file.name}`;
                const { error } = await supabase.storage
                  .from("product-images")
                  .upload(filePath, file);

                if (error) {
                  console.error("Upload error:", error.message);
                  return;
                }

                const { data: publicUrlData } = supabase.storage
                  .from("product-images")
                  .getPublicUrl(filePath);

                if (publicUrlData?.publicUrl) {
                  setFormData((prev) => ({
                    ...prev,
                    gallery_images: [
                      ...prev.gallery_images,
                      publicUrlData.publicUrl,
                    ],
                  }));
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
