import { Center, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconMessages } from "@tabler/icons-react";

export default function Page() {
  return (
    <Center flex={1} h="100%">
      <Stack align="center" gap="xs" c="dimmed">
        <ThemeIcon size={64} variant="light" color="gray" radius="xl">
          <IconMessages size={32} />
        </ThemeIcon>
        <Text fw={500}>Wybierz rozmowę</Text>
        <Text size="sm">Kliknij rozmowę po lewej stronie, aby ją otworzyć.</Text>
      </Stack>
    </Center>
  );
}
