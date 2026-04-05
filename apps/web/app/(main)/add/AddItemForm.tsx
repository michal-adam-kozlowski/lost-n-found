"use client";

import { Button, Divider, Stack, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { addItem } from "@/actions/items";
import { FormErrors, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useDebouncedCallback } from "@mantine/hooks";
import { ItemType, Location } from "@/lib/utils/types";
import ItemForm from "@components/items/ItemForm";
import { uploadImages } from "@/lib/utils/imageUpload";
import { redirect, usePathname } from "next/navigation";

export interface AddItemFormValues {
  type: ItemType;
  title: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  location: Location | null;
  locationLabel: string;
}

export default function AddItemForm({
  onChange,
  onImagesChange,
}: Readonly<{ onChange?: (values: AddItemFormValues) => void; onImagesChange?: (files: File[]) => void }>) {
  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 500);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

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
    clearInputErrorOnChange: true,
    validate: {
      title: isNotEmpty("Tytuł jest wymagany"),
      categoryId: isNotEmpty("Kategoria jest wymagana"),
      occurredAt: (value) => (value ? null : "Data jest wymagana"),
    },
    onValuesChange: (values) => {
      debouncedOnChange?.(values);
    },
  });

  const clear = () => {
    form.reset();
    setFiles([]);
  };

  useEffect(() => {
    clear();
  }, [pathname]);

  useEffect(() => {
    onChange?.(form.values);
  }, []);

  useEffect(() => {
    onImagesChange?.(files);
  }, [files]);

  const handleErrors = (errors: FormErrors) => {
    const firstErrorPath = Object.keys(errors)[0];
    form.getInputNode(firstErrorPath)?.focus();
  };

  const handleSubmit = async (values: AddItemFormValues) => {
    console.log("FORM VALUES", values);
    setSubmitting(true);

    const occurredAt = dayjs(values.occurredAt).format("YYYY-MM-DD");

    try {
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
      if (!res.success) {
        notifications.show({
          title: "Błąd",
          message: "Nie udało się dodać ogłoszenia. Spróbuj ponownie później.",
          color: "red",
        });
        return;
      }
      if (files.length > 0) {
        try {
          await uploadImages(res.item.id, files);
        } catch (err) {
          console.error("Image upload error:", err);
          notifications.show({
            title: "Uwaga",
            message: "Ogłoszenie dodane, ale nie udało się przesłać niektórych zdjęć.",
            color: "orange",
          });
        }
      }
      notifications.show({
        title: "Dodano ogłoszenie",
        message: "",
        color: "green",
      });
      redirect(`/items/${res.item.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack
      align="stretch"
      justify="flex-start"
      gap="xl"
      mb="xl"
      className="flex-12 basis-md"
      renderRoot={(props) => <form {...props} onSubmit={form.onSubmit(handleSubmit, handleErrors)} />}
    >
      <div>
        <Title order={2} mb="sm">
          Dodaj ogłoszenie
        </Title>
        <Text size="md" c="gray.7" fw={500}>
          Wypełnij formularz, aby opublikować informację o zgubionej lub znalezionej rzeczy.
        </Text>
      </div>
      <ItemForm form={form} files={files} onFilesChange={setFiles} />
      <Divider />
      <div className="flex justify-end">
        <Button variant="primary" type="submit" loading={submitting}>
          Dodaj ogłoszenie
        </Button>
      </div>
    </Stack>
  );
}
