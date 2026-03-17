"use client";

import { Anchor, Container, Title, Text, TextInput, PasswordInput, Button, Card, Alert, List } from "@mantine/core";
import Link from "next/link";
import { isEmail, useForm, isNotEmpty } from "@mantine/form";
import { ApiError } from "@/lib/api";
import { useEffect, useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { redirect, usePathname } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
}

export default function Page() {
  const form = useForm<FormValues>({
    mode: "controlled",
    initialValues: {
      email: "",
      password: "",
    },
    clearInputErrorOnChange: true,
    onValuesChange: () => {
      setErrors([]);
    },
    validate: {
      email: isEmail("Nieprawidłowy email"),
      password: isNotEmpty("Hasło jest wymagane"),
    },
  });
  const [errors, setErrors] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    form.reset();
  }, [pathname]);

  const handleSubmit = async (values: FormValues) => {
    setErrors([]);
    console.log("FORM VALUES", values);

    try {
      // TODO: implement
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
        Zaloguj się
      </Title>

      <Text ta="center" mb="lg">
        Nie masz jeszcze konta?{" "}
        <Anchor component={Link} href="/register">
          Zarejestruj się
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
            <Button fullWidth mt="sm" type="submit">
              Zaloguj się
            </Button>
          </Card.Section>
        </form>
      </Card>
    </Container>
  );
}
