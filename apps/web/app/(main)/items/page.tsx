import MapList from "@components/maps/MapList";
import ItemsList from "@components/items/ItemsList";
import ItemPopup from "@components/items/ItemPopup";
import { runtimeGet } from "@/lib/utils/data";
import { getPaginatedFilteredItems } from "@/actions/items";
import { redirect } from "next/navigation";
import { Paper, Text, Title, Group } from "@mantine/core";
import { pluralizePl } from "@/lib/utils/ui";
import LoadingContextOverlay from "@components/layout/LoadingContextOverlay";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import ItemsFilters from "@components/items/ItemsFilters";
import ViewControl from "@components/ViewControl";
import ItemsPagination from "@components/items/ItemsPagination";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const options = ItemsViewOptions.fromObject(params);
  const validation = options.validate();
  if (!validation.valid) {
    redirect(validation.redirect);
  }
  const { items, pageCount, totalCount } = await runtimeGet(
    () => getPaginatedFilteredItems(options.type, options.categoryIds, options.occurredAtRange, options.page),
    {
      items: [],
      pageCount: 0,
      totalCount: 0,
    },
  );

  const markers = items
    .filter((item) => item.longitude && item.latitude)
    .map((item) => ({
      key: item.id,
      latitude: (item.latitude as number) ?? 0,
      longitude: (item.longitude as number) ?? 0,
      data: item,
      color: item.type === "found" ? "var(--mantine-color-green-9)" : "var(--mantine-color-red-9)",
    }));

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
            {totalCount} {pluralizePl(items.length, "wynik", "wyniki", "wyników")}
          </Text>
        </div>
        <ViewControl />
      </Group>
      <LoadingContextOverlay loadingKey="itemsFilters">
        {options.view === "map" && <MapList markers={markers} renderPopup={ItemPopup} />}
        {options.view === "list" && (
          <>
            <ItemsList items={items} />
            <ItemsPagination pageCount={pageCount} page={options.page} />
          </>
        )}
      </LoadingContextOverlay>
    </>
  );
}
