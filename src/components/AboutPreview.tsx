import { createServerClient } from "@/lib/supabaseClientServer";
import AboutPreviewClient from "./AboutPreviewClient";

// export const revalidate = 10; // ISR

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
