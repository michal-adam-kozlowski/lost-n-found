"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CategoryResponse } from "@lost-n-found/api-client";
import { categoriesApi } from "@/lib/api";

interface CategoriesContextValue {
  categories: CategoryResponse[];
  loading: boolean;
}

const CategoriesContext = createContext<CategoriesContextValue>({
  categories: [],
  loading: true,
});

export function CategoriesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi
      .apiCategoriesGet()
      .then(setCategories)
      .catch((err) => console.error("Failed to fetch categories", err))
      .finally(() => setLoading(false));
  }, []);

  return <CategoriesContext.Provider value={{ categories, loading }}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  return useContext(CategoriesContext);
}
