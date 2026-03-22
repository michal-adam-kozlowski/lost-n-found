"use client";

import { useDisclosure } from "@mantine/hooks";
import { Burger, Divider, Drawer } from "@mantine/core";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AppHeaderDrawer({ children }: Readonly<{ children?: React.ReactNode }>) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  return (
    <>
      <Burger opened={drawerOpened} onClick={toggleDrawer} />
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="sm"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Divider mb="sm" mx="-md" />
        {children}
      </Drawer>
    </>
  );
}
