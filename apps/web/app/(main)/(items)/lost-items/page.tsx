import MapList from "@components/maps/MapList";
import { itemsApi } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";

export default async function ItemsPage() {
  "use cache";

  cacheTag("items");
  cacheLife("hours");

  const items = (await itemsApi.apiItemsGet()).filter((item) => item.type === "lost");

  const markers = items.map((item, index) => ({
    key: index,
    latitude: (item.latitude as number) ?? 0,
    longitude: (item.longitude as number) ?? 0,
  }));

  return (
    <>
      <h1>Zgubione</h1>
      <MapList markers={markers} />
      <div>{JSON.stringify(items)}</div>
    </>
  );
}
