"use server";

import { getToken } from "@/actions/auth";
import { addTokenToInit, itemImagesApi } from "@/lib/api";
import type { DownloadUrlResult, ItemImageSizeBytes, PresignResult } from "@lost-n-found/api-client";
import { updateTag } from "next/cache";

export async function presignImageUpload(
  itemId: string,
  fileName: string,
  contentType: string,
  sizeBytes: number,
): Promise<PresignResult> {
  const token = await getToken();
  return itemImagesApi.apiItemsItemIdImagesPresignPost(
    {
      itemId,
      presignImageRequest: {
        fileName,
        contentType,
        sizeBytes: sizeBytes as ItemImageSizeBytes,
      },
    },
    addTokenToInit(token),
  );
}

export async function confirmImageUpload(itemId: string, imageId: string) {
  const token = await getToken();
  const res = await itemImagesApi.apiItemsItemIdImagesImageIdConfirmPost({ itemId, imageId }, addTokenToInit(token));
  updateTag("items");
  updateTag(`item_${itemId}`);
  return res;
}

export async function getImageDownloadUrl(itemId: string, imageId: string): Promise<DownloadUrlResult> {
  return itemImagesApi.apiItemsItemIdImagesImageIdDownloadUrlGet({ itemId, imageId });
}

export async function getThumbnailDownloadUrl(itemId: string, imageId: string): Promise<DownloadUrlResult> {
  try {
    return await itemImagesApi.apiItemsItemIdImagesImageIdThumbnailUrlGet({ itemId, imageId });
  } catch {
    return itemImagesApi.apiItemsItemIdImagesImageIdDownloadUrlGet({ itemId, imageId });
  }
}

export async function deleteItemImage(itemId: string, imageId: string) {
  const token = await getToken();
  const res = await itemImagesApi.apiItemsItemIdImagesImageIdDelete({ itemId, imageId }, addTokenToInit(token));
  updateTag("items");
  updateTag(`item_${itemId}`);
  return res;
}
