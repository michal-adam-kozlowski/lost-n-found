"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import React, { useMemo } from "react";
import { InteractiveMarker } from "@components/maps/CustomMap";
import { ViewState } from "react-map-gl";
import { usePathname } from "next/navigation";

export default function LocationViewer<T>({
  marker,
}: Readonly<{
  marker: InteractiveMarker<T>;
}>) {
  const pathname = usePathname();
  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [pathname],
  );

  const initialViewState: Partial<ViewState> = {
    latitude: marker.latitude,
    longitude: marker.longitude,
    zoom: 15,
  };

  return (
    <div style={{ height: 600 }}>
      <CustomMap markers={[marker]} initialViewState={initialViewState} />
    </div>
  );
}
