"use client";

import { GetUserResponse } from "@lost-n-found/api-client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import { paginate } from "@/lib/utils/data";
import { sortBy } from "lodash";
import { useRouter } from "next/navigation";
import { blockUser, unblockUser } from "@/actions/admin";
import dayjs from "dayjs";

const PAGE_SIZE = 20;

export default function UsersTable({ users }: { users: GetUserResponse[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<GetUserResponse>>({
    columnAccessor: "email",
    direction: "desc",
  });

  const transformedUsers = users.map((user) => ({
    ...user,
  }));

  const sortedUsers = sortBy(transformedUsers, sortStatus.columnAccessor);
  if (sortStatus.direction === "desc") {
    sortedUsers.reverse();
  }

  const { items: paginatedUsers } = paginate(sortedUsers, page, PAGE_SIZE);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped={true}
      shadow="sm"
      totalRecords={users.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      paginationSize="md"
      records={paginatedUsers}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      columns={[
        { accessor: "id", title: "ID", width: 340 },
        { accessor: "email", title: "Email", width: 320, sortable: true },
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
              {user.blockedAt ? (
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
