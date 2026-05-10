"use client";

import { Alert, Button, Card, List, PasswordInput, Title, Text } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";
import { deleteAccount } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";

interface FormValues {
  password: string;
}

export default function DeleteAccountSection() {
  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: { password: "" },
    clearInputErrorOnChange: true,
    onValuesChange: () => setErrors([]),
    validate: {
      password: isNotEmpty("Hasło jest wymagane"),
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    setErrors([]);
    const res = await deleteAccount(values.password);
    if (res.success) {
      notifications.show({
        title: "Konto zostało usunięte",
        message: "Twoje konto zostało pomyślnie usunięte.",
        color: "green",
      });
      router.replace("/");
      return;
    }
    if (Array.isArray(res.errors)) {
      setErrors(res.errors);
      return;
    }
    if (res.errors?.Password) {
      form.setFieldError("password", res.errors.Password[0]);
    }
  };

  return (
    <Card shadow="xs">
      <Card.Section p="lg" pt="md" pb="sm">
        <Title order={3}>Usuń konto</Title>
      </Card.Section>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Alert variant="light" color="red">
          <Text c="red.9" size="sm">
            Ta operacja jest nieodwracalna. Wszystkie twoje ogłoszenia, wiadomości i historia zostaną trwale usunięte.
          </Text>
        </Alert>
        {errors.length > 0 && (
          <Card.Section p="lg" pt="md" withBorder>
            <Alert
              variant="transparent"
              color="red"
              title="Usunięcie konta nie powiodło się"
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
        <Card.Section p="lg" pt="md" pb="sm">
          <PasswordInput
            label="Potwierdź hasło"
            placeholder="Twoje hasło"
            withAsterisk
            {...form.getInputProps("password")}
          />
        </Card.Section>
        <Card.Section p="lg" pt="0" className="flex! flex-row gap-3 justify-end">
          <Button mt="sm" variant="default" type="button" onClick={() => form.reset()}>
            Anuluj
          </Button>
          <Button mt="sm" type="submit" color="red">
            Usuń konto
          </Button>
        </Card.Section>
      </form>
    </Card>
  );
}
