"use server";

import { addTokenToInit, adminApi } from "@/lib/api";
import { getToken } from "@/actions/auth";
import { updateTag } from "next/cache";

export async function blockUser(userId: string) {
  const token = await getToken();
  await adminApi.apiAdminUsersUserIdBlockPost({ userId }, addTokenToInit(token));
}

export async function unblockUser(userId: string) {
  const token = await getToken();
  await adminApi.apiAdminUsersUserIdUnblockPost({ userId }, addTokenToInit(token));
}

export async function deleteItemFromAdmin(itemId: string) {
  const token = await getToken();
  await adminApi.apiAdminItemsItemIdDelete({ itemId }, addTokenToInit(token));
  updateTag("items");
  updateTag(`item_${itemId}`);
}
