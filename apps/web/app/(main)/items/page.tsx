import MapList from "@components/maps/MapList";
import ItemsList from "@components/items/ItemsList";
import ItemPopup from "@components/items/ItemPopup";
import { runtimeGet } from "@/lib/utils/data";
import ItemsFilters from "@components/items/ItemsFilters";
import { getFilteredItems } from "@/actions/items";
import { redirect } from "next/navigation";
import { Paper, Text, Title, Group } from "@mantine/core";
import { pluralizePl } from "@/lib/utils/ui";
import ViewControl from "@components/ViewControl";
import LoadingContextOverlay from "@components/layout/LoadingContextOverlay";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : "";
  if (!["found", "lost"].includes(type)) {
    redirect("/items?type=found");
  }
  const categoryId = typeof params.categoryId === "string" ? params.categoryId : undefined;
  const occurredAtFrom = typeof params.occurredAtFrom === "string" ? new Date(params.occurredAtFrom) : null;
  const occurredAtTo = typeof params.occurredAtTo === "string" ? new Date(params.occurredAtTo) : null;
  const occurredAtRange: [Date | null, Date | null] = [occurredAtFrom, occurredAtTo];
  const items = await runtimeGet(() => getFilteredItems(type as "found" | "lost", categoryId, occurredAtRange), []);

  const markers = items.map((item) => ({
    key: item.id,
    latitude: (item.latitude as number) ?? 0,
    longitude: (item.longitude as number) ?? 0,
    data: item,
    color: item.type === "found" ? "var(--mantine-color-green-9)" : "var(--mantine-color-red-9)",
  }));

  let view = typeof params.view === "string" ? params.view : "list";
  if (!["list", "map"].includes(view)) {
    view = "list";
  }

  return (
    <>
      <Paper shadow="xs" className="flex! flex-row gap-4 items-center" p="md" mb="md" pt="sm">
        <ItemsFilters />
      </Paper>
      <Group
        justify="space-between"
        align="center"
        style={{ borderBottom: "calc(.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-3)" }}
        mb="lg"
        pb={8}
      >
        <div>
          <Title order={2} mb={2}>
            Ogłoszenia
          </Title>
          <Text c={"gray.7"} fw={500}>
            {items.length} {pluralizePl(items.length, "wynik", "wyniki", "wyników")}
          </Text>
        </div>
        <ViewControl />
      </Group>
      <LoadingContextOverlay loadingKey="itemsFilters">
        {view === "map" && <MapList markers={markers} renderPopup={ItemPopup} />}
        {view === "list" && <ItemsList items={items} />}
      </LoadingContextOverlay>
    </>
  );
}
