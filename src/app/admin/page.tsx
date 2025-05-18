"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Stats = {
  coworkings: number;
  seats: number;
  bookings: number;
  events: number;
  registrations: number;
  news: number;
  users: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    coworkings: 0,
    seats: 0,
    bookings: 0,
    events: 0,
    registrations: 0,
    news: 0,
    users: 0,
  });

  useEffect(() => {
    // Симулируем запрос к API, который возвращает массивы данных для каждого раздела.
    // На фронтенде мы считаем количество элементов в массиве.
    const fetchData = async () => {};

    fetchData();
  }, []);

  const cards = [
    {
      label: "коворинги",

      emoji: "🏢",
      route: "/admin/coworking",
    },
    { label: "места", value: stats.seats, emoji: "💺", route: "/admin/seats" },
    {
      label: "бронирования",

      emoji: "📅",
      route: "/admin/bookings",
    },
    {
      label: "мероприятия",

      emoji: "🎉",
      route: "/admin/events",
    },
    {
      label: "регистрации на мероприятия",

      emoji: "📝",
      route: "/admin/registrations",
    },
    { label: "новости", value: stats.news, emoji: "📰", route: "/admin/news" },
    {
      label: "пользователи",

      emoji: "👥",
      route: "/admin/users",
    },
  ];

  return (
    <div className=" ">
      <h1 className="text-2xl font-bold flex mb-4 items-center text-white">
        Панель администратора
      </h1>
      <div className="grid  grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.route}>
            <div className="bg-white rounded-[24px] shadow-lg p-6 flex flex-col items-center transition transform hover:scale-103 cursor-pointer">
              <span className="text-4xl mb-2">{card.emoji}</span>

              <span className="text-[14px] text-gray-500 capitalize ">
                {card.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white my-6 rounded-xl shadow p-6">
        <p className="text-center">
          Выберите нужный раздел, нажав на карточку для управления данными.
        </p>
      </div>
    </div>
  );
}
