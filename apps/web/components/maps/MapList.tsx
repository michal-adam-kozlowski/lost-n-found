"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import React, { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InteractiveMarker } from "@components/maps/CustomMap";
import type { ViewStateChangeEvent } from "react-map-gl/maplibre";

export default function MapList<T>({
  markers,
  renderPopup,
}: Readonly<{
  markers: InteractiveMarker<T>[];
  renderPopup?: (data: T) => React.ReactNode;
}>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [pathname],
  );

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const zoom = searchParams.get("zoom");

  const initialViewState =
    lat && lng
      ? {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          zoom: zoom ? parseFloat(zoom) : 12,
        }
      : undefined;

  const onMoveEnd = useCallback(
    (e: ViewStateChangeEvent) => {
      const { latitude, longitude, zoom } = e.viewState;
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", latitude.toFixed(5));
      params.set("lng", longitude.toFixed(5));
      params.set("zoom", zoom.toFixed(2));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams],
  );

  return (
    <div style={{ height: 600 }}>
      <CustomMap
        markers={markers}
        renderPopup={(data) => renderPopup?.(data as T)}
        onMoveEnd={onMoveEnd}
        initialViewState={initialViewState}
      />
    </div>
  );
}
