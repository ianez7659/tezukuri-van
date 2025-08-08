// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function AboutPreview() {
//   return (
//     <motion.section
//       className="py-16 px-6 md:px-24 bg-border text-center"
//       initial={{ opacity: 0 }}
//       whileInView={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       viewport={{ once: true }}
//     >
//       <h2 className="text-2xl font-semibold mb-6 text-heading">Our Story</h2>

//       <p className="mt-4 max-w-2xl mx-auto mb-6 text-muted">
//         In classic Vancouver fashion, TEZUKURI VAN was born in a basement, is
//         still in a basement, and will always be in a basement. We started out
//         making things we love, shared them with friends and family, and have
//         been winging it since then.
//       </p>

//       <Link
//         href="/about"
//         className="text-foreground underline font-medium hover:text-muted"
//       >
//         Learn more about us →
//       </Link>
//     </motion.section>
//   );
// }

// src/components/AboutPreview.tsx
import { createServerClient } from "@/lib/supabaseClientServer";
import AboutPreviewClient from "./AboutPreviewClient";

export const revalidate = 10; // ISR

export default async function AboutPreview() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("home_sections")
    .select("title, content")
    .eq("key", "about_preview")
    .single();

  if (error || !data) return null;

  return <AboutPreviewClient title={data.title} content={data.content} />;
}
