"use client";

import { useEffect, useRef } from "react";
import { useChatHubContext } from "@/lib/context/ChatHubContext";
import type { ChatMessageResponse, ChatResponse } from "@lost-n-found/api-client";
import type { ChatDeletedPayload } from "@/lib/context/ChatHubContext";

interface ChatHubHandlers {
  onMessageCreated?: (msg: ChatMessageResponse) => void;
  onChatCreated?: (chat: ChatResponse) => void;
  onChatDeleted?: (payload: ChatDeletedPayload) => void;
}

export function useChatHub(handlers: ChatHubHandlers) {
  const { subscribeToMessages, subscribeToChats, subscribeToChatsDeleted } = useChatHubContext();

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
    const unsubDeleted = subscribeToChatsDeleted((payload) => {
      handlersRef.current.onChatDeleted?.(payload);
    });
    return () => {
      unsubMsg();
      unsubChat();
      unsubDeleted();
    };
  }, [subscribeToMessages, subscribeToChats, subscribeToChatsDeleted]);
}
