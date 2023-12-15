﻿using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;
using System.ComponentModel.DataAnnotations;

namespace EMS.ClassTimelines.Dto
{
    [AutoMapTo(typeof(ClassTimeline))]
    public class UpdateClassTimelineDto : EntityDto<long>
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public long ClassId { get; set; }
        [Required]
        public long ScheduleId { get; set; }
    }
}
