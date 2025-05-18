"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/EditModal"; // Ensure you have this Modal component

type NewsItem = {
  news_id: number;
  news_photo: string;
  news_title: string;
  news_text: string;
  news_date: string;
};

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:8000/news/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о новостях");
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту новость?")) return;
    try {
      const res = await fetch(`http://localhost:8000/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setNews(news.filter((item) => item.news_id !== id));
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (newsItem: NewsItem) => {
    setCurrentNews(newsItem);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNews) return;

    try {
      const response = await fetch(
        `http://localhost:8000/news/${currentNews.news_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentNews),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить новость");
      }

      const updatedNews = await response.json();
      setNews(
        news.map((item) =>
          item.news_id === updatedNews.news_id ? updatedNews : item
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!currentNews) return;
    setCurrentNews({ ...currentNews, [name]: value });
  };

  return (
    <div>
      <div className="md:flex grid justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          📰 Новости
        </h2>
        <Link
          href="/admin/news/create"
          className="bg-[#303030] text-white px-5 py-2 rounded-[24px] hover:bg-[#575757] transition"
        >
          ➕ Добавить
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Новостей пока нет.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изображение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Текст
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.news_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.news_id}
                  </td>
                  <td className="px-6 items-center py-4 justify-center ">
                    {item.news_photo ? (
                      <img
                        src={item.news_photo}
                        alt="News"
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {truncateText(item.news_title, 20)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truncateText(item.news_text, 20)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.news_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(item.news_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️ Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {currentNews && (
          <form onSubmit={handleUpdate} className="px-3">
            <div className="bg-white p-6 rounded-[20px]">
              <h2 className="text-[12px] font-[700] mb-2">
                Редактировать новость
              </h2>

              <div className="space-y-2">
                <input
                  type="text"
                  name="news_title"
                  placeholder="Заголовок"
                  value={currentNews.news_title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <textarea
                  name="news_text"
                  placeholder="Текст"
                  value={currentNews.news_text}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-[20px] p-3 text-[10px]"
                  rows={4}
                />

                <input
                  type="text"
                  name="news_photo"
                  placeholder="Фото"
                  value={currentNews.news_photo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                />

                <input
                  type="text"
                  name="news_date"
                  placeholder="Дата"
                  value={currentNews.news_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-[200px] bg-[#D9D9D9] text-black font-[500] gap-2 rounded-full py-3 flex items-center justify-center text-[10px] h-10"
              >
                Обновить новость
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
