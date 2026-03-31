"use client";

import { SegmentedControl } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";

export default function ViewControl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { view } = ItemsViewOptions.fromQueryParams(searchParams);

  return (
    <SegmentedControl
      color="black"
      value={view}
      onChange={(value) => {
        const options = ItemsViewOptions.fromQueryParams(searchParams);
        const newOptions = options.copyWith({ view: value as "list" | "map" });
        router.push(`${newOptions.getRedirectUrl()}`);
      }}
      data={[
        { value: "list", label: "Lista" },
        { value: "map", label: "Mapa" },
      ]}
      size="md"
      styles={{
        root: {
          background: "var(--mantine-color-white)",
          border: "calc(.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-4)",
          padding: "calc(.1875rem * var(--mantine-scale))",
        },
        indicator: {
          transitionProperty: "transform, width, height, background-color",
          marginTop: "calc(-0.0625rem * var(--mantine-scale))",
          marginLeft: "calc(-0.0625rem * var(--mantine-scale))",
        },
      }}
    />
  );
}
