using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace LostNFound.Api.Services;

public class ImageProcessingService : IImageProcessingService
{
    public async Task<Stream> GenerateThumbnailAsync(Stream original, int maxHeight, int quality, CancellationToken ct = default)
    {
        original.Position = 0;
        using var image = await Image.LoadAsync(original, ct);

        if (image.Height > maxHeight)
        {
            var ratio = (double)maxHeight / image.Height;
            var newWidth = (int)Math.Round(image.Width * ratio);
            image.Mutate(x => x.Resize(newWidth, maxHeight));
        }

        var ms = new MemoryStream();
        var encoder = new WebpEncoder { Quality = quality };
        await image.SaveAsync(ms, encoder, ct);
        ms.Position = 0;
        return ms;
    }

    public async Task<string> GenerateBlurDataUrlAsync(Stream original, int maxDimension, int quality, CancellationToken ct = default)
    {
        original.Position = 0;
        using var image = await Image.LoadAsync(original, ct);

        var largestSide = Math.Max(image.Width, image.Height);
        if (largestSide > maxDimension)
        {
            var ratio = (double)maxDimension / largestSide;
            var newWidth = Math.Max(1, (int)Math.Round(image.Width * ratio));
            var newHeight = Math.Max(1, (int)Math.Round(image.Height * ratio));
            image.Mutate(x => x.Resize(newWidth, newHeight));
        }

        using var ms = new MemoryStream();
        var encoder = new WebpEncoder { Quality = quality };
        await image.SaveAsync(ms, encoder, ct);

        var base64 = Convert.ToBase64String(ms.ToArray());
        return $"data:image/webp;base64,{base64}";
    }
}
