using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddItemChatCountToChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemChatCount",
                table: "Chats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Chats_ItemId_ItemChatCount",
                table: "Chats",
                columns: new[] { "ItemId", "ItemChatCount" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Chats_ItemId_ItemChatCount",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "ItemChatCount",
                table: "Chats");
        }
    }
}
