"use client";

import { usePathname } from "next/navigation";
import { IconListDetails, IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { NavLink } from "@mantine/core";

export default function AccountNavLinks() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/account" prefetch={false}>
        <NavLink
          variant="filled"
          active={pathname === "/account"}
          leftSection={<IconUser />}
          label="Mój profil"
          component="span"
          color="black"
          className="rounded-xl"
        />
      </Link>
      <Link href="/account/items?view=list&page=1" prefetch={false}>
        <NavLink
          variant="filled"
          active={pathname === "/account/items"}
          leftSection={<IconListDetails />}
          label="Moje ogłoszenia"
          component="span"
          color="black"
          className="rounded-xl"
        />
      </Link>
      <Link href="/account/settings" prefetch={false}>
        <NavLink
          variant="filled"
          active={pathname === "/account/settings"}
          leftSection={<IconSettings />}
          label="Ustawienia"
          component="span"
          color="black"
          className="rounded-xl"
        />
      </Link>
      <Link href="/logout" prefetch={false}>
        <NavLink
          variant="outline"
          c="red.8"
          leftSection={<IconLogout />}
          label="Wyloguj się"
          component="span"
          className="rounded-xl"
        />
      </Link>
    </>
  );
}
