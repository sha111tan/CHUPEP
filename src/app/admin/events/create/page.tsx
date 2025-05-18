"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_date_time: null as Date | null,
    event_location: "",
    event_max_seats: "",
    event_photo: "",
    event_host: "",
    event_price: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Форматирует дату в "YYYY-MM-DD HH:mm"
  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // Приводит дату в нужный формат перед отправкой
  const formatDateForAPI = (date: Date | null) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm");
  };

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
      const response = await fetch("http://localhost:8000/events/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: formData.event_name,
          event_description: formData.event_description,
          event_date_time: formatDateForAPI(formData.event_date_time),
          event_location: formData.event_location,
          event_max_seats: Number(formData.event_max_seats),
          event_photo: formData.event_photo,
          event_host: formData.event_host,
          event_price: formData.event_price,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать мероприятие");
      }

      router.push("/admin/events");
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
          ➕ Добавить мероприятие
        </h2>
        <Link href="/admin/events" className="text-[#FF4392]">
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
            htmlFor="event_name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Название
          </label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Описание
          </label>
          <textarea
            id="event_description"
            name="event_description"
            value={formData.event_description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_date_time"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Дата и время
          </label>
          <DatePicker
            selected={formData.event_date_time}
            onChange={(date: Date | null) =>
              setFormData((prev) => ({ ...prev, event_date_time: date }))
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Выберите дату и время"
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
          {formData.event_date_time && (
            <p className="text-gray-600 text-sm mt-2">
              Выбранное время: {formatDateForDisplay(formData.event_date_time)}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_location"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Локация
          </label>
          <input
            type="text"
            id="event_location"
            name="event_location"
            value={formData.event_location}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_max_seats"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Максимальное количество мест
          </label>
          <input
            type="number"
            id="event_max_seats"
            name="event_max_seats"
            value={formData.event_max_seats}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Фото
          </label>
          <input
            type="text"
            id="event_photo"
            name="event_photo"
            value={formData.event_photo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="event_host"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ведущий
          </label>
          <input
            type="text"
            id="event_host"
            name="event_host"
            value={formData.event_host}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="event_price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Цена
          </label>
          <input
            type="text"
            id="event_price"
            name="event_price"
            value={formData.event_price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#303030] rounded-[24px] hover:bg-[#575757] text-white font-bold py-2 px-4 w-full transition"
        >
          {loading ? "Создание..." : "Создать мероприятие"}
        </button>
      </form>
    </div>
  );
}
