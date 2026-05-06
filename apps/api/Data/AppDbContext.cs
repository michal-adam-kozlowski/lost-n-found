using LostNFound.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace LostNFound.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemImage> ItemImages => Set<ItemImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("postgis");

        modelBuilder.Entity<Category>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).IsRequired();

        });

        modelBuilder.Entity<Item>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).IsRequired();
            e.Property(x => x.Type).IsRequired();
            e.Property(x => x.CreatedAt).HasColumnType("timestamptz");
            e.Property(x => x.OccurredAt).HasColumnType("date");
            e.Property(x => x.Location).HasColumnType("geometry(Point, 4326)"); //using geometry as the data is geographically compact. TODO: Check if projection is needed 

            e.HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => x.CreatedByUserId);
            e.HasIndex(x => x.CategoryId);
            e.HasIndex(x => x.Location).HasMethod("GIST");
        });

        modelBuilder.Entity<ItemImage>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.ObjectKey).IsRequired();
            e.Property(x => x.StorageBucket).IsRequired();
            e.Property(x => x.OriginalFileName).IsRequired().HasMaxLength(255);
            e.Property(x => x.MimeType).IsRequired().HasMaxLength(100);
            e.Property(x => x.CreatedAt).HasColumnType("timestamptz");

            e.Property(x => x.UploadStatus)
                .HasConversion<string>()
                .HasMaxLength(20);

            e.HasOne(x => x.Item)
                .WithMany()
                .HasForeignKey(x => x.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.UploadedBy)
                .WithMany()
                .HasForeignKey(x => x.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => new { x.ItemId, x.UploadStatus });
            e.HasIndex(x => x.UploadedByUserId);
        });

        modelBuilder.Entity<ApplicationUser>(e =>
        {
            e.Property(x => x.BlockedAt).HasColumnType("timestamptz");
        });

        modelBuilder.Entity<Chat>(e =>
        {
            e.HasKey(x => x.Id);

            e.Property(x => x.CreatedAt).HasColumnType("timestamptz");
            e.Property(x => x.LastMessageAt).HasColumnType("timestamptz");

            e.HasOne(x => x.Item)
                .WithMany()
                .HasForeignKey(x => x.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.ItemOwner)
                .WithMany()
                .HasForeignKey(x => x.ItemOwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Inquirer)
                .WithMany()
                .HasForeignKey(x => x.InquirerId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => new { x.ItemId, x.InquirerId })
                .IsUnique();

            e.HasIndex(x => new { x.ItemOwnerId, x.LastMessageAt });
            e.HasIndex(x => new { x.InquirerId, x.LastMessageAt });
        });

        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasKey(x => x.Id);

            e.Property(x => x.Body)
                .IsRequired()
                .HasMaxLength(2000);

            e.Property(x => x.CreatedAt).HasColumnType("timestamptz");

            e.HasOne(x => x.Chat)
                .WithMany(x => x.Messages)
                .HasForeignKey(x => x.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Sender)
                .WithMany()
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => new { x.ChatId, x.CreatedAt, x.Id });
        });



    }
}
