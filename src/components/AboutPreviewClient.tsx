"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  title: string;
  content: string;
};

export default function AboutPreviewClient({ title, content }: Props) {
  return (
    <motion.section
      className="py-16 px-6 md:px-24 bg-border text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-heading">{title}</h2>

      <p className="mt-4 max-w-2xl mx-auto mb-6 text-muted">{content}</p>

      <Link
        href="/about"
        className="text-foreground underline font-medium hover:text-muted"
      >
        Learn more about us →
      </Link>
    </motion.section>
  );
}
