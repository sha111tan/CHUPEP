"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div>
      <div className="bg-[#22212C] relative z-0 max-h-[900px] min-h-[250px] mb-[120px] mt-[50px]">
        <div className="grid md:px-[15px] px-[10px] container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white mt-[160px] absolute z-10 text-[42px] md:text-[62px] lg:text-[82px] xl:text-[102px] leading-[110%]"
          ></motion.h1>
        </div>

        {/* Container for images with relative positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Image
            src="/icons/line_back.png"
            alt="Back"
            width={1500}
            height={320}
            className="w-full mt-24"
            style={{ pointerEvents: "none" }}
          />

          {/* Overlay image with absolute positioning */}
          <Image
            src="/icons/b_main.png"
            alt="Overlay"
            width={1300}
            height={320}
            className="absolute container md:px-[15px] px-[10px] mx-auto"
            style={{
              pointerEvents: "none",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Centers the image
            }}
          />
        </motion.div>
      </div>

      <div
        className="relative"
        style={{
          backgroundImage: "url('/icons/white_back23.png')",
          backgroundSize: "cover",
          top: "-50px",
          zIndex: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:pt-[100px]"
        >
          <Image
            src="/icons/b1.png"
            alt="Back"
            width={1980}
            height={320}
            className="w-full pt-24"
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
        <div className="md:px-[15px] px-[10px] container mx-auto ">
          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Image
                src="/icons/b2.png"
                alt="Back"
                width={748}
                height={320}
                className="relative pt-12"
                style={{ pointerEvents: "none" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image
                src="/icons/b3.png"
                alt="Back"
                width={748}
                height={320}
                className="relative pt-12"
                style={{ pointerEvents: "none" }}
              />
            </motion.div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Image
                src="/icons/b4.png"
                alt="Back"
                width={748}
                height={320}
                className="w-full pt-6 pb-12"
                style={{ pointerEvents: "none" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
