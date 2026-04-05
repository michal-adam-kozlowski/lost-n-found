"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import React, { useMemo } from "react";
import { InteractiveMarker } from "@components/maps/CustomMap";
import { ViewState } from "react-map-gl";
import { usePathname } from "next/navigation";
import { Paper, Text } from "@mantine/core";
import { IconMapPinOff } from "@tabler/icons-react";

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

  if (!marker || !marker.latitude || !marker.longitude) {
    return (
      <Paper h={300} withBorder className="flex! flex-col items-center justify-center gap-4" bg="gray.3">
        <IconMapPinOff size={64} stroke={1.5} color="var(--mantine-color-gray-6)" />
        <Text c="gray.6" size="xl">
          Brak danych o lokalizacji
        </Text>
      </Paper>
    );
  }

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
