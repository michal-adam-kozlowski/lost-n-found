"use client";

import { useItemImageUrls } from "@/lib/hooks/useItemImageUrls";
import ImagesViewer from "@components/ImagesViewer";
import React from "react";

export default function ItemImagesGallery({
  itemId,
  imageIds,
}: Readonly<{
  itemId: string;
  imageIds?: string[];
}>) {
  const images = useItemImageUrls(itemId, imageIds ?? []);

  return <ImagesViewer images={images} height={"100%"} emptyPlaceholder="Zdjęcie przedmiotu" />;
}
