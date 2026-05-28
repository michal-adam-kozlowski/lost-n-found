"use client";

import { useState, useRef, useEffect } from "react";
import { useChatHub } from "@/lib/hooks/useChatHub";
import { markMessagesRead, sendMessage } from "@/actions/chat";
import type { ChatMessageResponse, ChatResponse } from "@lost-n-found/api-client";
import dayjs from "dayjs";
import { ActionIcon, Alert, Badge, Box, Button, Center, Flex, ScrollArea, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconSend } from "@tabler/icons-react";
import ChatConversationHeader from "./ChatConversationHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

interface Props {
  chatId: string;
  initialMessages: ChatMessageResponse[];
  currentUserId: string;
  chat: ChatResponse;
}

export default function ChatConversation({ chatId, initialMessages, currentUserId, chat }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useChatHub({
    onMessageCreated: (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        void markMessagesRead(chatId).catch(() => {});
      }
    },
    onChatDeleted: ({ chatId: deletedChatId }) => {
      if (deletedChatId === chatId) {
        setDeleted(true);
      }
    },
  });

  useEffect(() => {
    if (initialMessages.length > messages.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(initialMessages);
    }
  }, [initialMessages, messages]);

  useEffect(() => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = inputRef.current?.value.trim();
    if (!body) return;
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    try {
      const msg = await sendMessage(chatId, body);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    } catch {
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    }
  }

  dayjs.extend(relativeTime);

  return (
    <Flex direction="column" h="100%">
      <ChatConversationHeader chat={chat} />

      {deleted && (
        <Alert icon={<IconAlertCircle size={16} />} color="orange" radius={0} title="Ogłoszenie usunięte">
          To ogłoszenie zostało usunięte. Ta rozmowa nie jest już dostępna.{" "}
          <Button variant="subtle" size="compact-sm" onClick={() => router.push("/chats")}>
            Wróć do wiadomości
          </Button>
        </Alert>
      )}

      <ScrollArea flex={1} viewportRef={viewport} px="md" scrollHideDelay={0}>
        <Center my="md">
          <Badge className="normal-case!" color="gray" variant="light">
            Rozmowa rozpoczęta {dayjs(messages[0]?.createdAt ?? chat.createdAt).format("DD.MM.YYYY HH:mm")}
          </Badge>
        </Center>
        {messages.length === 0 && (
          <Text c="dimmed" size="sm" ta="center" mt="xl">
            Brak wiadomości. Napisz pierwszą!
          </Text>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <Flex key={msg.id} justify={isOwn ? "flex-end" : "flex-start"} mb="sm">
              <Box maw="70%">
                <Box
                  px="sm"
                  py={6}
                  style={{
                    borderRadius: "var(--mantine-radius-lg)",
                    background: isOwn ? "var(--mantine-color-blue-1)" : "var(--mantine-color-gray-2)",
                    wordBreak: "break-word",
                  }}
                >
                  <Text size="sm">{msg.body}</Text>
                </Box>
                <Text size="xs" c="dimmed" ta={isOwn ? "right" : "left"} mt={2}>
                  {dayjs(msg.createdAt).locale("pl").fromNow()}
                </Text>
              </Box>
            </Flex>
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>

      <Box p="md" style={{ borderTop: "1px solid var(--mantine-color-default-border)", flexShrink: 0 }}>
        {error && (
          <Alert color="red" mb="xs" py="xs">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Flex gap="xs">
            <TextInput flex={1} ref={inputRef} placeholder="Napisz wiadomość..." disabled={deleted} />
            <ActionIcon type="submit" size="input-sm" variant="filled" disabled={deleted}>
              <IconSend size={20} />
            </ActionIcon>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
