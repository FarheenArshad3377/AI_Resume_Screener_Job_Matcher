using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeScreener.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExperienceLevelToJob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExperienceLevel",
                table: "Jobs",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExperienceLevel",
                table: "Jobs");
        }
    }
}
