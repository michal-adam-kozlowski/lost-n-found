using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddReadAtToChatMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "ChatMessages",
                type: "timestamptz",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "ChatMessages");
        }
    }
}
