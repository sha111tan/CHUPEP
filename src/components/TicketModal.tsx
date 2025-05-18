import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useStore from "@/store/useStore";

interface EventItem {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date_time: string;
  event_location: string;
  event_max_seats: number;
  event_photo?: string;
  event_host?: string;
  event_price?: string;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    agreement: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "sbp" | "pushkin"
  >("sbp");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const { token } = useStore();
  // TicketModal.tsx
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agreement) {
      setError("Вы должны согласиться с условиями соглашения.");
      return;
    }

    if (!token) {
      setError("Необходимо авторизоваться для покупки билета");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/event_registrations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            event_id: event.event_id,
            event_reg_date_time: new Date().toISOString(),
            event_reg_email: formData.email
          }),
        }
      );

      if (response.ok) {
        alert("Билет успешно приобретен! Мероприятие добавлено в ваш профиль.");
        onClose();
      } else if (response.status === 401) {
        setError("Сессия истекла. Пожалуйста, войдите в систему снова.");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при покупке билета");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Произошла ошибка при покупке билета");
    }
  };

  const formatPrice = (price: string) => {
    if (/\d/.test(price) && !price.includes("₽")) {
      return `${price} ₽`;
    }
    return price;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-[#D9D9D9] rounded-3xl overflow-hidden max-w-[800px] md:h-[650px] h-[650px] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-3 text-xs flex justify-between items-center">
          <div className="text-[#FF4392]">
            {new Date(event.event_date_time).toLocaleString()},{" "}
            {event.event_location} · {event.event_name}
          </div>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto h-[570px] mr-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="px-3">
            <div className="bg-white p-6 rounded-[20px]">
              <h2 className="text-[12px] font-[700] mb-2">
                Персональные данные
              </h2>
              <p className="text-[10px] leading-[13px] text-gray-500 mb-2">
                На указанный e-mail пришлем билеты и сообщим, если мероприятие
                перенесут или отменят
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Имя и фамилия"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 999 999 99 99"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Электронная почта"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full p-3 text-[10px]"
                  required
                />

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreement"
                    id="agreement"
                    checked={formData.agreement}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label
                    htmlFor="agreement"
                    className="ml-2 md:text-[10px] text-[8px] leading-[11px] md:leading-[13px] text-gray-500"
                  >
                    Ознакомлен и согласился с{" "}
                    <span className="text-pink-500">
                      политикой обработки персональных данных
                    </span>{" "}
                    и даю разрешение на обработку персональных данных
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 text-[10px] rounded-[20px] w-full mt-2">
              <h2 className="text-[12px] font-[700] mb-4">Заказ</h2>

              <div className="flex justify-between mb-2">
                <span>1 билет</span>
                <span>{formatPrice(event.event_price || "0")}</span>
              </div>

              <div className="flex justify-between font-[700] border-t pt-2 mt-2 text-[10px]">
                <span>Итог</span>
                <span>{formatPrice(event.event_price || "0")}</span>
              </div>
            </div>

            <div className="mt-2 bg-white p-6 mb-6 w-full rounded-[20px]">
              <h2 className="text-[12px] font-[700] mb-4">Оплата</h2>

              <div className="flex justify-center gap-10 mb-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 px-1 h-6 flex items-center justify-center cursor-pointer`}
                    onClick={() => setSelectedPaymentMethod("sbp")}
                  >
                    <Image
                      src="/icons/sbp.png"
                      alt="Sbp"
                      width={100}
                      height={30}
                    />
                  </div>
                  <div
                    className={`mt-3.5 h-[3px] w-full rounded-full ${
                      selectedPaymentMethod === "sbp"
                        ? "bg-[#FF4392]"
                        : "bg-transparent"
                    }`}
                  ></div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 px-1 h-6 flex items-center justify-center cursor-pointer`}
                    onClick={() => setSelectedPaymentMethod("pushkin")}
                  >
                    <Image
                      src="/icons/pushkin.png"
                      alt="Pushkin"
                      width={100}
                      height={30}
                    />
                  </div>
                  <div
                    className={`mt-3.5 h-[3px] w-full rounded-full ${
                      selectedPaymentMethod === "pushkin"
                        ? "bg-[#FF4392]"
                        : "bg-transparent"
                    }`}
                  ></div>
                </div>
              </div>

              <div className="bg-[#D9D9D9] p-4 rounded-[20px] mb-4">
                <ol className="font-[500] text-[10px] text-[#737373]">
                  {selectedPaymentMethod === "sbp" ? (
                    <>
                      <li>
                        <span className="text-[#FF4392] mr-2 font-[500]">
                          1.{" "}
                        </span>
                        Нажмите кнопку "Оплатить СБП"
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          2.{" "}
                        </span>
                        Откройте приложение банка
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          3.{" "}
                        </span>
                        Выберите оплату по QR
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          4.{" "}
                        </span>
                        Отсканируйте QR-code
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <span className="text-[#FF4392] mr-2 font-[500]">
                          1.{" "}
                        </span>
                        Нажмите кнопку "Оплатить Пушкинской картой"
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          2.{" "}
                        </span>
                        Откройте приложение "Госуслуги культура"
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          3.{" "}
                        </span>
                        Выберите оплату по QR
                      </li>
                      <li>
                        <span className="text-[#FF4392] mr-1 font-[500]">
                          4.{" "}
                        </span>
                        Отсканируйте QR-code
                      </li>
                    </>
                  )}
                </ol>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-[200px] bg-[#D9D9D9] text-black font-[500] gap-2 rounded-full py-3 flex items-center justify-center text-[10px] h-10"
                >
                  Оплатить по{" "}
                  <span className="font-bold ml-1">
                    <Image
                      src={`/icons/${selectedPaymentMethod}2.png`}
                      alt={selectedPaymentMethod}
                      width={40}
                      height={30}
                    />
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketModal;
