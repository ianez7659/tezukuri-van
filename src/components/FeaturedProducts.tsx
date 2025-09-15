"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  order?: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, brand, image_url, order");

        if (error) {
          console.error("Error fetching products:", error);
          return;
        }

        // Sort products by order, then by id for products without order
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
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 md:px-24">
        <h2 className="text-2xl font-semibold mb-6 text-center text-heading">
          Featured Products
        </h2>
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  const featured = products.slice(0, 3);

  return (
    <section className="py-16 px-6 md:px-24">
      <motion.h2
        className="text-2xl font-semibold mb-6 text-center text-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Featured Products
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/products/${p.id}`}
              className="border border-border p-4 rounded shadow hover:shadow-lg transition block bg-background"
            >
              <div className="relative aspect-[4/3] mb-4 rounded overflow-hidden">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i === 0}
                />
              </div>
              <h3 className="font-bold text-lg text-heading">{p.name}</h3>
              <p className="text-sm text-muted">{p.brand}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
