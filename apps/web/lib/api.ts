import { Configuration, ItemsApi } from "@lost-n-found/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const config = new Configuration({
  basePath: API_URL,
});

export const itemsApi = new ItemsApi(config);
