import { cacheLife, cacheTag } from "next/cache";
import MapList from "@components/MapList";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default async function ItemsPage() {
  "use cache";

  cacheLife("hours");
  cacheTag("items");
  const items = (
    await fetch(`${API_URL}/api/items`).then((r) => {
      return r.json() as Promise<{ type: string; latitude: number; longitude: number }[]>;
    })
  ).filter((item) => item.type === "lost");

  const markers = items.map((item, index) => ({
    key: index,
    latitude: item.latitude,
    longitude: item.longitude,
  }));

  return (
    <>
      <h1>Zgubione</h1>
      <MapList markers={markers} />
      <div>{JSON.stringify(items)}</div>
    </>
  );
}
