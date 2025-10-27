import { createServerClient } from "@/lib/supabaseClientServer";
import { notFound } from "next/navigation";
// import type { ComponentType, ReactNode } from "react";
import AnimatedEvents from "@/components/AnimatedEvents";

export const revalidate = 10;

// Helper function to format dates as "November 15th ~ 16th, 2025"
function formatEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.getDate();
  const startYear = start.getFullYear();
  
  const endDay = end.getDate();
  const endYear = end.getFullYear();
  
  // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const startSuffix = getOrdinalSuffix(startDay);
  const endSuffix = getOrdinalSuffix(endDay);
  
  // If same year, only show year at the end
  if (startYear === endYear) {
    return `${startMonth} ${startDay}${startSuffix} ~ ${endDay}${endSuffix}, ${startYear}`;
  } else {
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
    return `${startMonth} ${startDay}${startSuffix}, ${startYear} ~ ${endMonth} ${endDay}${endSuffix}, ${endYear}`;
  }
}

// Helper function to format time as "10:00 am to 5:00 pm"
function formatEventTime(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${startTime} to ${endTime}`;
}

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
              className="border rounded-lg p-6 shadow bg-white text-gray-900"
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
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{event.title}</h2>
                  
                  <div className="mb-6 mt-2">
                    <p className="font-bold text-lg text-gray-900">
                      {formatEventDate(event.start_date, event.end_date)}
                    </p>
                    <p className="text-base text-gray-700">
                      {formatEventTime(event.start_date, event.end_date)}
                    </p>
                  </div>
                  
                  <div
                    className="event-description text-base text-gray-900 leading-relaxed"
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
