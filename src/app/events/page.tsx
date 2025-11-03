import { createServerClient } from "@/lib/supabaseClientServer";
import { notFound } from "next/navigation";
import AnimatedEvents from "@/components/AnimatedEvents";
import EventsList from "@/components/EventsList";

export const revalidate = 10;

export default async function EventsPage() {
  const supabase = createServerClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch events:", error.message);
    return notFound();
  }

  return (
    <AnimatedEvents>
      <h1 className="text-4xl font-bold text-heading mb-8 text-center">
        Upcoming Events
      </h1>

      <EventsList events={events} />
    </AnimatedEvents>
  );
}
