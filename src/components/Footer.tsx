"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  return (
    <footer className=" bg-white">
      <div className="container px-[15px] justify-between flex mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 mt-[20px] md:mt-[40px] mb-[50px]">
        <div>
          <h1 className="font-bold text-[20px] text-center lg:hidden mb-4 ">
            Контакты
          </h1>
          <Link
            href="https://2gis.ru/norilsk/firm/70000001039885618?m=88.166471%2C69.353526%2F16.29%2Fp%2F45%2Fr%2F117.83"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-all duration-500 hover:scale-[1.02]"
          >
            <img
              src="/icons/bashnya_map.webp"
              alt="Map"
              width={50}
              height={300}
              className="w-full md:rounded-[40px] rounded-[16px]"
            />
          </Link>
        </div>
        <div className="grid">
          <div className="flex justify-between items-center mb-10">
            <h1 className="font-bold text-[28px] lg:block hidden">Контакты</h1>
            <Image
              src="/icons/bashnya_logo.svg"
              alt="Paw"
              width={120}
              height={30}
            />
          </div>

          <div>
            <div className="grid mb-8">
              <p className="text-[16px] font-[600]">Адрес:</p>
              <p className="font-[400] text-[14px]">Ленинский проспект д.1</p>
            </div>
            <div className="grid gap-1 mb-8">
              <p className="text-[16px] font-[600]">Телефон:</p>
              <p className="font-[400] text-[14px]">+7 (3919) 45‒68‒14</p>
            </div>
            <div className="grid  gap-1 mb-8">
              <div className="flex gap-4">
                <p className="text-[14px] font-[400]">пн</p>
                <p className="text-[14px] font-[600] text-[#FF4392] pl-6">
                  выходной
                </p>
              </div>
              <div className="flex gap-4">
                <p className="text-[14px] font-[400]">вт-пт</p>
                <p className="text-[14px] font-[600] pl-1">10:00 - 20:00</p>
              </div>
              <div className="flex gap-4">
                <p className="text-[14px] font-[400]">сб-вс</p>
                <p className="text-[14px] font-[600]">12:00 - 20:00</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="transition-all duration-500 hover:scale-[1.05]">
                <Link
                  href="https://2gis.ru/norilsk/firm/70000001039885618"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-500 hover:scale-[1.05]"
                >
                  <Image
                    src="https://static.tildacdn.com/tild3862-3636-4463-a133-633033323933/1200x630wa.png"
                    alt="2gis"
                    width={45}
                    height={45}
                    className="block rounded-[8px]"
                  />
                </Link>
              </div>
              <div className="transition-all duration-500 hover:scale-[1.05]">
                <Link
                  href="https://2gis.ru/norilsk/firm/70000001039885618"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-500 hover:scale-[1.05]"
                >
                  <Image
                    src="/icons/tg1.png"
                    alt="2gis"
                    width={45}
                    height={45}
                    className="block rounded-[8px]"
                  />
                </Link>
              </div>
              <div className="transition-all duration-500 hover:scale-[1.05]">
                <Link
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-500 hover:scale-[1.05]"
                >
                  <Image
                    src="/icons/vk1.png"
                    alt="WhatsApp"
                    width={45}
                    height={45}
                    className="block"
                  />
                </Link>
              </div>
            </div>
            <div className="grid gap-1 mt-2 ">
              <Link href="/policy">
                <p className="font-[400] text-[14px] transition-all duration-500  block hover:underline">
                  Политика обработки персональных данных
                </p>
              </Link>
            </div>
          </div>

          <div className="h-0.5 bg-[#FF4392] my-3" />
          <div>
            <p className="text-[14px] font-[400]">
              © 2025 “Башня” - Официальный сайт общественно-культурного центра в
              г. Норильске.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
