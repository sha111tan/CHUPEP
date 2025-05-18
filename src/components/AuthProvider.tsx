"use client";

import { useEffect } from "react";
import useStore from "../store/useStore";
import { usePathname, useSearchParams } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, setToken } = useStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showAuthModal = searchParams.get("requireAuth") === "true";

  // Check auth on initial load and sync token from cookies to Zustand
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.token) {
            // Sync token from cookie to state
            setToken(data.token);
          } else if (token) {
            // If we have a token in state but it's invalid, clear it
            setToken(null);
          }
        } else {
          // If API fails, clear token from state
          if (token) setToken(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (token) setToken(null);
      }
    };

    checkAuth();
  }, [pathname]);

  return <>{children}</>;
}
