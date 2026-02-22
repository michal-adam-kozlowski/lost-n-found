using LostNFound.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LostNFound.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).IsRequired();
            e.Property(x => x.Type).IsRequired();
            e.Property(x => x.CreatedAt).HasColumnType("timestamptz");
        });
    }
}
