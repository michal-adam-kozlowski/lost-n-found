import { ItemResponse } from "@lost-n-found/api-client";
import ItemCard from "@components/items/ItemCard";
import dayjs from "dayjs";
import { Text } from "@mantine/core";

export default function ItemsList({ items }: Readonly<{ items: ItemResponse[] }>) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <ItemCard
          item={{ ...item, occurredAt: dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY") }}
          key={item.id}
        />
      ))}
      {items.length === 0 && (
        <div className="w-full py-10 flex flex-col items-center gap-2">
          <Text c="gray.7">Brak ogłoszeń spełniających kryteria</Text>
        </div>
      )}
    </div>
  );
}
