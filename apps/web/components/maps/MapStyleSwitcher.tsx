"use client";

import { useMap } from "react-map-gl/maplibre";
import { useState } from "react";
import { ActionIcon } from "@mantine/core";
import { setMapLanguage } from "@components/maps/utils";
import satelliteImage from "./satellite_image.png";
import streetsImage from "./streets_image.png";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? "";

const STYLES = {
  streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
  satellite: `https://api.maptiler.com/maps/hybrid-v4/style.json?key=${MAPTILER_KEY}`,
} as const;

type MapStyle = keyof typeof STYLES;

const THUMBNAILS: Record<MapStyle, string> = {
  streets: streetsImage.src,
  satellite: satelliteImage.src,
};

const LABELS: Record<MapStyle, string> = {
  streets: "Streets",
  satellite: "Satellite",
};

export default function MapStyleSwitcher() {
  const { current: map } = useMap();
  const [currentStyle, setCurrentStyle] = useState<MapStyle>("streets");

  const nextStyle: MapStyle = currentStyle === "streets" ? "satellite" : "streets";

  const handleSwitch = () => {
    const rawMap = map?.getMap();
    if (!rawMap) return;
    rawMap.setStyle(STYLES[nextStyle]);
    rawMap.once("styledata", () => {
      setMapLanguage(rawMap, "pl");
    });
    setCurrentStyle(nextStyle);
  };

  return (
    <ActionIcon
      onClick={handleSwitch}
      className="absolute! bottom-3 left-3 border-0!"
      variant="default"
      size={80}
      p={6}
      radius="md"
      style={{ boxShadow: "var(--mantine-shadow-md)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={THUMBNAILS[nextStyle]}
        alt={LABELS[nextStyle]}
        style={{ borderRadius: "4px", width: "100%", height: "100%" }}
        height="100%"
        width-="100%"
      />
    </ActionIcon>
  );
}
