using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.Authorization.Rooms
{
    [Table("Room")]
    public class Room :  FullAuditedEntity<int>
    {
        public string RoomName { get; set; }
        public int MaxContainer { get; set;}
    }
}
