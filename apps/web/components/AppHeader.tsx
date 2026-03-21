import { Avatar, Button, Container, Group, Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import Logo from "@components/Logo";
import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { IconLogout } from "@tabler/icons-react";

function HeaderLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  return (
    <Link href={href} className="h-full flex hover:bg-gray-100 items-center px-4">
      {children}
    </Link>
  );
}

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <Container size="lg" h="100%" px="0">
      <Group h="100%" justify="space-between">
        <Link href="/" prefetch={true}>
          <Logo />
        </Link>
        <Group gap="0" h="100%">
          <HeaderLink href="/found-items">Znalezione</HeaderLink>
          <HeaderLink href="/lost-items">Zgubione</HeaderLink>
          <HeaderLink href="/add">Dodaj</HeaderLink>
        </Group>
        {user ? (
          <Group gap="sm" h="100%">
            <Menu
              openDelay={0}
              closeDelay={100}
              trigger="hover"
              width={200}
              position="bottom-end"
              offset={5}
              shadow="md"
            >
              <MenuTarget>
                <div className="h-full flex hover:bg-gray-100 items-center px-4 gap-2 cursor-default">
                  <Avatar name={user.email} color="initials" />
                  {user.email}
                </div>
              </MenuTarget>
              <MenuDropdown>
                <MenuItem leftSection={<IconLogout />} component="a" href="/logout">
                  Wyloguj się
                </MenuItem>
              </MenuDropdown>
            </Menu>
          </Group>
        ) : (
          <Group gap="sm">
            <Link href="/login" prefetch={true}>
              <Button variant="outline">Zaloguj się</Button>
            </Link>
            <Link href="/register" prefetch={true}>
              <Button>Zarejestruj się</Button>
            </Link>
          </Group>
        )}
      </Group>
    </Container>
  );
}
