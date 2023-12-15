using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Schedules.Dto
{
    [AutoMapTo(typeof(Schedule))]
    public class UpdateScheduleDto : EntityDto<long>
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public DayOfTheWeek DayOfWeek { get; set; }
        [Required]
        public Shift Shift { get; set; }
    }
}
