using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Classes;
using EMS.Authorization.Rooms;
using EMS.Authorization.WorkShifts;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Schedules
{
    [Table("AbpSchedule")]
    public class Schedule : FullAuditedEntity<long>
    {
        public DateTime Date { get; set; }
        [ForeignKey("Class")]
        public long ClassId { get; set; }
        public Class Class { get; set; }
        [ForeignKey("WorkShift")]
        public long WorkShiftId { get; set; }
        public WorkShift WorkShift { get; set; }
        [ForeignKey("Room")]
        public long RoomId { get; set; }
        public Room Room { get; set; }
    }
}
