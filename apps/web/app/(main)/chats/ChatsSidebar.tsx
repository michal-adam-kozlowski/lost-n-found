"use client";

import { useEffect, useState } from "react";
import { useChatHub } from "@/lib/hooks/useChatHub";
import type { ChatResponse } from "@lost-n-found/api-client";
import dayjs from "dayjs";
import { Badge, Box, Center, Flex, ScrollArea, Text, Title } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  initialChats: ChatResponse[];
  currentUserId: string;
}

export default function ChatsSidebar({ initialChats, currentUserId }: Props) {
  const [chats, setChats] = useState(initialChats);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialChats.length > chats.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChats(initialChats);
      return;
    }
    for (const chat of chats) {
      const exists = initialChats.find((c) => c.id === chat.id);
      if (!exists) {
        setChats((prev) => prev.filter((c) => c.id !== chat.id));
      }
    }
  }, [initialChats]);

  useChatHub({
    onChatCreated: (newChat) => {
      setChats((prev) => {
        const exists = prev.find((c) => c.id === newChat.id);
        if (exists) return prev.map((c) => (c.id === newChat.id ? newChat : c));
        return [newChat, ...prev];
      });
    },
    onMessageCreated: (msg) => {
      setChats((prev) =>
        prev
          .map((c) => {
            if (c.id !== msg.chatId) return c;
            const isIncoming = msg.senderId !== currentUserId;
            const isCurrentChat = pathname === `/chats/${c.id}`;
            return {
              ...c,
              lastMessageAt: msg.createdAt,
              unreadCount: isIncoming && !isCurrentChat ? ((c.unreadCount as number) ?? 0) + 1 : c.unreadCount,
            };
          })
          .sort((a, b) => {
            const aTime = a.lastMessageAt ?? a.createdAt;
            const bTime = b.lastMessageAt ?? b.createdAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          }),
      );
    },
  });

  dayjs.extend(relativeTime);

  return (
    <Flex direction="column" h="100%">
      <Box p="md" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-5)", flexShrink: 0 }}>
        <Title order={4}>Wiadomości</Title>
      </Box>

      <ScrollArea flex={1} scrollHideDelay={0}>
        {chats.length === 0 && (
          <Center p="md">
            <Text c="dimmed" size="sm" p="md">
              Nie masz jeszcze żadnych rozmów.
            </Text>
          </Center>
        )}

        {chats.map((chat) => {
          const isActive = pathname === `/chats/${chat.id}`;
          const unread = (chat.unreadCount as number) ?? 0;
          const lastTime = chat.lastMessageAt ? dayjs(chat.lastMessageAt).locale("pl").fromNow() : null;
          const occuredAt = chat.itemOccurredAt ? dayjs(chat.itemOccurredAt).locale("pl").format("DD MMMM YYYY") : null;

          return (
            <Box
              key={chat.id}
              onClick={() => {
                router.push(`/chats/${chat.id}`);
                setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)));
              }}
              px="md"
              py="xs"
              display="block"
              bg={isActive ? "gray.1" : "transparent"}
              className="not-last:border-b border-b-gray-300 cursor-pointer"
            >
              <Flex direction="column" gap={2} mt={2}>
                <Flex justify="space-between" mb={1}>
                  <Badge color={chat.itemType === "lost" ? "red" : "green"} variant="light" size="sm">
                    {chat.itemType === "lost" ? "Zgubione" : "Znalezione"}
                  </Badge>
                  <Flex gap="xs" align="center">
                    <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                      {lastTime ? lastTime : "Brak wiadomości"}
                    </Text>
                    {unread > 0 ? (
                      <Badge color="red" size="sm">
                        {unread > 99 ? "99+" : unread}
                      </Badge>
                    ) : null}
                  </Flex>
                </Flex>

                <Flex align="flex-start" gap={4}>
                  <Text>
                    {chat.isItemOwner && chat.itemChatCount != null
                      ? `Zapytanie #${Number(chat.itemChatCount)} o`
                      : `Twoje zapytanie o`}
                  </Text>
                  <Text fw={600} truncate style={{ flex: 1, minWidth: 0 }}>
                    {chat.itemTitle}
                  </Text>
                </Flex>

                <Flex align="center" gap={6}>
                  <Text size="xs" c="dimmed">
                    {chat.itemLocationLabel}
                    {chat.itemLocationLabel && occuredAt && " • "}
                    {occuredAt}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </ScrollArea>
    </Flex>
  );
}
