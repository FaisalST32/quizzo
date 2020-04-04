using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class QuizStartStop : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAtUtc",
                table: "QuizRooms",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StoppedAtUtc",
                table: "QuizRooms",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartedAtUtc",
                table: "QuizRooms");

            migrationBuilder.DropColumn(
                name: "StoppedAtUtc",
                table: "QuizRooms");
        }
    }
}
