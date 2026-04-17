import type { LineLayerSpecification, FillLayerSpecification } from "maplibre-gl";

export const regionOverlayFillLayer: FillLayerSpecification = {
  id: "region-overlay-fill",
  type: "fill",
  source: "region-overlay",
  paint: {
    "fill-color": "#000000",
    "fill-opacity": 0.3,
  },
};

export const regionOverlayLineLayer: LineLayerSpecification = {
  id: "region-overlay-line",
  type: "line",
  source: "region-overlay",
  paint: {
    "line-color": "#000000",
    "line-width": 2,
    "line-dasharray": [3, 2],
    "line-opacity": 0.8,
  },
};

export const dashedLineLayer: LineLayerSpecification = {
  id: "geocoder-boundary-line",
  type: "line",
  source: "geocoder-boundary",
  paint: {
    "line-color": "#228be6",
    "line-width": 2,
    "line-dasharray": [3, 2],
    "line-opacity": 0.8,
  },
};

export const fillLayer: FillLayerSpecification = {
  id: "geocoder-boundary-fill",
  type: "fill",
  source: "geocoder-boundary",
  paint: {
    "fill-color": "#228be6",
    "fill-opacity": 0.05,
  },
};
