"use client";

import Map, { Marker, Popup } from "react-map-gl/maplibre";
import type { MapLibreEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibre.scss";
import styles from "./CustomMap.module.scss";
import React, { useCallback, useState } from "react";
import GeocoderControl from "@components/maps/geocoder/GeocoderControl";
import type { ExternalLocation } from "@components/maps/geocoder/types";
import { setMapLanguage } from "@components/maps/utils";
import CustomMapControls from "@components/maps/CustomMapControls";
import { Location } from "@/lib/utils/types";
import { useClickOutside } from "@mantine/hooks";
import Pin from "@components/maps/Pin";

export type InteractiveMarker<T> = Location & {
  key: string | number;
  onClick?: () => void;
  data: T;
  color?: string;
};

export default function CustomMap<T>({
  markers,
  renderPopup,
  geocoderLocation,
  ...props
}: React.ComponentProps<typeof Map> & {
  markers?: InteractiveMarker<T>[];
  renderPopup?: (data: T) => React.ReactNode;
  geocoderLocation?: ExternalLocation;
}) {
  const onMapLoad = useCallback((e: MapLibreEvent) => {
    setMapLanguage(e.target, "pl");
  }, []);

  const [selectedMarker, setSelectedMarker] = useState<InteractiveMarker<T> | null>(null);

  const clickOutsideRef = useClickOutside((e) => {
    const clickedModal = (e.target as HTMLElement).closest(".maplibre-modal-ignore");
    if (!clickedModal) {
      setSelectedMarker(null);
    }
  });

  return (
    <div className={styles.Container} ref={clickOutsideRef}>
      <a href="https://www.maptiler.com" target="_blank" rel="noopener noreferrer" className={styles.MapTilerLogo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler" />
      </a>
      <Map
        initialViewState={{
          longitude: 19.134422,
          latitude: 52,
          zoom: 5.2,
        }}
        reuseMaps={true}
        style={{ width: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? ""}`}
        maxPitch={0}
        minPitch={0}
        onLoad={onMapLoad}
        {...props}
        onClick={(e) => {
          const clickedMarker = (e.originalEvent.target as HTMLElement).closest(".maplibregl-marker");
          if (!clickedMarker) {
            setSelectedMarker(null);
          }
          props.onClick?.(e);
        }}
      >
        <CustomMapControls />
        <GeocoderControl externalLocation={geocoderLocation} />
        {markers?.map((marker) => (
          <Marker
            key={marker.key}
            longitude={marker.longitude}
            latitude={marker.latitude}
            color="blue"
            onClick={() => {
              setSelectedMarker(marker);
              marker.onClick?.();
            }}
          >
            <Pin color={marker.color || "var(--mantine-color-blue-9)"} />
          </Marker>
        ))}
        {renderPopup && selectedMarker && (
          <Popup
            anchor="top"
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            closeOnClick={false}
            offset={10}
            focusAfterOpen={false}
          >
            {renderPopup?.(selectedMarker.data)}
          </Popup>
        )}
      </Map>
    </div>
  );
}
