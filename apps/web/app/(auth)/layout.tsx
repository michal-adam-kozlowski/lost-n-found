import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { SimpleAppHeader } from "@components/SimpleAppHeader";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader px="md">
        <SimpleAppHeader />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
