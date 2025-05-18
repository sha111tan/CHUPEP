"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCoworking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    coworking_location: "",
    coworking_description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/coworking/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать коворкинг");
      }

      router.push("/admin/coworking");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex  text-white items-center gap-2">
          ➕ Добавить коворкинг
        </h2>
        <Link href="/admin/coworking" className="text-[#FF4392]">
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="coworking_location"
          >
            Локация
          </label>
          <input
            type="text"
            id="coworking_location"
            name="coworking_location"
            value={formData.coworking_location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="coworking_description"
          >
            Описание (необязательно)
          </label>
          <textarea
            id="coworking_description"
            name="coworking_description"
            value={formData.coworking_description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-[#303030] rounded-[24px] hover:bg-[#575757] text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline w-full transition"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать коворкинг"}
          </button>
        </div>
      </form>
    </div>
  );
}
