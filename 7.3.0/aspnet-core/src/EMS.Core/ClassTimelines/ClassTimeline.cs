using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Classes;
using EMS.Authorization.Schedules;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.ClassTimelines
{
    [Table("AbpClassTimeline")]
    public class ClassTimeline : FullAuditedEntity<long>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [ForeignKey("Class")]
        public long ClassId { get; set; }
        public Class Class { get; set; }
        [ForeignKey("Schedule")]
        public long ScheduleId { get; set; }
        public Schedule Schedule { get; set; }
    }
}
