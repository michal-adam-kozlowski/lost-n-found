import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/actions/auth";

const pathsRequireAuth = ["/add"];
const pathsRequireNoAuth = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  for (const path of pathsRequireAuth) {
    if (request.nextUrl.pathname.startsWith(path)) {
      const user = await getCurrentUser();
      if (!user) {
        const returnPath = request.nextUrl.pathname + request.nextUrl.search;
        return Response.redirect(new URL(`/login?return=${returnPath}`, request.url));
      }
    }
  }
  for (const path of pathsRequireNoAuth) {
    if (request.nextUrl.pathname.startsWith(path)) {
      const user = await getCurrentUser();
      if (user) {
        return Response.redirect(new URL("/", request.url));
      }
    }
  }
}
