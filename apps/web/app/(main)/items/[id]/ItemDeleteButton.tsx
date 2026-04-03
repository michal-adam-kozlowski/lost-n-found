"use client";

import { Button, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { deleteItem } from "@/actions/items";
import { notifications } from "@mantine/notifications";
import { redirect } from "next/navigation";

export default function ItemDeleteButton({
  itemId,
  itemUserId,
  currentUserId,
}: {
  itemId: string;
  itemUserId?: string | null;
  currentUserId?: string | null;
}) {
  const handleDelete = async () => {
    const res = await deleteItem(itemId);
    if (res.success) {
      notifications.show({
        title: "Usunięto ogłoszenie",
        message: "",
        color: "green",
      });
      redirect(`/account/items?view=list&page=1`);
    } else {
      notifications.show({
        title: "Błąd",
        message: "Nie udało się usunąć ogłoszenia. Spróbuj ponownie później.",
        color: "red",
      });
    }
  };
  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: "Usunąć ogłoszenie?",
      centered: true,
      children: (
        <Text size="sm">
          Czy na pewno chcesz usunąć to ogłoszenie? <br /> Ta operacja jest nieodwracalna.
        </Text>
      ),
      labels: { confirm: "Usuń", cancel: "Anuluj" },
      confirmProps: { color: "red" },
      groupProps: { justify: "space-between" },
      onCancel: () => {},
      onConfirm: () => handleDelete(),
    });
  };

  return (
    <>
      {itemUserId === currentUserId && (
        <Button leftSection={<IconTrash />} color="red" onClick={openDeleteModal}>
          Usuń
        </Button>
      )}
    </>
  );
}
