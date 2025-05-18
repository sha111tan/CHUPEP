"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import useStore from "../../store/useStore";
import Breadcrumbs from "@/components/Breadcrumbs";
import DepartmentServiceCount from "@/components/DepartmentServiceCount";
import Image from "next/image";
import { motion } from "framer-motion";

export default function DepartmentsPage() {
  const { searchQuery, setSearchQuery, departments, setDepartments } =
    useStore();

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.departments && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        } else {
          console.error("Неверный формат данных:", data);
        }
      })
      .catch((err) => console.error(err));
  }, [setDepartments]);

  const filteredDepartments = departments
    ? departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getStyles = (id: number) => {
    switch (id) {
      case 1:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 left-1/2 transform -translate-x-1/2",
          width: 225,
          height: 320,
        };
      case 2:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 right-8",
          width: 252,
          height: 320,
        };
      case 3:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 left-1/2 transform -translate-x-1/2",
          width: 236,
          height: 320,
        };
      case 4:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 left-1/2 transform -translate-x-1/2",
          width: 190,
          height: 320,
        };
      case 5:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 right-9",
          width: 220,
          height: 220,
        };
      case 6:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 right-0",
          width: 210,
          height: 320,
        };
      case 7:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 right-6",
          width: 210,
          height: 320,
        };
      case 8:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 right-6",
          width: 210,
          height: 320,
        };
      case 9:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-5 right-0",
          width: 360,
          height: 320,
        };
      default:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 right-0",
          width: 225,
          height: 320,
        };
    }
  };

  const getMobileStyles = (id: number) => {
    switch (id) {
      case 1:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 2:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 3:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 4:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 5:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 6:
        return {
          bgColor: "bg-[#B56A1F]",
          imageStyle: "absolute bottom-0 right-0",
          width: 120,
          height: 320,
        };
      case 7:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 8:
        return {
          bgColor: "bg-[#FFCF9D]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
      case 9:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-5 right-0",
          width: 180,
          height: 320,
        };
      default:
        return {
          bgColor: "bg-[#FF962C]",
          imageStyle: "absolute bottom-0 right-6",
          width: 125,
          height: 320,
        };
    }
  };

  return (
    <div className="md:pt-[130px] pt-[90px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] p-10 text-center"
      >
        <div className="justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Breadcrumbs
              items={[{ label: "Главная", href: "/" }, { label: "Отделения" }]}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Отделения
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className=" flex justify-center items-center"
        >
          <div className="max-w-[520px] w-full relative">
            <p className="mb-2 text-left text-[14px] md:block hidden">Поиск</p>
            <div className="relative transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/icons/search_vet.svg"
                alt="Paw"
                width={15}
                height={15}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Хирургия..."
                className="rounded-[16px] border-2 text-[16px] px-10 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[#fff] rounded-[40px] mt-4 hidden md:grid gap-4 p-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4"
        >
          {filteredDepartments.map((dept) => {
            const { bgColor, imageStyle, width, height } = getStyles(dept.id);
            return (
              <Link
                href={`/departments/${dept.id}`}
                key={dept.id}
                className={`transition-transform duration-500 hover:scale-[1.02] relative max-w-[654px] w-full rounded-[40px] h-[386px]  gap-4 ${bgColor} p-10`}
              >
                <h3 className="text-[#fff] mb-4 z-10 relative text-[32px]">
                  {dept.name}
                </h3>
                <DepartmentServiceCount departmentId={dept.id} />
                <Image
                  src={`/icons/otdel_${dept.id}.webp`}
                  alt={dept.name}
                  width={width}
                  height={height}
                  className={imageStyle}
                />
              </Link>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[#fff] rounded-[16px] mt-4 grid md:hidden gap-4 p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid gap-4"
        >
          {filteredDepartments.map((dept) => {
            const { bgColor, imageStyle, width, height } = getMobileStyles(
              dept.id
            );
            return (
              <Link
                href={`/departments/${dept.id}`}
                key={dept.id}
                className={`relative w-full rounded-[16px] h-[200px]  gap-4 ${bgColor} px-6 py-8`}
              >
                <h3 className="text-[#fff] mb-4 text-[24px] z-10 relative">
                  {dept.name}
                </h3>
                <DepartmentServiceCount departmentId={dept.id} />
                <Image
                  src={`/icons/otdel_${dept.id}.webp`}
                  alt={dept.name}
                  width={width}
                  height={height}
                  className={imageStyle}
                />
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
