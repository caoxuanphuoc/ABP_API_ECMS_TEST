using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Migrations
{
    public partial class update_Schedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpSchedule_AbpWorkShift_WorkShiftId",
                table: "AbpSchedule");

            migrationBuilder.DropTable(
                name: "AbpWorkShift");

            migrationBuilder.DropIndex(
                name: "IX_AbpSchedule_WorkShiftId",
                table: "AbpSchedule");

            migrationBuilder.DropColumn(
                name: "WorkShiftId",
                table: "AbpSchedule");

            migrationBuilder.AddColumn<int>(
                name: "DayOfWeek",
                table: "AbpSchedule",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Shift",
                table: "AbpSchedule",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DayOfWeek",
                table: "AbpSchedule");

            migrationBuilder.DropColumn(
                name: "Shift",
                table: "AbpSchedule");

            migrationBuilder.AddColumn<long>(
                name: "WorkShiftId",
                table: "AbpSchedule",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "AbpWorkShift",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    DateOfWeek = table.Column<int>(type: "int", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    TimeEnd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeStart = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpWorkShift", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AbpSchedule_WorkShiftId",
                table: "AbpSchedule",
                column: "WorkShiftId");

            migrationBuilder.AddForeignKey(
                name: "FK_AbpSchedule_AbpWorkShift_WorkShiftId",
                table: "AbpSchedule",
                column: "WorkShiftId",
                principalTable: "AbpWorkShift",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
