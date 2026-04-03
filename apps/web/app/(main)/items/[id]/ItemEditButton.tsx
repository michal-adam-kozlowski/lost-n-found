import Link from "next/link";
import { Button } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

export default async function ItemEditButton({
  itemId,
  itemUserId,
  currentUserId,
}: {
  itemId: string;
  itemUserId?: string | null;
  currentUserId?: string | null;
}) {
  return (
    <>
      {itemUserId === currentUserId && (
        <Link href={`/items/${itemId}/edit`}>
          <Button leftSection={<IconPencil />}>Edytuj</Button>
        </Link>
      )}
    </>
  );
}
