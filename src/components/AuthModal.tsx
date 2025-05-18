import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useStore from "@/store/useStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    user_name: "",
  });
  const [error, setError] = useState<string>("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLogin && !isTermsAccepted) {
      setError("You must accept the terms to register.");
      return;
    }

    try {
      if (isLogin) {
        // Use the updated API
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            // Set token in Zustand store
            useStore.getState().setToken(data.token);
          }

          onClose();
          router.push("/profile");
        } else {
          const data = await response.json();
          setError(data.detail || "Login failed");
        }
      } else {
        // Registration logic remains the same
        const response = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsLogin(true);
          setError("");
        } else {
          const data = await response.json();
          setError(data.detail || "Registration failed");
        }
      }
    } catch (error) {
      setError("An error occurred");
    }
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
        className="bg-[#1B1B1B] px-10 py-12 rounded-[40px] shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center gap-4">
          <div></div>
          <button
            type="button"
            onClick={onClose}
            className="h-12 bg-[#1B1B1B] transition-background duration-500 hover:scale-[1.08] rounded-full text-white flex items-center justify-center"
          >
            Готово
          </button>
        </div>
        <h2 className="text-white text-center font-[500] mb-4">
          {isLogin ? "Авторизация" : "Регистрация"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Почта
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">
                Имя
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={isTermsAccepted}
                onChange={handleCheckboxChange}
                className="mr-2"
                required
              />
              <label
                htmlFor="terms"
                className="text-[10px] leading-[105%] text-white"
              >
                Я ознакомлен с политикой обработки персональных данных
              </label>
            </div>
          )}
          <button
            type="submit"
            className="h-10 mx-auto flex bg-[#FF4392] text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLogin ? "Войти" : "Регистрация"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 mx-auto flex bg-white text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none leading-[110%] focus:ring-offset-2 font-[400]"
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Авторизуйтесь"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
