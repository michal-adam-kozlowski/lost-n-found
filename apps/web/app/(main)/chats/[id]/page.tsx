import { getCurrentUser } from "@/actions/auth";
import { getChats, getMessages } from "@/actions/chat";
import { redirect, notFound } from "next/navigation";
import ChatConversation from "@/app/(main)/chats/[id]/ChatConversation";
import { ApiError } from "@/lib/api";
import { connection } from "next/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?return=/chats/${id}`);
  }

  let messages;
  try {
    messages = await getMessages(id);
  } catch (err) {
    if ((err as ApiError).status === 403 || (err as ApiError).status === 404) {
      notFound();
    }
    throw err;
  }

  const chats = await getChats();
  const chat = chats.find((c) => c.id === id);
  if (!chat) {
    notFound();
  }

  return <ChatConversation chatId={id} initialMessages={messages} currentUserId={user.id} chat={chat} />;
}
