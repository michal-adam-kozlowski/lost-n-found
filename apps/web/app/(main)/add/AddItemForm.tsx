"use client";

import { Button, Divider, Stack, Text, Title } from "@mantine/core";
import React, { useEffect } from "react";
import { addItem } from "@/actions/items";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useDebouncedCallback } from "@mantine/hooks";
import { redirect } from "next/navigation";
import { ItemType, Location } from "@/lib/utils/types";
import ItemForm from "@components/items/ItemForm";

export interface AddItemFormValues {
  type: ItemType;
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: Location | null;
  locationLabel: string;
}

export default function AddItemForm({ onChange }: Readonly<{ onChange?: (values: AddItemFormValues) => void }>) {
  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 500);

  const form = useForm<AddItemFormValues>({
    mode: "uncontrolled",
    initialValues: {
      type: "found",
      title: "",
      categoryId: "",
      description: "",
      occurredAt: new Date(),
      location: null,
      locationLabel: "",
    },
    onValuesChange: (values) => {
      debouncedOnChange?.(values);
    },
  });

  useEffect(() => {
    onChange?.(form.values);
  }, []);

  const handleSubmit = async (values: AddItemFormValues) => {
    console.log("FORM VALUES", values);

    const occurredAt = dayjs(values.occurredAt).format("YYYY-MM-DD");

    const res = await addItem({
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
        title: "Dodano ogłoszenie",
        message: "",
        color: "green",
      });
      redirect(`/items/${res.item.id}`);
    } else {
      notifications.show({
        title: "Błąd",
        message: "Nie udało się dodać ogłoszenia. Spróbuj ponownie później.",
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
          Dodaj ogłoszenie
        </Title>
        <Text size="md" c="gray.7" fw={500}>
          Wypełnij formularz, aby opublikować informację o zgubionej lub znalezionej rzeczy.
        </Text>
      </div>
      <ItemForm form={form} />
      <Divider />
      <div className="flex justify-end">
        <Button variant="primary" type="submit">
          Dodaj ogłoszenie
        </Button>
      </div>
    </Stack>
  );
}
