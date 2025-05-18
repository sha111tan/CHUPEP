import { useEffect, useState } from "react";

interface TopService {
  id: number;
  name: string;
  price: number;
}

interface TopServicesSectionProps {
  openModal: (serviceName: string, servicePrice: string) => void;
}

const TopServicesSection: React.FC<TopServicesSectionProps> = ({
  openModal,
}) => {
  const [topServices, setTopServices] = useState<TopService[]>([]);

  useEffect(() => {
    const fetchTopServices = async () => {
      try {
        const res = await fetch("/api/top-services", {});
        if (!res.ok) {
          throw new Error("Ошибка при получении топ услуг");
        }
        const data = await res.json();
        setTopServices(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchTopServices();
  }, []);

  return (
    <div className="grid">
      <div className="flex flex-col transition-all hover:shadow-sm duration-500 md:rounded-[40px] rounded-[16px] gap-4 bg-[#fff] md:p-10 px-6 py-8">
        <div className="gap-6 grid">
          <h3 className="text-left max-w-[295px] md:text-[32px] text-[18px]">
            ТОП-5 востребованных операций
          </h3>
          <div>
            {topServices.map((service) => (
              <div
                key={service.id}
                className="border-t-2 justify-between flex border-[#FF962C] py-5 text-left gap-4 items-center"
              >
                <p className="font-[600] md:leading-[23px] md:text-[20px] text-[12px] max-w-[200px] md:max-w-[320px]">
                  {service.name}
                </p>
                <div className="w-fit bg-[#E9E8EE] rounded-[20px] py-1 px-4 inline-block">
                  <p className="md:text-[14px] text-[12px] ">
                    {service.price} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => openModal("Хирургия", "Цена по запросу")}
          className="mt-auto transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] md:px-0 px-12 md:mx-0 mx-auto"
        >
          <p className="font-[700] text-[14px]">ЗАПИСАТЬ ПИТОМЦА</p>
        </button>
      </div>
    </div>
  );
};

export default TopServicesSection;
