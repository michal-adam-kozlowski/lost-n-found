"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import { Input } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { MarkerLocation } from "@components/maps/CustomMap";

export default function LocationPicker({
  defaultValue,
  onChange,
}: Readonly<{
  defaultValue?: MarkerLocation | null;
  onChange?: (value: MarkerLocation | null) => void;
}>) {
  const pathname = usePathname();
  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [pathname],
  );

  const [value, setValue] = useState<MarkerLocation | null>(defaultValue || null);

  const markers = value ? [{ ...value, key: "selected-location" }] : [];

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  return (
    <Input.Wrapper style={{ height: 500 }}>
      <CustomMap
        markers={markers}
        onClick={(ev) => setValue({ longitude: ev.lngLat.lng, latitude: ev.lngLat.lat })}
      ></CustomMap>
    </Input.Wrapper>
  );
}
