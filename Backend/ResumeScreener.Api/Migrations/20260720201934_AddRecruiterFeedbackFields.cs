using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeScreener.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecruiterFeedbackFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "InterviewFeedbacks",
                newName: "Strengths");

            migrationBuilder.AddColumn<string>(
                name: "RecruiterNotes",
                table: "Interviews",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Concerns",
                table: "InterviewFeedbacks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivateNotes",
                table: "InterviewFeedbacks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recommendation",
                table: "InterviewFeedbacks",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SubmittedByUserId",
                table: "InterviewFeedbacks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InterviewInterviewers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InterviewId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterviewInterviewers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InterviewInterviewers_Interviews_InterviewId",
                        column: x => x.InterviewId,
                        principalTable: "Interviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterviewInterviewers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InterviewFeedbacks_SubmittedByUserId",
                table: "InterviewFeedbacks",
                column: "SubmittedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_InterviewInterviewers_InterviewId",
                table: "InterviewInterviewers",
                column: "InterviewId");

            migrationBuilder.CreateIndex(
                name: "IX_InterviewInterviewers_UserId",
                table: "InterviewInterviewers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_InterviewFeedbacks_Users_SubmittedByUserId",
                table: "InterviewFeedbacks",
                column: "SubmittedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InterviewFeedbacks_Users_SubmittedByUserId",
                table: "InterviewFeedbacks");

            migrationBuilder.DropTable(
                name: "InterviewInterviewers");

            migrationBuilder.DropIndex(
                name: "IX_InterviewFeedbacks_SubmittedByUserId",
                table: "InterviewFeedbacks");

            migrationBuilder.DropColumn(
                name: "RecruiterNotes",
                table: "Interviews");

            migrationBuilder.DropColumn(
                name: "Concerns",
                table: "InterviewFeedbacks");

            migrationBuilder.DropColumn(
                name: "PrivateNotes",
                table: "InterviewFeedbacks");

            migrationBuilder.DropColumn(
                name: "Recommendation",
                table: "InterviewFeedbacks");

            migrationBuilder.DropColumn(
                name: "SubmittedByUserId",
                table: "InterviewFeedbacks");

            migrationBuilder.RenameColumn(
                name: "Strengths",
                table: "InterviewFeedbacks",
                newName: "Notes");
        }
    }
}
