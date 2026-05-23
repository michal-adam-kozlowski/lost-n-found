"use client";

import { Button } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";
import { createOrGetChat } from "@/actions/chat";
import { useRouter } from "next/navigation";

export function StartChatButton({ itemId }: { itemId: string }) {
  const router = useRouter();

  return (
    <Button
      leftSection={<IconMessage />}
      onClick={async () => {
        const chat = await createOrGetChat(itemId);
        router.push(`/chats/${chat.id}`);
      }}
    >
      Skontaktuj się
    </Button>
  );
}
