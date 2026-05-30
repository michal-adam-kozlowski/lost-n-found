import { Avatar, Button, Group, Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { IconListDetails, IconLogout, IconMessage, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/actions/auth";
import { UnreadMessagesBadge } from "@components/chat/UnreadMessagesBadge";

export default async function AppHeaderAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <>
        <Group gap="sm" h="100%" visibleFrom="md">
          <Menu openDelay={0} closeDelay={100} trigger="hover" width={220} position="bottom-end" offset={5} shadow="md">
            <MenuTarget>
              <div className="h-full flex hover:bg-gray-100 items-center px-4 gap-2 cursor-default">
                <Avatar name={user.email} color="initials" />
                {user.email}
                <UnreadMessagesBadge mt={2} />
              </div>
            </MenuTarget>
            <MenuDropdown>
              <MenuItem leftSection={<IconListDetails />} component="a" href="/account/items?view=list&page=1">
                Moje ogłoszenia
              </MenuItem>
              <MenuItem
                leftSection={<IconMessage />}
                component="a"
                href="/chats"
                rightSection={<UnreadMessagesBadge />}
              >
                Moje rozmowy
              </MenuItem>
              <MenuItem leftSection={<IconSettings />} component="a" href="/account/settings">
                Ustawienia
              </MenuItem>
              <MenuItem leftSection={<IconLogout />} component="a" href="/logout" c="red.8">
                Wyloguj się
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Group>
        <Group hiddenFrom="md">
          <Button
            component="a"
            href="/account/items?view=list&page=1"
            variant="default"
            leftSection={<IconListDetails />}
            fullWidth
          >
            Moje ogłoszenia
          </Button>
          <Button
            component="a"
            href="/chats"
            variant="default"
            leftSection={<IconMessage />}
            rightSection={<UnreadMessagesBadge />}
            fullWidth
          >
            Moje rozmowy
          </Button>
          <Button component="a" href="/account/settings" variant="default" leftSection={<IconSettings />} fullWidth>
            Ustawienia
          </Button>
          <Button component="a" href="/logout" variant="default" leftSection={<IconLogout />} fullWidth c="red.8">
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
