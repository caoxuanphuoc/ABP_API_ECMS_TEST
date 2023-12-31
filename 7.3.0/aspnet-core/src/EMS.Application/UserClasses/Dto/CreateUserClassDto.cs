﻿using Abp.AutoMapper;
using EMS.Authorization.UserClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMS.UserClasses.Dto
{
    [AutoMapTo(typeof(UserClass))]
    public class CreateUserClassDto
    {
        [Required]
        public long UserId { get; set; }
        [Required]
        public long ClassId { get; set; }
        [Required]
        public long PositionId { get; set; }
        [Required]
        public int OffTimes { get; set; }
        [Required]
        public DateTime DateStart { get; set; }
        [Required]
        public bool IsActive { get; set; }

    }
}
