using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                TRUNCATE TABLE "AspNetUsers", "Categories" CASCADE;
                """);

            migrationBuilder.Sql("""
                
                ALTER TABLE "Items"
                ALTER COLUMN "CreatedByUserId" DROP DEFAULT;
                
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
