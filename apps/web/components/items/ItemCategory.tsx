"use client";

import { useCategories } from "@/lib/context/CategoriesContext";

export default function ItemCategory({ categoryId }: { categoryId: string }) {
  const { loading, categories } = useCategories();

  if (loading) {
    return "";
  }

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return "";
  }

  return category.name;
}
