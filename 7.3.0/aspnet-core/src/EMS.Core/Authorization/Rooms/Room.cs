using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Schedules;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.Rooms
{
    [Table("AbpRoom")]
    public class Room : FullAuditedEntity<long>
    {
        public string RoomName { get; set; }
        public int MaxContainer { get; set;}
        public ICollection<Schedule> Schedules { get; set; }
    }
}
