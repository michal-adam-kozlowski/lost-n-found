import React, { useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { TextInput, ActionIcon, Box, Text, Combobox, useCombobox } from "@mantine/core";
import { IconSearch, IconLoader2, IconX } from "@tabler/icons-react";

export interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  addresstype?: string;
  boundingbox?: [string, string, string, string];
}

interface SearchControlProps {
  onLocationSelect?: (location: SelectedLocation) => void;
}

export default function GeocoderControl({ onLocationSelect }: SearchControlProps) {
  const { current: map } = useMap();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchCompleted(false);

    try {
      let apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=pl&accept-language=pl&addressdetails=1`;

      if (map) {
        const bounds = map.getBounds();
        const viewbox = `${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()},${bounds.getSouth()}`;
        apiUrl += `&viewbox=${viewbox}`;
      }

      const response = await fetch(apiUrl);
      const data: NominatimResult[] = await response.json();

      const sortedData = data.sort((a, b) => {
        if (a.addresstype === "city" && b.addresstype === "administrative") return -1;
        if (a.addresstype === "administrative" && b.addresstype === "city") return 1;
        return 0;
      });

      const uniqueResults = sortedData.filter(
        (result, index, self) => index === self.findIndex((r) => r.display_name === result.display_name),
      );

      setResults(uniqueResults);
      setSearchCompleted(true);

      combobox.openDropdown();
      combobox.resetSelectedOption();
    } catch (error) {
      console.error("Failed to fetch geocoding results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    setSearchCompleted(false);
    combobox.closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !combobox.dropdownOpened) {
      e.preventDefault();
      void handleSearch();
    }
  };

  const handleOptionSubmit = (val: string) => {
    const location = results.find((r) => r.place_id.toString() === val);
    if (!location) return;

    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    if (onLocationSelect) {
      onLocationSelect({ lat, lon, name: location.display_name });
    }

    setResults([]);
    setSearchQuery(location.display_name);
    setSearchCompleted(false);
    combobox.closeDropdown();

    if (map) {
      if (location.boundingbox) {
        const [minLat, maxLat, minLon, maxLon] = location.boundingbox.map(parseFloat);
        map.fitBounds(
          [
            [minLon, minLat],
            [maxLon, maxLat],
          ],
          { padding: 40, duration: 2000 },
        );
      } else {
        map.flyTo({ center: [lon, lat], zoom: 14, duration: 2000 });
      }
    }
  };

  return (
    <Box className="absolute top-3 left-3 z-10 w-80">
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} withinPortal={false}>
        <Combobox.Target>
          <TextInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchCompleted(false); // Reset empty state when user types
              combobox.closeDropdown();
            }}
            onKeyDown={handleKeyDown}
            onClick={() => (results.length > 0 || searchCompleted) && combobox.openDropdown()}
            onFocus={() => (results.length > 0 || searchCompleted) && combobox.openDropdown()}
            placeholder="Wyszukaj miejsce..."
            readOnly={isLoading}
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
                  onClick={handleSearch}
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
              results.map((result) => (
                <Combobox.Option value={result.place_id.toString()} key={result.place_id} className="p-3">
                  <Text truncate="end">{result.display_name}</Text>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}
