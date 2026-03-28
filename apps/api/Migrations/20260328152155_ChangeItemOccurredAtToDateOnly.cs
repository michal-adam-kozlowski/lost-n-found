using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeItemOccurredAtToDateOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                
                DELETE FROM "Items";
                DELETE FROM "Categories";
                
                """);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "OccurredAt",
                table: "Items",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "OccurredAt",
                table: "Items",
                type: "timestamptz",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }
    }
}
