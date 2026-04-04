"use client";

import { useEffect, useState } from "react";
import { getImageDownloadUrl } from "@/actions/images";

export function useItemImageUrls(itemId: string | undefined, imageIds: string[]): string[] {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!itemId || imageIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrls([]);
      return;
    }

    let cancelled = false;

    Promise.all(imageIds.map((imageId) => getImageDownloadUrl(itemId, imageId)))
      .then((results) => {
        if (!cancelled) {
          setUrls(results.map((r) => r.downloadUrl));
        }
      })
      .catch((err) => {
        console.error("Failed to load image URLs", err);
        if (!cancelled) setUrls([]);
      });

    return () => {
      cancelled = true;
    };
  }, [itemId, imageIds.join(",")]);

  return urls;
}
