"use client";

import { AppShell } from "@mantine/core";
import React from "react";
import { SimpleAppHeader } from "@components/SimpleAppHeader";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header px="md">
        <SimpleAppHeader />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
