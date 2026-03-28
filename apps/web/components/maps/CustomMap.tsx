"use client";

import Map, { Marker, Popup } from "react-map-gl/maplibre";
import type { MapLibreEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibre.scss";
import styles from "./CustomMap.module.scss";
import React, { useCallback, useState } from "react";
import GeocoderControl from "@components/maps/GeocoderControl";
import { setMapLanguage } from "@components/maps/utils";
import CustomMapControls from "@components/maps/CustomMapControls";
import { Location } from "@/lib/utils/types";

export type InteractiveMarker<T> = Location & {
  key: string | number;
  onClick?: () => void;
  data: T;
};

export default function CustomMap<T>({
  markers,
  renderPopup,
  ...props
}: React.ComponentProps<typeof Map> & {
  markers?: InteractiveMarker<T>[];
  renderPopup?: (data: T) => React.ReactNode;
}) {
  const onMapLoad = useCallback((e: MapLibreEvent) => {
    setMapLanguage(e.target, "pl");
  }, []);

  const [selectedMarker, setSelectedMarker] = useState<InteractiveMarker<T> | null>(null);

  return (
    <div className={styles.Container}>
      <Map
        initialViewState={{
          longitude: 19.9449,
          latitude: 50.0646,
          zoom: 12,
        }}
        reuseMaps={true}
        style={{ width: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
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
        <GeocoderControl />
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
          />
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
