"use client";

import { Card, Flex, List, ListItem, Stack, Title } from "@mantine/core";
import React, { useState } from "react";
import AddItemForm, { AddItemFormValues } from "@/app/(main)/add/AddItemForm";

export default function Page() {
  const [formValues, setFormValues] = useState<AddItemFormValues | null>(null);

  return (
    <Flex direction="row" columnGap="xl" wrap="wrap" align="flex-start" mb="xl">
      <AddItemForm onChange={(values) => setFormValues(values)} />
      <Stack className="flex-1 basis-xs sticky!" top={92} gap="lg">
        <Card shadow="xs" p="lg">
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
          <Card shadow="xs" p="lg">
            {JSON.stringify(formValues, null, 2)}
          </Card>
        </div>
      </Stack>
    </Flex>
  );
}
