using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Courses;
using EMS.Authorization.UserClasses;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Classes
{
    [Table("AbpClass")]
    public class Class : FullAuditedEntity<long>
    {
        public string Code { get; set; }
        //public DateTime StartDate { get; set; }
        //public DateTime EndDate { get; set; }
        public long LimitStudent { get; set; }
        public long CurrentStudent { get; set; }
        public int LessionTimes { get; set; } // Số buổi học
        public bool IsActive { get; set; }
        [ForeignKey("Course")]
        public long CourseId { get; set; }
        public Course Course { get; set; }
        //public ICollection<Schedule> Schedules { get; set; }
        public ICollection<UserClass> UserClasses { get; set; }
    }
}
