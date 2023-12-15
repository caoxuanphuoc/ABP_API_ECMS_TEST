using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EMS.Classes.Dto;
using EMS.Schedules.Dto;
using System;

namespace EMS.ClassTimelines.Dto
{
    [AutoMapFrom(typeof(ClassTimeline))]
    public class ClassTimelineDto : EntityDto<long>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ClassDto Class { get; set; }
        public ScheduleDto Schedule { get; set; }
    }
}
