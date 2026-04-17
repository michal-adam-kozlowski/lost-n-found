import React, { useRef, useState } from "react";
import { useMap, Source, Layer } from "react-map-gl/maplibre";
import { TextInput, ActionIcon, Box, Text, Combobox, useCombobox } from "@mantine/core";
import { IconSearch, IconLoader2, IconX } from "@tabler/icons-react";
import { useDebouncedCallback } from "@mantine/hooks";
import type { MapTilerFeature, SelectedLocation } from "./types";
import { getPlaceName, formatAddress } from "./utils";
import { dashedLineLayer, fillLayer } from "./layers";
import { searchMapTiler, fetchFeaturePolygon, ALL_SEARCH_TYPES } from "./api";

interface GeocoderControlProps {
  onLocationSelect?: (location: SelectedLocation) => void;
}

export default function GeocoderControl({ onLocationSelect }: GeocoderControlProps) {
  const { current: map } = useMap();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<MapTilerFeature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);
  const [polygonData, setPolygonData] = useState<GeoJSON.Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapTilerFeature | null>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const runSearch = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSearchCompleted(false);
      combobox.closeDropdown();
      return;
    }

    setIsLoading(true);
    try {
      const center = map?.getCenter();
      const proximity: [number, number] | undefined = center ? [center.lng, center.lat] : undefined;
      const features = await searchMapTiler(query, { proximity, types: ALL_SEARCH_TYPES });
      setResults(features);
      setSearchCompleted(true);
      combobox.openDropdown();
      combobox.resetSelectedOption();
    } catch (error) {
      console.error("Failed to fetch geocoding results:", error);
    } finally {
      setIsLoading(false);
    }
  }, 200);

  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    setSearchCompleted(false);
    setPolygonData(null);
    setSelectedFeature(null);
    combobox.closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const flyToFeature = (feature: MapTilerFeature) => {
    if (!map) return;
    if (feature.bbox) {
      const [west, south, east, north] = feature.bbox;
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 40, duration: 1200, maxZoom: 16 },
      );
    } else {
      const [lon, lat] = feature.center;
      map.flyTo({ center: [lon, lat], zoom: 16, duration: 1200 });
    }
  };

  const handleOptionSubmit = async (val: string) => {
    const feature = results.find((r) => r.id === val);
    if (!feature) return;

    const [lon, lat] = feature.center;

    if (onLocationSelect) {
      onLocationSelect({ lat, lon, name: feature.place_name });
    }

    setResults([]);
    setSearchQuery(getPlaceName(feature));
    setSearchCompleted(false);
    setSelectedFeature(feature);
    combobox.closeDropdown();
    inputRef.current?.blur();

    const polygon = await fetchFeaturePolygon(feature.id);
    setPolygonData(polygon);

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
        map.flyTo({ center: [lon, lat], zoom: 16, duration: 2000 });
      }
    }
  };

  const handleSearchButtonClick = async () => {
    if (combobox.dropdownOpened && results.length > 0) {
      const idx = combobox.selectedOptionIndex >= 0 ? combobox.selectedOptionIndex : 0;
      const feature = results[idx];
      if (feature) {
        await handleOptionSubmit(feature.id);
      }
    } else if (selectedFeature) {
      flyToFeature(selectedFeature);
    }
  };

  return (
    <>
      <Box className="absolute top-3 left-3 z-10 w-80">
        <Combobox store={combobox} onOptionSubmit={(val) => void handleOptionSubmit(val)} withinPortal={false}>
          <Combobox.Target>
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                void runSearch(val);
              }}
              onKeyDown={handleKeyDown}
              onClick={() => (results.length > 0 || searchCompleted) && combobox.openDropdown()}
              onFocus={() => (results.length > 0 || searchCompleted) && combobox.openDropdown()}
              placeholder="Wyszukaj miejsce..."
              size="md"
              radius="md"
              classNames={{
                input: "shadow-md border-none!",
              }}
              rightSectionWidth={searchQuery ? 80 : 40}
              rightSectionProps={{ className: "flex items-center justify-end! gap-1 px-1" }}
              rightSection={
                <>
                  {searchQuery && (
                    <ActionIcon
                      onClick={handleClear}
                      onMouseDown={(e) => e.preventDefault()}
                      variant="white"
                      size="lg"
                      color="gray.6"
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  )}
                  <ActionIcon
                    type="button"
                    onClick={() => void handleSearchButtonClick()}
                    onMouseDown={(e) => e.preventDefault()}
                    variant="subtle"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? <IconLoader2 size={20} className="animate-spin" /> : <IconSearch size={20} />}
                  </ActionIcon>
                </>
              }
            />
          </Combobox.Target>
          <Combobox.Dropdown
            hidden={results.length === 0 && !searchCompleted}
            styles={{ dropdown: { borderRadius: "var(--mantine-radius-md)" } }}
          >
            <Combobox.Options style={{ overflowY: "auto" }} mah={240}>
              {results.length === 0 && searchCompleted ? (
                <Combobox.Empty>Brak wyników</Combobox.Empty>
              ) : (
                results.map((feature) => (
                  <Combobox.Option value={feature.id} key={feature.id} className="group p-3">
                    <Text truncate="end" fw={500} size="sm">
                      {getPlaceName(feature)}
                    </Text>
                    {formatAddress(feature) && (
                      <Text
                        truncate="end"
                        size="xs"
                        c="dimmed"
                        className="group-data-combobox-active:text-white! group-data-combobox-selected:text-white!"
                      >
                        {formatAddress(feature)}
                      </Text>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Box>
      {polygonData && (
        <Source id="geocoder-boundary" type="geojson" data={polygonData}>
          <Layer {...fillLayer} />
          <Layer {...dashedLineLayer} />
        </Source>
      )}
    </>
  );
}
