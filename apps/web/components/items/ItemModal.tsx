"use client";

import { Modal } from "@mantine/core";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

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
      size="lg"
      centered
      removeScrollProps={{ enabled: false }}
      className="maplibre-modal-ignore"
    >
      {children}
    </Modal>
  );
}
