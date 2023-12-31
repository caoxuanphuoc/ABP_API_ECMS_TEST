﻿using Abp.Domain.Entities.Auditing;
using EMS.Authorization.Classes;
using EMS.Authorization.Positions;
using EMS.Authorization.TrackingClasses;
using EMS.Authorization.TuitionFees;
using EMS.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EMS.Authorization.UserClasses
{
    [Table("AbpUserClass")]
    public class UserClass : FullAuditedEntity<long>
    {
        public bool IsActive { get; set; }
        public int OffTimes { get; set; }
        public DateTime DateStart { get; set; }
        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }
        [ForeignKey("Class")]
        public long ClassId { get; set; }
        public Class Class { get; set; }
        [ForeignKey("Position")]
        public long PositionId { get; set; }
        public Position Position { get; set; }
        public ICollection<TuitionFee> TuitionFees { get; set; }
        public ICollection<TrackingClass> TrackingClasses { get; set; }
    }
}
