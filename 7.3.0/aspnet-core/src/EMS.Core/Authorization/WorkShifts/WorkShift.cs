using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Schedules;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.WorkShifts
{
    [Table("AbpWorkShift")]
    public class WorkShift : FullAuditedEntity<long>
    {
        public string Code { get; set; }
        public DateTime TimeStart { get; set; }
        public DateTime TimeEnd { get; set; }
        public ICollection<Schedule> Schedules { get; set; }
    }
}
