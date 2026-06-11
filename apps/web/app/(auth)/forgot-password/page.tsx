"use client";

import { Anchor, Container, Title, Text, TextInput, Button, Card } from "@mantine/core";
import { IconMailCheck } from "@tabler/icons-react";
import Link from "next/link";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";
import { forgotPassword } from "@/actions/auth";

export default function Page() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    mode: "controlled",
    initialValues: { email: "" },
    validate: {
      email: isEmail("Nieprawidłowy email"),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    await forgotPassword(values.email);
    setSubmitted(true);
  };

  return (
    <Container size="400" px="md" my="xl">
      <Title ta="center" mb="md">
        Resetowanie hasła
      </Title>

      <Text ta="center" mb="lg">
        <Anchor component={Link} href="/login">
          Wróć do logowania
        </Anchor>
      </Text>

      <Card withBorder shadow="md">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 p-4">
            <IconMailCheck size={48} color="var(--mantine-color-blue-6)" />
            <Text ta="center" size="lg" fw={500}>
              Sprawdź swoją skrzynkę email
            </Text>
            <Text ta="center" size="sm" c="dimmed">
              Jeśli konto istnieje, wysłaliśmy link do resetowania hasła.
            </Text>
          </div>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Card.Section p="lg" pt="md" withBorder className="flex! flex-col gap-3">
              <TextInput
                label="Email"
                placeholder="email@example.com"
                withAsterisk
                {...form.getInputProps("email")}
              />
              <Button fullWidth mt="sm" type="submit">
                Wyślij link resetowania
              </Button>
            </Card.Section>
          </form>
        )}
      </Card>
    </Container>
  );
}
