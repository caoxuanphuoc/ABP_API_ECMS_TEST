using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.UserClasses;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.UserClasses.Dto
{
    [AutoMapTo(typeof(UserClass))]
    public class CreateOrUpdateUserClassDto : EntityDto<long>
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
