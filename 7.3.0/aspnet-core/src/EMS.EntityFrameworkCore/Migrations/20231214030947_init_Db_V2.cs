using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Migrations
{
    public partial class init_Db_V2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "AbpClass");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "AbpClass");

            migrationBuilder.AlterColumn<long>(
                name: "ClassId",
                table: "AbpSchedule",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateTable(
                name: "AbpClassTimeline",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClassId = table.Column<long>(type: "bigint", nullable: false),
                    ScheduleId = table.Column<long>(type: "bigint", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpClassTimeline", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpClassTimeline_AbpClass_ClassId",
                        column: x => x.ClassId,
                        principalTable: "AbpClass",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AbpClassTimeline_AbpSchedule_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "AbpSchedule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AbpClassTimeline_ClassId",
                table: "AbpClassTimeline",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpClassTimeline_ScheduleId",
                table: "AbpClassTimeline",
                column: "ScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule",
                column: "ClassId",
                principalTable: "AbpClass",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule");

            migrationBuilder.DropTable(
                name: "AbpClassTimeline");

            migrationBuilder.AlterColumn<long>(
                name: "ClassId",
                table: "AbpSchedule",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "AbpClass",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "AbpClass",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_AbpSchedule_AbpClass_ClassId",
                table: "AbpSchedule",
                column: "ClassId",
                principalTable: "AbpClass",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
