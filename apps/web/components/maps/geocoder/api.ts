import type { MapTilerFeature, MapTilerGeocodingResponse } from "./types";

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? "";

export const REGION_SEARCH_TYPES =
  "region,subregion,county,joint_municipality,joint_submunicipality,municipality,municipal_district,locality,neighbourhood";

export const ALL_SEARCH_TYPES = REGION_SEARCH_TYPES + ",place,address,road,poi";

export interface SearchOptions {
  proximity?: [number, number];
  types?: string;
}

export async function searchMapTiler(query: string, options?: SearchOptions): Promise<MapTilerFeature[]> {
  const params = new URLSearchParams({
    key: MAPTILER_API_KEY,
    country: "pl",
    language: "pl",
    types: options?.types ?? ALL_SEARCH_TYPES,
    limit: "10",
  });
  if (options?.proximity) {
    params.set("proximity", `${options.proximity[0]},${options.proximity[1]}`);
  }
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?${params}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data: MapTilerGeocodingResponse = await response.json();
  return data.features ?? [];
}

export async function fetchFeatureById(featureId: string): Promise<MapTilerFeature | null> {
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(featureId)}.json?key=${MAPTILER_API_KEY}&language=pl`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data: MapTilerGeocodingResponse = await response.json();
  return data.features?.[0] ?? null;
}

export async function fetchFeaturePolygon(featureId: string): Promise<GeoJSON.Feature | null> {
  const feature = await fetchFeatureById(featureId);
  if (!feature) return null;
  if (!["Polygon", "MultiPolygon"].includes(feature.geometry.type)) return null;
  return { type: "Feature", properties: {}, geometry: feature.geometry };
}
