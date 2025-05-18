// components/ProfileModal.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    email: "",
    user_name: "",
  });

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/jwt/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "accept": "application/json",
        },
      });
      
      if (response.ok) {
        onClose();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/htoya/", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserData({
            email: data.email,
            user_name: data.user_name,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#1B1B1B] mx-[10px] px-10 py-12 md:rounded-[40px] rounded-[16px] shadow-lg w-full max-w-[500px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center mb-4 gap-4"
        >
          <div></div>
          <button
            type="button"
            onClick={onClose}
            className="h-12 bg-[#1B1B1B] transition-background duration-500 hover:scale-[1.08] rounded-full text-white flex items-center justify-center"
          >
            Готово
          </button>
        </motion.div>
        <div className="mb-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto flex justify-center mb-4"
          >
            <Image
              src="/icons/profile.svg"
              alt="Profile"
              width={100}
              height={27}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-[12px] font-[400] text-[#C1C1C1]">Имя</p>
            <p className="text-[14px] font-[600] text-white">
              {userData.user_name}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <p className="text-[12px] font-[400] text-[#C1C1C1]">Почта</p>
            <p className="text-[14px] font-[600] text-white">
              {userData.email}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-y-4  border-[#303030]"
        >
          <button
            onClick={handleLogout}
            className="w-full text-left"
          >
            <p className="text-[#AF4B4B] font-[500] text-[14px] hover:text-[#c45c5c] transition-colors duration-200">
              Выйти из профиля
            </p>
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-4 flex items-center"
        >
          <label className="text-[10px] text-[#C1C1C1] leading-[13px]">
            © 2025 "Башня" - Официальный сайт общественно-культурного центра в
            г. Норильске
          </label>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
