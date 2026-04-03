"use client";

import { SegmentedControl } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import { useEffect, useState } from "react";

export default function ViewControl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState<"list" | "map">(() => {
    const options = ItemsViewOptions.fromQueryParams(searchParams);
    return options.view || "list";
  });

  useEffect(() => {
    if (!["/items", "/account/items"].includes(pathname)) {
      return;
    }
    const options = ItemsViewOptions.fromQueryParams(searchParams);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(options.view || "list");
  }, [searchParams]);

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
