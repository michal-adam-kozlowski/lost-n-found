import React from "react";
import {
  Flex,
  Paper,
  Title,
  Text,
  Card,
  CardSection,
  Avatar,
  AppShell,
  AppShellHeader,
  AppShellMain,
  Container,
} from "@mantine/core";
import AccountNavLinks from "@/app/account/AccountNavLinks";
import { getCurrentUser } from "@/actions/auth";
import { AppHeader } from "@components/layout/AppHeader";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
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
            <Title order={2} size={24} mb={6} fw={700}>
              Panel użytkownika
            </Title>
            <Text fw={500}>Zarządzaj profilem, ogłoszeniami i ustawieniami konta.</Text>
          </Container>
        </Paper>
        <Container size="lg" px="0" pt="md">
          <Flex direction="row" gap="lg" mt="md" align="flex-start" className="flex-wrap! md:flex-nowrap!">
            <Card className="w-full md:w-xs min-w-xs md:max-w-xs" shadow="xs">
              <CardSection withBorder p="md">
                <div className="h-full flex  items-center px-0 gap-4 cursor-default">
                  <Avatar name={user.email} color="initials" size="lg" radius="md" />
                  <Text size="lg" fw={500}>
                    {user.email}
                  </Text>
                </div>
              </CardSection>
              <CardSection withBorder p="md" className="flex! flex-col gap-2">
                <AccountNavLinks />
              </CardSection>
            </Card>
            <div className="w-full">{children}</div>
          </Flex>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
