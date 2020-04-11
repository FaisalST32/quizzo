using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class AdminCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminCode",
                table: "QuizRooms",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rank",
                table: "Participants",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Participants",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminCode",
                table: "QuizRooms");

            migrationBuilder.DropColumn(
                name: "Rank",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "Participants");
        }
    }
}
