"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPreview() {
  return (
    <motion.section
      className="py-16 px-6 md:px-24 bg-border text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-heading">Our Story</h2>
      <p className="max-w-2xl mx-auto text-muted mb-6">
        Tezukuri Van is rooted in craftsmanship and simplicity. All of our
        pieces are made by hand in Vancouver, with the road in mind.
      </p>
      <Link
        href="/about"
        className="text-foreground underline font-medium hover:text-muted"
      >
        Learn more about us →
      </Link>
    </motion.section>
  );
}
