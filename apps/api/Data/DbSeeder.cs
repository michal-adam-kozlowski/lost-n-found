using LostNFound.Api.Models;

namespace LostNFound.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (db.Items.Any()) return;

        db.Items.AddRange(
            new Item
            {
                Title = "Blue Backpack",
                Type = "lost",
                Description = "Left near the main library entrance on Monday morning.",
                Latitude = 52.2297m,
                Longitude = 21.0122m,
            },
            new Item
            {
                Title = "House Keys",
                Type = "found",
                Description = "Found on a bench in the canteen. Has a small red key-ring.",
                Latitude = 52.2300m,
                Longitude = 21.0118m,
            },
            new Item
            {
                Title = "Red Umbrella",
                Type = "lost",
                Description = "Left outside building A after the rain on Tuesday.",
            }
        );

        await db.SaveChangesAsync();
    }
}
