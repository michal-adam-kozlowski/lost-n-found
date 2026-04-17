import type { MapTilerFeature } from "./types";

const ADMINISTRATIVE_PREFIXES = new Set([
  "country",
  "region",
  "subregion",
  "county",
  "joint_municipality",
  "joint_submunicipality",
  "municipality",
  "municipal_district",
  "locality",
  "neighbourhood",
  "place",
]);

function isAdministrative(contextId: string): boolean {
  const prefix = contextId.split(".")[0];
  return ADMINISTRATIVE_PREFIXES.has(prefix);
}

export function getPlaceName(feature: MapTilerFeature): string {
  return feature.text || feature.place_name.split(",")[0].trim();
}

export function formatAddress(feature: MapTilerFeature): string {
  const placeName = getPlaceName(feature);
  const seen = new Set<string>();
  const contextParts: string[] = [];

  for (const c of feature.context ?? []) {
    if (!isAdministrative(c.id)) continue;
    if (!c.text || c.text === placeName || seen.has(c.text)) continue;
    seen.add(c.text);
    contextParts.push(c.text);
    if (contextParts.length === 3) break;
  }

  return contextParts.join(", ");
}

export function buildCutoutFeature(
  regionGeometry: GeoJSON.Geometry,
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> {
  const worldRing: GeoJSON.Position[] = [
    [-180, -90],
    [-180, 90],
    [180, 90],
    [180, -90],
    [-180, -90],
  ];

  if (regionGeometry.type !== "Polygon" && regionGeometry.type !== "MultiPolygon") {
    return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [worldRing] } };
  }

  if (regionGeometry.type === "Polygon") {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [worldRing, ...regionGeometry.coordinates],
      },
    };
  }

  const holes = (regionGeometry as GeoJSON.MultiPolygon).coordinates.flatMap((poly: GeoJSON.Position[][]) => poly);
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [worldRing, ...holes],
    },
  };
}
