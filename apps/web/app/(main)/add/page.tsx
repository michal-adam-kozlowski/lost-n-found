"use client";

import { Button, Card, Center, Container, Group, Select, Textarea, TextInput, Title } from "@mantine/core";
import React from "react";
import TypePicker from "@components/TypePicker";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import LocationPicker from "@components/LocationPicker";
import { MarkerLocation } from "@components/CustomMap";
import { addItem } from "@/actions/items";

interface FormValues {
  type: "found" | "lost";
  title: string;
  category: string;
  description: string;
  foundLostDate: Date;
  location: MarkerLocation | null;
}

export default function Page() {
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      type: "found",
      title: "",
      category: "",
      description: "",
      foundLostDate: new Date(),
      location: null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    console.log("FORM VALUES", values);

    await addItem({
      title: values.title,
      type: values.type,
      description: values.description,
      latitude: values.location?.latitude ?? 0,
      longitude: values.location?.longitude ?? 0,
    });
  };

  return (
    <Container size="md" px="md">
      <Card withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card.Section p="lg" withBorder>
            <Center>
              <Title order={2}>Dodaj nowe ogłoszenie</Title>
            </Center>
          </Card.Section>
          <Card.Section p="lg" withBorder className="flex! flex-col gap-3">
            <Container size="xs" px="xl">
              <TypePicker size="md" value={form.values.type} onChange={(value) => form.setFieldValue("type", value)} />
            </Container>
            <TextInput withAsterisk label="Tytuł" placeholder="Tytuł ogłoszenia" {...form.getInputProps("title")} />
            <Select
              withAsterisk
              label="Kategoria"
              placeholder="Wybierz kategorię"
              data={["Dokumenty", "Elektronika", "Inne"]}
              searchable
              allowDeselect={false}
              {...form.getInputProps("category")}
            />
            <Textarea
              label="Opis"
              placeholder="Opis ogłoszenia"
              resize="vertical"
              rows={8}
              minRows={4}
              maxRows={12}
              {...form.getInputProps("description")}
            />
            <DatePickerInput
              label={form.values.type === "found" ? "Data znalezienia" : "Data zagubienia"}
              placeholder="Wybierz datę"
              locale="pl"
              {...form.getInputProps("foundLostDate")}
            />
            <LocationPicker {...form.getInputProps("location")} />
          </Card.Section>
          <Card.Section p="lg" withBorder>
            <Group justify="flex-end">
              <Button type="submit">Dodaj</Button>
            </Group>
          </Card.Section>
        </form>
      </Card>
    </Container>
  );
}
