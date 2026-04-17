"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import React, { useMemo } from "react";
import { InteractiveMarker } from "@components/maps/CustomMap";
import { useSearchParams } from "next/navigation";
import type { ExternalLocation } from "@components/maps/geocoder/types";

export default function MapList<T>({
  markers,
  renderPopup,
}: Readonly<{
  markers: InteractiveMarker<T>[];
  renderPopup?: (data: T) => React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId") ?? undefined;
  const locationName = searchParams.get("locationName") ?? undefined;
  const geocoderLocation: ExternalLocation | undefined =
    locationId && locationName ? { id: locationId, name: locationName } : undefined;

  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [],
  );

  return (
    <div style={{ height: 600 }}>
      <CustomMap
        markers={markers}
        renderPopup={(data) => renderPopup?.(data as T)}
        geocoderLocation={geocoderLocation}
      />
    </div>
  );
}
