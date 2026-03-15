import { connection } from "next/server";
import MapList from "@components/MapList";
import { getItems } from "@/lib/api";

export default async function ItemsPage() {
  await connection();
  const items = (await getItems()).filter((item) => item.type === "lost");

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
