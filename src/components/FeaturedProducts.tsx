"use client";

import Link from "next/link";
import products from "@/data/products.json";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeaturedProducts() {
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
                  src={p.imageUrl}
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
