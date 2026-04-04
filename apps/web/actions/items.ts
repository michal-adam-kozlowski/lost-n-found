"use server";

import { cacheTag, updateTag } from "next/cache";
import { addTokenToInit, itemsApi } from "@/lib/api";
import { getToken } from "@/actions/auth";
import { runtimeCacheLife } from "@/lib/utils/data";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import { EMPTY_ITEMS_RESULT, PaginatedItemsResult, paginateItems } from "@/lib/utils/items";

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

export async function deleteItem(id: string) {
  try {
    const token = await getToken();
    await itemsApi.apiItemsIdDelete({ id }, addTokenToInit(token));
    updateTag("items");
    updateTag(`item_${id}`);
    return { success: true } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
}

export async function getItems(
  type?: ItemsViewOptions["type"],
  categoryIds?: ItemsViewOptions["categoryIds"],
  occurredAtRange?: ItemsViewOptions["occurredAtRange"],
  page?: ItemsViewOptions["page"],
): Promise<PaginatedItemsResult> {
  "use cache";
  cacheTag("items");
  runtimeCacheLife("hours");

  try {
    const occurredAtRangeFormatted = occurredAtRange ? ItemsViewOptions.formatDateRange(occurredAtRange) : null;

    const items = await itemsApi.apiItemsGet({
      type,
      categoryIds,
      occurredAtFrom: occurredAtRangeFormatted?.[0] ?? undefined,
      occurredAtTo: occurredAtRangeFormatted?.[1] ?? undefined,
      mine: false,
    });
    return paginateItems(items, page);
  } catch (error) {
    console.error("Error fetching items:", error);
    return EMPTY_ITEMS_RESULT;
  }
}

export async function getItemsForCurrentUser(
  type?: ItemsViewOptions["type"],
  categoryIds?: ItemsViewOptions["categoryIds"],
  occurredAtRange?: ItemsViewOptions["occurredAtRange"],
  page?: ItemsViewOptions["page"],
): Promise<PaginatedItemsResult> {
  try {
    const token = await getToken();
    const occurredAtRangeFormatted = occurredAtRange ? ItemsViewOptions.formatDateRange(occurredAtRange) : null;
    const items = await itemsApi.apiItemsGet(
      {
        type,
        categoryIds,
        occurredAtFrom: occurredAtRangeFormatted?.[0] ?? undefined,
        occurredAtTo: occurredAtRangeFormatted?.[1] ?? undefined,
        mine: true,
      },
      addTokenToInit(token),
    );
    return paginateItems(items, page);
  } catch (error) {
    console.error("Error fetching items:", error);
    return EMPTY_ITEMS_RESULT;
  }
}
