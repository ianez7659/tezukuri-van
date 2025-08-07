"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AnimatedEvents({ children }: Props) {
  return (
    <motion.main
      className="min-h-screen px-6 py-20 md:px-24 bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-xl mx-auto">
        {children}
      </div>
    </motion.main>
  );
}
