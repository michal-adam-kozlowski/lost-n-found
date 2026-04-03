using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LostNFound.Api.Migrations
{
    /// <inheritdoc />
    public partial class CleanItemImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "ItemImages";
                """);


            migrationBuilder.DropForeignKey(
                name: "FK_ItemImages_AspNetUsers_UploadedByUserId",
                table: "ItemImages");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "ItemImages");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "ItemImages");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "ItemImages");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "ItemImages");

            migrationBuilder.AlterColumn<Guid>(
                name: "UploadedByUserId",
                table: "ItemImages",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemImages_AspNetUsers_UploadedByUserId",
                table: "ItemImages",
                column: "UploadedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemImages_AspNetUsers_UploadedByUserId",
                table: "ItemImages");

            migrationBuilder.AlterColumn<Guid>(
                name: "UploadedByUserId",
                table: "ItemImages",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "ItemImages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "ItemImages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "ItemImages",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "ItemImages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemImages_AspNetUsers_UploadedByUserId",
                table: "ItemImages",
                column: "UploadedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
