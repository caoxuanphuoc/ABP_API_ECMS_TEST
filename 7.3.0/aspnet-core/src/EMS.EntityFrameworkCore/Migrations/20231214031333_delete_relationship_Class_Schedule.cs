using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Migrations
{
    public partial class delete_relationship_Class_Schedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule");

            migrationBuilder.DropIndex(
                name: "IX_AbpSchedule_ClassId",
                table: "AbpSchedule");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "AbpSchedule");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ClassId",
                table: "AbpSchedule",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpSchedule_ClassId",
                table: "AbpSchedule",
                column: "ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule",
                column: "ClassId",
                principalTable: "AbpClass",
                principalColumn: "Id");
        }
    }
}
