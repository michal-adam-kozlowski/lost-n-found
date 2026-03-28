import { ApiError, itemsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import EditItemPage from "@/app/(main)/items/[id]/edit/EditItemPage";
import { getCurrentUser } from "@/actions/auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const { id } = await params;

  let item;
  try {
    item = await itemsApi.apiItemsIdGet({ id });
  } catch (error) {
    if ((error as ApiError).status === 404) {
      notFound();
    }
  }
  if (!item) {
    notFound();
  }

  const user = await getCurrentUser();

  if (item.createdByUserId !== user?.id) {
    notFound();
  }

  return <EditItemPage item={item} />;
}
