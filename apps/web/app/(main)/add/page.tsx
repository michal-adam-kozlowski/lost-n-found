"use client";

import { Card, Flex, List, ListItem, Title, useMantineTheme } from "@mantine/core";
import React, { useState } from "react";
import AddItemForm, { AddItemFormValues } from "@/app/(main)/add/AddItemForm";
import ItemCard from "@components/items/ItemCard";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";

export default function Page() {
  const [formValues, setFormValues] = useState<AddItemFormValues | null>(null);
  const [formImages, setFormImages] = useState<File[]>([]);
  const theme = useMantineTheme();
  const media = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

  const imageUrls = formImages.map((file) => URL.createObjectURL(file));

  return (
    <Flex direction={media ? "row" : "column"} columnGap="xl" wrap="nowrap" align="stretch" mb="xl">
      <AddItemForm onChange={(values) => setFormValues(values)} onImagesChange={(files) => setFormImages(files)} />
      <Flex
        className="flex-1"
        gap="lg"
        direction={media ? "column" : "row"}
        wrap="wrap"
        align="flex-start"
        justify={media ? "flex-start" : "center"}
      >
        <Card shadow="xs" p="lg" mt={media ? 0 : 32.5} flex={media ? "none" : 1} className="min-w-2xs">
          <Title order={3} size="md" mb="xs">
            Wskazówki
          </Title>
          <List className="list-disc" size="sm" fw={500} c="gray.6">
            <ListItem className="mb-2">Dodaj konkretny tytuł ogłoszenia. </ListItem>
            <ListItem className="mb-2">Opisz cechy charakterystyczne przedmiotu.</ListItem>
            <ListItem className="mb-2">Wskaż dokładne miejsce na mapie.</ListItem>
            <ListItem className="mb-2">Dodaj zdjęcie, jeśli je posiadasz.</ListItem>
            <ListItem className="mb-2">Uzupełnij dane kontaktowe, aby ułatwić odnalezienie właściciela</ListItem>
          </List>
        </Card>
        <div>
          <Title order={3} size="md" mb="xs">
            Podgląd ogłoszenia
          </Title>
          <ItemCard
            item={{
              title: formValues?.title || "Tytuł ogłoszenia",
              description: formValues?.description || "Tutaj pojawi się krótki podgląd treści dodawanego ogłoszenia.",
              type: formValues?.type || "found",
              categoryId: formValues?.categoryId || "",
              longitude: formValues?.location?.longitude || null,
              latitude: formValues?.location?.latitude || null,
              locationLabel: formValues?.locationLabel || "",
              occurredAt: dayjs(formValues?.occurredAt).locale("pl").format("DD MMMM YYYY") || "Data",
              createdByUserId: "",
              images: [],
            }}
            loadedImageUrls={imageUrls}
          />
        </div>
      </Flex>
    </Flex>
  );
}
