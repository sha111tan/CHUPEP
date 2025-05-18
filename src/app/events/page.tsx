"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import EventsCard from "@/components/EventsCard";
import EventModal from "@/components/EventModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";

registerLocale("ru", ru);

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

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenEventModal = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const filteredEvents = useMemo(() => {
    let filtered = events || [];
    if (searchQuery) {
      filtered = filtered.filter((e) =>
        e.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (startDate && endDate) {
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.event_date_time);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    if (sortOption === "date") {
      filtered = filtered
        .slice()
        .sort(
          (a, b) =>
            new Date(b.event_date_time).getTime() - new Date(a.event_date_time).getTime()
        );
    } else if (sortOption === "alphabetical") {
      filtered = filtered
        .slice()
        .sort((a, b) => a.event_name.localeCompare(b.event_name));
    }
    return filtered;
  }, [events, searchQuery, sortOption, startDate, endDate]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center my-6 items-center"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full bg-[#CFCFCF] p-5 mr-2 flex items-center justify-center h-6 w-6 transition-all hover:shadow duration-500 hover:scale-[1.05]"
        >
          <span className="text-lg text-black">&lt;</span>
        </button>

        {pageNumbers.map((number) => {
          if (
            number === 1 ||
            number === totalPages ||
            (number >= currentPage - 1 && number <= currentPage + 1)
          ) {
            return (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`transition-all hover:shadow duration-500 hover:scale-[1.05] h-8 px-3 py-1 mx-1 rounded ${
                  currentPage === number
                    ? "bg-[#FF4392] text-white"
                    : "text-[#000]"
                }`}
              >
                {number}
              </button>
            );
          } else if (
            (number === currentPage - 2 && currentPage !== 2) ||
            (number === currentPage + 2 && currentPage !== totalPages - 1)
          ) {
            return (
              <span key={number} className="mx-2">
                ...
              </span>
            );
          }
          return null;
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full bg-[#CFCFCF] ml-2 p-5 flex items-center justify-center h-6 w-6 transition-all hover:shadow duration-500 hover:scale-[1.05]"
        >
          <span className="text-lg text-black">&gt;</span>
        </button>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="md:pt-[130px] pt-[90px] md:px-[15px] px-[10px] container mx-auto">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-[40px] h-[280px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto md:pt-[130px] pt-[90px] mx-[10px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px]  text-center p-10 mb-4 md:px-[15px] px-[10px] container mx-auto mx-[10px]"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="justify-center"
          >
            <Breadcrumbs
              items={[{ label: "Главная", href: "/" }, { label: "Мероприятия" }]}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }} className="text-[]"
          >
            События
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:flex grid md:grid-cols-2 grid-cols-1 justify-between gap-4 items-center md:px-[15px] px-[10px] container mx-auto"
        >
          <div className="max-w-[520px] w-full relative">
            <p className="mb-2 text-left text-[14px] md:block hidden">Поиск</p>
            <div className="relative transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/icons/search_vet.svg"
                alt="Search"
                width={15}
                height={15}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Поиск мероприятий..."
                className="rounded-[16px] border-2 text-[16px] px-10 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-left text-[14px] md:block hidden">
                Период проведения
              </p>
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  locale="ru"
                  dateFormat="dd.MM.yyyy"
                  placeholderText="От"
                  className="rounded-[16px] border-2 text-[16px] px-4 py-2 w-full"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  minDate={startDate || undefined}
                  locale="ru"
                  dateFormat="dd.MM.yyyy"
                  placeholderText="До"
                  className="rounded-[16px] border-2 text-[16px] px-4 py-2 w-full"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-left text-[14px] md:block hidden">
                Сортировка
              </p>
              <div className="flex justify-center border border-[#FF4392] gap-2 rounded-[16px] p-4">
                <button
                  className={`h-10 transition-all duration-500 hover:scale-[1.02] rounded-[16px] text-[12px] border px-4 py-2 ${
                    sortOption === "date"
                      ? "bg-[#FF4392] text-white"
                      : "border-[#FF4392] text-[#FF4392]"
                  }`}
                  onClick={() => setSortOption("date")}
                >
                  По дате
                </button>
                <button
                  className={`h-10 transition-all duration-500 hover:scale-[1.02] rounded-[16px] text-[12px] border px-4 py-2 ${
                    sortOption === "alphabetical"
                      ? "bg-[#FF4392] text-white"
                      : "border-[#FF4392] text-[#FF4392]"
                  }`}
                  onClick={() => setSortOption("alphabetical")}
                >
                  По алфавиту
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div
        className="relative pb-10"
        style={{
          backgroundImage: "url('/icons/white_back.png')",
          backgroundSize: "cover",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {events ? (
            <div className="grid grid-cols-1 xl:grid-cols-2  md:gap-4 gap-6 md:px-[15px] px-[10px] container mx-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  По вашему запросу ничего не найдено
                </div>
              ) : (
                currentEvents.map((event) => (
                  <EventsCard
                    key={event.event_id}
                    event={event}
                    onClick={() => handleOpenEventModal(event)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}
        </motion.div>
        {renderPagination()}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseEventModal}
        event={selectedEvent}
      />
    </div>
  );
}
