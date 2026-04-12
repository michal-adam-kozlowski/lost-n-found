import type { NominatimResult } from "./types";

export function getPlaceName(result: NominatimResult): string {
  if (result.name) return result.name;
  return result.display_name.split(",")[0].trim();
}

export function formatAddress(result: NominatimResult): string {
  const addr = result.address;
  if (!addr) return "";

  const placeName = getPlaceName(result);
  const pick = (val: string | undefined) => (val && val !== placeName ? val : undefined);

  const parts: string[] = [];

  const road = pick(addr.road);
  if (road) {
    parts.push(road + (addr.house_number ? ` ${addr.house_number}` : ""));
  }

  const districtRaw = addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? addr.city_district ?? addr.district;
  const district = pick(districtRaw);
  if (district) parts.push(district);

  const cityRaw = addr.city ?? addr.town ?? addr.village;
  const city = pick(cityRaw);
  if (city) parts.push(city);

  if (!city) {
    const municipality = pick(addr.municipality);
    if (municipality) parts.push(municipality);
    const county = pick(addr.county);
    if (county) parts.push(county);
    const state = pick(addr.state);
    if (state) parts.push(state);
  }

  return parts.join(", ");
}
