using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using EMS.UserClasses.Dto;
using System;

namespace EMS.Schedules.Dto
{
    [AutoMapFrom(typeof(Schedule))]
    public class ScheduleDto : EntityDto<long>
    {
        public RoomDto Room { get; set; }
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; }
        public string Shift { get; set; }
    }
}
