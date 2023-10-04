using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Rooms;
using EMS.Authorization.Schedules;
using EMS.Classes.Dto;
using EMS.UserClasses.Dto;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Schedules.Dto
{
    [AutoMapFrom(typeof(Schedule))]
    public class ScheduleDto : EntityDto<long>
    {
        public ClassDto Class { get; set; }
        public RoomDto Room { get; set; }
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; }
        public string Shift { get; set; }
    }
}
