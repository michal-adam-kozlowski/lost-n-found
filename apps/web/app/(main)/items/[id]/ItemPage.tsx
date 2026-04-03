import { cacheTag } from "next/cache";
import { runtimeCacheLife } from "@/lib/utils/data";
import { ApiError, itemsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import ItemEditButton from "@/app/(main)/items/[id]/ItemEditButton";
import ItemDeleteButton from "@/app/(main)/items/[id]/ItemDeleteButton";

export default async function ItemPage({ itemId, currentUserId }: { itemId: string; currentUserId?: string | null }) {
  "use cache";

  cacheTag(`item_${itemId}`);
  runtimeCacheLife("hours");

  let item;
  try {
    item = await itemsApi.apiItemsIdGet({ id: itemId });
  } catch (error) {
    if ((error as ApiError).status === 404) {
      notFound();
    }
  }

  if (!item) {
    notFound();
  }

  return (
    <div>
      <ItemEditButton itemUserId={item.createdByUserId} itemId={item.id} currentUserId={currentUserId} />
      <ItemDeleteButton itemUserId={item.createdByUserId} itemId={item.id} currentUserId={currentUserId} />
      {JSON.stringify(item, null, 2)}
    </div>
  );
}
