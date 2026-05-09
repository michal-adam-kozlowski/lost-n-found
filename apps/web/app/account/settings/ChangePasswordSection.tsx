"use client";

import { Alert, Button, Card, List, PasswordInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { changePassword } from "@/actions/auth";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";

interface FormValues {
  oldPassword: string;
  newPassword: string;
}

export default function ChangePasswordSection() {
  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    clearInputErrorOnChange: true,
    onValuesChange: () => {
      setErrors([]);
    },
    validate: {
      oldPassword: isNotEmpty("Hasło jest wymagane"),
      newPassword: isNotEmpty("Hasło jest wymagane"),
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const pathname = usePathname();

  const handleSubmit = async (values: FormValues) => {
    setErrors([]);
    const res = await changePassword(values.oldPassword, values.newPassword);
    if (res.success) {
      notifications.show({
        title: "Zmieniono hasło pomyślnie",
        message: "",
        color: "green",
      });
      form.reset();
    }
    if (Array.isArray(res.errors)) {
      setErrors(res.errors);
      return;
    }
    if (res.errors.CurrentPassword) {
      form.setFieldError("oldPassword", res.errors.CurrentPassword[0]);
    }
    if (res.errors.PasswordMismatch) {
      form.setFieldError("oldPassword", res.errors.PasswordMismatch[0]);
    }
    if (res.errors.NewPassword) {
      form.setFieldError("newPassword", res.errors.NewPassword[0]);
    }
  };

  useEffect(() => {
    form.reset();
  }, [pathname]);

  return (
    <Card shadow="xs">
      <Card.Section p="lg" pt="md" pb="sm">
        <Title order={3}>Zmień hasło</Title>
      </Card.Section>
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
            ></Alert>
            <List className="list-disc" size="sm">
              {errors.map((error, index) => (
                <List.Item key={index}>{error}</List.Item>
              ))}
            </List>
          </Card.Section>
        )}
        <Card.Section p="lg" pt="md" pb="sm" className="flex! flex-row gap-3">
          <PasswordInput
            label="Obecne hasło"
            placeholder="Twoje hasło"
            withAsterisk
            flex={1}
            {...form.getInputProps("oldPassword")}
          />
          <PasswordInput
            label="Nowe hasło"
            placeholder="Twoje nowe hasło"
            withAsterisk
            flex={1}
            {...form.getInputProps("newPassword")}
          />
        </Card.Section>
        <Card.Section p="lg" pt="0" className="flex! flex-row gap-3 justify-end">
          <Button
            mt="sm"
            type="button"
            variant="default"
            onClick={async () => {
              form.reset();
            }}
          >
            Anuluj
          </Button>
          <Button mt="sm" type="submit">
            Zapisz zmiany
          </Button>
        </Card.Section>
      </form>
    </Card>
  );
}
