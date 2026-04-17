"use client";

import React, { useEffect, useRef, useState } from "react";
import { Combobox, TextInput, useCombobox, Text, ActionIcon } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconMapPin, IconLoader2, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";
import { useLoading } from "@/lib/context/LoadingContext";
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

export default function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setLoading } = useLoading();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialOptions = ItemsViewOptions.fromQueryParams(searchParams);
  const [inputValue, setInputValue] = useState(initialOptions.locationName ?? "");
  const [results, setResults] = useState<MapTilerFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    const options = ItemsViewOptions.fromQueryParams(searchParams);
    setInputValue(options.locationName ?? "");
  }, [searchParams]);

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

  const applyLocation = (locationId: string | undefined, locationName: string | undefined) => {
    const oldOptions = ItemsViewOptions.fromQueryParams(searchParams);
    const newOptions = oldOptions.copyWith({ locationId, locationName });
    if (oldOptions.toQueryString() === newOptions.toQueryString()) return;
    newOptions.page = 1;
    setLoading("itemsFilters", true);
    router.replace(newOptions.getRedirectUrl());
  };

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
          applyLocation(best.id, getPlaceName(best));
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
    applyLocation(feature.id, getPlaceName(feature));
  };

  const handleClear = () => {
    setInputValue("");
    setResults([]);
    setSearchCompleted(false);
    setShowDefaults(false);
    combobox.closeDropdown();
    applyLocation(undefined, undefined);
  };

  const showSearchResults = !showDefaults && (results.length > 0 || searchCompleted);
  const dropdownHidden = !showDefaults && !showSearchResults;

  if (!["/items", "/account/items"].includes(pathname)) return null;

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
              <ActionIcon
                variant="subtle"
                size="sm"
                color="gray"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
              >
                <IconX size={14} />
              </ActionIcon>
            ) : (
              <IconMapPin size={16} style={{ color: "var(--mantine-color-gray-5)" }} />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={dropdownHidden}>
        <Combobox.Options mah={260} style={{ overflowY: "auto" }}>
          {showDefaults &&
            DEFAULT_CITIES.map((city) => (
              <Combobox.Option value={`default:${city.name}`} key={city.name} className="group p-2">
                <Text size="sm" fw={500} truncate="end">
                  {city.name}
                </Text>
                <Text size="xs" c="dimmed" truncate="end" className="group-data-combobox-active:text-white!">
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
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
