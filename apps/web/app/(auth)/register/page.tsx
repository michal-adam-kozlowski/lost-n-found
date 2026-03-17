"use client";

import { Anchor, Container, Title, Text, TextInput, PasswordInput, Button, Card, Alert, List } from "@mantine/core";
import Link from "next/link";
import { isEmail, useForm, matchesField, isNotEmpty } from "@mantine/form";
import { authApi, ApiError } from "@/lib/api";
import { useEffect, useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { redirect, usePathname } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    clearInputErrorOnChange: true,
    onValuesChange: () => {
      setErrors([]);
    },
    validate: {
      email: isEmail("Nieprawidłowy email"),
      password: isNotEmpty("Hasło jest wymagane"),
      confirmPassword: matchesField("password", "Hasła muszą być takie same"),
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    form.reset();
  }, [pathname]);

  const handleSubmit = async (values: FormValues) => {
    setErrors([]);
    try {
      await authApi.apiAuthRegisterPost({
        registerUserRequest: {
          email: values.email,
          password: values.password,
        },
      });
      redirect("/");
    } catch (e) {
      const error = (e as ApiError).data;
      if (!error) {
        throw e;
      }
      if (Array.isArray(error.errors)) {
        setErrors(error.errors);
        return;
      }
      if (error.errors.Password) {
        form.setFieldError("password", error.errors.Password[0]);
      }
      if (error.errors.Email) {
        form.setFieldError("email", error.errors.Email[0]);
      }
    }
  };

  return (
    <Container size="400" px="md" my="xl">
      <Title ta="center" mb="md">
        Zarejestruj się
      </Title>

      <Text ta="center" mb="lg">
        Masz już konto?{" "}
        <Anchor href="/login" component={Link}>
          Zaloguj się
        </Anchor>
      </Text>

      <Card withBorder shadow="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {errors.length > 0 && (
            <Card.Section p="lg" pt="md" withBorder>
              <Alert
                variant="transparent"
                color="red"
                title="Rejestracja nie powiodła się"
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
          <Card.Section p="lg" pt="md" withBorder className="flex! flex-col gap-3">
            <TextInput label="Email" placeholder="email@example.com" withAsterisk {...form.getInputProps("email")} />
            <PasswordInput label="Hasło" placeholder="Twoje hasło" withAsterisk {...form.getInputProps("password")} />
            <PasswordInput
              label="Potwierdź hasło"
              placeholder="Powtórz hasło"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
            />
            <Button fullWidth mt="sm" type="submit">
              Zarejestruj się
            </Button>
          </Card.Section>
        </form>
      </Card>
    </Container>
  );
}
