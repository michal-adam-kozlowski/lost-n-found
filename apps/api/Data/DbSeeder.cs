using LostNFound.Api.Models;
using Microsoft.AspNetCore.Identity;
using NetTopologySuite.Geometries;

namespace LostNFound.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        string seedEmail = "qwe@qw.pl";
        string seedPassword = "qwerty";

        var seedUser = await userManager.FindByEmailAsync(seedEmail);
        if (seedUser is null)
        {
            seedUser = new ApplicationUser
            {
                Id = new Guid("10000000-0000-0000-0000-000000000000"),
                Email = seedEmail,
                UserName = seedEmail
            };
            var result = await userManager.CreateAsync(seedUser, seedPassword);
            if (!result.Succeeded)
            {
                throw new Exception("Failed to create seed user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }


        if (db.Categories.Any()) return;

        var electronics = new Category { Name = "electronics" };
        var keys = new Category { Name = "keys" };
        var bags = new Category { Name = "bags" };
        var clothingAndAccessories = new Category { Name = "clothing_and_accessories" };
        var vehiclesAndSport = new Category { Name = "vehicles_and_sport" };
        var childItems = new Category { Name = "child_items" };
        var other = new Category { Name = "other" };

        db.Categories.AddRange(
            electronics,
            keys,
            bags,
            clothingAndAccessories,
            vehiclesAndSport,
            childItems,
            other
        );


        db.Items.AddRange(
            new Item
            {
                CreatedByUser = seedUser,
                Title = "Blue Backpack",
                Category = bags,
                Type = "lost",
                Description = "Left near the main library entrance on Monday morning.",
                Location = new Point(21.0122, 52.2297) { SRID = 4326 },
                OccurredAt = new DateTime(2026, 2, 10, 4, 3, 1, DateTimeKind.Utc),
                CreatedAt = new DateTime(2026, 2, 10, 5, 0, 0, DateTimeKind.Utc)

            },
            new Item
            {
                CreatedByUser = seedUser,
                Title = "House Keys",
                Category = keys,
                Type = "found",
                Description = "Found on a bench in the canteen. Has a small red key-ring.",
                Location = new Point(21.0118, 52.2300) { SRID = 4326 },
                OccurredAt = new DateTime(2025, 6, 10, 12, 30, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2025, 6, 10, 13, 0, 0, DateTimeKind.Utc)
            },
            new Item
            {
                CreatedByUser = seedUser,
                Title = "Red Umbrella",
                Category = clothingAndAccessories,
                Type = "lost",
                Description = "Left outside building A after the rain on Tuesday.",
                OccurredAt = new DateTime(2025, 12, 10, 12, 30, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2025, 12, 10, 13, 0, 0, DateTimeKind.Utc)  
            }
        );

        await db.SaveChangesAsync();
    }
}
