"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import useStore from "@/store/useStore";

export default function CreateBooking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    booking_seat_id: "",
    booking_start: null as Date | null,
    booking_end: null as Date | null,
    booking_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateWithoutMs = (date: Date | null) => {
    if (!date) return "";
    // Обнуляем миллисекунды и форматируем в "yyyy-MM-dd HH:mm"
    date.setMilliseconds(0);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = useStore.getState().token;
      const response = await fetch("http://localhost:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          booking_seat_id: Number(formData.booking_seat_id),
          booking_start: formatDateWithoutMs(formData.booking_start),
          booking_end: formatDateWithoutMs(formData.booking_end),
          booking_email: formData.booking_email,
        }),
      });
      if (!response.ok) {
        throw new Error("Не удалось создать бронирование");
      }
      router.push("/admin/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          ➕ Добавить бронирование
        </h2>
        <Link href="/admin/bookings" className="text-[#FF4392]">
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
            htmlFor="booking_seat_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            ID места
          </label>
          <input
            type="number"
            id="booking_seat_id"
            name="booking_seat_id"
            value={formData.booking_seat_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="booking_start"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Начало (ISO формат)
          </label>
          <DatePicker
            selected={formData.booking_start}
            onChange={(date: Date | null) =>
              setFormData((prev) => ({ ...prev, booking_start: date }))
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Выберите дату и время"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="booking_end"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Конец (ISO формат)
          </label>
          <DatePicker
            selected={formData.booking_end}
            onChange={(date: Date | null) =>
              setFormData((prev) => ({ ...prev, booking_end: date }))
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Выберите дату и время"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="booking_email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="booking_email"
            name="booking_email"
            value={formData.booking_email}
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
          {loading ? "Создание..." : "Создать бронирование"}
        </button>
      </form>
    </div>
  );
}
