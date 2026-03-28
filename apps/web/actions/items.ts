"use server";

import { updateTag } from "next/cache";
import { addTokenToInit, itemsApi } from "@/lib/api";
import { getToken } from "@/actions/auth";

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
