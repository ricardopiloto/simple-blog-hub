using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Migrations
{
    /// <inheritdoc />
    [Migration("20260615120000_AddCloudflareCredentialsToAuthor")]
    public partial class AddCloudflareCredentialsToAuthor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CloudflareAccountId",
                table: "Authors",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CloudflareApiTokenEncrypted",
                table: "Authors",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CloudflareAccountId",
                table: "Authors");

            migrationBuilder.DropColumn(
                name: "CloudflareApiTokenEncrypted",
                table: "Authors");
        }
    }
}
