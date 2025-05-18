"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ServiceItem from "@/components/ServiceItem";

const RentSpaces = () => {
  // Mock service data for the coworking spaces
  const coworkingService = {
    name: "2 этаж — Гибкий коворкинг для встреч и презентаций",
  };

  return (
    <div>
      <div className="bg-[#22212C] relative z-10 max-h-[900px] min-h-[150px] md:mb-[100px] mb-[40px] mt-[30px]">
        <div className="grid md:px-[15px] px-[10px] container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white md:mt-[160px] mt-[80px] z-10 text-[32px] md:text-[62px] lg:text-[82px] xl:text-[120px] leading-[100%] font-[800] text-center"
          >
            АРЕНДА ПРОСТРАНСТВ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white mt-4 relative z-10 text-[9px] md:text-[16px] lg:text-[22px] xl:text-[28px] leading-[110%] font-[700] text-center"
          >
            Каждый этаж — сцена для твоего события
          </motion.p>
        </div>
      </div>

      <div
        className="relative md:pt-[220px] pt-[30px]"
        style={{
          backgroundImage: "url('/icons/white_back.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="md:px-[15px] px-[10px] container mx-auto py-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 ">
            <div className="order-1">
              <Image
                src="/icons/place.png"
                alt="Place"
                width={60}
                height={320}
                className="hidden lg:block"
                style={{ pointerEvents: "none" }}
              />
            </div>
            <div className="order-1 md:order-2 ml-0 md:ml-8 md:text-left max-w-[850px] md:mr-8 ml-2">
              <p className="font-[700] leading-[105%] xl:text-[40px] lg:text-[28px] md:text-[24px] text-[18px] mb-6">
                1 этаж — Гибкий коворкинг для встреч и презентаций
              </p>
              <p className="font-[700] leading-[105%] mb-6 xl:text-[18px] lg:text-[14px]">
                Уютное пространство с мягкой мебелью и гибкой рассадкой,
                идеально подходящее для лекций, мастер-классов, кинопросмотров и
                встреч. Оснащено всем необходимым для мероприятий:
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — экран и проектор
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — звуковая система с микшером, радио-микрофоны
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — комфортная вместимость до 50 человек
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Image
              src="/icons/alb1.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="md:px-[15px] px-[10px] container mx-auto py-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="order-2 lg:order-1 grid gap-4 items-center">
            <Image
              src="/icons/alb2.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
            <Image
              src="/icons/alb3.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col lg:flex-row gap-4 ">
            <div className="mr-0 md:mr-8 md:text-right max-w-[850px] md:ml-8 ml-2">
              <p className="font-[700] leading-[105%] xl:text-[40px] lg:text-[28px] md:text-[24px] text-[18px] mb-6">
                5 этаж — Конференц-зал и киноплатформа
              </p>
              <p className="font-[700] leading-[105%] mb-6 text-[18px]">
                Многофункциональное пространство, сочетающее стиль и удобство:
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — нижняя платформа: трансформируемая рассадка на 40 человек,
                подходит для кинопоказов, лекций и творческих встреч
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — верхняя галерея и балкон: дополнительная зона обзора с
                уникальной атмосферой
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — индивидуальная мебель и сборная сцена
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — LED-экран, проектор, стенд для брендинга и пресс-волл — всё
                для проведения ток-шоу, награждений, презентаций и
                пресс-конференций
              </p>
            </div>
            <div className="order-1">
              <Image
                src="/icons/place.png"
                alt="Place"
                width={60}
                height={320}
                className="hidden lg:block"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="md:px-[15px] px-[10px] container mx-auto py-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 ">
            <div className="order-1">
              <Image
                src="/icons/place.png"
                alt="Place"
                width={60}
                height={320}
                className="hidden lg:block"
                style={{ pointerEvents: "none" }}
              />
            </div>
            <div className="order-1 md:order-2 ml-0 md:ml-8 md:text-left max-w-[850px] md:mr-8 ml-2">
              <p className="font-[700] leading-[100%] xl:text-[40px] lg:text-[28px] md:text-[24px] text-[18px] mb-6">
                6 этаж — Открытая библиотека для общения и вдохновения
              </p>
              <p className="font-[700] leading-[105%] mb-6 text-[18px]">
                Тихое, светлое пространство среди книжных стеллажей
                индивидуального дизайна.
              </p>
              <p className="font-[400] leading-[100%] mb-2">
                — 6 удобных мест для чтения и работы
              </p>
              <p className="font-[400] leading-[100%] mb-2">
                — до 25 гостей в формате стоячего мероприятия
              </p>
              <p className="font-[400] leading-[100%] mb-2">
                — открытая площадка по периметру лекционного зала
              </p>
              <p className="font-[400] leading-[100%] mb-2">
                — свободный доступ без регистрации — для всех гостей «Башни»
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Image
              src="/icons/alb4.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="md:px-[15px] px-[10px] container mx-auto py-10 flex flex-col lg:flex-row justify-between items-center">
          <div className="order-2 lg:order-1 grid gap-4 items-center">
            <Image
              src="/icons/alb2.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
            <Image
              src="/icons/alb3.webp"
              alt="Place"
              width={300}
              height={320}
              className="w-full"
              style={{ pointerEvents: "none" }}
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col md:flex-row gap-4 ">
            <div className="mr-0 md:mr-8 md:text-right max-w-[850px] md:ml-8 ml-2">
              <p className="font-[700] leading-[105%] xl:text-[40px] lg:text-[28px] md:text-[24px] text-[18px] mb-6">
                7 этаж — Видовой зал с панорамой Норильска
              </p>
              <p className="font-[700] leading-[105%] mb-6 text-[18px]">
                Пространство для особенных событий:
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — закрытая площадка на 20 человек
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — максимальное остекление и завораживающие панорамные виды
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — индивидуальная мебель и сборная сцена
              </p>
              <p className="font-[400] leading-[105%] mb-4">
                — подходит для выставок, церемоний, камерных концертов и
                закрытых встреч
              </p>
            </div>
            <div className="order-2 md:order-1">
              <Image
                src="/icons/place.png"
                alt="Place"
                width={60}
                height={320}
                className="hidden lg:block"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentSpaces;
