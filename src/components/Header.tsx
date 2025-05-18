// components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import useStore, { Department, Service, News } from "../store/useStore";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ProfileModal from "./ProfileModal";
import AuthModal from "./AuthModal";
import { useSearchParams } from "next/navigation";

type SearchResult = {
  type: "news" | "event" | "coworking" | "page";
  id?: string;
  name: string;
  path?: string;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const pathname = usePathname();
  const onProfilePage = pathname === "/profile";
  const router = useRouter();
  const { news } = useStore();

  useEffect(() => {
    if (searchQuery.length > 0) {
      const results: SearchResult[] = [];
      const query = searchQuery.toLowerCase();

      // Add page navigation results
      const pageMatches = [
        { name: "главная", path: "/" },
        { name: "новости", path: "/news" },
        { name: "мероприятия", path: "/events" },
        { name: "коворкинг", path: "/coworking" },
        { name: "аренда", path: "/rent_spaces" }
      ];

      pageMatches.forEach(page => {
        if (page.name.includes(query)) {
          results.push({
            type: "page",
            name: page.name,
            path: page.path
          });
        }
      });

      // Add content search results
      if (news) {
        news.forEach((item) => {
          if (item.news_title?.toLowerCase().includes(query)) {
            results.push({ 
              type: "news", 
              id: item.news_id.toString(), 
              name: item.news_title 
            });
          }
        });
      }

      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, news]);

  const searchParams = useSearchParams();
  useEffect(() => {
    // Check if redirected from profile page with requireAuth parameter
    if (searchParams.get("requireAuth") === "true") {
      setIsAuthModalOpen(true);
    }
  }, [searchParams]);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.toLowerCase() === "главная") {
      router.push("/");
    } else if (query.toLowerCase() === "новости") {
      router.push("/news");
    } else if (query.toLowerCase() === "мероприятия") {
      router.push("/events");
    } else if (query.toLowerCase() === "коворкинг") {
      router.push("/coworking");
    } else if (query.toLowerCase() === "аренда") {
      router.push("/rent");
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "page" && result.path) {
      router.push(result.path);
    } else if (result.type === "news") {
      router.push(`/news/?search=${result.id}`);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchResults.length > 0) {
        setSearchResults(searchResults);
      } else {
        handleSearch(searchQuery);
      }
    }
  };
  const { token } = useStore();
  const handleProfileClick = () => {
    // Check if the user is authenticated
    if (token) {
      // If authenticated, redirect to profile
      router.push("/profile");
    } else {
      // If not authenticated, open the auth modal
      setIsAuthModalOpen(true);
    }
  };
  const handleProfileNavigation = async () => {
    try {
      // Use the consistent API
      const response = await fetch("/api/check-auth");
      const data = await response.json();

      if (data.authenticated) {
        router.push("/profile");
      } else {
        setIsAuthModalOpen(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthModalOpen(true);
    }
  };
  return (
    <header className="fixed md:top-[35px] top-6 left-0 w-full mx-auto z-20">
      <div className="md:px-[15px] px-[10px] mx-auto container flex gap-4 justify-between items-center">
        <div className="">
          <Link href="/" className="flex items-center">
            <Image
              src="/icons/bashnya_logo2.svg"
              alt="Bashnya Logo"
              width={112}
              height={27}
            />
          </Link>
        </div>

        <div className="bg-[#57565E] shadow-md px-4 py-2 md:py-3 font-[600] rounded-[40px] max-w-[770px] w-full flex relative items-center transition-all duration-500 hover:scale-[1.02]">
          <Image
            src="/icons/search_bashnya.svg"
            alt="Search"
            width={15}
            height={15}
            className="absolute left-6 top-1/2 transform -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="События, мероприятия и встречи..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            onKeyPress={handleEnterPress}
            className="w-full pl-11 pr-4 text-[#ABAAAE] bg-[#57565E] focus:outline-none md:text-[14px] text-[12px] font-[400]"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#57565E] shadow-md p-3 rounded-[15px] z-50">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-8 py-2 cursor-pointer text-[14px] leading-[18px] transition-background duration-500 hover:scale-[1.03]"
                  onClick={() => handleResultClick(result)}
                >
                  {result.type === "page" ? (
                    <span className="text-[#ABAAAE]">{result.name}</span>
                  ) : (
                    result.name
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="transition-all duration-500 hover:scale-[1.1]">
          {onProfilePage ? (
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center"
            >
              <Image
                src="/icons/profile_settings.png"
                alt="Настройки профиля"
                width={60}
                height={27}
              />
            </button>
          ) : (
            <button
              // Use the new function instead of handleProfileClick
              onClick={handleProfileNavigation}
              className="flex items-center"
            >
              <Image
                src="/icons/profile.svg"
                alt="Profile"
                width={60}
                height={27}
              />
            </button>
          )}
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <ProfileModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </header>
  );
}
