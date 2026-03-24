import type { Map as MapType } from "maplibre-gl";

function replaceLanguageInExpression(expr: unknown, lang: string): unknown {
  if (typeof expr === "string") {
    return expr
      .replace(/\{name:latin}/g, `{name:${lang}}`)
      .replace(/\{name:en}/g, `{name:${lang}}`)
      .replace(/\{name}/g, `{name:${lang}}`);
  }

  if (!Array.isArray(expr)) return expr;

  if (expr[0] === "get" && typeof expr[1] === "string") {
    if (["name:en", "name:latin", "name_en", "name_int"].includes(expr[1])) {
      return ["get", `name:${lang}`];
    }
    if (expr[1] === "name") {
      return ["coalesce", ["get", `name:${lang}`], ["get", "name"]];
    }
  }

  return expr.map((item) => replaceLanguageInExpression(item, lang));
}

export function setMapLanguage(map: MapType, language: string) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type !== "symbol") continue;
    const textField = layer.layout?.["text-field"];
    if (!textField) continue;
    map.setLayoutProperty(layer.id, "text-field", replaceLanguageInExpression(textField, language));
  }
}
