import { AuthApi, Configuration, ErrorContext, ItemsApi } from "@lost-n-found/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface ApiError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

const config = new Configuration({
  basePath: API_URL,
  middleware: [
    {
      async post(context) {
        if (context.response.status >= 400) {
          const data = await context.response.json();
          const error = new Error(context.response.statusText) as ApiError;
          error.data = data;
          throw error;
        }
      },
    },
  ],
});

export const itemsApi = new ItemsApi(config);

export const authApi = new AuthApi(config);
