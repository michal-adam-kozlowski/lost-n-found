import { Configuration, ItemsApi } from "@lost-n-found/api-client";
import { cacheLife, cacheTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const config = new Configuration({
  basePath: API_URL,
});

export const itemsApi = new ItemsApi(config);

// TODO: replace with generated type once backend adds response schemas to OpenAPI
export interface Item {
  type: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

// TODO: simplify to itemsApi.apiItemsGet() once response schemas exist
export async function getItems(): Promise<Item[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("items");

  const response = await itemsApi.apiItemsGetRaw();
  return response.raw.json() as Promise<Item[]>;
}
