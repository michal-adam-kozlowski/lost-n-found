import { Button, Container, Group } from "@mantine/core";
import Logo from "@components/Logo";
import React from "react";
import Link from "next/link";

function HeaderLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link href={href} className="h-full flex hover:bg-gray-100 items-center px-4">
      {children}
    </Link>
  );
}

export function AppHeader() {
  return (
    <Container size="lg" h="100%" px="0">
      <Group h="100%" justify="space-between">
        <Link href="/">
          <Logo />
        </Link>
        <Group gap="0" h="100%">
          <HeaderLink href="/found-items">Znalezione</HeaderLink>
          <HeaderLink href="/lost-items">Zgubione</HeaderLink>
          <HeaderLink href="/add">Dodaj</HeaderLink>
        </Group>
        <Group gap="sm">
          <Link href="/login">
            <Button variant="outline">Zaloguj się</Button>
          </Link>
          <Link href="/register">
            <Button>Zarejestruj się</Button>
          </Link>
        </Group>
      </Group>
    </Container>
  );
}
