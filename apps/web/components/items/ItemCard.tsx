"use client";

import { ItemResponse } from "@lost-n-found/api-client";
import { Optional } from "@/lib/utils/types";
import { Card, CardSection, Text, Badge, CardProps } from "@mantine/core";
import React from "react";
import ImagesViewer, { LoadedImage } from "@components/images/ImagesViewer";
import Link from "next/link";
import { useItemImageUrls } from "@/lib/hooks/useItemImageUrls";

export default function ItemCard({
  item,
  small,
  cardProps,
  loadedImageUrls,
}: Readonly<{
  item: Optional<ItemResponse, "id" | "createdAt">;
  small?: boolean;
  cardProps?: CardProps;
  loadedImageUrls?: string[];
}>) {
  const imageIds = (item.images ?? []).map((img) => img.id);
  // eslint-disable-next-line prefer-const
  let { urls: imageUrls, loading: imagesLoading } = useItemImageUrls(item.id, imageIds, "thumbnail");
  let images: LoadedImage[] = item.images.map((image, index) => ({
    url: imageUrls[index],
    blurDataUrl: image.blurDataUrl ?? undefined,
  }));
  if (loadedImageUrls) {
    images = loadedImageUrls.map((url) => ({ url: url }));
  }

  return (
    <Card p="md" shadow="xs" className={small ? "min-w-2xs max-w-2xs" : "min-w-xs max-w-xs"} {...cardProps}>
      <CardSection p="md" pb="sm">
        <ImagesViewer
          images={images}
          loading={imagesLoading}
          height={small ? 160 : 190}
          emptyPlaceholder="Zdjęcie przedmiotu"
        />
      </CardSection>

      <Link
        href={item.id ? `/items/${item.id}/preview` : "#"}
        className={item.id ? "cursor-pointer" : "cursor-default"}
        prefetch={false}
        scroll={false}
      >
        <Badge color={item.type === "lost" ? "red" : "green"} variant="light" mb={6}>
          {item.type === "lost" ? "Zgubione" : "Znalezione"}
        </Badge>

        <Text fw={600} fz="lg" mb={4} truncate={"end"}>
          {item.title}
        </Text>

        <Text fw={700} fz="sm" c="dimmed" mb={4} truncate={"end"}>
          {item.locationLabel}
          {item.locationLabel && item.occurredAt && " • "}
          {item.occurredAt}
        </Text>

        <Text fw={350} fz="sm" c="dimmed" lineClamp={2}>
          {item.description}
        </Text>
      </Link>
    </Card>
  );
}
