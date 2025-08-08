import { createServerClient } from "@/lib/supabaseClientServer";
import ContactCTAContent from "./ContactCTAClient";

// export const revalidate = 10; // ISR

export default async function ContactCTA() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("home_sections")
    .select("title, content")
    .eq("key", "contact_cta")
    .single();

  if (error || !data) return null;

  return <ContactCTAContent title={data.title} content={data.content} />;
}
