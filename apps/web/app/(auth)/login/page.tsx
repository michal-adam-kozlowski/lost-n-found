"use client";

import { Anchor, Container, Title, Text, TextInput, PasswordInput, Button, Card, Alert, List } from "@mantine/core";
import Link from "next/link";
import { isEmail, useForm, isNotEmpty } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { login } from "@/actions/auth";
import { notifications } from "@mantine/notifications";

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
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.has("loggedOut")) {
      notifications.show({
        id: "loggedOut",
        title: "Wylogowano pomyślnie",
        message: "",
        color: "green",
      });
      const newParams = new URLSearchParams(params.toString());
      newParams.delete("loggedOut");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [params]);

  const returnPath = params.get("return");

  useEffect(() => {
    form.reset();
  }, [pathname]);

  const handleSubmit = async (values: FormValues) => {
    setErrors([]);
    const res = await login(values.email, values.password);
    if (res.success) {
      notifications.show({
        title: "Zalogowano pomyślnie",
        message: "",
        color: "green",
      });
      if (returnPath) {
        redirect(returnPath);
      } else {
        redirect("/");
      }
    }
    if (Array.isArray(res.errors)) {
      setErrors(res.errors);
      return;
    }
    if (res.errors.Password) {
      form.setFieldError("password", res.errors.Password[0]);
    }
    if (res.errors.Email) {
      form.setFieldError("email", res.errors.Email[0]);
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
          {returnPath && (
            <Card.Section p="lg" py="md" withBorder>
              <Alert
                variant="transparent"
                color="yellow.9"
                radius="md"
                p={0}
                title="Aby kontynuować, musisz się zalogować"
                icon={<IconAlertTriangle />}
              ></Alert>
            </Card.Section>
          )}
          {errors.length > 0 && (
            <Card.Section p="lg" pt="md" withBorder>
              <Alert
                variant="transparent"
                color="red"
                title="Logowanie nie powiodło się"
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
