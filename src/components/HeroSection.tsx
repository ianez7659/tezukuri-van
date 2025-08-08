// import Link from "next/link";
// import HeroSlider from "./HeroSlider";

// export default function HeroSection() {
//   return (
//     <section className="text-center py-16 md:py-0 px-2">
//       <HeroSlider />
//       <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
//         Handcrafted by Us, for You
//       </h1>
//       <p className="text-base sm:text-lg md:text-xl mt-6 mb-8 max-w-2xl mx-auto text-gray-600">
//         Designed and made in Vancouver.
//       </p>
//       <Link
//         href="/products"
//         className="bg-foreground text-background px-6 py-3 rounded hover:bg-gray-800 transition"
//       >
//         Browse Products
//       </Link>
//     </section>
//   );
// }

import { createServerClient } from "@/lib/supabaseClientServer";
import HeroSectionClient from "./HeroSectionClient";
import HeroSlider from "./HeroSlider";

export const revalidate = 10;

type HeroSectionRow = {
  title: string;
  content: string;
  image_urls: string[] | null;
};

export default async function HeroSection() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("home_sections")
    .select("title, content, image_urls")
    .eq("key", "hero")
    .single<HeroSectionRow>();

  if (error || !data) return null;

  return (
    <section className="text-center py-16 md:py-0 px-2">
      <HeroSlider images={data.image_urls ?? []} />
      <HeroSectionClient title={data.title} content={data.content} />
    </section>
  );
}
