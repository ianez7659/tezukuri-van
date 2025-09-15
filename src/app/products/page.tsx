import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClientServer";

export const revalidate = 10; // Revalidate every 10 seconds

export default async function ProductsPage() {
  const supabase = createServerClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return <p>Error loading products</p>;
  }

  // Sort products by order, then by id for products without order
  const sortedProducts = products.sort((a, b) => {
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

  return (
    <div className="bg-background text-foreground py-16 px-6 md:px-24">
      <h1 className="text-3xl font-semibold mb-8">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedProducts.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border p-4 rounded shadow hover:shadow-lg transition block"
          >
            <div className="relative aspect-[4/3] mb-4 rounded overflow-hidden">
              <Image
                src={p.image_url}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.brand}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
