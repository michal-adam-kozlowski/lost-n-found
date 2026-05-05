"use client";

import { GetUserResponse, ItemResponse } from "@lost-n-found/api-client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useCategories } from "@/lib/context/CategoriesContext";
import { ActionIcon, Badge, Button, Text, TextInput } from "@mantine/core";
import React, { useState } from "react";
import dayjs from "dayjs";
import { paginate } from "@/lib/utils/data";
import { sortBy } from "lodash";
import Link from "next/link";
import { modals } from "@mantine/modals";
import { deleteItemFromAdmin } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";

const PAGE_SIZE = 20;

export default function ItemsTable({ items, users }: { items: ItemResponse[]; users: GetUserResponse[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ItemResponse>>({
    columnAccessor: "createdAt",
    direction: "desc",
  });
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchId, setSearchId] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const transformedItems = items
    .map((item) => ({
      ...item,
      category: categories.find((c) => c.id === item.categoryId)?.name || "-",
      user: users.find((u) => u.id === item.createdByUserId)?.email || "-",
    }))
    .filter(
      (item) =>
        item.id.includes(searchId) &&
        item.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        item.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
        item.user.toLowerCase().includes(searchUser.toLowerCase()),
    );

  const sortedItems = sortBy(transformedItems, sortStatus.columnAccessor);
  if (sortStatus.direction === "desc") {
    sortedItems.reverse();
  }

  const { items: paginatedItems } = paginate(sortedItems, page, PAGE_SIZE);

  const openDeleteModal = (itemId: string) => {
    modals.openConfirmModal({
      title: "Usunąć ogłoszenie?",
      centered: true,
      children: (
        <Text size="sm">
          Czy na pewno chcesz usunąć to ogłoszenie? <br /> Ta operacja jest nieodwracalna.
        </Text>
      ),
      labels: { confirm: "Usuń", cancel: "Anuluj" },
      confirmProps: { color: "red" },
      groupProps: { justify: "space-between" },
      onCancel: () => {},
      onConfirm: async () => {
        await deleteItemFromAdmin(itemId);
        router.refresh();
      },
    });
  };

  if (categoriesLoading) {
    return null;
  }

  return (
    <DataTable
      minHeight={100}
      noRecordsText={"Nie znaleziono ogłoszeń"}
      noRecordsIcon={<></>}
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped={true}
      shadow="sm"
      totalRecords={items.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      paginationSize="md"
      records={paginatedItems}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      pinLastColumn
      columns={[
        {
          accessor: "id",
          title: "ID",
          width: 340,
          filter: (
            <TextInput
              label="Wyszukaj po ID"
              placeholder="Wpisz ID ogłoszenia"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchId("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchId}
              onChange={(e) => setSearchId(e.currentTarget.value)}
            />
          ),
          filtering: searchId !== "",
        },
        {
          accessor: "category",
          title: "Kategoria",
          width: 200,
          sortable: true,
          filter: (
            <TextInput
              label="Wyszukaj po kategorii"
              placeholder="Wpisz kategorię ogłoszenia"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchCategory("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.currentTarget.value)}
            />
          ),
          filtering: searchCategory !== "",
        },
        {
          accessor: "type",
          title: "Typ",
          width: 120,
          sortable: true,
          render: (item) => (
            <Badge color={item.type === "lost" ? "red" : "green"} variant="light">
              {item.type === "lost" ? "Zgubione" : "Znalezione"}
            </Badge>
          ),
        },
        {
          accessor: "user",
          title: "Dodane przez",
          width: 200,
          sortable: true,
          filter: (
            <TextInput
              label="Wyszukaj po użytkowniku"
              placeholder="Wpisz email użytkownika"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchUser("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchUser}
              onChange={(e) => setSearchUser(e.currentTarget.value)}
            />
          ),
          filtering: searchUser !== "",
        },
        {
          accessor: "title",
          title: "Tytuł",
          width: 200,
          sortable: true,
          render: (item) => {
            return <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{item.title}</span>;
          },
          filter: (
            <TextInput
              label="Wyszukaj po tytule"
              placeholder="Wpisz tytuł ogłoszenia"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchTitle("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.currentTarget.value)}
            />
          ),
          filtering: searchTitle !== "",
        },
        {
          accessor: "description",
          title: "Opis",
          width: 400,
          sortable: true,
          render: (item) => {
            return <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{item.description}</span>;
          },
        },
        {
          accessor: "occurredAt",
          title: "Data znalezienia/zgubienia",
          width: 220,
          sortable: true,
          render: (item) => dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY"),
        },
        {
          accessor: "createdAt",
          title: "Data dodania ogłoszenia",
          width: 220,
          sortable: true,
          render: (item) => (
            <span className="whitespace-pre">{dayjs(item.createdAt).locale("pl").format("HH:mm DD MMMM YYYY")}</span>
          ),
        },
        {
          accessor: "locationLabel",
          title: "Opis lokalizacji",
          width: 300,
          render: (item) => {
            return <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{item.locationLabel}</span>;
          },
        },
        {
          accessor: "location",
          title: "Lokalizacja (lat, lng)",
          width: 200,
          render: (item) =>
            `${(item.latitude as number)?.toFixed(6) ?? "-"}, ${(item.longitude as number)?.toFixed(6) ?? "-"}`,
        },
        {
          accessor: "actions",
          title: "Akcje",
          width: 156,
          render: (item) => (
            <div className="flex flex-row gap-3">
              <Link href={`/items/${item.id}`}>
                <Button variant="filled" size="compact-sm" radius="sm">
                  Zobacz
                </Button>
              </Link>
              <Button
                variant="filled"
                size="compact-sm"
                radius="sm"
                color="red"
                onClick={() => openDeleteModal(item.id)}
              >
                Usuń
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
