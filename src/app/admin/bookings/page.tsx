"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import useStore from "@/store/useStore";

type Booking = {
  booking_id: number;
  booking_user_id: number;
  booking_seat_id: number;
  booking_start: string;
  booking_end: string;
  booking_email: string;
};

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = useStore.getState().token;
        const response = await fetch("http://localhost:8000/bookings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о бронированиях");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это бронирование?")) return;
    try {
      const res = await fetch(`http://localhost:8000/bookings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBookings(bookings.filter((booking) => booking.booking_id !== id));
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
        <h2 className="text-2xl mb-4 font-bold flex items-center gap-2 text-white">
          📅 Бронирования
        </h2>
        <Link
          href="/admin/bookings/create"
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
      ) : bookings.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Бронирований пока нет.
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
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seat ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Начало
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Конец
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.booking_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.booking_user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.booking_seat_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(
                      parseISO(booking.booking_start),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(parseISO(booking.booking_end), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.booking_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <Link
                      href={`/admin/bookings/edit/${booking.booking_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️ Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(booking.booking_id)}
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
