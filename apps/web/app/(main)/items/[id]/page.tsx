import { ApiError, itemsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { cacheTag } from "next/cache";
import { runtimeCacheLife } from "@/lib/utils/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  "use cache";

  const { id } = await params;

  cacheTag(`item_${id}`);
  runtimeCacheLife("hours");

  let item;
  try {
    item = await itemsApi.apiItemsIdGet({ id });
  } catch (error) {
    if ((error as ApiError).status === 404) {
      console.log("AAAAAA");
      notFound();
    }
  }

  return <div>{JSON.stringify(item, null, 2)}</div>;
}
