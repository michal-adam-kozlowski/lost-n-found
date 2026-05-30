"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useChatHubContext } from "@/lib/context/ChatHubContext";
import { getUnreadCount, markMessagesRead } from "@/actions/chat";
import { useAuth } from "@/lib/context/AuthContext";
interface UnreadMessagesContextValue {
  unreadCount: number;
  clearUnread: () => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextValue>({
  unreadCount: 0,
  clearUnread: () => {},
});

export function UnreadMessagesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { subscribeToMessages, subscribeToChatsDeleted } = useChatHubContext();
  const { user } = useAuth();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnreadCount(0);
      return;
    }
    void getUnreadCount()
      .then((count) => setUnreadCount(count ?? 0))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const match = pathname?.match(/^\/chats\/([0-9a-f-]+)$/i);
    if (!match) return;
    const chatId = match[1];
    void markMessagesRead(chatId)
      .then(() => getUnreadCount())
      .then((count) => setUnreadCount(count ?? 0))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const unsubMsg = subscribeToMessages((msg) => {
      const current = pathnameRef.current;
      if (current === `/chats/${msg.chatId}`) return;
      setUnreadCount((c) => c + 1);
    });

    const unsubDeleted = subscribeToChatsDeleted(() => {
      void getUnreadCount()
        .then((count) => setUnreadCount(count ?? 0))
        .catch(() => {});
    });

    return () => {
      unsubMsg();
      unsubDeleted();
    };
  }, [subscribeToMessages, subscribeToChatsDeleted]);

  const clearUnread = useCallback(() => setUnreadCount(0), []);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, clearUnread }}>{children}</UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  return useContext(UnreadMessagesContext);
}
