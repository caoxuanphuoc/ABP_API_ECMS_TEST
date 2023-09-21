using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Courses;
using EMS.Authorization.Schedules;
using EMS.Authorization.UserClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Classes
{
    [Table("AbpClass")]
    public class Class : FullAuditedEntity<long>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long LimitStudent { get; set; }
        public long CurrentStudent { get; set; }
        public DateTime LessionTimes { get; set; }
        public DateTime CycleTimes { get; set; }
        public bool IsActive { get; set; }
        [ForeignKey("UserClass")]
        public long TeacherId { get; set; }
        public UserClass UserClass { get; set; }
        [ForeignKey("Course")]
        public long CourseId { get; set; }
        public Course Course { get; set; }
        public ICollection<Schedule> Schedules { get; set; }


    }
}
