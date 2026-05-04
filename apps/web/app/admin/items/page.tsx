import { itemsApi } from "@/lib/api";
import ItemsTable from "@/app/admin/items/ItemsTable";
import { connection } from "next/server";

export default async function Page() {
  await connection();
  const items = await itemsApi.apiItemsGet({});

  return <ItemsTable items={items} />;
}
