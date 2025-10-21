"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
};

const emptyEvent: Event = {
  id: "",
  title: "",
  description: "",
  image_url: "",
  start_date: "",
  end_date: "",
};

export default function AdminEventsPage() {
  const { user, loading: userLoading } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  // Route protection
  useEffect(() => {
    if (!userLoading && !user) {
      redirect("/admin/login");
    }
  }, [userLoading, user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Loading Event Fail:", error.message);
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = () => {
    setEditingEvent(emptyEvent);
    setIsAddingNew(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Do you really want to delete?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert("Delete Fail: " + error.message);
    } else {
      fetchEvents();
    }
  };

  const handleSaved = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
    fetchEvents();
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
  };

  if (userLoading || loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link
          href="/admin/dashboard"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Event</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-black hover:text-white"
        >
          <Plus size={18} />
          New Event
        </button>
      </div>

      {isAddingNew && editingEvent?.id === "" && (
        <div className="mb-6">
          <EventForm
            initialEvent={editingEvent}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
        </div>
      )}

      {events.map((event) => (
        <div key={event.id} className="border rounded-lg p-6 mb-6 shadow">
          {editingEvent?.id === event.id ? (
            <EventForm
              initialEvent={event}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* image column */}
                <div className="order-2 md:order-1">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      width={400}
                      height={300}
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
                  <h2 className="text-xl md:text-2xl font-bold">{event.title}</h2>
                  
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-4 font-bold">
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} ~ {new Date(event.end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  
                  <div
                    className="event-description text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-black hover:text-white"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-black hover:text-white"
                >
                  <Trash size={16} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </main>
  );
}
