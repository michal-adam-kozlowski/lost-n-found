import { AuthApi, CategoriesApi, Configuration, InitOverrideFunction, ItemsApi } from "@lost-n-found/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface ApiError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function addTokenToInit(token?: string | null) {
  const fn: InitOverrideFunction = async ({ init }) => {
    if (token) {
      return {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return init;
  };
  return fn;
}

const config = new Configuration({
  basePath: API_URL,
  middleware: [
    {
      async post(context) {
        console.log(`Finished API request to ${context.url} with status ${context.response.status}`);
        if (context.response.status >= 400) {
          const text = await context.response.text();
          const error = new Error(context.response.statusText) as ApiError;
          error.status = context.response.status;
          try {
            error.data = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse error response", e);
          }
          throw error;
        }
      },
    },
  ],
});

export const itemsApi = new ItemsApi(config);

export const authApi = new AuthApi(config);

export const categoriesApi = new CategoriesApi(config);
