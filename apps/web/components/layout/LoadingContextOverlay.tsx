"use client";

import React from "react";
import { useLoading } from "@/lib/context/LoadingContext";
import { LoadingOverlay } from "@mantine/core";

export default function LoadingContextOverlay({
  loadingKey,
  children,
}: Readonly<{ loadingKey: string; children: React.ReactNode }>) {
  const { getLoading } = useLoading();

  return (
    <div className="relative -m-4 p-4 min-h-16">
      <LoadingOverlay
        visible={getLoading(loadingKey)}
        zIndex={10}
        overlayProps={{
          blur: 2,
          color: "var(--mantine-color-gray-0)",
          opacity: 1,
        }}
        transitionProps={{ transition: "fade", duration: 200, keepMounted: true, enterDelay: 100 }}
      ></LoadingOverlay>
      {children}
    </div>
  );
}
