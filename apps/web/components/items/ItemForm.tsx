import { Group, Select, TextInput, Title, Text, Textarea, Stack } from "@mantine/core";
import React from "react";
import TypeRadioGroup from "@/app/(main)/add/TypeRadioGroup";
import { useCategories } from "@/lib/context/CategoriesContext";
import { DatePickerInput } from "@mantine/dates";
import LocationPicker from "@components/maps/LocationPicker";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Location } from "@/lib/utils/types";
import { UseFormReturnType } from "@mantine/form";

export interface ItemFormValues {
  type: "found" | "lost";
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: Location | null;
  locationLabel: string;
}

export default function ItemForm({
  form,
}: Readonly<{ form: UseFormReturnType<ItemFormValues, (values: ItemFormValues) => ItemFormValues> }>) {
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <>
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
    </>
  );
}
