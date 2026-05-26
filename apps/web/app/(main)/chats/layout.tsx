import { getCurrentUser } from "@/actions/auth";
import { getChats } from "@/actions/chat";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Card, Container, Flex, Paper, Text, Title } from "@mantine/core";
import ChatsSidebar from "./ChatsSidebar";
import React from "react";

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?return=/chats");
  }

  const chats = await getChats();

  return (
    <Flex
      direction="column"
      style={{
        height:
          "calc(100dvh - var(--app-shell-header-height) - var(--mantine-spacing-md) - var(--mantine-spacing-md) - var(--mantine-spacing-md))",
      }}
    >
      <Paper
        w="100vw"
        p="md"
        mt="-xl"
        radius={0}
        style={{
          marginLeft: "calc(-50vw + 50%)",
          borderBottom: "1px solid var(--app-shell-border-color)",
          flexShrink: 0,
        }}
      >
        <Container size="lg" px="xs" py={4}>
          <Title order={2} size={24} mb={6} fw={700}>
            Wiadomości
          </Title>
          <Text fw={500}>Przeglądaj i odpowiadaj na wiadomości dotyczące ogłoszeń.</Text>
        </Container>
      </Paper>

      <Flex
        flex={1}
        gap="lg"
        py="md"
        pt="xl"
        direction={{ base: "column", sm: "row" }}
        style={{ overflow: "visible", minHeight: 0 }}
      >
        <Card
          shadow="xs"
          p={0}
          w={{ base: "100%", sm: 320 }}
          h={{ base: 280, sm: "auto" }}
          style={{ flexShrink: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          <ChatsSidebar initialChats={chats} currentUserId={user.id} />
        </Card>
        <Card
          shadow="xs"
          p={0}
          flex={1}
          style={{ overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          {children}
        </Card>
      </Flex>
    </Flex>
  );
}
