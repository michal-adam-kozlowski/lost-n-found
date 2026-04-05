"use client";

import { useItemImageUrls } from "@/lib/hooks/useItemImageUrls";
import ImagesViewer, { LoadedImage } from "@components/images/ImagesViewer";
import React from "react";
import { ItemImageInfo } from "@lost-n-found/api-client";

export default function ItemImagesGallery({
  itemId,
  itemImages,
}: Readonly<{
  itemId: string;
  itemImages: ItemImageInfo[];
}>) {
  const imageIds = itemImages.map((image) => image.id);
  const { urls: imageUrls, loading: imagesLoading } = useItemImageUrls(itemId, imageIds ?? []);
  const images: LoadedImage[] = itemImages.map((image, index) => ({
    url: imageUrls[index],
    blurDataUrl: image.blurDataUrl ?? undefined,
  }));

  return <ImagesViewer images={images} loading={imagesLoading} height={"100%"} emptyPlaceholder="Zdjęcie przedmiotu" />;
}
