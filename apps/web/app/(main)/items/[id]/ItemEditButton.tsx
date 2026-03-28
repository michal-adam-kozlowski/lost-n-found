import { getCurrentUser } from "@/actions/auth";
import Link from "next/link";
import { Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

export default async function ItemEditButton({ itemId, itemUserId }: { itemId: string; itemUserId?: string | null }) {
  const user = await getCurrentUser();

  return (
    <>
      {itemUserId === user?.id && (
        <Link href={`/items/${itemId}/edit`}>
          <Button leftSection={<IconPencil />}>Edytuj</Button>
        </Link>
      )}
    </>
  );
}
