"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Seat = {
  seat_id: number;
  seat_coworking_id: number;
  booking_id?: number | null;
  seat_index: number;
  seat_status: number;
};

export default function SeatList() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch("http://localhost:8000/seats/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о местах");
        }
        const data = await response.json();
        setSeats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это место?")) return;
    try {
      const res = await fetch(`http://localhost:8000/seats/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSeats(seats.filter((seat) => seat.seat_id !== id));
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления");
    }
  };

  return (
    <div>
      <div className="md:flex grid justify-between items-center mb-6">
        <h2 className="text-2xl mb-4 font-bold flex text-white items-center gap-2">
          💺 Места
        </h2>
        <Link
          href="/admin/seats/create"
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
      ) : seats.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Мест пока нет. Создайте первое!
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
                  Коворкинг ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Индекс места
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seats.map((seat) => (
                <tr key={seat.seat_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
                    {seat.seat_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seat.seat_coworking_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seat.seat_index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seat.seat_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <Link
                      href={`/admin/seats/edit/${seat.seat_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️ Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(seat.seat_id)}
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
    </div>
  );
}
