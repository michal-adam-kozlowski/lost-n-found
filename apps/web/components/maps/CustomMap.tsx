"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import type { MapLibreEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibre.scss";
import styles from "./CustomMap.module.scss";
import React, { useCallback } from "react";
import GeocoderControl from "@components/maps/GeocoderControl";
import { setMapLanguage } from "@components/maps/utils";
import CustomMapControls from "@components/maps/CustomMapControls";

export type MarkerLocation = {
  longitude: number;
  latitude: number;
};

export default function CustomMap({
  markers,
  ...props
}: React.ComponentProps<typeof Map> & { markers?: (MarkerLocation & { key: string | number })[] }) {
  const onMapLoad = useCallback((e: MapLibreEvent) => {
    setMapLanguage(e.target, "pl");
  }, []);

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
      >
        <CustomMapControls />
        <GeocoderControl />
        {markers?.map((marker) => (
          <Marker key={marker.key} longitude={marker.longitude} latitude={marker.latitude} color="blue" />
        ))}
      </Map>
    </div>
  );
}
