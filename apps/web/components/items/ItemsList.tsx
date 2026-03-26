import { ItemResponse } from "@lost-n-found/api-client";
import ItemCard from "@components/items/ItemCard";
import dayjs from "dayjs";

export default function ItemsList({ items }: Readonly<{ items: ItemResponse[] }>) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <ItemCard
          item={{ ...item, occurredAt: dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY") }}
          key={item.id}
        />
      ))}
    </div>
  );
}
