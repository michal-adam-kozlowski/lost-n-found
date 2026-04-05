"use client";

import { Button, Divider, Stack, Text, Title } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { editItem } from "@/actions/items";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useDebouncedCallback } from "@mantine/hooks";
import { redirect, usePathname } from "next/navigation";
import { ItemType, Location } from "@/lib/utils/types";
import ItemForm from "@components/items/ItemForm";
import { ItemResponse } from "@lost-n-found/api-client";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import { ExistingImage } from "@components/items/ImageUploader";
import { deleteItemImage, getImageDownloadUrl } from "@/actions/images";
import { uploadImages } from "@/lib/utils/imageUpload";

export interface EditItemFormValues {
  type: ItemType;
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
  onImagesChange,
  onExistingImagesChange,
}: Readonly<{
  item: ItemResponse;
  onChange?: (values: EditItemFormValues) => void;
  onImagesChange?: (files: File[]) => void;
  onExistingImagesChange?: (images: ExistingImage[]) => void;
}>) {
  const debouncedOnChange = useDebouncedCallback(onChange ?? (() => {}), 500);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    async function loadImages() {
      const images: ExistingImage[] = [];
      for (const img of item.images) {
        try {
          const result = await getImageDownloadUrl(item.id, img.id);
          if (!cancelled) {
            images.push({ id: img.id, url: result.downloadUrl });
          }
        } catch (err) {
          console.error(`Failed to load image ${img.id}:`, err);
        }
      }
      if (!cancelled) {
        setExistingImages(images);
      }
    }
    void loadImages();
    return () => {
      cancelled = true;
    };
  }, [item.id, item.images]);

  const clear = () => {
    form.reset();
    setFiles([]);
  };

  useEffect(() => {
    clear();
  }, [pathname]);

  const handleDeleteExistingImage = useCallback(
    async (imageId: string) => {
      try {
        await deleteItemImage(item.id, imageId);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (err) {
        console.error("Failed to delete image:", err);
        notifications.show({
          title: "Błąd",
          message: "Nie udało się usunąć zdjęcia.",
          color: "red",
        });
      }
    },
    [item.id],
  );

  useEffect(() => {
    onImagesChange?.(files);
  }, [files]);

  useEffect(() => {
    onExistingImagesChange?.(existingImages);
  }, [existingImages]);

  const form = useForm<EditItemFormValues>({
    mode: "uncontrolled",
    initialValues: {
      type: item.type as ItemType,
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
    setSubmitting(true);

    const occurredAt = dayjs(values.occurredAt).format("YYYY-MM-DD");

    try {
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
      if (!res.success) {
        notifications.show({
          title: "Błąd",
          message: "Nie udało się edytować ogłoszenia. Spróbuj ponownie później.",
          color: "red",
        });
        return;
      }
      if (files.length > 0) {
        try {
          await uploadImages(item.id, files);
        } catch (err) {
          console.error("Image upload error:", err);
          notifications.show({
            title: "Uwaga",
            message: "Zmiany zapisane, ale nie udało się przesłać niektórych zdjęć.",
            color: "orange",
          });
        }
      }
      notifications.show({
        title: "Edytowano ogłoszenie",
        message: "Twoje zmiany zostały zapisane.",
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
      <ItemForm
        form={form}
        files={files}
        onFilesChange={setFiles}
        existingImages={existingImages}
        onDeleteExistingImage={handleDeleteExistingImage}
      />
      <Divider />
      <div className="flex justify-between gap-4">
        <Link href={`/items/${item.id}`}>
          <Button variant="default" type="button">
            Anuluj
          </Button>
        </Link>
        <Button variant="primary" type="submit" leftSection={<IconDeviceFloppy />} loading={submitting}>
          Zapisz
        </Button>
      </div>
    </Stack>
  );
}
