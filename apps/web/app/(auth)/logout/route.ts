import { logout } from "@/actions/auth";

export async function GET() {
  await logout();
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login?loggedOut=true",
    },
  });
}
