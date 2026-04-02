"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Center, Pagination } from "@mantine/core";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";

export default function ItemsPagination({ pageCount, page }: { pageCount: number; page?: number }) {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <Center>
      <Pagination
        total={pageCount}
        value={page}
        onChange={(page) => {
          const options = ItemsViewOptions.fromQueryParams(params);
          const newOptions = options.copyWith({ page });
          router.push(`${newOptions.getRedirectUrl()}`);
        }}
        mt="xl"
        mb="xl"
        color="black"
        withEdges
      />
    </Center>
  );
}
