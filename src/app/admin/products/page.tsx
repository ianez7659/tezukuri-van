"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { PackagePlus, DeleteIcon, Edit, PackageOpen } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import ProductOrderManager from "@/components/admin/ProductOrderManager";
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  gallery_images: string[];
  in_stock: boolean;
  order?: number;
};

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  brand: "",
  category: "",
  image_url: "",
  gallery_images: [],
  in_stock: true,
  order: 0,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'order'>('products');
  const { user, loading: userLoading } = useUser();

  // Check if user is logged in
  useEffect(() => {
    if (!userLoading && !user) {
      redirect("/admin/login");
    }
  }, [userLoading, user]);

  // Fetch products on mount
  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from("products")
          .select("*");
        if (error) {
          console.error("Error fetching products:", error.message);
        } else {
          // Sort products by order, then by id
          const sortedProducts = data.sort((a, b) => {
            if (a.order && b.order) {
              return a.order - b.order;
            }
            if (a.order && !b.order) {
              return -1;
            }
            if (!a.order && b.order) {
              return 1;
            }
            return a.id.localeCompare(b.id);
          });
          setProducts(sortedProducts);
        }
        // setLoading(false);
      };

      fetchProducts();
    }
  }, [user]);

  // Show loading state
  if (userLoading || (!user && typeof window !== "undefined")) {
    return <p>Loading...</p>;
  }

  const handleAddProduct = () => {
    setEditingProduct(emptyProduct);
    setIsAddingNew(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaved = () => {
    setEditingProduct(null);
    setIsAddingNew(false);
    // refetch
    if (user) {
      supabase
        .from("products")
        .select("*")
        .then(({ data, error }) => {
          if (!error) {
            // Sort products by order, then by id
            const sortedProducts = data.sort((a, b) => {
              if (a.order && b.order) {
                return a.order - b.order;
              }
              if (a.order && !b.order) {
                return -1;
              }
              if (!a.order && b.order) {
                return 1;
              }
              return a.id.localeCompare(b.id);
            });
            setProducts(sortedProducts);
          }
        });
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleTabChange = (tab: 'products' | 'order') => {
    setActiveTab(tab);
    // Reset editing state when switching tabs
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link
          href="/admin/dashboard"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex gap-2 items-center text-2xl font-bold">
          <PackageOpen size={25} />
          Product Management
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Management
            </button>
            <button
              onClick={() => handleTabChange('order')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'order'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Order Management
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Products</h2>
            <button
              onClick={handleAddProduct}
              className="flex gap-2 border items-center hover:bg-black hover:text-white px-2 py-2 rounded"
            >
              <PackagePlus size={18} />
              Add Product
            </button>
          </div>

          {isAddingNew && editingProduct?.id === "" && (
            <li className="border p-4 rounded shadow mb-4">
              <ProductForm
                initialProduct={editingProduct}
                onSaved={handleSaved}
                onCancel={handleCancel}
              />
            </li>
          )}

          {products.map((p) => (
            <li key={p.id} className="border p-4 rounded shadow mb-4">
              {editingProduct?.id === p.id ? (
                <ProductForm
                  initialProduct={p}
                  onSaved={handleSaved}
                  onCancel={handleCancel}
                />
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-1">{p.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                  <p className="text-xs text-gray-500 mb-2">Order: {p.order ?? 'Not set'}</p>

                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="rounded mb-2"
                  />

                  <div className="flex flex-wrap gap-2 mb-2">
                    {p.gallery_images?.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`gallery-${i}`}
                        width={80}
                        height={80}
                        className="w-20 h-auto border rounded"
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex gap-2 items-center border hover:bg-black hover:text-white px-3 py-1 rounded"
                    >
                      <Edit size={20} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex gap-2 border items-center hover:bg-black hover:text-white px-3 py-1 rounded"
                    >
                      <DeleteIcon size={20} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </div>
      )}

      {activeTab === 'order' && (
        <div>
          <ProductOrderManager onOrderChanged={handleSaved} />
        </div>
      )}

    </main>
  );
}
