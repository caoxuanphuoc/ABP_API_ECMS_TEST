using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Classes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Courses
{
    [Table("AbpCourse")]
    public class Course : FullAuditedEntity<long>
    {
        public string CourseName { get; set; }
        public long CourseFee { get; set; }
        public long Quantity { get; set; }
        public ICollection<Class> Classes { get; set; }
    }
}
