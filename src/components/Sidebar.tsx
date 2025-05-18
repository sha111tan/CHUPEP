// /app/admin/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Админ-панель" },
    { href: "/admin/contacts", label: "Контакты" },
    { href: "/admin/top-services", label: "Топ 5 услуг" },
    { href: "/admin/services", label: "Услуги" },
    { href: "/admin/news", label: "Новости" },
    { href: "/admin/update-credentials", label: "Обновить данные" },
  ];

  return (
    <aside className="w-64 bg-[#fff] text-white m-6 rounded-[20px] p-6 shadow fixed top-0 left-0 ">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={`p-2 px-4 text-[#000] rounded-[12px] transition-background duration-500  hover:scale-[1.04] ${
                pathname === item.href ? "bg-gray-200" : ""
              }`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
