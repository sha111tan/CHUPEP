"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useStore, {
  Department,
  Service,
  PriceList,
  Specialist,
} from "../../../store/useStore";
import ServiceItem from "../../../components/ServiceItem";
import departmentContent from "../../../../public/data/departments.json";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Image from "next/image";
import { motion } from "framer-motion";
import ServiceModal from "../../../components/ServiceModal";

export default function DepartmentDetailPage() {
  const { departmentId } = useParams();
  const {
    departments,
    setDepartments,
    services,
    setServices,
    specialists,
    setSpecialists,
    priceLists,
    setPriceListForService,
  } = useStore();
  const [deptContent, setDeptContent] = useState<any>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({
    name: "",
    price: "",
  });

  const getDepartmentName = (id: number): string => {
    const dept = departments?.find((d: Department) => d.id === id);
    return dept ? dept.name : "Неизвестное отделение";
  };

  useEffect(() => {
    if (!departmentId) return;
    const deptIdNum = Number(departmentId);

    if (departments) {
      const cachedDept = departments.find(
        (d: Department) => d.id === deptIdNum
      );
      if (cachedDept) {
        setDepartment(cachedDept);
      }
    }

    if (!department) {
      fetch(`/api/departments/${departmentId}`)
        .then((res) => res.json())
        .then((data: Department) => {
          setDepartment(data);
          if (departments) {
            if (!departments.find((d: Department) => d.id === data.id)) {
              setDepartments([...departments, data]);
            }
          } else {
            setDepartments([data]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [departmentId, departments, setDepartments, department]);

  useEffect(() => {
    if (!departmentId) return;
    const deptIdNum = Number(departmentId);
    if (!services) {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data: Service[]) => {
          setServices(data);
          const filteredServices = data.filter(
            (service) => service.department_id === deptIdNum
          );
          filteredServices.forEach((service) => {
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
      services
        .filter((service) => service.department_id === deptIdNum)
        .forEach((service) => {
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
  }, [departmentId, services, setServices, priceLists, setPriceListForService]);

  useEffect(() => {
    if (department || services) {
      setIsLoading(false);
    }
  }, [department, services]);

  useEffect(() => {
    if (departmentId) {
      const content = departmentContent.find(
        (dep: { id: string }) => dep.id === departmentId
      );
      setDeptContent(content);
    }
  }, [departmentId]);

  const openModal = (name: string, price: string) => {
    setSelectedService({ name, price });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse ">
        <div className="border rounded p-4 mb-8">
          <div className="w-full h-40 bg-gray-200 mb-2" />
          <div className="h-8 bg-gray-200 mb-2" />
          <div className="h-6 bg-gray-200" />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Все услуги направления</h2>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Специалисты</h2>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!department) {
    return <div>Отделение не найдено</div>;
  }

  const departmentServices = services
    ? services.filter(
        (service) => service.department_id === Number(departmentId)
      )
    : [];
  const departmentSpecialists = specialists
    ? specialists.filter(
        (specialist) => specialist.department_id === Number(departmentId)
      )
    : [];

  const dept = departments?.find(
    (d: Department) => d.id === Number(departmentId)
  );

  return (
    <div className="container md:pt-[130px] pt-[90px] grid gap-4">
      <div className="bg-[#fff] grid md:gap-8 md:rounded-[40px] rounded-[16px] md:p-10 px-4 py-8 justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Отделения", href: "/departments" },
              { label: dept?.name || "Неизвестное отделение" },
            ]}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="leading-[105%] md:mb-0 mb-8"
        >
          {deptContent.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[#8E8E8E] font-[600] md:text-[14px] text-[10px] md:mb-0 mb-2"
        >
          НАПРАВЛЕНИЕ РАБОТЫ
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center md:max-w-[440px] max-w-[340px] mx-auto md:text-[24px] text-[12px]"
        >
          {deptContent.workDirection}
        </motion.h3>
      </div>

      <div className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] md:p-10 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-[#EEEBE8] md:rounded-[40px] rounded-[16px] grid lg:grid-cols-2 grid-cols-1"
        >
          <div className="md:p-10 px-6 py-8">
          <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }} className="text-left mb-8 md:text-[24px] text-[18px] md:h-[50px]">
              Одно из крупнейших отделений в Норильске
            </motion.h3>
            <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }} className="max-w-[420px] text-[14px] font-[400]">
              {deptContent.block_a1}
            </motion.p>
          </div>
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }} className="md:rounded-[40px] rounded-[16px] ">
            <Image
              src="/icons/doctors_3.webp"
              alt="Doctors"
              width={827}
              height={320}
              className="relative w-full h-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="grid xl:grid-cols-4 grid-cols-2 md:gap-4 gap-2"
        >
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="transition-all duration-500 hover:scale-[1.03] border-2 border-[#FF962C] md:rounded-[40px] rounded-[16px] flex flex-col justify-between md:p-8 p-5 md:min-h-[200px] min-h-[140px]"
            >
              <div className="">
                <div className="md:h-[90px] h-[60px]">
                  <h3 className="md:text-[24px] text-[14px] mb-4">
                    {deptContent[`block_${index + 1}`][0].title}
                  </h3>
                </div>

                <div>
                  <p className="md:text-[14px] text-[12px] leading-[16px] font-[400]">
                    {deptContent[`block_${index + 1}`][0].text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.99 }} className="bg-[#EEEBE8] md:rounded-[40px] rounded-[16px] grid xl:grid-cols-2 grid-cols-1 relative">
          <div className="md:p-10 px-6 pt-6 md:py-8 grid md:gap-5 gap-2">
            <h3 className="text-left md:text-[24px] text-[18px] md:mb-0 mb-4">
              {deptContent.block_a2[0].title}
            </h3>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="grid gap-2">
                <div className="flex gap-3 items-center">
                  <div className="rounded-full bg-[#FF962C] p-1 w-1 h-1"></div>
                  <p className="max-w-[500px] text-[12px] leading-[15px] font-[400]">
                    {deptContent.block_a2[0][`text${index + 1}`]}
                  </p>
                </div>
              </div>
            ))}

            <div className="xl:mt-12 grid gap-4 md:mt-0 mt-4 mx-auto md:mx-0 max-w-[300px]">
              <button
                onClick={() =>
                  openModal(
                    department?.name || "Неизвестное отделение",
                    "Цена по запросу"
                  )
                }
                className="  px-6 mt-auto transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C]"
              >
                <p className="font-[700] text-[14px]">ЗАПИСАТЬ ПИТОМЦА</p>
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden md:rounded-br-[40px] rounded-br-[16px]">
            <Image
              src="/icons/kotik.webp"
              alt="Cat"
              width={769}
              height={320}
              className="xl:block hidden absolute bottom-[-115px] "
            />
            <Image
              src="/icons/kotik.webp"
              alt="Cat"
              width={769}
              height={320}
              className="xl:hidden block relative left-[-80px]"
            />
          </div>
        </motion.div>
      </div>

      <div className="bg-[#fff] grid gap-8 md:rounded-[40px] rounded-[16px] md:p-10 px-4 py-6">
        <div>
          <h3 className="text-center md:text-[24px] text-[20px]">
            Все услуги направления
          </h3>
        </div>

        <div className="mb-8 ">
          <div className="grid grid-cols-1 gap-4 ">
            {departmentServices.map((service: Service) => (
              <ServiceItem
                key={service.id}
                service={service}
                priceList={priceLists[service.id]}
                departmentName={getDepartmentName(service.department_id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Render the ServiceModal component */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedService={selectedService}
      />
    </div>
  );
}
