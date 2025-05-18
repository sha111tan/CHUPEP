"use client";

import { useState, useEffect } from "react";

type EventRegistration = {
  event_registration_id: number;
  event_registration_user_id: number;
  event_registration_event_id: number;
  event_reg_date_time: string;
  event_reg_email: string;
};

export default function EventRegistrationList() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/event_registrations/",
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о регистрациях");
        }
        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту регистрацию?")) return;
    try {
      const res = await fetch(
        `http://localhost:8000/event_registrations/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setRegistrations(
          registrations.filter((reg) => reg.event_registration_id !== id)
        );
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
      <h2 className="text-2xl mb-6 font-bold flex items-center gap-2 text-white">
        📝 Регистрации на мероприятия
      </h2>
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Регистраций пока нет.
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
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата регистрации
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((reg) => (
                <tr key={reg.event_registration_id}>
                  <td className="px-6 py-4">{reg.event_registration_id}</td>
                  <td className="px-6 py-4">
                    {reg.event_registration_user_id}
                  </td>
                  <td className="px-6 py-4">
                    {reg.event_registration_event_id}
                  </td>
                  <td className="px-6 py-4">{reg.event_reg_date_time}</td>
                  <td className="px-6 py-4">{reg.event_reg_email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(reg.event_registration_id)}
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
