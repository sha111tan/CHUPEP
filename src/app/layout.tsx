import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";
import AuthProvider from "../components/AuthProvider";
export const metadata = {
  title: "Башня ",
  description:
    "Профессиональная забота о питомцах в Норильске: «Хакуна Матата» — диагностика, лечение и вакцинация. Оставьте заявку онлайн!",
  applicationName: "Хакуна Матата",
  keywords: [
    "ветклиника норильск",
    "хакуна матата",
    "ветеринарная клиника",
    "ветеринар",
    "лечение кошек",
    "ветеринарные услуги",
    "хакуна матата норильск",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="yandex-verification" content="6b302a6f52754f1c" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
