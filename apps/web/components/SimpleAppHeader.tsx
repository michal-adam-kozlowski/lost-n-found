import { Container, Group } from "@mantine/core";
import Logo from "@components/Logo";
import React from "react";
import Link from "next/link";

export function SimpleAppHeader() {
  return (
    <Container size="lg" h="100%" px="0">
      <Group h="100%" justify="space-between">
        <Link href="/">
          <Logo />
        </Link>
      </Group>
    </Container>
  );
}
