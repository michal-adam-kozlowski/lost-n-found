"use server";

import { updateTag } from "next/cache";
import { itemsApi } from "@/lib/api";

export async function addItem(item: {
  title: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
}) {
  await itemsApi.apiItemsPost({
    createItemRequest: item,
  });
  updateTag("items");
}
