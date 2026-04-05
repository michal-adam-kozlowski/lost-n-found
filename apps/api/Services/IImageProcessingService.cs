namespace LostNFound.Api.Services;

/// <summary>
/// Handles server-side image transformations (thumbnails, blur placeholders).
/// </summary>
public interface IImageProcessingService
{
    /// <summary>
    /// Generates a WebP thumbnail constrained to <paramref name="maxHeight"/> pixels height,
    /// preserving the aspect ratio.
    /// </summary>
    /// <returns>A MemoryStream containing the WebP-encoded thumbnail.</returns>
    Task<Stream> GenerateThumbnailAsync(Stream original, int maxHeight, int quality, CancellationToken ct = default);

    /// <summary>
    /// Generates a tiny (≤ <paramref name="maxDimension"/> × <paramref name="maxDimension"/>)
    /// WebP image and returns it as a <c>data:image/webp;base64,…</c> URL suitable for inline embedding.
    /// </summary>
    Task<string> GenerateBlurDataUrlAsync(Stream original, int maxDimension, int quality, CancellationToken ct = default);
}
