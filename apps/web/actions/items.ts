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

export async function getPaginatedFilteredItems(
  type: "found" | "lost" | null,
  categoryId?: string,
  occurredAtRange?: [Date | null, Date | null],
  createdByUserId?: string,
  page?: number,
): Promise<{ items: Awaited<ReturnType<typeof itemsApi.apiItemsGet>>; pageCount: number; totalCount: number }> {
  "use cache";

  cacheTag("items");
  runtimeCacheLife("hours");

  const PAGE_SIZE = 20;

  try {
    const items = await itemsApi.apiItemsGet();
    const filteredItems = items.filter((item) => {
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
    if (page) {
      const pageCount = Math.ceil(filteredItems.length / PAGE_SIZE);
      const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return { items: paginatedItems, pageCount, totalCount: filteredItems.length };
    }
    return { items: filteredItems, pageCount: 1, totalCount: filteredItems.length };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { items: [], pageCount: 0, totalCount: 0 };
  }
}
