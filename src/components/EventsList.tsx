"use client";

import { useState } from "react";
import EventModal from "./EventModal";
import Image from "next/image";
import { formatEventDate, formatEventTime } from "@/lib/eventUtils";

type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
};

type Props = {
  events: Event[];
};

export default function EventsList({ events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (events.length === 0) {
    return (
      <p className="text-muted text-center text-lg">
        No events found. Please check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="rounded-lg p-6 shadow-lg bg-white text-gray-900 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* image column */}
              <div className="order-2 md:order-1">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={400}
                    height={320}
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
                <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h2>

                {(event.start_date || event.end_date) && (
                  <div className="mb-6">
                    {event.start_date && event.end_date && (
                      <>
                        <p className="font-bold text-lg text-gray-900">
                          {formatEventDate(event.start_date, event.end_date)}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatEventTime(event.start_date, event.end_date)}
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div
                  className="event-description text-base text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: event.description,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

