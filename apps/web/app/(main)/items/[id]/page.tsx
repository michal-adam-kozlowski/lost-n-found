import { ApiError, itemsApi } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let item;
  try {
    item = await itemsApi.apiItemsIdGet({ id });
    console.log("item", item);
  } catch (error) {
    if ((error as ApiError).status === 404) {
      console.log("AAAAAA");
      notFound();
    }
  }

  return <div>{JSON.stringify(item, null, 2)}</div>;
}
