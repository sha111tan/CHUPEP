"use client";
import { useEffect, useState, useMemo } from "react";
import useStore, { Service, PriceList, Department } from "../../store/useStore";
import ServiceItem from "../../components/ServiceItem";
import { motion } from "motion/react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";

export default function ServicesPage() {
  const {
    searchQuery,
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    services,
    setServices,
    priceLists,
    setPriceListForService,
    departments,
    setDepartments,
  } = useStore();

  // Загружаем отделения, если их ещё нет
  useEffect(() => {
    if (!departments) {
      fetch("/api/departments")
        .then((res) => res.json())
        .then((data: Department[]) => {
          setDepartments(data);
        })
        .catch((err) => console.error(err));
    }
  }, [departments, setDepartments]);

  // Загружаем услуги и прайс-листы
  useEffect(() => {
    if (!services) {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data: Service[]) => {
          setServices(data);
          data.forEach((service) => {
            fetch(`/api/services/${service.id}/pricelists`)
              .then((res) => res.json())
              .then((pl: PriceList[]) => {
                setPriceListForService(service.id, pl);
              })
              .catch((err) => console.error(err));
          });
        })
        .catch((err) => console.error(err));
    } else {
      services.forEach((service) => {
        if (!priceLists[service.id]) {
          fetch(`/api/services/${service.id}/pricelists`)
            .then((res) => res.json())
            .then((pl: PriceList[]) => {
              setPriceListForService(service.id, pl);
            })
            .catch((err) => console.error(err));
        }
      });
    }
  }, [services, setServices, priceLists, setPriceListForService]);

  // Фильтрация услуг по поисковому запросу и фильтру отделения
  const filteredServices = useMemo(() => {
    return services
      ? services.filter((service: Service) => {
          const searchMatch =
            (service.name &&
              service.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (priceLists[service.id] || []).some(
              (priceList: PriceList) =>
                priceList.title &&
                priceList.title
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            );
          const departmentMatch =
            !departmentFilter ||
            service.department_id === Number(departmentFilter);
          return searchMatch && departmentMatch;
        })
      : [];
  }, [services, searchQuery, departmentFilter, priceLists]);

  // Функция для получения названия отделения по его id
  const getDepartmentName = (id: number): string => {
    const dept = departments?.find((d: Department) => d.id === id);
    return dept ? dept.name : "Неизвестное отделение";
  };

  return (
    <div className="mx-auto md:pt-[130px] pt-[90px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] text-center p-10 mb-4 "
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="justify-center "
          >
            <Breadcrumbs
              items={[{ label: "Главная", href: "/" }, { label: "Услуги" }]}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Услуги
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-4 md:flex grid grid-cols-1 justify-between gap-4"
        >
          <div className="max-w-[520px] w-full relative ">
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
          <div className="md:max-w-[220px] w-full relative items-center">
            <p className="mb-2 text-right text-[14px] md:block hidden">
              Фильтрация
            </p>
            <div className="relative ">
              <select
                className="appearance-none cursor-pointer rounded-[16px] transition-all  duration-500 hover:scale-[1.02] text-center text-[14px] border-2 border-[#FF962C] w-full py-[8px] pr-8"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="" className="">
                  Все отделы
                </option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] md:p-10 px-4 py-6"
      >
        {services ? (
          <div className="grid grid-cols-1">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                По вашему запросу ничего не найдено
              </div>
            ) : (
              filteredServices.map((service: Service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  priceList={priceLists[service.id]}
                  departmentName={getDepartmentName(service.department_id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
