import { Group, Select, TextInput, Title, Textarea } from "@mantine/core";
import React from "react";
import TypeRadioGroup from "@/app/(main)/add/TypeRadioGroup";
import { useCategories } from "@/lib/context/CategoriesContext";
import { DatePickerInput } from "@mantine/dates";
import LocationPicker from "@components/maps/LocationPicker";
import { ItemType, Location } from "@/lib/utils/types";
import { UseFormReturnType } from "@mantine/form";
import ImageUploader, { ExistingImage } from "@components/items/ImageUploader";

export interface ItemFormValues {
  type: ItemType;
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: Location | null;
  locationLabel: string;
}

interface ItemFormProps {
  form: UseFormReturnType<ItemFormValues, (values: ItemFormValues) => ItemFormValues>;
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: ExistingImage[];
  onDeleteExistingImage?: (imageId: string) => void;
}

export default function ItemForm({
  form,
  files,
  onFilesChange,
  existingImages,
  onDeleteExistingImage,
}: Readonly<ItemFormProps>) {
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <>
      <div>
        <Title order={3} size="lg" mb="md">
          1. Typ ogłoszenia
        </Title>
        <TypeRadioGroup {...form.getInputProps("type")} key={form.key("type")} />
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
          key={form.key("title")}
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
            key={form.key("categoryId")}
            {...form.getInputProps("categoryId")}
          />
          <DatePickerInput
            label={form.values.type === "found" ? "Data znalezienia" : "Data zagubienia"}
            placeholder="Wybierz datę"
            locale="pl"
            valueFormat={"DD MMMM YYYY"}
            miw={240}
            flex={1}
            maxDate={new Date()}
            popoverProps={{
              position: "bottom",
            }}
            key={form.key("occurredAt")}
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
          key={form.key("description")}
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
          key={form.key("locationLabel")}
          {...form.getInputProps("locationLabel")}
        />
        <LocationPicker
          {...form.getInputProps("location")}
          key={form.key("location")}
          color={form.values.type === "found" ? "var(--mantine-color-green-9)" : "var(--mantine-color-red-9)"}
        />
      </div>
      <div>
        <Title order={3} size="lg" mb="md">
          4. Zdjęcia
        </Title>
        <ImageUploader
          files={files}
          onFilesChange={onFilesChange}
          existingImages={existingImages}
          onDeleteExistingImage={onDeleteExistingImage}
        />
      </div>
    </>
  );
}
