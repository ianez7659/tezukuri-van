import { createServerClient } from "@/lib/supabaseClientServer";
import { notFound } from "next/navigation";
// import type { ComponentType, ReactNode } from "react";
import AnimatedEvents from "@/components/AnimatedEvents";

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
      <h1 className="text-3xl font-bold text-heading mb-8 text-center">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <p className="text-muted text-center text-lg">
          No events found. Please check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6  ">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Starting at {new Date(event.start_date).toLocaleString()} ~{" "}
                {new Date(event.end_date).toLocaleString()}
              </p>
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <div
                className="prose dark:prose-invert text-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          ))}
        </div>
      )}
    </AnimatedEvents>
  );
}
