"use server";

import { cacheTag, updateTag } from "next/cache";
import { addTokenToInit, itemsApi } from "@/lib/api";
import { getToken } from "@/actions/auth";
import { runtimeCacheLife } from "@/lib/utils/data";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import dayjs from "dayjs";

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
  type: ItemsViewOptions["type"],
  categoryIds?: ItemsViewOptions["categoryIds"],
  occurredAtRange?: ItemsViewOptions["occurredAtRange"],
  page?: ItemsViewOptions["page"],
  createdByCurrentUser?: boolean,
): Promise<{ items: Awaited<ReturnType<typeof itemsApi.apiItemsGet>>; pageCount: number; totalCount: number }> {
  "use cache";

  cacheTag("items");
  runtimeCacheLife("hours");

  const PAGE_SIZE = 20;

  try {
    const items = await itemsApi.apiItemsGet({
      type: type,
      categoryIds: categoryIds,
      occurredAtFrom: occurredAtRange?.[0] ? dayjs(occurredAtRange[0]).startOf("day").format("YYYY-MM-DD") : undefined,
      occurredAtTo: occurredAtRange?.[1] ? dayjs(occurredAtRange[1]).endOf("day").format("YYYY-MM-DD") : undefined,
      mine: createdByCurrentUser,
    });
    if (page) {
      const pageCount = Math.ceil(items.length / PAGE_SIZE);
      const paginatedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      return { items: paginatedItems, pageCount, totalCount: items.length };
    }
    return { items: items, pageCount: 1, totalCount: items.length };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { items: [], pageCount: 0, totalCount: 0 };
  }
}
