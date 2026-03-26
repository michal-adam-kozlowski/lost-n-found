using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class RequireCreatedByUserOnItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                
                DELETE FROM "Items";
                DELETE FROM "Categories";
                
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByUserId",
                table: "Items",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByUserId",
                table: "Items",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }
    }
}
