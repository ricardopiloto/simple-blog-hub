using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Migrations
{
    /// <inheritdoc />
    public partial class AddScheduledPublishAtToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledPublishAt",
                table: "Posts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScheduledPublishAt",
                table: "Posts");
        }
    }
}
