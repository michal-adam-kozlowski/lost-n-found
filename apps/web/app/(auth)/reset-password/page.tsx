"use client";

import {
  Anchor,
  Container,
  Title,
  Text,
  PasswordInput,
  Button,
  Card,
  Alert,
  List,
} from "@mantine/core";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useForm, matchesField, isNotEmpty } from "@mantine/form";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/actions/auth";

export default function Page() {
  const params = useSearchParams();
  const email = params.get("email");
  const token = params.get("token");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { password: "", confirmPassword: "" },
    clearInputErrorOnChange: true,
    onValuesChange: () => setErrors([]),
    validate: {
      password: isNotEmpty("Hasło jest wymagane"),
      confirmPassword: matchesField("password", "Hasła muszą być takie same"),
    },
  });

  if (!email || !token) {
    return (
      <Container size="400" px="md" my="xl">
        <Title ta="center" mb="md">
          Resetowanie hasła
        </Title>
        <Card withBorder shadow="md" p="xl">
          <Text ta="center" c="red">
            Nieprawidłowy link resetowania hasła.
          </Text>
          <Text ta="center" mt="md">
            <Anchor component={Link} href="/forgot-password">
              Wyślij nowy link
            </Anchor>
          </Text>
        </Card>
      </Container>
    );
  }

  const handleSubmit = async (values: { password: string }) => {
    setErrors([]);
    const res = await resetPassword(email, token, values.password);
    if (res.success) {
      setSuccess(true);
      return;
    }
    if (Array.isArray(res.errors)) {
      setErrors(res.errors);
    } else {
      const allErrors = Object.values(res.errors).flat();
      setErrors(allErrors);
    }
  };

  if (success) {
    return (
      <Container size="400" px="md" my="xl">
        <Title ta="center" mb="md">
          Resetowanie hasła
        </Title>
        <Card withBorder shadow="md" p="xl">
          <div className="flex flex-col items-center gap-4">
            <IconCircleCheck size={48} color="var(--mantine-color-green-6)" />
            <Text ta="center" size="lg" fw={500}>
              Hasło zostało zmienione.
            </Text>
            <Anchor component={Link} href="/login">
              Przejdź do logowania
            </Anchor>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="400" px="md" my="xl">
      <Title ta="center" mb="md">
        Nowe hasło
      </Title>

      <Card withBorder shadow="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {errors.length > 0 && (
            <Card.Section p="lg" pt="md" withBorder>
              <Alert
                variant="transparent"
                color="red"
                title="Zmiana hasła nie powiodła się"
                p={0}
                mb="xs"
                icon={<IconAlertTriangle />}
              />
              <List className="list-disc" size="sm">
                {errors.map((error, index) => (
                  <List.Item key={index}>{error}</List.Item>
                ))}
              </List>
            </Card.Section>
          )}
          <Card.Section p="lg" pt="md" withBorder className="flex! flex-col gap-3">
            <PasswordInput
              label="Nowe hasło"
              placeholder="Twoje nowe hasło"
              withAsterisk
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Potwierdź hasło"
              placeholder="Powtórz nowe hasło"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
            />
            <Button fullWidth mt="sm" type="submit">
              Zmień hasło
            </Button>
          </Card.Section>
        </form>
      </Card>
    </Container>
  );
}
