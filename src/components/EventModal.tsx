"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function EventModal({
  event,
  isOpen,
  onClose,
}: Props) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && event && (
        <>
          {/* Backdrop - 약간만 어둡게 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', top: '80px' }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 mt-4 pointer-events-none" style={{ top: '80px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700 relative pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-700 dark:text-gray-300" />
              </button>

          {/* Modal Content */}
          <div className="p-6 md:p-8">
            {/* Event Image */}
            {event.image_url ? (
              <div className="mb-6">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="mb-6 w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              </div>
            )}

            {/* Event Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {event.title}
            </h2>

            {/* Event Date & Time */}
            {event.start_date && event.end_date && (
              <div className="mb-6">
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {formatEventDate(event.start_date, event.end_date)}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatEventTime(event.start_date, event.end_date)}
                </p>
              </div>
            )}

            {/* Event Description */}
            <div
              className="event-description text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

