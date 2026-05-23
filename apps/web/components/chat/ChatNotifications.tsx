"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { useChatHubContext } from "@/lib/context/ChatHubContext";

export function ChatNotifications() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const { subscribeToMessages, subscribeToChats } = useChatHubContext();

  useEffect(() => {
    const unsubMsg = subscribeToMessages((msg) => {
      if (pathnameRef.current === `/chats/${msg.chatId}`) return;

      const id = notifications.show({
        id: `msg-${msg.id}`,
        title: "Nowa wiadomość",
        message: "",
        color: "blue",
        autoClose: 5000,
        onClick: () => {
          router.push(`/chats/${msg.chatId}`);
          notifications.hide(id);
        },
      });
    });

    const unsubChat = subscribeToChats((chat) => {
      const current = pathnameRef.current;
      if (current === "/chats" || current === `/chats/${chat.id}`) return;

      if (!chat.isItemOwner) return;

      const id = notifications.show({
        id: `chat-${chat.id}`,
        title: `Nowe zapytanie`,
        message: `Zapytanie #${chat.itemChatCount} dotyczące ${chat.itemTitle}`,
        color: "blue",
        autoClose: 6000,
        onClick: () => {
          router.push(`/chats/${chat.id}`);
          notifications.hide(id);
        },
      });
    });

    return () => {
      unsubMsg();
      unsubChat();
    };
  }, [subscribeToMessages, subscribeToChats]);

  return null;
}
