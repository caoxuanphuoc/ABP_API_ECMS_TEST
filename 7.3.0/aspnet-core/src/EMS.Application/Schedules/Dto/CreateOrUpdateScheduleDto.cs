using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Authorization.Schedules;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.Schedules.Dto
{
    [AutoMapTo(typeof(Schedule))]
    public class CreateOrUpdateScheduleDto : EntityDto<long>
    {
        [Required]
        public long ClassId { get; set; }
        [Required]
        public long WorkShiftId { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}
