import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import TicketModal from "./TicketModal";
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

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  hideBuyButton?: boolean;
}

interface SuccessPopupProps {
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, hideBuyButton = false }) => {
  if (!isOpen || !event) return null;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
    agreement: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPastEvent = new Date(event.event_date_time) < new Date();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agreement) {
      setError("Вы должны согласиться с условиями соглашения.");
      return;
    }

    // Simulate form submission success
    setFormData({
      name: "",
      phone: "",
      email: "",
      comment: "",
      agreement: false,
    });
    setError(null);
    setShowSuccessPopup(true);

    setTimeout(() => {
      setShowSuccessPopup(false);
      onClose();
    }, 2000);
  };

  const formatPrice = (price: string) => {
    if (/\d/.test(price) && !price.includes("₽")) {
      return `${price} ₽`;
    }
    return price;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#303030] mx-[6px]  md:px-10 px-4 md:py-12 py-6 md:rounded-[40px] rounded-[16px] shadow-lg w-full max-w-[600px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-between items-center  gap-4"
          >
            <div>
              <h3 className="md:text-[20px] text-[14px] font-bold"></h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-[#575757] transition-background duration-500 hover:scale-[1.08] rounded-full text-black flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div>
                <p className="text-[16px] font-[600] text-white mb-4">
                  {event.event_name}
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto flex justify-center mb-4"
              >
                <div className="w-full h-[300px] object-cover rounded-[40px] bg-[#FFFFFF]">
                  {event.event_photo && (
                    <img
                      src={event.event_photo}
                      alt={event.event_name}
                      className="w-full h-full object-cover rounded-[40px]"
                    />
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4"
              >
                <p className="text-[#C1C1C1] text-[12px] leading-[17px]">
                  {event.event_description}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4"
              >
                <p className="text-[12px] font-[400] text-white">Ведущие:</p>
                <p className="text-[12px] leading-[17px] font-[400] text-white">
                  <span className="text-[#FF4392]">{event.event_host}</span>
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-4"
              >
                <p className="text-[12px] font-[400] text-white">
                  Время и место:
                </p>
                <p className="text-[12px] leading-[17px] font-[400] text-[#FF4392]">
                  {new Date(event.event_date_time).toLocaleString()},{" "}
                  {event.event_location}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-4"
              >
                <p className="text-[12px] font-[400] text-white">
                  Осталось мест:
                </p>
                <p className="text-[12px] leading-[17px] font-[400]  text-[#FF4392]">
                  {event.event_max_seats}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mb-6"
              >
                <p className="text-[12px] font-[400] text-white">Стоимость:</p>
                <p className="text-[12px] leading-[17px] font-[400] text-[#FF4392]">
                  {formatPrice(event.event_price || "0")}
                </p>
              </motion.div>
            </div>

            {!hideBuyButton && !isPastEvent && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8}}
                onClick={handleOpenModal}
                className="bg-[#fff] h-10 w-full md:px-0 px-12 text-black max-w-[600px]   hover:bg-black hover:text-white"
              >
                <p className="font-[500] text-[14px] ">Купить</p>
              </motion.button>
            )}
          </form>
        </motion.div>
      </div>
      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={event}
      />
    </>
  );
};

export default EventModal;
