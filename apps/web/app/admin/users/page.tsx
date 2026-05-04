import { connection } from "next/server";
import { addTokenToInit, adminApi } from "@/lib/api";
import UsersTable from "@/app/admin/users/UsersTable";
import { getToken } from "@/actions/auth";

export default async function Page() {
  await connection();
  const token = await getToken();
  const users = await adminApi.apiAdminUsersGet(addTokenToInit(token));

  return <UsersTable users={users} />;
}
