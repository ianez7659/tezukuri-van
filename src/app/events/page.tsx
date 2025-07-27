"use client";
import { motion } from "framer-motion";

export default function EventsPage() {
  return (
    <motion.main
      className="min-h-screen px-6 py-20 md:px-24 bg-background text-foreground text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-heading mb-4">Upcoming Events</h1>
      <p className="text-muted text-lg">
        Our events are being crafted. Please check back soon!
      </p>
    </motion.main>
  );
}
