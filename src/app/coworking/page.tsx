"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ServiceItem from "@/components/ServiceItem";

const Coworking = () => {
  // Mock service data for the coworking spaces
  const coworkingService = {
    name: "2 этаж — Гибкий коворкинг для встреч и презентаций",
  };

  return (
    <div>
      <div className="bg-[#22212C] relative z-10 max-h-[900px] min-h-[250px] mb-[40px] md:mb-[180px] lg:mb-[380px] mt-[30px]">
        <div className="grid md:px-[15px] px-[10px] container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white mt-[160px] absolute z-10 text-[42px] md:text-[62px] lg:text-[82px] xl:text-[102px] leading-[110%]"
          ></motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Image
            src="/icons/coworking.png"
            alt="Coworking"
            width={1200}
            height={320}
            className="mx-auto px-4 mt-24"
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
        <div className="justify-center md:flex grid gap-3 mt-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className=" bg-[#fff] text-black h-10 w-full md:px-0 px-12 max-w-[300px] rounded-[16px]  hover:bg-black hover:text-white "
            onClick={() => {
              document.getElementById('coworking-spaces')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p className="font-[500] text-[14px] ">
              Забронировать место
            </p>
          </motion.button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Image
            src="/icons/mega_board.png"
            alt="Board"
            width={1200}
            height={320}
            className="mx-auto px-4 mt-10"
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
      </div>

      <div
        id="coworking-spaces"
        className="relative md:pt-[220px] pt-[30px]"
        style={{
          backgroundImage: "url('/icons/white_back.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="md:px-[15px] px-[10px] container mx-auto py-10 ">
          <ServiceItem departmentName="Коворкинг" />
        </div>
      </div>
    </div>
  );
};

export default Coworking;
