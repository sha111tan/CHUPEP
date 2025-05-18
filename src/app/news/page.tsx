"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import useStore, { News } from "../../store/useStore";
import Breadcrumbs from "@/components/Breadcrumbs";
import { motion } from "motion/react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import NewsCard from "@/components/NewsCard"; // Update the path

export default function NewsPage() {
  const { news, setNews } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8000/news/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: News[]) => {
        setNews(data);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
      })
      .finally(() => setIsLoading(false));
  }, [setNews]);

  const filteredNews = useMemo(() => {
    let filtered = news || [];
    if (searchQuery) {
      filtered = filtered.filter((n) =>
        n.news_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOption === "date") {
      filtered = filtered
        .slice()
        .sort(
          (a, b) =>
            new Date(b.news_date).getTime() - new Date(a.news_date).getTime()
        );
    } else if (sortOption === "alphabetical") {
      filtered = filtered
        .slice()
        .sort((a, b) => a.news_title.localeCompare(b.news_title));
    }
    return filtered;
  }, [news, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice(
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
                key={`page-${number}`}
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
              <span key={`ellipsis-${number}`} className="mx-2">
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

  return (
    <div className="mx-auto md:pt-[130px] pt-[90px] ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] text-center p-10 mb-4 md:px-[15px] px-[10px] mx-[10px] container mx-auto"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="justify-center"
          >
            <Breadcrumbs
              items={[{ label: "Главная", href: "/" }, { label: "Новости" }]}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Новости
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
                placeholder="Поиск новостей..."
                className="rounded-[16px] border-2 text-[16px] px-10 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        {news ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  md:gap-4 gap-6 md:px-[15px] px-[10px] container mx-auto">
            {filteredNews.length === 0 ? (
              <div key="no-results" className="text-center py-12 text-gray-500">
                По вашему запросу ничего не найдено
              </div>
            ) : (
              currentNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.news_id}
                  news_id={newsItem.news_id}
                  news_photo={newsItem.news_photo}
                  news_title={newsItem.news_title}
                  news_text={newsItem.news_text}
                  news_date={newsItem.news_date}
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
      
    </div>
  );
}
