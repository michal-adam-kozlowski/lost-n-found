import { ItemResponse } from "@lost-n-found/api-client";
import { InteractiveMarker } from "@components/maps/CustomMap";
import { itemsApi } from "@/lib/api";

export type PaginatedItemsResult = {
  items: Awaited<ReturnType<typeof itemsApi.apiItemsGet>>;
  pageCount: number;
  totalCount: number;
};

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
      color: item.type === "found" ? "var(--mantine-color-green-7)" : "var(--mantine-color-red-7)",
    }));
}
