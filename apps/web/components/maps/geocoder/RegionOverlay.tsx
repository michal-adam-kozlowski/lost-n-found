"use client";

import React, { useEffect, useState } from "react";
import { Source, Layer, useMap } from "react-map-gl/maplibre";
import { regionOverlayFillLayer, regionOverlayLineLayer } from "./layers";
import { fetchFeatureById, fetchPolandFeature } from "./api";
import type { MapTilerFeature } from "./types";
import { buildCutoutFeature } from "@components/maps/geocoder/utils";

interface RegionOverlayProps {
  locationId?: string;
}

export default function RegionOverlay({ locationId }: RegionOverlayProps) {
  const { current: map } = useMap();
  const [cutoutData, setCutoutData] = useState<GeoJSON.Feature | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const feature: MapTilerFeature | null = locationId
        ? await fetchFeatureById(locationId)
        : await fetchPolandFeature();

      if (cancelled || !feature) return;

      if (["Polygon", "MultiPolygon"].includes(feature.geometry.type)) {
        setCutoutData(buildCutoutFeature(feature.geometry));
      }

      if (map) {
        if (feature.bbox) {
          const [west, south, east, north] = feature.bbox;
          map.fitBounds(
            [
              [west, south],
              [east, north],
            ],
            { padding: 40, duration: 2000, maxZoom: 16 },
          );
        } else {
          const [lon, lat] = feature.center;
          map.flyTo({ center: [lon, lat], zoom: 10, duration: 2000 });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [locationId, map]);

  if (!cutoutData) return null;

  return (
    <Source id="region-overlay" type="geojson" data={cutoutData}>
      <Layer {...regionOverlayFillLayer} />
      <Layer {...regionOverlayLineLayer} />
    </Source>
  );
}
