"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/EditModal"; // Ensure you have this Modal component

type Coworking = {
  coworking_id: number;
  coworking_location: string;
  coworking_description?: string;
};

export default function CoworkingList() {
  const [coworkings, setCoworkings] = useState<Coworking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoworking, setCurrentCoworking] = useState<Coworking | null>(
    null
  );

  useEffect(() => {
    const fetchCoworkings = async () => {
      try {
        const response = await fetch("http://localhost:8000/coworking/", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные о коворкингах");
        }
        const data = await response.json();
        setCoworkings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при загрузке"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoworkings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот коворкинг?")) return;
    try {
      const res = await fetch(`http://localhost:8000/coworking/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCoworkings(coworkings.filter((cw) => cw.coworking_id !== id));
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (coworking: Coworking) => {
    setCurrentCoworking(coworking);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCoworking) return;

    try {
      const response = await fetch(
        `http://localhost:8000/coworking/${currentCoworking.coworking_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCoworking),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить коворкинг");
      }

      const updatedCoworking = await response.json();
      setCoworkings(
        coworkings.map((item) =>
          item.coworking_id === updatedCoworking.coworking_id
            ? updatedCoworking
            : item
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
    if (!currentCoworking) return;
    setCurrentCoworking({ ...currentCoworking, [name]: value });
  };

  return (
    <div className="">
      <div className="md:flex grid justify-between items-center mb-6">
        <h2 className="text-2xl text-white mb-4 font-bold flex items-center gap-2">
          🏢 Коворкинги
        </h2>
        <Link
          href="/admin/coworking/create"
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
      ) : coworkings.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Коворкингов пока нет. Создайте первый!
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
                  Локация
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coworkings.map((coworking) => (
                <tr key={coworking.coworking_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coworking.coworking_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {coworking.coworking_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coworking.coworking_description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(coworking)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(coworking.coworking_id)}
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
        {currentCoworking && (
          <form onSubmit={handleUpdate} className="px-3">
            <div className="bg-white p-6 rounded-[20px]">
              <h2 className="text-[12px] font-[700] mb-2">
                Редактировать коворкинг
              </h2>

              <div className="space-y-2">
                <input
                  type="text"
                  name="coworking_location"
                  placeholder="Локация"
                  value={currentCoworking.coworking_location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <textarea
                  name="coworking_description"
                  placeholder="Описание"
                  value={currentCoworking.coworking_description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-[20px] p-3 text-[10px]"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-[200px] bg-[#D9D9D9] text-black font-[500] gap-2 rounded-full py-3 flex items-center justify-center text-[10px] h-10"
              >
                Обновить коворкинг
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
