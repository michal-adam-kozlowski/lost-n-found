"use client";

import { redirect, useSearchParams } from "next/navigation";
import { Center, Pagination } from "@mantine/core";

export default function ItemsPagination({ pageCount, page }: { pageCount: number; page?: number }) {
  const params = useSearchParams();

  return (
    <Center>
      <Pagination
        total={pageCount}
        value={page}
        onChange={(page) => {
          const newParams = new URLSearchParams(params);
          newParams.set("page", page.toString());
          redirect(`/items?${newParams.toString()}`);
        }}
        mt="xl"
        mb="xl"
        color="black"
        withEdges
      />
    </Center>
  );
}
