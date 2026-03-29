import { Button, Container, Divider, Group } from "@mantine/core";
import Logo from "@components/layout/Logo";
import React from "react";
import Link from "next/link";
import AppHeaderAuth from "@components/layout/AppHeaderAuth";
import AppHeaderDrawer from "@components/layout/AppHeaderDrawer";
import { IconPlus } from "@tabler/icons-react";

function HeaderLink({
  href,
  horizontal,
  children,
}: Readonly<{ href: string; horizontal?: boolean; children: React.ReactNode }>) {
  const classes = horizontal
    ? "w-full flex hover:bg-gray-100 items-center p-4"
    : "h-full flex hover:bg-gray-100 items-center px-4";
  return (
    <Link href={href} className={classes} prefetch={false}>
      {children}
    </Link>
  );
}

export function AppHeader({ showLinks = true }: Readonly<{ showLinks?: boolean }>) {
  return (
    <Container size="lg" h="100%" px="0">
      <Group h="100%" justify="space-between" visibleFrom="sm">
        <Link href="/" prefetch={true}>
          <Logo />
        </Link>
        {showLinks && (
          <Group gap="0" h="100%">
            <HeaderLink href="/found-items">Znalezione</HeaderLink>
            <HeaderLink href="/lost-items">Zgubione</HeaderLink>
            <Link href="/add">
              <Button leftSection={<IconPlus />} variant="filled" color="blue" radius="sm" mx="sm">
                Dodaj ogłoszenie
              </Button>
            </Link>
          </Group>
        )}
        <AppHeaderAuth />
      </Group>
      <Group h="100%" justify="space-between" hiddenFrom="sm">
        <Link href="/" prefetch={true}>
          <Logo />
        </Link>
        <AppHeaderDrawer>
          {showLinks && (
            <>
              <Group gap="0" mx="-md">
                <HeaderLink href="/found-items" horizontal>
                  Znalezione
                </HeaderLink>
                <HeaderLink href="/lost-items" horizontal>
                  Zgubione
                </HeaderLink>
                <Link href="/add" className="w-full mx-3 my-3">
                  <Button leftSection={<IconPlus />} variant="filled" color="blue" radius="sm" fullWidth>
                    Dodaj ogłoszenie
                  </Button>
                </Link>
              </Group>
              <Divider my="sm" mx="-md" />
            </>
          )}
          <AppHeaderAuth />
        </AppHeaderDrawer>
      </Group>
    </Container>
  );
}
