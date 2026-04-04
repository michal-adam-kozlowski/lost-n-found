"use client";

import { ActionIcon, Container, Modal } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";

export default function ItemModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialPathname = useRef(pathname);
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    if (pathname !== initialPathname.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpened(false);
    }
  }, [pathname, router]);

  return (
    <Modal
      opened={opened}
      onClose={() => router.back()}
      size="auto"
      centered
      removeScrollProps={{ enabled: false }}
      className="maplibre-modal-ignore"
      withCloseButton={false}
      styles={{
        content: {
          borderRadius: "var(--mantine-radius-md)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
        body: {
          padding: "var(--mantine-spacing-xl) var(--mantine-spacing-xs) var(--mantine-spacing-xl)",
          height: "calc(100% - 60px)",
          maxHeight: "calc(100% - 60px)",
          overflowY: "scroll",
        },
      }}
    >
      <ActionIcon
        pos="absolute"
        className="z-40"
        top={12}
        right={20}
        size="lg"
        variant="default"
        onClick={() => router.back()}
      >
        <IconX />
      </ActionIcon>
      <Container size="lg">{children}</Container>
    </Modal>
  );
}
