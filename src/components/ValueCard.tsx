"use client";
import { motion } from "framer-motion";

export default function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-background p-6 rounded shadow-sm"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className="font-bold text-lg mb-2 text-heading">{title}</h3>
      <p className="text-muted">{description}</p>
    </motion.div>
  );
}
