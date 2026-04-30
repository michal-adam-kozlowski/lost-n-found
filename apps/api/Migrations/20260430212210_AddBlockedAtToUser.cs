using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBlockedAtToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BlockedAt",
                table: "AspNetUsers",
                type: "timestamptz",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlockedAt",
                table: "AspNetUsers");
        }
    }
}
