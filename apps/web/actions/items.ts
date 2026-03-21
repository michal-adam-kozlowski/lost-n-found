"use server";

import { updateTag } from "next/cache";
import { itemsApi } from "@/lib/api";

export async function addItem(item: Parameters<typeof itemsApi.apiItemsPost>[0]["createItemRequest"]) {
  await itemsApi.apiItemsPost({
    createItemRequest: item,
  });
  updateTag("items");
}
