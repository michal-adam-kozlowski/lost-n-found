"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import React, { useMemo } from "react";
import { InteractiveMarker } from "@components/maps/CustomMap";

export default function MapList<T>({
  markers,
  renderPopup,
}: Readonly<{
  markers: InteractiveMarker<T>[];
  renderPopup?: (data: T) => React.ReactNode;
}>) {
  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [],
  );

  return (
    <div style={{ height: 600 }}>
      <CustomMap markers={markers} renderPopup={(data) => renderPopup?.(data as T)} />
    </div>
  );
}
