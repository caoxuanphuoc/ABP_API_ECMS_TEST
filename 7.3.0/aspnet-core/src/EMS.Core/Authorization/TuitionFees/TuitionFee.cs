using Abp.Domain.Entities.Auditing;
using EMS.Authorization.UserClasses;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.TuitionFees
{
    [Table("AbpTuitionFee")]
    public class TuitionFee : FullAuditedEntity<long>
    {
        public long Fee { get; set; }
        public DateTime DatePayment { get; set; }
        [ForeignKey("UserClass")]
        public long StudentId { get; set; }
        public UserClass UserClass { get; set; }
    }
}
