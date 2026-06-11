"use client";

import { Container, Title, Card, Text, Anchor, Loader, Center } from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmEmail } from "@/actions/auth";

type Status = "loading" | "success" | "error";

export default function Page() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userId = params.get("userId");
    const token = params.get("token");

    if (!userId || !token) {
      setErrorMessage("Nieprawidłowy link weryfikacyjny.");
      setStatus("error");
      return;
    }

    confirmEmail(userId, token).then((res) => {
      if (res.success) {
        setStatus("success");
      } else {
        setErrorMessage(res.error);
        setStatus("error");
      }
    });
  }, [params]);

  return (
    <Container size="400" px="md" my="xl">
      <Title ta="center" mb="md">
        Weryfikacja email
      </Title>

      <Card withBorder shadow="md" p="xl">
        {status === "loading" && (
          <Center>
            <Loader size="lg" />
          </Center>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <IconCircleCheck size={48} color="var(--mantine-color-green-6)" />
            <Text ta="center" size="lg" fw={500}>
              Email potwierdzony!
            </Text>
            <Anchor component={Link} href="/">
              Przejdź do strony głównej
            </Anchor>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <IconCircleX size={48} color="var(--mantine-color-red-6)" />
            <Text ta="center" size="lg" fw={500}>
              {errorMessage}
            </Text>
            <Anchor component={Link} href="/login">
              Przejdź do logowania
            </Anchor>
          </div>
        )}
      </Card>
    </Container>
  );
}
