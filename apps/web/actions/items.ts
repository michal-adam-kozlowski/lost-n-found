"use server";

import { cacheTag, updateTag } from "next/cache";
import { addTokenToInit, itemsApi } from "@/lib/api";
import { getToken } from "@/actions/auth";
import { runtimeCacheLife } from "@/lib/utils/data";

export async function addItem(item: Parameters<typeof itemsApi.apiItemsPost>[0]["createItemRequest"]) {
  try {
    const token = await getToken();
    const itemRes = await itemsApi.apiItemsPost({ createItemRequest: item }, addTokenToInit(token));
    updateTag("items");
    return { success: true, item: itemRes } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
}

export async function editItem(id: string, item: Parameters<typeof itemsApi.apiItemsIdPut>[0]["createItemRequest"]) {
  try {
    const token = await getToken();
    const itemRes = await itemsApi.apiItemsIdPut({ id, createItemRequest: item }, addTokenToInit(token));
    updateTag("items");
    updateTag(`item_${id}`);
    return { success: true, item: itemRes } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
}

export async function getFilteredItems(
  type: "found" | "lost" | null,
  categoryId?: string,
  occurredAtRange?: [Date | null, Date | null],
  createdByUserId?: string,
) {
  "use cache";

  cacheTag("items");
  runtimeCacheLife("hours");

  try {
    const items = await itemsApi.apiItemsGet();
    return items.filter((item) => {
      if (createdByUserId && item.createdByUserId !== createdByUserId) return false;
      if (type && item.type !== type) return false;
      if (categoryId && item.categoryId !== categoryId) return false;
      if (occurredAtRange) {
        const occurredAt = new Date(item.occurredAt);
        if (occurredAtRange[0] && occurredAt < occurredAtRange[0]) return false;
        if (occurredAtRange[1] && occurredAt > occurredAtRange[1]) return false;
      }
      return true;
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}
