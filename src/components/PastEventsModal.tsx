import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventsCard from './EventsCard';

interface EventItem {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date_time: string;
  event_location: string;
  event_max_seats: number;
  event_photo?: string;
  event_host?: string;
  event_price?: string;
}

interface PastEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastEvents: EventItem[];
  onEventClick: (event: EventItem) => void;
}

const PastEventsModal: React.FC<PastEventsModalProps> = ({
  isOpen,
  onClose,
  pastEvents,
  onEventClick,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1B1B1B] rounded-[40px] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-white text-[18px] font-bold">История мероприятий</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid  grid-cols-1 gap-4">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventsCard
                  key={event.event_id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))
            ) : (
              <p className="text-white text-center col-span-2">
                Нет завершенных мероприятий
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PastEventsModal; 