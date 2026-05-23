"use client";

import "dayjs/locale/pl";
import { DatesProvider } from "@mantine/dates";
import React, { Suspense } from "react";
import { CategoriesProvider } from "@/lib/context/CategoriesContext";
import { LoadingProvider } from "@/lib/context/LoadingContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SignalRProvider } from "@/lib/context/SignalRContext";
import { ChatHubProvider } from "@/lib/context/ChatHubContext";
import { ChatNotifications } from "@components/chat/ChatNotifications";

const CHAT_HUB_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/hubs/chat`;

export default function ClientProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DatesProvider settings={{ locale: "pl" }}>
      <LoadingProvider>
        <CategoriesProvider>
          <AuthProvider>
            <SignalRProvider hubUrl={CHAT_HUB_URL}>
              <ChatHubProvider>
                <Suspense>
                  <ChatNotifications />
                </Suspense>
                {children}
              </ChatHubProvider>
            </SignalRProvider>
          </AuthProvider>
        </CategoriesProvider>
      </LoadingProvider>
    </DatesProvider>
  );
}
