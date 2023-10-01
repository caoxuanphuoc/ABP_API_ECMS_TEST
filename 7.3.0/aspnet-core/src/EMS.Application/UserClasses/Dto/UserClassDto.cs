using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Positions;
using EMS.Authorization.UserClasses;
using EMS.Classes.Dto;
using EMS.Positions.dto;
using EMS.Users.Dto;
using System;

namespace EMS.UserClasses.Dto
{
    [AutoMapFrom(typeof(UserClass))]
    public class UserClassDto : EntityDto<long>
    {
        public UserDto User { get; set; }
        public ClassDto Class { get; set; }
        public PositionDto Position { get; set; }
        public int OffTimes { get; set; }
        public DateTime DateStart { get; set; }
        public bool IsActive { get; set; }
    }
}
