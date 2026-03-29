"use client";

import { SegmentedControl } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

export default function ViewControl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let view = typeof searchParams.get("view") === "string" ? searchParams.get("view") : "list";
  if (!view || !["list", "map"].includes(view)) {
    view = "list";
  }

  return (
    <SegmentedControl
      color="black"
      value={view}
      onChange={(value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("view", value);
        router.replace(`?${params.toString()}`);
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
