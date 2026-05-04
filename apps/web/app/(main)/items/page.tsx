import MapList from "@components/maps/MapList";
import ItemsList from "@components/items/ItemsList";
import ItemPopup from "@components/items/ItemPopup";
import { runtimeGet } from "@/lib/utils/server";
import { getItems } from "@/actions/items";
import { redirect } from "next/navigation";
import { Paper, Text, Title, Group } from "@mantine/core";
import { pluralizePl } from "@/lib/utils/ui";
import LoadingContextOverlay from "@components/layout/LoadingContextOverlay";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import ItemsFilters from "@components/items/ItemsFilters";
import ViewControl from "@components/ViewControl";
import ItemsPagination from "@components/items/ItemsPagination";
import { EMPTY_ITEMS_RESULT, getMarkersForItems } from "@/lib/utils/items";

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
    () => getItems(options.type, options.categoryIds, options.occurredAtRange, options.page, options.locationId),
    EMPTY_ITEMS_RESULT,
  );

  const markers = getMarkersForItems(items);

  return (
    <>
      <Paper shadow="xs" p="md" mb="md" pt="sm">
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
        {options.view === "map" && (
          <MapList markers={markers} renderPopup={ItemPopup} locationId={options.locationId} />
        )}
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
