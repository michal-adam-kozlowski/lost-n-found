"use client";

import React, { useEffect, useRef, useState } from "react";
import { Combobox, TextInput, useCombobox, Text, CloseButton, ScrollArea } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconLoader2 } from "@tabler/icons-react";
import { searchMapTiler, REGION_SEARCH_TYPES } from "./api";
import type { MapTilerFeature } from "./types";
import { getPlaceName, formatAddress } from "./utils";

const DEFAULT_CITIES: Array<{ name: string; description: string; query: string }> = [
  { name: "Warszawa", query: "Warszawa, Polska", description: "województwo mazowieckie, Polska" },
  { name: "Kraków", query: "Kraków, Polska", description: "województwo małopolskie, Polska" },
  { name: "Łódź", query: "Łódź, Polska", description: "województwo łódzkie, Polska" },
  { name: "Wrocław", query: "Wrocław, Polska", description: "województwo dolnośląskie, Polska" },
  { name: "Poznań", query: "Poznań, Polska", description: "województwo wielkopolskie, Polska" },
  { name: "Gdańsk", query: "Gdańsk, Polska", description: "województwo pomorskie, Polska" },
  { name: "Szczecin", query: "Szczecin, Polska", description: "województwo zachodniopomorskie, Polska" },
  { name: "Bydgoszcz", query: "Bydgoszcz, Polska", description: "województwo kujawsko-pomorskie, Polska" },
  { name: "Lublin", query: "Lublin, Polska", description: "województwo lubelskie, Polska" },
  { name: "Katowice", query: "Katowice, Polska", description: "województwo śląskie, Polska" },
];

export interface RegionValue {
  locationId?: string;
  locationName?: string;
}

interface RegionFilterProps {
  value: RegionValue;
  onChange: (value: RegionValue) => void;
}

export default function RegionFilter({ value, onChange }: RegionFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(value.locationName ?? "");
  const [results, setResults] = useState<MapTilerFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    setInputValue(value.locationName ?? "");
  }, [value.locationName]);

  const runSearch = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSearchCompleted(false);
      setShowDefaults(true);
      combobox.openDropdown();
      return;
    }

    setIsLoading(true);
    setShowDefaults(false);
    try {
      const features = await searchMapTiler(query, { types: REGION_SEARCH_TYPES });
      setResults(features);
      setSearchCompleted(true);
      combobox.openDropdown();
      combobox.resetSelectedOption();
    } catch (err) {
      console.error("Location search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, 200);

  const handleOptionSubmit = async (featureId: string) => {
    if (featureId.startsWith("default:")) {
      const cityName = featureId.slice("default:".length);
      const defaultCity = DEFAULT_CITIES.find((c) => c.name === cityName);
      if (!defaultCity) return;

      setIsLoading(true);
      combobox.closeDropdown();
      try {
        const features = await searchMapTiler(defaultCity.query, { types: REGION_SEARCH_TYPES });
        const best = features[0];
        if (best) {
          setInputValue(getPlaceName(best));
          onChange({ locationId: best.id, locationName: getPlaceName(best) });
          inputRef.current?.blur();
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const feature = results.find((r) => r.id === featureId);
    if (!feature) return;

    setInputValue(getPlaceName(feature));
    setResults([]);
    setSearchCompleted(false);
    combobox.closeDropdown();
    inputRef.current?.blur();
    onChange({ locationId: feature.id, locationName: getPlaceName(feature) });
  };

  const handleClear = () => {
    setInputValue("");
    setResults([]);
    setSearchCompleted(false);
    setShowDefaults(false);
    combobox.closeDropdown();
    onChange({ locationId: undefined, locationName: undefined });
  };

  const showSearchResults = !showDefaults && (results.length > 0 || searchCompleted);
  const dropdownHidden = !showDefaults && !showSearchResults;

  return (
    <Combobox store={combobox} onOptionSubmit={(val) => void handleOptionSubmit(val)} withinPortal={true}>
      <Combobox.Target>
        <TextInput
          ref={inputRef}
          label="Lokalizacja"
          placeholder="Wybierz lokalizację"
          value={inputValue}
          style={{ flex: 1, minWidth: 160 }}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            void runSearch(val);
          }}
          onFocus={() => {
            if (!inputValue.trim()) {
              setShowDefaults(true);
              combobox.openDropdown();
            } else if (results.length > 0 || searchCompleted) {
              combobox.openDropdown();
            }
          }}
          onBlur={() => {
            setTimeout(() => combobox.closeDropdown(), 150);
          }}
          rightSectionWidth={inputValue ? 32 : undefined}
          rightSection={
            isLoading ? (
              <IconLoader2 size={16} className="animate-spin" style={{ color: "var(--mantine-color-gray-5)" }} />
            ) : inputValue ? (
              <CloseButton size="sm" variant="transparent" onClick={handleClear} />
            ) : null
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={dropdownHidden}>
        <Combobox.Options mah={260} style={{ overflowY: "auto" }}>
          <ScrollArea.Autosize type="scroll" mah={240} scrollbarSize={12}>
            {showDefaults &&
              DEFAULT_CITIES.map((city) => (
                <Combobox.Option value={`default:${city.name}`} key={city.name} className="group p-2">
                  <Text size="sm" fw={500} truncate="end">
                    {city.name}
                  </Text>
                  <Text
                    size="xs"
                    c="dimmed"
                    truncate="end"
                    className="group-data-combobox-active:text-white! group-data-combobox-selected:text-white!"
                  >
                    {city.description}
                  </Text>
                </Combobox.Option>
              ))}

            {showSearchResults && results.length === 0 && searchCompleted && (
              <Combobox.Empty>Brak wyników</Combobox.Empty>
            )}

            {showSearchResults &&
              results.map((feature) => {
                const contextLabel = formatAddress(feature);
                return (
                  <Combobox.Option value={feature.id} key={feature.id} className="group p-2">
                    <Text size="sm" fw={500} truncate="end">
                      {getPlaceName(feature)}
                    </Text>
                    {contextLabel && (
                      <Text size="xs" c="dimmed" truncate="end" className="group-data-combobox-active:text-white!">
                        {contextLabel}
                      </Text>
                    )}
                  </Combobox.Option>
                );
              })}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
