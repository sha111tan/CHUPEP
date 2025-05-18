"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateNews() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    news_photo: "",
    news_title: "",
    news_text: "",
    news_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: imageData,
      });

      if (!response.ok) {
        throw new Error("Ошибка загрузки изображения");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, news_image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/news/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать новость");
      }

      router.push("/admin/news");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          ➕ Добавить новость
        </h2>
        <Link href="/admin/news" className="text-[#FF4392]">
          Назад к списку
        </Link>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Изображение
          </label>
          <input
            type="text"
            name="news_photo"
            value={formData.news_photo}
            onChange={handleChange}
            placeholder="Вставьте URL изображения"
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Заголовок
          </label>
          <input
            type="text"
            name="news_title"
            value={formData.news_title}
            onChange={handleChange}
            placeholder="Введите заголовок"
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Текст
          </label>
          <textarea
            name="news_text"
            value={formData.news_text}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            rows={4}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Дата (ISO формат)
          </label>
          <input
            type="date"
            name="news_date"
            value={formData.news_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#303030] rounded-[24px] hover:bg-[#575757] text-white font-bold py-2 px-4 w-full transition"
        >
          {loading ? "Создание..." : "Создать новость"}
        </button>
      </form>
    </div>
  );
}
