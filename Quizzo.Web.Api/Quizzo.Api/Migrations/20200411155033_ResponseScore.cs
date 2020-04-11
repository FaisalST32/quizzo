using Microsoft.EntityFrameworkCore.Migrations;

namespace Quizzo.Api.Migrations
{
    public partial class ResponseScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "Responses",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "Responses");
        }
    }
}
