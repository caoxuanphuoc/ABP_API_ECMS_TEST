using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Teachers;
using EMS.Users.Dto;
using System;

namespace EMS.Teachers.Dto
{
    [AutoMapFrom(typeof(Teacher))]
    public class TeacherDto : EntityDto<long>
    {
        public UserDto User { get; set; }
        public string SchoolName { get; set; }
        public string Certificate { get; set; }
        public long Wage { get; set; }
        public DateTime StartTime { get; set; }
    }
}
