"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/CustomMapPlaceholder";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { MarkerLocation } from "@components/CustomMap";

export type InteractiveMarker = MarkerLocation & {
  key: string | number;
  onClick?: () => void;
};

export default function MapList({ markers }: Readonly<{ markers: InteractiveMarker[] }>) {
  const pathname = usePathname();
  const CustomMap = useMemo(
    () => dynamic(() => import("@components/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [pathname],
  );

  return (
    <div style={{ height: 600 }}>
      <CustomMap markers={markers}></CustomMap>
    </div>
  );
}
