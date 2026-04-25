using NetTopologySuite.Geometries;

namespace LostNFound.Api.Services;

public interface IMapTilerService
{
    /// <summary>
    /// Fetches the polygon boundary for a MapTiler geocoding feature ID.
    /// Returns null if no polygon geometry is available.
    /// </summary>
    Task<Geometry?> FetchPolygonAsync(string featureId);
}
