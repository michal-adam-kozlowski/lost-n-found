export interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

export interface MapTilerContext {
  id: string;
  text: string;
  short_code?: string;
}

export interface MapTilerFeature {
  id: string;
  type: "Feature";
  text: string;
  place_name: string;
  place_type: string[];
  relevance: number;
  center: [number, number]; // [lon, lat]
  bbox?: [number, number, number, number]; // [west, south, east, north]
  geometry: GeoJSON.Geometry;
  context?: MapTilerContext[];
  properties?: Record<string, unknown>;
}

export interface MapTilerGeocodingResponse {
  type: "FeatureCollection";
  features: MapTilerFeature[];
}

export interface ExternalLocation {
  id: string;
  name: string;
}
