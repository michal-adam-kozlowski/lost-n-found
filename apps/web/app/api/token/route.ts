import { getCurrentUser, getToken } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }
  const user = await getCurrentUser();
  return NextResponse.json({ token, user });
}
