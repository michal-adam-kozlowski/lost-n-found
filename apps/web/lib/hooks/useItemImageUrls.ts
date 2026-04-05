"use client";

import { useEffect, useState } from "react";
import { getImageDownloadUrl, getThumbnailDownloadUrl } from "@/actions/images";

type ImageUrlVariant = "original" | "thumbnail";

export function useItemImageUrls(
  itemId: string | undefined,
  imageIds: string[],
  variant: ImageUrlVariant = "original",
): { urls: string[]; loading: boolean } {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrl = variant === "thumbnail" ? getThumbnailDownloadUrl : getImageDownloadUrl;

  useEffect(() => {
    if (!itemId || imageIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrls([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(imageIds.map((imageId) => fetchUrl(itemId, imageId)))
      .then((results) => {
        if (!cancelled) {
          setUrls(results.map((r) => r.downloadUrl));
        }
      })
      .catch((err) => {
        console.error("Failed to load image URLs", err);
        if (!cancelled) setUrls([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId, imageIds.join(","), variant]);

  return { urls, loading };
}
