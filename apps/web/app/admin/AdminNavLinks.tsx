"use client";

import { usePathname } from "next/navigation";
import { IconListDetails, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { Box, NavLink } from "@mantine/core";

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <Box className="flex flex-row gap-2">
      <Link href="/admin/items" prefetch={false}>
        <NavLink
          variant="filled"
          active={pathname === "/admin/items"}
          leftSection={<IconListDetails />}
          label="Ogłoszenia"
          component="span"
          color="black"
          className="rounded-xl"
        />
      </Link>
      <Link href="/admin/users" prefetch={false}>
        <NavLink
          variant="filled"
          active={pathname === "/admin/users"}
          leftSection={<IconUsers />}
          label="Użytkownicy"
          component="span"
          color="black"
          className="rounded-xl"
        />
      </Link>
    </Box>
  );
}
