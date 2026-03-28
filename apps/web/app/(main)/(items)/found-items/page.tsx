import MapList from "@components/maps/MapList";
import { itemsApi } from "@/lib/api";
import { cacheTag } from "next/cache";
import ItemsList from "@components/items/ItemsList";
import ItemPopup from "@components/items/ItemPopup";
import { runtimeCacheLife, runtimeGet } from "@/lib/utils/data";

export default async function ItemsPage() {
  "use cache";

  cacheTag("items");
  runtimeCacheLife("hours");

  const items = (await runtimeGet(() => itemsApi.apiItemsGet(), [])).filter((item) => item.type === "found");

  const markers = items.map((item, index) => ({
    key: index,
    latitude: (item.latitude as number) ?? 0,
    longitude: (item.longitude as number) ?? 0,
    data: item,
  }));

  return (
    <>
      <h1>Znalezione</h1>
      <MapList markers={markers} renderPopup={ItemPopup} />
      <ItemsList items={items} />
      <div>{JSON.stringify(items)}</div>
    </>
  );
}
