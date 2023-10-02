using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Teachers
{
    [Table("AbpTeacher")]
    public class Teacher : FullAuditedEntity<long>
    {
        public string SchoolName { get; set; }
        public string Certificate { get; set; }
        public long Wage { get; set; }
        public DateTime StartTime { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }
    }
}
