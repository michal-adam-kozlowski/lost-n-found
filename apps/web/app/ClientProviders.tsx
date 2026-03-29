"use client";

import "dayjs/locale/pl";
import { DatesProvider } from "@mantine/dates";
import React from "react";
import { CategoriesProvider } from "@/lib/context/CategoriesContext";
import { LoadingProvider } from "@/lib/context/LoadingContext";

export default function ClientProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DatesProvider settings={{ locale: "pl" }}>
      <LoadingProvider>
        <CategoriesProvider>{children}</CategoriesProvider>
      </LoadingProvider>
    </DatesProvider>
  );
}
