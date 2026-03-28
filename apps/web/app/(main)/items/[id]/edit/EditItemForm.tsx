"use client";

import { Button, Divider, Stack, Text, Title } from "@mantine/core";
import React, { useEffect } from "react";
import { editItem } from "@/actions/items";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useDebouncedCallback } from "@mantine/hooks";
import { redirect } from "next/navigation";
import { Location } from "@/lib/utils/types";
import ItemForm from "@components/items/ItemForm";
import { ItemResponse } from "@lost-n-found/api-client";

export interface EditItemFormValues {
  type: "found" | "lost";
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: Location | null;
  locationLabel: string;
}

export default function EditItemForm({
  item,
  onChange,
}: Readonly<{ item: ItemResponse; onChange?: (values: EditItemFormValues) => void }>) {
  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 500);

  const form = useForm<EditItemFormValues>({
    mode: "uncontrolled",
    initialValues: {
      type: item.type as "found" | "lost",
      title: item.title,
      categoryId: item.categoryId,
      description: item.description || "",
      occurredAt: dayjs(item.occurredAt).toDate(),
      location: { latitude: item.latitude as number, longitude: item.longitude as number },
      locationLabel: item.locationLabel || "",
    },
    onValuesChange: (values) => {
      debouncedOnChange?.(values);
    },
  });

  useEffect(() => {
    onChange?.(form.values);
  }, []);

  const handleSubmit = async (values: EditItemFormValues) => {
    console.log("FORM VALUES", values);

    const occurredAt = dayjs(values.occurredAt).format("YYYY-MM-DD");

    const res = await editItem(item.id, {
      title: values.title,
      type: values.type,
      description: values.description,
      latitude: values.location?.latitude ?? 0,
      longitude: values.location?.longitude ?? 0,
      categoryId: values.categoryId,
      locationLabel: values.locationLabel,
      occurredAt,
    });
    if (res.success) {
      notifications.show({
        title: "Edytowano ogłoszenie",
        message: "Twoje zmiany zostały zapisane.",
        color: "green",
      });
      redirect(`/items/${res.item.id}`);
    } else {
      notifications.show({
        title: "Błąd",
        message: "Nie udało się edytować ogłoszenia. Spróbuj ponownie później.",
        color: "red",
      });
    }
  };

  return (
    <Stack
      align="stretch"
      justify="flex-start"
      gap="xl"
      mb="xl"
      className="flex-12 basis-md"
      renderRoot={(props) => <form {...props} onSubmit={form.onSubmit(handleSubmit)} />}
    >
      <div>
        <Title order={2} mb="sm">
          Edytuj ogłoszenie
        </Title>
        <Text size="md" c="gray.7" fw={500}>
          Wypełnij formularz, aby zmienić treść ogłoszenia.
        </Text>
      </div>
      <ItemForm form={form} />
      <Divider />
      <div className="flex justify-end">
        <Button variant="primary" type="submit">
          Zapisz
        </Button>
      </div>
    </Stack>
  );
}
