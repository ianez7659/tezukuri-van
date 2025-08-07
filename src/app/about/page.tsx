import { createServerClient } from "@/lib/supabaseClientServer";
import Image from "next/image";
import ValueSection from "@/components/ValueSection";

export const revalidate = 10;

export default async function AboutPage() {
  const supabase = createServerClient();

  const { data: sections, error } = await supabase
    .from("about_sections")
    .select("*");

  if (error || !sections) {
    console.error("Failed to load about content", error?.message);
    return <p className="p-6">Failed to load content</p>;
  }

  const hero = sections.find((s) => s.section === "hero");
  const intro = sections.find((s) => s.section === "intro");
  const values = sections.find((s) => s.section === "values");

  return (
    <main className="pt-20">
      {/* Hero Section */}
      {hero && (
        <section className="text-center py-16 bg-border px-4">
          <h1 className="text-4xl font-bold text-foreground">{hero.title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted">{hero.content}</p>
        </section>
      )}

      {/* Intro Section */}
      {intro && (
        <section className="grid md:grid-cols-2 gap-10 px-6 md:px-24 py-16 items-center bg-background">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              {intro.title}
            </h2>
            <p className="text-muted leading-relaxed">{intro.content}</p>
          </div>
          {intro.image_url && (
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={intro.image_url}
                alt={intro.title}
                fill
                className="rounded-lg shadow object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </section>
      )}

      {/* Values Section */}
      {values && (
        <ValueSection
          title={values.title}
          className="bg-border"
          values={values.value_items}
        />
      )}
    </main>
  );
}
