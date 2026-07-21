using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeScreener.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecruiterAndHireTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecruiterId",
                table: "Jobs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HiredAt",
                table: "Applications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Jobs_RecruiterId",
                table: "Jobs",
                column: "RecruiterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Users_RecruiterId",
                table: "Jobs",
                column: "RecruiterId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Users_RecruiterId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_RecruiterId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "RecruiterId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "HiredAt",
                table: "Applications");
        }
    }
}
