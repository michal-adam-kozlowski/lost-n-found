"use client";

import { useEffect, useRef } from "react";
import { useChatHubContext } from "@/lib/context/ChatHubContext";
import type { ChatMessageResponse, ChatResponse } from "@lost-n-found/api-client";

interface ChatHubHandlers {
  onMessageCreated?: (msg: ChatMessageResponse) => void;
  onChatCreated?: (chat: ChatResponse) => void;
}

export function useChatHub(handlers: ChatHubHandlers) {
  const { subscribeToMessages, subscribeToChats } = useChatHubContext();

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const unsubMsg = subscribeToMessages((msg) => {
      handlersRef.current.onMessageCreated?.(msg);
    });
    const unsubChat = subscribeToChats((chat) => {
      handlersRef.current.onChatCreated?.(chat);
    });
    return () => {
      unsubMsg();
      unsubChat();
    };
  }, [subscribeToMessages, subscribeToChats]);
}
