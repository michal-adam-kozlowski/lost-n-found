"use client";

import { Button, Divider, Group, Select, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import React, { useEffect } from "react";
import { MarkerLocation } from "@components/maps/CustomMap";
import { addItem } from "@/actions/items";
import { useForm } from "@mantine/form";
import TypeRadioGroup from "@/app/(main)/add/TypeRadioGroup";
import { DatePickerInput } from "@mantine/dates";
import LocationPicker from "@components/maps/LocationPicker";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useDebouncedCallback } from "@mantine/hooks";
import { useCategories } from "@/lib/context/CategoriesContext";
import { redirect } from "next/navigation";

export interface AddItemFormValues {
  type: "found" | "lost";
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: MarkerLocation | null;
  locationLabel: string;
}

export default function AddItemForm({ onChange }: Readonly<{ onChange?: (values: AddItemFormValues) => void }>) {
  const { categories, loading: categoriesLoading } = useCategories();
  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 500);

  const form = useForm<AddItemFormValues>({
    mode: "uncontrolled",
    initialValues: {
      type: "lost",
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

    const occurredAt = dayjs(values.occurredAt).toISOString();

    const res = await addItem({
      title: values.title,
      type: values.type,
      description: values.description,
      latitude: values.location?.latitude ?? 0,
      longitude: values.location?.longitude ?? 0,
      categoryId: values.categoryId,
      locationLabel: values.locationLabel,
      occurredAt: occurredAt.toString(),
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
      <div>
        <Title order={3} size="lg" mb="md">
          1. Typ ogłoszenia
        </Title>
        <TypeRadioGroup {...form.getInputProps("type")} />
      </div>
      <div>
        <Title order={3} size="lg" mb="md">
          2. Informacje o przedmiocie
        </Title>
        <TextInput
          withAsterisk
          label="Tytuł ogłoszenia"
          placeholder={
            form.values.type === "found"
              ? "Np. Znaleziony czarny portfel w centrum"
              : "Np. Zgubiony czarny portfel w centrum"
          }
          mb="sm"
          {...form.getInputProps("title")}
        />
        <Group gap="sm" mb="sm">
          <Select
            withAsterisk
            label="Kategoria"
            placeholder="Wybierz kategorię"
            data={categories.map((c) => ({ label: c.name, value: c.id }))}
            disabled={categoriesLoading}
            searchable
            miw={240}
            flex={10}
            allowDeselect={false}
            {...form.getInputProps("categoryId")}
          />
          <DatePickerInput
            label={form.values.type === "found" ? "Data znalezienia" : "Data zagubienia"}
            placeholder="Wybierz datę"
            locale="pl"
            valueFormat={"DD MMMM YYYY"}
            miw={240}
            flex={1}
            popoverProps={{
              position: "bottom",
            }}
            {...form.getInputProps("occurredAt")}
          />
        </Group>
        <Textarea
          label="Opis"
          placeholder={
            form.values.type === "found"
              ? "Opisz dokładnie przedmiot, cechy charakterystyczne, okoliczności znalezienia."
              : "Opisz dokładnie przedmiot, cechy charakterystyczne, okoliczności zgubienia."
          }
          resize="vertical"
          rows={8}
          minRows={4}
          maxRows={12}
          {...form.getInputProps("description")}
        />
      </div>
      <div>
        <Title order={3} size="lg" mb="md">
          3. Lokalizacja
        </Title>
        <TextInput
          label="Miejsce"
          placeholder="Np. Warszawa, Dworzec Centralny"
          mb="lg"
          {...form.getInputProps("locationLabel")}
        />
        <LocationPicker {...form.getInputProps("location")} />
      </div>
      <div>
        <Title order={3} size="lg" mb="md">
          4. Zdjęcia
        </Title>
        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={25 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Stack align="center" justify="center" gap="xs" mih={220} style={{ pointerEvents: "none" }}>
            <DropzoneAccept>
              <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
            </DropzoneAccept>
            <DropzoneReject>
              <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
            </DropzoneReject>
            <DropzoneIdle>
              <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
            </DropzoneIdle>

            <Text size="xl" inline>
              Przeciągnij zdjęcia lub kliknij, aby dodać
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              PNG, JPG, WEBP • maks. 5 zdjęć
            </Text>
          </Stack>
        </Dropzone>
      </div>
      <Divider />
      <div className="flex justify-end">
        <Button variant="primary" type="submit">
          Dodaj ogłoszenie
        </Button>
      </div>
    </Stack>
  );
}
