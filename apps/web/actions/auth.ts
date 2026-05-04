"use server";

import { ApiError, authApi } from "@/lib/api";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function saveToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return null;
  }
  const data = jwt.decode(token);
  if (typeof data !== "object" || !data) {
    return null;
  }
  const expires = data.exp;
  if (expires && expires * 1000 < Date.now()) {
    return null;
  }
  const rolesData = data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const roles = Array.isArray(rolesData) ? rolesData : [rolesData];
  return {
    email: data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string,
    id: data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string,
    roles,
  };
}

export async function currentUserHasRole(role: string) {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return user.roles.includes(role);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

type AuthResponse = { success: true } | { success: false; errors: string[] | Record<string, string[]> };

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await authApi.apiAuthLoginPost({
      loginUserRequest: {
        email: email,
        password: password,
      },
    });
    await saveToken(res.accessToken);
    return { success: true };
  } catch (e) {
    const error = (e as ApiError).data;
    if (!error) {
      throw e;
    }
    if (error.detail) {
      return { success: false, errors: [error.detail] };
    }
    return { success: false, errors: error.errors };
  }
}

export async function register(email: string, password: string) {
  try {
    const res = await authApi.apiAuthRegisterPost({
      registerUserRequest: {
        email: email,
        password: password,
      },
    });
    await saveToken(res.accessToken);
    return { success: true };
  } catch (e) {
    const error = (e as ApiError).data;
    if (!error) {
      throw e;
    }
    return { success: false, errors: error.errors };
  }
}
