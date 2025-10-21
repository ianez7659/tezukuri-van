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
        <div className="grid grid-cols-1 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-6 shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* image column */}
                <div className="order-2 md:order-1">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* text column */}
                <div className="order-1 md:order-2 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold">{event.title}</h2>
                  
                  <p className="mb-6 font-bold text-lg text-black">
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} ~{" "}
                    {new Date(event.end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  
                  <div
                    className="event-description text-base text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AnimatedEvents>
  );
}
