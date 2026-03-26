"use client";

import dynamic from "next/dynamic";
import CustomMapPlaceholder from "@components/maps/CustomMapPlaceholder";
import { Input } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Location } from "@/lib/utils/types";

export default function LocationPicker({
  defaultValue,
  onChange,
}: Readonly<{
  defaultValue?: Location | null;
  onChange?: (value: Location | null) => void;
}>) {
  const pathname = usePathname();
  const CustomMap = useMemo(
    () => dynamic(() => import("@components/maps/CustomMap"), { ssr: false, loading: CustomMapPlaceholder }),
    [pathname],
  );

  const [value, setValue] = useState<Location | null>(defaultValue || null);

  const markers = value ? [{ ...value, key: "selected-location", data: null }] : [];

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
