import React, { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: { name: string; price: string };
}

interface SuccessPopupProps {
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white md:px-10 md:py-12 px-6 py-8 md:rounded-[40px] rounded-[16px] text-center mx-10">
      <h2 className="md:text-[24px] text-[16px] font-bold ">
        Обращение отправлено! Ожидайте
      </h2>
    </div>
  </div>
);

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  selectedService,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
    agreement: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.agreement) {
      setError("Вы должны согласиться с условиями соглашения.");
      return;
    }

    const formDataWithService = new FormData();
    formDataWithService.append("name", formData.name);
    formDataWithService.append("phone", formData.phone);
    formDataWithService.append("email", formData.email);
    formDataWithService.append("comment", formData.comment);
    formDataWithService.append("service", selectedService.name);
    formDataWithService.append("price", selectedService.price);
    formDataWithService.append(
      "access_key",
      "API_key"
    );

    const object = Object.fromEntries(formDataWithService.entries());
    const json = JSON.stringify(object);

    console.log("Form Data:", json); // Log the form data being sent

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.success) {
        console.log("Form submitted successfully:", result);
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
      } else {
        console.error("Form submission failed:", result);
        setError("Ошибка при отправке формы. Пожалуйста, попробуйте снова.");
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
      setError("Произошла ошибка. Пожалуйста, попробуйте снова позже.");
    }
  };

  if (!isOpen) return null;

  const formatPrice = (price: string) => {
    if (/\d/.test(price) && !price.includes('₽')) {
      return `${price} ₽`;
    }
    return price;
  };

  const truncatedName =
    selectedService.name.length > 30
      ? `${selectedService.name.slice(0, 30)}...`
      : selectedService.name;

  const formattedPrice = formatPrice(selectedService.price);

  return (
    <>
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white mx-[10px] md:px-16 md:py-16 px-10 py-12 md:rounded-[40px] rounded-[16px] shadow-lg w-full max-w-[600px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-between items-center mb-4 gap-4"
          >
            <div>
              <h3 className="md:text-[20px] text-[14px] font-bold">
                {truncatedName}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-12 bg-[#D9D9D9] transition-background duration-500 hover:scale-[1.08] rounded-full text-black flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-2"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                className="border-2 p-3 px-5 w-full rounded-[15px] text-black text-[14px]"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-2"
            >
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон"
                className="border-2 p-3 px-5 w-full rounded-[15px] text-black text-[14px]"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-2"
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border-2 p-3 px-5 w-full rounded-[15px] text-black text-[14px]"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-2"
            >
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Комментарий"
                className="border-2 p-3 px-5 w-full rounded-[15px] text-black text-[14px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-2 flex items-center"
            >
              <input
                type="checkbox"
                name="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="mr-2 "
              />
              <label className="text-[10px] leading-[13px]">
                Я ознакомлен с <Link href="/policy" className="underline">политикой обработки персональных данных</Link>
              </label>
            </motion.div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex pt-2 gap-6 items-center"
            >
              <button
                type="submit"
                className="h-10 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] text-white px-4"
              >
                <p>Записаться</p>
              </button>
              <div className="">
                <p className="text-[12px] font-normal">Стоимость услуги</p>
                <p className="text-[14px] font-bold">{formattedPrice}</p>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
      {showSuccessPopup && (
        <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}
    </>
  );
};

export default ServiceModal;
