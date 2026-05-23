import { getCurrentUser } from "@/actions/auth";
import { getChats } from "@/actions/chat";
import { redirect } from "next/navigation";
import ChatsPage from "@/app/(main)/chats/ChatsPage";
import { connection } from "next/server";

export default async function Page() {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?return=/chats");
  }

  const chats = await getChats();

  return <ChatsPage initialChats={chats} currentUserId={user.id} />;
}
