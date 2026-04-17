using System.Text.Json;
using LostNFound.Api.Configuration;
using Microsoft.Extensions.Options;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace LostNFound.Api.Services;

public class MapTilerService(HttpClient httpClient, IOptions<MapTilerOptions> options, ILogger<MapTilerService> logger)
    : IMapTilerService
{
    private static readonly GeoJsonReader GeoJsonReader = new();

    public async Task<Geometry?> FetchPolygonAsync(string featureId)
    {
        var apiKey = options.Value.ApiKey;
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            logger.LogWarning("MapTiler API key is not configured. Location filter will be skipped.");
            return null;
        }

        var url = $"https://api.maptiler.com/geocoding/{Uri.EscapeDataString(featureId)}.json?key={apiKey}";

        try
        {
            var response = await httpClient.GetStringAsync(url);
            using var doc = JsonDocument.Parse(response);

            if (!doc.RootElement.TryGetProperty("features", out var features) ||
                features.GetArrayLength() == 0)
            {
                logger.LogWarning("MapTiler returned no features for featureId {FeatureId}", featureId);
                return null;
            }

            var firstFeature = features[0];

            if (!firstFeature.TryGetProperty("geometry", out var geometryElement))
            {
                logger.LogWarning("MapTiler feature {FeatureId} has no geometry", featureId);
                return null;
            }

            var geometryJson = geometryElement.GetRawText();
            var geometry = GeoJsonReader.Read<Geometry>(geometryJson);

            if (geometry == null)
            {
                logger.LogWarning("Could not parse geometry for MapTiler feature {FeatureId}", featureId);
                return null;
            }

            if (geometry.GeometryType is not ("Polygon" or "MultiPolygon"))
            {
                logger.LogWarning("MapTiler feature {FeatureId} geometry is {Type}, not a polygon", featureId, geometry.GeometryType);
                return null;
            }

            geometry.SRID = 4326;
            return geometry;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch polygon from MapTiler for feature {FeatureId}", featureId);
            return null;
        }
    }
}
