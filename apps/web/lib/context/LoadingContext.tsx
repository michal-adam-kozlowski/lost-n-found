"use client";

import React, { createContext, useContext, useState } from "react";

interface LoadingContextValue {
  getLoading: (key: string) => boolean;
  setLoading: (key: string, value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  getLoading: () => false,
  setLoading: () => {},
});

export function LoadingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const getLoading = (key: string) => loadingStates[key] || false;

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  return <LoadingContext.Provider value={{ getLoading, setLoading }}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  return useContext(LoadingContext);
}
