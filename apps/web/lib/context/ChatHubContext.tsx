"use client";

import React, { createContext, useCallback, useContext } from "react";
import type { ChatMessageResponse, ChatResponse } from "@lost-n-found/api-client";
import { useSignalR } from "@/lib/context/SignalRContext";

type MessageHandler = (msg: ChatMessageResponse) => void;
type ChatCreatedHandler = (chat: ChatResponse) => void;

export interface ChatDeletedPayload {
  chatId: string;
  itemId: string;
  itemTitle: string;
}

type ChatDeletedHandler = (payload: ChatDeletedPayload) => void;

interface ChatHubContextValue {
  subscribeToMessages: (handler: MessageHandler) => () => void;
  subscribeToChats: (handler: ChatCreatedHandler) => () => void;
  subscribeToChatsDeleted: (handler: ChatDeletedHandler) => () => void;
}

const ChatHubContext = createContext<ChatHubContextValue>({
  subscribeToMessages: () => () => {},
  subscribeToChats: () => () => {},
  subscribeToChatsDeleted: () => () => {},
});

export function ChatHubProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { subscribe } = useSignalR();

  const subscribeToMessages = useCallback(
    (handler: MessageHandler) => subscribe<ChatMessageResponse>("MessageCreated", handler),
    [subscribe],
  );

  const subscribeToChats = useCallback(
    (handler: ChatCreatedHandler) => subscribe<ChatResponse>("ChatCreated", handler),
    [subscribe],
  );

  const subscribeToChatsDeleted = useCallback(
    (handler: ChatDeletedHandler) => subscribe<ChatDeletedPayload>("ChatDeleted", handler),
    [subscribe],
  );

  return (
    <ChatHubContext.Provider value={{ subscribeToMessages, subscribeToChats, subscribeToChatsDeleted }}>
      {children}
    </ChatHubContext.Provider>
  );
}

export function useChatHubContext() {
  return useContext(ChatHubContext);
}
