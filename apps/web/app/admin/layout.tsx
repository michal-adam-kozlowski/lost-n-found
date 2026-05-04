import React from "react";
import { Flex, Paper, Title, AppShell, AppShellHeader, AppShellMain, Container } from "@mantine/core";
import { currentUserHasRole } from "@/actions/auth";
import { AppHeader } from "@components/layout/AppHeader";
import { redirect } from "next/navigation";
import AdminNavLinks from "@/app/admin/AdminNavLinks";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isAdmin = await currentUserHasRole("Admin");
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader px="md">
        <AppHeader />
      </AppShellHeader>
      <AppShellMain>
        <Paper
          w="100vw"
          p="md"
          mt="-md"
          mx="-md"
          style={{ borderBottom: "1px solid var(--app-shell-border-color)" }}
          radius={0}
        >
          <Container size="lg" px="0" py={4}>
            <Title order={2} size={24} mb={20} fw={700}>
              Panel administracyjny
            </Title>
            <AdminNavLinks />
          </Container>
        </Paper>
        <Container fluid px="md" pt="md">
          <Flex direction="row" gap="lg" mt="md" align="flex-start" className="flex-wrap! md:flex-nowrap!">
            <div className="w-full">{children}</div>
          </Flex>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
