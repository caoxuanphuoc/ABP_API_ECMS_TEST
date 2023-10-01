using Abp.Domain.Entities.Auditing;
using EMS.Authorization.UserClasses;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Positions
{
    [Table("AbpPosition")]
    public class Position : FullAuditedEntity<long>
    {
        public string PositionName { get; set; }
        public ICollection<UserClass> UserClasses { get; set; }
    }
}
