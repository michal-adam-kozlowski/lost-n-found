"use server";

import { updateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function addItem(item: {
  title: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
}) {
  await fetch(`${API_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...item,
    }),
  });
  updateTag("items");
}
