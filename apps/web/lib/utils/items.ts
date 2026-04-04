import { ItemResponse } from "@lost-n-found/api-client";
import { InteractiveMarker } from "@components/maps/CustomMap";
import { itemsApi } from "@/lib/api";

export type PaginatedItemsResult = {
  items: Awaited<ReturnType<typeof itemsApi.apiItemsGet>>;
  pageCount: number;
  totalCount: number;
};

const PAGE_SIZE = 20;

export function paginateItems<T>(items: T[], page?: number): { items: T[]; pageCount: number; totalCount: number } {
  if (!page) return { items, pageCount: 1, totalCount: items.length };
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  return { items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), pageCount, totalCount: items.length };
}

export const EMPTY_ITEMS_RESULT: PaginatedItemsResult = { items: [], pageCount: 0, totalCount: 0 };

export function getMarkersForItems(items: ItemResponse[]): InteractiveMarker<ItemResponse>[] {
  if (!items || !items.length) return [];
  return items
    .filter((item) => item.longitude && item.latitude)
    .map((item) => ({
      key: item.id,
      latitude: (item.latitude as number) ?? 0,
      longitude: (item.longitude as number) ?? 0,
      data: item,
      color: item.type === "found" ? "var(--mantine-color-green-9)" : "var(--mantine-color-red-9)",
    }));
}
