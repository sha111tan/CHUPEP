"use client";
import React, { useState, useEffect } from "react";
import DepartmentServiceCount from "@/components/DepartmentServiceCount";
import ReviewsComponent from "@/components/ReviewsComponent";
import TopServicesSection from "@/components/TopServicesSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ServiceModal from "@/components/ServiceModal";
import NewsCard from "@/components/NewsCard";
import EventsCard from "@/components/EventsCard";
import EventModal from "@/components/EventModal";
import Header from "@/components/Header";

interface NewsItem {
  news_id: number;
  news_photo: string;
  news_title: string;
  news_text: string;
  news_date: string;
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

export default function Home() {
  const [selectedService, setSelectedService] = useState({
    name: "",
    price: "",
  });
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setShowHeader(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowHeader(true);
  };

  const openModal = (serviceName: string, servicePrice: string) => {
    setSelectedService({ name: serviceName, price: servicePrice });
    setIsModalOpen(true);
    setShowHeader(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowHeader(true);
  };
  const handleOpenEventModal = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setShowHeader(false);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
    setShowHeader(true);
  };
  useEffect(() => {
    // Fetch the latest news data
    const fetchLatestNews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/news?limit=3&sort=latest"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setLatestNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchLatestNews();
  }, []);

  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    // Fetch the latest events data
    const fetchLatestEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        // Sort events by event_id in descending order (newest first)
        const sortedEvents = data.sort((a: EventItem, b: EventItem) => 
          b.event_id - a.event_id
        );
        setLatestEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchLatestEvents();
  }, []);
  return (
    <div className="grid gap-6">
      {showHeader && <Header />}
      {/* Hero Section */}
      <div className="bg-[#22212C] relative z-0 max-h-[900px] min-h-[250px]">
        <div className="grid md:px-[15px] px-[10px] container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-left text-white mt-[100px] md:mt-[150px] absolute z-10 text-[32px] md:text-[62px] lg:text-[82px] xl:text-[102px] leading-[110%]"
          >
            СОБИРАЙТЕСЬ
            <br /> ДЕЛИТЕСЬ
          </motion.h1>
        </div>
        <Image
          src="/icons/back.webp"
          alt="Back"
          width={1000}
          height={320}
          className="w-full xl:h-[600px] mt-[50px] md:mt-0 md:h-[400px]"
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div
        className="relative pb-10"
        style={{
          backgroundImage: "url('/icons/white_back.png')",
          backgroundSize: "cover",
          top: "-50px",
        }}
      >
        {/* Section 1 */}
        <section className="grid grid-cols-2 gap-4 md:px-[15px] px-[10px] container mx-auto ">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid">
              <Link href="/about_us">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="transition-shadow hover:shadow-sm duration-500 relative"
                >
                  <Image
                    src="/icons/about_us.svg"
                    alt="About us"
                    width={785}
                    height={320}
                    className="relative bottom-0"
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>
              </Link>
            </div>
            <div className="flex gap-4">
              <Link href="/news">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="transition-shadow hover:shadow-sm duration-500 relative"
                >
                  <Image
                    src="/icons/news.svg"
                    alt="News"
                    width={785}
                    height={320}
                    className="relative bottom-0"
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#FF4392] rounded-[20px] md:rounded-[40px] xl:rounded-[60px]"
          >
            <Link href="/coworking">
              <div className=" relative  ">
                <Image
                  src="/icons/cowork.svg"
                  alt="News"
                  width={785}
                  height={320}
                  className="relative h-full"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1">
            <Link href="/events">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="transition-shadow hover:shadow-sm duration-500 relative grid gap-4"
              >
                <Image
                  src="/icons/events.svg"
                  alt="News"
                  width={785}
                  height={320}
                  className="relative bottom-0"
                  style={{ pointerEvents: "none" }}
                />
              </motion.div>
            </Link>
          </div>
          <div className="grid grid-cols-1">
            <Link href="/rent_spaces">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="transition-shadow hover:shadow-sm duration-500 relative grid gap-4"
              >
                <Image
                  src="/icons/rents.svg"
                  alt="News"
                  width={785}
                  height={320}
                  className="relative bottom-0"
                  style={{ pointerEvents: "none" }}
                />
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Section 2 */}
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }} className="my-6 px-[10px] container mx-auto relative mt-12">
          <div className="background-block relative bg-gray-700 rounded-[20px] md:px-8 px-4 py-6">
            <div className="inset-0 flex gap-4 justify-between items-center text-white">
              <div>
                <p className="font-[700] text-[14px] leading-[17px] md:leading-[27px] md:text-[24px] text-left mb-2">
                  ПИШЕМ ИСТОРИЮ ВМЕСТЕ
                </p>
                <p className="font-[400] text-[10px] leading-[13px] md:leading-[15px] md:text-[12px] text-left">
                  Подпишись на наши соцсети и будь в курсе событий
                </p>
              </div>
              <div className="flex gap-3">
                <div className="transition-all duration-500 hover:scale-[1.05]">
                  <Link
                    href="https://2gis.ru/norilsk/firm/70000001039885618"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-500 hover:scale-[1.05]"
                  >
                    <Image
                      src="/icons/tg1.png"
                      alt="2gis"
                      width={40}
                      height={40}
                      className="block rounded-[8px]"
                    />
                  </Link>
                </div>
                <div className="transition-all duration-500 hover:scale-[1.05]">
                  <Link
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-500 hover:scale-[1.05]"
                  >
                    <Image
                      src="/icons/vk1.png"
                      alt="WhatsApp"
                      width={40}
                      height={40}
                      className="block"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section "Новости" */}
        <section className="md:px-[15px] px-[10px] container mx-auto mt-12">
          <div className="mt-4 flex justify-between items-center">
            <h2 className="text-left md:text-[32px]">НОВОСТИ</h2>
            <Link href="/news" className="bg-black px-4 py-2 rounded-[10px] text-white transition-all duration-500 hover:scale-[1.05]"><p className="font-[400] text-[14px] ">Все новости</p>
              </Link>
          </div>
          <div className="md:grid-cols-3 grid-cols-1 grid gap-4 mt-6 mb-6">
            {latestNews.map((newsItem) => (
              <NewsCard
                key={newsItem.news_id}
                news_id={newsItem.news_id}
                news_photo={newsItem.news_photo}
                news_title={newsItem.news_title}
                news_text={newsItem.news_text}
                news_date={newsItem.news_date}
              />
            ))}
          </div>
        </section>

        <section className="md:px-[15px] px-[10px] container mx-auto mt-12">
          <div className="mt-4 flex justify-between items-center">
            <h2 className="text-left md:text-[32px]">МЕРОПРИЯТИЯ</h2>
            <Link href="/events" className="bg-black px-4 py-2 rounded-[10px] text-white transition-all duration-500 hover:scale-[1.05]"><p className="font-[400] text-[14px] ">Все события</p>
              </Link>
          </div>
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-4 mt-6 mb-6">
            {latestEvents.slice(0, 2).map((eventItem) => (
              <EventsCard
                key={eventItem.event_id}
                event={eventItem}
                onClick={() => handleOpenEventModal(eventItem)}
              />
            ))}
          </div>
        </section>

        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseEventModal}
          event={selectedEvent}
        />
      </div>
    </div>
  );
}
