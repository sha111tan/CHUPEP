"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/htoya/", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.user_name);
          setIsSuperuser(data.is_superuser);
          if (pathname.startsWith("/admin") && !data.is_superuser) {
            router.push("/admin/login?message=no_access");
          }
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/admin/login");
      }
    };

    if (pathname !== "/admin/login") {
      checkAuth();
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/jwt/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        document.cookie =
          "bonds=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isSuperuser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Нет доступа</h1>
        <p className="mt-4">У вас нет прав доступа к этой странице.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && (
        <header className="bg-[#22212C] rounded-[16px] m-2 mb-4 text-white">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/admin">
                  <img
                    src="/logo_bashnya.svg"
                    alt="Логотип"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px]">Привет, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#AF4B4B] px-5 py-1 rounded-[24px] hover:bg-[#FF4392] transition"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-[#303030] py-4 text-center text-white ">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Башня - Панель администратора
        </div>
      </footer>
    </div>
  );
}
