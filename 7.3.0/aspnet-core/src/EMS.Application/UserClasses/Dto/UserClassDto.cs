using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.UserClasses;
using EMS.Users.Dto;
using System;

namespace EMS.UserClasses.Dto
{
    [AutoMapFrom(typeof(UserClass))]
    public class UserClassDto : EntityDto<long>
    {
        public UserDto User { get; set; }
        public DateTime OffTimes { get; set; }
        public DateTime DateStart { get; set; }
        public bool IsActive { get; set; }
    }
}
