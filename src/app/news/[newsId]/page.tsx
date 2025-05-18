"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useStore, { News } from "../../../store/useStore";
import Breadcrumbs from "@/components/Breadcrumbs";
import DOMPurify from "dompurify";
import { motion } from "motion/react";

export default function NewsDetailPage() {
  const { newsId } = useParams();
  const { news, setNews } = useStore();
  const [localNews, setLocalNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const processContentToHTML = (content?: string, text?: string): string => {
    const raw = content ?? text ?? "";
    return raw
      .split("\n")
      .map((line) => (line.trim() ? `<p>${line.trim()}</p>` : `<p>&nbsp;</p>`))
      .join("");
  };

  useEffect(() => {
    if (!newsId) return;
    const idNum = Number(newsId);

    const handle404Error = () => {
      setNews((prev) =>
        prev ? prev.filter((n) => n.news_id !== idNum) : null
      );
      setLocalNews(null);
      setIsLoading(false);
    };

    const cached = news?.find((n) => n.news_id === idNum);

    if (cached) {
      if (!cached.news_text || !cached.news_photo) {
        setIsLoading(true);
        fetch(`http://localhost:8000/news/${newsId}`)
          .then((res) => {
            if (!res.ok) {
              if (res.status === 404) {
                handle404Error();
                return null;
              }
              throw new Error(`Error: ${res.statusText}`);
            }
            return res.json();
          })
          .then((data: News) => {
            if (!data) return;
            setLocalNews(data);
            setNews((prev) =>
              prev
                ? prev.map((n) => (n.news_id === data.news_id ? data : n))
                : [data]
            );
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setLocalNews(cached);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    fetch(`http://localhost:8000/news/${newsId}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            handle404Error();
            return null;
          }
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: News) => {
        if (!data) return;
        setLocalNews(data);
        setNews((prev) => (prev ? [...prev, data] : [data]));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [newsId, news, setNews]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-40 bg-gray-200 mb-4" />
        <div className="h-8 bg-gray-200 mb-2" />
        <div className="h-6 bg-gray-200 mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200" />
          <div className="h-4 bg-gray-200" />
          <div className="h-4 bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!localNews) {
    return <div>Новость не найдена</div>;
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const title = localNews.news_title || "";
  const truncated = title.length > 20 ? `${title.slice(0, 20)}...` : title;

  return (
    <>
    <div className="md:pt-[130px] pt-[90px] md:px-[15px] px-[10px] container mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white grid md:gap-8 gap-4 md:rounded-[40px] rounded-[16px] md:p-10 px-6 py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Новости", href: "/news" },
              { label: truncated },
            ]}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-semibold text-center md:text-[14px] text-[10px]"
        >
          {formatDate(localNews.news_date)}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center font-bold"
        >
          {title}
        </motion.h1>

        {localNews.news_photo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:h-[420px] border-2 h-[220px] mx-auto rounded-[40px] overflow-hidden"
          >
            <img
              src={localNews.news_photo}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="prose"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              processContentToHTML(localNews.news_text),
              {
                ALLOWED_TAGS: [
                  "p",
                  "strong",
                  "em",
                  "a",
                  "ul",
                  "ol",
                  "li",
                  "img",
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "span",
                  "br",
                ],
                ALLOWED_ATTR: ["style", "href", "target", "rel"],
              }
            ),
          }}
        />
      </motion.div>
      
    </div>
    <div
    className="relative lg:h-[300px] md:h-[200px] h-[100px]"
    style={{
      backgroundImage: "url('/icons/white_back.png')",
      backgroundSize: "cover",
    }}
  ></div></>
  );
}
