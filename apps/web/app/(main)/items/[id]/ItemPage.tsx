import { cacheTag } from "next/cache";
import { runtimeCacheLife } from "@/lib/utils/data";
import { ApiError, itemsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { getMarkersForItems } from "@/lib/utils/items";
import ItemImagesGallery from "@components/items/ItemImagesGallery";
import LocationViewer from "@components/maps/LocationViewer";
import { Badge, Box, Group, Stack, Title, Text, Card, CardSection, Button } from "@mantine/core";
import React from "react";
import dayjs from "dayjs";
import ItemEditButton from "@/app/(main)/items/[id]/ItemEditButton";
import ItemDeleteButton from "@/app/(main)/items/[id]/ItemDeleteButton";
import { IconMessage } from "@tabler/icons-react";

export default async function ItemPage({ itemId, currentUserId }: { itemId: string; currentUserId?: string | null }) {
  "use cache";

  cacheTag(`item_${itemId}`);
  runtimeCacheLife("hours");

  let item;
  try {
    item = await itemsApi.apiItemsIdGet({ id: itemId });
  } catch (error) {
    if ((error as ApiError).status === 404) {
      notFound();
    }
  }

  if (!item) {
    notFound();
  }

  const occurredAt = dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY");
  const createdAt = dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY");

  const marker = getMarkersForItems([item])[0];

  return (
    <Stack gap="lg" w="100vw" maw="100%">
      <Group wrap="wrap" gap="lg" align="stretch">
        <Card className="basis-sm grow shrink sm:shrink-0" radius="sm" withBorder p="md">
          <CardSection flex={1} p="md" py="lg" withBorder>
            <Badge color={item.type === "lost" ? "red" : "green"} variant="light" mb={10} size="lg">
              {item.type === "lost" ? "Zgubione" : "Znalezione"}
            </Badge>
            <Title order={2} mb={10}>
              {item.title}
            </Title>
            <Text c="gray.7" fw={700} mt={4}>
              {item.categoryId}
            </Text>
            {item.locationLabel && (
              <Text c="gray.7" mt={4}>
                Opis lokalizacji:{" "}
                <Text fw={700} component="span">
                  {item.locationLabel}
                </Text>
              </Text>
            )}
            <Text c="gray.7" mt={4}>
              {item.type === "lost" ? "Zgubiono: " : "Znaleziono: "}
              <Text fw={700} component="span">
                {occurredAt}
              </Text>
            </Text>
            <Text c="gray.7" className="whitespace-pre-wrap" fz={15} mt={10}>
              {item.description}
            </Text>
          </CardSection>
          <CardSection withBorder p="md" className="flex! gap-4 justify-end items-center! flex-wrap">
            {item.createdByUserId == currentUserId ? (
              <>
                <Text flex={1} c="gray.7" component="span">
                  Utworzono:{" "}
                  <Text fw={700} component="span" className="whitespace-nowrap">
                    {createdAt}
                  </Text>
                </Text>
                <Group gap="md">
                  <ItemEditButton itemUserId={item.createdByUserId} itemId={item.id} currentUserId={currentUserId} />
                  <ItemDeleteButton itemUserId={item.createdByUserId} itemId={item.id} currentUserId={currentUserId} />
                </Group>
              </>
            ) : (
              <Group gap="md">
                <Button leftSection={<IconMessage />}>Skontaktuj się</Button>
              </Group>
            )}
          </CardSection>
        </Card>
        <Box className="basis-sm grow shrink h-100 max-h-[min(400px,calc(100vw-var(--mantine-spacing-md)*2))]">
          <ItemImagesGallery itemId={item.id} imageIds={item.imageIds} />
        </Box>
      </Group>
      <LocationViewer marker={marker} />
    </Stack>
  );
}
