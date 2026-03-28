import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";
import { AppHeader } from "@components/layout/AppHeader";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader px="md">
        <AppHeader showLinks={false} />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
