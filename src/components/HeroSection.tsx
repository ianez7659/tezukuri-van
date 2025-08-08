import { createServerClient } from "@/lib/supabaseClientServer";
import HeroSectionClient from "./HeroSectionClient";
import HeroSlider from "./HeroSlider";

// export const revalidate = 10;

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
