"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateSeat() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    seat_coworking_id: "",
    seat_index: "",
    seat_status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/seats/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_coworking_id: Number(formData.seat_coworking_id),
          seat_index: Number(formData.seat_index),
          seat_status: Number(formData.seat_status),
        }),
      });
      if (!response.ok) {
        throw new Error("Не удалось создать место");
      }
      router.push("/admin/seats");
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
          ➕ Добавить место
        </h2>
        <Link href="/admin/seats" className="text-[#FF4392]">
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
            htmlFor="seat_coworking_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Коворкинг ID
          </label>
          <input
            type="number"
            id="seat_coworking_id"
            name="seat_coworking_id"
            value={formData.seat_coworking_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="seat_index"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Индекс места
          </label>
          <input
            type="number"
            id="seat_index"
            name="seat_index"
            value={formData.seat_index}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="seat_status"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Статус
          </label>
          <input
            type="number"
            id="seat_status"
            name="seat_status"
            value={formData.seat_status}
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
          {loading ? "Создание..." : "Создать место"}
        </button>
      </form>
    </div>
  );
}
