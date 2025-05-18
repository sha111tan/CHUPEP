"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import Modal from "@/components/EditModal";

type Event = {
  event_id: number;
  event_name: string;
  event_description?: string;
  event_date_time: string;
  event_location: string;
  event_max_seats: number;
  event_photo?: string;
  event_host?: string;
  event_price?: string;
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о мероприятиях");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это мероприятие?")) return;
    try {
      const res = await fetch(`http://localhost:8000/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setEvents(events.filter((event) => event.event_id !== id));
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    try {
      const response = await fetch(
        `http://localhost:8000/events/${currentEvent.event_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentEvent),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить мероприятие");
      }

      const updatedEvent = await response.json();
      setEvents(
        events.map((event) =>
          event.event_id === updatedEvent.event_id ? updatedEvent : event
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
    if (!currentEvent) return;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };

  return (
    <div>
      <div className="md:flex grid justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          🎉 Мероприятия
        </h2>
        <Link
          href="/admin/events/create"
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
      ) : events.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Мероприятий пока нет.
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
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата и время
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Локация
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Макс. мест
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Фото
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ведущий
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.event_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.event_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(
                      parseISO(event.event_date_time),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.event_max_seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_photo ? (
                      <img
                        src={event.event_photo}
                        alt="Event"
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_host || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_price || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(event.event_id)}
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
        {currentEvent && (
          <form onSubmit={handleUpdate} className="px-3">
            <div className="bg-white p-6 rounded-[20px]">
              <h2 className="text-[12px] font-[700] mb-2">
                Редактировать мероприятие
              </h2>

              <div className="space-y-2">
                <input
                  type="text"
                  name="event_name"
                  placeholder="Название"
                  value={currentEvent.event_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <textarea
                  name="event_description"
                  placeholder="Описание"
                  value={currentEvent.event_description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-[20px] p-3 text-[10px]"
                  rows={4}
                />

                <input
                  type="datetime-local"
                  name="event_date_time"
                  value={currentEvent.event_date_time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <input
                  type="text"
                  name="event_location"
                  placeholder="Локация"
                  value={currentEvent.event_location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <input
                  type="number"
                  name="event_max_seats"
                  placeholder="Максимальное количество мест"
                  value={currentEvent.event_max_seats}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <input
                  type="text"
                  name="event_photo"
                  placeholder="Фото"
                  value={currentEvent.event_photo || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                />

                <input
                  type="text"
                  name="event_host"
                  placeholder="Ведущий"
                  value={currentEvent.event_host || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                />

                <input
                  type="text"
                  name="event_price"
                  placeholder="Цена"
                  value={currentEvent.event_price || ""}
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
                Обновить мероприятие
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
