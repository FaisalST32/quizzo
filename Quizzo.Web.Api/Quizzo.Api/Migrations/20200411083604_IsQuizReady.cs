using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class IsQuizReady : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsReady",
                table: "QuizRooms",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReady",
                table: "QuizRooms");
        }
    }
}
