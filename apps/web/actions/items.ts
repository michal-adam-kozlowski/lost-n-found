"use server";

import { cacheTag, updateTag } from "next/cache";
import { addTokenToInit, itemsApi } from "@/lib/api";
import { getToken } from "@/actions/auth";
import { runtimeCacheLife } from "@/lib/utils/data";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";

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

type PaginatedResult = {
  items: Awaited<ReturnType<typeof itemsApi.apiItemsGet>>;
  pageCount: number;
  totalCount: number;
};

const EMPTY_RESULT: PaginatedResult = { items: [], pageCount: 0, totalCount: 0 };
const PAGE_SIZE = 20;

function paginate<T>(items: T[], page?: number): { items: T[]; pageCount: number; totalCount: number } {
  if (!page) return { items, pageCount: 1, totalCount: items.length };
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  return { items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), pageCount, totalCount: items.length };
}

export async function getPaginatedFilteredItems(
  type?: ItemsViewOptions["type"],
  categoryIds?: ItemsViewOptions["categoryIds"],
  occurredAtRange?: ItemsViewOptions["occurredAtRange"],
  page?: ItemsViewOptions["page"],
): Promise<PaginatedResult> {
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
    return paginate(items, page);
  } catch (error) {
    console.error("Error fetching items:", error);
    return EMPTY_RESULT;
  }
}

export async function getPaginatedFilteredItemsForCurrentUser(
  type?: ItemsViewOptions["type"],
  categoryIds?: ItemsViewOptions["categoryIds"],
  occurredAtRange?: ItemsViewOptions["occurredAtRange"],
  page?: ItemsViewOptions["page"],
): Promise<PaginatedResult> {
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
    return paginate(items, page);
  } catch (error) {
    console.error("Error fetching items:", error);
    return EMPTY_RESULT;
  }
}
