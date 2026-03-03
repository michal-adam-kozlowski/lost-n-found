"use client";

import { AppShell, Container } from "@mantine/core";
import React from "react";
import { AppHeader } from "@components/AppHeader";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header px="md">
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" px="0">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
