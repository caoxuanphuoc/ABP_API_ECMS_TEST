using Abp.Domain.Entities.Auditing;
using EMS.Authorization.UserClasses;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.TrackingClasses
{
    [Table("AbpTrackingClass")]
    public class TrackingClass : FullAuditedEntity<long>
    {
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }
        [ForeignKey("UserClass")]
        public long StudentId { get; set; }
        public UserClass UserClass { get; set; }
    }
}
