import Link from "next/link";
import products from "@/data/products.json";

export default function ProductsPage() {
  return (
    <div className="bg-background text-foreground py-16 px-6 md:px-24">
      <h1 className="text-3xl font-semibold mb-8">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="border p-4 rounded shadow hover:shadow-lg transition block"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="w-fullaspect-[4/3] object-cover rounded mb-4"
            />
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.brand}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
