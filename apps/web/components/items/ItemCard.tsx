import { ItemResponse } from "@lost-n-found/api-client";
import { Optional } from "@/lib/utils/types";
import { Card, CardSection, Text, Badge } from "@mantine/core";
import React from "react";
import ImagesViewer from "@components/ImagesViewer";
import Link from "next/link";

export default function ItemCard({ item }: Readonly<{ item: Optional<ItemResponse, "id" | "createdAt"> }>) {
  const images: string[] = [];

  return (
    <Card p="md" shadow="xs" className="min-w-xs max-w-xs">
      <CardSection p="md" pb="sm">
        <ImagesViewer images={images} height={200} emptyPlaceholder="Zdjęcie przedmiotu" />
      </CardSection>

      <Link
        href={item.id ? `/items/${item.id}` : "#"}
        className={item.id ? "cursor-pointer" : "cursor-default"}
        prefetch={true}
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
