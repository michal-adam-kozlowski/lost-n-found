"use client";

import { useMap } from "react-map-gl/maplibre";
import { ActionIcon, Paper, Stack } from "@mantine/core";
import { IconPlus, IconMinus, IconCompass, IconMaximize, IconCurrentLocation, IconMinimize } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function CustomMapControls() {
  const { current: map } = useMap();

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleResetNorth = () => map?.resetNorthPitch();

  const handleFullscreen = () => {
    const container = map?.getContainer();
    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handleGeolocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map?.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 2000,
          });
        },
        (error) => {
          console.error("Błąd geolokalizacji:", error);
        },
      );
    }
  };

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-3">
      <Paper shadow="md" radius="md" className="overflow-hidden bg-white">
        <ActionIcon variant="subtle" color="gray.8" size="lg" radius={0} onClick={handleFullscreen}>
          {isFullscreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
        </ActionIcon>
      </Paper>

      <Paper shadow="md" radius="md" className="overflow-hidden bg-white">
        <ActionIcon variant="subtle" color="gray.8" size="lg" radius={0} onClick={handleGeolocate}>
          <IconCurrentLocation size={20} />
        </ActionIcon>
      </Paper>

      <Paper shadow="md" radius="md" className="overflow-hidden bg-white">
        <Stack gap={0}>
          <ActionIcon variant="subtle" color="gray.8" size="lg" radius={0} onClick={handleZoomIn} aria-label="Przybliż">
            <IconPlus size={20} />
          </ActionIcon>
          <div className="h-px w-full bg-gray-100" />
          <ActionIcon variant="subtle" color="gray.8" size="lg" radius={0} onClick={handleZoomOut} aria-label="Oddal">
            <IconMinus size={20} />
          </ActionIcon>
          <div className="h-px w-full bg-gray-100" />
          <ActionIcon variant="subtle" color="gray.8" size="lg" radius={0} onClick={handleResetNorth}>
            <IconCompass size={20} className="-rotate-45" />
          </ActionIcon>
        </Stack>
      </Paper>
    </div>
  );
}
