"use client";

import { GetUserResponse } from "@lost-n-found/api-client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { paginate } from "@/lib/utils/data";
import { sortBy } from "lodash";
import { useRouter } from "next/navigation";
import { blockUser, unblockUser } from "@/actions/admin";
import dayjs from "dayjs";
import { UserRole } from "@/lib/utils/types";
import { IconSearch, IconX } from "@tabler/icons-react";

const PAGE_SIZE = 100;

export default function UsersTable({ users }: { users: GetUserResponse[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<GetUserResponse>>({
    columnAccessor: "email",
    direction: "desc",
  });
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const transformedUsers = users
    .map((user) => ({
      ...user,
    }))
    .filter((user) => user.id.includes(searchId) && user.email.toLowerCase().includes(searchEmail.toLowerCase()));

  const sortedUsers = sortBy(transformedUsers, sortStatus.columnAccessor);
  if (sortStatus.direction === "desc") {
    sortedUsers.reverse();
  }

  const { items: paginatedUsers } = paginate(sortedUsers, page, PAGE_SIZE);

  return (
    <DataTable
      minHeight={100}
      noRecordsText={"Nie znaleziono użytkowników"}
      noRecordsIcon={<></>}
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped={true}
      shadow="sm"
      totalRecords={transformedUsers.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      paginationSize="md"
      records={paginatedUsers}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      columns={[
        {
          accessor: "id",
          title: "ID",
          width: 340,
          filter: (
            <TextInput
              label="Wyszukaj po ID"
              placeholder="Wpisz ID użytkownika"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchId("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchId}
              onChange={(e) => {
                setSearchId(e.currentTarget.value);
                setPage(1);
              }}
            />
          ),
          filtering: searchId !== "",
        },
        {
          accessor: "email",
          title: "Email",
          width: 320,
          sortable: true,
          filter: (
            <TextInput
              label="Wyszukaj po emailu"
              placeholder="Wpisz email użytkownika"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setSearchEmail("")}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.currentTarget.value);
                setPage(1);
              }}
            />
          ),
          filtering: searchEmail !== "",
        },
        {
          accessor: "roles",
          title: "Role",
          width: 240,
          sortable: true,
          render: (user) => (user.roles?.length ? user.roles.join(", ") : "-"),
        },
        {
          accessor: "blockedAt",
          title: "Zablokowany",
          width: 240,
          sortable: true,
          render: (user) =>
            user.blockedAt ? `Tak, od ${dayjs(user.blockedAt).locale("pl").format("HH:mm DD MMMM YYYY")}` : "Nie",
        },
        {
          accessor: "actions",
          title: "Akcje",
          width: 100,
          render: (user) => (
            <div className="flex flex-row gap-3">
              {user.roles?.includes(UserRole.Admin) ? null : user.blockedAt ? (
                <Button
                  variant="filled"
                  size="compact-sm"
                  radius="sm"
                  color="green"
                  onClick={() => unblockUser(user.id).then(() => router.refresh())}
                >
                  Odblokuj
                </Button>
              ) : (
                <Button
                  variant="filled"
                  size="compact-sm"
                  radius="sm"
                  color="red"
                  onClick={() => blockUser(user.id).then(() => router.refresh())}
                >
                  Zablokuj
                </Button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
