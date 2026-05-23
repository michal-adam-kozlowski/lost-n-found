"use client";

import { useState } from "react";
import { useChatHub } from "@/lib/hooks/useChatHub";
import type { ChatResponse } from "@lost-n-found/api-client";
import Link from "next/link";
import dayjs from "dayjs";

interface Props {
  initialChats: ChatResponse[];
  currentUserId: string;
}

export default function ChatsPage({ initialChats }: Props) {
  const [chats, setChats] = useState(initialChats);

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
          .map((c) =>
            c.id === msg.chatId ? { ...c, lastMessageAt: msg.createdAt } : c,
          )
          .sort((a, b) => {
            const aTime = a.lastMessageAt ?? a.createdAt;
            const bTime = b.lastMessageAt ?? b.createdAt;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          }),
      );
    },
  });

  return (
    <div>
      <h1>Moje rozmowy</h1>
      {chats.length === 0 && <p>Nie masz jeszcze żadnych rozmów.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {chats.map((chat) => (
          <li key={chat.id} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
            <Link href={`/chats/${chat.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <strong>{chat.itemTitle}</strong>
                {chat.isItemOwner && chat.itemChatCount != null && (
                  <span style={{ color: "#666" }}> — zapytanie #{Number(chat.itemChatCount)}</span>
                )}
                {!chat.isItemOwner && (
                  <span style={{ color: "#666" }}> — twoje zapytanie</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                {chat.lastMessageAt
                  ? dayjs(chat.lastMessageAt).format("DD.MM.YYYY HH:mm")
                  : "Brak wiadomości"}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
