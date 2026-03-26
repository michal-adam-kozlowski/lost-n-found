"use server";

import { updateTag } from "next/cache";
import { itemsApi } from "@/lib/api";

export async function addItem(item: Parameters<typeof itemsApi.apiItemsPost>[0]["createItemRequest"]) {
  try {
    const itemRes = await itemsApi.apiItemsPost({
      createItemRequest: item,
    });
    updateTag("items");
    return { success: true, item: itemRes } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
}
