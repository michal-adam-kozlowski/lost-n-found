"use client";

import { Container } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import TypePicker from "@components/TypePicker";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Container size="xs" px="md">
        <TypePicker
          value={pathname.startsWith("/found-items") ? "found" : "lost"}
          onChange={(value) => router.push(value === "found" ? "/found-items" : "/lost-items")}
          classNames={{
            root: "bg-white!",
          }}
        />
      </Container>

      {children}
    </>
  );
}
