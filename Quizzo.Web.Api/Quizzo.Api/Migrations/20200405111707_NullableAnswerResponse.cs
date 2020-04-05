using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class NullableAnswerResponse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Responses_Answers_AnswerId",
                table: "Responses");

            migrationBuilder.AlterColumn<Guid>(
                name: "AnswerId",
                table: "Responses",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Responses_Answers_AnswerId",
                table: "Responses",
                column: "AnswerId",
                principalTable: "Answers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Responses_Answers_AnswerId",
                table: "Responses");

            migrationBuilder.AlterColumn<Guid>(
                name: "AnswerId",
                table: "Responses",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Responses_Answers_AnswerId",
                table: "Responses",
                column: "AnswerId",
                principalTable: "Answers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
