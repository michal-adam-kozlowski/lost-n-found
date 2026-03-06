"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./CustomMap.module.scss";
import React from "react";

export type MarkerLocation = {
  longitude: number;
  latitude: number;
};

export default function CustomMap({
  markers,
  ...props
}: React.ComponentProps<typeof Map> & { markers?: (MarkerLocation & { key: string | number })[] }) {
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
        {...props}
      >
        <NavigationControl position="top-right" />
        {markers?.map((marker) => (
          <Marker key={marker.key} longitude={marker.longitude} latitude={marker.latitude} color="blue" />
        ))}
      </Map>
    </div>
  );
}
