"use client";

import { useMap } from "react-map-gl/maplibre";
import { ActionIcon, ActionIconGroup } from "@mantine/core";
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
      <ActionIcon
        variant="white"
        color="gray.6"
        size="lg"
        radius="md"
        style={{ boxShadow: "var(--mantine-shadow-md)" }}
        onClick={handleFullscreen}
      >
        {isFullscreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
      </ActionIcon>

      <ActionIcon
        variant="white"
        color="gray.6"
        size="lg"
        radius="md"
        style={{ boxShadow: "var(--mantine-shadow-md)" }}
        onClick={handleGeolocate}
      >
        <IconCurrentLocation size={20} />
      </ActionIcon>

      <ActionIconGroup
        orientation="vertical"
        styles={{
          group: {
            boxShadow: "var(--mantine-shadow-md)",
            borderRadius: "var(--mantine-radius-md)",
            background: "var(--mantine-color-white)",
          },
        }}
      >
        <ActionIcon variant="white" color="gray.6" size="lg" radius="md" onClick={handleZoomIn}>
          <IconPlus size={20} />
        </ActionIcon>
        <ActionIcon variant="white" color="gray.6" size="lg" radius="md" onClick={handleZoomOut}>
          <IconMinus size={20} />
        </ActionIcon>
        <ActionIcon variant="white" color="gray.6" size="lg" radius="md" onClick={handleResetNorth}>
          <IconCompass size={20} className="-rotate-45" />
        </ActionIcon>
      </ActionIconGroup>
    </div>
  );
}
