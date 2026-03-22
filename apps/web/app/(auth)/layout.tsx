import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { AppHeader } from "@components/layout/AppHeader";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader px="md">
        <AppHeader showLinks={false} />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
