"use server";

import { addTokenToInit, chatApi } from "@/lib/api";
import { getToken } from "@/actions/auth";

export async function createOrGetChat(itemId: string) {
  const token = await getToken();
  const chat = await chatApi.apiChatsPost({ createChatRequest: { itemId } }, addTokenToInit(token));
  return chat;
}

export async function getChats() {
  const token = await getToken();
  return chatApi.apiChatsGet(addTokenToInit(token));
}

export async function getMessages(chatId: string) {
  const token = await getToken();
  return chatApi.apiChatsChatIdMessagesGet({ chatId }, addTokenToInit(token));
}

export async function sendMessage(chatId: string, body: string) {
  const token = await getToken();
  return chatApi.apiChatsChatIdMessagesPost({ chatId, sendMessageRequest: { body } }, addTokenToInit(token));
}
