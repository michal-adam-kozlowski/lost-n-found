import { Avatar, Button, Group, Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/actions/auth";

export default async function AppHeaderAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <>
        <Group gap="sm" h="100%" visibleFrom="sm">
          <Menu openDelay={0} closeDelay={100} trigger="hover" width={200} position="bottom-end" offset={5} shadow="md">
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
        <Group hiddenFrom="sm">
          <Button component="a" href="/logout" variant="default" leftSection={<IconLogout />} fullWidth>
            Wyloguj się
          </Button>
        </Group>
      </>
    );
  }

  return (
    <Group gap="sm">
      <Link href="/login" prefetch={true}>
        <Button variant="outline">Zaloguj się</Button>
      </Link>
      <Link href="/register" prefetch={true}>
        <Button>Zarejestruj się</Button>
      </Link>
    </Group>
  );
}
