import { addTokenToInit, adminApi, itemsApi } from "@/lib/api";
import ItemsTable from "@/app/admin/items/ItemsTable";
import { connection } from "next/server";
import { getToken } from "@/actions/auth";

export default async function Page() {
  await connection();
  const token = await getToken();
  const users = await adminApi.apiAdminUsersGet(addTokenToInit(token));
  const items = await itemsApi.apiItemsGet({});

  return <ItemsTable items={items} users={users} />;
}
