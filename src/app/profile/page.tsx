"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useStore from "../../store/useStore"; // Adjust the import path as needed
import EventsCard from "@/components/EventsCard";
import EventModal from "@/components/EventModal";
import PastEventsModal from "@/components/PastEventsModal";

interface NewsItem {
  news_id: number;
  news_title: string;
  news_text: string;
  news_date: string;
  news_photo: string;
  event_location?: string;
  event_max_seats?: number;
  event_host?: string;
  event_price?: string;
}

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

interface UserInfo {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  user_name: string;
}

// Helper function for Russian word endings
const getVisitWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'посещений';
  }

  if (lastDigit === 1) {
    return 'посещение';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'посещения';
  }

  return 'посещений';
};

// History Card Component
const HistoryCard: React.FC<{ pastEventsCount: number; onClick: () => void; pastEvents: EventItem[] }> = ({ 
  pastEventsCount, 
  onClick,
  pastEvents 
}) => {
  // Get last 3 events or all if less than 3
  const lastThreeEvents = pastEvents.slice(-3).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col justify-between bg-[#303030] rounded-[40px] p-8 w-full h-[300px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex -space-x-4">
        {lastThreeEvents.map((event, i) => (
          <div
            key={event.event_id}
            className="w-20 h-20 rounded-full border-4 border-[#303030] overflow-hidden"
            style={{ zIndex: 10 - i }}
          >
            {event.event_photo ? (
              <img 
                src={event.event_photo} 
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#575757] flex items-center justify-center text-white text-xs font-bold">
                {event.event_name.slice(0, 2)}
              </div>
            )}
          </div>
        ))}
        {/* Fill remaining slots if less than 3 events */}
        {Array.from({ length: Math.max(0, 3 - lastThreeEvents.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-20 h-20 bg-[#575757] rounded-full border-4 border-[#303030] flex items-center justify-center text-white text-xs font-bold"
            style={{ zIndex: 10 - (lastThreeEvents.length + i) }}
          >
            -
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-white text-2xl font-bold my-4">Моя история</h3>
        <button className="py-2 px-6 bg-[#575757] rounded-full text-white w-max">
          {pastEventsCount} {getVisitWord(pastEventsCount)}
        </button>
      </div>
    </motion.div>
  );
};

// Admin Card Component
const AdminCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col justify-between bg-[#FF4392] rounded-[40px] p-8 w-full h-[300px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-white text-2xl font-bold mb-4">Админ панель</h3>
          <button className="py-2 px-6 bg-white rounded-full text-[#FF69B4] w-max">
            Перейти
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProfilePage: React.FC = () => {
  const { token, news, setNews } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPastEventsModalOpen, setIsPastEventsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [eventsDetails, setEventsDetails] = useState<EventItem[]>([]);
  const [currentEvents, setCurrentEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          // Fetch user info to check superuser status
          const userInfoResponse = await fetch(
            "http://localhost:8000/htoya/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          if (userInfoResponse.ok) {
            const userInfo: UserInfo = await userInfoResponse.json();
            setIsSuperuser(userInfo.is_superuser);
          }

          // Fetch registered events for the user
          const userEventsResponse = await fetch(
            "http://localhost:8000/event_registrations/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          if (userEventsResponse.ok) {
            const userEventsData = await userEventsResponse.json();

            // Fetch additional event details
            const eventsResponse = await fetch("http://localhost:8000/events");
            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();

              // Combine data from both endpoints
              const combinedEvents = userEventsData.map(
                (userEvent: any) => {
                  const eventDetail = eventsData.find(
                    (event: EventItem) => event.event_id === userEvent.event_registration_event_id
                  );
                  return {
                    ...eventDetail,
                    event_id: userEvent.event_registration_event_id,
                    event_reg_date_time: userEvent.event_reg_date_time,
                    event_reg_email: userEvent.event_reg_email
                  };
                }
              );

              // Separate current and past events
              const now = new Date();
              const current = combinedEvents.filter(
                (event: EventItem) => new Date(event.event_date_time) > now
              );
              const past = combinedEvents.filter(
                (event: EventItem) => new Date(event.event_date_time) <= now
              );

              setCurrentEvents(current);
              setPastEvents(past);
              setNews(combinedEvents);
            } else {
              console.error(
                "Failed to fetch events details:",
                await eventsResponse.json()
              );
            }
          } else {
            const errorData = await userEventsResponse.json();
            console.error("Failed to fetch registered events:", errorData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [token, setNews]);

  // Rest of your component code remains the same
  const handleOpenEventModal = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const convertNewsToEventItem = (newsItem: NewsItem): EventItem => {
    return {
      event_id: newsItem.news_id,
      event_name: newsItem.news_title,
      event_description: newsItem.news_text,
      event_date_time: newsItem.news_date,
      event_location: newsItem.event_location || "Место уточняется",
      event_max_seats: newsItem.event_max_seats || 100,
      event_photo: newsItem.news_photo,
      event_host: newsItem.event_host || "Организатор уточняется",
      event_price: newsItem.event_price || "Бесплатно",
    };
  };

  return (
    <><div className="bg-[#22212C] text-white md:pt-[130px] pt-[90px] pb-10 md:px-[15px] px-[10px] container mx-auto">
      <div className="flex gap-4">
        <div className="flex w-full gap-4">
        {isSuperuser && (
            <AdminCard onClick={() => window.location.href = '/admin'} />
          )}<HistoryCard 
            pastEventsCount={pastEvents.length} 
            onClick={() => setIsPastEventsModalOpen(true)}
            pastEvents={pastEvents}
          />
          
        </div>
        <div className="flex w-full gap-4"></div>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-white text-3xl font-bold mt-12 mb-6"
      >
        Мои мероприятия
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid md:grid-cols-2 grid-cols-1 gap-4"
      >
        {currentEvents && currentEvents.length > 0 ? (
          currentEvents.map((eventItem) => (
            <EventsCard
              key={eventItem.event_id}
              event={eventItem}
              onClick={() => handleOpenEventModal(eventItem)}
            />
          ))
        ) : (
          <p className="text-white text-center col-span-2">
            Нет активных мероприятий
          </p>
        )}
      </motion.div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseEventModal}
          event={selectedEvent}
          hideBuyButton={true}
        />
      )}

      {/* Past Events Modal */}
      <PastEventsModal
        isOpen={isPastEventsModalOpen}
        onClose={() => setIsPastEventsModalOpen(false)}
        pastEvents={pastEvents}
        onEventClick={handleOpenEventModal}
      />
    </div>
    <div
    className="relative lg:h-[300px] md:h-[200px] h-[100px]"
    style={{
      backgroundImage: "url('/icons/white_back.png')",
      backgroundSize: "cover",
    }}
  ></div>
    </>
    
    
  );
};

export default ProfilePage;
