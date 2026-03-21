import { Button, Container, Group } from "@mantine/core";
import Logo from "@components/Logo";
import React from "react";
import Link from "next/link";

export function SimpleAppHeader() {
  return (
    <Container size="lg" h="100%" px="0">
      <Group h="100%" justify="space-between">
        <Link href="/" prefetch={true}>
          <Logo />
        </Link>
        <Group gap="sm">
          <Link href="/login" prefetch={true}>
            <Button variant="outline">Zaloguj się</Button>
          </Link>
          <Link href="/register" prefetch={true}>
            <Button>Zarejestruj się</Button>
          </Link>
        </Group>
      </Group>
    </Container>
  );
}
