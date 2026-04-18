import type { LineLayerSpecification, FillLayerSpecification, CircleLayerSpecification } from "maplibre-gl";

export const regionOverlayFillLayer: FillLayerSpecification = {
  id: "region-overlay-fill",
  type: "fill",
  source: "region-overlay",
  paint: {
    "fill-color": "#000000",
    "fill-opacity": 0.4,
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
  filter: ["in", ["geometry-type"], ["literal", ["LineString", "MultiLineString", "Polygon", "MultiPolygon"]]],
  paint: {
    "line-color": "#228be6",
    "line-width": 3,
    "line-dasharray": [3, 1],
    "line-opacity": 0.8,
  },
};

export const fillLayer: FillLayerSpecification = {
  id: "geocoder-boundary-fill",
  type: "fill",
  source: "geocoder-boundary",
  filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
  paint: {
    "fill-color": "#228be6",
    "fill-opacity": 0.05,
  },
};

export const circleLayer: CircleLayerSpecification = {
  id: "geocoder-boundary-circle",
  type: "circle",
  source: "geocoder-boundary",
  filter: ["in", ["geometry-type"], ["literal", ["Point", "MultiPoint"]]],
  paint: {
    "circle-color": "#228be6",
    "circle-radius": 8,
    "circle-opacity": 0.8,
    "circle-stroke-color": "#228be6",
    "circle-stroke-width": 2,
  },
};
