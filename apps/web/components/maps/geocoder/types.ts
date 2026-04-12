export interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
}

export interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  district?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  addresstype?: string;
  boundingbox?: [string, string, string, string];
  geojson?: GeoJSON.Geometry;
  place_rank?: number;
  address?: NominatimAddress;
}

export interface GeocoderControlProps {
  onLocationSelect?: (location: SelectedLocation) => void;
}
