"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export interface News {
  news_host: string | undefined;
  news_id: number;
  news_photo: string;
  news_title: string;
  news_text: string;
  news_date: string;
  category?: string;
  content?: string;
  text?: string;
  images?: string[];
}

export interface Department {
  id: number;
  name: string;
  cover?: string;
  description?: string;
}

export interface NewsMetadata {
  id: number;
  title: string;
  created_at: string;
  category?: string;
  cover?: string | null;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  department_id: number;
  price_from?: number;
  price_to?: number;
  cover?: string | null;
}

export interface PriceList {
  name: any;
  id: number;
  service_id: number;
  title: string;
  price: number;
}

export interface Specialist {
  id: number;
  full_name: string;
  specialty?: string;
  description?: string;
  phone?: string;
  price?: number;
  photo?: string;
  department_id: number;
}

export interface AppState {
  token: string | null;
  setToken: (token: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  departments: Department[] | null;
  setDepartments: (departments: Department[]) => void;
  news: News[] | null;
  setNews: (
    news: News[] | ((prevNews: News[] | null) => News[] | null)
  ) => void;
  services: Service[] | null;
  setServices: (services: Service[]) => void;
  specialists: Specialist[] | null;
  setSpecialists: (specialists: Specialist[]) => void;
  priceLists: { [serviceId: number]: PriceList[] };
  setPriceLists: (priceLists: { [serviceId: number]: PriceList[] }) => void;
  setPriceListForService: (serviceId: number, priceList: PriceList[]) => void;
}

const useStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => set({ token }),
      searchQuery: "",
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      departmentFilter: "",
      setDepartmentFilter: (filter: string) =>
        set({ departmentFilter: filter }),
      categoryFilter: "",
      setCategoryFilter: (filter: string) => set({ categoryFilter: filter }),
      departments: null,
      setDepartments: (departments: Department[]) => set({ departments }),
      news: null,
      setNews: (news) =>
        set((state) => ({
          news: typeof news === "function" ? news(state.news) : news,
        })),
      services: null,
      setServices: (services: Service[]) => set({ services }),
      specialists: null,
      setSpecialists: (specialists: Specialist[]) => set({ specialists }),
      priceLists: {},
      setPriceLists: (priceLists: { [serviceId: number]: PriceList[] }) =>
        set({ priceLists }),
      setPriceListForService: (serviceId: number, priceList: PriceList[]) =>
        set((state) => ({
          priceLists: {
            ...state.priceLists,
            [serviceId]: priceList,
          },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        searchQuery: state.searchQuery,
        departmentFilter: state.departmentFilter,
        categoryFilter: state.categoryFilter,
      }),
    }
  )
);

export default useStore;
