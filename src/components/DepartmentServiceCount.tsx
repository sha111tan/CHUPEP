"use client";

import { useState, useEffect } from "react";

interface DepartmentServiceCountProps {
  departmentId: number;
}

// Function to get the correct form of the word "услуга" based on count
const getServiceWordForm = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "услуг";
  }

  if (lastDigit === 1) {
    return "услуга";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "услуги";
  }

  return "услуг";
};

const DepartmentServiceCount: React.FC<DepartmentServiceCountProps> = ({
  departmentId,
}) => {
  const [serviceCount, setServiceCount] = useState<number>(0);

  useEffect(() => {
    const fetchServiceCount = async () => {
      try {
        const res = await fetch("/api/services");
        const services = await res.json();
        // Фильтруем услуги по department_id
        const departmentServices = services.filter(
          (service: any) => service.department_id === departmentId
        );
        let count = 0;
        for (const service of departmentServices) {
          const res2 = await fetch(
            `/api/services/${service.id}/pricelists`
          );
          const pricelists = await res2.json();
          count += pricelists.length;
        }
        setServiceCount(count);
      } catch (error) {
        console.error("Ошибка при загрузке услуг:", error);
      }
    };

    fetchServiceCount();
  }, [departmentId]);

  return (
    <span className="text-black text-[14px] bg-[#E9E8EE] px-6 py-2 rounded-[20px] relative z-10">
      {serviceCount} {getServiceWordForm(serviceCount)}
    </span>
  );
};

export default DepartmentServiceCount;
