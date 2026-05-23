"use client";

import { useState, useRef, useEffect } from "react";
import { useChatHub } from "@/lib/hooks/useChatHub";
import { markMessagesRead, sendMessage } from "@/actions/chat";
import type { ChatMessageResponse, ChatResponse } from "@lost-n-found/api-client";
import Link from "next/link";
import dayjs from "dayjs";

interface Props {
  chatId: string;
  initialMessages: ChatMessageResponse[];
  currentUserId: string;
  chat: ChatResponse;
}

export default function ChatConversation({ chatId, initialMessages, currentUserId, chat }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  });

  useEffect(() => {
    if (initialMessages.length > messages.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(initialMessages);
    }
  }, [initialMessages, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = input.trim();
    if (!body) return;
    setInput("");
    setError(null);
    try {
      const msg = await sendMessage(chatId, body);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      inputRef.current?.focus();
    } catch {
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    }
  }

  return (
    <div>
      <nav style={{ marginBottom: 8 }}>
        <Link href="/chats">← Powrót do rozmów</Link>
      </nav>

      <h2>
        Rozmowa o: <Link href={`/items/${chat.itemId}`}>{chat.itemTitle}</Link>
        {chat.isItemOwner && chat.itemChatCount != null && (
          <span style={{ fontWeight: "normal", fontSize: 14, color: "#666" }}>
            {" "}
            (zapytanie #{Number(chat.itemChatCount)})
          </span>
        )}
      </h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          height: 400,
          overflowY: "auto",
          borderRadius: 4,
          marginBottom: 8,
        }}
      >
        {messages.length === 0 && <p style={{ color: "#999" }}>Brak wiadomości. Napisz pierwszą!</p>}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                textAlign: isOwn ? "right" : "left",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  background: isOwn ? "#d1e7ff" : "#f0f0f0",
                  padding: "6px 12px",
                  borderRadius: 12,
                  display: "inline-block",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                {msg.body}
              </span>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                {dayjs(msg.createdAt).format("HH:mm DD.MM.YYYY")}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p style={{ color: "red", marginBottom: 4 }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          ref={inputRef}
        />
        <button type="submit" disabled={!input.trim()}>
          Wyślij
        </button>
      </form>
    </div>
  );
}
