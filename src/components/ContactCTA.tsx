"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactCTA() {
  return (
    <motion.section
      className="py-20 px-6 bg-border text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold mb-4 text-heading">
        Have Any Questions?
      </h2>
      <p className="text-muted mb-6">
        We are here to help you on your journey.
      </p>
      <Link
        href="/contact"
        className="bg-foreground text-background px-6 py-3 rounded hover-bg-muted transition"
      >
        Contact Us
      </Link>
    </motion.section>
  );
}
