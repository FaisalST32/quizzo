using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class ResponseTimes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_QuizRooms_QuizRoomId",
                table: "Questions");

            migrationBuilder.AddColumn<long>(
                name: "ResponseTime",
                table: "Responses",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<Guid>(
                name: "QuizRoomId",
                table: "Questions",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_QuizRooms_QuizRoomId",
                table: "Questions",
                column: "QuizRoomId",
                principalTable: "QuizRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_QuizRooms_QuizRoomId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "ResponseTime",
                table: "Responses");

            migrationBuilder.AlterColumn<Guid>(
                name: "QuizRoomId",
                table: "Questions",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_QuizRooms_QuizRoomId",
                table: "Questions",
                column: "QuizRoomId",
                principalTable: "QuizRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
